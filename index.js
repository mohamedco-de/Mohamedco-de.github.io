// بوت واتساب: تحميل فيديوهات + أوامر صور وصوت وأدوات. ترسل رابط (تيك توك / انستا / تويتر / يوتيوب ...) والبوت يرسل الفيديو.
// الربط بكود (Pairing Code) بدون QR. التحميل: yt-dlp أولاً، ولو فشل يستخدم loader.to كاحتياط.
// تحميل ملف .env (PHONE=..., LOADER_API_KEY=...) بدون مكتبات
try {
  for (const line of require('fs').readFileSync(require('path').join(__dirname, '.env'), 'utf8').split('\n')) {
    const m = /^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/.exec(line);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch { /* no .env */ }

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');
const readline = require('readline');
const pino = require('pino');
const {
  default: makeWASocket, useMultiFileAuthState, DisconnectReason,
  fetchLatestBaileysVersion, Browsers, downloadMediaMessage, normalizeMessageContent,
} = require('@whiskeysockets/baileys');
const loader = require('./lib/loader');
const { removeBackground } = require('./lib/removebg');
const { uploadImage } = require('./lib/imghost');
const media = require('./lib/media');
const tools = require('./lib/tools');
const { UserError } = require('./lib/errors');

// ------------------------------------------------------------ الإعدادات
const PHONE = (process.env.PHONE || '').replace(/\D/g, '');   // رقمك بصيغة دولية بدون + (مثال 9665XXXXXXXX)
const MAX_MB = Number(process.env.MAX_MB) || 60;              // أكبر حجم نرسله
const VIDEO_LIMIT_MB = 15;                                    // فوق هذا يرسله كملف (document)
const MAX_SECONDS = Number(process.env.MAX_SECONDS) || 900;   // أطول فيديو (15 دقيقة)
const ALLOW_GROUPS = process.env.ALLOW_GROUPS === '1';        // يشتغل في القروبات؟ (افتراضي لا)
const YTDLP = process.env.YTDLP_PATH || 'yt-dlp';

const SITES = /(^|\.)(tiktok\.com|instagram\.com|twitter\.com|x\.com|fixupx\.com|vxtwitter\.com|fxtwitter\.com|youtube\.com|youtu\.be|facebook\.com|fb\.watch|reddit\.com|redd\.it|snapchat\.com|threads\.net|threads\.com|pinterest\.com|pin\.it|twitch\.tv|streamable\.com|vimeo\.com)$/i;

function pickUrl(text) {
  for (const m of String(text || '').matchAll(/https?:\/\/[^\s<>|]+/gi)) {
    const raw = m[0].replace(/[)\],.!?؟،]+$/, '');
    try {
      const u = new URL(raw);
      if (SITES.test(u.hostname)) return u.toString();
    } catch { /* ignore */ }
  }
  return null;
}

const textOf = (msg) => {
  const m = msg.message || {};
  return m.conversation || m.extendedTextMessage?.text
    || m.imageMessage?.caption || m.videoMessage?.caption || '';
};

// ------------------------------------------------------------ التحميل
function runYtdlp(url, dir) {
  const args = [
    '--no-playlist', '--no-warnings', '-q', '--no-progress', '--restrict-filenames',
    '--socket-timeout', '10', '--retries', '2',
    '--max-filesize', `${MAX_MB}M`,
    '--match-filter', `!is_live & duration<=?${MAX_SECONDS}`,
    '-f', 'b[ext=mp4][height<=720]/b[height<=720]/b',
    '-o', path.join(dir, '%(id)s.%(ext)s'),
    '--', url,
  ];
  return new Promise((resolve, reject) => {
    execFile(YTDLP, args, { timeout: 120000, maxBuffer: 20 * 1024 * 1024 }, (err, _out, stderr) => {
      if (err) { err.stderr = stderr; return reject(err); }
      const files = fs.readdirSync(dir).map((f) => path.join(dir, f)).filter((f) => !f.endsWith('.part'));
      const file = files.sort((a, b) => fs.statSync(b).size - fs.statSync(a).size)[0];
      file ? resolve(file) : reject(new Error('no file'));
    });
  });
}

async function fetchVideo(url, dir) {
  try {
    return await runYtdlp(url, dir);
  } catch (e) {
    console.warn('[yt-dlp]', (e.stderr || e.message || '').toString().split('\n')[0].slice(0, 200));
  }
  return loader.download(url, MAX_MB, dir); // احتياط
}

// سؤال في الكونسول
const ask = (q) => new Promise((resolve) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.question(q, (a) => { rl.close(); resolve(a.trim()); });
});
let phoneAsked = PHONE;

// ------------------------------------------------------------ الأوامر
// الأمر يبدأ بـ . أو ! أو /  مثال: .rmbg  .رفع  .احسب 5*3
const COMMANDS = {};
const def = (key, aliases) => aliases.forEach((a) => { COMMANDS[a.toLowerCase()] = key; });
def('rmbg', ['rmbg', 'removebg', 'bg', 'ازالة', 'إزالة', 'خلفية', 'ازالة_الخلفية']);
def('upload', ['upload', 'up', 'رفع', 'رابط']);
def('sticker', ['sticker', 's', 'ملصق', 'ستكر']);
def('toimg', ['toimg', 'لصورة', 'صورة']);
def('mp3', ['mp3', 'audio', 'صوت']);
def('play', ['play', 'song', 'اغنية', 'اغنيه', 'شغل']);
def('qr', ['qr', 'كيو']);
def('calc', ['calc', 'احسب', 'حاسبة']);
def('tr', ['tr', 'translate', 'ترجم', 'ترجمة']);
def('weather', ['weather', 'طقس', 'الطقس']);
def('short', ['short', 'اختصر', 'اختصار']);
def('dice', ['dice', 'نرد']);
def('coin', ['coin', 'عملة']);
def('pick', ['pick', 'اختر']);
def('ping', ['ping', 'بنق']);
def('prayer', ['prayer', 'صلاة', 'صلاه', 'الصلاة']);
def('hijri', ['hijri', 'هجري', 'التاريخ']);
def('ayah', ['ayah', 'اية', 'آية', 'قرآن']);
def('fx', ['fx', 'حول', 'عملات', 'تحويل']);
def('time', ['time', 'وقت', 'الوقت']);
def('wiki', ['wiki', 'ويكي']);
def('remind', ['remind', 'ذكرني', 'تذكير']);
def('ball', ['ball', '8ball', 'كرة']);
def('percent', ['percent', 'نسبة']);
def('rev', ['rev', 'عكس']);
def('search', ['search', 'بحث', 'ابحث']);
def('help', ['help', 'start', 'menu', 'اوامر', 'الاوامر', 'أوامر']);

// أوامر سريعة ما تحتاج تفاعل ⏳ / ✅
const QUICK = new Set(['help', 'dice', 'coin', 'pick', 'ping', 'calc', 'ball', 'percent', 'rev', 'remind', 'search']);

function parseCommand(text) {
  const m = /^\s*[.!/]\s*(\S+)\s*([\s\S]*)$/.exec(String(text || ''));
  if (!m) return null;
  const name = COMMANDS[m[1].toLowerCase()];
  return name ? { name, arg: m[2].trim() } : null;
}

const HELP = [
  '📋 الأوامر:',
  '',
  '🖼️ الصور',
  '.rmbg ← إزالة الخلفية',
  '.رفع ← رفع الصورة وإرجاع رابط دائم',
  '.ملصق ← صورة أو فيديو قصير إلى ملصق',
  '.لصورة ← ملصق إلى صورة',
  '(أرسل الصورة مع الأمر في الكابشن، أو رد عليها بالأمر)',
  '',
  '🎵 الصوت',
  '.اغنية <اسم> ← يبحث ويرسل الأغنية mp3',
  '.صوت ← رد على فيديو لاستخراج الصوت',
  '.صوت <رابط> ← صوت من يوتيوب / تيك توك ...',
  '',
  '🕌 إسلامي',
  '.صلاة الرياض ← مواقيت الصلاة',
  '.هجري ← التاريخ الهجري',
  '.اية ← آية عشوائية',
  '',
  '🧰 أدوات',
  '.احسب 5*(3+2)',
  '.ترجم hello   |   .ترجم en مرحبا',
  '.طقس الرياض',
  '.qr <نص أو رابط>',
  '.اختصر <رابط>',
  '.بحث <كلمة> ← قائمة تطبيقات (يوتيوب، تيك توك، انستغرام...) تختار منها برقمها',
  '.حول 100 usd sar ← تحويل عملات',
  '.وقت طوكيو ← الوقت في مدينة',
  '.ويكي القاهرة ← ملخص من ويكيبيديا',
  '.ذكرني 10 شراء حليب ← تذكير بعد 10 دقائق',
  '.عكس <نص>',
  '',
  '🎲 تسلية',
  '.نرد   .عملة   .اختر شاي | قهوة',
  '.كرة <سؤال> ← كرة الحظ',
  '.نسبة <شيء> ← نسبة عشوائية (مثال: .نسبة الذكاء)',
  '.بنق ← فحص البوت',
  '',
  '🎬 أرسل رابط فيديو وأحمّله لك',
].join('\n');

// ---- البحث عن وسائط: في الرسالة نفسها أو في الرسالة اللي تم الرد عليها
const KINDS = {
  image: (c) => c.imageMessage?.mimetype
    || (/^image\//.test(c.documentMessage?.mimetype || '') ? c.documentMessage.mimetype : null),
  video: (c) => c.videoMessage?.mimetype
    || (/^video\//.test(c.documentMessage?.mimetype || '') ? c.documentMessage.mimetype : null),
  sticker: (c) => c.stickerMessage?.mimetype || null,
};

function findMedia(msg, kind) {
  const jid = msg.key.remoteJid;
  const test = KINDS[kind];
  const content = normalizeMessageContent(msg.message) || {};

  let mime = test(content);
  if (mime) return { target: msg, mime };

  const ctx = content.extendedTextMessage?.contextInfo || content.imageMessage?.contextInfo || content.videoMessage?.contextInfo;
  const quoted = ctx?.quotedMessage && normalizeMessageContent(ctx.quotedMessage);
  mime = quoted && test(quoted);
  if (mime) {
    return { target: { key: { remoteJid: jid, id: ctx.stanzaId, participant: ctx.participant }, message: quoted }, mime };
  }
  return null;
}

async function getMedia(sock, msg, kind) {
  const found = findMedia(msg, kind);
  if (!found) return null;
  const buffer = await downloadMediaMessage(
    found.target, 'buffer', {},
    { logger: pino({ level: 'silent' }), reuploadRequest: sock.updateMediaMessage },
  );
  return { buffer, mime: found.mime.split(';')[0] };
}

const quotedText = (msg) => {
  const q = normalizeMessageContent(msg.message)?.extendedTextMessage?.contextInfo?.quotedMessage;
  const c = q && normalizeMessageContent(q);
  return (c && (c.conversation || c.extendedTextMessage?.text || c.imageMessage?.caption || c.videoMessage?.caption)) || '';
};

const fmtUptime = (s) => {
  const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60);
  return h ? `${h}س ${m}د` : `${m}د ${Math.floor(s % 60)}ث`;
};

// ---- البحث في تطبيقات التواصل: .بحث <كلمة> ثم تختار رقم التطبيق
const g = (q, extra = '') => `https://www.google.com/search?q=${extra}${encodeURIComponent(q)}`;
const SEARCH_APPS = [
  ['🔴', 'يوتيوب', (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`],
  ['🎵', 'تيك توك', (q) => `https://www.tiktok.com/search?q=${encodeURIComponent(q)}`],
  ['📸', 'إنستغرام', (q) => `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(q)}`],
  ['👤', 'فيسبوك', (q) => `https://www.facebook.com/search/top?q=${encodeURIComponent(q)}`],
  ['🐦', 'إكس (تويتر)', (q) => `https://x.com/search?q=${encodeURIComponent(q)}`],
  ['👻', 'سناب شات', (q) => g(q, 'site:snapchat.com+')],
  ['✈️', 'تيليجرام', (q) => g(q, 'site:t.me+')],
  ['📌', 'بنترست', (q) => `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(q)}`],
  ['👽', 'ريديت', (q) => `https://www.reddit.com/search/?q=${encodeURIComponent(q)}`],
  ['🎧', 'سبوتيفاي', (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`],
  ['🌐', 'جوجل', (q) => g(q)],
  ['🖼️', 'صور جوجل', (q) => `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(q)}`],
];
const searchPending = new Map(); // "jid|who" -> { query, expires }
const SEARCH_TTL = 10 * 60 * 1000;

function searchMenu(query) {
  return [
    `🔎 البحث عن: ${query}`,
    'اختر التطبيق بإرسال رقمه:',
    '',
    ...SEARCH_APPS.map(([emoji, name], i) => `${i + 1}- ${emoji} ${name}`),
    '0- 📋 كل الروابط',
    '',
    '(تقدر تختار أكثر من تطبيق خلال 10 دقائق)',
  ].join('\n');
}

// يرجّع نص الرد لرقم الاختيار، أو null لو الرقم خارج القائمة
function searchReply(query, n) {
  if (n === 0) return SEARCH_APPS.map(([emoji, name, url]) => `${emoji} ${name}\n${url(query)}`).join('\n\n');
  const app = SEARCH_APPS[n - 1];
  return app ? `${app[0]} ${app[1]}: ${query}\n${app[2](query)}` : null;
}

const reminders = new Map(); // jid -> عدد التذكيرات الشغالة
let currentSock = null;
const arabicToLatin = (s) => String(s).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

async function runCommand(sock, msg, cmd) {
  const jid = msg.key.remoteJid;
  const say = (text) => sock.sendMessage(jid, { text }, { quoted: msg });
  const arg = cmd.arg;
  const needImage = () => say('📷 أرسل صورة مع الأمر في الكابشن، أو رد على صورة بالأمر.');

  switch (cmd.name) {
    case 'help': return say(HELP);

    case 'ping': {
      const ms = Math.max(0, Date.now() - Number(msg.messageTimestamp || 0) * 1000);
      return say(`🏓 شغال\n⏱️ ${ms > 60000 ? '-' : `${ms}ms`}  |  🕒 ${fmtUptime(process.uptime())}`);
    }
    case 'dice': return say(`🎲 طلع لك: ${1 + Math.floor(Math.random() * 6)}`);
    case 'coin': return say(Math.random() < 0.5 ? '🪙 صورة' : '🪙 كتابة');
    case 'pick': {
      const opts = arg.split(/[|،,\n]/).map((s) => s.trim()).filter(Boolean);
      if (opts.length < 2) return say('اكتب خيارين أو أكثر، مثال:\n.اختر شاي | قهوة | عصير');
      return say(`🎯 اخترت لك: ${opts[Math.floor(Math.random() * opts.length)]}`);
    }

    case 'calc': return say(`🧮 ${tools.calc(arg || quotedText(msg))}`);

    case 'tr': {
      let text = arg; let to = null;
      const m = /^([a-z]{2}(?:-[a-z]{2})?)\s+([\s\S]+)$/i.exec(arg);
      if (m) { to = m[1].toLowerCase(); text = m[2]; }
      if (!text) text = quotedText(msg);
      return say(`🌐 ${await tools.translate(text, to)}`);
    }
    case 'weather': return say(await tools.weather(arg));
    case 'short': return say(`🔗 ${await tools.shorten(arg || quotedText(msg))}`);
    case 'qr': {
      const png = await tools.qrCode(arg || quotedText(msg));
      return sock.sendMessage(jid, { image: png, caption: '✅ QR' }, { quoted: msg });
    }

    case 'rmbg': {
      const image = await getMedia(sock, msg, 'image');
      if (!image) return needImage();
      const out = await removeBackground(image.buffer, image.mime);
      // نرسلها كملف عشان تبقى الخلفية شفافة (واتساب يحوّل الصور العادية)
      return sock.sendMessage(jid, { document: out, mimetype: 'image/png', fileName: `no-bg_${Date.now()}.png`, caption: '✅ تمت إزالة الخلفية' }, { quoted: msg });
    }
    case 'upload': {
      const image = await getMedia(sock, msg, 'image');
      if (!image) return needImage();
      return say(`☁️ تم الرفع:\n${await uploadImage(image.buffer, { mime: image.mime })}`);
    }

    case 'sticker': {
      let src = await getMedia(sock, msg, 'image');
      let animated = false;
      if (!src) {
        src = await getMedia(sock, msg, 'video');
        animated = true;
      }
      if (!src) return say('🖼️ أرسل صورة أو فيديو قصير مع الأمر، أو رد عليهم بالأمر.');
      if (animated && src.buffer.length > 8 * 1024 * 1024) throw new UserError('الفيديو كبير، جرب فيديو أقصر (أقل من 8MB).');
      const webp = await media.toSticker(src.buffer, src.mime, animated);
      return sock.sendMessage(jid, { sticker: webp }, { quoted: msg });
    }
    case 'toimg': {
      const st = await getMedia(sock, msg, 'sticker');
      if (!st) return say('رد على ملصق بالأمر .لصورة');
      const png = await media.stickerToPng(st.buffer);
      return sock.sendMessage(jid, { image: png, caption: '✅' }, { quoted: msg });
    }

    case 'mp3': {
      const url = pickUrl(arg);
      let mp3;
      if (url) {
        mp3 = await media.urlToMp3(url, YTDLP, 25);
      } else {
        const vid = await getMedia(sock, msg, 'video');
        if (!vid) return say('🎵 رد على فيديو بالأمر، أو أرسل رابط:\n.صوت https://youtu.be/...');
        mp3 = await media.videoToMp3(vid.buffer);
      }
      return sock.sendMessage(jid, { audio: mp3, mimetype: 'audio/mpeg' }, { quoted: msg });
    }
    case 'search': {
      const query = (arg || quotedText(msg)).trim();
      if (!query) return say('اكتب كلمة البحث، مثال:\n.بحث محمد صلاح');
      if (query.length > 100) throw new UserError('كلمة البحث طويلة.');
      searchPending.set(`${jid}|${msg.key.participant || jid}`, { query, expires: Date.now() + SEARCH_TTL });
      return say(searchMenu(query));
    }

    case 'prayer': return say(await tools.prayer(arg));
    case 'hijri': return say(await tools.hijri());
    case 'ayah': return say(await tools.ayah());
    case 'fx': return say(await tools.currency(arg));
    case 'time': return say(await tools.cityTime(arg));
    case 'wiki': return say(await tools.wiki(arg || quotedText(msg)));

    case 'rev': {
      const text = arg || quotedText(msg);
      if (!text) return say('اكتب النص بعد الأمر، مثال:\n.عكس مرحبا');
      return say([...text].reverse().join(''));
    }
    case 'ball': {
      const answers = ['✅ أكيد', '✅ نعم', '✅ غالباً نعم', '🤔 ممكن', '🤔 اسأل مرة ثانية', '🤷 ما أدري', '❌ لا', '❌ مستحيل', '❌ ما أظن', '🔮 الأيام بتجاوب'];
      if (!arg) return say('اسأل سؤال، مثال:\n.كرة هل أنجح؟');
      return say(`🔮 ${answers[Math.floor(Math.random() * answers.length)]}`);
    }
    case 'percent': {
      if (!arg) return say('مثال:\n.نسبة الذكاء');
      let h = 0;
      for (const ch of `${arg}${new Date().toDateString()}${msg.key.participant || jid}`) h = (h * 31 + ch.codePointAt(0)) >>> 0;
      return say(`📊 ${arg}: ${h % 101}%`);
    }

    case 'remind': {
      const m = /^(\d{1,4})\s+([\s\S]+)$/.exec(arabicToLatin(arg));
      if (!m) return say('الصيغة: .ذكرني <دقائق> <نص>\nمثال:\n.ذكرني 10 شراء حليب');
      const mins = Number(m[1]);
      if (mins < 1 || mins > 1440) throw new UserError('المدة من 1 إلى 1440 دقيقة (24 ساعة).');
      if ((reminders.get(jid) || 0) >= 5) throw new UserError('عندك 5 تذكيرات شغالة، انتظر تخلص.');
      reminders.set(jid, (reminders.get(jid) || 0) + 1);
      const note = arg.replace(/^\S+\s+/, '');
      setTimeout(() => {
        reminders.set(jid, Math.max(0, (reminders.get(jid) || 1) - 1));
        (currentSock || sock).sendMessage(jid, { text: `⏰ تذكير: ${note}` }, { quoted: msg }).catch(() => {});
      }, mins * 60000);
      return say(`⏰ تمام، أذكرك بعد ${mins} دقيقة.\n(التذكيرات تنحذف لو البوت انعاد تشغيله)`);
    }

    case 'play': {
      const q = arg.trim();
      if (!q) return say('🎵 اكتب اسم الأغنية، مثال:\n.اغنية عمرو دياب');
      if (q.length > 100) throw new UserError('الاسم طويل.');
      const mp3 = await media.urlToMp3(pickUrl(q) || `ytsearch1:${q}`, YTDLP, 25);
      return sock.sendMessage(jid, { audio: mp3, mimetype: 'audio/mpeg' }, { quoted: msg });
    }
    default: return null;
  }
}

// ------------------------------------------------------------ الترحيب (مرة واحدة لكل شخص، يُحفظ في welcomed.json)
const WELCOME_FILE = path.join(__dirname, 'welcomed.json');
let welcomed = new Set();
try { welcomed = new Set(JSON.parse(fs.readFileSync(WELCOME_FILE, 'utf8'))); } catch { /* أول تشغيل */ }
const saveWelcomed = () => { try { fs.writeFileSync(WELCOME_FILE, JSON.stringify([...welcomed])); } catch { /* ignore */ } };

// ------------------------------------------------------------ البوت
const busy = new Set();

async function handleMessage(sock, msg) {
  const jid = msg.key.remoteJid;
  if (!jid || jid === 'status@broadcast') return;
  if (jid.endsWith('@g.us') && !ALLOW_GROUPS) return;
  const text = textOf(msg);

  // أوامر الصور والذكاء الاصطناعي
  const cmd = parseCommand(text);

  // أول رسالة من شخص جديد في الخاص: نرسل له قائمة الأوامر مرة واحدة
  if (!jid.endsWith('@g.us') && !msg.key.fromMe && !welcomed.has(jid)) {
    welcomed.add(jid);
    saveWelcomed();
    if (cmd?.name !== 'help') await sock.sendMessage(jid, { text: `👋 أهلاً فيك!\n\n${HELP}` }).catch(() => {});
  }

  // اختيار تطبيق من قائمة .بحث (رقم فقط)
  const pickNum = !cmd && /^\s*([0-9٠-٩]{1,2})\s*$/.exec(text);
  if (pickNum) {
    const pending = searchPending.get(`${jid}|${msg.key.participant || jid}`);
    if (pending && pending.expires > Date.now()) {
      const reply = searchReply(pending.query, Number(arabicToLatin(pickNum[1])));
      if (reply) {
        await sock.sendMessage(jid, { text: reply }, { quoted: msg }).catch(() => {});
        return;
      }
    }
  }

  if (cmd) {
    const who = (msg.key.participant || jid) + ':cmd';
    if (busy.has(who)) return;
    busy.add(who);
    const react = (emoji) => sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }).catch(() => {});
    try {
      if (!QUICK.has(cmd.name)) await react('⏳');
      await runCommand(sock, msg, cmd);
      if (!QUICK.has(cmd.name)) await react('✅');
    } catch (e) {
      console.warn('[command failed]', cmd.name, '->', (e.message || e).toString().slice(0, 200));
      const text = e instanceof UserError || e.safe ? e.message : 'صار خطأ غير متوقع، جرب مرة ثانية.';
      await sock.sendMessage(jid, { text: `❌ ${text}` }, { quoted: msg }).catch(() => {});
      await react('❌');
    } finally {
      busy.delete(who);
    }
    return;
  }

  const url = pickUrl(text);
  if (!url) return;

  const who = msg.key.participant || jid;
  if (busy.has(who)) return;
  busy.add(who);

  const react = (emoji) => sock.sendMessage(jid, { react: { text: emoji, key: msg.key } }).catch(() => {});
  let dir = null;
  try {
    await react('⏳');
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'wadl-'));
    const file = await fetchVideo(url, dir);
    const mb = fs.statSync(file).size / 1024 / 1024;
    if (mb > MAX_MB) throw new Error('too big');

    const stream = { stream: fs.createReadStream(file) };
    if (mb <= VIDEO_LIMIT_MB) {
      await sock.sendMessage(jid, { video: stream, mimetype: 'video/mp4', caption: url }, { quoted: msg });
    } else {
      await sock.sendMessage(jid, {
        document: stream, mimetype: 'video/mp4',
        fileName: path.basename(file), caption: url,
      }, { quoted: msg });
    }
    await react('✅');
  } catch (e) {
    console.warn('[download failed]', url, '->', (e.stderr || e.message || e).toString().split('\n')[0].slice(0, 200));
    await sock.sendMessage(jid, { text: '❌ ما قدرت أحمّل هذا الرابط (يمكن خاص، أو فيديو طويل/كبير، أو الصور مو مدعومة).' }, { quoted: msg }).catch(() => {});
    await react('❌');
  } finally {
    busy.delete(who);
    if (dir) fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function start() {
  const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, 'auth'));
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    logger: pino({ level: 'silent' }),
    browser: Browsers.ubuntu('Chrome'),
    printQRInTerminal: false,
    markOnlineOnConnect: false,
  });

  currentSock = sock;
  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') console.log('✅ البوت شغال، أرسل له رابط فيديو');
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code === DisconnectReason.loggedOut) {
        console.log('تم تسجيل الخروج. احذف مجلد auth وشغّل من جديد.');
        process.exit(0);
      }
      setTimeout(start, 3000);
    }
  });

  sock.ev.on('messages.upsert', ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) handleMessage(sock, msg).catch((e) => console.error(e));
  });

  // لو الجهاز مو مربوط: نسأل عن الرقم في الكونسول ونطلع كود الربط
  if (!sock.authState.creds.registered) {
    if (!phoneAsked) {
      phoneAsked = (await ask('\n📱 اكتب رقمك بصيغة دولية بدون + (مثال 9665XXXXXXXX): ')).replace(/\D/g, '');
    }
    if (!phoneAsked) { console.error('ما كتبت رقم.'); process.exit(1); }
    await new Promise((r) => setTimeout(r, 3000));
    try {
      const code = await sock.requestPairingCode(phoneAsked);
      console.log(`\n🔑 كود الربط: ${code.match(/.{1,4}/g).join('-')}`);
      console.log('واتساب ← الأجهزة المرتبطة ← ربط جهاز ← الربط برقم الهاتف، وأدخل الكود\n');
    } catch (e) {
      console.error('فشل طلب الكود:', e.message);
      phoneAsked = '';
    }
  }
}

start();

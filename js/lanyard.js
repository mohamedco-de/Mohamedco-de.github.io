// البطاقة المعلّقة: تتحرك بالسحب في أي مكان بالشاشة (جوال + كمبيوتر) وتبقى كاملة داخل الشاشة
const LY_K = Math.tan(17.5 * Math.PI / 180);   // نصف ارتفاع الرؤية لكل وحدة بُعد (كاميرا 35°)
const PHONE_PPU = 106, PHONE_TOP = 2.02;       // الجوال: بكسل لكل وحدة + إحداثي y لأعلى الشاشة
const CARD_W = 1.85, CARD_H = 2.6;

// الحبل والفيزياء (Verlet) مشتركان بين نسخة Three.js ونسخة 2D
function lanyardRope(offx) {
  const N = 9, ROPE = 2.7, SEG = ROPE / (N - 1), HALF = CARD_H / 2 + .1;
  const P = Array.from({ length: N + 1 }, (_, i) => { const x = (i === N ? .9 : 0) + offx, y = 3.4 - (i < N ? i * SEG : ROPE + HALF); return { x, y, px: x, py: y }; });
  const r = { P, N, SEG, HALF, k: 1, drag: false, tx: 0, ty: 0,
    step() {
      for (let i = 1; i <= N; i++) { const p = P[i], vx = (p.x - p.px) * .993, vy = (p.y - p.py) * .993; p.px = p.x; p.py = p.y; p.x += vx; p.y += vy - .0075; }
      if (r.drag) {
        const c = P[N]; c.x = c.px = r.tx; c.y = c.py = r.ty;
        // الحبل يتمدّد أثناء السحب ليوصل لأي مكان، ويرجع لطوله بسلاسة بعد الإفلات
        const need = Math.max(1, (Math.hypot(c.x - P[0].x, c.y - P[0].y) - HALF) / ROPE * 1.03);
        r.k += (need - r.k) * .3;
      } else r.k += (1 - r.k) * .04;
      const seg = SEG * r.k;
      for (let k = 0; k < 16; k++) for (let i = 0; i < N; i++) {
        const a = P[i], b = P[i + 1], want = i === N - 1 ? HALF : seg, dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1e-6, f = (d - want) / d;
        const wa = i === 0 ? 0 : .5, wb = (i + 1 === N && r.drag) ? 0 : (i === 0 ? 1 : .5), s = (wa + wb) || 1;
        a.x += dx * f * wa / s; a.y += dy * f * wa / s; b.x -= dx * f * wb / s; b.y -= dy * f * wb / s;
      }
    }
  };
  return r;
}
// حدود مركز البطاقة بحيث تبقى كلها ظاهرة (مع مساحة تحت شريط التنقل)
function lanyardLimits({ left, right, top, bottom, ppu }) {
  const padTop = 64 / ppu, y0 = bottom + CARD_H / 2 + .12, y1 = Math.max(y0, top - padTop - CARD_H / 2 - .35);
  const x0 = left + CARD_W / 2 + .12, x1 = Math.max(x0, right - CARD_W / 2 - .12);
  return { x0, x1, y0, y1 };
}
const lanyardClamp = (v, a, b) => Math.max(a, Math.min(b, v));

function lanyardBind({ world, hit, onStart, onMove, onEnd, signal }) {
  let on = false, moved = 0; const o = { signal }, root = document.documentElement;
  const down = (x, y) => { const w = world({ clientX: x, clientY: y }); if (!hit(w)) return false; on = true; moved = 0; onStart(w); root.style.cursor = "grabbing"; document.body.style.userSelect = "none"; return true; };
  addEventListener("pointerdown", e => { if (e.button === 0 || e.pointerType === "touch") down(e.clientX, e.clientY); }, { capture: true, signal });
  addEventListener("pointermove", e => { const w = world(e); if (on) { moved++; onMove(w); } else root.style.cursor = hit(w) ? "grab" : ""; }, o);
  const up = () => { if (!on) return; on = false; onEnd(); root.style.cursor = ""; document.body.style.userSelect = "";
    if (moved > 3) { const stop = ev => { ev.stopPropagation(); ev.preventDefault(); }; addEventListener("click", stop, true); setTimeout(() => removeEventListener("click", stop, true), 120); } };
  addEventListener("pointerup", up, o); addEventListener("pointercancel", up, o);
  addEventListener("touchstart", e => { const t = e.touches[0]; if (t && hit(world(t))) e.preventDefault(); }, { passive: false, signal });
  addEventListener("touchmove", e => { if (on) e.preventDefault(); }, { passive: false, signal });
}

// بطاقة معلّقة بحبل أسود: فيزياء Verlet + سحب + سماكة حقيقية (Three.js)
function initLanyard() {
  const el = document.getElementById("lanyard"); if (!el) return;
  if (!window.THREE) return initLanyard2D(el);

  const D = DATA, T = THREE, ac = new AbortController();
  const R = new T.WebGLRenderer({ alpha: true, antialias: true }); R.setPixelRatio(Math.min(devicePixelRatio, 2)); el.appendChild(R.domElement);
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(35, 1, .1, 80); cam.position.z = 10;
  let LY = 2.65, LX = 4.7, VH = 1;                         // نصف ارتفاع/عرض الرؤية بوحدات العالم + ارتفاع الشاشة بالبكسل
  const phone = () => innerWidth < 900;
  const fit = () => {
    const w = el.clientWidth || innerWidth, h = el.clientHeight || innerHeight; VH = h;
    cam.position.z = phone() ? (h / 2 / PHONE_PPU) / LY_K : 8.4;   // الجوال: حجم البطاقة ثابت مهما كان طول الشاشة
    LY = cam.position.z * LY_K; LX = LY * w / h;
    cam.position.y = (phone() ? PHONE_TOP : LY) - LY;              // أعلى الشاشة دائماً عند نفس الإحداثي
    R.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix();
  };
  fit(); addEventListener("resize", fit, { signal: ac.signal });

  /* --- نسيج البطاقة (أمام) --- */
  const mk = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d"); fn(g); const t = new T.CanvasTexture(c); t.anisotropy = 8; return t; };
  let photo = null;
  const front = () => mk(512, 720, g => {
    g.fillStyle = "#e6dfc9"; g.fillRect(0, 0, 512, 720);
    for (let i = 0; i < 700; i++) { g.fillStyle = `rgba(80,60,30,${Math.random() * .06})`; g.fillRect(Math.random() * 512, Math.random() * 720, Math.random() * 3 + 1, Math.random() * 3 + 1); }
    g.fillStyle = "#111"; g.fillRect(190, 18, 132, 30);                       // فتحة الحامل
    g.fillStyle = "#111"; g.font = "700 22px Inter,sans-serif"; g.fillText("JUNIOR", 40, 92);
    g.font = "900 128px Impact,'Arial Black',sans-serif"; { const k = Math.min(.78, 300 / g.measureText("DEVELOPER").width); g.save(); g.scale(k, 1); g.fillText("DEVELOPER", 40 / k, 190); g.restore(); }
    g.fillStyle = "#1d3557"; g.fillRect(70, 205, 330, 340);
    if (photo) { const r = Math.max(330 / photo.width, 340 / photo.height), w = photo.width * r, h = photo.height * r; g.save(); g.beginPath(); g.rect(70, 205, 330, 340); g.clip(); g.drawImage(photo, 235 - w / 2, 375 - h / 2, w, h); g.restore(); }
    g.fillStyle = "#111"; g.fillRect(120, 520, 250, 34); g.fillStyle = "#fff"; g.font = "800 17px Inter,sans-serif"; g.textAlign = "center"; g.fillText(D.name.toUpperCase(), 245, 543);
    g.save(); g.translate(452, 560); g.rotate(-Math.PI / 2); g.fillStyle = "#111"; g.font = "900 56px Impact,'Arial Black',sans-serif"; g.fillText(D.cardSide, 0, 0); g.restore();
    g.textAlign = "left"; g.fillStyle = "#111"; g.beginPath(); g.roundRect ? g.roundRect(10, 610, 300, 100, 30) : g.rect(10, 610, 300, 100); g.fill();
    g.fillStyle = "#fff"; g.font = "900 62px Impact,'Arial Black',sans-serif"; g.fillText("PORTFOLIO", 28, 686);
  });
  const back = mk(256, 360, g => { g.fillStyle = "#cfc7ae"; g.fillRect(0, 0, 256, 360); });
  const mat = new T.MeshBasicMaterial({ map: front() });
  const im = new Image(); im.onload = () => { photo = im; mat.map = front(); mat.needsUpdate = true; }; im.src = D.photo;
  const edge = new T.MeshBasicMaterial({ color: 0x0b0b0b });
  const CW = CARD_W, CH = CARD_H, card = new T.Mesh(new T.BoxGeometry(CW, CH, .04), [edge, edge, edge, edge, mat, new T.MeshBasicMaterial({ map: back })]);
  const clip = new T.Group(); clip.position.y = CH / 2 + .1;
  clip.add(new T.Mesh(new T.BoxGeometry(.34, .26, .06), new T.MeshBasicMaterial({ color: 0xf2f2f2 })));
  const ring = new T.Mesh(new T.TorusGeometry(.1, .018, 8, 24), new T.MeshBasicMaterial({ color: 0xbfc4cc })); ring.position.y = -.17; clip.add(ring);
  card.add(clip); scene.add(card);
  const pinM = new T.Mesh(new T.CircleGeometry(.1, 20), new T.MeshBasicMaterial({ color: 0xbfc4cc })); scene.add(pinM);

  /* --- الحبل: شريط أسود عليه اسمك --- */
  const strapTex = mk(64, 256, g => { g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, 64, 256); g.fillStyle = "#fff"; g.font = "700 20px Inter,sans-serif"; g.save(); g.translate(40, 14); g.rotate(Math.PI / 2); g.fillText("◆ " + D.name, 0, 0); g.restore(); });
  strapTex.wrapT = T.RepeatWrapping;
  const OFFX = innerWidth >= 900 ? .22 * cam.position.z * .6306 * cam.aspect : 0;
  const rope = lanyardRope(OFFX), { P, N, SEG } = rope;
  const rib = new T.BufferGeometry();
  rib.setAttribute("position", new T.BufferAttribute(new Float32Array(N * 6), 3));
  rib.setAttribute("uv", new T.BufferAttribute(new Float32Array(N * 4), 2));
  const idx = []; for (let i = 0; i < N - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } rib.setIndex(idx);
  scene.add(new T.Mesh(rib, new T.MeshBasicMaterial({ map: strapTex, side: T.DoubleSide })));

  /* --- سحب: من أي نقطة على الكرت إلى أي مكان في الشاشة --- */
  const hold = { x: 0, y: 0 }; const cvs = R.domElement; cvs.style.pointerEvents = "none";
  const world = e => { const r = cvs.getBoundingClientRect(); const v = new T.Vector3(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1, .5).unproject(cam); const d = v.sub(cam.position).normalize(), t = -cam.position.z / d.z; return { x: cam.position.x + d.x * t, y: cam.position.y + d.y * t }; };
  const hit = w => Math.abs(w.x - P[N].x) < CW / 2 + .4 && Math.abs(w.y - P[N].y) < CH / 2 + .4;
  const aim = w => { const L = lanyardLimits({ left: -LX, right: LX, top: cam.position.y + LY, bottom: cam.position.y - LY, ppu: VH / (2 * LY) });
    rope.tx = lanyardClamp(w.x + hold.x, L.x0, L.x1); rope.ty = lanyardClamp(w.y + hold.y, L.y0, L.y1); };
  lanyardBind({ world, hit, signal: ac.signal,
    onStart: w => { hold.x = P[N].x - w.x; hold.y = P[N].y - w.y; rope.drag = true; aim(w); }, onMove: aim, onEnd: () => { rope.drag = false; } });

  const draw = () => {
    const pos = rib.attributes.position.array, uv = rib.attributes.uv.array;
    for (let i = 0; i < N; i++) { const a = P[Math.max(i - 1, 0)], b = P[Math.min(i + 1, N - 1)]; let nx = -(b.y - a.y), ny = b.x - a.x; const l = Math.hypot(nx, ny) || 1; nx = nx / l * .13; ny = ny / l * .13; pos.set([P[i].x - nx, P[i].y - ny, 0, P[i].x + nx, P[i].y + ny, 0], i * 6);
      const v = i * SEG * rope.k / 1.3; uv[i * 4] = 0; uv[i * 4 + 1] = v; uv[i * 4 + 2] = 1; uv[i * 4 + 3] = v; }
    rib.attributes.position.needsUpdate = true; rib.attributes.uv.needsUpdate = true; pinM.position.set(P[0].x, P[0].y, .02);
    const c = P[N], t = P[N - 1]; card.position.set(c.x, c.y, 0); card.rotation.z = -Math.atan2(t.x - c.x, t.y - c.y);
    card.rotation.y += (Math.max(-.7, Math.min(.7, (c.x - c.px) * 7)) - card.rotation.y) * .08;
  };
  (function loop() { if (!el.isConnected) { ac.abort(); R.dispose(); return; } rope.step(); draw(); R.render(scene, cam); requestAnimationFrame(loop); })();
}

// نسخة احتياطية 2D بنفس الشكل والفيزياء (تعمل لو ما تحمّل Three.js)
function initLanyard2D(el) {
  const ac = new AbortController(), D = DATA, cvs = document.createElement("canvas"), g = cvs.getContext("2d"); el.appendChild(cvs);
  let W, H, S, TOP, DPR = Math.min(devicePixelRatio || 1, 2);
  const fit = () => { W = el.clientWidth || innerWidth; H = el.clientHeight || innerHeight; cvs.width = W * DPR; cvs.height = H * DPR; cvs.style.width = W + "px"; cvs.style.height = H + "px";
    S = innerWidth < 900 ? PHONE_PPU : H / 5.3; TOP = innerWidth < 900 ? PHONE_TOP : H / 2 / S; };
  fit(); addEventListener("resize", fit, { signal: ac.signal });
  const mk = (w, h, fn) => { const c = document.createElement("canvas"); c.width = w; c.height = h; fn(c.getContext("2d")); return c; };
  let photo = null;
  const front = () => mk(512, 720, q => {
    q.fillStyle = "#e6dfc9"; q.fillRect(0, 0, 512, 720);
    for (let i = 0; i < 700; i++) { q.fillStyle = `rgba(80,60,30,${Math.random() * .06})`; q.fillRect(Math.random() * 512, Math.random() * 720, Math.random() * 3 + 1, Math.random() * 3 + 1); }
    q.fillStyle = "#111"; q.fillRect(190, 18, 132, 30);
    q.font = "700 22px Inter,sans-serif"; q.fillText("JUNIOR", 40, 92);
    q.font = "900 128px Impact,'Arial Black',sans-serif"; { const k = Math.min(.78, 300 / q.measureText("DEVELOPER").width); q.save(); q.scale(k, 1); q.fillText("DEVELOPER", 40 / k, 190); q.restore(); }
    q.fillStyle = "#1d3557"; q.fillRect(70, 205, 330, 340);
    if (photo) { const r = Math.max(330 / photo.width, 340 / photo.height), w = photo.width * r, h = photo.height * r; q.save(); q.beginPath(); q.rect(70, 205, 330, 340); q.clip(); q.drawImage(photo, 235 - w / 2, 375 - h / 2, w, h); q.restore(); }
    q.fillStyle = "#111"; q.fillRect(120, 520, 250, 34); q.fillStyle = "#fff"; q.font = "800 17px Inter,sans-serif"; q.textAlign = "center"; q.fillText(D.name.toUpperCase(), 245, 543);
    q.save(); q.translate(452, 560); q.rotate(-Math.PI / 2); q.fillStyle = "#111"; q.font = "900 56px Impact,'Arial Black',sans-serif"; q.textAlign = "left"; q.fillText(D.cardSide, 0, 0); q.restore();
    q.textAlign = "left"; q.fillStyle = "#111"; q.beginPath(); q.roundRect ? q.roundRect(10, 610, 300, 100, 30) : q.rect(10, 610, 300, 100); q.fill();
    q.fillStyle = "#fff"; q.font = "900 62px Impact,'Arial Black',sans-serif"; q.fillText("PORTFOLIO", 28, 686);
  });
  let tex = front(); const im = new Image(); im.onload = () => { photo = im; tex = front(); }; im.src = D.photo;
  const CW = CARD_W, CH = CARD_H, OFFX = innerWidth >= 900 ? W / S * .22 : 0;
  const rope = lanyardRope(OFFX), { P, N } = rope;
  const X = x => W / 2 + x * S, Y = y => (TOP - y) * S;
  const hold = { x: 0, y: 0 }; cvs.style.pointerEvents = "none";
  const world = e => { const r = cvs.getBoundingClientRect(); return { x: (e.clientX - r.left - W / 2) / S, y: TOP - (e.clientY - r.top) / S }; };
  const hit = w => Math.abs(w.x - P[N].x) < CW / 2 + .4 && Math.abs(w.y - P[N].y) < CH / 2 + .4;
  const aim = w => { const L = lanyardLimits({ left: -W / S / 2, right: W / S / 2, top: TOP, bottom: TOP - H / S, ppu: S });
    rope.tx = lanyardClamp(w.x + hold.x, L.x0, L.x1); rope.ty = lanyardClamp(w.y + hold.y, L.y0, L.y1); };
  lanyardBind({ world, hit, signal: ac.signal,
    onStart: w => { hold.x = P[N].x - w.x; hold.y = P[N].y - w.y; rope.drag = true; aim(w); }, onMove: aim, onEnd: () => { rope.drag = false; } });
  let sway = 0;
  const draw = () => {
    g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
    // الحبل
    g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#0b0b0b"; g.lineWidth = .26 * S; g.beginPath(); g.moveTo(X(P[0].x), Y(P[0].y));
    for (let i = 0; i < N; i++) g.lineTo(X(P[i].x), Y(P[i].y)); g.stroke();
    g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < N; i++) g[i ? "lineTo" : "moveTo"](X(P[i].x) + .05 * S, Y(P[i].y)); g.stroke();
    g.fillStyle = "#c9ced6"; g.beginPath(); g.arc(X(P[0].x), Y(P[0].y), .1 * S, 0, 7); g.fill(); g.fillStyle = "rgba(0,0,0,.35)"; g.beginPath(); g.arc(X(P[0].x), Y(P[0].y), .04 * S, 0, 7); g.fill();
    // الكرت
    const c = P[N], t = P[N - 1], ang = Math.atan2(t.x - c.x, t.y - c.y);
    g.save(); g.translate(X(c.x), Y(c.y)); g.rotate(ang);
    const w = CW * S, h = CH * S;
    g.shadowColor = "rgba(0,0,0,.55)"; g.shadowBlur = 30; g.shadowOffsetY = 12; g.fillStyle = "#0b0b0b"; g.beginPath(); g.roundRect ? g.roundRect(-w / 2, -h / 2, w, h, 8) : g.rect(-w / 2, -h / 2, w, h); g.fill(); g.shadowColor = "transparent";
    g.save(); g.beginPath(); g.roundRect ? g.roundRect(-w / 2 + 1, -h / 2 + 1, w - 2, h - 2, 7) : g.rect(-w / 2, -h / 2, w, h); g.clip(); g.drawImage(tex, -w / 2, -h / 2, w, h); g.restore();
    // المشبك
    g.fillStyle = "#f2f2f2"; g.fillRect(-.17 * S, -h / 2 - .23 * S, .34 * S, .26 * S);
    g.strokeStyle = "#bfc4cc"; g.lineWidth = .04 * S; g.beginPath(); g.arc(0, -h / 2 - .27 * S, .1 * S, 0, 7); g.stroke();
    g.restore();
  };
  (function loop() { if (!el.isConnected) { ac.abort(); return; } sway += .016; P[N].x += Math.sin(sway) * .0006; rope.step(); draw(); requestAnimationFrame(loop); })();
}

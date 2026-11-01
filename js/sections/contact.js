const ago = t => { const d = Math.floor((Date.now() - t) / 864e5), h = Math.floor((Date.now() - t) / 36e5), m = Math.floor((Date.now() - t) / 6e4);
  return d >= 1 ? `${d} hari lalu` : h >= 1 ? `${h} jam lalu` : m >= 1 ? `${m} menit lalu` : "baru saja"; };
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const Contact = () => `
<section id="contact" class="contact">
  <h2 class="sec-title rv">Hubungi saya</h2>
  <div class="c-grid rv">
    <div class="panel left">
      <h3 class="blue">Hubungi</h3><p class="sub">Ada yang mau didiskusikan? Langsung kirim pesan aja ya...</p>
      <form id="msg">
        <label>Nama<span class="fld">${icon("user", 14)}<input required placeholder="Nama Anda"></span></label>
        <label>Email<span class="fld">${icon("mail", 14)}<input type="email" required placeholder="Email Anda"></span></label>
        <label>Pesan<span class="fld ta">${icon("msg", 14)}<textarea required placeholder="Pesan Anda"></textarea></span></label>
        <button class="btn wide">${icon("send", 14)} Kirim Pesan</button>
        <p class="form-status" id="msgst" role="status" aria-live="polite"></p>
      </form>
      <h4 class="findme">FIND ME</h4>
      ${DATA.links.map(l => `<a class="link-row" href="${l.url}" target="_blank" rel="noopener"><span class="bi ${l.key}">${brand(l.key, 20)}</span><span><b>${l.name}</b><small>${l.handle}</small></span><i>${icon("out", 12)}</i></a>`).join("")}
    </div>
    <div class="panel right">
      <h3 class="ch"><span class="ic">${icon("msg", 15)}</span>Komentar <small id="cc"></small></h3>
      <form id="cmf">
        <label>Nama<span class="fld"><input required placeholder="Masukkan nama kamu"></span></label>
        <label>Komentar<span class="fld ta"><textarea required placeholder="Tulis komentar kamu di sini..."></textarea></span></label>
        <label>Foto Profil (opsional)<button type="button" class="up" id="upb">${icon("img", 14)} Pilih Foto Profil</button><input type="file" id="upf" accept="image/*" hidden></label>
        <small class="mute c">Ukuran file maksimal 5 MB</small>
        <button class="btn wide">${icon("send", 14)} Kirim Komentar</button>
      </form>
      <div id="cms"></div>
    </div>
  </div>
</section>
<footer class="foot">
  <div class="f-grid">
    <div><b class="logo">${icon("term", 14)} ${DATA.name.split(" ").pop()}.dev</b><p>Membangun pengalaman web modern dengan presisi kode, tipografi tajam, dan dimensi 3D interaktif.</p></div>
    <div><h5>NAVIGASI</h5><a href="#home">Beranda</a><a href="#about">Tentang Saya</a><a href="#portfolio">Portfolio</a><a href="#contact">Kontak</a></div>
    <div><h5>TERHUBUNG</h5><div class="find">${DATA.links.map(l => `<a class="ibtn" href="${l.url}" target="_blank" rel="noopener" aria-label="${l.name}">${brand(l.key, 14)}</a>`).join("")}</div></div>
  </div>
  <div class="f-bot"><span>© ${new Date().getFullYear()} ${DATA.name.split(" ").pop()}Dev. All rights reserved.</span><button class="btn ghost sm" id="totop">Kembali ke Atas ${icon("up", 12)}</button></div>
</footer>`;
function contactInit() {
  const key = "pf-comments", avKey = { v: "" };
  const load = () => { try { return JSON.parse(localStorage.getItem(key)) || DATA.comments; } catch { return DATA.comments; } };
  const draw = () => { const l = load(); document.getElementById("cc").textContent = `(${l.length})`;
    document.getElementById("cms").innerHTML = l.map(c => `<div class="cm"><span class="av">${c.avatar ? `<img src="${c.avatar}" alt="">` : esc(c.name[0] || "?")}</span><div><b>${esc(c.name)}</b><p>${esc(c.text)}</p></div><time>${ago(c.t)}</time></div>`).join(""); };
  const f = document.getElementById("upf"); document.getElementById("upb").onclick = () => f.click();
  f.onchange = () => { const file = f.files[0]; if (!file) return; if (file.size > 5 * 1048576) { alert("Ukuran file maksimal 5 MB"); f.value = ""; return; }
    const r = new FileReader(); r.onload = () => { avKey.v = r.result; document.getElementById("upb").lastChild.textContent = " " + file.name; }; r.readAsDataURL(file); };
  document.getElementById("cmf").onsubmit = e => { e.preventDefault(); const [n, t] = e.target.querySelectorAll("input:not([type=file]),textarea");
    const l = [{ name: n.value, text: t.value, t: Date.now(), avatar: avKey.v }, ...load()];
    try { localStorage.setItem(key, JSON.stringify(l)); } catch { alert("Foto terlalu besar untuk disimpan, coba tanpa foto."); }
    e.target.reset(); avKey.v = ""; draw(); };
  document.getElementById("msg").onsubmit = async e => { e.preventDefault();
    const f = e.target, [n, m, t] = f.querySelectorAll("input,textarea"), b = f.querySelector("button"), st = document.getElementById("msgst"), label = b.innerHTML;
    const say = (txt, cls) => { st.className = "form-status " + (cls || ""); st.innerHTML = txt; };
    const target = DATA.formId || DATA.email; if (!target || /example\.com$/i.test(target)) return say("Isi formId atau email kamu dulu di js/data.js supaya pesan bisa masuk ke inbox kamu.", "err");
    b.disabled = true; b.innerHTML = icon("send", 14) + " Mengirim..."; say("");
    try {   // إرسال تلقائي عبر FormSubmit: بدون فتح تطبيق الإيميل
      const r = await fetch("https://formsubmit.co/ajax/" + target, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name: n.value, email: m.value, message: t.value, _subject: "Pesan baru dari " + n.value + " (portfolio)", _template: "table", _captcha: "false" }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || String(j.success) === "false") throw new Error(j.message || "HTTP " + r.status);
      f.reset(); say("Pesan terkirim ✓ Terima kasih, nanti aku balas ya!", "ok");
    } catch (err) {
      const mail = `mailto:${DATA.email}?subject=${encodeURIComponent("Pesan dari " + n.value)}&body=${encodeURIComponent(t.value + "\n\n" + m.value)}`;
      say(`Gagal mengirim otomatis (${esc(err.message)}). <a href="${mail}">Kirim lewat aplikasi email</a>`, "err");
    }
    b.disabled = false; b.innerHTML = label; };
  document.getElementById("totop").onclick = () => scrollTo({ top: 0, behavior: "smooth" });
  draw();
}

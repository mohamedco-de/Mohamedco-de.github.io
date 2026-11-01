// التوجيه + الشاشة الأولى + التأثيرات العامة
const $ = (s, r = document) => r.querySelector(s);
const view = $("#view"), nav = $("#nav");

function typer() {
  const el = $("#role"); if (!el) return; let w = 0, c = 0, del = false; const R = DATA.roles;
  (function tick() { const word = R[w]; el.dataset.t = word.slice(0, c); el.firstChild ? el.firstChild.nodeValue = word.slice(0, c) : el.append(word.slice(0, c));
    c += del ? -1 : 1;
    if (!del && c > word.length) { del = true; return setTimeout(tick, 1400); }
    if (del && c < 0) { del = false; w = (w + 1) % R.length; c = 0; }
    setTimeout(tick, del ? 35 : 75); })();
}
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".rv").forEach(n => io.observe(n));
  const co = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const n = +e.target.dataset.n; let i = 0;
    const t = setInterval(() => { e.target.textContent = ++i; if (i >= n) clearInterval(t); }, 300); co.unobserve(e.target); }), { threshold: .6 });
  document.querySelectorAll("[data-n]").forEach(n => co.observe(n));
}
function photoReveal() { // الصورة البديلة تظهر تحت المؤشر
  const ph = $("#photo"); if (!ph) return; let tx = -999, ty = -999, x = tx, y = ty;
  ph.addEventListener("pointermove", e => { const r = ph.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; });
  ph.addEventListener("pointerleave", () => { tx = ty = -999; });
  (function f() { x += (tx - x) * .12; y += (ty - y) * .12; ph.style.setProperty("--x", x + "px"); ph.style.setProperty("--y", y + "px"); requestAnimationFrame(f); })();
}
function spy() {
  const links = nav.querySelectorAll("a");
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle("on", a.hash === "#" + e.target.id)); }), { threshold: .45 });
  document.querySelectorAll("section").forEach(s => io.observe(s));
}
function mountHome() {
  view.innerHTML = Home() + About() + Portfolio() + Contact();
  nav.style.display = ""; typer(); reveal(); tabsInit(); contactInit(); photoReveal(); spy(); initLanyard();
}
function render() {
  const h = location.hash;
  if (!$("#home")) mountHome();
  const t = h && h !== "#/" ? $(h) : null; t ? setTimeout(() => t.scrollIntoView(), 30) : scrollTo(0, 0);
}
addEventListener("hashchange", render);
document.title = DATA.name + " | Portfolio";
initStars(); Sound.init();

// شاشة التحميل
let p = 0;
const lt = setInterval(() => {
  p = Math.min(100, p + 1 + Math.floor(Math.random() * 6)); $("#pct").textContent = p; $("#bar").style.width = p + "%";
  if (p === 100) { clearInterval(lt); render(); const l = $("#loader"); l.classList.add("out"); setTimeout(() => l.remove(), 700); }
}, 55);

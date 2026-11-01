// تأثيرات الماوس: توهّج يتبع المؤشر + إمالة الكروت مع إضاءة + أزرار مغناطيسية
(function () {
  if (matchMedia("(pointer:coarse)").matches || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
  const glow = document.createElement("div"); glow.id = "cglow"; document.body.appendChild(glow);
  let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty;
  addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
  document.addEventListener("pointerleave", () => glow.style.opacity = 0);
  (function f() { x += (tx - x) * .14; y += (ty - y) * .14; glow.style.transform = `translate(${x - 260}px,${y - 260}px)`; requestAnimationFrame(f); })();

  const T = ".glass,.panel,.stat,.row,.tile,.cert,.music";
  document.addEventListener("pointermove", e => {
    const el = e.target.closest && e.target.closest(T); if (!el) return;
    const r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", px * 100 + "%"); el.style.setProperty("--my", py * 100 + "%");
    const big = r.width > 600 || r.height > 600, k = big ? 0 : 7;
    el.style.transform = `perspective(900px) rotateX(${(.5 - py) * k}deg) rotateY(${(px - .5) * k}deg) translateY(${big ? 0 : -3}px)`;
    el.classList.add("tilt");
  });
  document.addEventListener("pointerout", e => { const el = e.target.closest && e.target.closest(T); if (el && !el.contains(e.relatedTarget)) { el.style.transform = ""; el.classList.remove("tilt"); } });

  document.addEventListener("pointermove", e => {
    const b = e.target.closest && e.target.closest(".btn,.tab,.ibtn"); if (!b) return;
    const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .25}px`;
  });
  document.addEventListener("pointerout", e => { const b = e.target.closest && e.target.closest(".btn,.tab,.ibtn"); if (b) b.style.translate = ""; });
})();

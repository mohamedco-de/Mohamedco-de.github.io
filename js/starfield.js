// نجوم + نقاط مضيئة + شهب
function initStars() {
  const c = document.createElement("canvas"); c.id = "stars"; document.body.prepend(c);
  const x = c.getContext("2d"); let W, H, S = [], B = [], M = [], mx = 0, my = 0, cx = -999, cy = -999;
  const size = () => {
    W = c.width = innerWidth; H = c.height = innerHeight;
    S = Array.from({ length: Math.round(W * H / 7000) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.1 + .3, z: Math.random() * .8 + .2, t: Math.random() * 6 }));
    B = Array.from({ length: 7 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + 2, v: Math.random() * .25 + .08 }));
  };
  size(); addEventListener("resize", size);
  addEventListener("pointermove", e => { mx = e.clientX / W - .5; my = e.clientY / H - .5; cx = e.clientX; cy = e.clientY; });
  addEventListener("pointerleave", () => { cx = cy = -999; });
  const spawn = () => { M.push({ x: Math.random() * W * 1.1, y: -20, vx: -(4 + Math.random() * 3), vy: 4 + Math.random() * 3, life: 1 }); setTimeout(spawn, 1800 + Math.random() * 3500); };
  setTimeout(spawn, 1500);
  (function draw() {
    x.clearRect(0, 0, W, H);
    for (const s of S) { s.t += .025; s.y -= .06 * s.z; if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
      x.globalAlpha = .25 + .75 * Math.abs(Math.sin(s.t)); x.fillStyle = "#cfe3ff";
      const sx = s.x - mx * 30 * s.z, sy = s.y - my * 30 * s.z, d = Math.hypot(sx - cx, sy - cy);
      x.beginPath(); x.arc(sx, sy, s.r * (d < 150 ? 1.8 : 1), 0, 7); x.fill();
      if (d < 150) { x.globalAlpha = (1 - d / 150) * .55; x.strokeStyle = "#7fa8ff"; x.lineWidth = .8; x.beginPath(); x.moveTo(sx, sy); x.lineTo(cx, cy); x.stroke(); } }
    for (const b of B) { b.y -= b.v; if (b.y < -10) { b.y = H + 10; b.x = Math.random() * W; }
      x.globalAlpha = .9; x.shadowColor = "#fff"; x.shadowBlur = 10; x.fillStyle = "#fff"; x.beginPath(); x.arc(b.x, b.y, b.r, 0, 7); x.fill(); x.shadowBlur = 0; }
    for (let i = M.length - 1; i >= 0; i--) { const m = M[i]; m.x += m.vx; m.y += m.vy; m.life -= .008;
      const g = x.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
      g.addColorStop(0, `rgba(190,215,255,${m.life})`); g.addColorStop(1, "rgba(190,215,255,0)");
      x.globalAlpha = 1; x.strokeStyle = g; x.lineWidth = 1.4; x.beginPath(); x.moveTo(m.x, m.y); x.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); x.stroke();
      if (m.life <= 0 || m.y > H) M.splice(i, 1); }
    requestAnimationFrame(draw);
  })();
}

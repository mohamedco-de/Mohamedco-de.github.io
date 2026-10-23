(function(){
"use strict";
  (function () {
    const cur = document.getElementById("cursor");
    const dot = document.getElementById("cursorDot");
    if (!cur || !dot || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, shown = false;
    document.addEventListener("mousemove", e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate3d(" + mx + "px," + my + "px,0) translate(-50%,-50%)";
      if (!shown) { shown = true; cx = mx; cy = my; document.body.classList.add("cursor-on"); }
    });
    document.addEventListener("mouseleave", () => { shown = false; document.body.classList.remove("cursor-on"); });
    document.addEventListener("mousedown", () => document.body.classList.add("cursor-down"));
    document.addEventListener("mouseup", () => document.body.classList.remove("cursor-down"));
    (function loop() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cur.style.transform = "translate3d(" + cx + "px," + cy + "px,0) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    const hoverSel = "a,button,input,textarea,select,[role='button'],.project-card,.stack-item,.rm-card,.pend-card";
    document.addEventListener("mouseover", e => { if (e.target.closest(hoverSel)) document.body.classList.add("cursor-hover"); });
    document.addEventListener("mouseout", e => { if (e.target.closest(hoverSel)) document.body.classList.remove("cursor-hover"); });
  })();
})();

(function(){
"use strict";
  (function(){
    const card = document.getElementById("pendCard");
    const pendulum = document.getElementById("pendulum");
    if (!card || !pendulum) return;
    let isDragging = false, startX = 0, currentRotation = 0;
    card.addEventListener("mousedown", e => {
      isDragging = true;
      startX = e.clientX;
      card.style.cursor = "grabbing";
    });
    document.addEventListener("mousemove", e => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      currentRotation = Math.max(-25, Math.min(25, dx * .3));
      pendulum.style.transform = `rotate(${currentRotation}deg)`;
      pendulum.style.transformOrigin = "center top";
    });
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      card.style.cursor = "grab";
      // Spring back
      const spring = () => {
        currentRotation *= .85;
        if (Math.abs(currentRotation) < .1) { currentRotation = 0; pendulum.style.transform = ""; return; }
        pendulum.style.transform = `rotate(${currentRotation}deg)`;
        pendulum.style.transformOrigin = "center top";
        requestAnimationFrame(spring);
      };
      spring();
    });
    // Touch support
    card.addEventListener("touchstart", e => { isDragging = true; startX = e.touches[0].clientX; }, {passive:true});
    document.addEventListener("touchmove", e => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      currentRotation = Math.max(-25, Math.min(25, dx * .3));
      pendulum.style.transform = `rotate(${currentRotation}deg)`;
      pendulum.style.transformOrigin = "center top";
    }, {passive:true});
    document.addEventListener("touchend", () => {
      if (!isDragging) return;
      isDragging = false;
      const spring = () => {
        currentRotation *= .85;
        if (Math.abs(currentRotation) < .1) { currentRotation = 0; pendulum.style.transform = ""; return; }
        pendulum.style.transform = `rotate(${currentRotation}deg)`;
        pendulum.style.transformOrigin = "center top";
        requestAnimationFrame(spring);
      };
      spring();
    });
  })();
})();

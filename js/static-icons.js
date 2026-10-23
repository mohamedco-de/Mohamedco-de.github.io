(function(){
"use strict";
  const {UI} = window.PF;
  (function(){
    const set=(sel,svg)=>document.querySelectorAll(sel).forEach(el=>el.innerHTML=svg);
    set("#themeToggle",UI.sun); set("#mobileToggle",UI.menu); set("#mobileClose",UI.x);
    set(".contact-row .arrow",UI.arrow); set(".pend-card .avatar",UI.code);
  })();
})();

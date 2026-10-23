(function(){
"use strict";
  document.getElementById("mobileToggle").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.add("open");
  });
  document.getElementById("mobileClose").addEventListener("click", () => {
    document.getElementById("mobileMenu").classList.remove("open");
  });
  document.querySelectorAll(".mobile-menu a").forEach(a => {
    a.addEventListener("click", () => document.getElementById("mobileMenu").classList.remove("open"));
  });
})();

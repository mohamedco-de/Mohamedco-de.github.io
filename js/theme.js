(function(){
"use strict";
  const {UI} = window.PF;
  const themeBtn = document.getElementById("themeToggle");
  themeBtn.addEventListener("click", () => {
    const html = document.documentElement;
    const isDark = html.classList.contains("dark");
    html.classList.toggle("dark", !isDark);
    html.classList.toggle("light", isDark);
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    themeBtn.innerHTML = isDark ? UI.moon : UI.sun;
  });
})();

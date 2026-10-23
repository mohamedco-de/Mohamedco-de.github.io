(function(){
"use strict";
  const header = document.getElementById("header");
  const scrollProgress = document.getElementById("scrollProgress");
  const roadmapFill = document.getElementById("roadmapFill");
  const navLinks = document.querySelectorAll(".header-nav a");

  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 50);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? y / max : 0;
    scrollProgress.style.transform = `scaleX(${pct})`;

    // Active nav
    let current = "";
    document.querySelectorAll("section[id]").forEach(s => {
      if (y >= s.offsetTop - 300) current = s.id;
    });
    navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + current));

    // Roadmap line fill
    const rmSection = document.getElementById("roadmap");
    if (rmSection) {
      const rmTop = rmSection.offsetTop;
      const rmH = rmSection.offsetHeight;
      if (y > rmTop - window.innerHeight && y < rmTop + rmH) {
        roadmapFill.classList.add("animate");
      }
    }
  });
})();

(function(){
"use strict";
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        revealObserver.unobserve(e.target);
      }
    });
  }, {threshold: 0.1, rootMargin: "0px 0px -50px 0px"});
  function observeReveals() {
    document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
  }
  observeReveals();
})();

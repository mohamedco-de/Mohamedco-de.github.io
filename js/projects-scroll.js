/* ============ HORIZONTAL PROJECTS SCROLL (sticky + scroll progress) ============
   الفكرة: بدل ما نمسك الـ wheel ونمنع السكرول (وهذا الي كان يعلّقك)،
   نعطي القسم طول إضافي = المسافة الي تحتاجها الكروت، والسكرول العادي
   يحرك الكروت أفقياً. لمن تخلص الكروت السكرول يكمل طبيعي للقسم الي بعده. */
(function () {
  "use strict";
  const pin    = document.getElementById("projectsPin");
  const sticky = document.getElementById("projectsScroll");
  const track  = document.getElementById("projectsTrack");
  if (!pin || !sticky || !track) return;

  // بالجوال / تقليل الحركة: CSS يخليها سكرول أفقي عادي بدون تثبيت
  const simple = window.matchMedia("(max-width: 768px), (prefers-reduced-motion: reduce)");
  let distance = 0, queued = false;

  function measure() {
    if (simple.matches) {
      pin.style.height = "";
      track.style.transform = "";
      distance = 0;
      return;
    }
    distance = Math.max(0, track.scrollWidth - window.innerWidth);
    pin.style.height = (window.innerHeight + distance) + "px";
    update();
  }

  function update() {
    queued = false;
    if (simple.matches || !distance) return;
    const progress = Math.min(Math.max(-pin.getBoundingClientRect().top / distance, 0), 1);
    track.style.transform = "translate3d(" + (-progress * distance) + "px,0,0)";
  }

  function onScroll() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("load", measure);
  if (simple.addEventListener) simple.addEventListener("change", measure);
  if (window.ResizeObserver) new ResizeObserver(measure).observe(track);
  measure();
})();

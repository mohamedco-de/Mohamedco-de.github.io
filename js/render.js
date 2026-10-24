(function(){
"use strict";
  const {STACK, ICONS, UI, ROADMAP} = window.PF;
  const stackEl = document.getElementById("stackCategories");
  STACK.forEach((cat,ci) => {
    const div = document.createElement("div");
    div.className = "reveal";
    div.style.transitionDelay = (ci * .1) + "s";
    div.innerHTML = `
      <div class="stack-cat-header">
        <span class="stack-cat-num">0${ci+1}</span>
        <span class="stack-cat-name">${cat.cat}</span>
      </div>
      <div class="stack-items">
        ${cat.items.map(item => `
          <div class="stack-item">
            <div class="stack-icon">${ICONS[item]||UI.code}</div>
            <div class="stack-label">${item}</div>
          </div>`).join("")}
      </div>`;
    stackEl.appendChild(div);
  });

  /* ============ ROADMAP RENDER ============ */
  const roadmapEl = document.getElementById("roadmapItems");
  ROADMAP.forEach((r,i) => {
    const item = document.createElement("div");
    item.className = "roadmap-item reveal";
    item.style.transitionDelay = (i * .1) + "s";
    item.innerHTML = `
      <div class="rm-content">
        <div class="rm-card">
          <div class="rm-year">${r.year}</div>
          <h3>${r.title}</h3>
          <p>${r.desc}</p>
          <div class="rm-tags">${r.tags.map(t=>`<span class="rm-tag">${t}</span>`).join("")}</div>
        </div>
      </div>
      <div class="rm-dot"></div>
      <div class="rm-deco">${r.year}</div>`;
    roadmapEl.appendChild(item);
  });
})();

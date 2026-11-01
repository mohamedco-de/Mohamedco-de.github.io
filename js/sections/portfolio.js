const tabsDef = [
  ["Achievements", "trophy", () => `<div class="grid3">${DATA.achievements.map(c => `<div class="cert"><img src="${c.img}" alt="" onerror="this.parentNode.remove()"></div>`).join("")}</div>`],
  ["Tech Stack", "cpu", () => `<div class="grid6">${DATA.stack.map(([n, f]) => `<div class="tile"><img src="assets/img/tech/${f}" alt="${n}" title="${n}" onerror="this.style.visibility='hidden'"></div>`).join("")}</div>`]
];
const Portfolio = () => `
<section id="portfolio" class="portfolio">
  <h2 class="sec-title rv">Portfolio</h2>
  <div class="tabs rv">${tabsDef.map(([n, i], k) => `<button class="tab ${k ? "" : "on"}" data-k="${k}">${icon(i, 15)} ${n}</button>`).join("")}</div>
  <div id="tabbody" class="rv">${tabsDef[0][2]()}</div>
</section>`;
function tabsInit() {
  document.querySelectorAll(".tab").forEach(b => b.onclick = () => {
    document.querySelectorAll(".tab").forEach(x => x.classList.toggle("on", x === b));
    const body = document.getElementById("tabbody"); body.style.opacity = 0;
    setTimeout(() => { body.innerHTML = tabsDef[+b.dataset.k][2](); body.style.opacity = 1; }, 160);
  });
}

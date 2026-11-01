const Home = () => `
<section id="home" class="hero">
  <div class="lanyard-space" aria-hidden="true"></div>
  <div class="hero-txt rv">
    <h1><span class="grad">Welcome to</span><br>My Portfolio</h1>
    <div class="role" id="role"></div>
    <p class="lead">${DATA.intro}</p>
    <div class="btns"><a class="btn" href="#portfolio">Lihat Portfolio ${icon("right", 14)}</a><a class="btn ghost" href="#contact">Hubungi Saya ${icon("send", 14)}</a></div>
    <div class="find"><span class="lbl">FIND ME</span>${DATA.links.map(l => `<a class="ibtn" href="${l.url}" target="_blank" rel="noopener" aria-label="${l.name}">${brand(l.key, 15)}</a>`).join("")}</div>
  </div>
  <div id="lanyard"></div>
</section>`;

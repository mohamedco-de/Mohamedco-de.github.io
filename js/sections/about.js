const spotifyRef = v => { const m = String(v).match(/(playlist|album|track|artist|show|episode)[\/:]([A-Za-z0-9]+)/); return m ? { type: m[1], id: m[2] } : { type: "playlist", id: String(v).trim() }; };
const About = () => { const sp = spotifyRef(DATA.music.playlistId); return `
<section id="about" class="about">
  <h2 class="sec-title rv">About Me</h2>
  <div class="about-row rv">
    <div class="about-name"><h3><span class="blue">${DATA.firstLine}</span><br><span class="nm">${DATA.name.replace(/ (?=[^ ]*$)/, "<br>")}</span></h3>
      <a class="btn" href="#contact">${icon("file", 14)} Hubungi Saya</a></div>
    <div class="photo" id="photo"><img src="${DATA.cutout}" alt="${DATA.name}" onerror="this.closest('.photo').style.display='none'"></div>
    <div class="about-txt">${DATA.about.map(t => `<p>${t}</p>`).join("")}<a class="lnk" href="#portfolio">${icon("code", 13)} Lihat Portfolio ${icon("out", 12)}</a></div>
  </div>
  <div class="edu rv">
    <div><h4>Experience</h4>${DATA.experience.map(e => `<div class="row"><img src="${e.logo}" alt="" onerror="this.remove()"><div><b>${e.title}</b><small>${e.sub}</small></div></div>`).join("")}</div>
  </div>
  <div class="stats rv">${DATA.stats.map(s => `<div class="glass stat"><span class="ic">${icon(s.icon, 16)}</span><b data-n="${s.n}">0</b><strong>${s.label}</strong><small>${s.sub}</small></div>`).join("")}</div>
  <div class="music rv">
    <div class="m-txt"><h3>${DATA.music.heading[0].replace(/music\./, "<span class='dim'>music.</span>")}<br><span class="blue">${DATA.music.heading[1]}</span></h3><p>${DATA.music.text}</p>
      <a class="btn ghost" href="https://open.spotify.com/${sp.type}/${sp.id}" target="_blank" rel="noopener">${icon("music", 14)} ${DATA.music.button} ${icon("out", 12)}</a></div>
    <div class="spot-wrap"><iframe class="spot" loading="lazy" title="Spotify" src="https://open.spotify.com/embed/${sp.type}/${sp.id}?utm_source=generator&theme=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe></div>
  </div>
</section>` };

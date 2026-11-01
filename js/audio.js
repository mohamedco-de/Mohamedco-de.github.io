// زر الصوت: يشغّل assets/audio/bgm.mp3 وإن لم يوجد يستخدم صوتاً هادئاً مولّداً. + نقرة عند الضغط.
const Sound = (() => {
  let on = false, ctx, master, bgm, synth = false;
  const synthSetup = () => {
    ctx = new (window.AudioContext || window.webkitAudioContext)(); master = ctx.createGain(); master.gain.value = 0;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 650;
    [110, 165, 220.7, 329.6].forEach((f, k) => { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.value = .22 / (k + 1); o.connect(g).connect(lp); o.start(); });
    lp.connect(master).connect(ctx.destination);
  };
  const blip = () => { if (!on || !ctx) return; const o = ctx.createOscillator(), g = ctx.createGain(); o.type = "triangle"; o.frequency.value = 720;
    g.gain.setValueAtTime(.05, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .12); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .13); };
  const init = () => {
    const b = document.getElementById("snd"), set = () => { b.innerHTML = icon(on ? "vol" : "mute", 15); b.setAttribute("aria-pressed", on); };
    set(); bgm = new Audio(DATA.bgm); bgm.loop = true; bgm.volume = .5;
    bgm.addEventListener("error", () => { synth = true; });
    b.onclick = async () => {
      on = !on; set();
      if (!ctx) { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      if (on) { try { await bgm.play(); synth = false; } catch { synth = true; } if (synth) { if (!master) synthSetup(); ctx.resume(); master.gain.linearRampToValueAtTime(.14, ctx.currentTime + .8); } }
      else { bgm.pause(); if (master) master.gain.linearRampToValueAtTime(0, ctx.currentTime + .4); }
    };
    document.addEventListener("click", e => { if (e.target.closest("a,.tab,.btn,.glass")) blip(); });
  };
  return { init };
})();

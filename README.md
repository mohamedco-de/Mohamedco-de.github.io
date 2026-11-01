<div align="center">

# ✨ Interactive 3D Portfolio ✨

### *A cosmic, physics-powered personal website — zero build step, zero dependencies to install.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![No Build](https://img.shields.io/badge/Build%20Step-None-brightgreen?style=for-the-badge)

**Starfield · Shooting Stars · Hanging 3D ID Card · Liquid-Glass Nav · Ambient Audio**

</div>

---

## 🌌 What is this?

A single-page portfolio that feels more like a tiny universe than a website.
Drag the **physics-based lanyard card**, watch **meteors streak across the sky**, and navigate through a **liquid-glass** navbar — all in plain HTML, CSS and vanilla JavaScript.

No bundler. No framework. No `node_modules`. Just open it and it works.

## 🔥 Features

| | Feature | Details |
|---|---|---|
| 🪪 | **3D Lanyard Card** | A hanging ID card built with Three.js, with real rope physics. Grab it, swing it, throw it. |
| 🌠 | **Living Starfield** | Animated stars and random shooting stars on a canvas background. |
| 🧊 | **Liquid-Glass Navbar** | SVG turbulence + displacement filter for a real glass-warp effect. |
| ⌨️ | **Typewriter Roles** | Rotating job titles typed out in the hero section. |
| 🎬 | **Scroll Reveals** | Sections animate in as you reach them. |
| 🔊 | **Sound Toggle** | Optional background music with a one-tap mute button. |
| 📬 | **Working Contact Form** | Sends straight to your inbox through FormSubmit — no backend needed. |
| 🧩 | **Tech Stack Grid** | 60+ ready-made tech icons included. |
| 📱 | **Responsive** | Looks right on phones, tablets and desktops. |
| ✏️ | **One-File Content** | Change *everything* from `js/data.js`. |

## 🚀 Quick Start

```bash
# 1. Serve it locally (any static server works)
npx serve

# 2. Open the URL it prints, usually http://localhost:3000
```

Or skip the terminal entirely: drag the folder onto **Netlify Drop**, or push it to **GitHub Pages / Vercel**.

> ⚠️ Open it through a server, not by double-clicking `index.html` — some browsers block assets and the 3D card on `file://`.

## 🛠️ Make It Yours (2 minutes)

Everything you'll ever want to change lives in **one file**: [`js/data.js`](js/data.js).

```js
const DATA = {
  name: "Your Name",
  roles: ["3D Creative Developer", "React & Three.js Enthusiast"],
  intro: "A short, punchy sentence about you.",
  cutout: "assets/img/me-cutout.png",  // transparent PNG of you
  photo:  "assets/img/me.jpg",         // photo printed on the 3D card
  email:  "you@example.com",           // where contact messages arrive
  // ...stats, experience, education, tech stack, social links
};
```

**Your photos**

| File | Purpose |
|---|---|
| `assets/img/me-cutout.png` | Your photo with a transparent background (hero/about) |
| `assets/img/me.jpg` | The picture printed on the hanging card |

**Contact form activation (one time only)**

1. Set `email` in `js/data.js` to your real address.
2. Send one test message from the live site.
3. Open the activation email from **FormSubmit** and confirm. Done — it works forever after.

**Background music (optional):** drop a file at `assets/audio/bgm.mp3` and the sound button will light up.

## 🗂️ Project Structure

```
portfolio/
├── index.html              # The page shell (loads Three.js from CDN)
├── css/
│   ├── base.css            # Colors, loader, navbar, buttons
│   └── sections.css        # Hero, About, Portfolio, Contact, Footer
├── js/
│   ├── data.js             # ⭐ ALL your content — edit only this
│   ├── main.js             # Routing, typewriter, scroll effects
│   ├── starfield.js        # Stars & shooting stars
│   ├── lanyard.js          # 3D hanging card (Three.js + physics)
│   ├── audio.js            # Sound toggle
│   ├── fx.js               # Extra visual effects
│   ├── icons.js            # Inline SVG icons
│   └── sections/           # One file per section
│       ├── home.js
│       ├── about.js
│       ├── portfolio.js
│       └── contact.js
└── assets/
    ├── img/                # Your photos + tech/ icon library
    └── audio/              # bgm.mp3 (optional)
```

## 🧠 Under the Hood

- **Rendering:** the lanyard is drawn with Three.js r128 and falls back gracefully if WebGL is unavailable.
- **Physics:** a lightweight rope simulation drives the card's swing and drag.
- **Glass effect:** `feTurbulence` → `feGaussianBlur` → `feDisplacementMap` in an inline SVG filter.
- **Architecture:** each section is a tiny JS module that renders into `#view`; `main.js` swaps them on navigation.
- **Hosting:** 100% static. Any host that serves files will do.

## 🌍 Deploy

| Platform | How |
|---|---|
| **Netlify** | Drag & drop the folder at app.netlify.com/drop |
| **Vercel** | `npx vercel` inside the folder |
| **GitHub Pages** | Push, then Settings → Pages → select your branch |
| **Cloudflare Pages** | Connect the repo, leave the build command empty |

## 🧯 Troubleshooting

- **Blank 3D card?** Make sure you're on a server (not `file://`) and have internet access for the Three.js CDN.
- **Tech icons missing?** Icons load from local `assets/img/tech/`; check the file name matches the one in `data.js`.
- **No contact emails?** Confirm the one-time FormSubmit activation email (check spam).
- **No sound?** Browsers require a click before audio can play — press the speaker button.

## 🇸🇦 بالعربي باختصار

1. شغّل المشروع: `npx serve`
2. عدّل كل محتواك من ملف واحد فقط: `js/data.js`
3. غيّر صورك في `assets/img/` (`me-cutout.png` شفافة، و`me.jpg` للبطاقة)
4. فعّل الإيميل مرة وحدة من رسالة FormSubmit
5. ارفعه على Netlify أو Vercel أو GitHub Pages، وخلص 🚀

---

<div align="center">

**Built with curiosity, caffeine, and a lot of stars. ⭐**

*If you like it, give it a star and make it your own.*

</div>

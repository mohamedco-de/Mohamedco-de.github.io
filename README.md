<div align="center">

# MOHAMED DEV

### Full-Stack Developer & Creative Engineer

*Building digital experiences that feel alive.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222?style=for-the-badge&logo=github&logoColor=white)

</div>

---

## About the Site

This is my personal portfolio: a single-page, dark-first website that shows who I am, what I build, and the tools I use. It is built with **pure HTML, CSS and vanilla JavaScript**. No frameworks, no build step, no dependencies, so it loads fast and deploys anywhere.

I build **web applications**, **Discord bots and automation systems**, **APIs**, and **AI-powered tools**. This site is a small showcase of that same attention to detail: smooth motion, clean layout, and performance without compromise.

---

## Sections

| # | Section | What it shows |
|---|---------|---------------|
| 00 | **Home** | Animated hero with scrolling image columns, particle canvas, a typing roles line, quick stats and quick links |
| 01 | **About** | Who I am, plus a draggable pendulum and a scrolling keyword marquee |
| 02 | **Stack** | 40+ technologies grouped into Frontend, Backend, Databases and Tools |
| 03 | **Roadmap** | A timeline of my journey from 2021 to 2026, with a progress line that fills as you scroll |
| 04 | **Contact** | Email, Discord and GitHub links |

> The Projects section has been removed. The navigation, mobile menu and hero buttons no longer link to it.

---

## Features

- **Preloader** with an animated ring
- **Dark and light theme** toggle
- **Custom cursor** that follows the mouse
- **Scroll progress bar** at the top of the page
- **Scroll-reveal animations** on every section
- **Particle canvas** in the hero
- **Hero extras** that fill the space on mobile: a floating code card (`mohamed.js`), a status tag, a typing line that cycles through my roles, and a row of quick stats
- **Draggable pendulum** in the About section
- **Animated roadmap** timeline
- **Decorative headings:** only titles use the ornate font, everything else stays in a clean sans-serif
- **Fully responsive**, with a mobile menu for small screens. The email and footer links stay on a single line on phones

---

## Typography

| Where | Font |
|-------|------|
| Headings (logo, hero title, section titles, stack categories, roadmap cards, About intro) | **Cinzel Decorative** |
| Body text, navigation, buttons, contact and footer links | **Inter** |
| Small labels and counters | **JetBrains Mono** |

Fonts load from Google Fonts in `partials/00-head.html` and `index.html`. If a browser blocks Google Fonts, the page falls back to a default serif or sans-serif font.

---

## Tech Stack Shown on the Site

**Frontend:** React, Next.js, Vue.js, Svelte, Tailwind CSS, TypeScript, JavaScript, Vite, HTML5, CSS3, Framer Motion, Bootstrap

**Backend:** Node.js, Express.js, NestJS, Python, Django, FastAPI, Go, Discord.js, GraphQL, REST API

**Databases and ORMs:** MongoDB, PostgreSQL, MySQL, Redis, SQLite, Prisma, Firebase, Supabase

**Tools and Infrastructure:** Git, GitHub, Docker, Linux, Cloudflare, Vercel, AWS, Figma, Postman, Bash, Nginx

---

## File Structure

The site is split into small files, each with one clear job. There is still no framework and no build step.

```
.
├── index.html          The page that is served (all sections in one file)
├── partials/           The same sections as separate HTML pieces
├── css/                One stylesheet per section (base, header, hero, about, ...)
├── js/                 One script per feature
│   └── data/           Lists that fill the page (stack, icons, roadmap)
├── assets/img/         Hero images
├── style.css           Old single-file stylesheet (not used by index.html)
├── script.js           Old single-file script (not used by index.html)
└── README.md           This file
```

`index.html` loads the files in `css/` and `js/`. If you edit a section in `partials/`, make the same change in `index.html`, because that is the file the browser opens.

### `css/`

| File | Purpose |
|------|---------|
| `base.css` | Colors for both themes, body font, scrollbar, scroll progress bar |
| `header.css` | Header, navigation and mobile menu |
| `hero.css` | Hero layout, hero extras (code card, tag, roles line, stats) and mobile rules |
| `about.css`, `stack.css`, `roadmap.css`, `contact.css`, `footer.css` | One file per section |
| `marquee.css`, `sections.css`, `preloader.css`, `cursor.css`, `utilities.css` | Shared pieces |

### `js/`

| File | Purpose |
|------|---------|
| `data/stack.js`, `data/icons.js`, `data/ui-icons.js`, `data/roadmap.js` | The lists that fill the page |
| `render.js` | Builds the Stack and Roadmap sections from that data |
| `reveal.js` | Fades elements in as they enter the screen |
| `preloader.js`, `header-scroll.js` | Intro animation and the header changing on scroll |
| `theme.js`, `mobile-menu.js` | Theme toggle and mobile menu |
| `cursor.js` | The animated cursor and dot |
| `pendulum.js` | The draggable physics element in About |
| `hero-particles.js` | The canvas particle animation |
| `hero-roles.js` | The typing line in the hero (respects reduced-motion settings) |

---

## Run It Locally

No install needed. Just open the site:

```bash
# Option 1: open the file directly
open index.html

# Option 2: serve it locally
npx serve .
# or
python -m http.server 8000
```

---

## Deploy on GitHub Pages

1. Upload the whole project (`index.html`, `css/`, `js/`, `assets/`) to a repository.
2. Go to **Settings, then Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder.
4. Save. After a minute your site is live at `https://<your-username>.github.io/`.

For a root address like that, name the repository `<your-username>.github.io`.

### Custom domain (optional)

To use a free `is-a.dev` subdomain:

1. Register it with a pull request to the `is-a-dev/register` repository, adding `domains/<name>.json` that points a `CNAME` record to `<your-username>.github.io`.
2. Add a file named `CNAME` (no extension) to the root of this repository, containing only your domain, for example `mohamedco-de.is-a.dev`.
3. After the pull request is merged and DNS has propagated (up to 24 hours), set the same domain under **Settings, then Pages, then Custom domain** and turn on **Enforce HTTPS**.

---

## Make It Yours

- **Add or remove technologies:** edit `js/data/stack.js`
- **Edit the timeline:** change the entries in `js/data/roadmap.js`
- **Change the typing roles in the hero:** edit the `roles` list in `js/hero-roles.js`
- **Change the hero stats and code card:** edit the hero block in `index.html` (and `partials/05-hero.html`)
- **Change fonts:** update the Google Fonts link in `index.html`, then the `font-family` rules in `css/`
- **Change contact links:** edit the Contact and footer sections in `index.html`

---

## Contact

- **GitHub:** [github.com/Mohamedco-de](https://github.com/Mohamedco-de)
- **Discord:** [Join the server](https://discord.gg/ec-s)
- **Email:** elbanamohmed37@gmail.com

---

<div align="center">

**Designed and built by Mohamed**

*© 2026 Mohamed Dev. All rights reserved.*

</div>

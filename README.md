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
| 00 | **Home** | Animated hero with scrolling image columns, particle canvas, and quick links |
| 01 | **About** | Who I am, plus a draggable pendulum and a scrolling keyword marquee |
| 02 | **Stack** | 40+ technologies grouped into Frontend, Backend, Databases and Tools |
| 03 | **Projects** | A horizontally scrolling gallery of project cards |
| 04 | **Roadmap** | A timeline of my journey from 2021 to 2026, with a progress line that fills as you scroll |
| 05 | **Contact** | Email, Discord and GitHub links |

---

## Features

- **Preloader** with an animated ring
- **Dark and light theme** toggle
- **Custom cursor** that follows the mouse
- **Scroll progress bar** at the top of the page
- **Scroll-reveal animations** on every section
- **Particle canvas** in the hero
- **Draggable pendulum** in the About section
- **Horizontal scroll** for the projects gallery
- **Animated roadmap** timeline
- **Fully responsive**, with a mobile menu for small screens

---

## Tech Stack Shown on the Site

**Frontend:** React, Next.js, Vue.js, Svelte, Tailwind CSS, TypeScript, JavaScript, Vite, HTML5, CSS3, Framer Motion, Bootstrap

**Backend:** Node.js, Express.js, NestJS, Python, Django, FastAPI, Go, Discord.js, GraphQL, REST API

**Databases and ORMs:** MongoDB, PostgreSQL, MySQL, Redis, SQLite, Prisma, Firebase, Supabase

**Tools and Infrastructure:** Git, GitHub, Docker, Linux, Cloudflare, Vercel, AWS, Figma, Postman, Bash, Nginx

---

## File Structure

The whole site is made of three files, each with one clear job.

```
.
├── index.html      Page structure and content
├── style.css       All styling, themes and animations
├── script.js       All behavior and the site data
└── README.md       This file
```

### `index.html`
The markup for every section: preloader, header and navigation, mobile menu, hero, marquee, About, Stack, Projects, Roadmap, Contact and footer. The hero images are embedded directly in the file, which is why it is larger than the other two.

### `style.css`
Everything visual: layout, typography, colors for both themes, hover effects, reveal animations, the custom cursor, and the responsive rules for mobile and tablet.

### `script.js`
Split into clear blocks, so each feature is easy to find:

| Block | Purpose |
|-------|---------|
| **DATA** | The `STACK`, `ICONS`, `PROJECTS` and `ROADMAP` lists that fill the page |
| **Renderers** | Build the Stack, Projects and Roadmap sections from that data |
| **Scroll reveal** | Fades elements in as they enter the screen |
| **Preloader and header** | Intro animation and the header changing on scroll |
| **Theme toggle** | Switches between dark and light |
| **Mobile menu** | Opens and closes the menu on small screens |
| **Custom cursor** | The animated cursor and dot |
| **Pendulum** | The draggable physics element in About |
| **Projects scroll** | Turns vertical scrolling into horizontal movement |
| **Hero particles** | The canvas particle animation |

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

1. Upload `index.html`, `style.css` and `script.js` to a repository.
2. Go to **Settings, then Pages**.
3. Under **Source**, choose the `main` branch and the `/ (root)` folder.
4. Save. After a minute your site is live at `https://<your-username>.github.io/`.

For a root address like that, name the repository `<your-username>.github.io`.

---

## Make It Yours

All the content you are likely to change lives in `script.js`, near the top:

- **Add or remove technologies:** edit the `STACK` list
- **Add a project:** add a line to `PROJECTS` with a name, category, year and color
- **Edit the timeline:** change the entries in `ROADMAP`
- **Change contact links:** edit the Contact and footer sections in `index.html`
- **Replace the footer placeholders:** swap `YOUR_GITHUB_URL` and `YOUR_PORTFOLIO_URL` in `index.html` for your real links

---

## Contact

- **GitHub:** [github.com/saicoa](https://github.com/saicoa)
- **Discord:** [Join the server](https://discord.gg/a9cKSpeDNj)
- **Email:** saicodisx@gmail.com

---

<div align="center">

**Designed and built by Mohamed**

*© 2026 Mohamed Dev. All rights reserved.*

</div>

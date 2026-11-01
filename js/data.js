// ===== كل المحتوى هنا. عدّل هذا الملف فقط =====
const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
const DATA = {
  name: "Mohamed",
  firstLine: "Hi, I'm",
  roles: ["3D Creative Developer", "React & Three.js Enthusiast", "Junior Developer"],
  intro: "Berawal dari rasa penasaran, sekarang jadi passion. Aku suka bereksperimen dengan kode, mengeksplorasi teknologi baru, dan mengubah ide menjadi sesuatu yang nyata. Dari tampilan web yang menarik sampai interaksi 3D yang seru, aku selalu berusaha bikin sesuatu yang bukan cuma keren dilihat, tapi juga nyaman digunakan.",
  about: [
    "Saya adalah <b>Junior Developer</b> yang berfokus pada pengembangan teknologi yang fungsional sekaligus menarik. Saya senang memadukan kode, desain, dan pengalaman 3D untuk membangun produk digital yang berkesan.",
    "Dengan React, Three.js, dan teknologi web modern, saya mengubah ide menjadi pengalaman digital yang intuitif, responsif, dan berdampak."
  ],
  cutout: "assets/img/me-cutout.png",   // صورتك بدون خلفية (PNG شفاف)
  photo: "assets/img/me.jpg",           // صورة البطاقة
  cardSide: "TEKNIK JARINGAN",          // النص العمودي على البطاقة
  email: "elbanamohmed37@gmail.com",   // الرسائل تُرسل لهذا الإيميل عبر FormSubmit (أول رسالة تحتاج تفعيل مرة وحدة من إيميلك)
  formId: "",                           // اتركه فاضي. لو عندك المعرّف الطويل من إيميل التفعيل حطّه هنا
  experience: [{ logo: "assets/img/exp1.png", title: "Universitas Your Uni", sub: "Admin" }],
  stats: [
    { icon: "trophy", label: "AWARDS", sub: "Pencapaian diraih", n: 1 }
  ],
  music: {
    heading: ["A little music.", "A lot of ideas."],
    text: "Musik yang menemani proses saya mengubah ide menjadi sesuatu yang nyata. Intip playlist yang sedang sering saya putar.",
    button: "Daily Rotation di Spotify",
    playlistId: "37i9dQZF1DXcBWIGoYBM5M"   // غيّره لمعرّف قائمتك في Spotify
  },
  bgm: "assets/audio/bgm.mp3",           // موسيقى زر الصوت (اختياري، وإلا يستخدم صوت مولّد)
  links: [
    { key: "github", name: "GitHub", handle: "@mohamedco-de", url: "https://github.com/mohamedco-de" },
    { key: "instagram", name: "Instagram", handle: "@elbanaa_xx1", url: "https://www.instagram.com/elbanaa_xx1?xtok=NzZyMXA0YXJuNmRj" },
    { key: "tiktok", name: "TikTok", handle: "@elbana_x2", url: "https://tiktok.com/elbana_x2" }
  ],
  achievements: [{ img: "assets/img/a1.png" }],
  stack: [   // الأيقونات في assets/img/tech/ — [الاسم، اسم الملف]
    ["AWS", "amazonwebservices.svg"],
    ["Android Studio", "androidstudio.svg"],
    ["ASP.NET", "aspnet.svg"],
    ["Bootstrap", "bootstrap.svg"],
    ["Bun", "bun.svg"],
    ["Cloudflare", "cloudflare.svg"],
    ["C#", "csharp.svg"],
    ["CSS3", "css3.svg"],
    ["Dart", "dart.svg"],
    ["Debian", "debian.svg"],
    ["Discord.js", "discordjs.svg"],
    ["Django", "django.svg"],
    ["Docker", "docker.svg"],
    ["Express", "express.svg"],
    ["FastAPI", "fastapi.svg"],
    ["Figma", "figma.svg"],
    ["Firebase", "firebase.svg"],
    ["Flutter", "flutter.svg"],
    ["Framer Motion", "framermotion.svg"],
    ["Git", "git.svg"],
    ["GitHub", "github.svg"],
    ["Bash", "gnubash.svg"],
    ["Go", "go.svg"],
    ["Google Cloud", "googlecloud.svg"],
    ["Gradle", "gradle.svg"],
    ["GraphQL", "graphql.svg"],
    ["HTML5", "html5.svg"],
    ["Java", "java.svg"],
    ["JavaScript", "javascript.svg"],
    ["Kotlin", "kotlin.svg"],
    ["Laravel", "laravel.svg"],
    ["Linux", "linux.svg"],
    ["MongoDB", "mongodb.svg"],
    ["MySQL", "mysql.svg"],
    ["Neon", "neon.png"],
    ["NestJS", "nestjs.svg"],
    ["Next.js", "nextjs.svg"],
    ["Nginx", "nginx.svg"],
    ["Node.js", "nodejs.svg"],
    ["Nuxt", "nuxtdotjs.svg"],
    ["PHP", "php.svg"],
    ["PostgreSQL", "postgresql.svg"],
    ["Postman", "postman.svg"],
    ["Prisma", "prisma.svg"],
    ["Python", "python.svg"],
    ["React", "react.svg"],
    ["Redis", "redis.svg"],
    ["Redux", "redux.svg"],
    ["Rust", "rust.svg"],
    ["Sass", "sass.svg"],
    ["SQLite", "sqlite.svg"],
    ["Supabase", "supabase.svg"],
    ["Svelte", "svelte.svg"],
    ["Tailwind CSS", "tailwindcss.svg"],
    ["Tauri", "tauri.svg"],
    ["TypeScript", "typescript.svg"],
    ["Vercel", "vercel.svg"],
    ["Vite", "vite.svg"],
    ["Vue.js", "vuedotjs.svg"],
    ["Windows", "windows.svg"]
  ],
  comments: [{ name: "alfariyusuff_", text: "Hali wellcome to my portfolio website 👋", t: Date.now() - 2 * 864e5, avatar: "" }]
};

/**
 * Personal Portfolio and Project Showroom Data Configuration
 * 
 * TO ADD A NEW PROJECT OR CHANGE DETAILS:
 * Edit this file only! No need to touch index.html, style.css, or script.js.
 */

const CONFIG = {
  // Developer brand & contact
  name: "Alex Rivera",
  tagline: "I build responsive web apps, high-performance websites & interactive browser games.",
  about: "I am an independent full-stack developer crafting clean, fast, and scalable digital products. Every project in this showroom is live and fully interactive inside your browser. Several turnkey apps and websites are available for direct purchase with complete, clean source code.",
  
  // WhatsApp Number: country code + number, NO plus sign, NO spaces, NO dashes.
  // Example for US (+1 555-234-5678): "15552345678"
  // Example for India (+91 98765-43210): "919876543210"
  whatsappNumber: "15552345678",
  
  // Contact & Socials
  email: "alex.rivera.developer@gmail.com",
  instagram: "https://instagram.com/alexrivera_dev",
  githubUrl: "https://github.com/alexrivera",
  
  // Skills list shown in About section
  skills: [
    "HTML5 & Modern JavaScript",
    "React & Next.js",
    "Tailwind CSS",
    "HTML5 Canvas & 2D Games",
    "Node.js & Express",
    "REST & GraphQL APIs",
    "WebRTC & MediaDevices",
    "Mobile-First Responsive UI"
  ]
};

const PROJECTS = [
  {
    id: "bazario",
    title: "Bazario",
    type: "app", // "app" | "website" | "game"
    description: "Mobile-first e-commerce marketplace app with real-time cart, catalog browsing, and instant WhatsApp ordering.",
    techStack: ["React", "Tailwind CSS", "LocalStorage", "WhatsApp API"],
    liveUrl: "./demos/bazario.html",
    demoVideoUrl: "",
    apkUrl: "https://github.com/example/bazario/releases/download/v1.0/bazario-release.apk",
    thumbnail: "", // Left empty to showcase automated gradient card with title initials
    forSale: true,
    price: "Rs 15,000",
    needsCamera: false,
    featured: true
  },
  {
    id: "veloce",
    title: "VELOCE typing test",
    type: "website",
    description: "Minimalist high-speed typing speed trainer featuring real-time WPM calculation, accuracy metrics, and keyboard analytics.",
    techStack: ["JavaScript", "HTML5 Canvas", "Web Audio API", "CSS Grid"],
    liveUrl: "./demos/veloce.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: false,
    price: "",
    needsCamera: false,
    featured: true
  },
  {
    id: "novatek",
    title: "Novatek tech store",
    type: "website",
    description: "Dark-mode commercial electronics storefront with hardware filtering, spec breakdowns, and inquiry checkout.",
    techStack: ["HTML5", "CSS3", "Vanilla JS", "Responsive Design"],
    liveUrl: "./demos/novatek.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: true,
    price: "Rs 28,000",
    needsCamera: false,
    featured: false
  },
  {
    id: "gestnova",
    title: "GestNova",
    type: "website",
    description: "In-browser computer vision experiment utilizing real-time optical tracking and gesture motion detection directly from your webcam.",
    techStack: ["WebRTC", "MediaDevices API", "Canvas 2D", "Vanilla JS"],
    liveUrl: "./demos/gestnova.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: false,
    price: "",
    needsCamera: true,
    featured: false
  },
  {
    id: "racing-game",
    title: "Racing game",
    type: "game",
    description: "Retro arcade highway speed racer with responsive touch and keyboard steering, dynamic traffic spawns, and high-score survival.",
    techStack: ["HTML5 Canvas", "requestAnimationFrame", "Web Audio API", "Mobile Touch"],
    liveUrl: "./demos/racing.html",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    apkUrl: "https://github.com/example/racing-game/releases/download/v1.0/neon-racer.apk",
    thumbnail: "",
    forSale: true,
    price: "Rs 12,500",
    needsCamera: false,
    featured: false
  }
];

// Global availability across vanilla scripts and bundlers
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
  window.PROJECTS = PROJECTS;
}

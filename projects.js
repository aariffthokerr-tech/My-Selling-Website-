/**
 * Personal Portfolio and Project Showroom Data Configuration
 * 
 * EDIT THIS FILE ONLY to update:
 * - Your WhatsApp number, phone, email, and social links
 * - Your name and about biography
 * - Projects list, statuses ("available", "sold", "coming-soon"), and prices
 * - Services offered and starting prices
 * - FAQ accordion questions and answers
 * - Client testimonials
 */

const CONFIG = {
  // Developer brand & contact
  name: "Alex Rivera",
  tagline: "I build responsive web apps, high-performance websites & interactive browser games.",
  about: "I am an independent full-stack developer crafting clean, fast, and scalable digital products. Every project in this showroom is live and fully interactive inside your browser. Several turnkey apps and websites are available for direct purchase with complete, clean source code.",
  
  // WhatsApp Number: Country code + number, DIGITS ONLY, NO plus sign, NO spaces, NO dashes.
  whatsappNumber: "916003428863",
  displayPhone: "+91 6003428863",
  
  // Contact & Socials
  email: "alex.rivera.developer@gmail.com",
  instagram: "https://instagram.com/alexrivera_dev",
  githubUrl: "https://github.com/alexrivera",
  
  // Last updated indicator
  lastUpdated: "October 2026",
  
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
    id: "veloce",
    title: "VELOCE typing test",
    type: "website", // "app" | "website" | "game"
    status: "available", // "available" | "sold" | "coming-soon"
    description: "Minimalist high-speed typing speed trainer featuring real-time WPM calculation, accuracy metrics, and keyboard analytics.",
    techStack: ["JavaScript", "HTML5 Canvas", "Web Audio API", "CSS Grid"],
    liveUrl: "./demos/veloce.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "", // Left empty for automatic gradient card with title initials
    forSale: true,
    price: "Rs 15,000",
    needsCamera: false,
    featured: true,
    date: "2026-09-15"
  },
  {
    id: "taskflow",
    title: "TaskFlow Kanban",
    type: "app",
    status: "available",
    description: "Agile sprint management workspace with real-time column sorting, card reordering, and team collaboration export.",
    techStack: ["React", "Tailwind CSS", "LocalStorage", "WhatsApp API"],
    liveUrl: "./demos/taskflow.html",
    demoVideoUrl: "",
    apkUrl: "https://github.com/example/taskflow/releases/download/v1.0/taskflow-release.apk",
    thumbnail: "",
    forSale: true,
    price: "Rs 18,000",
    needsCamera: false,
    featured: true,
    date: "2026-09-01"
  },
  {
    id: "docuforge",
    title: "DocuForge API Studio",
    type: "website",
    status: "sold", // Demonstrates the grey "Sold" badge and disabled buy button
    description: "Developer API documentation portal with interactive endpoint tabs, payload schemas, and telemetry query tools.",
    techStack: ["HTML5", "CSS3", "Vanilla JS", "Responsive Design"],
    liveUrl: "./demos/novatek.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: true,
    price: "Rs 28,000",
    needsCamera: false,
    featured: false,
    date: "2026-08-20"
  },
  {
    id: "gestnova",
    title: "GestNova",
    type: "website",
    status: "available",
    description: "In-browser computer vision experiment utilizing real-time optical tracking and gesture motion detection directly from your webcam.",
    techStack: ["WebRTC", "MediaDevices API", "Canvas 2D", "Vanilla JS"],
    liveUrl: "./demos/gestnova.html",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: false,
    price: "",
    needsCamera: true,
    featured: false,
    date: "2026-07-10"
  },
  {
    id: "racing-game",
    title: "Racing game",
    type: "game",
    status: "available",
    description: "Retro arcade highway speed racer with responsive touch and keyboard steering, dynamic traffic spawns, and high-score survival.",
    techStack: ["HTML5 Canvas", "requestAnimationFrame", "Web Audio API", "Mobile Touch"],
    liveUrl: "./demos/racing.html",
    demoVideoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    apkUrl: "https://github.com/example/racing-game/releases/download/v1.0/neon-racer.apk",
    thumbnail: "",
    forSale: true,
    price: "Rs 12,500",
    needsCamera: false,
    featured: false,
    date: "2026-06-25"
  },
  {
    id: "fitpulse",
    title: "FitPulse PWA Tracker",
    type: "app",
    status: "coming-soon", // Demonstrates the "Coming Soon" badge and no demo button
    description: "Offline-first workout tracker with interval timers, calorie burn estimators, and local analytics dashboard.",
    techStack: ["Vanilla JS", "IndexedDB", "PWA Service Worker", "Chart.js"],
    liveUrl: "",
    demoVideoUrl: "",
    apkUrl: "",
    thumbnail: "",
    forSale: true,
    price: "Rs 22,000",
    needsCamera: false,
    featured: false,
    date: "2026-10-01"
  }
];

const SERVICES = [
  {
    id: "static-website",
    title: "Static Website",
    description: "Lightning-fast business landing pages and commercial portfolios built with pure HTML/CSS/JS or modern static generators. Zero lag, maximum SEO.",
    startingPrice: "Starting at Rs 8,000",
    icon: "🌐"
  },
  {
    id: "android-app",
    title: "Android App",
    description: "Responsive web apps compiled to Android APK with offline support, push notifications, and camera/sensor integration.",
    startingPrice: "Starting at Rs 18,000",
    icon: "📱"
  },
  {
    id: "web-game",
    title: "Web Game",
    description: "Engaging 2D HTML5 canvas games with smooth touch controls, audio effects, and viral gameplay mechanics for campaigns or personal brands.",
    startingPrice: "Starting at Rs 14,000",
    icon: "🎮"
  },
  {
    id: "custom-project",
    title: "Custom Project",
    description: "Bespoke full-stack applications, tailored business automation, WhatsApp bots, and custom workflow dashboards designed to your exact specs.",
    startingPrice: "Starting at Rs 25,000",
    icon: "⚡"
  }
];

const FAQ = [
  {
    question: "What do I get when I buy a project?",
    answer: "You receive the complete, unminified source code, full asset licenses, documentation, and 1-on-1 setup assistance to deploy it on your domain or server."
  },
  {
    question: "Do you provide support after purchase?",
    answer: "Yes! Every turnkey purchase includes 30 days of free technical support and bug fixes to ensure smooth deployment and peace of mind."
  },
  {
    question: "Can you customize a project for me?",
    answer: "Absolutely. I can rebrand the UI, integrate your payment gateways, connect your APIs, or add custom features at an affordable hourly or fixed rate."
  },
  {
    question: "How does payment work?",
    answer: "Payment is processed directly via secure UPI, bank transfer, or international wire. For turnkey code, 100% upon delivery; for custom builds, 50% upfront milestone."
  },
  {
    question: "How long does a custom project take?",
    answer: "Most small to medium web apps and websites are delivered in 5 to 14 days. We establish a clear timeline upfront on WhatsApp before beginning."
  }
];

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Founder, DevPulse",
    text: "Acquired the TaskFlow kanban template. The clean modular code saved us 3 weeks of development time. Setup was completed smoothly in under 2 hours!"
  },
  {
    name: "Priya Nair",
    role: "Product Lead, EdVenture",
    text: "The typing speed trainer was flawless on mobile devices. Smooth animations, zero lag, and instant WhatsApp support whenever we needed tweaks."
  },
  {
    name: "Vikram Mehta",
    role: "Director, Apex Tech",
    text: "Commissioned a custom web app and showroom site. The dark aesthetic and responsiveness exceeded our expectations. Highly recommended!"
  }
];

// Global availability across vanilla scripts and bundlers
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
  window.PROJECTS = PROJECTS;
  window.SERVICES = SERVICES;
  window.FAQ = FAQ;
  window.TESTIMONIALS = TESTIMONIALS;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const en = {
  meta: {
    title: "Luro",
    description: "Professional PC optimization for 6 years & graphic designer for 3 years. BIOS calibration, Windows latency reduction, competitive gaming FPS boost & Photoshop/Figma visuals.",
  },
  nav: {
    services: "Services",
    portfolio: "Portfolio",
    about: "About",
    reviews: "Reviews",
    faq: "FAQ",
    contact: "Contact",
    home: "Luro, home",
    main: "Main navigation",
    lang: "Français",
  },
  float: "Book a service",
  marquee: ["PC optimization", "BIOS calibration", "Windows latency", "Competitive Gaming", "Photoshop", "Figma", "Thumbnails", "Branding", "Velyro Software"],
  hero: {
    badge: "Available",
    badgeText: "Bookings open for PC & Design projects",
    h1a: "PCs that run at maximum speed.",
    h1b: "Visuals & websites that dominate.",
    lead: "Professional PC optimizer for 6 years, graphic designer for 3. BIOS tuning, Windows latency reduction and custom visuals in Photoshop and Figma. I'm Luro.",
    cta1: "Book a service",
    cta2: "View benchmarks & works ↗",
    ctaDiscord: "Join Discord",
    ratingText: "4.7/5 · 150+ machines optimized",
    building: "Software creator",
    optimized: "Optimized PC",
    winbios: "Windows + BIOS",
    biosTitle: "BIOS checklist",
    biosSub: "Key hardware settings",
    bios: [["XMP / EXPO", "Active"], ["Resizable BAR", "Active"], ["Power curve", "Calibrated"]],
    every: "Every day",
    daily: "My daily tools",
  },
  statement: {
    p1: "I tune your machine for maximum performance & zero stutter",
    p2: "and design high-impact visuals",
    p3: "that captivate your audience immediately.",
    sub: "Built for gamers, streamers and creators who demand real, measurable results.",
    tags: ["#Gamers", "#Streamers", "#Creators", "#Discord communities", "#Esport"],
  },
  services: {
    eyebrow: "Services & Expertise",
    title: "Tailored PC Optimization & Creative Design.",
    sub: "Every service is delivered 1-on-1 with measurable results, complete transparency and total safety.",
    stats: [
      { v: 6, label: "years of professional PC tuning", note: "Over 150 satisfied clients" },
      { v: 3, label: "years of graphic design", note: "Photoshop, Figma & UI/UX" },
      { v: 100, label: "% safe & reversible", note: "Restore points & backups included" },
    ],
    items: [
      {
        id: "windows",
        badge: "System",
        title: "Windows Optimization",
        price: "€50",
        duration: "45–60 min",
        desc: "Complete cleanup of background services, telemetry and bloatware without breaking Windows Store or updates. Tailored power plan and network latency tweaks.",
        features: [
          "Removal of background bloatware (saves 80-120 active processes)",
          "Low-latency Windows timer resolution & custom power plan",
          "Audio & Network DPC latency optimization",
          "Safe cleanup of telemetry while keeping Windows Defender & Store intact",
        ],
        target: "Anyone looking for a lightning-fast, responsive desktop with no stutter.",
        serviceKey: "windows",
      },
      {
        id: "bios",
        badge: "Hardware",
        title: "BIOS & UEFI Calibration",
        price: "€40",
        duration: "30–45 min",
        desc: "Unlock the real hardware potential of your CPU, RAM and GPU. Certified stable settings with thermal curve optimization.",
        features: [
          "XMP / EXPO profile activation for full RAM frequency & optimal sub-timings",
          "Resizable BAR (ReBAR) / Smart Access Memory GPU direct access",
          "CPU power limits & temperature curve calibration for silent cooling",
          "Disabling wasteful C-States & power throttling for consistent clocks",
        ],
        target: "Users looking to get the maximum speed from their hardware safely.",
        serviceKey: "bios",
      },
      {
        id: "gaming",
        badge: "Most Popular",
        title: "Gaming & Esport Full Pack",
        price: "€90",
        duration: "1h30",
        desc: "The ultimate package: Complete Windows + BIOS tuning. Drastically boosts 1% Low FPS, eliminates micro-stutters and minimizes mouse input lag.",
        features: [
          "Full Windows + BIOS package included with full stability testing",
          "Core Affinity & CPU core scheduling prioritized for your favorite games",
          "Clean GPU driver installation (debloated NVIDIA / AMD drivers)",
          "Mouse & keyboard click-to-photon latency reduction",
        ],
        target: "Valorant, CS2, Warzone, Fortnite, Apex, LoL & competitive gamers.",
        serviceKey: "pc",
      },
      {
        id: "design",
        badge: "Creative",
        title: "Graphic Design & Posters",
        price: "From €20",
        duration: "24–48h delivery",
        desc: "Striking key visuals, event posters, YouTube thumbnails with high CTR, and complete branding made in Photoshop and Figma.",
        features: [
          "High-res tournament, event & announcement posters (Photoshop)",
          "Custom YouTube thumbnails & Twitch banners built for engagement",
          "Complete branding kit: avatar, banner, colors and typography",
          "Editable PSD & Figma source files delivered with full ownership",
        ],
        target: "Streamers, YouTubers, esports teams and creators.",
        serviceKey: "poster",
      },
      {
        id: "website",
        badge: "Web",
        title: "Ultra-Fast Websites & Portfolios",
        price: "From €149",
        duration: "3–7 days",
        desc: "High-performance, modern and responsive websites tailored to your brand, with stellar mobile design and clean SEO.",
        features: [
          "Modern responsive design with smooth animations",
          "95+ Google PageSpeed score & optimized SEO meta tags",
          "Integrated contact form or Discord booking links",
          "Fast loading with no bloatware frameworks",
        ],
        target: "Freelancers, creators, streamers and businesses.",
        serviceKey: "landing",
      },
    ],
    ctaCard: "Order this service",
    contactDiscord: "Ask on Discord",
  },
  portfolio: {
    eyebrow: "Measurable Results & Portfolio",
    title: "Before vs After. Real Proof.",
    sub: "No marketing hype: verifiable benchmarks with LatencyMon, CapFrameX and real game tests.",
    tabBenchmarks: "PC Benchmarks",
    tabDesigns: "Visual Showcase",
    tabVelyro: "Software: Velyro",
    benchmarks: [
      {
        title: "DPC Latency (System Responsiveness)",
        tool: "Measured with LatencyMon v7.31",
        metric: "Lower is better",
        beforeVal: "1 240 µs",
        afterVal: "115 µs",
        diff: "-91% latency",
        explanation: "Audio driver and network interrupts caused severe stuttering in fast-paced scenes. After driver isolation and DPC tuning, system latency is flat.",
      },
      {
        title: "1% Low FPS & Frametime (Call of Duty: Warzone)",
        tool: "CapFrameX 10-minute battle royale run",
        metric: "Higher is better",
        beforeVal: "82 FPS min",
        afterVal: "148 FPS min",
        diff: "+80% stability",
        explanation: "Gunfights no longer suffer from micro-drops. Frametime spikes are eliminated thanks to ReBAR, RAM sub-timings and CPU scheduling.",
      },
      {
        title: "Background Idle Footprint",
        tool: "Windows Task Manager & Resource Monitor",
        metric: "Lower is better",
        beforeVal: "194 processes · 6.4 GB RAM",
        afterVal: "56 processes · 2.6 GB RAM",
        diff: "-71% background bloat",
        explanation: "Telemetry, hidden updaters and useless services stripped away. The CPU and RAM are 100% dedicated to your game.",
      },
      {
        title: "Click-to-Photon Input Delay (Valorant / 240Hz)",
        tool: "NVIDIA Reflex Latency Analyzer",
        metric: "Lower is better",
        beforeVal: "18.2 ms",
        afterVal: "7.9 ms",
        diff: "-56% input delay",
        explanation: "Mouse tracking is immediate. Crosshair placement feels razor sharp on high refresh rate monitors.",
      },
    ],
    showcase: [
      { title: "Cyber Horizon", category: "Poster / Photoshop", tag: "Key Visual", color: "#2b8be8" },
      { title: "Valorant Masters Invitational", category: "Esport / Event", tag: "Tournament", color: "#ff4655" },
      { title: "High-CTR YouTube Pack", category: "Thumbnail / Branding", tag: "Creator Pack", color: "#10b981" },
      { title: "Velyro Software UI", category: "Figma / Web App", tag: "UI/UX Design", color: "#8b5cf6" },
    ],
  },
  about: {
    eyebrow: "About Luro",
    title: "Passionate about hardware & obsessed with performance.",
    tagline: "PC Optimizer (6 yrs) · Graphic Designer (3 yrs) · Velyro Creator",
    lead: "6 years refining machines. 3 years crafting standout visuals.",
    story: "I started optimizing PCs because I was frustrated by unexplainable stutters and bad frametimes on high-end hardware. Over the past 6 years, I've tuned over 150 computers for competitive esports players, streamers and 3D artists. I also created Velyro, my own optimization software, and design high-impact visuals in Photoshop and Figma.",
    stats: [
      { num: "6+", label: "Years of PC optimization", sub: "Deep hardware & software tuning" },
      { num: "150+", label: "Machines tuned", sub: "For gamers, streamers & creators" },
      { num: "100%", label: "Safe & reversible", sub: "0 hardware issues · Restore points saved" },
    ],
    pillarsTitle: "My 4 Guarantees",
    pillars: [
      {
        title: "100% Safe & Reversible",
        desc: "A Windows system restore point and BIOS backup are created before touching a single parameter. Zero destructive scripts.",
      },
      {
        title: "Full Transparency in Live Session",
        desc: "We connect 1-on-1 via AnyDesk with live Discord voice/chat. You watch every step and understand exactly what is modified.",
      },
      {
        title: "No TikTok Placebos",
        desc: "No snake-oil tweaks that break Windows Update, anti-cheats or Store. Only proven, benchmarked industry-grade optimizations.",
      },
      {
        title: "Post-Session Support",
        desc: "Need adjustments after a few days of gaming? I stay available on Discord to verify your stability and temps.",
      },
    ],
  },
  reviews: {
    eyebrow: "Client Feedback",
    title: "Real Reviews from Real Gamers.",
    sub: "Authentic feedback gathered directly from our Discord community.",
    score: "4.9 / 5",
    scoreNote: "Based on 150+ client optimizations",
    items: [
      {
        author: "Alexandre « Kryo »",
        role: "Twitch Streamer (14k followers) · Warzone & Apex",
        avatar: "K",
        content: "I had unbearable micro-stutters as soon as OBS was running. In 1 hour with Luro on Windows and BIOS, my frametime turned into a flat line. Night and day difference.",
        verified: true,
      },
      {
        author: "Julien « Skyz »",
        role: "Competitive Player · Valorant Immortal 3",
        avatar: "S",
        content: "The mouse responsiveness after the input lag tuning is shocking. Tracking feels instantaneous. Plus, Luro explains everything he does on Discord. 10/10.",
        verified: true,
      },
      {
        author: "Camille R.",
        role: "Video Editor & 3D Artist · Premiere & Blender",
        avatar: "C",
        content: "My PC was throttling at 88°C during 4K renders. Custom fan curves and proper power calibration dropped temps by 14°C. Zero crashes since then.",
        verified: true,
      },
      {
        author: "Thomas B.",
        role: "Esport Community Manager · Discord Leader",
        avatar: "T",
        content: "Ordered a complete pack of tournament posters and Discord banners. Delivered in 48 hours with clean PSD files. Outstanding design quality.",
        verified: true,
      },
    ],
  },
  process: {
    eyebrow: "Process",
    title: "Simple from start to finish.",
    sub: "Three steps, no headaches.",
    steps: [
      ["1. You reach out or order", "Book online or message me on Discord with your setup, specs, and requirements."],
      ["2. Live remote session", "We connect via AnyDesk & Discord voice. I run diagnostic tools, tune BIOS & Windows, or craft your visual mockup."],
      ["3. Verification & Benchmarking", "We stress-test for rock-solid stability, compare before/after FPS, and make sure everything is perfect."],
    ],
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    sub: "Everything you need to know before booking.",
    btn: "Ask on Discord",
    items: [
      ["How does a remote PC optimization work?", "We schedule a time on Discord. You download AnyDesk (a secure, lightweight remote desktop app). We join a voice call (or text chat if you prefer) and I guide you through the process. For BIOS settings, we do it together while you look at your screen with complete instructions."],
      ["How long does the session take?", "Around 45 minutes for Windows optimization alone, 30 minutes for BIOS, or about 1h15 to 1h30 for the Full Gaming Package (Windows + BIOS + In-game latency tuning and stability tests)."],
      ["Is the optimization fully reversible?", "Yes, 100%. Before modifying anything, I create a dedicated Windows System Restore Point and back up your previous BIOS profile. If you ever want to revert, it takes just one click."],
      ["What PCs and hardware are compatible?", "All desktop and laptop PCs running Windows 10 or Windows 11. I tune both Intel (Core i5/i7/i9) and AMD (Ryzen 3000/5000/7000/9000), as well as NVIDIA GeForce (RTX/GTX) and AMD Radeon graphics cards."],
      ["Is there any risk for hardware warranty or anti-cheats (Vanguard, EAC)?", "Zero risk. We never apply unsafe overvolting, and we do not use third-party scripts that trigger anti-cheat software (Riot Vanguard, Easy Anti-Cheat, BattlEye, Ricochet). Your hardware warranty and game accounts are completely safe."],
      ["How do orders and payments work?", "You can order directly through our secure Stripe checkout (Cards, Apple Pay, Google Pay) on the reservation page, or message me directly on Discord. Once booked, I contact you immediately to schedule your session."],
    ],
  },
  cta: {
    title: "Ready to unleash your PC's true speed?",
    text: "Book your optimization session or creative design package today, or message me directly on Discord.",
    btnBook: "Book an optimization",
    btnDiscord: "Join Discord",
    btnServices: "View services",
  },
  legal: {
    title: "Legal Notices & Terms",
    tabs: { notices: "Legal Notice", tos: "Terms of Service (CGV)", privacy: "Privacy Policy (GDPR)" },
    close: "Close",
    noticesText: "Website publisher: Luro (luro.lol)\nEmail contact: contact@luro.lol\nHosting: High-availability cloud infrastructure with SSL encryption.\nIntellectual property: All visual works, software, branding and graphic creations displayed on this site are the exclusive property of Luro unless stated otherwise.",
    tosText: "1. Scope: These Terms govern all PC optimization services, graphic design, and web development offered on luro.lol.\n2. Services: Remote optimization is performed via AnyDesk with customer authorization. Digital graphic designs are delivered electronically (PSD, Figma, PNG/JPG).\n3. Pricing & Payment: Prices are displayed in Euros (€). Payments are processed securely via Stripe. Payment is due upon ordering.\n4. Right of Withdrawal: Under article L.221-28 of the Consumer Code, the right of withdrawal cannot be exercised for digital services fully executed before the end of the statutory withdrawal period with express prior agreement of the customer.\n5. Warranty & Reversibility: A system restore point is systematically created before any operation. Post-session stability assistance is provided.",
    privacyText: "1. Data Collection: Only essential information (name, email, Discord username) is collected to schedule and execute your order.\n2. Payments: All transactions are processed directly by Stripe. No credit card details are ever stored on luro.lol.\n3. Cookies: Only technical cookies strictly necessary for language preferences and session persistence are used.\n4. Your Rights: In accordance with GDPR, you can request access, modification or deletion of your personal data at any time by emailing contact@luro.lol.",
  },
  order: {
    title: "Your next upgrade starts here.",
    intro: "Choose a service, share your brief and confirm your order with a secure payment.",
    name: "Name", email: "Email address", emailHint: "you@example.com", discord: "Discord username (optional)",
    service: "Choose your service", category: "Service category", categories: { pc: "PC optimization", design: "Design & visuals", website: "Website" },
    fullPackage: "Complete package · Windows + BIOS", total: "Total to pay", paymentNote: "One-time payment in EUR. Your order is sent only after payment is confirmed by Stripe. Fields marked * are required.",
    steps: ["Your project", "Secure payment", "Confirmation"],
    cancelled: "Payment was cancelled. Your brief has been kept so you can continue when ready.",
    message: "Your project", messagePlaceholder: "Your setup, your needs, your idea…",
    messageHint: "20–1,000 characters · Up to 2 links",
    send: "Continue to payment", sending: "Opening Stripe…", retry: "Retry verification",
    checking: "Checking payment…", checkAgain: "Check again", newOrder: "Start a new order",
    paymentTitles: { checking: "Checking your payment", pending: "Confirmation in progress", paid: "Payment received", sent: "Thank you for your order!", unavailable: "Confirmation unavailable" },
    paymentMessages: {
      checking: "Please wait while we check the confirmation from Stripe.",
      pending: "Your confirmation has not arrived yet. Please do not pay again. You can check again shortly.",
      paid: "Your payment is confirmed. Your order is being delivered to me automatically. No further payment is needed.",
      sent: "Your payment is confirmed and I have received your order. I'll reply using the email you provided.",
      unavailable: "We could not verify the confirmation yet. Do not pay again if you have already paid. Check again or contact me below.",
    },
    success: "Thank you! Your request has been sent. I'll get back to you as soon as possible.",
    captchaUnavailable: "Anti-spam verification is unavailable. Please retry or contact me using the links below.",
    errors: {
      INVALID_FIELDS: "Check all required fields, the 20-character minimum and the limit of 2 links.",
      CAPTCHA_FAILED: "Please complete the anti-spam verification again, then retry.",
      RATE_LIMITED: "You've reached the limit of 3 requests per hour. Please try again later.",
      UNAVAILABLE: "Your request could not be confirmed. Please try again later or contact me directly.",
    },
  },
  footer: {
    top: "Back to top ↑",
    legal: "Legal Notice",
    tos: "Terms of Service",
    privacy: "Privacy Policy",
    rights: "All rights reserved.",
  },
};

const fr = {
  meta: {
    title: "Luro",
    description: "Optimiseur PC professionnel depuis 6 ans et graphiste depuis 3 ans. Réglages BIOS, réduction d'input lag Windows, boost FPS 1% Low et créations Photoshop/Figma.",
  },
  nav: {
    services: "Services",
    portfolio: "Réalisations",
    about: "À propos",
    reviews: "Avis",
    faq: "FAQ",
    contact: "Contact",
    home: "Luro, accueil",
    main: "Navigation principale",
    lang: "English",
  },
  float: "Réserver",
  marquee: ["Optimisation PC", "Réglages BIOS", "Latence Windows", "Gaming Compétitif", "Photoshop", "Figma", "Miniatures", "Identité visuelle", "Logiciel Velyro"],
  hero: {
    badge: "Disponible",
    badgeText: "Prises de commandes ouvertes · PC & Design",
    h1a: "Des PC qui tournent à pleine vitesse.",
    h1b: "Des visuels et des sites qui marquent.",
    lead: "Optimiseur PC professionnel depuis 6 ans, graphiste depuis 3 ans. Réglages BIOS, réduction de latence Windows et visuels percutants sur Photoshop et Figma. Je m'appelle Luro.",
    cta1: "Réserver une prestation",
    cta2: "Voir les benchmarks & créations ↗",
    ctaDiscord: "Rejoindre Discord",
    ratingText: "4.9/5 · Plus de 150 machines optimisées",
    building: "Créateur de logiciel",
    optimized: "PC optimisé",
    winbios: "Windows + BIOS",
    biosTitle: "Checklist BIOS",
    biosSub: "Réglages matériels clés",
    bios: [["XMP / EXPO", "Activé"], ["Resizable BAR", "Activé"], ["Gestion d'énergie", "Calibré"]],
    every: "Au quotidien",
    daily: "Mes outils du quotidien",
  },
  statement: {
    p1: "Je règle ta machine pour qu'elle donne son maximum sans aucun micro-freeze",
    p2: "et je conçois des visuels percutants",
    p3: "qui retiennent immédiatement l'attention.",
    sub: "Pensé pour les gamers, streamers et créateurs qui recherchent des résultats concrets et mesurables.",
    tags: ["#Gamers", "#Streamers", "#Créateurs", "#Communautés Discord", "#Esport"],
  },
  services: {
    eyebrow: "Prestations & Expertises",
    title: "Optimisation PC sur-mesure & Design Graphique.",
    sub: "Chaque prestation est réalisée en direct avec toi, avec transparence totale, sauvegarde préalable et résultats prouvés.",
    stats: [
      { v: 6, label: "ans comme optimiseur PC professionnel", note: "Plus de 150 clients satisfaits" },
      { v: 3, label: "ans d'expertise graphique", note: "Photoshop, Figma & UI/UX" },
      { v: 100, label: "% sécurisé & réversible", note: "Points de restauration & sauvegardes inclus" },
    ],
    items: [
      {
        id: "windows",
        badge: "Système",
        title: "Optimisation Windows 10 & 11",
        price: "50 €",
        duration: "45–60 min",
        desc: "Nettoyage en profondeur des services d'arrière-plan, suppression de la télémétrie et des bloatwares sans casser Windows Store ni les mises à jour. Plan d'alimentation et latence optimisés.",
        features: [
          "Suppression des bloatwares système (gain de 80 à 120 processus actifs)",
          "Réglage de la résolution d'horloge Windows (timer resolution) & plan d'alimentation personnalisé",
          "Optimisation de la latence DPC audio et réseau",
          "Désactivation sécurisée de la télémétrie tout en conservant Windows Defender & Store",
        ],
        target: "Tous les utilisateurs souhaitant un bureau ultra réactif, fluide et sans saccade.",
        serviceKey: "windows",
      },
      {
        id: "bios",
        badge: "Matériel",
        title: "Calibration BIOS & UEFI",
        price: "40 €",
        duration: "30–45 min",
        desc: "Débloquez le véritable potentiel matériel de votre processeur, mémoire vive et carte graphique. Paramètres certifiés stables avec courbes thermiques personnalisées.",
        features: [
          "Activation du profil XMP / EXPO pour la pleine fréquence RAM et sous-timings optimisés",
          "Activation du Resizable BAR (ReBAR) / SAM pour les transferts directs GPU",
          "Ajustement des limites de consommation CPU et courbes de ventilation pour le silence",
          "Désactivation des états C-States parasites et du throttling d'alimentation",
        ],
        target: "Ceux qui veulent exploiter 100% de la puissance de leurs composants sans danger.",
        serviceKey: "bios",
      },
      {
        id: "gaming",
        badge: "Le plus populaire",
        title: "Pack Gaming & Esport Compétitif",
        price: "90 €",
        duration: "1h30",
        desc: "La formule ultime : optimisation complète Windows + BIOS. Stabilise drastiquement vos 1% Low FPS, éradique les micro-stutters et minimise l'input lag souris.",
        features: [
          "Pack complet Windows + BIOS inclus avec banc d'essai et stress-test de stabilité",
          "Priorisation des cœurs CPU (Core Affinity) et ordonnancement pour vos jeux favoris",
          "Installation propre et épurée des pilotes graphiques NVIDIA ou AMD (sans télémétrie)",
          "Réduction de la latence click-to-photon souris et clavier",
        ],
        target: "Joueurs Valorant, CS2, Warzone, Fortnite, Apex, LoL et esport.",
        serviceKey: "pc",
      },
      {
        id: "design",
        badge: "Créatif",
        title: "Design Graphique & Affiches",
        price: "Dès 20 €",
        duration: "Livraison 24–48h",
        desc: "Affiches percutantes pour événements, miniatures YouTube à fort taux de clic (CTR), bannières Twitch et identités visuelles complètes créées sous Photoshop et Figma.",
        features: [
          "Affiches haute résolution pour tournois, événements et annonces (Photoshop)",
          "Miniatures YouTube et bannières Twitch pensées pour maximiser les clics",
          "Identité visuelle complète : avatar, bannière, charte graphique et typographies",
          "Fichiers sources éditables PSD et Figma fournis avec cession des droits",
        ],
        target: "Streamers, YouTubers, structures esport et créateurs de contenu.",
        serviceKey: "poster",
      },
      {
        id: "website",
        badge: "Web",
        title: "Sites Web Vitrines & Portfolios",
        price: "Dès 149 €",
        duration: "3–7 jours",
        desc: "Sites web modernes, ultra rapides et responsives adaptés à votre image, avec un design soigné sur smartphone et un référencement SEO soigné.",
        features: [
          "Design moderne et responsive avec micro-animations fluides",
          "Score PageSpeed Google 95+ et balisage SEO complet",
          "Formulaire de commande ou liens de réservation Discord intégrés",
          "Chargement instantané sans frameworks superflus",
        ],
        target: "Indépendants, créateurs, streamers et professionnels.",
        serviceKey: "landing",
      },
    ],
    ctaCard: "Commander ce service",
    contactDiscord: "Demander sur Discord",
  },
  portfolio: {
    eyebrow: "Résultats Mesurables & Portfolio",
    title: "Avant / Après. Les preuves concrètes.",
    sub: "Pas de promesses creuses : des mesures vérifiées avec LatencyMon, CapFrameX et des tests en jeu réels.",
    tabBenchmarks: "Benchmarks PC",
    tabDesigns: "Galerie Graphique",
    tabVelyro: "Logiciel Velyro",
    benchmarks: [
      {
        title: "Latence DPC (Réactivité Système Globale)",
        tool: "Mesuré avec LatencyMon v7.31",
        metric: "Le plus bas est le meilleur",
        beforeVal: "1 240 µs",
        afterVal: "115 µs",
        diff: "-91% de latence",
        explanation: "Les pilotes audio et réseau provoquaient des micro-saccades en jeu compétitif. Après isolation des pilotes et réglage DPC, la latence est devenue quasi nulle.",
      },
      {
        title: "1% Low FPS & Frametime (Call of Duty: Warzone)",
        tool: "Session Battle Royale de 10 min avec CapFrameX",
        metric: "Le plus haut est le meilleur",
        beforeVal: "82 FPS min",
        afterVal: "148 FPS min",
        diff: "+80% de stabilité",
        explanation: "Les gunfights ne souffrent plus de baisses d'images brutales. Le frametime est lissé grâce à l'activation ReBAR, aux sous-timings RAM et à l'affinité CPU.",
      },
      {
        title: "Empreinte Système & Tâches de Fond au Repos",
        tool: "Gestionnaire des tâches & Moniteur de ressources Windows",
        metric: "Le plus bas est le meilleur",
        beforeVal: "194 processus · 6.4 Go RAM",
        afterVal: "56 processus · 2.6 Go RAM",
        diff: "-71% de surcharge",
        explanation: "Suppression de la télémétrie, des assistants cachés et services inutiles. Le processeur et la mémoire vive sont 100% dédiés à votre jeu.",
      },
      {
        title: "Délai d'entrée Click-to-Photon (Valorant / 240Hz)",
        tool: "Analyseur de latence matérielle NVIDIA Reflex",
        metric: "Le plus bas est le meilleur",
        beforeVal: "18.2 ms",
        afterVal: "7.9 ms",
        diff: "-56% de délai perçu",
        explanation: "Le mouvement du curseur est instantané. Le suivi et la précision des tirs deviennent immédiats sur les écrans haute fréquence.",
      },
    ],
    showcase: [
      { title: "Cyber Horizon", category: "Affiche / Photoshop", tag: "Key Visual", color: "#2b8be8" },
      { title: "Valorant Masters Invitational", category: "Esport / Event", tag: "Tournoi", color: "#ff4655" },
      { title: "Pack Miniatures YouTube High-CTR", category: "Miniature / Branding", tag: "Pack Créateur", color: "#10b981" },
      { title: "Interface Logicielle Velyro", category: "Figma / Web App", tag: "Design UI/UX", color: "#8b5cf6" },
    ],
  },
  about: {
    eyebrow: "À propos de Luro",
    title: "Passionné de hardware & obsédé par la performance.",
    tagline: "Optimiseur PC (6 ans) · Graphiste (3 ans) · Créateur de Velyro",
    lead: "6 ans passés à perfectionner des machines. 3 ans à créer des visuels remarquables.",
    story: "J'ai commencé à optimiser des PC parce que j'étais frustré de constater des micro-saccades et des baisses d'images inexpliquées sur des configurations pourtant haut de gamme. En 6 ans, j'ai optimisé plus de 150 PC pour des joueurs professionnels, des streamers et des créateurs de contenu. J'ai également conçu mon propre logiciel d'optimisation, Velyro, et je réalise des identités visuelles et affiches sur Photoshop et Figma.",
    stats: [
      { num: "6+", label: "Années d'optimisation PC", sub: "Expertise hardware & logicielle poussée" },
      { num: "150+", label: "Machines optimisées", sub: "Pour gamers, streamers et créateurs" },
      { num: "100%", label: "Sécurisé & réversible", sub: "0 composant endommagé · Sauvegarde préalable" },
    ],
    pillarsTitle: "Mes 4 Engagements",
    pillars: [
      {
        title: "100% Sécurisé & Réversible",
        desc: "Un point de restauration Windows et une sauvegarde BIOS sont créés avant toute modification. Zéro script destructeur.",
      },
      {
        title: "Transparence Totale en Direct",
        desc: "La session se fait à deux via AnyDesk et en vocal sur Discord. Tu vois chaque étape et tu comprends exactement ce qui est modifié.",
      },
      {
        title: "Aucun Placebo TikTok",
        desc: "Pas de réglages miracles douteux qui cassent Windows Update, les anti-cheats ou Windows Store. Uniquement des méthodes éprouvées et mesurées.",
      },
      {
        title: "Accompagnement Post-Session",
        desc: "Besoin d'un ajustement après quelques jours de jeu ? Je reste joignable sur Discord pour surveiller la stabilité et les températures.",
      },
    ],
  },
  reviews: {
    eyebrow: "Témoignages Clients",
    title: "De vrais avis de vrais gamers.",
    sub: "Des retours d'expérience vérifiés issus directement de notre communauté Discord.",
    score: "4.9 / 5",
    scoreNote: "Sur plus de 150 optimisations réalisées",
    items: [
      {
        author: "Alexandre « Kryo »",
        role: "Streamer Twitch (14k abonnés) · Warzone & Apex",
        avatar: "K",
        content: "J'avais des micro-stutters insupportables dès que j'allumais OBS en live. En 1h avec Luro sur le BIOS et Windows, mon frametime est devenu une ligne droite. Le jour et la nuit.",
        verified: true,
      },
      {
        author: "Julien « Skyz »",
        role: "Joueur compétitif · Valorant Immortal 3",
        avatar: "S",
        content: "Le gain de réactivité souris après l'optimisation de l'input lag est bluffant. Le tracking est immédiat. En plus Luro prend le temps de tout expliquer sur Discord. 10/10.",
        verified: true,
      },
      {
        author: "Camille R.",
        role: "Monteuse vidéo & Créatrice 3D · Premiere & Blender",
        avatar: "C",
        content: "Mon PC montait à 88°C pendant les rendus 4K. Les courbes de ventilation et la gestion d'énergie ajustées par Luro ont fait chuter la température de 14°C. Zéro crash depuis.",
        verified: true,
      },
      {
        author: "Thomas B.",
        role: "Manager structure Esport · Responsable Discord",
        avatar: "T",
        content: "Pack d'affiches de tournoi et bannières commandé pour notre serveur. Reçu en 48h avec les fichiers PSD impeccables. Une qualité graphique remarquable.",
        verified: true,
      },
    ],
  },
  process: {
    eyebrow: "Méthode",
    title: "Simple du début à la fin.",
    sub: "Trois étapes, sans prise de tête.",
    steps: [
      ["1. Prise de contact ou commande", "Réserve en ligne ou écris-moi sur Discord avec ta configuration et tes besoins."],
      ["2. Session à distance en direct", "Connexion sécurisée via AnyDesk et appel Discord. Diagnostic, réglages BIOS, Windows ou création de ta maquette visuelle."],
      ["3. Vérification & Banc d'essai", "Stress-tests de stabilité, comparaison des FPS avant/après et validation finale ensemble."],
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Questions fréquentes",
    sub: "Tout ce qu'il faut savoir avant de commander.",
    btn: "Écris-moi sur Discord",
    items: [
      ["Comment se passe une session d'optimisation à distance ?", "On convient d'un rendez-vous sur Discord. Tu télécharges AnyDesk (logiciel sécurisé et léger de prise en main à distance). On se rejoint en vocal (ou par écrit si tu préfères) et je t'accompagne pas à pas. Pour le BIOS, nous effectuons les réglages ensemble avec des explications claires."],
      ["Combien de temps dure la prestation ?", "Comptez environ 45 minutes pour l'optimisation Windows seule, 30 minutes pour le BIOS, et environ 1h15 à 1h30 pour le Pack Complet Gaming (Windows + BIOS + latence en jeu et tests de stabilité)."],
      ["L'optimisation est-elle réversible ?", "Oui, à 100%. Avant de modifier quoi que ce soit, je crée systématiquement un point de restauration Windows et une sauvegarde de ton profil BIOS d'origine. Si tu souhaites revenir en arrière, c'est faisable en un clic."],
      ["Quels types de PC sont compatibles ?", "Tous les PC fixes et portables sous Windows 10 ou Windows 11. J'optimise les plateformes Intel (Core i5/i7/i9) et AMD (Ryzen 3000/5000/7000/9000), ainsi que les cartes graphiques NVIDIA GeForce (RTX/GTX) et AMD Radeon."],
      ["Y a-t-il un risque pour la garantie ou avec les anti-cheats (Vanguard, EAC) ?", "Absolument aucun. Nous ne pratiquons aucun survoltage dangereux pour les composants, et nous n'utilisons aucun script tiers banni par les systèmes anti-triche (Riot Vanguard, Easy Anti-Cheat, BattlEye, Ricochet). Votre garantie et vos comptes de jeu sont 100% en sécurité."],
      ["Comment se déroulent la commande et le paiement ?", "Tu peux commander directement via paiement sécurisé Stripe (Carte bancaire, Apple Pay, Google Pay) sur la page réservation, ou me contacter sur Discord. Une fois la commande confirmée, je te contacte immédiatement pour planifier ton créneau."],
    ],
  },
  cta: {
    title: "Prêt à libérer la vraie vitesse de ta machine ?",
    text: "Réserve ta session d'optimisation ou ton pack design dès aujourd'hui, ou rejoins le Discord pour en discuter.",
    btnBook: "Réserver une optimisation",
    btnDiscord: "Rejoindre le Discord",
    btnServices: "Voir les services",
  },
  legal: {
    title: "Mentions Légales & Conditions Générales",
    tabs: { notices: "Mentions Légales", tos: "Conditions Générales (CGV)", privacy: "Confidentialité (RGPD)" },
    close: "Fermer",
    noticesText: "Éditeur du site : Luro (luro.lol)\nContact par email : contact@luro.lol\nHébergement : Infrastructure cloud haute disponibilité avec chiffrement SSL/TLS.\nPropriété intellectuelle : L'ensemble des créations graphiques, marques, logiciels et contenus présentés sur ce site sont la propriété exclusive de Luro, sauf mention contraire.",
    tosText: "1. Objet : Les présentes CGV régissent les prestations d'optimisation informatique à distance, de graphisme et de développement web proposées sur le site luro.lol.\n2. Prestations : Les optimisations sont réalisées à distance via AnyDesk avec accord et sous la supervision du client. Les créations graphiques sont livrées par voie électronique (PSD, Figma, PNG/JPG).\n3. Tarifs et Paiement : Les prix sont indiqués en Euros (€). Le règlement s'effectue comptant via la plateforme sécurisée Stripe au moment de la commande.\n4. Droit de rétractation : Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne peut être exercé pour les services pleinement exécutés avant la fin du délai légal avec accord exprès du consommateur.\n5. Garantie et Réversibilité : Un point de restauration système est obligatoirement créé avant intervention. Une assistance de suivi de stabilité est fournie.",
    privacyText: "1. Données collectées : Seules les données strictement indispensables (nom/pseudo, adresse email, pseudo Discord) sont collectées afin d'assurer l'exécution de la commande.\n2. Paiements : Les transactions bancaires sont intégralement gérées par Stripe certifié PCI-DSS. Aucune donnée bancaire n'est conservée par luro.lol.\n3. Cookies : Uniquement des cookies techniques strictement nécessaires au fonctionnement du site (langue, session) sont utilisés.\n4. Vos droits : Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données en écrivant à contact@luro.lol.",
  },
  order: {
    title: "Ton prochain projet commence ici.",
    intro: "Choisis ta prestation, décris ton projet et confirme ta commande avec un paiement sécurisé.",
    name: "Nom", email: "Adresse email", emailHint: "toi@exemple.fr", discord: "Pseudo Discord (optionnel)",
    service: "Choisis ta prestation", category: "Catégorie de prestation", categories: { pc: "Optimisation PC", design: "Design & visuels", website: "Site web" },
    fullPackage: "Pack complet · Windows + BIOS", total: "Total à payer", paymentNote: "Paiement unique en EUR. Ta commande est envoyée uniquement après confirmation du paiement par Stripe. Les champs * sont obligatoires.",
    steps: ["Ton projet", "Paiement sécurisé", "Confirmation"],
    cancelled: "Le paiement a été annulé. Ton message a été conservé pour reprendre quand tu le souhaites.",
    message: "Ton projet", messagePlaceholder: "Ta configuration, ton besoin, ton idée…",
    messageHint: "20 à 1 000 caractères · 2 liens maximum",
    send: "Passer au paiement", sending: "Ouverture de Stripe…", retry: "Relancer la vérification",
    checking: "Vérification du paiement…", checkAgain: "Vérifier à nouveau", newOrder: "Nouvelle commande",
    paymentTitles: { checking: "Vérification de ton paiement", pending: "Confirmation en cours", paid: "Paiement reçu", sent: "Merci pour ta commande !", unavailable: "Confirmation indisponible" },
    paymentMessages: {
      checking: "Un instant, je vérifie la confirmation envoyée par Stripe.",
      pending: "La confirmation n'est pas encore arrivée. Ne paie pas une seconde fois. Tu peux vérifier à nouveau dans un instant.",
      paid: "Ton paiement est confirmé. Ta commande m'est transmise automatiquement. Aucun autre paiement n'est nécessaire.",
      sent: "Ton paiement est confirmé et j'ai bien reçu ta commande. Je te réponds à l'adresse email indiquée.",
      unavailable: "La confirmation n'a pas encore pu être vérifiée. Ne repaie pas si tu as déjà payé. Réessaie ou contacte-moi ci-dessous.",
    },
    success: "Merci ! Ta demande a bien été envoyée. Je te réponds dès que possible.",
    captchaUnavailable: "La vérification anti-spam est indisponible. Réessaie ou contacte-moi avec les liens ci-dessous.",
    errors: {
      INVALID_FIELDS: "Vérifie les champs obligatoires, le minimum de 20 caractères et la limite de 2 liens.",
      CAPTCHA_FAILED: "Valide à nouveau la vérification anti-spam, puis réessaie.",
      RATE_LIMITED: "Tu as atteint la limite de 3 envois par heure. Réessaie plus tard.",
      UNAVAILABLE: "L'envoi n'a pas pu être confirmé. Réessaie plus tard ou contacte-moi directement.",
    },
  },
  footer: {
    top: "Retour en haut ↑",
    legal: "Mentions légales",
    tos: "Conditions Générales (CGV)",
    privacy: "Confidentialité (RGPD)",
    rights: "Tous droits réservés.",
  },
};

const DICTS = { en, fr };
const KEY = "luro-lang";

const LangContext = createContext(null);

function initialLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "fr") return saved;
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = useCallback((l) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const t = DICTS[lang];

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = window.location.pathname === "/reservation.html" ? `${lang === "fr" ? "Réserver une prestation" : "Book a service"} — Luro` : t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

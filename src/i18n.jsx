import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const en = {
  meta: {
    title: "Luro — PC Optimization, BIOS & Design",
    description: "Luro: professional PC optimizer for 5+ years and graphic designer for 3 years. BIOS tuning, Windows optimization and posters in Photoshop and Figma.",
  },
  nav: { services: "Services", work: "Work", process: "Process", faq: "FAQ", home: "Luro, home", main: "Main navigation", lang: "Français" },
  float: "Contact me",
  marquee: ["PC optimization", "BIOS tuning", "Windows", "Posters", "Photoshop", "Figma", "Thumbnails", "Branding"],
  hero: {
    badge: "New",
    badgeText: "Available for new projects",
    h1a: "PCs that run fast.",
    h1b: "Posters that stand out.",
    lead: "Professional PC optimizer for 5½ years, graphic designer for 3. BIOS tuning, Windows and posters in Photoshop and Figma. I'm Luro.",
    cta1: "Let's talk",
    cta2: "See my work",
    optimized: "Optimized PC",
    winbios: "Windows + BIOS",
    biosTitle: "BIOS checklist",
    biosSub: "3 key settings",
    bios: [["XMP / EXPO", "On"], ["Resizable BAR", "On"], ["Power management", "Tuned"]],
    every: "Every day",
    daily: "My daily tools",
  },
  statement: {
    p1: "I tune your machine to give it everything",
    p2: "and design posters",
    p3: "that get noticed at first glance.",
    sub: "Built for people who want real results.",
    tags: ["#Gamers", "#Streamers", "#Creators", "#Discord communities"],
  },
  services: {
    eyebrow: "What I do",
    title: "5½ years optimizing PCs. 3 years designing.",
    sub: "A professional PC optimizer with clients, and a graphic designer working in Photoshop and Figma.",
    stats: [
      { v: 5.5, label: "years as a professional PC optimizer", note: "Working with clients" },
      { v: 3, label: "years of graphic design", note: "Photoshop & Figma" },
    ],
    pcTitle: "PC optimization",
    pcSub: "My typical checklist. Click to try it.",
    checks: [
      "XMP / EXPO profile enabled",
      "Resizable BAR enabled",
      "Power plan tuned",
      "Startup and services cleaned up",
      "Drivers up to date",
      "Temperatures verified",
    ],
    designTitle: "Design & posters",
    ps: "Posters, key visuals, retouching and compositions. The detail is in the pixels.",
    fg: "Clean layouts, mockups and banners that are easy to edit and to reuse.",
    whoTitle: "Who is it for?",
    who: {
      gamers: ["Gamers", "A more stable and more responsive PC, tuned for your hardware and your games."],
      streamers: ["Streamers", "A machine that handles the game and the stream, plus visuals that match your brand."],
      creators: ["Creators", "Posters, banners and thumbnails so your content stands out."],
      communities: ["Communities", "Event and announcement visuals for your server or your team."],
    },
    deliveryTitle: "Delivery",
    deliverySub: "Ready-to-use files, depending on what you need.",
  },
  work: {
    eyebrow: "Work",
    title: "Selected posters.",
    subReal: "Click a poster to enlarge it.",
    subDemo: "Demo placeholders. Drop your posters in src/assets/works/.",
    replace: "Replace me",
    close: "Close",
    poster: "Poster",
  },
  process: {
    eyebrow: "Process",
    title: "Simple from start to finish.",
    sub: "Three steps, no detours.",
    steps: [
      ["You message me", "Your setup, your problem or your poster idea. The more precise, the better."],
      ["I get to work", "Diagnosis then tuning for a PC, brief then mockup for a poster."],
      ["We check it", "Stability testing for the PC, feedback and adjustments for the visual."],
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Frequently asked questions",
    sub: "Can't find your answer?",
    btn: "Message me",
    items: [
      ["How long have you been doing this?", "I have been a professional PC optimizer for 5½ years, working with clients, and I have been doing graphic design for 3 years."],
      ["How does a PC optimization work?", "I start with a diagnosis of your setup: hardware, BIOS, Windows, temperatures. Then I apply the tweaks that make sense for how you use your PC, and we check that everything is stable."],
      ["Which file formats do you deliver for posters?", "Depending on what you need: PNG or JPG to publish right away, PSD or a Figma file if you want to edit it yourself."],
      ["How much does it cost?", "It depends on the project. Message me with your setup or your poster idea and I'll come back with a clear price."],
      ["How can I contact you?", "Through Discord or email, using the buttons on this page. The more details you give me, the more precise my answer will be."],
    ],
  },
  cta: {
    title: "A PC to boost or a poster to create?",
    text: "Message me with your setup or your idea and I'll get back to you as soon as possible.",
  },
  order: {
    title: "Tell me about your project",
    intro: "Fields marked * are required. I'll reply using your contact details.",
    name: "Name", contact: "Email or Discord username", contactHint: "you@example.com or @username",
    service: "Service", choose: "Choose a service", budget: "Budget (optional)", budgetHint: "e.g. €100–200",
    message: "Your project", messagePlaceholder: "Your setup, your needs, your idea…",
    messageHint: "20–1,000 characters · Up to 2 links",
    send: "Send my request", sending: "Sending…", retry: "Retry verification",
    success: "Thank you! Your request has been sent. I'll get back to you as soon as possible.",
    captchaUnavailable: "Anti-spam verification is unavailable. Please retry or contact me using the links below.",
    errors: {
      INVALID_FIELDS: "Check all required fields, the 20-character minimum and the limit of 2 links.",
      CAPTCHA_FAILED: "Please complete the anti-spam verification again, then retry.",
      RATE_LIMITED: "You've reached the limit of 3 requests per hour. Please try again later.",
      UNAVAILABLE: "Your request could not be confirmed. Please try again later or contact me directly.",
    },
  },
  footer: { top: "Back to top ↑" },
};

const fr = {
  meta: {
    title: "Luro — Optimisation PC, BIOS & Design",
    description: "Luro : optimiseur PC professionnel depuis plus de 5 ans et graphiste depuis 3 ans. Réglages BIOS, optimisation Windows et affiches sur Photoshop et Figma.",
  },
  nav: { services: "Services", work: "Créations", process: "Méthode", faq: "FAQ", home: "Luro, accueil", main: "Navigation principale", lang: "English" },
  float: "Me contacter",
  marquee: ["Optimisation PC", "Réglages BIOS", "Windows", "Affiches", "Photoshop", "Figma", "Miniatures", "Identité visuelle"],
  hero: {
    badge: "Nouveau",
    badgeText: "Disponible pour de nouveaux projets",
    h1a: "Des PC qui tournent vite.",
    h1b: "Des affiches qui claquent.",
    lead: "Optimiseur PC professionnel depuis 5 ans et demi, graphiste depuis 3 ans. Réglages BIOS, Windows et affiches sur Photoshop et Figma. Je m'appelle Luro.",
    cta1: "Discutons",
    cta2: "Voir mes créations",
    optimized: "PC optimisé",
    winbios: "Windows + BIOS",
    biosTitle: "Checklist BIOS",
    biosSub: "3 réglages clés",
    bios: [["XMP / EXPO", "Activé"], ["Resizable BAR", "Activé"], ["Gestion de l'énergie", "Réglé"]],
    every: "Au quotidien",
    daily: "Mes outils du quotidien",
  },
  statement: {
    p1: "Je règle ta machine pour qu'elle donne tout",
    p2: "et je dessine des affiches",
    p3: "qui se font remarquer au premier coup d'œil.",
    sub: "Pensé pour ceux qui veulent du concret.",
    tags: ["#Gamers", "#Streamers", "#Créateurs", "#Communautés Discord"],
  },
  services: {
    eyebrow: "Ce que je fais",
    title: "5 ans et demi à optimiser des PC. 3 ans à créer.",
    sub: "Optimiseur PC professionnel avec des clients, et graphiste sur Photoshop et Figma.",
    stats: [
      { v: 5.5, label: "ans comme optimiseur PC professionnel", note: "Je travaille avec des clients" },
      { v: 3, label: "ans de graphisme", note: "Photoshop & Figma" },
    ],
    pcTitle: "Optimisation PC",
    pcSub: "Ma checklist type. Clique pour l'essayer.",
    checks: [
      "Profil XMP / EXPO activé",
      "Resizable BAR activé",
      "Plan d'alimentation ajusté",
      "Démarrage et services nettoyés",
      "Pilotes à jour",
      "Températures vérifiées",
    ],
    designTitle: "Design & affiches",
    ps: "Affiches, visuels, retouches et compositions. Le détail se joue au pixel.",
    fg: "Mises en page, maquettes et bannières propres, faciles à modifier et à décliner.",
    whoTitle: "Pour qui ?",
    who: {
      gamers: ["Gamers", "Un PC plus stable et plus réactif, réglé sur ton matériel et tes jeux."],
      streamers: ["Streamers", "Une machine qui tient la charge du jeu et du stream, avec des visuels à ton image."],
      creators: ["Créateurs", "Des affiches, bannières et miniatures pour que ton contenu ressorte."],
      communities: ["Communautés", "Des visuels d'événements et d'annonces pour ton serveur ou ton équipe."],
    },
    deliveryTitle: "Livraison",
    deliverySub: "Des fichiers prêts à l'emploi, selon ton besoin.",
  },
  work: {
    eyebrow: "Créations",
    title: "Affiches sélectionnées.",
    subReal: "Clique sur une affiche pour l'agrandir.",
    subDemo: "Emplacements de démonstration. Dépose tes affiches dans src/assets/works/.",
    replace: "À remplacer",
    close: "Fermer",
    poster: "Affiche",
  },
  process: {
    eyebrow: "Méthode",
    title: "Simple du début à la fin.",
    sub: "Trois étapes, sans détour.",
    steps: [
      ["Tu m'écris", "Ta configuration, ton problème ou ton idée d'affiche. Plus c'est précis, mieux c'est."],
      ["Je m'en occupe", "Diagnostic puis réglages pour un PC, brief puis maquette pour une affiche."],
      ["On vérifie", "Test de stabilité pour le PC, retours et ajustements pour le visuel."],
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "Questions fréquentes",
    sub: "Tu ne trouves pas ta réponse ?",
    btn: "Écris-moi",
    items: [
      ["Depuis quand fais-tu ça ?", "Je suis optimiseur PC professionnel depuis 5 ans et demi, avec des clients, et je fais du graphisme depuis 3 ans."],
      ["Comment se passe une optimisation PC ?", "Je commence par un diagnostic de ta configuration : matériel, BIOS, Windows, températures. Ensuite j'applique les réglages qui ont du sens pour ton usage, puis on vérifie que tout est stable."],
      ["Quels formats pour les affiches ?", "Selon le besoin : PNG ou JPG pour publier tout de suite, PSD ou fichier Figma si tu veux pouvoir modifier toi-même."],
      ["Combien ça coûte ?", "Ça dépend du projet. Écris-moi avec ta configuration ou ton idée d'affiche et je te réponds avec un tarif clair."],
      ["Comment te contacter ?", "Par Discord ou par email, avec les boutons de la page. Plus tu me donnes de détails, plus ma réponse sera précise."],
    ],
  },
  cta: {
    title: "Un PC à booster ou une affiche à créer ?",
    text: "Écris-moi avec ta configuration ou ton idée, je te réponds dès que possible.",
  },
  order: {
    title: "Parle-moi de ton projet",
    intro: "Les champs marqués * sont obligatoires. Je te répondrai au contact indiqué.",
    name: "Nom", contact: "Email ou pseudo Discord", contactHint: "toi@exemple.fr ou @pseudo",
    service: "Service", choose: "Choisis un service", budget: "Budget (optionnel)", budgetHint: "Ex. : 100–200 €",
    message: "Ton projet", messagePlaceholder: "Ta configuration, ton besoin, ton idée…",
    messageHint: "20 à 1 000 caractères · 2 liens maximum",
    send: "Envoyer ma demande", sending: "Envoi en cours…", retry: "Relancer la vérification",
    success: "Merci ! Ta demande a bien été envoyée. Je te réponds dès que possible.",
    captchaUnavailable: "La vérification anti-spam est indisponible. Réessaie ou contacte-moi avec les liens ci-dessous.",
    errors: {
      INVALID_FIELDS: "Vérifie les champs obligatoires, le minimum de 20 caractères et la limite de 2 liens.",
      CAPTCHA_FAILED: "Valide à nouveau la vérification anti-spam, puis réessaie.",
      RATE_LIMITED: "Tu as atteint la limite de 3 envois par heure. Réessaie plus tard.",
      UNAVAILABLE: "L'envoi n'a pas pu être confirmé. Réessaie plus tard ou contacte-moi directement.",
    },
  },
  footer: { top: "Retour en haut ↑" },
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
  return "en";
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
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang, t]);

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export const useLang = () => useContext(LangContext);

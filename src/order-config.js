export const ORDER_LIMITS = { name: 80, email: 254, discord: 100, message: 1000 };
export const ORDER_CURRENCY = "eur";

// Amounts in cents. Proposed design prices can be changed here before launch.
export const ORDER_SERVICES = {
  landing: { group: "website", amount: 14900, fr: "Landing page", en: "Landing page", description: { fr: "1 page, jusqu’à 5 sections. Design responsive et liens de contact. 1 série de retours incluse.", en: "1 page, up to 5 sections. Responsive design and contact links. 1 revision round included." } },
  portfolio: { group: "website", amount: 24900, fr: "Portfolio", en: "Portfolio", description: { fr: "Jusqu’à 3 pages : présentation, projets et contact. Design responsive. 2 séries de retours incluses.", en: "Up to 3 pages: about, projects and contact. Responsive design. 2 revision rounds included." } },
  business: { group: "website", amount: 39900, fr: "Site vitrine", en: "Business website", description: { fr: "Jusqu’à 5 pages pour ton activité, design responsive et balises SEO de base. 2 séries de retours incluses.", en: "Up to 5 pages for your business, responsive design and basic SEO tags. 2 revision rounds included." } },
  pc: { group: "pc", amount: 9000, fr: "Optimisation complète", en: "Full PC optimization", description: { fr: "Windows + BIOS, diagnostic et vérification de stabilité.", en: "Windows + BIOS, diagnosis and stability checks." } },
  windows: { group: "pc", amount: 5000, fr: "Optimisation Windows", en: "Windows optimization", description: { fr: "Démarrage, services, pilotes et paramètres Windows.", en: "Startup, services, drivers and Windows settings." } },
  bios: { group: "pc", amount: 4000, fr: "Réglages BIOS", en: "BIOS tuning", description: { fr: "XMP / EXPO, Resizable BAR et réglages adaptés au matériel.", en: "XMP / EXPO, Resizable BAR and hardware-specific settings." } },
  thumbnail: { group: "design", amount: 2000, fr: "Miniature", en: "Thumbnail", description: { fr: "Une miniature personnalisée pour une vidéo ou un stream.", en: "One custom thumbnail for a video or stream." } },
  banner: { group: "design", amount: 2500, fr: "Bannière", en: "Banner", description: { fr: "Une bannière pour un profil, une chaîne ou un serveur.", en: "One banner for a profile, channel or server." } },
  poster: { group: "design", amount: 3500, fr: "Affiche / visuel", en: "Poster / key visual", description: { fr: "Une affiche ou un visuel d'annonce réalisé sur Photoshop.", en: "One poster or announcement visual made in Photoshop." } },
  retouch: { group: "design", amount: 2500, fr: "Retouche photo", en: "Photo retouching", description: { fr: "Retouche et composition d'un visuel existant.", en: "Retouching and composition of one existing visual." } },
  figma: { group: "design", amount: 6000, fr: "Maquette Figma", en: "Figma mockup", description: { fr: "La maquette d'un écran, avec son fichier Figma éditable.", en: "One screen mockup with its editable Figma file." } },
  branding: { group: "design", amount: 7500, fr: "Identité visuelle", en: "Visual identity", description: { fr: "Un kit de départ : avatar, bannière et palette de couleurs.", en: "A starter kit: avatar, banner and color palette." } },
};

export function formatPrice(amount, lang = "fr") {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US", {
    style: "currency", currency: ORDER_CURRENCY, maximumFractionDigits: 0,
  }).format(amount / 100);
}

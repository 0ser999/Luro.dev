import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";

export default function WebsiteService({ booking = false }) {
  const { lang } = useLang();
  const fr = lang === "fr";
  const subject = fr ? "Devis pour la création d’un site web" : "Website project quote";
  const body = fr ? "Bonjour Luro,\n\nJe souhaite créer un site web.\nType de site :\nPages souhaitées :\nFonctionnalités :\nBudget prévu :\nDélai souhaité :\nExemples de sites que j’aime :\n" : "Hi Luro,\n\nI’d like a website.\nWebsite type:\nPages needed:\nFeatures:\nEstimated budget:\nPreferred timeline:\nWebsites I like:\n";
  return <article className={`card website-service ${booking ? "website-quote" : ""}`} id={booking ? "website" : undefined}>
    <div className="website-copy">
      <span className="eyebrow">{fr ? "CRÉATION WEB · SUR DEVIS" : "WEB DEVELOPMENT · CUSTOM QUOTE"}</span>
      <h3>{fr ? "Un site à ton image." : "A website that feels like you."}</h3>
      <p>{fr ? "Je crée des sites web pour présenter ton activité, ton travail ou ton prochain projet. Un design soigné, adapté au mobile comme à l’ordinateur." : "I build websites for your business, your work or your next project. Thoughtful design for both mobile and desktop."}</p>
      <div className="project-tags"><span>{fr ? "Site vitrine" : "Business website"}</span><span>Portfolio</span><span>Landing page</span></div>
      {booking && <p className="website-note">{fr ? "Le tarif dépend des pages et fonctionnalités souhaitées. Décris ton projet par email pour recevoir un devis avant de réserver. Aucun paiement à cette étape." : "Pricing depends on the pages and features you need. Describe your project by email to get a quote before booking. No payment at this stage."}</p>}
      <a className="btn btn-dark" href={booking ? `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` : "/reservation.html#website"}>{fr ? "Demander un devis" : "Request a quote"} <span aria-hidden="true">↗</span></a>
      {booking && <small className="website-email">{fr ? "Ouvre ton application mail · " : "Opens your email app · "}{CONFIG.email}</small>}
    </div>
    {!booking && <div className="website-preview" aria-hidden="true"><div className="website-toolbar"><i /><i /><i /><span>your-website.com</span></div><div className="website-preview-body"><span>YOUR NEXT CHAPTER</span><strong>Make it<br />yours.</strong><div className="website-preview-button">Let’s create ↗</div><div className="website-preview-tiles"><i /><i /><i /></div></div></div>}
  </article>;
}

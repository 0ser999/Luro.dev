import { useLang } from "../i18n.jsx";
import { ORDER_SERVICES, formatPrice } from "../order-config.js";

export default function WebsiteService() {
  const { lang } = useLang();
  const fr = lang === "fr";
  return <article className="card website-service">
    <div className="website-copy">
      <span className="eyebrow">{fr ? "CRÉATION WEB" : "WEB DEVELOPMENT"} · {fr ? "DÈS" : "FROM"} {formatPrice(ORDER_SERVICES.landing.amount, lang)}</span>
      <h3>{fr ? "Un site à ton image." : "A website that feels like you."}</h3>
      <p>{fr ? "Je crée des sites web pour présenter ton activité, ton travail ou ton prochain projet. Un design soigné, adapté au mobile comme à l’ordinateur." : "I build websites for your business, your work or your next project. Thoughtful design for both mobile and desktop."}</p>
      <div className="project-tags"><span>{fr ? "Site vitrine" : "Business website"}</span><span>Portfolio</span><span>Landing page</span></div>
      <a className="btn btn-dark" href="/reservation.html#website">{fr ? "Choisir mon site" : "Choose my website"} <span aria-hidden="true">↗</span></a>
    </div>
    <div className="website-preview" aria-hidden="true"><div className="website-toolbar"><i /><i /><i /><span>your-website.com</span></div><div className="website-preview-body"><span>YOUR NEXT CHAPTER</span><strong>Make it<br />yours.</strong><div className="website-preview-button">Let’s create ↗</div><div className="website-preview-tiles"><i /><i /><i /></div></div></div>
  </article>;
}

import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";
import OrderForm from "./OrderForm.jsx";
import WebsiteService from "./WebsiteService.jsx";

export default function Booking() {
  const { lang } = useLang();
  const fr = lang === "fr";
  return <section className="booking-page" id="top">
    <div className="booking-intro">
      <a className="back-link" href="/">← {fr ? "Retour à l’accueil" : "Back to home"}</a>
      <span className="eyebrow">{fr ? "FAISONS ÉVOLUER TON PROJET" : "YOUR NEXT CHAPTER"}</span>
      <h1>{fr ? "Un petit pas.\nUne vraie différence." : "One small step.\nA real difference."}</h1>
      <p>{fr ? "Un PC à optimiser, un visuel à imaginer ou un site web à créer. Réserve ta prestation ou demande un devis pour ton site." : "A PC to optimize, a visual to imagine or a website to build. Book a service or request a quote for your website."}</p>
      <a className="website-booking-link" href="#website">{fr ? "Un projet de site web ? Demander un devis ↓" : "Need a website? Request a quote ↓"}</a>
      <div className="booking-details"><span>01 / {fr ? "Une prestation adaptée" : "A service that fits"}</span><span>02 / {fr ? "Un brief à ton image" : "Your own brief"}</span><span>03 / {fr ? "Paiement sécurisé avec Stripe" : "Secure payment with Stripe"}</span></div>
      <a className="back-link" href={`mailto:${CONFIG.email}`}>{fr ? "Besoin d’en parler ?" : "Want to talk first?"} ↗</a>
    </div>
    <div className="booking-form-wrap" id="contact"><OrderForm /><WebsiteService booking /></div>
  </section>;
}

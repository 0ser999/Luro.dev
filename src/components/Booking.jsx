import { useEffect, useState } from "react";
import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";
import OrderForm from "./OrderForm.jsx";
import WebsiteService from "./WebsiteService.jsx";

export default function Booking() {
  const { lang } = useLang();
  const fr = lang === "fr";
  const paymentReturn = new URLSearchParams(window.location.search).has("payment");
  const [category, setCategory] = useState(() => !paymentReturn && window.location.hash === "#website" ? "website" : "pc");
  useEffect(() => {
    const onHash = () => { if (!paymentReturn && window.location.hash === "#website") setCategory("website"); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [paymentReturn]);
  return <section className="booking-page" id="top">
    <div className="booking-intro">
      <a className="back-link" href="/">← {fr ? "Retour à l’accueil" : "Back to home"}</a>
      <span className="eyebrow">{fr ? "FAISONS ÉVOLUER TON PROJET" : "YOUR NEXT CHAPTER"}</span>
      <h1>{fr ? "Un petit pas.\nUne vraie différence." : "One small step.\nA real difference."}</h1>
      <p>{fr ? "Un PC à optimiser, un visuel à imaginer ou un site web à créer. Réserve ta prestation ou demande un devis pour ton site." : "A PC to optimize, a visual to imagine or a website to build. Book a service or request a quote for your website."}</p>
      {!paymentReturn && <a className="website-booking-link" href="#website" onClick={() => setCategory("website")}>{fr ? "Un projet de site web ? Demander un devis ↓" : "Need a website? Request a quote ↓"}</a>}
      <div className="booking-details"><span>01 / {fr ? "Une prestation adaptée" : "A service that fits"}</span><span>02 / {fr ? "Un brief à ton image" : "Your own brief"}</span><span>03 / {fr ? "Paiement sécurisé avec Stripe" : "Secure payment with Stripe"}</span></div>
      <a className="back-link" href={`mailto:${CONFIG.email}`}>{fr ? "Besoin d’en parler ?" : "Want to talk first?"} ↗</a>
    </div>
    <div className="booking-form-wrap" id="contact">
      {!paymentReturn && <div className="service-categories booking-categories" role="group" aria-label={fr ? "Choisir une prestation" : "Choose a service"}>
        {[["pc", fr ? "Optimisation PC" : "PC optimization"], ["design", fr ? "Design & visuels" : "Design & visuals"], ["website", fr ? "Site web" : "Website"]].map(([id, label]) => <button key={id} type="button" aria-pressed={category === id} onClick={() => setCategory(id)}>{label}</button>)}
      </div>}
      <div hidden={!paymentReturn && category === "website"}><OrderForm category={paymentReturn ? undefined : category} /></div>
      {!paymentReturn && category === "website" && <WebsiteService booking />}
    </div>
  </section>;
}

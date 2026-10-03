import Reveal from "./Reveal.jsx";
import { CONFIG } from "../config.js";
import Clouds from "./Clouds.jsx";
import { useLang } from "../i18n.jsx";

export default function Cta() {
  const { t, lang } = useLang();
  const c = t.cta;

  return (
    <section className="cta-wrap" id="contact">
      <Reveal className="cta">
        <i className="sun" aria-hidden="true" />
        <Clouds layout="cta" />
        <h2>{c.title}</h2>
        <p>{c.text}</p>
        <div className="hero-actions cta-buttons">
          <a className="btn btn-dark" href="/reservation.html">
            {c.btnBook} <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn-glass" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
              <path d="M19.6 5.3A16.5 16.5 0 0 0 15.5 4l-.2.4a15 15 0 0 1 3.7 1.9 13.6 13.6 0 0 0-12-.1A15 15 0 0 1 10.7 4.4L10.5 4a16.5 16.5 0 0 0-4.1 1.3C3.8 9.2 3.1 13 3.4 16.7a16.6 16.6 0 0 0 5 2.5l1.1-1.8a10.8 10.8 0 0 1-1.7-.8l.4-.3a11.8 11.8 0 0 0 10.1 0l.4.3a10.8 10.8 0 0 1-1.7.8l1.1 1.8a16.5 16.5 0 0 0 5-2.5c.4-4.3-.7-8-2.5-11.4ZM9.3 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" />
            </svg>
            {c.btnDiscord}
          </a>
          <a className="btn btn-glass" href="#services">
            {c.btnServices}
          </a>
        </div>
        <div className="cta-trust-note">
          <span>{lang === "fr" ? "🔒 Paiement 100% sécurisé Stripe" : "🔒 100% Secure Stripe Checkout"}</span>
          <span>·</span>
          <span>{lang === "fr" ? "⚡ Prise en charge rapide" : "⚡ Rapid scheduling"}</span>
          <span>·</span>
          <span>{lang === "fr" ? "🛡️ Réversibilité garantie" : "🛡️ Guaranteed reversibility"}</span>
        </div>
      </Reveal>
    </section>
  );
}

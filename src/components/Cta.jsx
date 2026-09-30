import Reveal from "./Reveal.jsx";
import { CONFIG } from "../config.js";
import Clouds from "./Clouds.jsx";
import { useLang } from "../i18n.jsx";

export default function Cta() {
  const { t, lang } = useLang();

  return (
    <section className="cta-wrap" id="contact">
      <Reveal className="cta">
        <i className="sun" aria-hidden="true" />
        <Clouds layout="cta" />
        <h2>{t.cta.title}</h2>
        <p>{t.cta.text}</p>
        <div className="hero-actions">
          <a className="btn btn-dark" href="/reservation.html">{lang === "fr" ? "Réserver une prestation" : "Book a service"} <span aria-hidden="true">↗</span></a>
          <a className="btn btn-glass" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">{lang === "fr" ? "Une question ?" : "Have a question?"}</a>
        </div>
      </Reveal>
    </section>
  );
}

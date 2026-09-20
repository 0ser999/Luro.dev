import Reveal from "./Reveal.jsx";
import { CONFIG } from "../config.js";
import Clouds from "./Clouds.jsx";
import { useLang } from "../i18n.jsx";
import OrderForm from "./OrderForm.jsx";

export default function Cta() {
  const { t } = useLang();

  return (
    <section className="cta-wrap" id="contact">
      <Reveal className="cta">
        <i className="sun" aria-hidden="true" />
        <Clouds layout="cta" />
        <h2>{t.cta.title}</h2>
        <p>{t.cta.text}</p>
        <OrderForm />
        <div className="hero-actions">
          <a className="btn btn-dark" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">Discord</a>
          <a className="btn btn-glass" href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
        </div>
      </Reveal>
    </section>
  );
}

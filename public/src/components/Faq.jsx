import { useState } from "react";
import Reveal from "./Reveal.jsx";
import { CONFIG } from "../config.js";
import { useLang } from "../i18n.jsx";

export default function Faq() {
  const { t } = useLang();
  const f = t.faq;
  const [open, setOpen] = useState(0);

  return (
    <section className="section faq" id="faq">
      <Reveal className="head left">
        <span className="eyebrow">{f.eyebrow}</span>
        <h2>{f.title}</h2>
        <p>{f.sub}</p>
        <a className="btn btn-dark" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
          {f.btn}
        </a>
      </Reveal>

      <Reveal className="acc" delay={80}>
        {f.items.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={i} className={`acc-item ${isOpen ? "open" : ""}`}>
              <button aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span>{q}</span>
                <i aria-hidden="true" />
              </button>
              <div className="acc-body"><p>{a}</p></div>
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}

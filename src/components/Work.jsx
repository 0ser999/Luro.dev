import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import { WORKS } from "../config.js";
import { useLang } from "../i18n.jsx";
import Velyro from "./Velyro.jsx";

export default function Work() {
  const { t, lang } = useLang();
  const w = t.work;
  const [open, setOpen] = useState(null);
  const real = WORKS.length > 0;


  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section" id="work">
      <Reveal className="head">
        <span className="eyebrow">{lang === "fr" ? "Dans les coulisses" : "Behind the scenes"}</span>
        <h2>{lang === "fr" ? "De l’idée au concret." : "From idea to reality."}</h2>
        <p>{lang === "fr" ? "Un logiciel abouti. Des idées pour aller plus loin." : "A complete application. More ideas ahead."}</p>
      </Reveal>

      <Velyro />
      {real && <div className="rail">
        {WORKS.map((it, i) => (
          <Reveal key={i} delay={i * 60} className="poster-wrap">

              <button className="poster" onClick={() => setOpen(it)}>
                <img src={it.img} alt={it.title} loading="lazy" />
                <span className="cap"><b>{it.title}</b>{it.tag}</span>
              </button>

          </Reveal>
        ))}
      </div>}

      {open && (
        <div className="lightbox" data-lenis-prevent onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
          <button className="lb-close" aria-label={w.close}>×</button>
          <img src={open.img} alt={open.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}


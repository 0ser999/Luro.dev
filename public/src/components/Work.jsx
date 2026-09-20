import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import { WORKS } from "../config.js";
import { useLang } from "../i18n.jsx";

const DEMO = [
  { tag: "Photoshop", g: "linear-gradient(160deg,#8ccbff,#2b7fe0 70%,#0a2350)" },
  { tag: "Figma", g: "linear-gradient(160deg,#7c8cff,#3a2fb5 70%,#0e0a3a)" },
  { tag: "Photoshop", g: "linear-gradient(160deg,#3ddc97,#0b7a55 70%,#04241a)" },
  { tag: "Figma", g: "linear-gradient(160deg,#ff6fa5,#b3155f 70%,#2b0417)" },
  { tag: "Photoshop", g: "linear-gradient(160deg,#a8ece0,#0f8f9a 70%,#04252b)" },
];

export default function Work() {
  const { t } = useLang();
  const w = t.work;
  const [open, setOpen] = useState(null);
  const real = WORKS.length > 0;
  const items = real ? WORKS : DEMO.map((d, i) => ({ ...d, title: `${w.poster} 0${i + 1}` }));

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section" id="work">
      <Reveal className="head">
        <span className="eyebrow">{w.eyebrow}</span>
        <h2>{w.title}</h2>
        <p>{real ? w.subReal : w.subDemo}</p>
      </Reveal>

      <div className="rail">
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 60} className="poster-wrap">
            {real ? (
              <button className="poster" onClick={() => setOpen(it)}>
                <img src={it.img} alt={it.title} loading="lazy" />
                <span className="cap"><b>{it.title}</b>{it.tag}</span>
              </button>
            ) : (
              <div className="poster demo" style={{ background: it.g }}>
                <span className="cap"><b>{it.title}</b>{it.tag}</span>
                <i className="ph">{w.replace}</i>
              </div>
            )}
          </Reveal>
        ))}
      </div>

      {open && (
        <div className="lightbox" data-lenis-prevent onClick={() => setOpen(null)} role="dialog" aria-modal="true" aria-label={open.title}>
          <button className="lb-close" aria-label={w.close}>×</button>
          <img src={open.img} alt={open.title} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}

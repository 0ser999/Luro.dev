import { useState } from "react";
import Reveal from "./Reveal.jsx";
import Stats from "./Stats.jsx";
import WebsiteService from "./WebsiteService.jsx";
import { Photoshop, Figma } from "./BrandIcons.jsx";
import { useLang } from "../i18n.jsx";

const TOOLS = { Photoshop: { key: "ps", art: "ps" }, Figma: { key: "fg", art: "fg" } };

// cursor-following glow inside each card (see .card::before)
function spotlight(e) {
  const card = e.target.closest(".card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", `${e.clientX - r.left}px`);
  card.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Toggle({ on, onClick, label }) {
  return (
    <button className={`toggle ${on ? "on" : ""}`} role="switch" aria-checked={on} aria-label={label} onClick={onClick}>
      <i />
    </button>
  );
}

export default function Services() {
  const { t } = useLang();
  const s = t.services;
  const [done, setDone] = useState(() => new Set([0, 1]));
  const [tool, setTool] = useState("Photoshop");
  const [who, setWho] = useState("gamers");

  const flip = (i) =>
    setDone((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pct = Math.round((done.size / s.checks.length) * 100);

  return (
    <section className="section" id="services">
      <Reveal className="head">
        <span className="eyebrow">{s.eyebrow}</span>
        <h2>{s.title}</h2>
        <p>{s.sub}</p>
      </Reveal>

      <Stats />

      <div className="bento" onMouseMove={spotlight}>
        <Reveal className="website-service-wrap"><WebsiteService /></Reveal>
        <Reveal className="card c-pc">
          <div className="card-top">
            <div>
              <h3>{s.pcTitle}</h3>
              <p>{s.pcSub}</p>
            </div>
            <span className="score">{pct}%</span>
          </div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <ul className="checks">
            {s.checks.map((c, i) => (
              <li key={i} className={done.has(i) ? "done" : ""}>
                <span>{c}</span>
                <Toggle on={done.has(i)} onClick={() => flip(i)} label={c} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="card c-design" delay={80}>
          <h3>{s.designTitle}</h3>
          <div className="seg" role="tablist">
            {Object.keys(TOOLS).map((k) => (
              <button key={k} role="tab" aria-selected={tool === k} className={tool === k ? "on" : ""} onClick={() => setTool(k)}>
                {k === "Photoshop" ? <Photoshop size={18} /> : <Figma size={18} />}
                {k}
              </button>
            ))}
          </div>
          <p>{s[TOOLS[tool].key]}</p>
          <div className={`artboard ${TOOLS[tool].art}`} aria-hidden="true">
            <span className="a1" />
            <span className="a2" />
            <span className="a3" />
          </div>
        </Reveal>

        <Reveal className="card c-who">
          <h3>{s.whoTitle}</h3>
          <div className="seg wrap" role="tablist">
            {Object.entries(s.who).map(([id, [label]]) => (
              <button key={id} role="tab" aria-selected={who === id} className={who === id ? "on" : ""} onClick={() => setWho(id)}>
                {label}
              </button>
            ))}
          </div>
          <p className="big-p">{s.who[who][1]}</p>
        </Reveal>

        <Reveal className="card c-files" delay={80}>
          <h3>{s.deliveryTitle}</h3>
          <p>{s.deliverySub}</p>
          <div className="filechips">
            {["PNG", "JPG", "PSD", "Figma"].map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

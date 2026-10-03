import { useState } from "react";
import Reveal from "./Reveal.jsx";
import Stats from "./Stats.jsx";
import { Photoshop, Figma } from "./BrandIcons.jsx";
import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";

const TOOLS = { Photoshop: { key: "ps", art: "ps" }, Figma: { key: "fg", art: "fg" } };

function spotlight(e) {
  const card = e.target.closest(".card, .service-detail-card");
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
  const { t, lang } = useLang();
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

  const checks = [
    lang === "fr" ? "Profil XMP / EXPO activé" : "XMP / EXPO profile enabled",
    lang === "fr" ? "Resizable BAR activé" : "Resizable BAR enabled",
    lang === "fr" ? "Plan d'alimentation ajusté" : "Power plan tuned",
    lang === "fr" ? "Démarrage et services nettoyés" : "Startup and services cleaned up",
    lang === "fr" ? "Pilotes sans télémétrie à jour" : "Clean drivers up to date",
    lang === "fr" ? "Températures et stabilité vérifiées" : "Temperatures & stability verified",
  ];

  const pct = Math.round((done.size / checks.length) * 100);

  return (
    <section className="section" id="services">
      <Reveal className="head">
        <span className="eyebrow">{s.eyebrow}</span>
        <h2>{s.title}</h2>
        <p>{s.sub}</p>
      </Reveal>

      <Stats />

      {/* ─── Detailed Services Catalog ─── */}
      <div className="services-catalog-grid" onMouseMove={spotlight}>
        {s.items.map((item, idx) => (
          <Reveal key={item.id} className={`service-detail-card ${item.id === "gaming" ? "featured" : ""}`} delay={idx * 60}>
            <div className="service-card-top">
              <span className="service-badge">{item.badge}</span>
              <div className="service-price-tag">
                <span className="price">{item.price}</span>
                <span className="duration">{item.duration}</span>
              </div>
            </div>

            <h3 className="service-title">{item.title}</h3>
            <p className="service-desc">{item.desc}</p>

            <ul className="service-features-list">
              {item.features.map((feat, fIdx) => (
                <li key={fIdx}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="service-target-box">
              <span className="target-label">{lang === "fr" ? "Recommandé pour :" : "Ideal for:"}</span>
              <span className="target-text">{item.target}</span>
            </div>

            <div className="service-card-actions">
              <a className="btn btn-dark service-btn" href="/reservation.html">
                {s.ctaCard} ↗
              </a>
              <a className="btn btn-glass service-btn-sec" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
                {s.contactDiscord}
              </a>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ─── Interactive Bento Workshop ─── */}
      <Reveal className="head services-subhead" delay={60}>
        <span className="eyebrow">{lang === "fr" ? "Atelier interactif" : "Interactive Playground"}</span>
        <h3>{lang === "fr" ? "Testez les réglages et explorez les outils." : "Try settings and explore our toolset."}</h3>
      </Reveal>

      <div className="bento" onMouseMove={spotlight}>
        <Reveal className="card c-pc">
          <div className="card-top">
            <div>
              <h3>{lang === "fr" ? "Simulateur d'Optimisation" : "Optimization Simulator"}</h3>
              <p>{lang === "fr" ? "Cliquez sur les étapes pour simuler votre gain de stabilité." : "Click settings to simulate your performance gain."}</p>
            </div>
            <span className="score">{pct}%</span>
          </div>
          <div className="bar"><i style={{ width: `${pct}%` }} /></div>
          <ul className="checks">
            {checks.map((c, i) => (
              <li key={i} className={done.has(i) ? "done" : ""}>
                <span>{c}</span>
                <Toggle on={done.has(i)} onClick={() => flip(i)} label={c} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="card c-design" delay={80}>
          <h3>{lang === "fr" ? "Outils Graphiques" : "Design Toolkit"}</h3>
          <div className="seg" role="tablist">
            {Object.keys(TOOLS).map((k) => (
              <button key={k} role="tab" aria-selected={tool === k} className={tool === k ? "on" : ""} onClick={() => setTool(k)}>
                {k === "Photoshop" ? <Photoshop size={18} /> : <Figma size={18} />}
                {k}
              </button>
            ))}
          </div>
          <p>{tool === "Photoshop" 
            ? (lang === "fr" ? "Affiches, retouches et visuels ultra détaillés au pixel près." : "Posters, key visuals and pixel-perfect photo manipulation.")
            : (lang === "fr" ? "Maquettes d'applications, bannières et identités faciles à décliner." : "Application mockups, banners and reusable component libraries.")}
          </p>
          <div className={`artboard ${TOOLS[tool].art}`} aria-hidden="true">
            <span className="a1" />
            <span className="a2" />
            <span className="a3" />
          </div>
        </Reveal>

        <Reveal className="card c-who">
          <h3>{lang === "fr" ? "Pour qui ?" : "Who is it for?"}</h3>
          <div className="seg wrap" role="tablist">
            {Object.entries({
              gamers: [lang === "fr" ? "Gamers" : "Gamers", lang === "fr" ? "Un PC plus stable, sans micro-saccades et avec un input lag ultra faible." : "A stable, stutter-free PC with razor-sharp mouse tracking."],
              streamers: [lang === "fr" ? "Streamers" : "Streamers", lang === "fr" ? "Une machine qui encaisse le jeu et l'encodage OBS sans aucune perte d'images." : "Handle heavy games and OBS encoding simultaneously without frame drops."],
              creators: [lang === "fr" ? "Créateurs" : "Creators", lang === "fr" ? "Miniatures YouTube et bannières qui font exploser votre taux de clic." : "YouTube thumbnails and banners engineered for maximum click-through rates."],
              esport: [lang === "fr" ? "Esport" : "Esport", lang === "fr" ? "Affiches de tournois, logos et visuels de tournois professionnels." : "Tournament key visuals, tournament graphics and esports branding."],
            }).map(([id, [label, desc]]) => (
              <button key={id} role="tab" aria-selected={who === id} className={who === id ? "on" : ""} onClick={() => setWho(id)}>
                {label}
              </button>
            ))}
          </div>
          <p className="big-p">
            {who === "gamers" && (lang === "fr" ? "Un PC plus stable, sans micro-saccades et avec un input lag ultra faible." : "A stable, stutter-free PC with razor-sharp mouse tracking.")}
            {who === "streamers" && (lang === "fr" ? "Une machine qui encaisse le jeu et l'encodage OBS sans aucune perte d'images." : "Handle heavy games and OBS encoding simultaneously without frame drops.")}
            {who === "creators" && (lang === "fr" ? "Miniatures YouTube et bannières qui font exploser votre taux de clic." : "YouTube thumbnails and banners engineered for maximum click-through rates.")}
            {who === "esport" && (lang === "fr" ? "Affiches de tournois, logos et visuels de tournois professionnels." : "Tournament key visuals, tournament graphics and esports branding.")}
          </p>
        </Reveal>

        <Reveal className="card c-files" delay={80}>
          <h3>{lang === "fr" ? "Formats de Livraison" : "Deliverables"}</h3>
          <p>{lang === "fr" ? "Fichiers sources et exports prêts à publier selon vos besoins." : "Ready-to-use exports & editable project source files."}</p>
          <div className="filechips">
            {["PNG", "JPG", "PSD", "Figma", "WebP"].map((f) => (
              <span key={f}>{f}</span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

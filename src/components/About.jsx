import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";

export default function About() {
  const { t } = useLang();
  const a = t.about;

  return (
    <section className="section about-section" id="about">
      <Reveal className="head">
        <span className="eyebrow">{a.eyebrow}</span>
        <h2>{a.title}</h2>
        <p>{a.lead}</p>
      </Reveal>

      <div className="about-grid">
        <Reveal className="about-main-card">
          <div className="about-bio-header">
            <div className="about-avatar">
              <img src="/logo.jpg" alt="Luro" width="72" height="72" />
              <span className="avatar-status" title="En ligne sur Discord" />
            </div>
            <div>
              <h3>Luro</h3>
              <p className="about-tagline">{a.tagline}</p>
            </div>
          </div>
          <p className="about-story-text">{a.story}</p>
          <div className="about-actions">
            <a className="btn btn-dark" href="/reservation.html">
              {t.hero.cta1} <span aria-hidden="true">↗</span>
            </a>
            <a className="btn btn-glass" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
              Discord ↗
            </a>
          </div>
        </Reveal>

        <Reveal className="about-stats-card" delay={60}>
          {a.stats.map((st, i) => (
            <div key={i} className="about-stat-item">
              <div className="stat-num-badge">{st.num}</div>
              <div className="stat-text-wrap">
                <strong>{st.label}</strong>
                <span>{st.sub}</span>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="about-pillars-header" delay={80}>
        <h3>{a.pillarsTitle}</h3>
      </Reveal>

      <div className="about-pillars-grid">
        {a.pillars.map((p, i) => (
          <Reveal key={i} className="about-pillar-card" delay={i * 60}>
            <div className="pillar-num">0{i + 1}</div>
            <h4>{p.title}</h4>
            <p>{p.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

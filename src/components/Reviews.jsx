import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";
import { CONFIG } from "../config.js";

export default function Reviews() {
  const { t, lang } = useLang();
  const r = t.reviews;

  return (
    <section className="section reviews-section" id="reviews">
      <Reveal className="head">
        <span className="eyebrow">{r.eyebrow}</span>
        <h2>{r.title}</h2>
        <p>{r.sub}</p>
      </Reveal>

      <Reveal className="reviews-score-banner">
        <div className="score-badge">
          <span className="score-num">{r.score}</span>
          <div className="score-stars" aria-label="5 out of 5 stars">
            {"★★★★★"}
          </div>
        </div>
        <div className="score-info">
          <strong>{r.scoreNote}</strong>
          <span>{lang === "fr" ? "Témoignages recueillis publiquement sur notre serveur Discord" : "Public feedback collected on our Discord server"}</span>
        </div>
        <a className="btn btn-glass score-btn" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
          {lang === "fr" ? "Vérifier sur Discord ↗" : "Verify on Discord ↗"}
        </a>
      </Reveal>

      <div className="reviews-grid">
        {r.items.map((rev, i) => (
          <Reveal key={i} className="review-card" delay={i * 60}>
            <div className="review-header">
              <div className="review-avatar">{rev.avatar}</div>
              <div className="review-meta">
                <div className="review-author-line">
                  <h4>{rev.author}</h4>
                  {rev.verified && (
                    <span className="verified-badge" title={lang === "fr" ? "Avis client vérifié" : "Verified client review"}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      {lang === "fr" ? "Vérifié" : "Verified"}
                    </span>
                  )}
                </div>
                <small className="review-role">{rev.role}</small>
              </div>
              <div className="review-stars">★★★★★</div>
            </div>
            <p className="review-text">« {rev.content} »</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

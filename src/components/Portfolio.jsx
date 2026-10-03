import { useEffect, useState } from "react";
import Reveal from "./Reveal.jsx";
import Velyro from "./Velyro.jsx";
import { WORKS } from "../config.js";
import { useLang } from "../i18n.jsx";

export default function Portfolio() {
  const { t, lang } = useLang();
  const p = t.portfolio;
  const [activeTab, setActiveTab] = useState("benchmarks");
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setSelectedImg(null);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  return (
    <section className="section portfolio-section" id="portfolio">
      <Reveal className="head">
        <span className="eyebrow">{p.eyebrow}</span>
        <h2>{p.title}</h2>
        <p>{p.sub}</p>
      </Reveal>

      <Reveal className="portfolio-tabs-wrap">
        <div className="portfolio-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={activeTab === "benchmarks"}
            className={activeTab === "benchmarks" ? "active" : ""}
            onClick={() => setActiveTab("benchmarks")}
          >
            ⚡ {p.tabBenchmarks}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "designs"}
            className={activeTab === "designs" ? "active" : ""}
            onClick={() => setActiveTab("designs")}
          >
            🎨 {p.tabDesigns}
          </button>
          <button
            role="tab"
            aria-selected={activeTab === "velyro"}
            className={activeTab === "velyro" ? "active" : ""}
            onClick={() => setActiveTab("velyro")}
          >
            🚀 {p.tabVelyro}
          </button>
        </div>
      </Reveal>

      {activeTab === "benchmarks" && (
        <div className="benchmarks-grid">
          {p.benchmarks.map((b, i) => (
            <Reveal key={i} className="benchmark-card" delay={i * 70}>
              <div className="benchmark-top">
                <div>
                  <span className="benchmark-tool">{b.tool}</span>
                  <h3>{b.title}</h3>
                </div>
                <span className="benchmark-diff-badge">{b.diff}</span>
              </div>

              <div className="benchmark-comparison">
                <div className="comparison-col before">
                  <div className="comparison-meta">
                    <span className="col-label">{lang === "fr" ? "Avant" : "Before"}</span>
                    <strong>{b.beforeVal}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill before-bar" style={{ width: i === 1 ? "48%" : "85%" }} />
                  </div>
                </div>

                <div className="comparison-col after">
                  <div className="comparison-meta">
                    <span className="col-label highlight">{lang === "fr" ? "Après Luro" : "After Luro"}</span>
                    <strong className="highlight">{b.afterVal}</strong>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill after-bar" style={{ width: i === 1 ? "95%" : "18%" }} />
                  </div>
                </div>
              </div>

              <p className="benchmark-explanation">{b.explanation}</p>
            </Reveal>
          ))}
        </div>
      )}

      {activeTab === "designs" && (
        <div className="designs-showcase-grid">
          {p.showcase.map((item, idx) => (
            <Reveal key={idx} className="design-card" delay={idx * 60}>
              <div
                className="design-card-art"
                style={{ "--accent-c": item.color }}
                onClick={() => setSelectedImg({ title: item.title, tag: item.tag, color: item.color })}
              >
                <div className="art-glare" />
                <div className="art-badge">{item.tag}</div>
                <div className="art-center-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                    <circle cx="9" cy="9" r="2"/>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                  </svg>
                </div>
                <div className="art-footer-tag">
                  <span>{item.category}</span>
                  <span className="zoom-hint">↗</span>
                </div>
              </div>
              <div className="design-card-info">
                <h4>{item.title}</h4>
                <p>{item.category}</p>
              </div>
            </Reveal>
          ))}

          {WORKS.map((it, i) => (
            <Reveal key={`real-${i}`} delay={i * 60} className="design-card">
              <div className="design-card-art custom" onClick={() => setSelectedImg(it)}>
                <img src={it.img} alt={it.title} loading="lazy" />
              </div>
              <div className="design-card-info">
                <h4>{it.title}</h4>
                <p>{it.tag || "Photoshop"}</p>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {activeTab === "velyro" && (
        <Reveal>
          <Velyro />
        </Reveal>
      )}

      {selectedImg && (
        <div
          className="lightbox"
          data-lenis-prevent
          onClick={() => setSelectedImg(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selectedImg.title}
        >
          <button className="lb-close" aria-label="Close" onClick={() => setSelectedImg(null)}>
            ×
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            {selectedImg.img ? (
              <img src={selectedImg.img} alt={selectedImg.title} />
            ) : (
              <div className="lightbox-mockup" style={{ borderColor: selectedImg.color }}>
                <span className="lb-mock-tag">{selectedImg.tag}</span>
                <h3>{selectedImg.title}</h3>
                <p>{lang === "fr" ? "Création haute résolution sous Photoshop & Figma" : "High-resolution design made in Photoshop & Figma"}</p>
                <div className="lb-actions">
                  <a className="btn btn-dark" href="/reservation.html">
                    {lang === "fr" ? "Commander un design similaire" : "Order a similar design"} ↗
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

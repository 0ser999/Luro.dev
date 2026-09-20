import { useEffect, useRef } from "react";
import { CONFIG } from "../config.js";
import { useLang } from "../i18n.jsx";
import { Photoshop, Figma, Windows } from "./BrandIcons.jsx";

const rise = (i) => ({ "--i": i });

export default function Hero() {
  const { t } = useLang();
  const h = t.hero;
  const bg = useRef(null);

  // gentle parallax: the sky moves slower than the page while the hero is on screen
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      if (y < window.innerHeight * 1.3) bg.current?.style.setProperty("--py", (y * 0.25).toFixed(1));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true" ref={bg}>
        <img className="sky" src="/hero-bg.avif" alt="" fetchpriority="high" />
        <i className="sky-wash" />
      </div>

      <div className="hero-inner">
        <p className="badge rise" style={rise(0)}>
          <b>{h.badge}</b> {h.badgeText}
        </p>
        <h1>
          <span className="rise" style={rise(1)}>{h.h1a}</span>
          <span className="rise" style={rise(2)}>{h.h1b}</span>
        </h1>
        <p className="hero-lead rise" style={rise(3)}>{h.lead}</p>
        <div className="hero-actions rise" style={rise(4)}>
          <a className="btn btn-dark" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
            {h.cta1}
          </a>
          <a className="btn btn-glass" href="#work">
            {h.cta2}
          </a>
        </div>
      </div>

      <div className="hero-cards" aria-hidden="true">
        <div className="glass side" style={rise(6)}>
          <div className="ring">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
          </div>
          <p>{h.optimized}</p>
          <small>{h.winbios}</small>
        </div>

        <div className="glass mid" style={rise(5)}>
          <header>
            <div>
              <strong>{h.biosTitle}</strong>
              <small>{h.biosSub}</small>
            </div>
            <span className="chip-dark">UEFI</span>
          </header>
          {h.bios.map(([name, state], i) => (
            <div className="row" key={name}>
              <span className={`dot ${i === 2 ? "mid" : ""}`} />
              <div>
                <strong>{name}</strong>
              </div>
              <em>{state}</em>
            </div>
          ))}
        </div>

        <div className="glass side" style={rise(7)}>
          <p className="goal">{h.every}</p>
          <div className="tools">
            <span title="Photoshop"><Photoshop size={26} /></span>
            <span title="Figma"><Figma size={22} /></span>
            <span title="Windows"><Windows size={20} /></span>
          </div>
          <small>{h.daily}</small>
        </div>
      </div>
    </section>
  );
}

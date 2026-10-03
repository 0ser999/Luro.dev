import { useEffect, useRef, useState } from "react";
import { CONFIG } from "../config.js";
import { useLang } from "../i18n.jsx";
import LegalModal from "./LegalModal.jsx";

const WORD = "Luro";
const IDS = ["services", "portfolio", "about", "reviews", "faq"];

function GiantText() {
  const box = useRef(null);
  const word = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const fit = () => {
      const b = box.current;
      const w = word.current;
      if (!b || !w) return;
      w.style.fontSize = "100px";
      const cs = getComputedStyle(b);
      const avail = b.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ratio = avail / w.offsetWidth;
      w.style.fontSize = `${100 * ratio}px`;
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(box.current);
    document.fonts?.ready.then(fit);

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(box.current);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div className={`giant ${shown ? "in" : ""}`} ref={box} aria-hidden="true">
      <div className="giant-word" ref={word}>
        {[...WORD].map((ch, i) => (
          <span key={i} style={{ transitionDelay: `${i * 70}ms` }}>
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Footer() {
  const { t, lang } = useLang();
  const [legalTab, setLegalTab] = useState(null);

  return (
    <>
      <footer className="footer">
        <div className="footer-top">
          <nav className="footer-links" aria-label={t.nav.main}>
            {IDS.map((id) => (
              <a key={id} href={`/#${id}`}>
                {t.nav[id]}
              </a>
            ))}
            <a href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
            <a href={`mailto:${CONFIG.email}`}>Email</a>
          </nav>
          <div className="footer-legal-links">
            <button className="legal-link-btn" onClick={() => setLegalTab("notices")}>
              {t.footer.legal}
            </button>
            <span className="dot-sep">·</span>
            <button className="legal-link-btn" onClick={() => setLegalTab("tos")}>
              {t.footer.tos}
            </button>
            <span className="dot-sep">·</span>
            <button className="legal-link-btn" onClick={() => setLegalTab("privacy")}>
              {t.footer.privacy}
            </button>
          </div>
          <div className="footer-meta">
            <span>© {new Date().getFullYear()} Luro · {t.footer.rights}</span>
            <a href="/#top">{t.footer.top}</a>
          </div>
        </div>
        <GiantText />
      </footer>

      <LegalModal
        isOpen={Boolean(legalTab)}
        initialTab={legalTab || "notices"}
        onClose={() => setLegalTab(null)}
      />
    </>
  );
}

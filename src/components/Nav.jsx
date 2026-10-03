import { useEffect, useState } from "react";
import { CONFIG } from "../config.js";
import { useLang } from "../i18n.jsx";

const IDS = ["services", "portfolio", "about", "reviews", "faq"];

export default function Nav() {
  const { t, lang, setLang } = useLang();
  const [active, setActive] = useState("");
  const [docked, setDocked] = useState(true);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY < 24);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = IDS.map((id) => document.getElementById(id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (e.isIntersecting) setActive(id);
          else setActive((a) => (a === id ? "" : a));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className={`nav ${docked ? "docked" : "floating"}`}>
      <a className="nav-pill logo" href="/#top" aria-label={t.nav.home}>
        <img className="logo-mark" src="/logo.jpg" alt="Luro" width="34" height="34" />
        Luro
      </a>

      <nav className="nav-pill links" aria-label={t.nav.main}>
        {IDS.map((id) => (
          <a key={id} href={`/#${id}`} className={active === id ? "on" : ""}>
            {t.nav[id]}
          </a>
        ))}
      </nav>

      <div className="nav-pill icons">
        <button
          className="lang-btn"
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          aria-label={t.nav.lang}
          title={t.nav.lang}
        >
          <span className={lang === "en" ? "on" : ""}>EN</span>
          <span className={lang === "fr" ? "on" : ""}>FR</span>
        </button>
        <a className="icon-btn" href={CONFIG.discord} target="_blank" rel="noopener noreferrer" aria-label="Discord">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 5.3A16.5 16.5 0 0 0 15.5 4l-.2.4a15 15 0 0 1 3.7 1.9 13.6 13.6 0 0 0-12-.1A15 15 0 0 1 10.7 4.4L10.5 4a16.5 16.5 0 0 0-4.1 1.3C3.8 9.2 3.1 13 3.4 16.7a16.6 16.6 0 0 0 5 2.5l1.1-1.8a10.8 10.8 0 0 1-1.7-.8l.4-.3a11.8 11.8 0 0 0 10.1 0l.4.3a10.8 10.8 0 0 1-1.7.8l1.1 1.8a16.5 16.5 0 0 0 5-2.5c.4-4.3-.7-8-2.5-11.4ZM9.3 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Zm5.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2Z" /></svg>
        </a>
        <a className="icon-btn" href={`mailto:${CONFIG.email}`} aria-label="Email">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 8 8 6 8-6" /></svg>
        </a>
      </div>
    </header>
  );
}

import { useEffect } from "react";
import Lenis from "lenis";
import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import Statement from "./components/Statement.jsx";
import Services from "./components/Services.jsx";
import Work from "./components/Work.jsx";
import Process from "./components/Process.jsx";
import Faq from "./components/Faq.jsx";
import Cta from "./components/Cta.jsx";
import Footer from "./components/Footer.jsx";
import { CONFIG } from "./config.js";
import { useLang } from "./i18n.jsx";

export default function App() {
  const { t } = useLang();

  // Lenis smooth scrolling (skipped when the user prefers reduced motion)
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.09, anchors: { offset: -96 } });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Statement />
        <Services />
        <Work />
        <Process />
        <Faq />
        <Cta />
      </main>
      <Footer />
      <a className="float-cta" href={CONFIG.discord} target="_blank" rel="noopener noreferrer">
        {t.float}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M8 7h9v9" /></svg>
      </a>
    </>
  );
}

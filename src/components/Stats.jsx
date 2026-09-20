import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";

const DURATION = 1600;

// counts from 0 to `to` once the card scrolls into view
function CountUp({ to, lang }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const decimals = Number.isInteger(to) ? 0 : 1;

  useEffect(() => {
    const el = ref.current;
    let raf = 0;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        if (reduce) return setN(to);
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / DURATION, 1);
          setN(to * (1 - Math.pow(1 - p, 4)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {n.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
    </span>
  );
}

export default function Stats() {
  const { t, lang } = useLang();

  return (
    <div className="stats">
      {t.services.stats.map((s, i) => (
        <Reveal key={i} className="stat" delay={i * 90}>
          <strong className="stat-num">
            <CountUp to={s.v} lang={lang} />
          </strong>
          <p className="stat-label">{s.label}</p>
          <small>{s.note}</small>
        </Reveal>
      ))}
    </div>
  );
}

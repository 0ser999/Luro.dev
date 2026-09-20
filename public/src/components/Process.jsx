import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";

export default function Process() {
  const { t } = useLang();
  const p = t.process;

  return (
    <section className="section" id="process">
      <Reveal className="head">
        <span className="eyebrow">{p.eyebrow}</span>
        <h2>{p.title}</h2>
        <p>{p.sub}</p>
      </Reveal>
      <div className="steps">
        {p.steps.map(([title, text], i) => (
          <Reveal key={i} className="step" delay={i * 90}>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

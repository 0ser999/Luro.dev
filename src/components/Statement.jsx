import Reveal from "./Reveal.jsx";
import { useLang } from "../i18n.jsx";

export default function Statement() {
  const { t } = useLang();
  const s = t.statement;

  return (
    <section className="statement">
      <Reveal as="h2" className="big">
        {s.p1}
        <span className="ipill p1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>
        </span>
        {s.p2}
        <span className="ipill p2">🎨</span>
        {s.p3}
      </Reveal>
      <Reveal as="p" className="sub" delay={80}>
        {s.sub}
      </Reveal>
      <Reveal className="chips" delay={140}>
        {s.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </Reveal>
    </section>
  );
}

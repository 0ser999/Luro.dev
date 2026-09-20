import { useLang } from "../i18n.jsx";

const Star = () => (
  <svg className="star" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1.5c.6 5.700 4.800 9.900 10.500 10.500-5.700.6-9.900 4.800-10.500 10.500C11.400 16.800 7.200 12.600 1.500 12 7.200 11.400 11.400 7.200 12 1.500Z" />
  </svg>
);

export default function Marquee() {
  const { t } = useLang();
  const group = (key, hidden) => (
    <div className="marquee-group" key={key} aria-hidden={hidden || undefined}>
      {t.marquee.map((word) => (
        <span key={word}>
          <b>{word}</b>
          <Star />
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track">
        {group("a", false)}
        {group("b", true)}
      </div>
    </div>
  );
}

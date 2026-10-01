import { ORDER_SERVICES, formatPrice } from "../order-config.js";
import { useLang } from "../i18n.jsx";

export default function ServicePicker({ value, onChange, hideCategories = false }) {
  const { lang, t } = useLang();
  const group = ORDER_SERVICES[value].group;
  return (
    <fieldset className="service-picker">
      <legend>{t.order.service} *</legend>
      {!hideCategories && <div className="service-categories" aria-label={t.order.category}>
        {["pc", "design", "website"].map((id) => <button type="button" key={id} aria-pressed={group === id}
          onClick={() => onChange({ pc: "pc", design: "poster", website: "landing" }[id])}>
          {t.order.categories[id]}
        </button>)}
      </div>}
      <div className="service-options">
        {Object.entries(ORDER_SERVICES).filter(([, service]) => service.group === group).map(([id, service]) => (
          <label className={`service-option ${id === "pc" || group === "website" ? "service-featured" : ""}`} key={id}>
            <input type="radio" name="service" value={id} checked={value === id} onChange={() => onChange(id)} />
            <span className="service-option-top">
              <span className="service-radio" aria-hidden="true" />
              <strong>{service[lang]}</strong>
              <b>{formatPrice(service.amount, lang)}</b>
            </span>
            {id === "pc" && <span className="service-badge">{t.order.fullPackage}</span>}
            <span className="service-description">{service.description[lang]}</span>
          </label>
        ))}
      </div>
      {group === "website" && <p className="service-description website-scope">{lang === "fr" ? "Textes et images fournis par toi. Livraison du code source et aide à la mise en ligne. Domaine, hébergement, maintenance, boutique, espace membre et développement sur mesure non inclus. Indique tes besoins et ta date souhaitée dans le brief ; le planning sera confirmé après échange." : "You provide text and images. Source code and launch assistance included. Domain, hosting, maintenance, store, member area and custom functionality excluded. Share your needs and preferred date in the brief; the schedule will be confirmed after discussion."}</p>}
    </fieldset>
  );
}

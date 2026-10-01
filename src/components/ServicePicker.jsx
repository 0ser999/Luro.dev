import { ORDER_SERVICES, formatPrice } from "../order-config.js";
import { useLang } from "../i18n.jsx";

export default function ServicePicker({ value, onChange, hideCategories = false }) {
  const { lang, t } = useLang();
  const group = ORDER_SERVICES[value].group;
  return (
    <fieldset className="service-picker">
      <legend>{t.order.service} *</legend>
      {!hideCategories && <div className="service-categories" aria-label={t.order.category}>
        {["pc", "design"].map((id) => <button type="button" key={id} aria-pressed={group === id}
          onClick={() => onChange(id === "pc" ? "pc" : "poster")}>
          {t.order.categories[id]}
        </button>)}
      </div>}
      <div className="service-options">
        {Object.entries(ORDER_SERVICES).filter(([, service]) => service.group === group).map(([id, service]) => (
          <label className={`service-option ${id === "pc" ? "service-featured" : ""}`} key={id}>
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
    </fieldset>
  );
}

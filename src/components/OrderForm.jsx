import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n.jsx";
import { ORDER_LIMITS, ORDER_SERVICES } from "../order-config.js";

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;
let turnstileScript;

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const fail = () => {
        clearTimeout(timer);
        script.remove();
        turnstileScript = undefined;
        reject(new Error("captcha-unavailable"));
      };
      const timer = setTimeout(fail, 15000);
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        clearTimeout(timer);
        if (window.turnstile) resolve(window.turnstile);
        else fail();
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });
  }
  return turnstileScript;
}

export default function OrderForm() {
  const { t, lang } = useLang();
  const copy = t.order;
  const container = useRef(null);
  const widget = useRef(null);
  const sending = useRef(false);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  const [compactCaptcha, setCompactCaptcha] = useState(() => matchMedia("(max-width: 440px)").matches);

  useEffect(() => {
    const media = matchMedia("(max-width: 440px)");
    const update = () => setCompactCaptcha(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let widgetId;
    setToken("");
    setCaptchaError(false);
    if (!SITE_KEY) return;
    loadTurnstile().then((api) => {
      if (cancelled) return;
      widgetId = api.render(container.current, {
        sitekey: SITE_KEY,
        theme: "light",
        size: compactCaptcha ? "compact" : "flexible",
        language: lang,
        callback: (value) => { if (!cancelled) { setToken(value); setCaptchaError(false); } },
        "expired-callback": () => { if (!cancelled) setToken(""); },
        "error-callback": () => {
          if (!cancelled) { setToken(""); setCaptchaError(true); }
        },
      });
      widget.current = widgetId;
    }).catch(() => { if (!cancelled) setCaptchaError(true); });
    return () => {
      cancelled = true;
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
      widget.current = null;
    };
  }, [lang, captchaAttempt, compactCaptcha]);

  async function submit(event) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (!data.name.trim() || !data.contact.trim() || data.message.trim().length < 20) {
      setFeedback("INVALID_FIELDS");
      return;
    }
    if (!token) { setFeedback("CAPTCHA_FAILED"); return; }
    sending.current = true;
    setLoading(true);
    setFeedback(null);
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, "cf-turnstile-response": token }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setFeedback(Object.hasOwn(copy.errors, result.code) ? result.code : "UNAVAILABLE");
      } else {
        form.reset();
        setFeedback("success");
      }
    } catch {
      setFeedback("UNAVAILABLE");
    } finally {
      setToken("");
      setLoading(false);
      sending.current = false;
      if (widget.current !== null) window.turnstile?.reset(widget.current);
    }
  }

  return (
    <form className="order-form" onSubmit={submit} aria-labelledby="order-title" aria-busy={loading}>
      <h3 id="order-title">{copy.title}</h3>
      <p className="order-intro">{copy.intro}</p>
      <fieldset className="order-fields" disabled={loading}>
        <div className="order-field">
          <label htmlFor="order-name">{copy.name} *</label>
          <input id="order-name" name="name" autoComplete="name" required maxLength={ORDER_LIMITS.name} />
        </div>
        <div className="order-field">
          <label htmlFor="order-contact">{copy.contact} *</label>
          <input id="order-contact" name="contact" type="text" required maxLength={ORDER_LIMITS.contact} placeholder={copy.contactHint} />
        </div>
        <div className="order-field">
          <label htmlFor="order-service">{copy.service} *</label>
          <select id="order-service" name="service" required defaultValue="">
            <option value="" disabled>{copy.choose}</option>
            {Object.entries(ORDER_SERVICES).map(([value, labels]) => <option key={value} value={value}>{labels[lang]}</option>)}
          </select>
        </div>
        <div className="order-field">
          <label htmlFor="order-budget">{copy.budget}</label>
          <input id="order-budget" name="budget" maxLength={ORDER_LIMITS.budget} placeholder={copy.budgetHint} />
        </div>
        <div className="order-field order-wide">
          <label htmlFor="order-message">{copy.message} *</label>
          <textarea id="order-message" name="message" rows={5} required minLength={20} maxLength={ORDER_LIMITS.message} aria-describedby="order-message-hint" placeholder={copy.messagePlaceholder} />
          <small id="order-message-hint">{copy.messageHint}</small>
        </div>
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="order-website">Website</label>
          <input id="order-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>
      <div className="order-captcha" ref={container} />
      {(!SITE_KEY || captchaError) && <p className="order-notice order-error" role="alert">
        {copy.captchaUnavailable}
        {SITE_KEY && <button type="button" className="order-retry" disabled={loading} onClick={() => setCaptchaAttempt((attempt) => attempt + 1)}>{copy.retry}</button>}
      </p>}
      <button className="btn btn-dark order-submit" type="submit" disabled={loading || !token || !SITE_KEY}>
        {loading ? copy.sending : copy.send}
      </button>
      <div aria-live="polite" aria-atomic="true">
        {feedback && <p className={`order-notice ${feedback === "success" ? "order-success" : "order-error"}`}>
          {feedback === "success" ? copy.success : copy.errors[feedback]}
        </p>}
      </div>
    </form>
  );
}

import { useEffect, useRef, useState } from "react";
import { useLang } from "../i18n.jsx";
import { ORDER_LIMITS, ORDER_SERVICES, formatPrice } from "../order-config.js";
import ServicePicker from "./ServicePicker.jsx";
import PaymentReturn from "./PaymentReturn.jsx";

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

function readDraft() {
  try {
    const draft = JSON.parse(sessionStorage.getItem("luro-order-draft"));
    if (draft?.savedAt > Date.now() - 3600000 && Object.hasOwn(ORDER_SERVICES, draft.service)) return draft;
  } catch { /* storage unavailable */ }
  return { service: "pc" };
}

function CheckoutForm({ cancelled, category }) {
  const { t, lang } = useLang();
  const copy = t.order;
  const [draft] = useState(readDraft);
  const [service, setService] = useState(draft.service);
  useEffect(() => {
    if (category === "pc" || category === "design") {
      setService((current) => ORDER_SERVICES[current].group === category ? current : category === "pc" ? "pc" : "poster");
    }
  }, [category]);
  const selected = ORDER_SERVICES[service];
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
    if (!data.name.trim() || !data.email.trim() || data.message.trim().length < 20) {
      setFeedback("INVALID_FIELDS");
      return;
    }
    if (!token) { setFeedback("CAPTCHA_FAILED"); return; }
    sending.current = true;
    setLoading(true);
    setFeedback(null);
    try {
      try {
        sessionStorage.setItem("luro-order-draft", JSON.stringify({ name: data.name, email: data.email,
          discord: data.discord, service, message: data.message, savedAt: Date.now() }));
      } catch { /* storage unavailable; payment can still proceed */ }
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, service, lang, "cf-turnstile-response": token }),
        signal: AbortSignal.timeout(30000),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        setFeedback(Object.hasOwn(copy.errors, result.code) ? result.code : "UNAVAILABLE");
      } else {
        const checkout = new URL(result.checkoutUrl);
        if (checkout.protocol !== "https:" || checkout.hostname !== "checkout.stripe.com") throw new Error("checkout-url");
        window.location.assign(checkout.href);
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
      <ol className="order-steps"><li className="current">{copy.steps[0]}</li><li>{copy.steps[1]}</li><li>{copy.steps[2]}</li></ol>
      {cancelled && <p className="order-notice order-neutral">{copy.cancelled}</p>}
      <fieldset className="order-fields" disabled={loading}>
        <div className="order-wide"><ServicePicker value={service} onChange={setService} hideCategories={Boolean(category)} /></div>
        <div className="order-field">
          <label htmlFor="order-name">{copy.name} *</label>
          <input id="order-name" name="name" autoComplete="name" required maxLength={ORDER_LIMITS.name} defaultValue={draft.name ?? ""} />
        </div>
        <div className="order-field">
          <label htmlFor="order-email">{copy.email} *</label>
          <input id="order-email" name="email" type="email" autoComplete="email" required maxLength={ORDER_LIMITS.email} placeholder={copy.emailHint} defaultValue={draft.email ?? ""} />
        </div>
        <div className="order-field">
          <label htmlFor="order-discord">{copy.discord}</label>
          <input id="order-discord" name="discord" maxLength={ORDER_LIMITS.discord} placeholder="@pseudo" defaultValue={draft.discord ?? ""} />
        </div>
        <div className="order-field order-wide">
          <label htmlFor="order-message">{copy.message} *</label>
          <textarea id="order-message" name="message" rows={5} required minLength={20} maxLength={ORDER_LIMITS.message} aria-describedby="order-message-hint" placeholder={copy.messagePlaceholder} defaultValue={draft.message ?? ""} />
          <small id="order-message-hint">{copy.messageHint}</small>
        </div>
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="order-website">Website</label>
          <input id="order-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
      </fieldset>
      <div className="order-summary" aria-live="polite">
        <div><span>{copy.total}</span><strong>{selected[lang]}</strong></div>
        <b>{formatPrice(selected.amount, lang)}<small>USD</small></b>
      </div>
      <p className="order-payment-note">{copy.paymentNote}</p>
      <div className="order-captcha" ref={container} />
      {(!SITE_KEY || captchaError) && <p className="order-notice order-error" role="alert">
        {copy.captchaUnavailable}
        {SITE_KEY && <button type="button" className="order-retry" disabled={loading} onClick={() => setCaptchaAttempt((attempt) => attempt + 1)}>{copy.retry}</button>}
      </p>}
      <button className="btn btn-dark order-submit" type="submit" disabled={loading || !token || !SITE_KEY}>
        {loading ? copy.sending : `${copy.send} · ${formatPrice(selected.amount, lang)}`}
      </button>
      <div aria-live="polite" aria-atomic="true">
        {feedback && <p className={`order-notice ${feedback === "success" ? "order-success" : "order-error"}`}>
          {feedback === "success" ? copy.success : copy.errors[feedback]}
        </p>}
      </div>
    </form>
  );
}

export default function OrderForm({ category }) {
  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("payment")) return;
    const frame = requestAnimationFrame(() => document.getElementById("contact")?.scrollIntoView({ behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, []);
  if (params.get("payment") === "success") return <PaymentReturn sessionId={params.get("session_id") ?? ""} />;
  return <CheckoutForm cancelled={params.get("payment") === "cancelled"} category={category} />;
}

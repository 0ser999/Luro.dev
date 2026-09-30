import { useEffect, useState } from "react";
import { useLang } from "../i18n.jsx";

export default function PaymentReturn({ sessionId }) {
  const { t } = useLang();
  const [status, setStatus] = useState("checking");
  const [attempt, setAttempt] = useState(0);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    let cancelled = false;
    let timer;
    const controller = new AbortController();
    let count = 0;
    setChecking(true);
    async function check() {
      try {
        const response = await fetch(`/api/order-status?session_id=${encodeURIComponent(sessionId)}`, {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]),
        });
        const result = await response.json();
        if (!response.ok || !["pending", "paid", "sent"].includes(result.status)) throw new Error("status");
        if (cancelled) return;
        setStatus(result.status);
        if (["paid", "sent"].includes(result.status)) {
          try { sessionStorage.removeItem("luro-order-draft"); } catch { /* storage unavailable */ }
        }
        if (result.status !== "sent" && ++count < 10) timer = setTimeout(check, 3000);
        else setChecking(false);
      } catch {
        if (!cancelled) { setStatus((current) => current === "paid" ? "paid" : "unavailable"); setChecking(false); }
      }
    }
    check();
    return () => { cancelled = true; clearTimeout(timer); controller.abort(); };
  }, [sessionId, attempt]);

  return <div className="order-form payment-return" aria-live="polite">
    <span className="payment-symbol" aria-hidden="true">{status === "sent" ? "✓" : "↗"}</span>
    <h3>{t.order.paymentTitles[status]}</h3>
    <p className="order-intro">{t.order.paymentMessages[status]}</p>
    {status !== "sent" && <button type="button" className="btn btn-dark" disabled={checking} onClick={() => setAttempt(attempt + 1)}>
      {checking ? t.order.checking : t.order.checkAgain}
    </button>}
    {status === "sent" && <a className="btn btn-dark" href="/reservation.html">{t.order.newOrder}</a>}
  </div>;
}

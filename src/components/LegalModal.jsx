import { useState } from "react";
import { useLang } from "../i18n.jsx";

export default function LegalModal({ isOpen, onClose, initialTab = "notices" }) {
  const { t } = useLang();
  const [tab, setTab] = useState(initialTab);
  const l = t.legal;

  if (!isOpen) return null;

  return (
    <div className="legal-overlay" data-lenis-prevent onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="legal-title">
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-header">
          <h3 id="legal-title">{l.title}</h3>
          <button className="legal-close-btn" onClick={onClose} aria-label={l.close}>
            ×
          </button>
        </div>

        <div className="legal-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "notices"}
            className={tab === "notices" ? "active" : ""}
            onClick={() => setTab("notices")}
          >
            {l.tabs.notices}
          </button>
          <button
            role="tab"
            aria-selected={tab === "tos"}
            className={tab === "tos" ? "active" : ""}
            onClick={() => setTab("tos")}
          >
            {l.tabs.tos}
          </button>
          <button
            role="tab"
            aria-selected={tab === "privacy"}
            className={tab === "privacy" ? "active" : ""}
            onClick={() => setTab("privacy")}
          >
            {l.tabs.privacy}
          </button>
        </div>

        <div className="legal-body">
          {tab === "notices" && (
            <div className="legal-content">
              {l.noticesText.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          {tab === "tos" && (
            <div className="legal-content">
              {l.tosText.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          {tab === "privacy" && (
            <div className="legal-content">
              {l.privacyText.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
        </div>

        <div className="legal-footer">
          <button className="btn btn-dark" onClick={onClose}>
            {l.close}
          </button>
        </div>
      </div>
    </div>
  );
}

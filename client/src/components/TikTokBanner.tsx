import { useState } from "react";
import { SiTiktok } from "react-icons/si";
import { X, ArrowRight } from "lucide-react";

export default function TikTokBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "linear-gradient(90deg, #0D2137 0%, #1a3352 50%, #0D2137 100%)",
        borderBottom: "1px solid rgba(212,164,62,0.3)",
        padding: "10px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Shimmer line at top */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 2,
        background: "linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-lt) 50%, var(--gold) 70%, transparent)",
        opacity: 0.7,
      }} />

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flex: 1,
        justifyContent: "center",
        flexWrap: "wrap",
      }}>
        {/* TikTok icon + label */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <SiTiktok size={15} style={{ color: "#fff", opacity: 0.9 }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}>
            Saw us on TikTok?
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.15)" }} />

        {/* Message */}
        <span style={{
          fontSize: "0.85rem",
          color: "#fff",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}>
          The AI that tears apart VA denial letters is right here.
        </span>

        {/* CTA button */}
        <a
          href="/api/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "var(--gold)",
            color: "var(--navy)",
            padding: "7px 16px",
            borderRadius: 3,
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "nowrap",
            boxShadow: "0 2px 12px rgba(212,164,62,0.3)",
            transition: "filter 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          Try it free
          <ArrowRight size={12} />
        </a>

        {/* View count social proof */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: "4px 10px",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px rgba(74,222,128,0.7)",
            animation: "pulse 2s infinite",
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
          }}>
            3K+ watched this week
          </span>
        </div>
      </div>

      {/* Dismiss button */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "rgba(255,255,255,0.3)",
          padding: 4,
          display: "flex",
          alignItems: "center",
          transition: "color 0.15s",
          flexShrink: 0,
          marginLeft: 8,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        aria-label="Dismiss banner"
      >
        <X size={15} />
      </button>
    </div>
  );
}

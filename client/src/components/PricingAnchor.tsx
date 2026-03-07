import { useEffect, useRef, useState } from "react";

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(ease * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return val;
}

export default function PricingAnchor() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const attorney = useCountUp(15000, inView, 1400);
  const retroCut = useCountUp(5000, inView, 1600);
  const nexusYear = useCountUp(49 * 12, inView, 1000);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: 960,
        margin: "0 auto 3.5rem",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {/* Comparison bars */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        borderRadius: 10,
        overflow: "hidden",
        border: "1px solid rgba(11,28,46,0.1)",
      }}
      className="pricing-anchor-grid"
      >
        {[
          {
            label: "Typical Attorney Retainer",
            val: `$${attorney.toLocaleString()}+`,
            sub: "Upfront, before they file a single page",
            accentTop: "#ef4444",
            bg: "rgba(239,68,68,0.04)",
            valColor: "#c0392b",
          },
          {
            label: "20% Cut of Your Retro Pay",
            val: `$${retroCut.toLocaleString()}+`,
            sub: "Gone — on just $25k in retro pay",
            accentTop: "#f97316",
            bg: "rgba(249,115,22,0.04)",
            valColor: "#d35400",
          },
          {
            label: "Nexus247 Pro — Full Year",
            val: `$${nexusYear}`,
            sub: "You keep every dollar of retro pay",
            accentTop: "var(--gold)",
            bg: "rgba(212,164,62,0.05)",
            valColor: "var(--gold)",
          },
        ].map(({ label, val, sub, accentTop, bg, valColor }, i) => (
          <div
            key={label}
            style={{
              background: bg,
              borderTop: `3px solid ${accentTop}`,
              padding: "24px 26px",
              borderRight: i < 2 ? "1px solid rgba(11,28,46,0.08)" : "none",
            }}
          >
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.62rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(11,28,46,0.4)",
              marginBottom: 10,
            }}>
              {label}
            </div>
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.6rem, 2.2vw, 2.1rem)",
              color: valColor,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginBottom: 8,
            }}>
              {val}
            </div>
            <div style={{
              fontSize: "0.75rem",
              color: "rgba(11,28,46,0.45)",
              lineHeight: 1.5,
            }}>
              {sub}
            </div>
          </div>
        ))}
      </div>

      {/* Proof strip */}
      <div style={{
        marginTop: 12,
        padding: "14px 20px",
        background: "rgba(212,164,62,0.06)",
        border: "1px solid rgba(212,164,62,0.2)",
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        gap: 28,
        flexWrap: "wrap",
      }}>
        {[
          { val: "10% → 80%", label: "Founder's rating" },
          { val: "$25,000+", label: "Retro pay received" },
          { val: "4 months", label: "Start to win" },
          { val: "No attorney", label: "Zero legal fees" },
        ].map(({ val, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1rem",
              color: "var(--gold)",
              fontWeight: 700,
            }}>{val}</span>
            <span style={{
              fontSize: "0.72rem",
              color: "rgba(11,28,46,0.45)",
            }}>{label}</span>
          </div>
        ))}
        <span style={{
          marginLeft: "auto",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "0.62rem",
          color: "rgba(11,28,46,0.3)",
          letterSpacing: "0.04em",
        }}>
          Founder's actual VA records
        </span>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .pricing-anchor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
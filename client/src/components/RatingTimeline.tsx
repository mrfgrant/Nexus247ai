import { useEffect, useRef, useState } from "react";

const PAYMENTS = [
  { date: "Dec 2020", amount: 144,    reason: "Original Award",                  rating: 10,  highlight: false },
  { date: "Dec 2021", amount: 152,    reason: "Cost of Living Adjustment",        rating: 10,  highlight: false },
  { date: "Dec 2022", amount: 165,    reason: "Cost of Living Adjustment",        rating: 10,  highlight: false },
  { date: "Dec 2023", amount: 171,    reason: "Cost of Living Adjustment",        rating: 10,  highlight: false },
  { date: "Dec 2024", amount: 175,    reason: "Cost of Living Adjustment",        rating: 10,  highlight: false },
  { date: "Jan 2025", amount: 1759,   reason: "Rating Adjustment — Nexus247",    rating: 70,  highlight: true  },
  { date: "Nov 2025", amount: 2044,   reason: "Rating Adjustment",               rating: 80,  highlight: true  },
  { date: "Dec 2025", amount: 2102,   reason: "Cost of Living Adjustment",       rating: 80,  highlight: false },
];

const CONDITIONS = [
  { pct: 70, label: "Major Depressive Disorder", effective: "Dec 17, 2024", color: "#D4A43E" },
  { pct: 30, label: "Chronic Kidney Disease (Stage 3)", sub: "Secondary to hypertension → secondary to MDD", effective: "Oct 16, 2025", color: "#60a5fa" },
  { pct: 10, label: "Tinnitus", effective: "Nov 3, 2020", color: "rgba(255,255,255,0.4)" },
];

const MAX = 2102;

function AnimatedBar({ amount, active, highlight }: { amount: number; active: boolean; highlight: boolean }) {
  const [width, setWidth] = useState(0);
  const pct = Math.max((amount / MAX) * 100, 2);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [active, pct]);
  return (
    <div style={{ height: 28, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
      <div style={{
        height: "100%", width: `${width}%`,
        background: highlight
          ? "linear-gradient(90deg, #D4A43E, #e8bc58)"
          : "rgba(255,255,255,0.12)",
        borderRadius: 4,
        transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: highlight ? "0 0 16px rgba(212,164,62,0.4)" : "none",
      }} />
      <div style={{
        position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
        color: highlight ? "#D4A43E" : "rgba(255,255,255,0.35)",
        fontWeight: highlight ? 700 : 400,
      }}>
        ${amount.toLocaleString()}/mo
      </div>
    </div>
  );
}

function AnimatedCount({ target, active, prefix = "", suffix = "" }: { target: number; active: boolean; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = Math.ceil(target / 60);
    const tick = setInterval(() => {
      current = Math.min(current + step, target);
      setVal(current);
      if (current >= target) clearInterval(tick);
    }, 25);
    return () => clearInterval(tick);
  }, [active, target]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

export default function RatingTimeline() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "100px 5vw", backgroundColor: "#080f1a", position: "relative", overflow: "hidden" }}>

      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.4,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,164,62,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(96,165,250,0.05) 0%, transparent 40%)`,
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A43E", border: "1px solid rgba(212,164,62,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem" }}>
            Real Results · Real Veteran · Real Dates
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 1rem 0" }}>
            This is what winning<br />
            <em style={{ color: "#D4A43E", fontStyle: "italic" }}>actually looks like.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", maxWidth: 560, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            Four years of COLA adjustments. $144 to $175. Then Nexus247 — and everything changed.
            These are our founder's actual VA payment records.
          </p>
        </div>

        {/* Hero retro stat */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: "3rem" }} className="retro-stats">
          {[
            { val: 25000, prefix: "$", suffix: "+", label: "Retroactive back pay received", color: "#4ade80", sub: "Paid out in lump sum" },
            { val: 2102,  prefix: "$", suffix: "/mo", label: "Current monthly entitlement", color: "#D4A43E", sub: "Up from $175/mo" },
            { val: 80,    prefix: "",  suffix: "%", label: "Combined disability rating", color: "#60a5fa", sub: "Up from 10% at original award" },
          ].map(({ val, prefix, suffix, label, color, sub }) => (
            <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "28px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3vw, 2.6rem)", color, lineHeight: 1, marginBottom: 8, letterSpacing: "-0.02em" }}>
                <AnimatedCount target={val} active={active} prefix={prefix} suffix={suffix} />
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Main layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "3rem", alignItems: "start" }} className="timeline-layout">

          {/* Payment timeline */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.2rem" }}>
              Monthly Entitlement — VA Payment History
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {PAYMENTS.map((p, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "90px 1fr", gap: 12, alignItems: "center", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-12px)", transition: `opacity 0.5s ${i * 0.07}s ease, transform 0.5s ${i * 0.07}s ease` }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: p.highlight ? "#D4A43E" : "rgba(255,255,255,0.3)", fontWeight: p.highlight ? 700 : 400 }}>{p.date}</div>
                  </div>
                  <div>
                    <AnimatedBar amount={p.amount} active={active} highlight={p.highlight} />
                    {p.highlight && (
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(212,164,62,0.6)", letterSpacing: "0.08em", marginTop: 3 }}>
                        ↑ {p.reason}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* The gap callout */}
            <div style={{ marginTop: "2rem", padding: "16px 20px", backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 8, display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ fontSize: "1.2rem", flexShrink: 0 }}>⏳</div>
              <div>
                <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: 4 }}>4 years. $144 to $175. The system doing the bare minimum.</div>
                <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.35)", lineHeight: 1.6, fontWeight: 300 }}>
                  From Dec 2020 to Dec 2024, every adjustment was a COLA — cost of living, not a rating change.
                  The VA doesn't come looking for you. You have to build the case yourself.
                </div>
              </div>
            </div>
          </div>

          {/* Conditions panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.2rem" }}>
              Service-Connected Conditions
            </div>

            {CONDITIONS.map(({ pct, label, sub, effective, color }) => (
              <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: "18px 18px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 3, background: color, opacity: 0.7, borderRadius: "8px 0 0 8px" }} />
                <div style={{ paddingLeft: 8 }}>
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.8rem", color, lineHeight: 1, marginBottom: 6, letterSpacing: "-0.02em" }}>{pct}%</div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff", marginBottom: sub ? 4 : 6, lineHeight: 1.4 }}>{label}</div>
                  {sub && <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", marginBottom: 8, lineHeight: 1.5, fontStyle: "italic" }}>{sub}</div>}
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>Effective {effective}</div>
                </div>
              </div>
            ))}

            {/* Secondary chain callout */}
            <div style={{ backgroundColor: "rgba(212,164,62,0.06)", border: "1px solid rgba(212,164,62,0.2)", borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(212,164,62,0.6)", marginBottom: 8 }}>
                Secondary Connection Chain
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["MDD (service-connected)", "→ Hypertension (secondary)", "→ Kidney Disease (secondary)"].map((step, i) => (
                  <div key={i} style={{ fontSize: "0.78rem", color: i === 0 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)", fontWeight: i === 0 ? 500 : 300, fontFamily: i === 0 ? "inherit" : "'JetBrains Mono', monospace", fontSize: i === 0 ? "0.82rem" : "0.72rem" }}>
                    {step}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, fontWeight: 300 }}>
                This is the kind of complex secondary chain most veterans never know to argue. Nexus247 surfaces it automatically.
              </div>
            </div>

            {/* CTA */}
            <a href="/api/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#D4A43E", color: "#080f1a", padding: "14px 20px", borderRadius: 6, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", textAlign: "center", boxShadow: "0 4px 24px rgba(212,164,62,0.3)" }}>
              See what's in your records →
            </a>
          </div>
        </div>

        {/* Bottom disclaimer */}
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.62rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em", lineHeight: 1.7 }}>
          These are real VA payment records and ratings belonging to a Nexus247 founder. Individual results vary. Nexus247 is a drafting tool, not a law firm, and is not affiliated with the Department of Veterans Affairs.
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .timeline-layout { grid-template-columns: 1fr !important; }
          .retro-stats { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 500px) {
          .retro-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

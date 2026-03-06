import { useEffect, useRef, useState } from "react";

const PAYMENTS = [
  { date: "Dec 2020", amount: 144,  highlight: false },
  { date: "Dec 2021", amount: 152,  highlight: false },
  { date: "Dec 2022", amount: 165,  highlight: false },
  { date: "Dec 2023", amount: 171,  highlight: false },
  { date: "Dec 2024", amount: 175,  highlight: false },
  { date: "Jan 2025", amount: 1759, highlight: true  },
  { date: "Nov 2025", amount: 2044, highlight: true  },
  { date: "Dec 2025", amount: 2102, highlight: true  },
];

const MAX = 2102;

const TIMELINE = [
  {
    date: "Jul 2020",
    title: "Retained Attorney",
    detail: "Attorney retained before the original award. Filed claims for multiple conditions with zero supporting evidence — the cause of 99% of VA denials. Of everything filed, only Tinnitus won.",
    type: "bad",
    rating: null,
  },
  {
    date: "Nov 3, 2020",
    title: "Tinnitus — Original Award",
    detail: "10% service-connected. Direct/Primary connection. First payment $144/mo.",
    type: "win",
    rating: "10%",
  },
  {
    date: "2021",
    title: "Appeal Filed — Then Ghosted",
    detail: "Knowing a VA appeal takes years to resolve, the attorney filed it strategically — the longer it drags, the more retro pay accumulates, and the larger his percentage fee at the end. Then he stopped communicating. Evidence deadlines were missed. No updates. No responses. Years of silence.",
    type: "bad",
    rating: null,
  },
  {
    date: "Dec 2021 – Dec 2024",
    title: "4 Years. Nothing.",
    detail: "$144 → $175. Four cost-of-living adjustments. Zero rating changes. An appeal sitting in limbo. The VA doesn't come looking for you — and neither did the attorney.",
    type: "stall",
    rating: null,
  },
  {
    date: "Sep 22, 2025",
    title: "Good Cause Filed",
    detail: "Evidence submitted past deadline under Good Cause exception — recovering from the attorney's missed filing window. The fight resumes.",
    type: "nexus",
    rating: null,
  },
  {
    date: "Oct 15, 2025",
    title: "MDD Granted — Secondary to Tinnitus",
    detail: "Major Depressive Disorder service-connected as secondary to Tinnitus. Initial decision: 50% effective December 17, 2024.",
    type: "win",
    rating: "50%",
  },
  {
    date: "Oct 17, 2025",
    title: "AOD Requested",
    detail: "Advancement on the Docket requested to expedite the hearing schedule.",
    type: "nexus",
    rating: null,
  },
  {
    date: "Oct 31, 2025",
    title: "MDD HLR — Increased to 70%",
    detail: "Higher-Level Review wins. MDD increased to 70% — same effective date of December 17, 2024. Retroactive pay triggered.",
    type: "win",
    rating: "70%",
  },
  {
    date: "Nov 18, 2025",
    title: "TDIU — Denied",
    detail: "Total Disability based on Individual Unemployability initially denied. Not the end.",
    type: "bad",
    rating: null,
  },
  {
    date: "Dec 11, 2025",
    title: "CKD Granted — Secondary Chain",
    detail: "Chronic Kidney Disease (Stage 3) service-connected as secondary to hypertension, secondary to MDD. Initial decision: 0% effective October 16, 2025.",
    type: "win",
    rating: "0%",
  },
  {
    date: "Dec 22, 2025",
    title: "AOD Granted",
    detail: "Advancement on the Docket granted. Hearing date secured.",
    type: "win",
    rating: null,
  },
  {
    date: "Feb 13, 2026",
    title: "CKD HLR — Increased to 30%",
    detail: "Higher-Level Review wins. CKD increased to 30% — effective October 16, 2025. Additional retroactive pay issued.",
    type: "win",
    rating: "30%",
  },
  {
    date: "Feb 25, 2026",
    title: "TDIU HLR Won — Duty to Assist Error",
    detail: "VA found to have committed a duty to assist error in the prior TDIU denial. Converted to Supplemental Claim for correction.",
    type: "win",
    rating: null,
  },
  {
    date: "Mar 11, 2026",
    title: "Board Hearing + TDIU C&P Exam",
    detail: "11:00 AM — Board Denied Conditions Hearing (virtual). 2:00 PM — TDIU Virtual C&P Exam (MDD). Nexus247's C&P Prep tool used to prepare for both appointments.",
    type: "live",
    rating: null,
  },
];

const CHAIN = [
  { label: "Tinnitus", sub: "Primary / Direct", pct: "10%", color: "#D4A43E", active: true },
  { label: "MDD", sub: "Secondary to Tinnitus", pct: "70%", color: "#f472b6", active: true },
  { label: "Hypertension", sub: "Secondary to MDD", pct: "NR", color: "#a78bfa", active: true },
  { label: "CKD Stage 3", sub: "Secondary to HTN", pct: "30%", color: "#60a5fa", active: true },
];

function AnimatedBar({ amount, active, highlight }: { amount: number; active: boolean; highlight: boolean }) {
  const [width, setWidth] = useState(0);
  const pct = Math.max((amount / MAX) * 100, 2);
  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [active, pct]);
  return (
    <div style={{ height: 26, backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden", position: "relative" }}>
      <div style={{
        height: "100%", width: `${width}%`,
        background: highlight ? "linear-gradient(90deg, #D4A43E, #e8bc58)" : "rgba(255,255,255,0.1)",
        borderRadius: 4,
        transition: "width 0.9s cubic-bezier(0.16,1,0.3,1)",
        boxShadow: highlight ? "0 0 16px rgba(212,164,62,0.4)" : "none",
      }} />
      <div style={{
        position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
        fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem",
        color: highlight ? "#D4A43E" : "rgba(255,255,255,0.3)",
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

const typeStyles: Record<string, { dot: string; border: string; bg: string }> = {
  win:   { dot: "#4ade80", border: "rgba(74,222,128,0.2)",  bg: "rgba(74,222,128,0.04)"  },
  bad:   { dot: "#ef4444", border: "rgba(239,68,68,0.2)",   bg: "rgba(239,68,68,0.04)"   },
  stall: { dot: "#6b7280", border: "rgba(107,114,128,0.2)", bg: "rgba(107,114,128,0.04)" },
  nexus: { dot: "#D4A43E", border: "rgba(212,164,62,0.25)", bg: "rgba(212,164,62,0.04)"  },
  live:  { dot: "#4ade80", border: "rgba(74,222,128,0.35)", bg: "rgba(74,222,128,0.07)"  },
};

export default function RatingTimeline() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "80px 5vw", backgroundColor: "#f0efe9", position: "relative", overflow: "hidden" }}>


      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1, backgroundColor: "#080f1a", borderRadius: 16, boxShadow: "0 24px 64px rgba(11,28,46,0.22), 0 0 0 1px rgba(255,255,255,0.07)", padding: "60px 56px", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <div style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A43E", border: "1px solid rgba(212,164,62,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem" }}>
            Real Results · Real Veteran · Real Dates
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: "0 0 1rem 0" }}>
            This is what winning<br />
            <em style={{ color: "#D4A43E", fontStyle: "italic" }}>actually looks like.</em>
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", maxWidth: 560, lineHeight: 1.7, fontWeight: 300, margin: 0 }}>
            Four years of COLA adjustments. $144 to $175. An attorney who went silent.
            Then Nexus247 — and everything changed. These are our founder's actual VA records.
          </p>
        </div>

        {/* Hero stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: "3rem" }} className="retro-stats">
          {[
            { val: 25000, prefix: "$", suffix: "+", label: "Retroactive back pay received", color: "#4ade80", sub: "Includes CKD retro · More pending on TDIU & board" },
            { val: 2102,  prefix: "$", suffix: "/mo", label: "Current monthly entitlement", color: "#D4A43E", sub: "Up from $175/mo" },
            { val: 80,    prefix: "",  suffix: "%", label: "Combined disability rating", color: "#60a5fa", sub: "TDIU decision still pending" },
          ].map(({ val, prefix, suffix, label, color, sub }) => (
            <div key={label} style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "24px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.6 }} />
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.4rem)", color, lineHeight: 1, marginBottom: 8 }}>
                <AnimatedCount target={val} active={active} prefix={prefix} suffix={suffix} />
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Nexus Chain */}
        <div style={{ marginBottom: "3rem", backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "24px 28px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.2rem" }}>
            Service Connection Chain — How One Condition Became Four
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap", rowGap: 12 }} className="chain-flow">
            {CHAIN.map(({ label, sub, pct, color }, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${color}40`, borderRadius: 8, padding: "12px 16px", textAlign: "center", minWidth: 130, position: "relative", overflow: "hidden", opacity: active ? 1 : 0, transform: active ? "translateY(0)" : "translateY(10px)", transition: `opacity 0.5s ${i * 0.12}s ease, transform 0.5s ${i * 0.12}s ease` }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: color, opacity: 0.7 }} />
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color, lineHeight: 1, marginBottom: 4 }}>{pct}</div>
                  <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ffffff", marginBottom: 3 }}>{label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", lineHeight: 1.4 }}>{sub}</div>
                  {pct === "NR" && <div style={{ marginTop: 4, fontFamily: "'JetBrains Mono', monospace", fontSize: "0.55rem", color: "rgba(255,255,255,0.25)" }}>not rated — still counts</div>}
                </div>
                {i < CHAIN.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", padding: "0 8px", opacity: active ? 1 : 0, transition: `opacity 0.5s ${i * 0.12 + 0.08}s ease` }}>
                    <div style={{ width: 20, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
                    <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", margin: "0 2px" }}>→</div>
                    <div style={{ width: 20, height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, fontWeight: 300, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            One ringing ear from military service — documented correctly — unlocked a secondary depression claim, a tertiary hypertension link, and ultimately kidney disease compensation. Nexus247 surfaces these chains automatically.
          </div>
        </div>

        {/* Two column: timeline + payment bars */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }} className="timeline-layout">

          {/* Left — detailed timeline */}
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1.2rem" }}>
              Full Case Timeline
            </div>

            <div style={{ position: "relative" }}>
              {/* Vertical line */}
              <div style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 1, backgroundColor: "rgba(255,255,255,0.07)", zIndex: 0 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {TIMELINE.map((item, i) => {
                  const s = typeStyles[item.type];
                  const isLive = item.type === "live";
                  return (
                    <div key={i} style={{ display: "flex", gap: 16, paddingBottom: 20, position: "relative", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-8px)", transition: `opacity 0.4s ${i * 0.06}s ease, transform 0.4s ${i * 0.06}s ease` }}>
                      {/* Dot */}
                      <div style={{ flexShrink: 0, width: 15, height: 15, borderRadius: "50%", backgroundColor: s.dot, border: `2px solid ${s.dot}40`, marginTop: 2, position: "relative", zIndex: 1, boxShadow: isLive ? `0 0 10px ${s.dot}` : "none" }}>
                        {isLive && <div style={{ position: "absolute", inset: -3, borderRadius: "50%", border: `1px solid ${s.dot}`, animation: "ping 1.5s infinite", opacity: 0.6 }} />}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, backgroundColor: s.bg, border: `1px solid ${s.border}`, borderRadius: 8, padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#ffffff", lineHeight: 1.3 }}>{item.title}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                            {item.rating && (
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: s.dot, fontWeight: 700, backgroundColor: `${s.dot}18`, padding: "1px 8px", borderRadius: 3 }}>
                                {item.rating}
                              </div>
                            )}
                            {isLive && (
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "#4ade80", backgroundColor: "rgba(74,222,128,0.12)", padding: "2px 8px", borderRadius: 3, letterSpacing: "0.08em" }}>
                                LIVE
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", marginBottom: 6 }}>{item.date}</div>
                        <div style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 }}>{item.detail}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right — payment bars + live status */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 80 }}>

            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>
                Monthly Entitlement History
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {PAYMENTS.map((p, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 1fr", gap: 10, alignItems: "center", opacity: active ? 1 : 0, transform: active ? "translateX(0)" : "translateX(-8px)", transition: `opacity 0.4s ${i * 0.07}s ease, transform 0.4s ${i * 0.07}s ease` }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: p.highlight ? "#D4A43E" : "rgba(255,255,255,0.25)", textAlign: "right", fontWeight: p.highlight ? 700 : 400 }}>{p.date}</div>
                    <AnimatedBar amount={p.amount} active={active} highlight={p.highlight} />
                  </div>
                ))}
              </div>
            </div>

            {/* Live status */}
            <div style={{ backgroundColor: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.8)", animation: "pulse 2s infinite", flexShrink: 0 }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "#4ade80", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>March 11, 2026 — Active</div>
              </div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", fontWeight: 500, marginBottom: 6 }}>Two appointments. Same day.</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#4ade80", marginTop: 5, flexShrink: 0 }} />
                  <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>11:00 AM — Board Denied Conditions Hearing (virtual)</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#4ade80", marginTop: 5, flexShrink: 0 }} />
                  <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>2:00 PM — TDIU Virtual C&P Exam (MDD) · Prepared using Nexus247 C&P Prep</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", backgroundColor: "#D4A43E", marginTop: 5, flexShrink: 0 }} />
                  <div style={{ fontSize: "0.74rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Additional retro pay pending on TDIU outcome + board results</div>
                </div>
              </div>
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(74,222,128,0.15)", fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", fontFamily: "'JetBrains Mono', monospace" }}>
                Built and fought with the same tools you have access to today.
              </div>
            </div>

            <a href="/api/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#D4A43E", color: "#080f1a", padding: "14px 20px", borderRadius: 6, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 24px rgba(212,164,62,0.3)" }}>
              See what's in your records →
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", color: "rgba(255,255,255,0.18)", letterSpacing: "0.06em", lineHeight: 1.8 }}>
          These are real VA payment records and ratings belonging to a Nexus247 founder. Individual results vary. Nexus247 is a drafting tool, not a law firm, and is not affiliated with the Department of Veterans Affairs.
        </div>
      </div>

      <style>{`
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (max-width: 900px) {
          .timeline-layout { grid-template-columns: 1fr !important; }
          .retro-stats { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .chain-flow { flex-direction: column !important; align-items: flex-start !important; }
          .retro-stats { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
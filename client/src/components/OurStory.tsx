import { useEffect, useRef, useState } from "react";
import { ArrowRight, Shield, Scale, Clock, Stethoscope, CreditCard } from "lucide-react";

const STATS = [
  { value: 10, suffix: "%", label: "Where it started", note: "Initial VA rating", bad: false },
  { value: 5, suffix: " yrs", label: "Lost to the system", note: "Attorney-managed, going nowhere", bad: true },
  { value: 80, suffix: "%", label: "Where it stands now", note: "Rating after using Nexus247", bad: false },
  { value: 4, suffix: " mo", label: "To get there", note: "From first letter to decision", bad: false },
];

function AnimatedNumber({ target, suffix, active, bad }: { target: number; suffix: string; active: boolean; bad: boolean }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const tick = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(current);
      if (current >= target) clearInterval(tick);
    }, 35);
    return () => clearInterval(tick);
  }, [active, target]);
  return <span style={{ color: bad ? "#ef4444" : "#D4A43E" }}>{display}{suffix}</span>;
}

export default function OurStory() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "100px 5vw", backgroundColor: "#0D2137", position: "relative", overflow: "hidden" }}>

      {/* Gold glow */}
      <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "60vw", height: "60%", background: "radial-gradient(ellipse, rgba(212,164,62,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#D4A43E", border: "1px solid rgba(212,164,62,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem" }}>
            Who We Are & Why We Built This
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#ffffff", lineHeight: 1.15, letterSpacing: "-0.02em", margin: 0 }}>
            Built by veterans.<br />
            <em style={{ color: "#D4A43E", fontStyle: "italic" }}>Tired of being betrayed.</em>
          </h2>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", marginBottom: "4rem", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(212,164,62,0.2)" }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{ padding: "28px 20px", textAlign: "center", position: "relative", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none", backgroundColor: s.bad ? "rgba(239,68,68,0.05)" : "rgba(255,255,255,0.03)" }}>
              {s.bad && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 9, color: "rgba(239,68,68,0.8)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>LOST</div>}
              {i === 2 && <div style={{ position: "absolute", top: 10, right: 12, fontSize: 9, color: "rgba(74,222,128,0.8)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>WON</div>}
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3vw, 2.8rem)", lineHeight: 1, marginBottom: 8 }}>
                <AnimatedNumber target={s.value} suffix={s.suffix} active={active} bad={s.bad} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.4, fontWeight: 300 }}>{s.note}</div>
            </div>
          ))}
        </div>

        {/* Story + Principles */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }} className="story-grid">

          {/* Left — story */}
          <div>
            <div style={{ width: 40, height: 3, backgroundColor: "#D4A43E", marginBottom: "1.8rem", opacity: 0.8 }} />

            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1.3rem", fontWeight: 300 }}>
              We are veterans. We know the system. And we've been burned by it.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1.3rem", fontWeight: 300 }}>
              One of our founders trusted an attorney with their claim. Five years later, still at <strong style={{ color: "#ffffff" }}>10%</strong> — not because the case was weak, but because a higher rating meant a larger fee, and delay was profitable. For him. Not for us.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1.3rem", fontWeight: 300 }}>
              We stopped waiting. We learned the CFR. We consulted nurse practitioners and physician assistants, studied what VA raters actually look for, and built letters grounded in the exact regulations — scored for quality before submission.
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "1.3rem", fontWeight: 300 }}>
              The result: <strong style={{ color: "#ef4444" }}>10%</strong> to <strong style={{ color: "#4ade80" }}>80%</strong> in <strong style={{ color: "#ffffff" }}>4 months</strong>. An AOD granted in 45 days. A hearing date secured. <strong style={{ color: "#ffffff" }}>Without a single clinician signature.</strong>
            </p>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.72)", lineHeight: 1.8, marginBottom: "2rem", fontWeight: 300 }}>
              We built Nexus247 so every veteran can do the same.
            </p>

            <a href="/api/login" style={{ display: "inline-flex", alignItems: "center", gap: 10, backgroundColor: "#D4A43E", color: "#0D2137", padding: "13px 28px", borderRadius: 3, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none", fontFamily: "'DM Sans', sans-serif", boxShadow: "0 4px 20px rgba(212,164,62,0.28)" }}>
              Start your free trial <ArrowRight size={14} />
            </a>
          </div>

          {/* Right — principles + clinician + financing */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {[
              { Icon: Shield, title: "We don't work for the VA.", body: "We work for you. Every feature, every letter, every score is built around one question: what does a veteran need to win?" },
              { Icon: Scale, title: "No legal fees. No percentage of your back pay.", body: "Accredited attorneys can take up to 20% of your retroactive benefits. We charge a flat monthly rate. What you win is yours." },
              { Icon: Clock, title: "We built what we needed.", body: "This isn't a product built by a tech company that noticed a market. It was built by veterans who needed it and couldn't find it anywhere." },
            ].map(({ Icon, title, body }) => (
              <div key={title}
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start", transition: "border-color 0.2s, background-color 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(212,164,62,0.3)"; e.currentTarget.style.backgroundColor = "rgba(212,164,62,0.05)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; }}
              >
                <div style={{ width: 34, height: 34, backgroundColor: "rgba(212,164,62,0.12)", border: "1px solid rgba(212,164,62,0.25)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={15} style={{ color: "#D4A43E" }} />
                </div>
                <div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff", marginBottom: 5, fontFamily: "'DM Serif Display', serif" }}>{title}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, fontWeight: 300 }}>{body}</div>
                </div>
              </div>
            ))}

            {/* Clinician card */}
            <div style={{ backgroundColor: "rgba(212,164,62,0.06)", border: "1px solid rgba(212,164,62,0.25)", borderRadius: 8, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 34, height: 34, backgroundColor: "rgba(212,164,62,0.15)", border: "1px solid rgba(212,164,62,0.3)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Stethoscope size={15} style={{ color: "#D4A43E" }} />
                </div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff", fontFamily: "'DM Serif Display', serif" }}>
                  When you need a signature — we have them.
                </div>
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, fontWeight: 300, margin: "0 0 12px 0" }}>
                Most claims don't require a clinician signature — and we proved it. But when you do need one (Aid & Attendance, SMC, complex secondaries), we have NPs and PAs on staff. Their review is a separate, optional fee — <strong style={{ color: "#ffffff", fontWeight: 500 }}>not bundled into your monthly plan</strong> — and nowhere near what the market charges.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 0 }}>
                <div style={{ height: 1, flex: 1, background: "rgba(212,164,62,0.2)" }} />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", color: "rgba(212,164,62,0.7)", letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                  Not $750+. Not even close.
                </div>
                <div style={{ height: 1, flex: 1, background: "rgba(212,164,62,0.2)" }} />
              </div>
            </div>

            {/* Financing card */}
            <div style={{ backgroundColor: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.18)", borderRadius: 8, padding: "16px 20px", display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ width: 34, height: 34, backgroundColor: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <CreditCard size={15} style={{ color: "#4ade80" }} />
              </div>
              <div>
                <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#ffffff", marginBottom: 5, fontFamily: "'DM Serif Display', serif" }}>
                  Can't cover the signature fee upfront? We can finance it.
                </div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.65, fontWeight: 300 }}>
                  Cost should never be the reason a veteran's claim stalls. If you need a clinician review and the timing isn't right, ask us about financing options. We'll work it out.
                </div>
              </div>
            </div>

            {/* Live pulse */}
            <div style={{ backgroundColor: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.7)", flexShrink: 0, animation: "pulse 2s infinite" }} />
              <div>
                <div style={{ fontSize: "0.78rem", color: "#4ade80", fontWeight: 600, marginBottom: 2 }}>Active hearing — right now</div>
                <div style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.35)", fontWeight: 300, lineHeight: 1.5 }}>Our founder's VA appeal is in progress — using the same tools you have access to today.</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .story-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}

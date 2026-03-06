import { useState, useEffect, useRef } from "react";
import {
  Shield,
  FileText,
  MessageCircle,
  Calculator,
  CheckCircle,
  ArrowRight,
  Lock,
  ChevronDown,
  Scale,
  Brain,
  Users,
  Clock,
  Activity,
  Menu,
  X,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { RpaScoringModal } from "@/components/rpa-scoring-modal";
import TikTokBanner from "@/components/TikTokBanner";
import OurStory from "@/components/OurStory";
import RatingTimeline from "@/components/RatingTimeline";
import DashboardDemo from "@/components/DashboardDemo";

const features = [
  {
    icon: FileText,
    title: "CFR-Grounded Letters",
    description:
      "Nexus letters, personal statements, and NODs — each citing the specific 38 CFR sections that VA raters look for. No guesswork.",
  },
  {
    icon: Clock,
    title: "Trained on Real Decisions",
    description:
      "Our AI learns from actual VA approvals and denials to understand how raters think and which arguments consistently win claims.",
  },
  {
    icon: Activity,
    title: "RPA Quality Scoring",
    description:
      "Every letter is scored across 5 dimensions — CFR compliance, evidence strength, nexus quality, and rater readiness — before you submit.",
  },
  {
    icon: MessageCircle,
    title: "AI Claims Advisor",
    description:
      "Get instant, informed answers about your claim, C&P exam prep, filing strategy, and appeal options — available any time.",
  },
  {
    icon: Calculator,
    title: "Rating Estimator",
    description:
      "Calculate your combined VA disability rating using the official whole-person method and see exactly where you stand before filing.",
  },
  {
    icon: Users,
    title: "Human Expert Support",
    description:
      "Request manual review from claims experts when you need human guidance on complex medical evidence or appeal strategy.",
  },
];

const tiers = [
  {
    name: "Basic",
    price: "$19",
    period: "/month",
    description: "Get started with essential claim tools",
    features: [
      { text: "5 AI-generated letters per month", detail: "Nexus letters, personal statements, buddy letters, NODs, secondary condition letters, and increase claims — all CFR-grounded and scored for quality." },
      { text: "Nexus, personal statements, buddy letters", detail: "Each letter is tailored to your specific condition, service history, and medical records. Nexus letters are concise and ready for a medical professional to sign." },
      { text: "NODs and secondary condition letters", detail: "Notices of Disagreement cite specific rater errors and CFR violations. Secondary condition letters establish the medical link between conditions." },
      { text: "2 decision letter analyses per month", detail: "Upload your VA decision letter and get an AI breakdown of denial reasons, rater errors, missed evidence, and recommended next steps." },
      { text: "Rating estimator", detail: "Calculate your combined VA disability rating with 2026 COLA rates and SMC eligibility check." },
      { text: "AI Claims Chat", detail: "Ask questions about VA claims, CFR regulations, and appeals strategies. The advisor references your profile and conditions." },
      { text: "RPA quality scoring", detail: "Every document is scored on CFR accuracy, evidence strength, nexus clarity, and rater readiness — with specific improvement suggestions." },
    ],
    cta: "START MY FREE TRIAL",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For veterans serious about winning claims",
    features: [
      { text: "50 AI-generated letters per month", detail: "Ten times the Basic limit. Generate letters for multiple conditions and iterations without worrying about running out." },
      { text: "All Basic features", detail: "Every document type, rating estimator, AI chat, and RPA quality scoring included." },
      { text: "C&P Exam Prep with printable cheat sheet", detail: "A personalized 8-section prep guide covering examiner questions, DBQ scoring criteria, worst-day symptom descriptions, and a printable one-pager to bring to your exam." },
      { text: "10 decision letter analyses per month", detail: "Analyze multiple decision letters, track patterns across denials, and build a comprehensive appeal strategy." },
      { text: "Cross-reference evidence analysis", detail: "Compares your medical records against decision letter findings to identify evidence gaps and calculate win probabilities." },
      { text: "Smart document gap alerts", detail: "Before your C&P exam, checks if you're missing a nexus letter or buddy letter and lets you generate them with one click." },
    ],
    cta: "START MY FREE TRIAL",
    popular: true,
  },
  {
    name: "Concierge",
    price: "$149",
    period: "/month",
    description: "White-glove service for complex claims",
    features: [
      { text: "Unlimited AI-generated letters", detail: "No monthly limits. Generate as many documents as you need for every condition and appeal." },
      { text: "All Pro features", detail: "Everything in Pro including C&P Exam Prep, cross-reference analysis, smart gap alerts, and AI chat with full medical records context." },
      { text: "50 C&P Exam Prep guides per month", detail: "Prepare for every exam across all your conditions. Generate updated prep guides as your evidence evolves." },
      { text: "AOD Motions & Good Cause Letters", detail: "Advance on Docket motions under 38 CFR § 20.900(c) and Good Cause letters under 38 U.S.C. § 7107 — exclusive to Concierge." },
      { text: "Priority human expert review", detail: "Your documents are reviewed by a claims specialist who provides feedback on strategy, evidence gaps, and submission timing." },
      { text: "1-on-1 claims strategy sessions", detail: "Schedule a session with a claims advisor to discuss your overall strategy and plan your appeals approach." },
    ],
    cta: "START MY FREE TRIAL",
    popular: false,
  },
];

const testimonials = [
  {
    quote: "The nexus letter was night and day compared to what I'd been submitting. It cited specific CFR sections I didn't even know applied to my case.",
    author: "Army Veteran — 70% Rating Awarded",
  },
  {
    quote: "I'd been fighting my claim for three years. Within 60 days of using Nexus247, I had my decision. The quality scoring alone was worth it.",
    author: "Marine Corps Veteran — Claim Approved",
  },
  {
    quote: "Finally a tool built for veterans, not built to confuse them. Clean, fast, and the AI advisor actually understood my situation.",
    author: "Navy Veteran — Appeal Successful",
  },
];

const steps = [
  {
    num: "01",
    title: "Upload Your Records",
    desc: "Securely submit your medical records, service history, and supporting documents in minutes.",
  },
  {
    num: "02",
    title: "AI Builds Your Case",
    desc: "Our system analyzes your records against 38 CFR and generates your nexus letter, personal statement, or NOD.",
  },
  {
    num: "03",
    title: "Review, Score & Submit",
    desc: "Your letter is scored for quality across five dimensions. Review, refine if needed, and submit with confidence.",
  },
];

function LandingFeatureItem({ feature }: { feature: { text: string; detail: string } }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li style={{ fontSize: "0.88rem", marginBottom: "0.75rem", lineHeight: 1.4 }}>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-2.5 w-full text-left cursor-pointer"
        style={{ background: "none", border: "none", padding: 0, font: "inherit", color: "rgba(255,255,255,0.85)" }}
        data-testid={`feature-${feature.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`}
      >
        <CheckCircle style={{ width: 15, height: 15, marginTop: 2, flexShrink: 0, color: "var(--gold)" }} />
        <span className="flex-1">{feature.text}</span>
        <ChevronDown
          style={{
            width: 14,
            height: 14,
            marginTop: 2,
            flexShrink: 0,
            opacity: 0.4,
            color: "rgba(255,255,255,0.5)",
            transition: "transform 0.2s",
            transform: expanded ? "rotate(180deg)" : "none",
          }}
        />
      </button>
      {expanded && (
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginTop: 6, marginLeft: 26, lineHeight: 1.6, fontWeight: 300 }}>
          {feature.detail}
        </p>
      )}
    </li>
  );
}

const SCORE_ROWS = [
  { label: "CFR Compliance", score: 9, width: 90 },
  { label: "Nexus Strength", score: 9, width: 90 },
  { label: "Evidence Grounding", score: 8, width: 80 },
  { label: "Diagnostic Clarity", score: 8, width: 80 },
  { label: "Rater Readiness", score: 9, width: 90 },
];

function ScoreCard() {
  const [animated, setAnimated] = useState(false);
  const [barWidths, setBarWidths] = useState(SCORE_ROWS.map(() => 0));
  const [scores, setScores] = useState(SCORE_ROWS.map(() => 0));
  const [overall, setOverall] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [animated]);

  useEffect(() => {
    if (!animated) return;
    SCORE_ROWS.forEach((row, i) => {
      setTimeout(() => {
        setBarWidths((prev) => { const n = [...prev]; n[i] = row.width; return n; });
        let current = 0;
        const tick = setInterval(() => {
          current++;
          setScores((prev) => { const n = [...prev]; n[i] = current; return n; });
          if (current >= row.score) clearInterval(tick);
        }, 90);
      }, 500 + i * 200);
    });
    setTimeout(() => {
      let n = 0;
      const target = 86;
      const tick = setInterval(() => {
        n += 2;
        setOverall(Math.min(n, target));
        if (n >= target) clearInterval(tick);
      }, 20);
    }, 500 + 5 * 200 + 300);
  }, [animated]);

  return (
    <div ref={cardRef} className="score-card-wrap" style={{ flex: "0 0 390px", animation: animated ? "fadeLeft 0.8s ease both" : "none" }}>
      <div style={{
        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(212,164,62,0.3)",
        borderRadius: 10, padding: "26px 26px 22px", backdropFilter: "blur(12px)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }} data-testid="card-score-preview">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)" }}>
            RPA Quality Score
          </div>
          <div style={{
            background: "rgba(212,164,62,0.15)", border: "1px solid rgba(212,164,62,0.35)",
            borderRadius: 2, padding: "3px 10px", fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.58rem", letterSpacing: "0.1em", color: "var(--gold-lt)", textTransform: "uppercase",
          }}>
            Live Preview
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.06)", borderRadius: 5, padding: "13px 15px",
          marginBottom: 20, border: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.56rem", letterSpacing: "0.14em", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", marginBottom: 9 }}>
            Nexus Letter · Veteran Sample
          </div>
          {[100, 88, 95, 80, 60].map((w, i) => (
            <div key={i} style={{ height: 6, borderRadius: 4, background: "rgba(255,255,255,0.12)", marginBottom: i < 4 ? 6 : 0, width: `${w}%`, filter: "blur(1px)" }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          {SCORE_ROWS.map((row, i) => (
            <div key={row.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.75)" }}>{row.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--gold)", fontWeight: 600 }}>{scores[i]}/10</div>
              </div>
              <div style={{ height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 10,
                  background: "linear-gradient(90deg, var(--gold), var(--gold-lt))",
                  width: `${barWidths[i]}%`,
                  transition: "width 1.2s cubic-bezier(0.22, 1, 0.36, 1)",
                }} />
              </div>
            </div>
          ))}
        </div>
        <div style={{
          background: "rgba(212,164,62,0.1)", border: "1px solid rgba(212,164,62,0.3)",
          borderRadius: 6, padding: "13px 15px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 3 }}>
              Overall Score
            </div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.85rem", color: "var(--gold)", lineHeight: 1 }} data-testid="text-overall-score">
              {overall}<span style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>/100</span>
            </div>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(34,197,94,0.15)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: 4, padding: "8px 13px",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 8px rgba(74,222,128,0.6)", animation: "pulse 2s infinite" }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4ade80" }}>
              Ready to Submit
            </div>
          </div>
        </div>
        <div style={{ marginTop: 13, textAlign: "center", fontSize: "0.7rem", color: "rgba(255,255,255,0.27)", lineHeight: 1.5 }}>
          Every letter is scored like this <strong style={{ color: "rgba(212,164,62,0.7)", fontWeight: 500 }}>before you submit</strong>.<br />
          Low scores get flagged for revision automatically.
        </div>
      </div>
    </div>
  );
}

// ── Animated bounce arrow ──────────────────────────────────────────
function BounceArrow() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, margin: "0 auto 48px", userSelect: "none" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.68rem",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "var(--gold)",
        opacity: 0.85,
      }}>
        See what's inside
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, animation: "arrowBounce 1.6s ease-in-out infinite" }}>
        <div style={{ width: 1, height: 24, background: "linear-gradient(to bottom, transparent, var(--gold))" }} />
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
          <path d="M1 1L9 9L17 1" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rpaModalOpen, setRpaModalOpen] = useState(false);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add("visible"), i * 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const addRevealRef = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--smoke)", color: "var(--body-txt)", overflowX: "hidden" }}>
      <TikTokBanner />
      {/* NAV */}
      <nav className="landing-nav" data-testid="nav-landing" style={{ marginTop: 44 }}>
        <a href="/" style={{ textDecoration: "none" }} data-testid="link-landing-logo">
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", color: "#fff", letterSpacing: "0.02em" }}>
            Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
          </span>
        </a>
        <ul className="hidden md:flex" style={{ gap: "2.2rem", listStyle: "none", margin: 0, padding: 0 }}>
          <li><a href="#features" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-features">Features</a></li>
          <li><a href="#how" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-how-it-works">How It Works</a></li>
          <li><a href="#pricing" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-pricing">Pricing</a></li>
          <li><a href="/faq" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-faq">FAQ</a></li>
        </ul>
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "12px" }}>
          <a href="/api/login" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="button-login">Log In</a>
          <a href="/api/login" data-testid="button-get-started">
            <button
              type="button"
              style={{
                background: "var(--gold)", color: "var(--navy)", border: "none",
                padding: "10px 22px", borderRadius: 3, fontSize: "0.83rem", fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              START MY FREE TRIAL
            </button>
          </a>
        </div>
        <button
          type="button"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div
          style={{
            position: "fixed", top: 68, left: 0, right: 0, zIndex: 99,
            background: "var(--navy)", borderBottom: "1px solid rgba(200,153,58,0.18)",
            padding: "16px 5vw", display: "flex", flexDirection: "column", gap: 12,
          }}
        >
          <a href="#features" onClick={() => setMobileMenuOpen(false)} style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }} data-testid="link-features-mobile">Features</a>
          <a href="#how" onClick={() => setMobileMenuOpen(false)} style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }} data-testid="link-how-mobile">How It Works</a>
          <a href="#pricing" onClick={() => setMobileMenuOpen(false)} style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }} data-testid="link-pricing-mobile">Pricing</a>
          <a href="/faq" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }} data-testid="link-faq-mobile">FAQ</a>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            <a href="/api/login" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }} data-testid="button-login-mobile">Log In</a>
            <a href="/api/login" data-testid="button-get-started-mobile">
              <button type="button" style={{ background: "var(--gold)", color: "var(--navy)", border: "none", padding: "12px 22px", borderRadius: 3, fontSize: "0.83rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>
                START MY FREE TRIAL
              </button>
            </a>
          </div>
        </div>
      )}

      {/* HERO */}
      <section
        className="landing-grid-bg"
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0D2137 0%, #163352 55%, #1a3d60 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          position: "relative", overflow: "hidden", padding: "120px 5vw 80px",
        }}
      >
        <div style={{
          position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
          width: "52vw", height: "80%",
          background: "radial-gradient(ellipse at center, rgba(212,164,62,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        <div className="landing-hero-inner" style={{
          display: "flex", alignItems: "center", gap: "5vw",
          maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2rem", animation: "fadeUp 0.6s ease both" }}>
              <div style={{ width: 32, height: 1, background: "var(--gold)", opacity: 0.8 }} />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold)" }}>
                Trusted by Veterans Nationwide
              </div>
            </div>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 5.5vw, 4.8rem)",
                lineHeight: 1.07, color: "#fff", marginBottom: "1.5rem", animation: "fadeUp 0.6s 0.1s ease both",
              }}
              data-testid="text-hero-headline"
            >
              Your Service<br />Deserves a <em style={{ fontStyle: "italic", color: "var(--gold)" }}>Fight<br />Worth Winning.</em>
            </h1>
            <p
              style={{
                fontSize: "1.05rem", lineHeight: 1.72, color: "rgba(255,255,255,0.58)",
                maxWidth: 480, marginBottom: "2.8rem", fontWeight: 300, animation: "fadeUp 0.6s 0.2s ease both",
              }}
              data-testid="text-hero-subtitle"
            >
              AI-powered nexus letters, personal statements, and NODs grounded in 38 CFR — scored for quality before you ever submit.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", animation: "fadeUp 0.6s 0.3s ease both" }}>
              <a
                href="/api/login"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10,
                  background: "var(--gold)", color: "var(--navy)", padding: "15px 32px", borderRadius: 3,
                  fontSize: "0.88rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
                  textDecoration: "none", boxShadow: "0 4px 24px rgba(212,164,62,0.32)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                data-testid="button-hero-cta"
              >
                START MY FREE TRIAL
                <ArrowRight style={{ width: 15, height: 15 }} />
              </a>
              <a
                href="#pricing"
                style={{
                  display: "inline-flex", alignItems: "center",
                  background: "transparent", color: "rgba(255,255,255,0.72)", padding: "15px 26px", borderRadius: 3,
                  fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase",
                  textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
                data-testid="button-view-pricing"
              >
                View Pricing
              </a>
            </div>
            <p style={{
              marginTop: "1rem", fontSize: "0.82rem", color: "var(--gold)", fontWeight: 500,
              letterSpacing: "0.04em", animation: "fadeUp 0.6s 0.35s ease both",
            }} data-testid="text-hero-trial">
              Start with a free 3-day Pro trial. No credit card required.
            </p>
            <div
              style={{
                display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap",
                marginTop: "4rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)",
                animation: "fadeUp 0.6s 0.4s ease both",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
                <Shield style={{ width: 13, height: 13, color: "var(--gold)", opacity: 0.75 }} />
                HIPAA Compliant
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
                <Lock style={{ width: 13, height: 13, color: "var(--gold)", opacity: 0.75 }} />
                Encrypted & Secure
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.75rem", letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(255,255,255,0.38)", fontWeight: 500 }}>
                <Scale style={{ width: 13, height: 13, color: "var(--gold)", opacity: 0.75 }} />
                38 CFR Grounded
              </div>
            </div>
          </div>

          <ScoreCard />
        </div>
      </section>

      {/* Gold divider */}
      <div style={{ height: 4, background: "linear-gradient(90deg, transparent, var(--gold) 30%, var(--gold-lt) 50%, var(--gold) 70%, transparent)", opacity: 0.45 }} />

      {/* FEATURES */}
      <section id="features" style={{ padding: "100px 5vw", background: "var(--smoke)" }}>
        {/* Section header */}
        <div ref={addRevealRef} className="reveal" style={{ maxWidth: 580, margin: "0 auto 3rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)",
            border: "1px solid rgba(200,153,58,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem",
          }}>
            What You Get
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "var(--navy)", lineHeight: 1.15, marginBottom: "1rem" }}>
            Everything You Need to Win Your Claim
          </h2>
          <p style={{ color: "var(--landing-muted)", fontSize: "1rem", lineHeight: 1.7, fontWeight: 300 }}>
            Professional-grade tools built by claims experts and powered by AI trained on real VA decisions — not generic templates.
          </p>
        </div>

        {/* ── ANIMATED DASHBOARD DEMO + ARROW ── */}
        <div ref={addRevealRef} className="reveal" style={{ maxWidth: 960, margin: "0 auto 64px" }}>
          <BounceArrow />
          <DashboardDemo />
          <OurStory />  
          <RatingTimeline />
        </div>

        {/* Feature cards */}
        <div
          ref={addRevealRef}
          className="reveal"
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 2, background: "var(--fog)", border: "2px solid var(--fog)",
            borderRadius: 8, overflow: "hidden", maxWidth: 1100, margin: "0 auto",
          }}
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              className="landing-feature-card"
              style={{ background: "var(--smoke)", padding: "44px 36px", transition: "background 0.25s", position: "relative" }}
              data-testid={`card-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <feature.icon className="landing-feat-icon" style={{ width: 40, height: 40, marginBottom: "1.4rem", color: "var(--navy)", transition: "color 0.25s" }} />
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: "1.3rem", color: "var(--navy)", marginBottom: "0.7rem",
                  ...(feature.title === "RPA Quality Scoring" ? { cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--gold)", textUnderlineOffset: 4 } : {}),
                }}
                onClick={feature.title === "RPA Quality Scoring" ? () => setRpaModalOpen(true) : undefined}
                data-testid={feature.title === "RPA Quality Scoring" ? "trigger-rpa-modal-feature" : undefined}
              >
                {feature.title}
              </h3>
              <p style={{ color: "var(--landing-muted)", fontSize: "0.92rem", lineHeight: 1.65, fontWeight: 300 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="landing-grid-bg" style={{ padding: "100px 5vw", background: "var(--navy)", position: "relative", overflow: "hidden" }}>
        <div ref={addRevealRef} className="reveal" style={{ maxWidth: 580, margin: "0 auto 5rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)",
            border: "1px solid rgba(200,153,58,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem",
          }}>
            The Process
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "#fff", lineHeight: 1.15, marginBottom: "1rem" }}>
            Three Steps to a Stronger Claim
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", lineHeight: 1.7, fontWeight: 300 }}>
            We've stripped away the complexity so you can focus on what matters — getting the rating you've earned.
          </p>
        </div>

        <div ref={addRevealRef} className="reveal landing-steps-container" style={{ display: "flex", gap: 0, maxWidth: 960, margin: "0 auto", position: "relative" }}>
          <div className="landing-steps-line" style={{
            position: "absolute", top: 32, left: 40, right: 40, height: 1,
            background: "linear-gradient(90deg, var(--gold), rgba(200,153,58,0.2), var(--gold))", opacity: 0.3,
          }} />
          {steps.map((step) => (
            <div key={step.num} style={{ flex: 1, textAlign: "center", padding: "0 24px", position: "relative" }} data-testid={`step-${step.num}`}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", border: "1px solid rgba(200,153,58,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.5rem", fontFamily: "'JetBrains Mono', monospace",
                fontSize: "1.1rem", fontWeight: 600, color: "var(--gold)",
                background: "rgba(200,153,58,0.08)", position: "relative", zIndex: 1,
              }}>
                {step.num}
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.15rem", color: "#fff", marginBottom: "0.6rem" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.42)", lineHeight: 1.6, fontWeight: 300 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: "100px 5vw", background: "var(--smoke)" }}>
        <div ref={addRevealRef} className="reveal" style={{ maxWidth: 580, margin: "0 auto 5rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem",
            letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)",
            border: "1px solid rgba(200,153,58,0.35)", padding: "5px 14px", borderRadius: 2, marginBottom: "1.2rem",
          }}>
            Pricing
          </div>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", color: "var(--navy)", lineHeight: 1.15, marginBottom: "1rem" }}>
            Simple, Transparent Pricing
          </h2>
          <p style={{ color: "var(--landing-muted)", fontSize: "1rem", lineHeight: 1.7, fontWeight: 300 }}>
            Start with a <span style={{ color: "var(--gold)", fontWeight: 600 }}>free 3-day Pro trial</span> — no credit card required. Then choose the plan that fits your claims needs.
          </p>
        </div>

        <div
          ref={addRevealRef}
          className="reveal"
          style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
            gap: 24, maxWidth: 960, margin: "0 auto",
          }}
        >
          {tiers.map((tier) => (
            <div
              key={tier.name}
              style={{
                backgroundColor: "#0D2137",
                backgroundImage: "linear-gradient(170deg, #0D2137 0%, #132c47 50%, #0D2137 100%)",
                border: tier.popular ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "44px 36px", position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              className="landing-pricing-card"
              data-testid={`card-tier-${tier.name.toLowerCase()}`}
            >
              {tier.popular && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--gold)", color: "#0D2137", fontSize: "0.65rem", fontWeight: 700,
                  letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 20px",
                  borderRadius: "0 0 6px 6px", whiteSpace: "nowrap",
                }}>
                  Most Popular
                </div>
              )}
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.2em",
                textTransform: "uppercase", color: "var(--gold)", marginBottom: "0.8rem",
                ...(tier.popular ? { marginTop: 8 } : {}),
              }}>
                {tier.name}
              </div>
              <div style={{
                fontFamily: "'DM Serif Display', serif", fontSize: "3rem",
                color: "#fff", lineHeight: 1, marginBottom: "0.3rem",
              }}>
                {tier.price}<span style={{ fontSize: "1rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>/month</span>
              </div>
              <div style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", marginBottom: "2rem", lineHeight: 1.5 }}>
                {tier.description}
              </div>
              <ul style={{ listStyle: "none", marginBottom: "2.5rem", padding: 0, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
                {tier.features.map((feature) => (
                  <LandingFeatureItem key={feature.text} feature={feature} />
                ))}
              </ul>
              <a
                href="/api/login"
                style={{
                  display: "block", width: "100%", textAlign: "center", padding: 14, borderRadius: 6,
                  fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  textDecoration: "none", cursor: "pointer",
                  fontFamily: "'JetBrains Mono', monospace",
                  ...(tier.popular
                    ? { background: "linear-gradient(135deg, var(--gold) 0%, #c4942e 100%)", color: "#0D2137", border: "none" }
                    : { background: "rgba(255,255,255,0.06)", border: "none", color: "#fff" }),
                }}
                className="landing-pricing-cta"
                data-testid={`button-${tier.name.toLowerCase()}-cta`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: "80px 5vw", background: "var(--fog)", borderTop: "1px solid rgba(11,28,46,0.06)", borderBottom: "1px solid rgba(11,28,46,0.06)" }}>
        <div ref={addRevealRef} className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, maxWidth: 960, margin: "0 auto" }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{ background: "var(--landing-white)", borderRadius: 6, padding: "32px 28px", borderLeft: "3px solid var(--gold)" }}
              data-testid={`card-testimonial-${i}`}
            >
              <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.05rem", color: "var(--navy)", lineHeight: 1.55, marginBottom: "1.2rem", fontStyle: "italic" }}>
                "{t.quote}"
              </blockquote>
              <div style={{ fontSize: "0.78rem", color: "var(--landing-muted)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
                {t.author}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section
        style={{
          padding: "100px 5vw", background: "var(--navy-mid)", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(200,153,58,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.2rem, 4vw, 3.4rem)", color: "#fff", marginBottom: "1.2rem", position: "relative" }}>
          Your Benefits Are<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Not Optional.</em>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", fontWeight: 300, maxWidth: 480, margin: "0 auto 1.2rem", lineHeight: 1.65, position: "relative" }}>
          You earned them. Let's build a claim that proves it — professional, precise, and ready to win.
        </p>
        <p style={{ color: "var(--gold)", fontSize: "0.88rem", fontWeight: 600, marginBottom: "2.2rem", position: "relative" }} data-testid="text-footer-trial">
          3-day Pro trial — free, no credit card.
        </p>
        <a
          href="/api/login"
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
            background: "var(--gold)", color: "var(--navy)", padding: "16px 34px", borderRadius: 3,
            fontSize: "0.9rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            textDecoration: "none", boxShadow: "0 4px 24px rgba(200,153,58,0.28)",
            fontFamily: "'DM Sans', sans-serif", position: "relative",
          }}
          data-testid="button-footer-cta"
        >
          START MY FREE TRIAL
          <ArrowRight style={{ width: 16, height: 16 }} />
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 5vw", display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#fff" }}>
          Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)", margin: 0 }}>
          2025 Nexus247.ai · Not a law firm · Not affiliated with the VA
        </p>
        <nav style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <a href="/faq" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-faq">FAQ</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-terms">Terms</a>
          <a href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-privacy">Privacy</a>
          <a
            href="https://www.tiktok.com/@nexus247.ai"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "rgba(255,255,255,0.5)", marginLeft: "1.4rem", display: "inline-flex", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#D4A43E")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            data-testid="link-footer-tiktok"
          >
            <SiTiktok size={16} />
          </a>
        </nav>
      </footer>

      <RpaScoringModal open={rpaModalOpen} onOpenChange={setRpaModalOpen} />

      <style>{`
        @keyframes arrowBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .landing-steps-container {
          flex-direction: row;
        }
        .landing-steps-line {
          display: block;
        }
        .landing-feature-card:hover {
          background: var(--gold-pale) !important;
        }
        .landing-feature-card:hover .landing-feat-icon {
          color: var(--gold) !important;
        }
        .landing-pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .landing-pricing-cta:hover {
          filter: brightness(1.08);
          transform: scale(1.01);
        }
        @media (max-width: 900px) {
          .landing-hero-inner {
            flex-direction: column !important;
          }
          .score-card-wrap {
            flex: none !important;
            width: 100% !important;
            max-width: 420px !important;
            margin: 2rem auto 0 !important;
          }
        }
        @media (max-width: 768px) {
          .landing-steps-container {
            flex-direction: column !important;
            gap: 3rem !important;
          }
          .landing-steps-line {
            display: none !important;
          }
          footer {
            flex-direction: column;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}

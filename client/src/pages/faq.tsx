import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import {
  FileText,
  AlertCircle,
  Monitor,
  Activity,
  RotateCcw,
  Shield,
  Plus,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { RpaScoringModal } from "@/components/rpa-scoring-modal";

const categories = [
  { id: "all", label: "All Questions" },
  { id: "nexus", label: "Nexus Letters" },
  { id: "claims", label: "The Claims Process" },
  { id: "platform", label: "Using the Platform" },
  { id: "ratings", label: "Ratings & Math" },
  { id: "appeals", label: "Appeals & NODs" },
  { id: "privacy", label: "Privacy & Security" },
];

const sections = [
  {
    id: "nexus",
    title: "Nexus Letters",
    icon: FileText,
    items: [
      {
        q: "What exactly is a nexus letter and why do I need one?",
        a: `A nexus letter is a medical opinion that establishes the connection — the "nexus" — between your current disability and your military service. The VA requires this link to approve a service-connection claim. Without a clear nexus, even well-documented conditions are routinely denied. A strong nexus letter cites specific 38 CFR regulations, references your service records, and uses the VA's required medical language ("at least as likely as not").`,
      },
      {
        q: "Can I submit a claim without a nexus letter?",
        a: `Technically yes — but you're significantly more likely to be denied. The VA may order its own Compensation & Pension (C&P) exam, which uses VA-contracted examiners who have financial incentives to minimize your rating. Having your own nexus letter on file gives you far more control over how your case is framed and evaluated.`,
      },
      {
        q: "What makes a nexus letter strong vs. one that gets ignored?",
        a: `A strong nexus letter must: (1) use the exact "at least as likely as not" standard — anything weaker is legally insufficient; (2) cite specific 38 CFR sections applicable to your condition; (3) reference your actual service records, MOS, and documented exposures; (4) address and rebut any negative C&P findings; and (5) be written with medical rationale, not just a conclusion. Our AI generates letters meeting all five criteria and then scores them before you see them.`,
      },
      {
        q: "My private doctor refused to write a nexus letter. What now?",
        a: `This is extremely common. Most civilian physicians aren't trained in VA claims language and are cautious about legal liability. Nexus247 generates a draft letter grounded in 38 CFR that you can take back to your doctor for signature — or our Complete plan connects you with an independent medical expert familiar with VA requirements who can write and sign the opinion directly.`,
      },
      {
        q: "Does a nexus letter need to be written by a doctor?",
        a: `For a nexus letter to carry maximum weight, yes — it should be authored or co-signed by a licensed medical professional (MD, DO, PA, NP) with credentials relevant to your condition. Nexus247 generates the medical rationale and CFR-grounded framework; you bring it to your provider or use our expert review option for a fully signed opinion.`,
      },
      {
        q: "Can I get a nexus letter for a secondary condition?",
        a: `Yes, and this is one of the most overlooked opportunities in VA claims. Secondary service connection means a condition caused or aggravated by an already service-connected disability qualifies for its own rating. For example, if your service-connected back injury caused depression, that depression may be ratable too. Our platform handles secondary nexus letters with the same CFR-grounded approach.`,
      },
    ],
  },
  {
    id: "claims",
    title: "The Claims Process",
    icon: AlertCircle,
    items: [
      {
        q: "How long does a VA claim typically take to process?",
        a: `The VA's average processing time varies widely — typically 100–150 days for initial claims, but complex cases or those requiring C&P exams can run 6–18 months. Claims with complete, well-documented evidence (including a strong nexus letter) tend to move faster because the VA doesn't need to gather additional information. The single best thing you can do to speed up your claim is submit a fully evidenced package from the start.`,
      },
      {
        q: "What is a C&P exam and how do I prepare for it?",
        a: `A Compensation & Pension (C&P) exam is a medical evaluation ordered by the VA to assess the nature and severity of your claimed disabilities. Key prep tips: (1) describe your worst days, not your average — the VA rates maximum functional impact; (2) bring your nexus letter and any private medical opinions; (3) don't minimize symptoms out of habit or pride; (4) if you disagree with the examiner's conclusions, you have the right to request a new exam or submit a rebuttal. Our Complete plan includes a C&P prep guide.`,
      },
      {
        q: "What's the difference between direct service connection, secondary, and aggravation?",
        a: `Direct service connection means the condition was caused by an in-service event (injury, exposure, illness). Secondary service connection means the condition was caused or worsened by an already service-connected disability. Aggravation means a pre-existing condition was made permanently worse — beyond its natural progression — by military service. All three qualify for disability compensation, and all three are letter types we support.`,
      },
      {
        q: "I was already denied. Can I still file again?",
        a: `Yes. A denial is not final. You have three options: (1) file a Supplemental Claim with new and relevant evidence — this is the most common path and is where a new nexus letter or updated medical opinion is powerful; (2) request a Higher-Level Review (no new evidence, but a senior reviewer looks for errors); or (3) appeal to the Board of Veterans Appeals. The right path depends on the denial reason — our AI Claims Advisor can help you diagnose which lane is best for your situation.`,
      },
      {
        q: "What is an Effective Date and why does it matter so much?",
        a: `Your effective date is generally the date the VA receives your claim — and it determines your back pay. If you're approved, you receive compensation going back to that date. This is why filing an Intent to File (ITF) immediately is critical: it locks in your effective date while you gather evidence, giving you up to a year to submit a fully developed claim without losing retroactive pay. Never wait until your package is perfect to start the clock.`,
      },
      {
        q: "Do I need a VSO (Veterans Service Officer) to file a claim?",
        a: `No — you can file independently. VSOs are free, accredited advocates who can be valuable, especially for complex cases. However, many veterans find VSOs to be overloaded and under-resourced, and VSOs cannot provide medical opinions or nexus letters. Nexus247 complements a VSO relationship by giving you professional-quality medical evidence that your VSO can then help you submit and track.`,
      },
    ],
  },
  {
    id: "platform",
    title: "Using the Platform",
    icon: Monitor,
    items: [
      {
        q: "What documents do I need to get started?",
        a: `The more you provide, the stronger your letter. At minimum you need: your service records (DD-214), any relevant medical records documenting your condition, and a description of the in-service event or exposure. Helpful additions include: C&P exam results, prior VA decisions, buddy statements, and your MOS/duty description. You don't need everything perfect before starting — our AI works with what you have and flags what's missing.`,
      },
      {
        q: "How does the RPA Quality Scoring work?",
        a: `Every generated letter is automatically scored across five dimensions before you see it: CFR Compliance (are the correct regulatory sections cited?), Nexus Strength (is the service connection argument legally sufficient?), Evidence Integration (does the letter reference your specific records?), Medical Rationale (is the clinical reasoning sound?), and Rater Readiness (is it formatted and written the way VA raters expect?). Each dimension scores 0–20, giving you a total out of 100 with actionable feedback on any weaknesses.`,
      },
      {
        q: "Is Nexus247 a law firm or medical practice?",
        a: `No. Nexus247 is an AI-powered document preparation and claims support platform. We are not attorneys and do not provide legal advice. We are not physicians and do not provide medical diagnoses or treatment. Our platform generates CFR-grounded document templates and educational guidance to help veterans build stronger claims. For a legally binding signed medical opinion, our expert review option connects you with independent licensed clinicians who operate independently.`,
      },
      {
        q: "How is Nexus247 different from free VA claim resources?",
        a: `Free resources — VSOs, VA.gov guides, veteran forums — are valuable but they don't generate your specific medical documents. They can explain the process; they can't write a nexus letter that cites 38 CFR § 3.303 in the context of your particular MOS and diagnosed condition. Nexus247 fills the critical gap between general guidance and the professional-quality medical evidence that actually determines outcomes.`,
      },
      {
        q: "What happens after I purchase? How fast do I get my letter?",
        a: `After purchase, you complete an intake questionnaire and upload your documents. Our AI generates your first letter draft, scores it, and delivers it to your secure dashboard — typically within minutes of completing your intake. You can review, request revisions, and download your final letter in PDF format ready for submission.`,
      },
      {
        q: "Can I use Nexus247 if I'm already working with a VSO or attorney?",
        a: `Absolutely — and many veterans do. Nexus247 handles what VSOs and most attorneys can't: the generation of the actual medical documents. You can use our letters as evidence submitted alongside your VSO's representation, or provide them to your VA-accredited attorney to review and advise on. We're a tool in your arsenal, not a replacement for your existing team.`,
      },
    ],
  },
  {
    id: "ratings",
    title: "Ratings & Math",
    icon: Activity,
    items: [
      {
        q: "Why doesn't my combined rating equal the sum of my individual ratings?",
        a: `Because the VA uses "whole person math," not simple addition. Each successive disability is applied to the remaining "able" percentage of your body — not the total. For example: a 50% rating leaves you 50% able. A second 30% rating is 30% of that remaining 50% = 15% additional disability. Combined: 65% (rounded to 60%). This is why three 30% ratings don't equal 90%. Our Rating Estimator handles this calculation automatically.`,
      },
      {
        q: "What is TDIU and do I qualify?",
        a: `Total Disability Individual Unemployability (TDIU) allows veterans to be paid at the 100% rate even if their combined rating is below 100%, if their service-connected disabilities prevent them from maintaining substantially gainful employment. You may qualify if you have a single disability rated at 60%+ or a combined rating of 70%+ with at least one disability at 40%+. TDIU requires a separate application (VA Form 21-8940) supported by strong medical evidence — which our platform can help build.`,
      },
      {
        q: "Can my rating be reduced after it's assigned?",
        a: `It's possible, but the VA faces a high legal burden to reduce an established rating. Ratings held for 5+ years are considered "protected" and require clear evidence of sustained improvement. Ratings held for 20+ years are "stabilized" and can only be reduced if fraud is proven. Avoid unnecessary follow-up exams, keep current medical documentation, and never ignore VA correspondence — missing a scheduled exam is one of the most common reasons ratings get reduced.`,
      },
      {
        q: "What is a bilateral factor and how does it affect my rating?",
        a: `If you have service-connected disabilities affecting both sides of the body (e.g., both knees, both shoulders, both feet), the VA adds a 10% bilateral factor to those combined ratings before adding them to your overall combined rating. This is a real bump that many veterans and even some VSOs miss. Our Rating Estimator accounts for bilateral conditions automatically.`,
      },
    ],
  },
  {
    id: "appeals",
    title: "Appeals & NODs",
    icon: RotateCcw,
    items: [
      {
        q: "What is a Notice of Disagreement (NOD) and when should I file one?",
        a: `A Notice of Disagreement is a formal statement that you disagree with a VA rating decision. Under the AMA (Appeals Modernization Act), filing an NOD kicks off an appeal at the Board of Veterans Appeals (BVA) and is one of three appeal lanes available after a decision. You have one year from your decision date to file. An NOD is most appropriate when you believe the rater made a legal or factual error — as opposed to simply needing new evidence, where a Supplemental Claim is usually faster.`,
      },
      {
        q: "What's the difference between a Supplemental Claim and an NOD?",
        a: `A Supplemental Claim (VA Form 20-0995) is for when you have new and relevant evidence — like a nexus letter you didn't have before — that wasn't part of the original decision. It stays within the regional office and tends to resolve faster. An NOD is a formal appeal to the BVA arguing the existing decision was wrong. If you were denied due to lack of medical evidence, a Supplemental Claim with a strong nexus letter is usually the right move.`,
      },
      {
        q: "How do I rebut a negative C&P exam?",
        a: `A negative C&P exam is not the end — it can be rebutted with a private independent medical opinion (IMO) that addresses the examiner's specific conclusions point by point. The IMO must explain why the C&P examiner's reasoning was flawed and provide a well-supported counter-opinion. Vague disagreement won't work; it has to engage the evidence directly. This is one of the most powerful uses of our platform and expert review service.`,
      },
      {
        q: "My appeal has been pending for years. What can I do?",
        a: `Legacy appeals (filed before February 2019) can take 5–10 years at the BVA. Options to consider: (1) opt into the AMA modernized review system if eligible — it can significantly speed things up; (2) request a hearing with a Veterans Law Judge if you haven't already; (3) contact your Congressional representative's constituent services office — congressional inquiries can prompt action; (4) work with an accredited VA attorney who may be able to identify procedural shortcuts. Our AI Advisor can help you understand your current status and options.`,
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy & Security",
    icon: Shield,
    items: [
      {
        q: "Is Nexus247 HIPAA compliant?",
        a: `Yes. Nexus247 operates as a HIPAA-covered entity. Your medical records, personal information, and generated documents are handled in compliance with HIPAA privacy and security standards — including encryption in transit and at rest, access controls, and audit logging. We do not sell, share, or market your health information to third parties.`,
      },
      {
        q: "Will using Nexus247 affect my VA records or active claim?",
        a: `No. Nexus247 is completely separate from the VA system. We don't have access to your VA records and we don't communicate with the VA on your behalf unless you explicitly use a representation service. Generating a letter on our platform has zero effect on any pending claim — documents only enter your claim when you choose to submit them yourself through the VA.`,
      },
      {
        q: "How is my data stored and can I delete it?",
        a: `Your documents and personal data are stored in encrypted cloud storage with access limited to you and, where applicable, the expert reviewers you engage. You can request deletion of your account and associated data at any time by contacting our support team. We retain anonymized, de-identified data to improve our AI models but no personally identifiable health information is retained after account deletion.`,
      },
      {
        q: "Is my information shared with the VA or any government agency?",
        a: `No. Nexus247 does not share your information with the VA, Department of Defense, or any government agency. Your information is submitted to the VA only when you personally choose to include our generated documents in your claim package. We are a private service with no government affiliation or data-sharing agreements.`,
      },
    ],
  },
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<string, number | null>>({});
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [rpaModalOpen, setRpaModalOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const defaults: Record<string, number> = {};
    sections.forEach((s) => {
      defaults[s.id] = 0;
    });
    setOpenItems(defaults);
  }, []);

  const handleToggle = useCallback((sectionId: string, itemIndex: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [sectionId]: prev[sectionId] === itemIndex ? null : itemIndex,
    }));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      sections.forEach((s) => {
        const el = sectionRefs.current[s.id];
        if (el && window.scrollY >= el.offsetTop - 140) {
          current = s.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleSections =
    activeCategory === "all"
      ? sections
      : sections.filter((s) => s.id === activeCategory);

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) {
      window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--smoke)", color: "var(--body-txt)", overflowX: "hidden" }}>
      <nav className="landing-nav">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", color: "var(--landing-white)", letterSpacing: "0.02em" }}>
            Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
          </span>
        </Link>
        <ul className="hidden md:flex" style={{ gap: "2.2rem", listStyle: "none" }} data-testid="nav-links">
          <li><a href="/#features" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Features</a></li>
          <li><a href="/#how" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>How It Works</a></li>
          <li><a href="/#pricing" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>Pricing</a></li>
          <li><Link href="/faq" style={{ color: "var(--gold-lt)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }}>FAQ</Link></li>
        </ul>
        <div className="hidden md:flex" style={{ alignItems: "center" }}>
          <a href="/api/login">
            <button
              data-testid="button-nav-cta"
              style={{
                background: "var(--gold)", color: "var(--navy)", border: "none",
                padding: "10px 22px", borderRadius: "3px", fontSize: "0.83rem",
                fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Start Your Claim
            </button>
          </a>
        </div>
        <button type="button" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 4 }} data-testid="button-mobile-menu" aria-label="Toggle menu">
          {mobileMenuOpen ? <X style={{ width: 24, height: 24 }} /> : <Menu style={{ width: 24, height: 24 }} />}
        </button>
      </nav>
      {mobileMenuOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 99, background: "var(--navy)", borderBottom: "1px solid rgba(200,153,58,0.18)", padding: "16px 5vw", display: "flex", flexDirection: "column", gap: 12 }}>
          <a onClick={() => setMobileMenuOpen(false)} href="/#features" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }}>Features</a>
          <a onClick={() => setMobileMenuOpen(false)} href="/#how" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }}>How It Works</a>
          <a onClick={() => setMobileMenuOpen(false)} href="/#pricing" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }}>Pricing</a>
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--gold-lt)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }}>FAQ</Link>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
            <a href="/api/login"><button type="button" style={{ background: "var(--gold)", color: "var(--navy)", border: "none", padding: "12px 22px", borderRadius: 3, fontSize: "0.83rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>Start Your Claim</button></a>
          </div>
        </div>
      )}

      <section className="landing-grid-bg landing-gold-line" style={{ background: "var(--navy)", padding: "140px 5vw 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: 640, marginLeft: "4vw", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
            <div style={{ width: 36, height: 1, background: "var(--gold)", opacity: 0.8 }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }}>
              Knowledge Base
            </div>
          </div>
          <h1
            data-testid="text-faq-headline"
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", color: "var(--landing-white)", lineHeight: 1.1, marginBottom: "1.2rem" }}
          >
            Questions Veterans<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>Actually Ask.</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", lineHeight: 1.7, fontWeight: 300, maxWidth: 480 }}>
            Straight answers on nexus letters, the claims process, how our platform works, and what to expect at every step.
          </p>
        </div>
      </section>

      <div
        data-testid="filter-bar"
        className="overflow-x-auto"
        style={{
          background: "var(--navy-mid)",
          padding: "0 5vw",
          borderBottom: "1px solid rgba(200,153,58,0.12)",
          display: "flex",
          gap: 0,
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-testid={`filter-btn-${cat.id}`}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              background: "none",
              border: "none",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.8rem",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: activeCategory === cat.id ? "var(--gold)" : "rgba(255,255,255,0.4)",
              padding: "18px 20px",
              cursor: "pointer",
              borderBottom: `2px solid ${activeCategory === cat.id ? "var(--gold)" : "transparent"}`,
              whiteSpace: "nowrap",
              transition: "color 0.2s, border-color 0.2s",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div
        style={{
          maxWidth: 1060,
          margin: "0 auto",
          padding: "72px 5vw 100px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 60,
          alignItems: "start",
        }}
        className="faq-layout-grid"
      >
        <aside className="hidden md:block" style={{ position: "sticky", top: 90 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--landing-muted)", marginBottom: "1rem" }}>
            Jump to section
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {visibleSections.map((s) => (
              <li key={s.id} style={{ marginBottom: 2 }}>
                <button
                  data-testid={`sidebar-link-${s.id}`}
                  onClick={() => scrollToSection(s.id)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    color: activeSection === s.id ? "var(--navy)" : "var(--landing-muted)",
                    background: activeSection === s.id ? "var(--fog)" : "transparent",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: 3,
                    borderLeft: `2px solid ${activeSection === s.id ? "var(--gold)" : "transparent"}`,
                    cursor: "pointer",
                    lineHeight: 1.3,
                    fontWeight: activeSection === s.id ? 500 : 400,
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "all 0.2s",
                  }}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div style={{ minWidth: 0 }}>
          {visibleSections.map((section) => {
            const Icon = section.icon;
            return (
              <section
                key={section.id}
                id={section.id}
                ref={(el) => { sectionRefs.current[section.id] = el; }}
                data-testid={`faq-section-${section.id}`}
                style={{ marginBottom: 64, scrollMarginTop: 100 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--fog)" }}>
                  <div style={{
                    width: 36, height: 36,
                    background: "rgba(200,153,58,0.1)",
                    border: "1px solid rgba(200,153,58,0.25)",
                    borderRadius: 4,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--gold)", flexShrink: 0,
                  }}>
                    <Icon size={18} />
                  </div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "var(--navy)", margin: 0 }}>
                    {section.title}
                  </h2>
                </div>

                {section.items.map((item, idx) => {
                  const isOpen = openItems[section.id] === idx;
                  return (
                    <div
                      key={idx}
                      className={`faq-item ${isOpen ? "open" : ""}`}
                      data-testid={`faq-item-${section.id}-${idx}`}
                    >
                      <button
                        className="faq-question"
                        data-testid={`faq-question-${section.id}-${idx}`}
                        onClick={(e) => {
                          if (item.q === "How does the RPA Quality Scoring work?") {
                            setRpaModalOpen(true);
                            return;
                          }
                          handleToggle(section.id, idx);
                        }}
                        style={{
                          width: "100%",
                          background: isOpen ? "var(--smoke)" : "none",
                          border: "none",
                          display: "flex",
                          alignItems: "flex-start",
                          justifyContent: "space-between",
                          gap: 16,
                          padding: "22px 24px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.97rem",
                          fontWeight: 500,
                          color: "var(--navy)",
                          lineHeight: 1.4,
                        }}
                      >
                        <span>
                          {item.q === "How does the RPA Quality Scoring work?" ? (
                            <span
                              onClick={(e) => { e.stopPropagation(); setRpaModalOpen(true); }}
                              style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--gold)", textUnderlineOffset: 4 }}
                              data-testid="trigger-rpa-modal-faq"
                            >
                              {item.q}
                            </span>
                          ) : item.q}
                        </span>
                        <span
                          className="faq-icon-rotate"
                          style={{
                            flexShrink: 0,
                            marginTop: 2,
                            width: 20,
                            height: 20,
                            border: isOpen ? "1px solid var(--gold)" : "1px solid var(--fog)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: isOpen ? "var(--navy)" : "var(--landing-muted)",
                            background: isOpen ? "var(--gold)" : "transparent",
                            transform: isOpen ? "rotate(45deg)" : "none",
                          }}
                        >
                          <Plus size={10} strokeWidth={3} />
                        </span>
                      </button>
                      <div className="faq-answer">
                        <p style={{
                          fontSize: "0.92rem",
                          lineHeight: 1.72,
                          color: "var(--landing-muted)",
                          fontWeight: 300,
                          borderTop: "1px solid var(--fog)",
                          paddingTop: 16,
                        }}>
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      </div>

      <section style={{ background: "var(--navy)", padding: "72px 5vw", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(200,153,58,0.07) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: "var(--landing-white)", marginBottom: "0.8rem" }}>
            Still Have Questions?<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>We're Here.</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.95rem", fontWeight: 300, maxWidth: 440, margin: "0 auto 2rem", lineHeight: 1.65 }}>
            Chat with our AI Claims Advisor or reach our support team — no question is too small when your benefits are on the line.
          </p>
          <a
            href="/api/login"
            data-testid="button-faq-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "var(--gold)",
              color: "var(--navy)",
              padding: "15px 32px",
              borderRadius: 3,
              fontSize: "0.88rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              textDecoration: "none",
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 4px 20px rgba(200,153,58,0.25)",
            }}
          >
            Start Your Claim
            <ArrowRight size={15} />
          </a>
        </div>
      </section>

      <footer style={{
        background: "var(--navy)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 5vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--landing-white)" }}>
          Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
          &copy; 2025 Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
        </p>
        <nav style={{ display: "flex", gap: "1.4rem" }}>
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem" }} data-testid="link-footer-privacy">Privacy</Link>
          <Link href="/terms" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem" }} data-testid="link-footer-terms">Terms</Link>
          <Link href="/faq" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem" }} data-testid="link-footer-faq">FAQ</Link>
        </nav>
      </footer>

      <RpaScoringModal open={rpaModalOpen} onOpenChange={setRpaModalOpen} />

      <style>{`
        .faq-layout-grid {
          grid-template-columns: 220px 1fr;
        }
        @media (max-width: 780px) {
          .faq-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

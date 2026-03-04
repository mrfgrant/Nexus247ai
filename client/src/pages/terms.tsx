import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";

const tosSections = [
  { id: "tos-1", label: "1. Acceptance" },
  { id: "tos-2", label: "2. What We Provide" },
  { id: "tos-3", label: "3. Not Legal or Medical Advice" },
  { id: "tos-4", label: "4. Eligibility" },
  { id: "tos-5", label: "5. Account & Security" },
  { id: "tos-6", label: "6. Payments & Refunds" },
  { id: "tos-7", label: "7. Your Content" },
  { id: "tos-8", label: "8. Prohibited Use" },
  { id: "tos-9", label: "9. Intellectual Property" },
  { id: "tos-10", label: "10. Disclaimers" },
  { id: "tos-11", label: "11. Limitation of Liability" },
  { id: "tos-12", label: "12. Indemnification" },
  { id: "tos-13", label: "13. Termination" },
  { id: "tos-14", label: "14. Governing Law" },
  { id: "tos-15", label: "15. Changes to Terms" },
  { id: "tos-16", label: "16. Contact" },
];

const privacySections = [
  { id: "pp-1", label: "1. Overview" },
  { id: "pp-2", label: "2. Information We Collect" },
  { id: "pp-3", label: "3. How We Use Information" },
  { id: "pp-4", label: "4. HIPAA & Health Data" },
  { id: "pp-5", label: "5. Sharing & Disclosure" },
  { id: "pp-6", label: "6. Data Security" },
  { id: "pp-7", label: "7. Data Retention" },
  { id: "pp-8", label: "8. Your Rights" },
  { id: "pp-9", label: "9. Cookies & Tracking" },
  { id: "pp-10", label: "10. Children's Privacy" },
  { id: "pp-11", label: "11. Veterans & Sensitive Data" },
  { id: "pp-12", label: "12. Changes to Policy" },
  { id: "pp-13", label: "13. Contact & Requests" },
];

export default function Terms() {
  const [activeTab, setActiveTab] = useState<"tos" | "privacy">("tos");
  const [activeSection, setActiveSection] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const switchTab = useCallback((tab: "tos" | "privacy") => {
    setActiveTab(tab);
    window.scrollTo({ top: 300, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const prefix = activeTab === "tos" ? "tos-" : "pp-";
    const handleScroll = () => {
      const sections = document.querySelectorAll(`[id^="${prefix}"]`);
      let current = "";
      sections.forEach((sec) => {
        const el = sec as HTMLElement;
        if (window.scrollY >= el.offsetTop - 120) {
          current = el.id;
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const sidebarSections = activeTab === "tos" ? tosSections : privacySections;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "var(--smoke)", color: "var(--body-txt)", overflowX: "hidden" }}>
      <nav className="landing-nav" data-testid="nav-terms">
        <Link href="/" style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.35rem", color: "#fff", textDecoration: "none" }} data-testid="link-home-logo">
          Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
        </Link>
        <ul className="hidden md:flex" style={{ gap: "2.2rem", listStyle: "none" }}>
          <li><a href="/#features" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-features">Features</a></li>
          <li><a href="/#pricing" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-pricing">Pricing</a></li>
          <li><Link href="/faq" style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase" }} data-testid="link-faq">FAQ</Link></li>
        </ul>
        <div className="hidden md:flex" style={{ alignItems: "center" }}>
          <a href="/api/login">
            <button
              style={{ background: "var(--gold)", color: "var(--navy)", border: "none", padding: "10px 22px", borderRadius: "3px", fontSize: "0.83rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              data-testid="button-nav-cta"
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
          <Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ color: "rgba(255,255,255,0.72)", textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.04em", textTransform: "uppercase", padding: "8px 0" }}>FAQ</Link>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12 }}>
            <a href="/api/login"><button type="button" style={{ background: "var(--gold)", color: "var(--navy)", border: "none", padding: "12px 22px", borderRadius: 3, fontSize: "0.83rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", width: "100%" }}>Start Your Claim</button></a>
          </div>
        </div>
      )}

      <section style={{ background: "var(--navy)", padding: "140px 5vw 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ content: "''", position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(200,153,58,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(200,153,58,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: "5vw", top: "20%", bottom: "20%", width: "2px", background: "linear-gradient(to bottom, transparent, var(--gold) 20%, var(--gold) 80%, transparent)", opacity: 0.4 }} />
        <div style={{ maxWidth: "640px", marginLeft: "4vw", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ width: "36px", height: "1px", background: "var(--gold)", opacity: 0.8 }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold)" }} data-testid="text-eyebrow">Legal</div>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)", color: "#fff", lineHeight: 1.1, marginBottom: "1.2rem" }} data-testid="text-page-title">
            Terms of Service<br /><em style={{ color: "var(--gold)", fontStyle: "italic" }}>&amp; Privacy Policy</em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "1rem", lineHeight: 1.7, fontWeight: 300, maxWidth: "500px" }} data-testid="text-page-subtitle">
            We believe veterans deserve plain-language policies — not walls of fine print designed to confuse. Here's exactly what you're agreeing to and how we protect your information.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "1.5rem", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }} data-testid="text-effective-date">
            <span style={{ display: "block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--gold)", opacity: 0.7 }} />
            Effective Date: January 1, 2025 &nbsp;&middot;&nbsp; Last Updated: January 1, 2025
          </div>
        </div>
      </section>

      <div style={{ background: "var(--navy-mid)", borderBottom: "1px solid rgba(200,153,58,0.12)", padding: "0 5vw", display: "flex", gap: 0 }}>
        <button
          onClick={() => switchTab("tos")}
          className={activeTab === "tos" ? "active" : ""}
          style={{
            background: "none", border: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500,
            letterSpacing: "0.05em", textTransform: "uppercase",
            color: activeTab === "tos" ? "var(--gold)" : "rgba(255,255,255,0.4)",
            padding: "20px 28px", cursor: "pointer",
            borderBottom: activeTab === "tos" ? "2px solid var(--gold)" : "2px solid transparent",
            transition: "color 0.2s, border-color 0.2s",
          }}
          data-testid="button-tab-tos"
        >
          Terms of Service
        </button>
        <button
          onClick={() => switchTab("privacy")}
          className={activeTab === "privacy" ? "active" : ""}
          style={{
            background: "none", border: "none",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", fontWeight: 500,
            letterSpacing: "0.05em", textTransform: "uppercase",
            color: activeTab === "privacy" ? "var(--gold)" : "rgba(255,255,255,0.4)",
            padding: "20px 28px", cursor: "pointer",
            borderBottom: activeTab === "privacy" ? "2px solid var(--gold)" : "2px solid transparent",
            transition: "color 0.2s, border-color 0.2s",
          }}
          data-testid="button-tab-privacy"
        >
          Privacy Policy
        </button>
      </div>

      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "72px 5vw 100px", display: "grid", gridTemplateColumns: "220px 1fr", gap: "60px", alignItems: "start" }} className="legal-page-layout">
        <aside style={{ position: "sticky", top: "90px" }} className="legal-sidebar" data-testid="sidebar-legal">
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--landing-muted)", marginBottom: "1rem" }}>
            {activeTab === "tos" ? "Terms — Sections" : "Privacy — Sections"}
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarSections.map((s) => (
              <li key={s.id} style={{ marginBottom: "2px" }}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    display: "block", fontSize: "0.83rem",
                    color: activeSection === s.id ? "var(--navy)" : "var(--landing-muted)",
                    textDecoration: "none", padding: "7px 12px", borderRadius: "3px",
                    borderLeft: activeSection === s.id ? "2px solid var(--gold)" : "2px solid transparent",
                    background: activeSection === s.id ? "var(--fog)" : "transparent",
                    fontWeight: activeSection === s.id ? 500 : 400,
                    transition: "all 0.2s", lineHeight: 1.3,
                  }}
                  data-testid={`link-sidebar-${s.id}`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div ref={contentRef}>
          {activeTab === "tos" ? <TOSContent /> : <PrivacyContent />}
        </div>
      </div>

      <footer style={{ background: "var(--navy)", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "32px 5vw", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }} className="landing-footer" data-testid="footer-terms">
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#fff" }}>
          Nexus<span style={{ color: "var(--gold)" }}>247</span>.ai
        </div>
        <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
          &copy; 2025 Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
        </p>
        <nav style={{ display: "flex", gap: "0" }}>
          <Link href="/terms" style={{ color: "rgba(200,153,58,0.7)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-terms">Terms &amp; Privacy</Link>
          <Link href="/faq" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-faq">FAQ</Link>
          <a href="mailto:support@nexus247.ai" style={{ color: "rgba(255,255,255,0.35)", textDecoration: "none", fontSize: "0.78rem", marginLeft: "1.4rem" }} data-testid="link-footer-contact">Contact</a>
        </nav>
      </footer>

      <style>{`
        @media (max-width: 780px) {
          .legal-page-layout { grid-template-columns: 1fr !important; }
          .legal-sidebar { display: none !important; }

          .landing-footer { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  );
}

function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "1.6rem", paddingBottom: "1rem", borderBottom: "1px solid var(--fog)" }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", fontWeight: 600, color: "var(--gold)", letterSpacing: "0.1em", background: "rgba(200,153,58,0.1)", border: "1px solid rgba(200,153,58,0.2)", padding: "4px 10px", borderRadius: "3px", flexShrink: 0 }}>
        {num}
      </span>
      <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.4rem", color: "var(--navy)", margin: 0 }}>{title}</h2>
    </div>
  );
}

function Callout({ children, warning }: { children: React.ReactNode; warning?: boolean }) {
  return (
    <div style={{
      background: "var(--landing-white)", border: "1px solid var(--fog)",
      borderLeft: warning ? "3px solid #B85C38" : "3px solid var(--gold)",
      borderRadius: "4px", padding: "20px 22px", margin: "1.4rem 0",
    }}>
      {children}
    </div>
  );
}

function ContactBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--navy)", borderRadius: "6px", padding: "32px 28px", marginTop: "1.5rem" }}>
      {children}
    </div>
  );
}

function DocSection({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={id} style={{ marginBottom: "52px", scrollMarginTop: "100px" }} data-testid={`section-${id}`}>
      {children}
    </div>
  );
}

function TOSContent() {
  return (
    <div className="legal-doc" style={{ maxWidth: "720px" }}>
      <Callout>
        <p style={{ marginBottom: 0 }}>
          <strong>Plain-language summary:</strong> Nexus247.ai is a document preparation platform — not a law firm, not a medical practice, and not affiliated with the VA. We help you build stronger claims. Outcomes are never guaranteed. Read the full terms below.
        </p>
      </Callout>

      <DocSection id="tos-1">
        <SectionHeading num="§ 01" title="Acceptance of Terms" />
        <p>By accessing or using the Nexus247.ai website, platform, applications, or any services we provide (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>
        <p>These Terms constitute a legally binding agreement between you ("User," "you," or "your") and Nexus247.ai ("Company," "we," "us," or "our"). Your continued use of the Service following any posted updates to these Terms constitutes acceptance of those changes.</p>
      </DocSection>

      <DocSection id="tos-2">
        <SectionHeading num="§ 02" title="What We Provide" />
        <p>Nexus247.ai provides an AI-powered document preparation and claims support platform designed to assist U.S. veterans in developing supporting evidence for VA disability claims. Our services include:</p>
        <ul>
          <li><strong>Document Generation:</strong> AI-assisted drafting of nexus letters, personal statements, and Notices of Disagreement (NODs) grounded in 38 CFR regulations.</li>
          <li><strong>Quality Scoring:</strong> Automated assessment of generated documents across multiple quality dimensions.</li>
          <li><strong>AI Claims Advisor:</strong> An AI-powered assistant that answers questions related to the VA claims process and strategies.</li>
          <li><strong>Rating Estimator:</strong> A tool that calculates estimated combined VA disability ratings using the VA's whole-person methodology.</li>
          <li><strong>Expert Review:</strong> On certain plans, facilitated access to independent licensed clinicians for review and co-signature of medical opinions.</li>
        </ul>
        <p>The Service is intended to supplement, not replace, professional legal or medical counsel. We are a technology and document preparation company.</p>
      </DocSection>

      <DocSection id="tos-3">
        <SectionHeading num="§ 03" title="Not Legal or Medical Advice" />
        <Callout warning>
          <p style={{ marginBottom: 0, color: "#6B3020" }}>
            <strong>Important:</strong> Nexus247.ai is not a law firm and does not provide legal advice. We are not a medical practice and do not provide medical diagnoses, treatment recommendations, or clinical opinions. Nothing on this platform constitutes the practice of law or medicine.
          </p>
        </Callout>
        <p>Documents generated by our platform are templates and drafts intended to be reviewed by you and, where applicable, by a licensed professional before submission. The Company does not guarantee that any generated document will result in a VA claim approval, a specific rating, or any particular outcome.</p>
        <p>Expert reviewers accessed through our platform are independent licensed clinicians who operate independently and form their own professional opinions. Their services are separate from, and not provided by, Nexus247.ai.</p>
        <p>You are encouraged to consult with an accredited VA attorney, Veterans Service Organization (VSO), or qualified healthcare provider before submitting any claim or document to the VA.</p>
      </DocSection>

      <DocSection id="tos-4">
        <SectionHeading num="§ 04" title="Eligibility" />
        <p>You must be at least 18 years of age to use the Service. By using the Service, you represent and warrant that you are 18 or older and have the legal capacity to enter into a binding agreement. The Service is intended for use by U.S. veterans, their authorized representatives, and individuals assisting veterans with VA disability claims.</p>
        <p>You may not use the Service on behalf of another person without their explicit authorization. If you are a VSO, attorney, or claims agent using the platform on behalf of a veteran client, you are responsible for ensuring your use complies with all applicable VA accreditation requirements and ethical obligations.</p>
      </DocSection>

      <DocSection id="tos-5">
        <SectionHeading num="§ 05" title="Account Registration & Security" />
        <p>To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to keep your account information updated. You are solely responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>
        <p>You agree to notify us immediately at <a href="mailto:support@nexus247.ai">support@nexus247.ai</a> of any unauthorized access to or use of your account. We are not liable for any loss or damage arising from your failure to protect your credentials.</p>
        <p>We reserve the right to suspend or terminate accounts that we reasonably believe have been compromised, are being used fraudulently, or are in violation of these Terms.</p>
      </DocSection>

      <DocSection id="tos-6">
        <SectionHeading num="§ 06" title="Payments, Pricing & Refunds" />
        <p>Nexus247.ai offers one-time purchase plans as described on our pricing page. All prices are listed in U.S. dollars. Payment is due at the time of purchase and is processed through our secure third-party payment processor.</p>
        <p><strong>Refund Policy:</strong> Because our Service involves the immediate delivery of AI-generated digital documents, all sales are generally final. We offer a refund or credit under the following limited circumstances:</p>
        <ul>
          <li>You were charged in error or experienced a billing system failure.</li>
          <li>You did not receive the deliverable you purchased due to a technical failure on our end.</li>
          <li>You contact us within 7 days of purchase and have not downloaded or submitted any generated documents.</li>
        </ul>
        <p>Refund requests must be submitted to <a href="mailto:support@nexus247.ai">support@nexus247.ai</a>. We review all requests on a case-by-case basis. Approved refunds are processed within 10 business days. We do not offer refunds based on claim outcomes.</p>
      </DocSection>

      <DocSection id="tos-7">
        <SectionHeading num="§ 07" title="Your Content & Data" />
        <p>You retain ownership of all documents, medical records, service records, and other materials you upload to the platform ("Your Content"). By uploading Your Content, you grant Nexus247.ai a limited, non-exclusive license to process, store, and use Your Content solely for the purpose of providing the Service to you.</p>
        <p>You represent and warrant that: (a) you own or have the right to submit Your Content; (b) Your Content does not violate the privacy rights, intellectual property rights, or any other rights of any third party; and (c) all information you provide is accurate to the best of your knowledge.</p>
        <p>We may use anonymized, de-identified, and aggregated data derived from Your Content to improve our AI models and Service quality. This use will never expose your personal identity or health information. See our Privacy Policy for full details.</p>
      </DocSection>

      <DocSection id="tos-8">
        <SectionHeading num="§ 08" title="Prohibited Use" />
        <p>You agree not to use the Service to:</p>
        <ul>
          <li>Submit false, fraudulent, or materially misleading information to the VA or any government agency.</li>
          <li>Misrepresent your identity, military service, or medical history.</li>
          <li>Reproduce, resell, or distribute our generated documents for commercial purposes without our written consent.</li>
          <li>Attempt to reverse-engineer, scrape, or extract our AI models, training data, or proprietary scoring systems.</li>
          <li>Use automated bots, scrapers, or scripts to access the platform without authorization.</li>
          <li>Harass, threaten, or harm any person through use of the platform.</li>
          <li>Violate any applicable federal, state, or local law or regulation, including VA regulations governing claims fraud (38 U.S.C. &sect; 5904).</li>
        </ul>
        <p>Violation of these prohibitions may result in immediate account termination and, where applicable, referral to appropriate authorities.</p>
      </DocSection>

      <DocSection id="tos-9">
        <SectionHeading num="§ 09" title="Intellectual Property" />
        <p>All content on the Nexus247.ai platform — including but not limited to the AI models, scoring algorithms, user interface design, written content, trademarks, and logos — is the exclusive intellectual property of Nexus247.ai or its licensors, protected under applicable copyright, trademark, and trade secret laws.</p>
        <p>Documents generated by the platform for your personal use are licensed to you for personal, non-commercial use in connection with your own VA disability claim. You may not resell, sublicense, or distribute generated documents as products or services.</p>
      </DocSection>

      <DocSection id="tos-10">
        <SectionHeading num="§ 10" title="Disclaimers" />
        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR ACCURACY.</p>
        <p>Nexus247.ai does not warrant that: (a) the Service will be uninterrupted, secure, or error-free; (b) any document generated will result in a VA approval or specific disability rating; (c) the information provided is complete, current, or free of errors; or (d) defects will be corrected.</p>
        <p>VA regulations, rating criteria, and agency practices change over time. While we work to keep our AI current, we make no guarantee that generated documents will reflect the most recent regulatory changes at the time of your submission.</p>
      </DocSection>

      <DocSection id="tos-11">
        <SectionHeading num="§ 11" title="Limitation of Liability" />
        <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, NEXUS247.AI AND ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF BENEFITS, LOSS OF DATA, OR LOSS OF GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.</p>
        <p>IN NO EVENT SHALL OUR TOTAL AGGREGATE LIABILITY TO YOU EXCEED THE AMOUNT YOU PAID FOR THE SERVICE IN THE THREE (3) MONTHS PRECEDING THE CLAIM.</p>
        <p>Some jurisdictions do not allow the exclusion or limitation of certain damages, so the above limitations may not apply to you in full.</p>
      </DocSection>

      <DocSection id="tos-12">
        <SectionHeading num="§ 12" title="Indemnification" />
        <p>You agree to indemnify, defend, and hold harmless Nexus247.ai and its affiliates, officers, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, or expenses (including reasonable attorneys' fees) arising out of or relating to: (a) your use of the Service; (b) your violation of these Terms; (c) any content you submit; or (d) any claim that your use of the Service caused harm to a third party.</p>
      </DocSection>

      <DocSection id="tos-13">
        <SectionHeading num="§ 13" title="Termination" />
        <p>We reserve the right to suspend or terminate your access to the Service at our sole discretion, with or without notice, for any reason including violation of these Terms. You may terminate your account at any time by contacting <a href="mailto:support@nexus247.ai">support@nexus247.ai</a>.</p>
        <p>Upon termination: (a) your right to use the Service ceases immediately; (b) we may delete your account data subject to our data retention policy and legal obligations; and (c) provisions of these Terms that by their nature should survive termination will survive, including Sections 9, 10, 11, and 12.</p>
      </DocSection>

      <DocSection id="tos-14">
        <SectionHeading num="§ 14" title="Governing Law & Dispute Resolution" />
        <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions. Any dispute arising under these Terms shall first be subject to good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration under the rules of the American Arbitration Association.</p>
        <p>You waive any right to bring claims as a class action or in any representative capacity. Nothing in this section prevents either party from seeking injunctive or other equitable relief in a court of competent jurisdiction.</p>
      </DocSection>

      <DocSection id="tos-15">
        <SectionHeading num="§ 15" title="Changes to Terms" />
        <p>We reserve the right to update or modify these Terms at any time. When we make material changes, we will post the updated Terms on this page with a revised "Last Updated" date and, where appropriate, notify you by email or in-platform notice. Your continued use of the Service after such changes constitutes your acceptance of the updated Terms.</p>
        <p>We encourage you to review these Terms periodically. If you do not agree to a material change, your sole remedy is to discontinue use of the Service.</p>
      </DocSection>

      <DocSection id="tos-16">
        <SectionHeading num="§ 16" title="Contact Us" />
        <ContactBox>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#fff", marginBottom: "0.8rem" }}>Questions about these Terms?</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>We're here to help. Reach out any time.</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>Email: <a href="mailto:legal@nexus247.ai" style={{ color: "var(--gold-lt)" }}>legal@nexus247.ai</a></p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>Support: <a href="mailto:support@nexus247.ai" style={{ color: "var(--gold-lt)" }}>support@nexus247.ai</a></p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: 0 }}>Website: <a href="https://nexus247.ai" style={{ color: "var(--gold-lt)" }}>nexus247.ai</a></p>
        </ContactBox>
      </DocSection>
    </div>
  );
}

function PrivacyContent() {
  return (
    <div className="legal-doc" style={{ maxWidth: "720px" }}>
      <Callout>
        <p style={{ marginBottom: 0 }}>
          <strong>Plain-language summary:</strong> We collect only what we need to provide the Service. We do not sell your data. Your health information is protected under HIPAA. You can request deletion of your data at any time.
        </p>
      </Callout>

      <DocSection id="pp-1">
        <SectionHeading num="§ 01" title="Overview & Our Commitment" />
        <p>Nexus247.ai ("we," "us," or "our") is committed to protecting the privacy and security of the information entrusted to us by veterans and their families. This Privacy Policy explains how we collect, use, store, share, and protect your personal information when you use the Nexus247.ai platform and services.</p>
        <p>Because our service involves the processing of sensitive health information and military service records, we take privacy obligations with the highest seriousness. We comply with the Health Insurance Portability and Accountability Act (HIPAA) and applicable federal and state privacy laws.</p>
      </DocSection>

      <DocSection id="pp-2">
        <SectionHeading num="§ 02" title="Information We Collect" />
        <p>We collect the following categories of information:</p>
        <p><strong>Account Information:</strong> Name, email address, username, and password when you create an account.</p>
        <p><strong>Payment Information:</strong> Billing name, address, and payment card details. Card data is processed and stored by our PCI-compliant payment processor — we do not store raw card numbers.</p>
        <p><strong>Health &amp; Medical Information (PHI):</strong> Medical records, diagnoses, treatment history, and health conditions you upload or describe while using the Service. This is Protected Health Information (PHI) under HIPAA.</p>
        <p><strong>Military Service Information:</strong> DD-214, service records, MOS/duty descriptions, deployment records, and related documentation you provide.</p>
        <p><strong>Usage Data:</strong> IP address, browser type, device information, pages visited, features used, and timestamps — collected automatically via standard server logs and analytics.</p>
        <p><strong>Communications:</strong> Any messages, support requests, or feedback you send to us.</p>
      </DocSection>

      <DocSection id="pp-3">
        <SectionHeading num="§ 03" title="How We Use Your Information" />
        <p>We use your information solely for the following purposes:</p>
        <ul>
          <li><strong>Service Delivery:</strong> To generate documents, score quality, power the AI Claims Advisor, and calculate ratings.</li>
          <li><strong>Account Management:</strong> To authenticate you, manage your account, and communicate regarding your service.</li>
          <li><strong>Payment Processing:</strong> To process your purchase and issue receipts.</li>
          <li><strong>Service Improvement:</strong> Using anonymized, de-identified aggregated data to improve AI model accuracy and platform quality. No PHI is used in identifiable form for this purpose.</li>
          <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal process.</li>
          <li><strong>Security:</strong> To detect and prevent fraud, unauthorized access, and abuse.</li>
        </ul>
        <p>We do not use your health information for marketing, advertising, or any purpose unrelated to providing the Service.</p>
      </DocSection>

      <DocSection id="pp-4">
        <SectionHeading num="§ 04" title="HIPAA & Protected Health Information" />
        <Callout>
          <p style={{ marginBottom: 0 }}>
            <strong>Nexus247.ai operates as a HIPAA Business Associate</strong> with respect to Protected Health Information (PHI) you provide. We maintain administrative, physical, and technical safeguards required under the HIPAA Security Rule.
          </p>
        </Callout>
        <p>Your PHI is used exclusively to provide the specific services you requested. We do not disclose your PHI to third parties except as described in Section 5 below or as required by law.</p>
        <p>Under HIPAA, you have the right to: (a) access and receive a copy of your PHI held by us; (b) request correction of inaccurate PHI; (c) request an accounting of disclosures; and (d) file a complaint with the U.S. Department of Health and Human Services if you believe your rights have been violated.</p>
        <p>To exercise any HIPAA rights, contact us at <a href="mailto:privacy@nexus247.ai">privacy@nexus247.ai</a>.</p>
      </DocSection>

      <DocSection id="pp-5">
        <SectionHeading num="§ 05" title="Sharing & Disclosure" />
        <p>We do not sell, rent, or trade your personal information or health data to any third party. We share information only in these limited circumstances:</p>
        <ul>
          <li><strong>Service Providers:</strong> Trusted vendors who help us operate the platform (cloud hosting, payment processing, email delivery) under strict data processing agreements. They may only use your data to perform services for us.</li>
          <li><strong>Expert Reviewers:</strong> If you purchase an expert review, your relevant records are shared with the independent licensed clinician you engage. This disclosure is at your direction.</li>
          <li><strong>Legal Requirements:</strong> If required by law, court order, or valid government request — we will notify you to the extent permitted by law before complying.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your information may be transferred. You will be notified of any such transfer and your rights with respect to your data.</li>
          <li><strong>Your Consent:</strong> For any other purpose with your explicit consent.</li>
        </ul>
        <p><strong>We will never share your data with the VA, Department of Defense, or any government agency</strong> unless required by valid legal process — and you will receive notice where permitted.</p>
      </DocSection>

      <DocSection id="pp-6">
        <SectionHeading num="§ 06" title="Data Security" />
        <p>We implement industry-standard technical and organizational security measures to protect your information, including:</p>
        <ul>
          <li>TLS/SSL encryption for all data transmitted between your device and our servers.</li>
          <li>AES-256 encryption for data stored at rest, including all uploaded documents and generated letters.</li>
          <li>Role-based access controls — only personnel with a need-to-know basis can access personal data.</li>
          <li>Regular security audits, vulnerability assessments, and penetration testing.</li>
          <li>Multi-factor authentication available for user accounts.</li>
          <li>Incident response procedures compliant with HIPAA Breach Notification requirements.</li>
        </ul>
        <p>No system is 100% secure. In the event of a data breach affecting your PHI, we will notify you as required by HIPAA (within 60 days of discovery) and applicable state law.</p>
      </DocSection>

      <DocSection id="pp-7">
        <SectionHeading num="§ 07" title="Data Retention" />
        <p>We retain your account information and generated documents for as long as your account is active or as needed to provide the Service. After account deletion, we retain records for a minimum of 6 years as required under HIPAA's record-keeping requirements, after which they are securely destroyed.</p>
        <p>Usage data and analytics are retained in identifiable form for up to 24 months, after which they are anonymized or deleted. Anonymized, aggregated data may be retained indefinitely for product improvement purposes.</p>
        <p>If you request account deletion before the end of any mandatory retention period, we will restrict processing of your data to only what is legally required.</p>
      </DocSection>

      <DocSection id="pp-8">
        <SectionHeading num="§ 08" title="Your Rights" />
        <p>Depending on your state of residence, you may have the following rights regarding your personal information:</p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> Request that inaccurate information be corrected.</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information, subject to legal retention obligations.</li>
          <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Opt-out:</strong> Opt out of any non-essential data processing (we don't conduct any, but the right remains).</li>
          <li><strong>Non-discrimination:</strong> We will not discriminate against you for exercising any privacy rights.</li>
        </ul>
        <p>California residents have additional rights under the CCPA/CPRA. Virginia residents have rights under VCDPA. To exercise any rights, contact <a href="mailto:privacy@nexus247.ai">privacy@nexus247.ai</a>. We respond to all verified requests within 45 days.</p>
      </DocSection>

      <DocSection id="pp-9">
        <SectionHeading num="§ 09" title="Cookies & Tracking" />
        <p>We use a minimal set of cookies necessary to operate the platform:</p>
        <ul>
          <li><strong>Essential cookies:</strong> Required for authentication, session management, and security. These cannot be disabled without disrupting the Service.</li>
          <li><strong>Analytics cookies:</strong> Anonymous usage analytics to understand how features are used. These do not track you across other websites and do not contain PHI.</li>
        </ul>
        <p>We do not use third-party advertising cookies, retargeting pixels, or behavioral tracking technologies. We do not allow advertising networks to collect data through our platform. You can manage cookie preferences through your browser settings, though disabling essential cookies will affect functionality.</p>
      </DocSection>

      <DocSection id="pp-10">
        <SectionHeading num="§ 10" title="Children's Privacy" />
        <p>The Service is not directed to individuals under 18 years of age. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal information, we will promptly delete it. If you believe a minor has provided information to us, please contact <a href="mailto:privacy@nexus247.ai">privacy@nexus247.ai</a>.</p>
      </DocSection>

      <DocSection id="pp-11">
        <SectionHeading num="§ 11" title="Veterans & Sensitive Data — Our Pledge" />
        <Callout>
          <p style={{ marginBottom: 0 }}>
            We recognize that veterans entrust us with some of the most sensitive information they possess — medical histories, mental health records, trauma disclosures, and service records. This trust is not taken lightly.
          </p>
        </Callout>
        <p>We make the following specific commitments to the veteran community:</p>
        <ul>
          <li>We will never sell, license, or monetize your health information or service records to any third party, including insurance companies, pharmaceutical companies, data brokers, or employers.</li>
          <li>Mental health disclosures — including PTSD, MST, and TBI information — receive the highest level of access restriction within our systems.</li>
          <li>We will never voluntarily share your information with government agencies, including the VA or Department of Defense, without your explicit consent or a valid legal requirement.</li>
          <li>We will maintain HIPAA compliance for as long as we process health information.</li>
          <li>If we are ever acquired or undergo a material change in business, we will notify users and honor all existing privacy commitments or provide users the opportunity to delete their data before any transfer.</li>
        </ul>
      </DocSection>

      <DocSection id="pp-12">
        <SectionHeading num="§ 12" title="Changes to This Policy" />
        <p>We may update this Privacy Policy from time to time. When we make material changes, we will post the revised policy with an updated effective date and notify you via email or in-platform notification at least 30 days before the changes take effect for existing users.</p>
        <p>For changes to how we handle PHI, we will provide notice as required under HIPAA. Your continued use of the Service after the effective date of any update constitutes your acceptance of the revised policy.</p>
      </DocSection>

      <DocSection id="pp-13">
        <SectionHeading num="§ 13" title="Contact & Privacy Requests" />
        <ContactBox>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.2rem", color: "#fff", marginBottom: "0.8rem" }}>Privacy Officer</h3>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>For HIPAA requests, data deletion, or any privacy question:</p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>Email: <a href="mailto:privacy@nexus247.ai" style={{ color: "var(--gold-lt)" }}>privacy@nexus247.ai</a></p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "0.5rem" }}>General support: <a href="mailto:support@nexus247.ai" style={{ color: "var(--gold-lt)" }}>support@nexus247.ai</a></p>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: 0 }}>To file a HIPAA complaint with HHS: <a href="https://www.hhs.gov/hipaa/filing-a-complaint" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gold-lt)" }}>hhs.gov/hipaa/filing-a-complaint</a></p>
        </ContactBox>
      </DocSection>
    </div>
  );
}

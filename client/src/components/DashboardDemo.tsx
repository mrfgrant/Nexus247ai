import { useState, useEffect, useRef } from "react";

const SCREENS = [
  {
    id: "dashboard",
    nav: "Dashboard",
    icon: "⊞",
    title: "Your VA Claims Command Center",
    sub: "Everything at a glance — rating, documents, and conditions",
  },
  {
    id: "intake",
    nav: "Intake Profile",
    icon: "👤",
    title: "Build Your Veteran Profile",
    sub: "Military service history feeds every letter automatically",
  },
  {
    id: "conditions",
    nav: "My Conditions",
    icon: "＋",
    title: "Track Every Condition",
    sub: "ICD codes, current ratings, and service incidents in one place",
  },
  {
    id: "generate",
    nav: "Generate Letter",
    icon: "📄",
    title: "Generate CFR-Grounded Letters",
    sub: "AI-drafted nexus letters with RPA quality scoring",
  },
  {
    id: "cp",
    nav: "C&P Exam Prep",
    icon: "📋",
    title: "Ace Your C&P Exam",
    sub: "Personalized prep guides built directly from your file",
    pro: true,
  },
  {
    id: "documents",
    nav: "My Documents",
    icon: "🗂",
    title: "All Your Letters, Scored",
    sub: "RPA scores on every document before you submit",
  },
  {
    id: "advisor",
    nav: "Ask VA Questions",
    icon: "💬",
    title: "Expert Claims Guidance On-Demand",
    sub: "Ask anything about CFR regulations and filing strategy",
  },
  {
    id: "rating",
    nav: "Rating Estimator",
    icon: "📊",
    title: "Know Exactly What You're Worth",
    sub: "Combined rating with monthly benefit projections",
  },
  {
    id: "analyze",
    nav: "Analyze Decision Letter",
    icon: "⚖",
    title: "Find the Errors in Your Decision",
    sub: "AI identifies rater errors and recommends appeal paths",
  },
];

function ScreenDashboard() {
  return (
    <div style={{ padding: "22px 24px", overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", letterSpacing: "-0.02em" }}>Welcome back, SPC</div>
          <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>Your VA claims command center</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <span style={{ background: "#d4882a", color: "#fff", fontSize: 9, padding: "3px 8px", borderRadius: 4, fontWeight: 700 }}>⊙ PRO TIER</span>
          <span style={{ background: "#f3f4f6", color: "#374151", fontSize: 9, padding: "3px 8px", borderRadius: 4, fontWeight: 500 }}>Trial · 1d left</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Rating", val: "80%", note: "Est. $2,102/mo", color: "#1a3a8f" },
          { label: "Documents", val: "2/50", note: "This month", color: "#1a1f36" },
          { label: "Conditions", val: "3", note: "Tracked", color: "#1a1f36" },
        ].map((s) => (
          <div key={s.label} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "13px 14px" }}>
            <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 5 }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 3 }}>{s.note}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 12 }}>
        <div style={{ background: "#1a3a8f", color: "#fff", borderRadius: 6, padding: "9px", fontSize: 11, fontWeight: 600, textAlign: "center" }}>📄 Generate</div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "9px", fontSize: 11, color: "#374151", textAlign: "center" }}>💬 Chat</div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 6, padding: "9px", fontSize: 11, color: "#374151", textAlign: "center" }}>+ Condition</div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "10px 13px", display: "flex", gap: 8, fontSize: 11, color: "#374151", marginBottom: 14 }}>
        <span>💡</span><span><strong>Tip:</strong> 38 CFR § 3.310: A secondary condition caused by a service-connected disability can also be rated.</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1f36" }}>Recent Documents</div>
        <div style={{ fontSize: 11, color: "#1a3a8f" }}>View All →</div>
      </div>
      {[{ name: "Nexus Letter - Tinnitus", meta: "3/4/2026 · 501 words", score: 81 }, { name: "Nexus Letter - General", meta: "3/4/2026 · 547 words", score: 84 }].map((d) => (
        <div key={d.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "10px 13px", display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: "#1a1f36" }}>{d.name}</div>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>{d.meta}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>{d.score}</div>
            <div style={{ fontSize: 9, color: "#9ca3af" }}>Score</div>
          </div>
          <div style={{ fontSize: 9, background: "#f3f4f6", color: "#6b7280", padding: "2px 7px", borderRadius: 4 }}>draft</div>
        </div>
      ))}
    </div>
  );
}

function ScreenIntake() {
  return (
    <div style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>Veteran Profile Intake</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>Complete your profile to generate accurate claim documents.</div>
      <div style={{ display: "flex", gap: 5, marginBottom: 18, flexWrap: "wrap" }}>
        {["1 Military Service", "2 Deployments & Exposures", "3 VA Info", "4 Supporting Documents", "5 Review & Save"].map((s, i) => (
          <div key={s} style={{ padding: "5px 10px", borderRadius: 20, fontSize: 10, fontWeight: 500, border: "1px solid", borderColor: i === 0 ? "#1a3a8f" : "#e5e7eb", background: i === 0 ? "#1a3a8f" : "#fff", color: i === 0 ? "#fff" : "#9ca3af" }}>{s}</div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1f36", marginBottom: 16 }}>Military Service</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[["Branch of Service", "Army"], ["Rank", "E-4"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", background: "#fff", display: "flex", justifyContent: "space-between" }}>{val}{label === "Branch of Service" && <span style={{ color: "#9ca3af", fontSize: 9 }}>▾</span>}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 4 }}>MOS / Rate</div>
          <div style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36" }}>94 B</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[["Service Start Date", "10/25/1988"], ["Service End Date", "10/25/1992"]].map(([label, val]) => (
            <div key={label}>
              <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36" }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 4 }}>Discharge Type</div>
          <div style={{ padding: "7px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", display: "flex", justifyContent: "space-between" }}>Honorable <span style={{ color: "#9ca3af", fontSize: 9 }}>▾</span></div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ padding: "7px 14px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#374151" }}>‹ Previous</div>
          <div style={{ padding: "7px 18px", background: "#1a3a8f", borderRadius: 6, fontSize: 11, color: "#fff", fontWeight: 600 }}>Next ›</div>
        </div>
      </div>
    </div>
  );
}

function ScreenConditions() {
  return (
    <div style={{ padding: "22px 24px", overflowY: "auto", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36" }}>Conditions & Incidents</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>Track your service-connected conditions and linking incidents.</div>
        </div>
        <div style={{ background: "#1a3a8f", color: "#fff", fontSize: 11, padding: "7px 12px", borderRadius: 6, fontWeight: 600 }}>+ Add Condition</div>
      </div>
      {[
        { name: "Tinnitus", icd: "H93.19", dc: "6260", current: "10%", claimed: "10%", diag: "2020-07-01" },
        { name: "Chronic Kidney Disease", icd: "N18.9", dc: "7502", current: "30%", claimed: "100%", diag: "2025-10-20" },
        { name: "Major Depressive Disorder", icd: "F33.1", dc: "9434", current: "70%", claimed: "100%", diag: "2025-10-20" },
      ].map((c) => (
        <div key={c.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f36", flex: 1 }}>{c.name}</div>
            <span style={{ fontSize: 12, color: "#9ca3af", marginRight: 8 }}>✎</span>
            <span style={{ fontSize: 12, color: "#9ca3af" }}>🗑</span>
          </div>
          <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: "1px solid #e5e7eb", color: "#374151" }}>ICD-10: {c.icd}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: "1px solid #e5e7eb", color: "#374151" }}>DC: {c.dc}</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#1a3a8f", color: "#fff" }}>Service Connected</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 10 }}>
            {[["Current", c.current], ["Claimed", c.claimed], ["Diagnosed", c.diag], ["Physician", "N/A"]].map(([l, v]) => (
              <div key={l}>
                <div style={{ fontSize: 9, color: "#9ca3af" }}>{l}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1f36" }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 8, display: "flex", justifyContent: "space-between", fontSize: 10 }}>
            <span style={{ color: "#d97706" }}>⚠ Service Incidents (0)</span>
            <span style={{ color: "#1a3a8f" }}>+ Add Incident</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenGenerate() {
  return (
    <div style={{ padding: "22px 24px" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>Generate Document</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 18 }}>Create CFR-grounded VA claims documents with AI quality scoring.</div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#1a1f36", marginBottom: 16 }}>Document Configuration</div>
        <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 5 }}>Document Type</div>
        <div style={{ padding: "8px 11px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", display: "flex", justifyContent: "space-between", marginBottom: 4 }}>Nexus Letter <span style={{ color: "#9ca3af", fontSize: 9 }}>▾</span></div>
        <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 14 }}>IMO establishing service connection with CFR citations</div>
        <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 5 }}>Condition (Optional)</div>
        <div style={{ padding: "8px 11px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", display: "flex", justifyContent: "space-between", marginBottom: 14 }}>Chronic Kidney Disease (DC 7502) <span style={{ color: "#9ca3af", fontSize: 9 }}>▾</span></div>
        <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 5 }}>Additional Context</div>
        <div style={{ padding: "10px 11px", border: "2px solid #1a3a8f", borderRadius: 6, fontSize: 11, color: "#1a1f36", minHeight: 70, marginBottom: 16, lineHeight: 1.5 }}>
          this may be partly due to taking ibuprofen for gout pain<span style={{ borderRight: "2px solid #1a3a8f", animation: "blink 1s infinite", marginLeft: 1 }}>&nbsp;</span>
        </div>
        <div style={{ background: "#1a3a8f", color: "#fff", borderRadius: 7, padding: "11px", fontSize: 13, fontWeight: 600, textAlign: "center" }}>📄 Generate Document</div>
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  );
}

function ScreenCP() {
  return (
    <div style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36" }}>C&P Exam Prep</div>
        <span style={{ background: "#d4882a", color: "#fff", fontSize: 9, padding: "3px 8px", borderRadius: 4, fontWeight: 700 }}>Pro</span>
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 16 }}>Get a personalized preparation guide and printable cheat sheet for your C&P exam.</div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18, marginBottom: 12 }}>
        <div style={{ fontSize: 10, color: "#374151", fontWeight: 500, marginBottom: 6 }}>Select Condition for Exam Prep</div>
        <div style={{ padding: "8px 11px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", display: "flex", justifyContent: "space-between", marginBottom: 14 }}>Major Depressive Disorder (DC 9434) — 70% <span style={{ color: "#9ca3af", fontSize: 9 }}>▾</span></div>
        <div style={{ background: "#6b7ea8", color: "#fff", borderRadius: 6, padding: "10px", fontSize: 12, fontWeight: 600, textAlign: "center" }}>📋 Generating Prep Guide...</div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 18 }}>
        <div style={{ fontSize: 10, color: "#9ca3af", marginBottom: 12 }}>This typically takes 15-30 seconds.</div>
        {[
          { done: true, text: "Reviewing your condition's diagnostic criteria..." },
          { done: true, text: "Analyzing DBQ scoring requirements..." },
          { done: true, text: "Checking your medical records and analysis..." },
          { done: true, text: "Building worst-day symptom descriptions..." },
          { done: false, text: "Preparing post-exam documentation template..." },
        ].map((item) => (
          <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, fontSize: 11, color: item.done ? "#16a34a" : "#1a1f36" }}>
            {item.done
              ? <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#dcfce7", border: "2px solid #16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: "#16a34a", flexShrink: 0 }}>✓</div>
              : <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #d1d5db", borderTopColor: "#1a3a8f", flexShrink: 0, animation: "spin 1s linear infinite" }} />
            }
            {item.text}
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ScreenDocuments() {
  return (
    <div style={{ padding: "22px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36" }}>My Documents</div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>2 documents generated</div>
        </div>
        <div style={{ padding: "6px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#374151", display: "flex", alignItems: "center", gap: 5 }}>All Types <span style={{ fontSize: 9 }}>▾</span></div>
      </div>
      {[{ name: "Nexus Letter - Tinnitus", words: "501 words", score: 81 }, { name: "Nexus Letter - General", words: "547 words", score: 84 }].map((d) => (
        <div key={d.name} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", marginBottom: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1f36", marginBottom: 5 }}>{d.name}</div>
            <div style={{ display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: "1px solid #e5e7eb", color: "#374151" }}>nexus letter</span>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#fff7ed", color: "#d97706", border: "1px solid #fed7aa" }}>Trial</span>
              <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280" }}>draft</span>
              <span style={{ fontSize: 9, color: "#9ca3af" }}>📅 3/4/2026 · {d.words}</span>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#16a34a", lineHeight: 1 }}>{d.score}</div>
            <div style={{ fontSize: 8, color: "#9ca3af" }}>RPA Score</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>👁 🖨 ⬇ 🗑</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ScreenAdvisor() {
  return (
    <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>AI Claims Advisor</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 10 }}>Get expert guidance on VA claims, CFR regulations, and filing strategy.</div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "9px 12px", display: "flex", alignItems: "center", gap: 7, marginBottom: 12, flexWrap: "wrap", fontSize: 10 }}>
        <span>🛡</span><span style={{ color: "#6b7280" }}>Your advisor has access to:</span>
        {["📄 1 medical record", "📄 1 decision letter", "📊 1 analysis result"].map((c) => (
          <span key={c} style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: 4, padding: "2px 7px", fontSize: 9, color: "#374151" }}>{c}</span>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
        <div style={{ alignSelf: "flex-end", background: "#1a3a8f", color: "#fff", borderRadius: "10px 10px 2px 10px", padding: "9px 13px", fontSize: 11, maxWidth: "75%", lineHeight: 1.45 }}>
          What are the strongest arguments for PTSD service connection?
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>2:18:34 PM</div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px 10px 10px 2px", padding: "11px 13px", fontSize: 10, maxWidth: "92%", color: "#1a1f36", lineHeight: 1.6 }}>
          <strong style={{ fontSize: 11 }}>Core Legal Requirements</strong><br />
          <strong>1. Credible Supporting Evidence</strong>
          <ul style={{ paddingLeft: 14, margin: "3px 0 6px" }}>
            <li>Buddy statements from fellow service members</li>
            <li>Unit records, morning reports, or operational summaries</li>
          </ul>
          <strong>2. Medical Nexus Opinion</strong>
          <ul style={{ paddingLeft: 14, margin: "3px 0 6px" }}>
            <li>Qualified mental health professional linking PTSD to stressor</li>
            <li>Language: "at least as likely as not" (50%+ probability)</li>
          </ul>
          <strong>3. Current PTSD Diagnosis</strong>
          <ul style={{ paddingLeft: 14, margin: "3px 0" }}>
            <li>Diagnosis must meet DSM-5 criteria from a qualified examiner</li>
          </ul>
        </div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ fontSize: 11, color: "#9ca3af", flex: 1 }}>Ask about VA claims, CFR regulations, appeals...</div>
        <div style={{ width: 28, height: 28, background: "#1a3a8f", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>➤</div>
      </div>
      <div style={{ fontSize: 9, color: "#9ca3af", textAlign: "center", marginTop: 5, fontStyle: "italic" }}>This is general guidance, not legal advice. Consult an accredited VA claims agent or attorney.</div>
    </div>
  );
}

function ScreenRating() {
  return (
    <div style={{ padding: "22px 24px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>Combined Rating Estimator</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>Calculate your VA combined disability rating using the official whole-person method.</div>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 7, padding: "9px 13px", fontSize: 10, color: "#1e40af", marginBottom: 12, display: "flex", gap: 7, lineHeight: 1.5 }}>
        <span>ℹ</span><span>The VA uses a "whole person" method — disabilities are not simply added together. Each additional condition is applied to the remaining healthy percentage.</span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: 16, marginBottom: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600, color: "#1a1f36", marginBottom: 12 }}>
          Conditions & Ratings
          <div style={{ fontSize: 10, padding: "3px 9px", border: "1px solid #d1d5db", borderRadius: 5, color: "#374151", fontWeight: 400 }}>Load from Profile</div>
        </div>
        {[["Tinnitus", "10%"], ["Chronic Kidney Disease", "30%"], ["Major Depressive Disorder", "60%"]].map(([name, pct]) => (
          <div key={name} style={{ display: "grid", gridTemplateColumns: "1fr 90px 20px", gap: 8, alignItems: "center", marginBottom: 7 }}>
            <div style={{ padding: "6px 10px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36" }}>{name}</div>
            <div style={{ padding: "6px 8px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#1a1f36", display: "flex", justifyContent: "space-between" }}>{pct} <span style={{ fontSize: 8 }}>▾</span></div>
            <div style={{ fontSize: 13, color: "#9ca3af" }}>🗑</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
          <div style={{ padding: "7px 12px", border: "1px solid #d1d5db", borderRadius: 6, fontSize: 11, color: "#374151" }}>+ Add Condition</div>
          <div style={{ padding: "7px 14px", background: "#1a3a8f", borderRadius: 6, fontSize: 11, color: "#fff", fontWeight: 600 }}>⊞ Calculate</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 10 }}>
        {[["Combined Rating", "80%", "#1a3a8f"], ["Estimated Monthly", "$2,102", "#16a34a"], ["Annual Benefit", "$25,224", "#16a34a"]].map(([label, val, color]) => (
          <div key={label} style={{ padding: "12px 14px", borderRight: "1px solid #e5e7eb" }}>
            <div style={{ fontSize: 9, color: "#9ca3af", marginBottom: 3 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color, letterSpacing: "-0.02em" }}>{val}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "11px 13px", display: "flex", alignItems: "center", gap: 9, fontSize: 11, color: "#374151", marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>📈</span><div><strong>Next Rating Tier: 90%</strong> — Monthly increase potential: +$260/mo ($2,362/mo total)</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
        {[["✅ TDIU Eligibility", "You may be eligible for Total Disability based on Individual Unemployability (38 CFR § 4.16)."], ["ℹ SMC-S (Housebound)", "Requires 100% schedular rating plus an additional disability rated 60%+ (38 CFR § 3.350)."]].map(([title, text]) => (
          <div key={title as string} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "11px 13px" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1f36", marginBottom: 3 }}>{title}</div>
            <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5 }}>{text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenAnalyze() {
  return (
    <div style={{ padding: "22px 24px", overflowY: "auto", height: "100%" }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#1a1f36", marginBottom: 2 }}>Analyze Decision Letter</div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>Upload your VA decision letter and get an expert AI analysis with specific next steps, identified errors, and recommended appeal paths.</div>
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 7, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8, marginBottom: 12, fontSize: 11 }}>
        <span style={{ background: "#1a3a8f", color: "#fff", fontSize: 9, padding: "2px 7px", borderRadius: 4, fontWeight: 700 }}>Pro</span>
        <span style={{ color: "#374151" }}>1/10 analyses used this month</span>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ flex: 1, padding: "9px", fontSize: 11, fontWeight: 600, color: "#1a3a8f", textAlign: "center", background: "#fff" }}>⬆ Upload PDF</div>
          <div style={{ flex: 1, padding: "9px", fontSize: 11, color: "#6b7280", textAlign: "center", background: "#f9fafb", borderLeft: "1px solid #e5e7eb" }}>📋 Paste Text</div>
        </div>
        <div style={{ margin: 14, padding: "20px", border: "2px dashed #e5e7eb", borderRadius: 6, textAlign: "center" }}>
          <div style={{ fontSize: 18, color: "#9ca3af", marginBottom: 7 }}>⬆</div>
          <div style={{ fontSize: 12, color: "#374151", fontWeight: 500, marginBottom: 2 }}>Click to upload your decision letter</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>PDF or text file, up to 10MB</div>
        </div>
        <div style={{ margin: "0 14px 14px", background: "#6b7ea8", color: "#fff", borderRadius: 6, padding: "10px", fontSize: 11, fontWeight: 600, textAlign: "center" }}>⚖ Analyze Decision Letter (9 remaining)</div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, padding: "14px 16px", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#1a1f36", marginBottom: 12 }}>🕐 Past Analyses</div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: "10px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
            <span style={{ fontSize: 13 }}>📄</span>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#1a1f36", flex: 1 }}>ClaimLetter-2025-12-31.pdf</div>
            <div style={{ fontSize: 9, color: "#9ca3af" }}>3/4/2026 05:52 PM</div>
            <div style={{ fontSize: 11, color: "#1a3a8f", fontWeight: 500 }}>👁 View</div>
          </div>
          <div style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.5, marginBottom: 7 }}>VA denied service connection for bilateral gout as secondary to hypertension, reasoning that the veteran is not service-connected for hypertension. The rater...</div>
          <div style={{ display: "flex", gap: 5 }}>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#f3f4f6", color: "#374151" }}>2 conditions</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#fef2f2", color: "#dc2626" }}>6 errors</span>
            <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0" }}>⟳ Cross-Referenced</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCREEN_COMPONENTS = [
  ScreenDashboard, ScreenIntake, ScreenConditions, ScreenGenerate,
  ScreenCP, ScreenDocuments, ScreenAdvisor, ScreenRating, ScreenAnalyze,
];

export default function DashboardDemo() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    if (idx === current || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        setAnimating(true);
        setTimeout(() => setAnimating(false), 300);
        return (prev + 1) % SCREENS.length;
      });
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const ActiveScreen = SCREEN_COMPONENTS[current];

  return (
    <div style={{ width: "100%", maxWidth: 920, margin: "0 auto" }}>
      {/* Caption */}
      <div style={{ textAlign: "center", marginBottom: 18, minHeight: 52 }}>
        <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", fontWeight: 600, marginBottom: 5 }}>
          Live Platform Preview
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--navy)", letterSpacing: "-0.02em", transition: "opacity 0.3s", opacity: animating ? 0 : 1 }}>
          {SCREENS[current].title}
        </div>
        <div style={{ fontSize: 12, color: "var(--landing-muted)", transition: "opacity 0.3s", opacity: animating ? 0 : 1 }}>
          {SCREENS[current].sub}
        </div>
      </div>

      {/* Browser */}
      <div style={{ background: "#1e2535", borderRadius: 12, overflow: "hidden", boxShadow: "0 24px 64px rgba(11,28,46,0.22), 0 0 0 1px rgba(255,255,255,0.05)" }}>
        {/* Browser bar */}
        <div style={{ background: "#161d2e", padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 5, padding: "4px 12px", fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
            app.nexus247.ai
          </div>
        </div>

        {/* App shell */}
        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", height: 520 }}>
          {/* Sidebar */}
          <div style={{ background: "#1a2236", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 9, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #d4882a, #1a3a6b)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#fff" }}>N</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Nexus247</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>.ai</div>
              </div>
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", padding: "12px 16px 5px", fontWeight: 600 }}>Claims Tools</div>
            <div style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
              {SCREENS.map((s, i) => (
                <div
                  key={s.id}
                  onClick={() => { goTo(i); startTimer(); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "6px 9px",
                    borderRadius: 6, fontSize: 11, marginBottom: 1, cursor: "pointer",
                    transition: "all 0.2s",
                    background: i === current ? "rgba(255,255,255,0.09)" : "transparent",
                    color: i === current ? "#fff" : "rgba(255,255,255,0.42)",
                  }}
                >
                  <span style={{ fontSize: 11, width: 14, textAlign: "center" }}>{s.icon}</span>
                  <span style={{ flex: 1 }}>{s.nav}</span>
                  {s.pro && <span style={{ fontSize: 7, background: "#d4882a", color: "#fff", padding: "1px 4px", borderRadius: 3, fontWeight: 700 }}>Pro</span>}
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "8px" }}>
              {["💲 Pricing", "❓ Get Help", "⚙ Settings"].map((item) => (
                <div key={item} style={{ padding: "5px 9px", fontSize: 10, color: "rgba(255,255,255,0.25)", borderRadius: 5 }}>{item}</div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div style={{ background: "#f4f6f9", overflow: "hidden", position: "relative" }}>
            <div style={{
              position: "absolute", inset: 0,
              opacity: animating ? 0 : 1,
              transform: animating ? "translateX(12px)" : "translateX(0)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              overflowY: "auto",
            }}>
              <ActiveScreen />
            </div>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
        {SCREENS.map((_, i) => (
          <div
            key={i}
            onClick={() => { goTo(i); startTimer(); }}
            style={{
              height: 6, borderRadius: 3, cursor: "pointer", transition: "all 0.3s",
              width: i === current ? 20 : 6,
              background: i === current ? "var(--gold)" : "rgba(11,28,46,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

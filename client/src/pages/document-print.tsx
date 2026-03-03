import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import type { Document } from "@shared/schema";

const DOC_TYPE_LABELS: Record<string, string> = {
  nexus_letter: "Nexus Letter",
  personal_statement: "Personal Statement",
  buddy_letter: "Buddy Letter",
  nod: "Notice of Disagreement",
  secondary_condition: "Secondary Condition Letter",
  increase_claim: "Claim for Increase",
  aod_motion: "Advancement on Docket Motion",
  good_cause_letter: "Good Cause Letter",
};

export default function DocumentPrint() {
  const [, params] = useRoute("/documents/:id/print");
  const docId = params?.id;

  const { data: doc, isLoading } = useQuery<Document>({
    queryKey: ["/api/documents", docId],
    queryFn: async () => {
      const res = await fetch(`/api/documents/${docId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load document");
      return res.json();
    },
    enabled: !!docId,
  });

  useEffect(() => {
    if (doc && !isLoading) {
      const timer = setTimeout(() => window.print(), 600);
      return () => clearTimeout(timer);
    }
  }, [doc, isLoading]);

  if (isLoading || !doc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading document...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 1in; size: letter; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .print-body { font-size: 12pt; line-height: 1.6; color: #000; }
          .print-header { border-bottom: 2px solid #1a3a6b; padding-bottom: 12pt; margin-bottom: 20pt; }
          .print-footer { border-top: 1px solid #ccc; padding-top: 8pt; margin-top: 30pt; page-break-inside: avoid; }
        }
        @media screen {
          .print-page { max-width: 8.5in; margin: 0 auto; padding: 1in; background: white; min-height: 100vh; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        }
      `}</style>

      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90"
          data-testid="button-print-action"
        >
          Print / Save as PDF
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-muted text-foreground rounded-md text-sm font-medium hover:opacity-90 border"
          data-testid="button-print-back"
        >
          Back
        </button>
      </div>

      <div className="print-page print-body" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
        <div className="print-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h1 style={{ fontSize: "18pt", fontWeight: "bold", color: "#1a3a6b", margin: 0 }}>
                {doc.title}
              </h1>
              <p style={{ fontSize: "11pt", color: "#666", marginTop: "4pt" }}>
                {DOC_TYPE_LABELS[doc.documentType] || doc.documentType.replace(/_/g, " ")}
              </p>
            </div>
            <div style={{ textAlign: "right", fontSize: "10pt", color: "#666" }}>
              <p style={{ margin: 0 }}>Generated: {new Date(doc.createdAt!).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
              {doc.wordCount && <p style={{ margin: 0 }}>{doc.wordCount} words</p>}
            </div>
          </div>
        </div>

        <div style={{ fontSize: "12pt", lineHeight: "1.7", whiteSpace: "pre-wrap", color: "#222" }}>
          {doc.content}
        </div>

        <div className="print-footer">
          <p style={{ fontSize: "8pt", color: "#999", fontStyle: "italic", margin: 0 }}>
            This document was generated using Nexus247 AI Claims Assistant as a draft template.
            It should be reviewed and customized before submission to the Department of Veterans Affairs.
            This document does not constitute legal advice.
          </p>
        </div>
      </div>
    </>
  );
}

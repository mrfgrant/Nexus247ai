import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  FileText,
  Download,
  Copy,
  Trash2,
  Eye,
  Shield,
  Calendar,
  AlertTriangle,
  Printer,
  Lock,
  ArrowRight,
} from "lucide-react";
import { useLocation, Link } from "wouter";
import type { Document } from "@shared/schema";

interface TrialDocument extends Document {
  trialMode?: boolean;
  previewContent?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBg(score: number): string {
  if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
  if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
  return "bg-red-100 dark:bg-red-900/30";
}

export default function Documents() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState("all");
  const [viewDoc, setViewDoc] = useState<TrialDocument | null>(null);

  const { data: docs = [], isLoading } = useQuery<TrialDocument[]>({
    queryKey: ["/api/documents"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({ title: "Document deleted" });
    },
  });

  const filtered = filter === "all" ? docs : docs.filter((d) => d.documentType === filter);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied to clipboard" });
  };

  const handleDownload = (doc: Document) => {
    const blob = new Blob([doc.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.title}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-documents-title">
            My Documents
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {docs.length} document{docs.length !== 1 ? "s" : ""} generated
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]" data-testid="select-filter">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="nexus_letter">Nexus Letters</SelectItem>
            <SelectItem value="personal_statement">Personal Statements</SelectItem>
            <SelectItem value="buddy_letter">Buddy Letters</SelectItem>
            <SelectItem value="nod">NODs</SelectItem>
            <SelectItem value="secondary_condition">Secondary Conditions</SelectItem>
            <SelectItem value="increase_claim">Increase Claims</SelectItem>
            <SelectItem value="aod_motion">AOD Motions</SelectItem>
            <SelectItem value="good_cause_letter">Good Cause Letters</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!filtered.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No documents found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate your first document to see it here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <Card key={doc.id} className="hover-elevate" data-testid={`card-document-${doc.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-foreground truncate">{doc.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs">
                        {doc.documentType.replace(/_/g, " ")}
                      </Badge>
                      {doc.trialMode && (
                        <Badge
                          className="no-default-hover-elevate no-default-active-elevate text-xs"
                          style={{
                            background: "rgba(212,164,62,0.15)",
                            color: "#D4A43E",
                            border: "1px solid rgba(212,164,62,0.35)",
                          }}
                          data-testid={`badge-trial-${doc.id}`}
                        >
                          Trial
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {doc.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(doc.createdAt!).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {doc.wordCount} words
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {(doc.overallScore ?? 0) > 0 && (
                      <div className={`px-3 py-1.5 rounded-md ${getScoreBg(doc.overallScore!)}`}>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className={`text-lg font-bold ${getScoreColor(doc.overallScore!)}`}>
                            {doc.overallScore}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">RPA Score</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-1">
                      <Button size="icon" variant="ghost" onClick={() => setViewDoc(doc)} data-testid={`button-view-${doc.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => navigate(`/documents/${doc.id}/print`)} data-testid={`button-print-${doc.id}`}>
                        <Printer className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDownload(doc)} data-testid={`button-download-${doc.id}`}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(doc.id)} data-testid={`button-delete-${doc.id}`}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!viewDoc} onOpenChange={(o) => !o && setViewDoc(null)}>
        {viewDoc && (
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewDoc.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {(viewDoc.overallScore ?? 0) > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: "CFR", score: viewDoc.cfrScore },
                    { label: "Evidence", score: viewDoc.evidenceScore },
                    { label: "Nexus", score: viewDoc.nexusScore },
                    { label: "Rater Ready", score: viewDoc.raterReadinessScore },
                    { label: "Overall", score: viewDoc.overallScore },
                  ].map((s) => (
                    <div key={s.label} className="text-center">
                      <div className={`text-lg font-bold ${getScoreColor(s.score || 0)}`}>
                        {s.score || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {viewDoc.improvementSuggestions && (
                <div className="p-3 rounded-md bg-accent/10 border border-accent/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Improvements</p>
                      <p className="text-sm text-muted-foreground mt-1">{viewDoc.improvementSuggestions}</p>
                    </div>
                  </div>
                </div>
              )}
              {viewDoc.trialMode || !viewDoc.content ? (
                <div data-testid="trial-preview-dialog">
                  <div className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/30 border border-border leading-relaxed" data-testid="text-dialog-preview-content">
                    {viewDoc.previewContent || ""}
                  </div>
                  <div className="relative mt-4">
                    <div
                      className="absolute inset-x-0 top-0 h-12 z-10"
                      style={{
                        background: "linear-gradient(to bottom, hsl(var(--card)), transparent)",
                      }}
                    />
                    <div
                      className="font-mono text-sm leading-relaxed overflow-hidden"
                      style={{
                        filter: "blur(5px)",
                        userSelect: "none",
                        maxHeight: "180px",
                        color: "hsl(var(--muted-foreground))",
                      }}
                      aria-hidden="true"
                      data-testid="text-dialog-blurred"
                    >
                      Pursuant to 38 CFR § 3.303(a), the veteran's condition is service-connected based on the following evidence and medical nexus established during active duty service. The medical evidence of record demonstrates a clear and unmistakable relationship between the current diagnosis and the in-service event, injury, or illness documented in the service treatment records. The veteran's treating physician has provided a medical opinion stating that it is at least as likely as not that the current condition was incurred in or caused by the veteran's military service. This opinion is supported by the veteran's service treatment records, post-service medical records, and the current clinical findings. Furthermore, the Board of Veterans' Appeals has consistently held that lay testimony regarding observable symptoms is competent evidence.
                    </div>
                  </div>
                  <div className="mt-4 text-center space-y-3">
                    <div
                      className="mx-auto flex items-center justify-center w-10 h-10 rounded-full"
                      style={{ background: "rgba(212,164,62,0.12)" }}
                    >
                      <Lock className="w-5 h-5" style={{ color: "#D4A43E" }} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upgrade to unlock the full document with all CFR citations.
                    </p>
                    <Link href="/pricing">
                      <Button
                        style={{
                          background: "#D4A43E",
                          color: "#0D2137",
                          borderColor: "#D4A43E",
                        }}
                        data-testid="button-upgrade-dialog"
                      >
                        Upgrade to Unlock
                        <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div className="whitespace-pre-wrap font-mono text-sm p-4 rounded-md bg-muted/30 border border-border leading-relaxed">
                    {viewDoc.content}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleCopy(viewDoc.content)} data-testid="button-copy-modal">
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDownload(viewDoc)} data-testid="button-download-modal">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setViewDoc(null); navigate(`/documents/${viewDoc.id}/print`); }} data-testid="button-print-modal">
                      <Printer className="w-3 h-3 mr-1" /> Print / PDF
                    </Button>
                  </div>
                </>
              )}
              <p className="text-xs text-muted-foreground italic">
                This AI-generated document is a draft template only. Review before submission.
              </p>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

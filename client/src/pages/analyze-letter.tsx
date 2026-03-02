import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  FileText,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpCircle,
  ArrowDownCircle,
  Scale,
  Gavel,
  BookOpen,
  Calendar,
  Shield,
  TrendingUp,
  FileWarning,
  ChevronRight,
  Clipboard,
} from "lucide-react";
import { useLocation } from "wouter";

interface ConditionResult {
  name: string;
  outcome: string;
  ratingAssigned: number | null;
  diagnosticCode: string | null;
  effectiveDate: string | null;
  raterReasoning: string;
  errors: string[];
  missedEvidence: string[];
  nextSteps: string[];
}

interface AppealOption {
  type: string;
  applicableConditions: string[];
  reasoning: string;
  deadline: string;
  strengthAssessment: string;
}

interface CfrViolation {
  section: string;
  description: string;
  affectedConditions: string[];
}

interface RecommendedDoc {
  type: string;
  forCondition: string;
  reasoning: string;
}

interface AnalysisResult {
  summary: string;
  decisionDate: string | null;
  conditions: ConditionResult[];
  overallErrors: string[];
  appealOptions: AppealOption[];
  cfrViolations: CfrViolation[];
  recommendedDocuments: RecommendedDoc[];
  keyDates: {
    decisionDate: string | null;
    appealDeadline: string | null;
    supplementalDeadline: string | null;
    notes: string | null;
  };
  overallAssessment: string;
}

function outcomeIcon(outcome: string) {
  switch (outcome) {
    case "granted": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
    case "denied": return <XCircle className="w-5 h-5 text-red-500" />;
    case "deferred": return <Clock className="w-5 h-5 text-amber-500" />;
    case "increased": return <ArrowUpCircle className="w-5 h-5 text-emerald-500" />;
    case "decreased": return <ArrowDownCircle className="w-5 h-5 text-red-500" />;
    case "continued": return <CheckCircle2 className="w-5 h-5 text-blue-500" />;
    default: return <FileWarning className="w-5 h-5 text-muted-foreground" />;
  }
}

function outcomeBadgeVariant(outcome: string): "default" | "destructive" | "outline" | "secondary" {
  switch (outcome) {
    case "granted": case "increased": return "default";
    case "denied": case "decreased": return "destructive";
    case "deferred": return "secondary";
    default: return "outline";
  }
}

function strengthColor(strength: string) {
  switch (strength) {
    case "Strong": return "text-emerald-600 dark:text-emerald-400";
    case "Moderate": return "text-amber-600 dark:text-amber-400";
    case "Weak": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

const DOC_TYPE_LABELS: Record<string, string> = {
  nexus_letter: "Nexus Letter",
  personal_statement: "Personal Statement",
  buddy_letter: "Buddy Letter",
  nod: "Notice of Disagreement",
  secondary_condition: "Secondary Condition Letter",
  increase_claim: "Increase Claim Letter",
  aod_motion: "AOD Motion",
  good_cause_letter: "Good Cause Letter",
};

export default function AnalyzeLetter() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");

  async function handleAnalyze() {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      if (inputMode === "upload" && selectedFile) {
        formData.append("file", selectedFile);
      } else if (inputMode === "paste" && pastedText.trim()) {
        formData.append("text", pastedText);
      } else {
        toast({ title: "Missing input", description: "Please upload a file or paste your letter text.", variant: "destructive" });
        setIsAnalyzing(false);
        return;
      }

      const res = await fetch("/api/analyze-letter", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      toast({ title: "Analysis complete", description: "Your decision letter has been reviewed." });
    } catch (error: any) {
      toast({ title: "Analysis failed", description: error.message, variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: "Maximum file size is 10MB.", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
    }
  }

  if (analysis) {
    return (
      <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-analysis-title">Decision Letter Analysis</h1>
            <p className="text-sm text-muted-foreground mt-1">AI-powered review of your VA decision</p>
          </div>
          <Button variant="outline" onClick={() => { setAnalysis(null); setSelectedFile(null); setPastedText(""); }} data-testid="button-new-analysis">
            Analyze Another Letter
          </Button>
        </div>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Scale className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Summary</h3>
                <p className="text-sm text-foreground/90" data-testid="text-summary">{analysis.summary}</p>
                {analysis.decisionDate && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> Decision Date: {analysis.decisionDate}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="conditions" className="w-full">
          <TabsList className="w-full grid grid-cols-5" data-testid="analysis-tabs">
            <TabsTrigger value="conditions">Conditions ({analysis.conditions?.length || 0})</TabsTrigger>
            <TabsTrigger value="appeals">Appeals ({analysis.appealOptions?.length || 0})</TabsTrigger>
            <TabsTrigger value="errors">Errors ({(analysis.cfrViolations?.length || 0) + (analysis.overallErrors?.length || 0)})</TabsTrigger>
            <TabsTrigger value="documents">Documents ({analysis.recommendedDocuments?.length || 0})</TabsTrigger>
            <TabsTrigger value="dates">Key Dates</TabsTrigger>
          </TabsList>

          <TabsContent value="conditions" className="space-y-4 mt-4">
            {analysis.conditions?.map((c, idx) => (
              <Card key={idx} data-testid={`card-condition-result-${idx}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {outcomeIcon(c.outcome)}
                      <div>
                        <CardTitle className="text-lg">{c.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={outcomeBadgeVariant(c.outcome)} className="capitalize">{c.outcome}</Badge>
                          {c.ratingAssigned !== null && <Badge variant="outline">{c.ratingAssigned}%</Badge>}
                          {c.diagnosticCode && <Badge variant="outline">DC {c.diagnosticCode}</Badge>}
                          {c.effectiveDate && <span className="text-xs text-muted-foreground">Effective: {c.effectiveDate}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Rater's Reasoning</h4>
                    <p className="text-sm text-foreground">{c.raterReasoning}</p>
                  </div>

                  {c.errors?.length > 0 && (
                    <div className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3">
                      <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Potential Rater Errors
                      </h4>
                      <ul className="space-y-1">
                        {c.errors.map((e, i) => (
                          <li key={i} className="text-sm text-red-600 dark:text-red-400 flex gap-2">
                            <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.missedEvidence?.length > 0 && (
                    <div className="rounded-md border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-3">
                      <h4 className="text-sm font-medium text-amber-700 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                        <FileWarning className="w-4 h-4" /> Missed or Overlooked Evidence
                      </h4>
                      <ul className="space-y-1">
                        {c.missedEvidence.map((e, i) => (
                          <li key={i} className="text-sm text-amber-600 dark:text-amber-400 flex gap-2">
                            <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {c.nextSteps?.length > 0 && (
                    <div className="rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-3">
                      <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Recommended Next Steps
                      </h4>
                      <ul className="space-y-1">
                        {c.nextSteps.map((s, i) => (
                          <li key={i} className="text-sm text-emerald-600 dark:text-emerald-400 flex gap-2">
                            <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="appeals" className="space-y-4 mt-4">
            {analysis.appealOptions?.map((a, idx) => (
              <Card key={idx} data-testid={`card-appeal-${idx}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Gavel className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-foreground">{a.type}</h3>
                        <span className={`text-sm font-semibold ${strengthColor(a.strengthAssessment)}`}>
                          {a.strengthAssessment} Case
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {a.applicableConditions?.map((c, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-foreground/90">{a.reasoning}</p>
                      {a.deadline && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {a.deadline}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!analysis.appealOptions || analysis.appealOptions.length === 0) && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No specific appeal paths identified.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="errors" className="space-y-4 mt-4">
            {analysis.cfrViolations?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-500" /> CFR Violations Found
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.cfrViolations.map((v, idx) => (
                    <div key={idx} className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3" data-testid={`card-violation-${idx}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="destructive" className="text-xs">{v.section}</Badge>
                        <div className="flex gap-1">
                          {v.affectedConditions?.map((c, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{v.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {analysis.overallErrors?.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> Overall Decision Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.overallErrors.map((e, idx) => (
                      <li key={idx} className="text-sm text-foreground flex gap-2">
                        <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                        <span>{e}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {(!analysis.cfrViolations?.length && !analysis.overallErrors?.length) && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No significant errors identified in this decision.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            {analysis.recommendedDocuments?.map((d, idx) => (
              <Card key={idx} className="cursor-pointer hover:border-primary/30 transition-colors" data-testid={`card-recommended-doc-${idx}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground">{DOC_TYPE_LABELS[d.type] || d.type}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">For: {d.forCondition}</p>
                        <p className="text-sm text-foreground/90 mt-2">{d.reasoning}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate("/generate")}
                      data-testid={`button-generate-doc-${idx}`}
                    >
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!analysis.recommendedDocuments || analysis.recommendedDocuments.length === 0) && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No additional documents recommended at this time.
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="dates" className="mt-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {analysis.keyDates?.decisionDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Decision Date</p>
                      <p className="text-sm text-muted-foreground">{analysis.keyDates.decisionDate}</p>
                    </div>
                  </div>
                )}
                {analysis.keyDates?.appealDeadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Appeal Deadline</p>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">{analysis.keyDates.appealDeadline}</p>
                    </div>
                  </div>
                )}
                {analysis.keyDates?.supplementalDeadline && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Supplemental Claim</p>
                      <p className="text-sm text-muted-foreground">{analysis.keyDates.supplementalDeadline}</p>
                    </div>
                  </div>
                )}
                {analysis.keyDates?.notes && (
                  <Separator />
                )}
                {analysis.keyDates?.notes && (
                  <p className="text-sm text-foreground/90">{analysis.keyDates.notes}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" /> Expert Assessment
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed" data-testid="text-overall-assessment">{analysis.overallAssessment}</p>
            <div className="mt-4 p-3 rounded-md bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground italic">
                This analysis is for informational purposes only and does not constitute legal advice.
                Consult an accredited VA claims agent or attorney for your specific situation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-analyze-title">Analyze Decision Letter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your VA decision letter and get an expert AI analysis with specific next steps, identified errors, and recommended appeal paths.
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "upload" | "paste")}>
            <TabsList className="w-full grid grid-cols-2 mb-6" data-testid="input-mode-tabs">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" /> Upload PDF
              </TabsTrigger>
              <TabsTrigger value="paste" className="flex items-center gap-2">
                <Clipboard className="w-4 h-4" /> Paste Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.text"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file-upload"
              />
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  selectedFile
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
                data-testid="dropzone"
              >
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-emerald-500" />
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024).toFixed(0)} KB — Click to change file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground/50" />
                    <div>
                      <p className="font-medium text-foreground">Click to upload your decision letter</p>
                      <p className="text-sm text-muted-foreground mt-1">PDF or text file, up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="paste">
              <Textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste the full text of your VA decision letter here..."
                className="min-h-[200px] font-mono text-sm"
                data-testid="input-paste-text"
              />
              {pastedText.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">{pastedText.length.toLocaleString()} characters</p>
              )}
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <Button
            className="w-full"
            size="lg"
            onClick={handleAnalyze}
            disabled={isAnalyzing || (inputMode === "upload" && !selectedFile) || (inputMode === "paste" && pastedText.trim().length < 100)}
            data-testid="button-analyze"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing your decision letter...
              </>
            ) : (
              <>
                <Scale className="w-4 h-4 mr-2" />
                Analyze Decision Letter
              </>
            )}
          </Button>

          {isAnalyzing && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-border">
              <div className="flex items-start gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">Reviewing your decision letter...</p>
                  <p className="text-xs text-muted-foreground">
                    Our AI is analyzing every condition, checking for CFR violations,
                    identifying rater errors, and building your recommended action plan.
                    This typically takes 15-30 seconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-foreground mb-3">What We Analyze</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: CheckCircle2, label: "Every condition outcome (granted, denied, deferred)" },
              { icon: AlertTriangle, label: "Rater errors and CFR violations" },
              { icon: FileWarning, label: "Missed or overlooked evidence" },
              { icon: Gavel, label: "Best appeal paths with strength ratings" },
              { icon: Calendar, label: "Critical deadlines and dates" },
              { icon: BookOpen, label: "Recommended letters to generate next" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <item.icon className="w-4 h-4 text-primary shrink-0" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

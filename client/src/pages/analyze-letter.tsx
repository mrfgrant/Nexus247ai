import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ThinkingSteps } from "@/components/thinking-steps";
import { ToastAction } from "@/components/ui/toast";
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
  History,
  Trash2,
  Eye,
  Search,
  Target,
  Stethoscope,
  FileSearch,
  Zap,
  Lock,
  Crown,
  RefreshCw,
  Inbox,
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

interface CrossReferenceCondition {
  name: string;
  evidencePresent: string[];
  evidenceMissing: string[];
  completenessRating: string;
  winProbability: string;
  recommendations: string[];
}

interface PriorityAction {
  action: string;
  urgency: string;
  forCondition: string;
  reasoning: string;
}

interface MedicalTestNeeded {
  test: string;
  forCondition: string;
  purpose: string;
}

interface CrossReferenceResult {
  evidenceSummary: string;
  conditions: CrossReferenceCondition[];
  overallGaps: string[];
  priorityActions: PriorityAction[];
  medicalTestsNeeded: MedicalTestNeeded[];
  strengths: string[];
}

interface SavedAnalysis {
  id: string;
  userId: string;
  fileName: string | null;
  summary: string | null;
  analysisData: AnalysisResult;
  crossReferenceData: CrossReferenceResult | null;
  createdAt: string;
}

interface AnalysisLimits {
  tier: string;
  limit: number;
  used: number;
  remaining: number;
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
    case "Strong": case "High": return "text-emerald-600 dark:text-emerald-400";
    case "Moderate": case "Medium": return "text-amber-600 dark:text-amber-400";
    case "Weak": case "Low": return "text-red-600 dark:text-red-400";
    default: return "text-muted-foreground";
  }
}

function completenessColor(rating: string) {
  switch (rating) {
    case "Strong": return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "Moderate": return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Weak": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800";
    default: return "bg-muted text-muted-foreground";
  }
}

function urgencyBadge(urgency: string) {
  switch (urgency) {
    case "Immediate": return <Badge variant="destructive" className="text-xs">{urgency}</Badge>;
    case "Soon": return <Badge className="text-xs bg-amber-500 hover:bg-amber-600">{urgency}</Badge>;
    case "When Possible": return <Badge variant="outline" className="text-xs">{urgency}</Badge>;
    default: return <Badge variant="outline" className="text-xs">{urgency}</Badge>;
  }
}

const THINKING_STEPS = [
  { icon: FileText, label: "Extracting text from your decision letter..." },
  { icon: Eye, label: "Identifying claimed conditions and outcomes..." },
  { icon: BookOpen, label: "Reviewing rater reasoning and evidence cited..." },
  { icon: Shield, label: "Checking for 38 CFR regulation violations..." },
  { icon: Scale, label: "Analyzing duty to assist compliance..." },
  { icon: Gavel, label: "Evaluating appeal paths and deadlines..." },
  { icon: TrendingUp, label: "Building your recommended action plan..." },
  { icon: CheckCircle2, label: "Finalizing expert assessment..." },
];

const CROSS_REF_THINKING_STEPS = [
  { icon: FileSearch, label: "Loading your medical records..." },
  { icon: Search, label: "Comparing records against decision letter findings..." },
  { icon: Stethoscope, label: "Identifying documented evidence for each condition..." },
  { icon: AlertTriangle, label: "Checking for evidence gaps and missing documentation..." },
  { icon: Target, label: "Evaluating win probability for each condition..." },
  { icon: Zap, label: "Building your evidence action plan..." },
];

const STEP_DELAYS = [0, 3000, 6000, 9000, 12000, 15000, 18000, 22000];
const CROSS_REF_DELAYS = [0, 3000, 6000, 10000, 14000, 18000];

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

const TIER_LABELS: Record<string, string> = {
  none: "Free",
  basic: "Starter",
  pro: "Pro",
  concierge: "Concierge",
};

function CrossReferenceTab({ data }: { data: CrossReferenceResult }) {
  return (
    <div className="space-y-4 mt-4">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <FileSearch className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Evidence Summary</h3>
              <p className="text-sm text-foreground/90" data-testid="text-evidence-summary">{data.evidenceSummary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.strengths?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.strengths.map((s, i) => (
                <li key={i} className="text-sm text-emerald-700 dark:text-emerald-400 flex gap-2" data-testid={`text-strength-${i}`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {data.conditions?.map((c, idx) => (
        <Card key={idx} data-testid={`card-crossref-condition-${idx}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{c.name}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full border ${completenessColor(c.completenessRating)}`} data-testid={`badge-completeness-${idx}`}>
                  {c.completenessRating} Evidence
                </span>
                <span className={`text-xs font-semibold ${strengthColor(c.winProbability)}`} data-testid={`text-win-probability-${idx}`}>
                  {c.winProbability} Win Chance
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {c.evidencePresent?.length > 0 && (
              <div className="rounded-md border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/30 p-3">
                <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Evidence Present
                </h4>
                <ul className="space-y-1">
                  {c.evidencePresent.map((e, i) => (
                    <li key={i} className="text-sm text-emerald-600 dark:text-emerald-400 flex gap-2">
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.evidenceMissing?.length > 0 && (
              <div className="rounded-md border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/30 p-3">
                <h4 className="text-sm font-medium text-red-700 dark:text-red-400 mb-1.5 flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Evidence Missing
                </h4>
                <ul className="space-y-1">
                  {c.evidenceMissing.map((e, i) => (
                    <li key={i} className="text-sm text-red-600 dark:text-red-400 flex gap-2">
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {c.recommendations?.length > 0 && (
              <div className="rounded-md border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-950/30 p-3">
                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-400 mb-1.5 flex items-center gap-1">
                  <Target className="w-4 h-4" /> What To Do
                </h4>
                <ul className="space-y-1">
                  {c.recommendations.map((r, i) => (
                    <li key={i} className="text-sm text-blue-600 dark:text-blue-400 flex gap-2">
                      <ChevronRight className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {data.priorityActions?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Priority Action Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.priorityActions.map((a, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border" data-testid={`card-priority-action-${idx}`}>
                <div className="shrink-0 mt-0.5">{urgencyBadge(a.urgency)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{a.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">For: {a.forCondition}</p>
                  <p className="text-xs text-foreground/80 mt-1">{a.reasoning}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data.medicalTestsNeeded?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" /> Medical Tests Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.medicalTestsNeeded.map((t, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border" data-testid={`card-medical-test-${idx}`}>
                <Stethoscope className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t.test}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">For: {t.forCondition}</p>
                  <p className="text-xs text-foreground/80 mt-1">{t.purpose}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data.overallGaps?.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Overall Evidence Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.overallGaps.map((g, i) => (
                <li key={i} className="text-sm text-foreground flex gap-2">
                  <ChevronRight className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                  <span>{g}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalysisResultView({
  analysis,
  onBack,
  viewingLabel,
  analysisId,
  crossReferenceData,
}: {
  analysis: AnalysisResult;
  onBack: () => void;
  viewingLabel?: string;
  analysisId?: string;
  crossReferenceData?: CrossReferenceResult | null;
}) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isCrossReferencing, setIsCrossReferencing] = useState(false);
  const [crossRef, setCrossRef] = useState<CrossReferenceResult | null>(crossReferenceData || null);
  const [activeTab, setActiveTab] = useState("conditions");

  async function handleCrossReference() {
    if (!analysisId) return;
    setIsCrossReferencing(true);
    try {
      const res = await fetch(`/api/analyze-letter/${analysisId}/cross-reference`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.noRecords) {
          toast({
            title: "No medical records found",
            description: "Upload your medical records in the Intake section (Step 4) first, then come back to cross-reference.",
            variant: "destructive",
            action: (
              <ToastAction altText="Upload Records" onClick={() => navigate("/intake?step=3")}>
                Upload Records
              </ToastAction>
            ),
          });
        } else {
          toast({ title: "Cross-reference failed", description: data.error || "Please try again.", variant: "destructive" });
        }
        return;
      }
      setCrossRef(data.crossReference);
      setActiveTab("evidence");
      queryClient.invalidateQueries({ queryKey: ["/api/letter-analyses"] });
      toast({ title: "Cross-reference complete", description: "Evidence gap analysis has been saved." });
    } catch (error: any) {
      toast({ title: "Cross-reference failed", description: "An unexpected error occurred. Please try again.", variant: "destructive" });
    } finally {
      setIsCrossReferencing(false);
    }
  }

  const tabCount = crossRef ? 6 : 5;

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-analysis-title">Decision Letter Analysis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {viewingLabel ? viewingLabel : "AI-powered review of your VA decision"}
          </p>
        </div>
        <Button variant="outline" onClick={onBack} data-testid="button-back-to-analyzer">
          Back
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

      {analysisId && (
        <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex gap-3 flex-1">
                <FileSearch className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {crossRef ? "Re-Analyze Evidence" : "Cross-Reference Medical Records"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {crossRef
                      ? "Re-run if you've uploaded new records or if results seem incomplete."
                      : "Compare your uploaded medical records against this decision to find evidence gaps and build a winning strategy."}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleCrossReference}
                disabled={isCrossReferencing}
                variant={crossRef ? "outline" : "default"}
                className="shrink-0"
                data-testid={crossRef ? "button-re-analyze-evidence" : "button-cross-reference"}
              >
                {isCrossReferencing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : crossRef ? (
                  <>
                    <History className="w-4 h-4 mr-2" />
                    Re-Analyze Evidence
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Cross-Reference Records
                  </>
                )}
              </Button>
            </div>
            {isCrossReferencing && (
              <ThinkingSteps isActive={isCrossReferencing} steps={CROSS_REF_THINKING_STEPS} delays={CROSS_REF_DELAYS} />
            )}
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`w-full flex overflow-x-auto scrollbar-hide ${tabCount === 6 ? "md:grid md:grid-cols-6" : "md:grid md:grid-cols-5"}`} data-testid="analysis-tabs">
          <TabsTrigger value="conditions" className="shrink-0 whitespace-nowrap">Conditions ({analysis.conditions?.length || 0})</TabsTrigger>
          <TabsTrigger value="appeals" className="shrink-0 whitespace-nowrap">Appeals ({analysis.appealOptions?.length || 0})</TabsTrigger>
          <TabsTrigger value="errors" className="shrink-0 whitespace-nowrap">Errors ({(analysis.cfrViolations?.length || 0) + (analysis.overallErrors?.length || 0)})</TabsTrigger>
          <TabsTrigger value="documents" className="shrink-0 whitespace-nowrap">Documents ({analysis.recommendedDocuments?.length || 0})</TabsTrigger>
          <TabsTrigger value="dates" className="shrink-0 whitespace-nowrap">Key Dates</TabsTrigger>
          {crossRef && (
            <TabsTrigger value="evidence" className="relative shrink-0 whitespace-nowrap">
              Evidence Gap
              <span className="ml-1 w-2 h-2 rounded-full bg-amber-500 inline-block" />
            </TabsTrigger>
          )}
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
                    onClick={() => {
                      const matchingCondition = analysis.conditions?.find(
                        (c) => c.name?.toLowerCase() === d.forCondition?.toLowerCase()
                      );
                      const contextParts: string[] = [];
                      if (d.reasoning) contextParts.push(`Recommendation: ${d.reasoning}`);
                      if (matchingCondition) {
                        if (matchingCondition.outcome === "denied" && matchingCondition.raterReasoning) {
                          contextParts.push(`Denial Reasoning: ${matchingCondition.raterReasoning}`);
                        }
                        if (matchingCondition.errors?.length) {
                          contextParts.push(`Rater Errors: ${matchingCondition.errors.join("; ")}`);
                        }
                        if (matchingCondition.missedEvidence?.length) {
                          contextParts.push(`Missed Evidence: ${matchingCondition.missedEvidence.join("; ")}`);
                        }
                      }
                      const params = new URLSearchParams();
                      params.set("type", d.type);
                      params.set("condition", d.forCondition);
                      if (contextParts.length > 0) {
                        params.set("context", contextParts.join("\n\n"));
                      }
                      navigate(`/generate?${params.toString()}`);
                    }}
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

        {crossRef && (
          <TabsContent value="evidence">
            <CrossReferenceTab data={crossRef} />
          </TabsContent>
        )}
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

export default function AnalyzeLetter() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pastedText, setPastedText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [crossRefData, setCrossRefData] = useState<CrossReferenceResult | null>(null);
  const [inputMode, setInputMode] = useState<"upload" | "paste">("upload");
  const [viewingLabel, setViewingLabel] = useState<string | undefined>(undefined);
  const [analysisError, setAnalysisError] = useState(false);

  const { data: savedAnalyses, isLoading: loadingHistory } = useQuery<SavedAnalysis[]>({
    queryKey: ["/api/letter-analyses"],
  });

  const { data: limitsData } = useQuery<AnalysisLimits>({
    queryKey: ["/api/analysis-limits"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/letter-analyses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/letter-analyses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analysis-limits"] });
      toast({ title: "Analysis deleted" });
    },
    onError: () => {
      toast({ title: "Failed to delete", variant: "destructive" });
    },
  });

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalysisError(false);
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
        if (err.trialLimited) {
          toast({ title: "Trial Limit Reached", description: "Your free trial includes 1 analysis. Subscribe to unlock full access." });
          setIsAnalyzing(false);
          return;
        }
        if (err.requiresUpgrade) {
          toast({ title: "Subscription required", description: err.error, variant: "destructive" });
          setIsAnalyzing(false);
          return;
        }
        if (err.limitReached) {
          toast({ title: "Limit reached", description: err.error, variant: "destructive" });
          setIsAnalyzing(false);
          return;
        }
        throw new Error(err.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data.analysis);
      setAnalysisId(data.id);
      setCrossRefData(null);
      setViewingLabel(undefined);
      queryClient.invalidateQueries({ queryKey: ["/api/letter-analyses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analysis-limits"] });
      toast({
        title: "Analysis complete",
        description: `Your decision letter has been reviewed and saved.${data.remaining !== undefined ? ` ${data.remaining} analyses remaining this month.` : ""}`,
      });
    } catch (error: any) {
      setAnalysisError(true);
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

  function handleViewSaved(saved: SavedAnalysis) {
    setAnalysis(saved.analysisData);
    setAnalysisId(saved.id);
    setCrossRefData(saved.crossReferenceData || null);
    const date = new Date(saved.createdAt).toLocaleDateString();
    setViewingLabel(`Saved analysis from ${date}${saved.fileName ? ` — ${saved.fileName}` : ""}`);
  }

  function handleBack() {
    setAnalysis(null);
    setAnalysisId(null);
    setCrossRefData(null);
    setSelectedFile(null);
    setPastedText("");
    setViewingLabel(undefined);
  }

  if (analysis) {
    return (
      <AnalysisResultView
        analysis={analysis}
        onBack={handleBack}
        viewingLabel={viewingLabel}
        analysisId={analysisId || undefined}
        crossReferenceData={crossRefData}
      />
    );
  }

  const tierLabel = TIER_LABELS[limitsData?.tier || "none"] || "Free";
  const isFreeTier = !limitsData || limitsData.tier === "none";
  const isLimitReached = limitsData ? limitsData.remaining <= 0 : false;
  const canAnalyze = !isFreeTier && !isLimitReached;

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-analyze-title">Analyze Decision Letter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Upload your VA decision letter and get an expert AI analysis with specific next steps, identified errors, and recommended appeal paths.
        </p>
      </div>

      {limitsData && (
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg bg-muted/50 border border-border" data-testid="analysis-limits-bar">
          <div className="flex items-center gap-2">
            <Badge variant={isFreeTier ? "secondary" : "default"} className="text-xs" data-testid="badge-tier">
              <Crown className="w-3 h-3 mr-1" />
              {tierLabel}
            </Badge>
            {!isFreeTier && (
              <span className="text-sm text-muted-foreground" data-testid="text-analysis-count">
                {limitsData.used}/{limitsData.limit} analyses used this month
              </span>
            )}
          </div>
          {isFreeTier && (
            <Button size="sm" variant="default" onClick={() => navigate("/pricing")} data-testid="button-upgrade-tier">
              <Lock className="w-3 h-3 mr-1" /> Upgrade to Analyze
            </Button>
          )}
          {!isFreeTier && isLimitReached && (
            <Button size="sm" variant="outline" onClick={() => navigate("/pricing")} data-testid="button-upgrade-limit">
              Upgrade for More
            </Button>
          )}
        </div>
      )}

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

          {isFreeTier ? (
            <div className="text-center py-4">
              <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Subscription Required</p>
              <p className="text-xs text-muted-foreground mb-4">
                Decision letter analysis requires an active subscription. Starter plan includes 2 analyses per month.
              </p>
              <Button onClick={() => navigate("/pricing")} data-testid="button-upgrade-analyze">
                <Crown className="w-4 h-4 mr-2" /> View Plans
              </Button>
            </div>
          ) : isLimitReached ? (
            <div className="text-center py-4">
              <AlertTriangle className="w-8 h-8 mx-auto text-amber-500 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Monthly Limit Reached</p>
              <p className="text-xs text-muted-foreground mb-4">
                You have used all {limitsData?.limit} analyses for this month. Upgrade your plan for more.
              </p>
              <Button variant="outline" onClick={() => navigate("/pricing")} data-testid="button-upgrade-limit-cta">
                Upgrade Plan
              </Button>
            </div>
          ) : (
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
                  {limitsData && (
                    <span className="ml-2 text-xs opacity-75">({limitsData.remaining} remaining)</span>
                  )}
                </>
              )}
            </Button>
          )}

          {isAnalyzing && <ThinkingSteps isActive={isAnalyzing} steps={THINKING_STEPS} delays={STEP_DELAYS} />}

          {analysisError && !isAnalyzing && (
            <div className="flex items-center gap-3 p-3 rounded-md bg-destructive/5 border border-destructive/20 mt-3">
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive flex-1">Analysis failed. Your file is still loaded — you can retry without re-uploading.</p>
              <Button size="sm" variant="outline" onClick={handleAnalyze} data-testid="button-retry-analysis">
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Retry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {loadingHistory ? (
        <Card>
          <CardContent className="py-8 flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading past analyses...
          </CardContent>
        </Card>
      ) : savedAnalyses && savedAnalyses.length > 0 ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <History className="w-5 h-5 text-primary" /> Past Analyses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {savedAnalyses.map((saved) => {
              const date = new Date(saved.createdAt);
              const conditionCount = saved.analysisData?.conditions?.length || 0;
              const errorCount = (saved.analysisData?.cfrViolations?.length || 0) + (saved.analysisData?.overallErrors?.length || 0);
              const hasCrossRef = !!saved.crossReferenceData;
              return (
                <div
                  key={saved.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  data-testid={`card-saved-analysis-${saved.id}`}
                >
                  <FileText className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">
                        {saved.fileName || "Pasted Text"}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {saved.summary || "No summary available"}
                    </p>
                    <div className="flex gap-2 mt-1.5">
                      {conditionCount > 0 && (
                        <Badge variant="outline" className="text-xs">{conditionCount} condition{conditionCount !== 1 ? "s" : ""}</Badge>
                      )}
                      {errorCount > 0 && (
                        <Badge variant="destructive" className="text-xs">{errorCount} error{errorCount !== 1 ? "s" : ""}</Badge>
                      )}
                      {hasCrossRef && (
                        <Badge variant="secondary" className="text-xs">
                          <FileSearch className="w-3 h-3 mr-1" /> Cross-Referenced
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewSaved(saved)}
                      data-testid={`button-view-analysis-${saved.id}`}
                    >
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteMutation.mutate(saved.id)}
                      disabled={deleteMutation.isPending}
                      data-testid={`button-delete-analysis-${saved.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : !loadingHistory ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Inbox className="w-10 h-10 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">No analyses yet</p>
            <p className="text-xs text-muted-foreground mt-1">Upload a VA decision letter above to get your first AI-powered analysis.</p>
          </CardContent>
        </Card>
      ) : null}

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
              { icon: FileSearch, label: "Medical records cross-reference" },
              { icon: Target, label: "Evidence gap analysis and win strategy" },
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

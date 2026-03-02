import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  FileText,
  Loader2,
  Download,
  Lock,
  CheckCircle,
  AlertTriangle,
  Copy,
  Shield,
} from "lucide-react";
import type { Condition } from "@shared/schema";

const DOCUMENT_TYPES = [
  { value: "nexus_letter", label: "Nexus Letter", tier: "basic", description: "IMO establishing service connection with CFR citations" },
  { value: "personal_statement", label: "Personal Statement", tier: "basic", description: "First-person lay evidence per 38 CFR § 3.303(a)" },
  { value: "buddy_letter", label: "Buddy Letter", tier: "basic", description: "Witness corroboration per M21-1 guidance" },
  { value: "nod", label: "Notice of Disagreement", tier: "basic", description: "Appeal citing rater errors per 38 CFR § 19.5" },
  { value: "secondary_condition", label: "Secondary Condition Letter", tier: "basic", description: "Service connection per 38 CFR § 3.310" },
  { value: "increase_claim", label: "Increase Claim Letter", tier: "basic", description: "Worsening documentation per 38 CFR Part 4" },
  { value: "aod_motion", label: "AOD Motion", tier: "concierge", description: "Advancement on Docket per 38 CFR § 20.900(c)" },
  { value: "good_cause_letter", label: "Good Cause Letter", tier: "concierge", description: "Supporting hardship argument per 38 U.S.C. § 7107" },
];

function ScoreGauge({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className={`font-bold ${color}`}>{score}/100</span>
      </div>
      <Progress value={score} className="h-2" />
    </div>
  );
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-400";
  if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

export default function GenerateDocument() {
  const { toast } = useToast();
  const [documentType, setDocumentType] = useState("");
  const [conditionId, setConditionId] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [generatedDoc, setGeneratedDoc] = useState<any>(null);

  const { data: conditionsList = [] } = useQuery<Condition[]>({
    queryKey: ["/api/conditions"],
  });

  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  const tier = profile?.subscriptionTier || "none";

  const generateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/generate", data);
      return res.json();
    },
    onSuccess: (data) => {
      setGeneratedDoc(data);
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/count/month"] });
      toast({ title: "Document generated", description: "Your letter has been scored and saved." });
    },
    onError: (error: any) => {
      toast({
        title: "Generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!documentType) {
      toast({ title: "Select a document type", variant: "destructive" });
      return;
    }
    setGeneratedDoc(null);
    generateMutation.mutate({
      documentType,
      conditionId: conditionId && conditionId !== "none" ? conditionId : undefined,
      additionalContext: additionalContext || undefined,
    });
  };

  const handleCopy = () => {
    if (generatedDoc?.content) {
      navigator.clipboard.writeText(generatedDoc.content);
      toast({ title: "Copied to clipboard" });
    }
  };

  const handleDownload = () => {
    if (generatedDoc?.content) {
      const blob = new Blob([generatedDoc.content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${generatedDoc.document?.title || "document"}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const isLocked = (docType: string) => {
    const typeInfo = DOCUMENT_TYPES.find((t) => t.value === docType);
    return typeInfo?.tier === "concierge" && tier !== "concierge";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-generate-title">
          Generate Document
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Create CFR-grounded VA claims documents with AI quality scoring.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={documentType} onValueChange={setDocumentType}>
              <SelectTrigger data-testid="select-document-type">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem
                    key={type.value}
                    value={type.value}
                    disabled={isLocked(type.value)}
                  >
                    <div className="flex items-center gap-2">
                      {isLocked(type.value) && <Lock className="w-3 h-3 text-muted-foreground" />}
                      <span>{type.label}</span>
                      {type.tier === "concierge" && (
                        <Badge variant="outline" className="text-xs ml-1">Concierge</Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {documentType && (
              <p className="text-xs text-muted-foreground">
                {DOCUMENT_TYPES.find((t) => t.value === documentType)?.description}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Condition (Optional)</Label>
            <Select value={conditionId} onValueChange={setConditionId}>
              <SelectTrigger data-testid="select-condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No specific condition</SelectItem>
                {conditionsList.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.conditionName}
                    {c.diagnosticCode ? ` (DC ${c.diagnosticCode})` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Additional Context</Label>
            <Textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Add any additional details: denial reasons, primary condition for secondary claims, specific hardships for AOD motions..."
              rows={4}
              data-testid="input-additional-context"
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !documentType || tier === "none"}
            className="w-full"
            data-testid="button-generate"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating & Scoring...
              </>
            ) : tier === "none" ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Subscription Required
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Document
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generateMutation.isPending && (
        <Card>
          <CardContent className="py-12 text-center space-y-4">
            <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
            <div>
              <p className="font-medium text-foreground">Generating your document...</p>
              <p className="text-sm text-muted-foreground mt-1">
                Crafting CFR-grounded content and running RPA quality analysis.
                This typically takes 15-30 seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {generatedDoc && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  RPA Quality Scores
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Overall:</span>
                  <span className={`text-2xl font-bold ${getScoreColor(generatedDoc.document?.overallScore || 0)}`}>
                    {generatedDoc.document?.overallScore || 0}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <ScoreGauge
                score={generatedDoc.document?.cfrScore || 0}
                label="CFR Compliance"
                color={getScoreColor(generatedDoc.document?.cfrScore || 0)}
              />
              <ScoreGauge
                score={generatedDoc.document?.evidenceScore || 0}
                label="Evidence Sufficiency"
                color={getScoreColor(generatedDoc.document?.evidenceScore || 0)}
              />
              <ScoreGauge
                score={generatedDoc.document?.nexusScore || 0}
                label="Medical Nexus Strength"
                color={getScoreColor(generatedDoc.document?.nexusScore || 0)}
              />
              <ScoreGauge
                score={generatedDoc.document?.raterReadinessScore || 0}
                label="Rater Readiness"
                color={getScoreColor(generatedDoc.document?.raterReadinessScore || 0)}
              />

              {generatedDoc.document?.improvementSuggestions && (
                <div className="mt-4 p-3 rounded-md bg-accent/10 border border-accent/20">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Improvement Suggestions</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {generatedDoc.document.improvementSuggestions}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg">{generatedDoc.document?.title}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} data-testid="button-copy">
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleDownload} data-testid="button-download">
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-md bg-muted/30 border border-border whitespace-pre-wrap font-mono text-sm leading-relaxed" data-testid="text-generated-content">
                {generatedDoc.content}
              </div>
              <div className="mt-4 p-3 rounded-md bg-muted/20 border border-border">
                <p className="text-xs text-muted-foreground italic">
                  <strong>Legal Disclaimer:</strong> This AI-generated document is a draft template only.
                  VetLetters is not a law firm and does not provide legal advice. Review all content
                  before submission and consult an accredited VA claims agent or attorney.
                  No guarantee of claim outcomes is expressed or implied.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

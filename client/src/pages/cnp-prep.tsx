import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ThinkingSteps } from "@/components/thinking-steps";
import {
  ClipboardCheck,
  Lock,
  Copy,
  Download,
  Printer,
  AlertTriangle,
  FileText,
  Users,
  ArrowRight,
  Stethoscope,
  BookOpen,
  Search,
  Shield,
  CheckCircle2,
  ScrollText,
} from "lucide-react";
import { useLocation } from "wouter";
import type { Condition } from "@shared/schema";

const PREP_STEPS = [
  { icon: Stethoscope, label: "Reviewing your condition's diagnostic criteria..." },
  { icon: BookOpen, label: "Analyzing DBQ scoring requirements..." },
  { icon: Search, label: "Checking your medical records and analysis..." },
  { icon: Shield, label: "Building worst-day symptom descriptions..." },
  { icon: ScrollText, label: "Preparing post-exam documentation template..." },
  { icon: CheckCircle2, label: "Creating your exam day cheat sheet..." },
];

const PREP_DELAYS = [0, 4000, 8000, 13000, 19000, 26000];

export default function CnpPrep() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [conditionId, setConditionId] = useState("");
  const [result, setResult] = useState<any>(null);

  const { data: conditionsList = [] } = useQuery<Condition[]>({
    queryKey: ["/api/conditions"],
  });

  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  const tier = profile?.subscriptionTier || "none";
  const isProOrAbove = tier === "pro" || tier === "concierge";

  const prepMutation = useMutation({
    mutationFn: async (data: { conditionId: string }) => {
      const res = await apiRequest("POST", "/api/cnp-prep", data);
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Prep guide generated", description: "Your C&P exam preparation is ready." });
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
    if (!conditionId) {
      toast({ title: "Select a condition", variant: "destructive" });
      return;
    }
    setResult(null);
    prepMutation.mutate({ conditionId });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied to clipboard` });
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = (text: string) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>C&P Exam Cheat Sheet</title><style>
        body { font-family: Arial, sans-serif; font-size: 11pt; line-height: 1.4; margin: 0.5in; color: #000; }
        pre { white-space: pre-wrap; word-wrap: break-word; font-family: Arial, sans-serif; font-size: 11pt; margin: 0; }
        @media print { body { margin: 0.4in; } }
      </style></head><body><pre>${text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const selectedCondition = conditionsList.find((c) => c.id === conditionId);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-cnp-prep-title">
            C&P Exam Prep
          </h1>
          <Badge variant="outline" className="text-xs">Pro</Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-1">
          Get a personalized preparation guide and printable cheat sheet for your C&P exam.
        </p>
      </div>

      {!isProOrAbove && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="py-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">Pro Tier Required</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">
                  C&P exam prep guides are available for Pro and Concierge subscribers.
                  The C&P exam is where claims are won or lost — don't go in unprepared.
                </p>
              </div>
              <Button onClick={() => navigate("/pricing")} data-testid="button-upgrade-cnp">
                Upgrade to Pro
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="mt-6 text-left">
              <p className="text-sm font-medium text-foreground mb-2">What you get with C&P Exam Prep:</p>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="prep-guide" data-testid="accordion-prep-guide">
                  <AccordionTrigger className="text-sm py-3">
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary shrink-0" />
                      Personalized 8-Section Prep Guide
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    A comprehensive guide tailored to your specific condition covering exam overview, condition-specific questions the examiner will ask, what to say and what to avoid, worst-day symptom descriptions using the frequency-severity-duration framework, DBQ scoring criteria, bad faith exam red flags, a pre-exam checklist, and a detailed post-exam 24-hour documentation template.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="cheat-sheet" data-testid="accordion-cheat-sheet">
                  <AccordionTrigger className="text-sm py-3">
                    <span className="flex items-center gap-2">
                      <Printer className="w-4 h-4 text-primary shrink-0" />
                      Printable Exam Day Cheat Sheet
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    A one-page document you print and hold during your exam. Includes your condition summary, key service incidents in plain language, worst-day symptoms written in your own voice, phrases to use and phrases to avoid, and space for notes. Designed so you don't blank under pressure.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="gap-alerts" data-testid="accordion-gap-alerts">
                  <AccordionTrigger className="text-sm py-3">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary shrink-0" />
                      Smart Document Gap Alerts
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Automatically checks if you're missing a nexus letter for the condition you're prepping for and recommends a buddy letter to corroborate your symptoms. One-click buttons let you generate these documents before the exam — catching gaps pre-exam rather than post-denial.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dbq-criteria" data-testid="accordion-dbq-criteria">
                  <AccordionTrigger className="text-sm py-3">
                    <span className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-primary shrink-0" />
                      Condition-Specific DBQ Criteria
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Shows exactly what the examiner is measuring on the Disability Benefits Questionnaire for your condition. Includes specific rating thresholds from 38 CFR Part 4 so you understand what symptoms and findings correspond to each rating percentage.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="post-exam" className="border-b-0" data-testid="accordion-post-exam">
                  <AccordionTrigger className="text-sm py-3">
                    <span className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary shrink-0" />
                      Post-Exam Action Plan
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    Step-by-step guide for what to do within 24 hours after your exam. Covers writing down everything the examiner said and did, documenting exam duration and any red flags, requesting the completed DBQ copy immediately, and how to file a complaint if the exam was inadequate.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Condition for Exam Prep</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={conditionId} onValueChange={setConditionId}>
            <SelectTrigger data-testid="select-cnp-condition">
              <SelectValue placeholder="Choose which condition your C&P exam is for" />
            </SelectTrigger>
            <SelectContent>
              {conditionsList.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.conditionName}
                  {c.diagnosticCode ? ` (DC ${c.diagnosticCode})` : ""}
                  {c.currentRating ? ` — ${c.currentRating}%` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleGenerate}
            disabled={prepMutation.isPending || !conditionId || !isProOrAbove}
            className="w-full"
            data-testid="button-generate-prep"
          >
            {prepMutation.isPending ? (
              <>
                <ClipboardCheck className="w-4 h-4 mr-2 animate-pulse" />
                Generating Prep Guide...
              </>
            ) : !isProOrAbove ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pro Subscription Required
              </>
            ) : (
              <>
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Generate C&P Exam Prep
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {prepMutation.isPending && (
        <Card>
          <CardContent className="pt-6">
            <ThinkingSteps
              isActive={prepMutation.isPending}
              steps={PREP_STEPS}
              delays={PREP_DELAYS}
            />
          </CardContent>
        </Card>
      )}

      {result && (
        <>
          <div className="space-y-3">
            {!result.hasNexusLetter && (
              <Card className="border-yellow-500/40 bg-yellow-500/5" data-testid="card-nexus-warning">
                <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm" data-testid="text-nexus-warning">No Nexus Letter Found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You don't have a nexus letter for {result.conditionName}. A nexus letter from a medical professional significantly strengthens your claim at the C&P exam.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2"
                        onClick={() => {
                          const params = new URLSearchParams();
                          params.set("type", "nexus_letter");
                          params.set("condition", result.conditionName);
                          navigate(`/generate?${params.toString()}`);
                        }}
                        data-testid="button-generate-nexus"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Generate Nexus Letter Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-primary/20 bg-primary/5" data-testid="card-buddy-recommendation">
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm" data-testid="text-buddy-recommendation">Buddy Letter Recommendation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      A buddy letter corroborating your {result.conditionName} symptoms can be submitted alongside your C&P exam results. Have a fellow service member or family member describe what they've witnessed.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.set("type", "buddy_letter");
                        params.set("condition", result.conditionName);
                        navigate(`/generate?${params.toString()}`);
                      }}
                      data-testid="button-generate-buddy"
                    >
                      <Users className="w-3 h-3 mr-1" />
                      Generate Buddy Letter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="prep-guide" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="prep-guide" className="flex-1" data-testid="tab-prep-guide">
                Full Prep Guide
              </TabsTrigger>
              <TabsTrigger value="cheat-sheet" className="flex-1" data-testid="tab-cheat-sheet">
                Exam Day One-Pager
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prep-guide">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg">
                      C&P Exam Preparation Guide — {result.conditionName}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(result.prepGuide, "Prep guide")}
                        data-testid="button-copy-prep"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(result.prepGuide, `CNP_Prep_${result.conditionName.replace(/\s+/g, "_")}.txt`)}
                        data-testid="button-download-prep"
                      >
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-md bg-muted/30 border border-border whitespace-pre-wrap font-mono text-sm leading-relaxed"
                    data-testid="text-prep-guide-content"
                  >
                    {result.prepGuide}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cheat-sheet">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Printer className="w-5 h-5 text-primary" />
                      Bring This to Your Exam
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handlePrint(result.cheatSheet)}
                        data-testid="button-print-cheatsheet"
                      >
                        <Printer className="w-3 h-3 mr-1" /> Print
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopy(result.cheatSheet, "Cheat sheet")}
                        data-testid="button-copy-cheatsheet"
                      >
                        <Copy className="w-3 h-3 mr-1" /> Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(result.cheatSheet, `CNP_CheatSheet_${result.conditionName.replace(/\s+/g, "_")}.txt`)}
                        data-testid="button-download-cheatsheet"
                      >
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-sm dark:prose-invert max-w-none p-4 rounded-md bg-white dark:bg-muted/10 border-2 border-primary/20 whitespace-pre-wrap font-mono text-sm leading-relaxed"
                    data-testid="text-cheatsheet-content"
                  >
                    {result.cheatSheet}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 italic text-center">
                    Print this page and bring it to your C&P exam. Review it in the waiting room.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

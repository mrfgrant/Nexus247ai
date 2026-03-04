import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Star, Shield, ChevronDown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { RpaScoringModal } from "@/components/rpa-scoring-modal";

const tiers = [
  {
    name: "Basic",
    price: "$19",
    tier: "basic",
    description: "Get started with essential claim tools",
    features: [
      {
        text: "5 AI-generated letters per month",
        included: true,
        detail: "Generate nexus letters, personal statements, buddy letters, NODs, secondary condition letters, and increase claim letters — all grounded in 38 CFR citations and scored for rater readiness.",
      },
      {
        text: "Nexus, personal statements, buddy letters",
        included: true,
        detail: "Each letter is tailored to your specific condition, service history, and medical records. Nexus letters are concise and formatted for a real medical professional to sign.",
      },
      {
        text: "NODs and secondary condition letters",
        included: true,
        detail: "Notices of Disagreement cite specific rater errors and CFR violations. Secondary condition letters establish the medical link between your service-connected and secondary conditions.",
      },
      {
        text: "Increase claim letters",
        included: true,
        detail: "Built around the DBQ scoring criteria for your specific diagnostic code, citing the exact rating thresholds from 38 CFR Part 4 that justify a higher rating.",
      },
      {
        text: "2 decision letter analyses per month",
        included: true,
        detail: "Upload your VA decision letter and get an AI breakdown of denial reasons, rater errors, missed evidence, CFR violations, and recommended next steps.",
      },
      {
        text: "Rating estimator",
        included: true,
        detail: "Calculate your combined VA disability rating using the bilateral factor and VA math. See your estimated monthly compensation at 2026 COLA rates.",
      },
      {
        text: "AI Claims Chat",
        included: true,
        detail: "Ask questions about VA claims, CFR regulations, appeals strategies, and your specific case. The advisor references your profile and conditions.",
      },
      {
        text: "RPA quality scoring on every letter",
        included: true,
        detail: "Every generated document is scored across 4 dimensions: CFR citation accuracy, evidence strength, nexus clarity, and rater readiness — with specific improvement suggestions.",
      },
      { text: "C&P Exam Prep", included: false, detail: "Available on Pro and above. Get a personalized 8-section preparation guide and printable exam day cheat sheet for your C&P exam." },
      { text: "AOD Motions", included: false, detail: "Available on Concierge. Advance on Docket motions under 38 CFR § 20.900(c) for expediting your appeal." },
      { text: "Good Cause Letters", included: false, detail: "Available on Concierge. Letters establishing good cause for late filing under 38 U.S.C. § 7107." },
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    tier: "pro",
    description: "For veterans serious about winning claims",
    features: [
      {
        text: "50 AI-generated letters per month",
        included: true,
        detail: "Ten times the Basic limit. Generate letters for multiple conditions, iterations, and appeals without worrying about running out.",
      },
      {
        text: "All Basic document types",
        included: true,
        detail: "Every document type available in Basic — nexus letters, personal statements, buddy letters, NODs, secondary condition letters, and increase claims.",
      },
      {
        text: "10 decision letter analyses per month",
        included: true,
        detail: "Five times the Basic limit. Analyze multiple decision letters, track patterns across denials, and build a comprehensive appeal strategy.",
      },
      {
        text: "C&P Exam Prep with printable cheat sheet",
        included: true,
        detail: "A personalized 8-section preparation guide covering examiner questions, DBQ scoring criteria, worst-day symptom descriptions, and red flags for bad faith exams. Plus a printable one-pager you bring to the exam.",
      },
      {
        text: "Smart document gap alerts",
        included: true,
        detail: "Before your C&P exam, the system checks if you're missing a nexus letter or buddy letter for that condition and lets you generate them with one click.",
      },
      {
        text: "Cross-reference evidence analysis",
        included: true,
        detail: "Compares your uploaded medical records against decision letter findings to identify evidence gaps, calculate win probabilities, and recommend specific medical tests or documentation needed.",
      },
      {
        text: "AI Claims Chat with medical records context",
        included: true,
        detail: "The AI advisor reads your uploaded medical records and decision letter analysis, giving advice specific to your actual evidence — not generic guidance.",
      },
      {
        text: "RPA quality scoring on every letter",
        included: true,
        detail: "Same 4-dimension scoring as Basic with detailed improvement suggestions to strengthen each document before submission.",
      },
      { text: "AOD Motions", included: false, detail: "Available on Concierge. Advance on Docket motions under 38 CFR § 20.900(c) for expediting your appeal." },
      { text: "Good Cause Letters", included: false, detail: "Available on Concierge. Letters establishing good cause for late filing under 38 U.S.C. § 7107." },
    ],
    popular: true,
  },
  {
    name: "Concierge",
    price: "$149",
    tier: "concierge",
    description: "White-glove service for complex claims",
    features: [
      {
        text: "Unlimited AI-generated letters",
        included: true,
        detail: "No monthly limits. Generate as many documents as you need — iterate on nexus letters, create statements for every condition, build a complete claims package.",
      },
      {
        text: "All Pro features",
        included: true,
        detail: "Everything in Pro including C&P Exam Prep, cross-reference analysis, smart document gap alerts, and AI chat with full medical records context.",
      },
      {
        text: "50 decision letter analyses per month",
        included: true,
        detail: "Analyze every decision letter in your claims history. Build a comprehensive picture of rater patterns, recurring errors, and systemic issues across your entire case.",
      },
      {
        text: "50 C&P Exam Prep guides per month",
        included: true,
        detail: "Prepare for every exam across all your conditions. Generate updated prep guides as your evidence evolves.",
      },
      {
        text: "AOD Motions (38 CFR § 20.900(c))",
        included: true,
        detail: "Advance on Docket motions to expedite your appeal when you meet the criteria — financial hardship, serious illness, or advanced age. CFR-grounded and ready to file.",
      },
      {
        text: "Good Cause Letters (38 U.S.C. § 7107)",
        included: true,
        detail: "Establish good cause for late evidence submission or missed deadlines. Cites the specific statutory requirements and frames your circumstances persuasively.",
      },
      {
        text: "Priority human expert review",
        included: true,
        detail: "Your generated documents are reviewed by a claims specialist who provides feedback on strategy, evidence gaps, and submission timing.",
      },
      {
        text: "1-on-1 claims strategy sessions",
        included: true,
        detail: "Schedule a session with a claims advisor to discuss your overall strategy, prioritize conditions, and plan your appeals approach.",
      },
      {
        text: "Priority support response",
        included: true,
        detail: "Your support requests are handled first, with faster turnaround on questions and technical issues.",
      },
    ],
    popular: false,
  },
];

function FeatureItem({ feature, onRpaClick }: { feature: { text: string; included: boolean; detail?: string }; onRpaClick?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!feature.detail;
  const isRpa = feature.text.toLowerCase().includes("rpa quality scoring");

  return (
    <li className="text-sm">
      <button
        type="button"
        onClick={() => {
          if (isRpa && onRpaClick) {
            onRpaClick();
          } else if (hasDetail) {
            setExpanded(!expanded);
          }
        }}
        className={`flex items-start gap-2 w-full text-left ${hasDetail || isRpa ? "cursor-pointer" : "cursor-default"}`}
        data-testid={`feature-${feature.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`}
      >
        {feature.included ? (
          <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
        )}
        <span className={`flex-1 ${feature.included ? "text-foreground" : "text-muted-foreground/60"} ${isRpa ? "underline decoration-primary/50 underline-offset-2" : ""}`}>
          {feature.text}
        </span>
        {hasDetail && !isRpa && (
          <ChevronDown
            className={`w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
          />
        )}
      </button>
      {expanded && feature.detail && !isRpa && (
        <p className="text-xs text-muted-foreground mt-1.5 ml-6 leading-relaxed">
          {feature.detail}
        </p>
      )}
    </li>
  );
}

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [rpaModalOpen, setRpaModalOpen] = useState(false);
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  const checkoutMutation = useMutation({
    mutationFn: async (tier: string) => {
      const res = await apiRequest("POST", "/api/create-checkout-session", { tier });
      return res.json();
    },
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe") === "cancelled") {
      toast({
        title: "Payment cancelled",
        description: "You can try again whenever you're ready.",
      });
    }
  }, []);

  const currentTier = profile?.subscriptionTier || "none";

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-pricing-title">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Every plan includes RPA quality scoring, AI Claims Chat, and CFR-grounded letter generation. Click any feature to learn more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {tiers.map((tier) => {
          const isCurrent = currentTier === tier.tier;
          return (
            <Card
              key={tier.name}
              className={`relative hover-elevate ${tier.popular ? "ring-2 ring-primary" : ""}`}
              data-testid={`card-tier-${tier.tier}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge><Star className="w-3 h-3 mr-1" /> Most Popular</Badge>
                </div>
              )}
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                    {isCurrent && <Badge variant="outline" className="text-xs">Current</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <FeatureItem key={feature.text} feature={feature} onRpaClick={() => setRpaModalOpen(true)} />
                  ))}
                </ul>
                {isCurrent ? (
                  <Button className="w-full" variant="outline" disabled>
                    <Shield className="w-4 h-4 mr-2" /> Current Plan
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={tier.popular ? "default" : "outline"}
                    data-testid={`button-select-${tier.tier}`}
                    disabled={checkoutMutation.isPending}
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = "/api/login";
                      } else {
                        checkoutMutation.mutate(tier.tier);
                      }
                    }}
                  >
                    {checkoutMutation.isPending && checkoutMutation.variables === tier.tier ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    {currentTier === "none" ? `Start ${tier.name}` : `Upgrade to ${tier.name}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a legal disclaimer on every generated document.
            Nexus247 is not a law firm and does not provide legal advice.
            Cancel anytime. No long-term contracts.
          </p>
        </CardContent>
      </Card>

      <RpaScoringModal open={rpaModalOpen} onOpenChange={setRpaModalOpen} authenticated />
    </div>
  );
}

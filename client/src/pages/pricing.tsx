import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Lock, Star, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const tiers = [
  {
    name: "Basic",
    price: "$19",
    tier: "basic",
    description: "Get started with essential claim tools",
    features: [
      { text: "5 AI-generated letters per month", included: true },
      { text: "Nexus, personal statements, buddy letters", included: true },
      { text: "NODs and secondary condition letters", included: true },
      { text: "Increase claim letters", included: true },
      { text: "2 decision letter analyses per month", included: true },
      { text: "Rating estimator", included: true },
      { text: "AI Claims Chat", included: true },
      { text: "RPA quality scoring on every letter", included: true },
      { text: "C&P Exam Prep", included: false },
      { text: "AOD Motions", included: false },
      { text: "Good Cause Letters", included: false },
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    tier: "pro",
    description: "For veterans serious about winning claims",
    features: [
      { text: "50 AI-generated letters per month", included: true },
      { text: "All Basic document types", included: true },
      { text: "10 decision letter analyses per month", included: true },
      { text: "C&P Exam Prep with printable cheat sheet", included: true },
      { text: "Smart document gap alerts", included: true },
      { text: "Cross-reference evidence analysis", included: true },
      { text: "AI Claims Chat with medical records context", included: true },
      { text: "RPA quality scoring on every letter", included: true },
      { text: "AOD Motions", included: false },
      { text: "Good Cause Letters", included: false },
    ],
    popular: true,
  },
  {
    name: "Concierge",
    price: "$149",
    tier: "concierge",
    description: "White-glove service for complex claims",
    features: [
      { text: "Unlimited AI-generated letters", included: true },
      { text: "All Pro features", included: true },
      { text: "50 decision letter analyses per month", included: true },
      { text: "50 C&P Exam Prep guides per month", included: true },
      { text: "AOD Motions (38 CFR § 20.900(c))", included: true },
      { text: "Good Cause Letters (38 U.S.C. § 7107)", included: true },
      { text: "Priority human expert review", included: true },
      { text: "1-on-1 claims strategy sessions", included: true },
      { text: "Priority support response", included: true },
    ],
    popular: false,
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const { data: profile } = useQuery<any>({
    queryKey: ["/api/profile"],
    enabled: isAuthenticated,
  });

  const currentTier = profile?.subscriptionTier || "none";

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-pricing-title">
          Choose Your Plan
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-2 max-w-lg mx-auto">
          Every plan includes RPA quality scoring, AI Claims Chat, and CFR-grounded letter generation.
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
                    <li key={feature.text} className="flex items-start gap-2 text-sm">
                      {feature.included ? (
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                      )}
                      <span className={feature.included ? "text-foreground" : "text-muted-foreground/60"}>
                        {feature.text}
                      </span>
                    </li>
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
                  >
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
    </div>
  );
}

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CheckCircle, Lock, Star, Shield, Loader2 } from "lucide-react";
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
      },
      {
        text: "Nexus, personal statements, buddy letters",
        included: true,
      },
      {
        text: "NODs and secondary condition letters",
        included: true,
      },
      {
        text: "Increase claim letters",
        included: true,
      },
      {
        text: "2 decision letter analyses per month",
        included: true,
      },
      {
        text: "Rating estimator",
        included: true,
      },
      {
        text: "AI Claims Chat",
        included: true,
      },
      {
        text: "RPA quality scoring on every letter",
        included: true,
      },
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
      {
        text: "50 AI-generated letters per month",
        included: true,
      },
      {
        text: "All Basic document types",
        included: true,
      },
      {
        text: "C&P Exam Prep with printable cheat sheet",
        included: true,
      },
      {
        text: "10 decision letter analyses per month",
        included: true,
      },
      {
        text: "Cross-reference evidence analysis",
        included: true,
      },
      {
        text: "Smart document gap alerts",
        included: true,
      },
      {
        text: "AI Claims Chat with medical records context",
        included: true,
      },
      {
        text: "RPA quality scoring on every letter",
        included: true,
      },
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
      {
        text: "Unlimited AI-generated letters",
        included: true,
      },
      {
        text: "All Pro features",
        included: true,
      },
      {
        text: "50 decision letter analyses per month",
        included: true,
      },
      {
        text: "50 C&P Exam Prep guides per month",
        included: true,
      },
      {
        text: "AOD Motions (38 CFR § 20.900(c))",
        included: true,
      },
      {
        text: "Good Cause Letters (38 U.S.C. § 7107)",
        included: true,
      },
      {
        text: "Priority human expert review",
        included: true,
      },
      {
        text: "1-on-1 claims strategy sessions",
        included: true,
      },
      {
        text: "Priority support response",
        included: true,
      },
    ],
    popular: false,
  },
];

function FeatureItem({ feature, onRpaClick }: { feature: { text: string; included: boolean }; onRpaClick?: () => void }) {
  const isRpa = feature.text.toLowerCase().includes("rpa quality scoring");

  return (
    <li
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        fontSize: "0.88rem",
        lineHeight: 1.5,
        cursor: isRpa ? "pointer" : "default",
      }}
      onClick={isRpa && onRpaClick ? onRpaClick : undefined}
      data-testid={`feature-${feature.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`}
    >
      {feature.included ? (
        <CheckCircle style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, color: "var(--gold)" }} />
      ) : (
        <Lock style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0, color: "rgba(255,255,255,0.25)" }} />
      )}
      <span style={{
        color: feature.included ? "rgba(255,255,255,0.88)" : "rgba(255,255,255,0.35)",
        ...(isRpa ? { textDecoration: "underline", textDecorationColor: "var(--gold)", textUnderlineOffset: 3 } : {}),
      }}>
        {feature.text}
      </span>
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
    <div style={{ padding: "32px 16px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "var(--foreground)",
            marginBottom: 8,
          }}
          data-testid="text-pricing-title"
        >
          Choose Your Plan
        </h1>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", maxWidth: 520, margin: "0 auto" }}>
          Every plan includes RPA quality scoring, AI Claims Chat, and CFR-grounded letter generation.
        </p>
        <p
          style={{
            color: "#D4A43E",
            fontSize: "1rem",
            fontWeight: 600,
            marginTop: 14,
          }}
          data-testid="text-trial-messaging"
        >
          Start with a free 3-day Pro trial — no credit card required.
        </p>
      </div>

      <div className="pricing-grid" style={{ display: "grid", gap: 24, alignItems: "start" }}>
        {tiers.map((tier) => {
          const isCurrent = currentTier === tier.tier;
          return (
            <div
              key={tier.name}
              data-testid={`card-tier-${tier.tier}`}
              style={{
                position: "relative",
                backgroundColor: "#0D2137",
                backgroundImage: "linear-gradient(170deg, #0D2137 0%, #132c47 50%, #0D2137 100%)",
                borderRadius: 12,
                border: tier.popular ? "2px solid var(--gold)" : "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                transition: "transform 0.25s, box-shadow 0.25s",
              }}
              className="pricing-card"
            >
              {tier.popular && (
                <div style={{
                  position: "absolute",
                  top: -1,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--gold)",
                  color: "#0D2137",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  padding: "6px 20px",
                  borderRadius: "0 0 6px 6px",
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ padding: tier.popular ? "52px 28px 36px" : "36px 28px" }}>
                <div style={{ marginBottom: 24 }}>
                  <h3 style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 16,
                  }}>
                    {tier.name}
                    {isCurrent && (
                      <span style={{
                        marginLeft: 10,
                        fontSize: "0.6rem",
                        color: "#fff",
                        background: "rgba(255,255,255,0.12)",
                        padding: "2px 8px",
                        borderRadius: 3,
                        letterSpacing: "0.1em",
                      }}>
                        CURRENT
                      </span>
                    )}
                  </h3>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                    <span style={{
                      fontFamily: "'DM Serif Display', serif",
                      fontSize: "2.8rem",
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1,
                    }}>
                      {tier.price}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>/month</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                    {tier.description}
                  </p>
                  {tier.tier === "pro" && (
                    <p
                      style={{
                        color: "#D4A43E",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        marginTop: 8,
                        letterSpacing: "0.03em",
                      }}
                      data-testid="text-pro-trial-badge"
                    >
                      Includes 3-day free trial
                    </p>
                  )}
                </div>

                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                  paddingTop: 20,
                  marginBottom: 28,
                }}>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {tier.features.map((feature) => (
                      <FeatureItem key={feature.text} feature={feature} onRpaClick={() => setRpaModalOpen(true)} />
                    ))}
                  </ul>
                </div>

                {isCurrent ? (
                  <button
                    disabled
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.4)",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "not-allowed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    <Shield style={{ width: 14, height: 14 }} /> Current Plan
                  </button>
                ) : (
                  <button
                    data-testid={`button-select-${tier.tier}`}
                    disabled={checkoutMutation.isPending}
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = "/api/login";
                      } else {
                        checkoutMutation.mutate(tier.tier);
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      borderRadius: 8,
                      border: "none",
                      background: tier.popular
                        ? "linear-gradient(135deg, var(--gold) 0%, #c4942e 100%)"
                        : "rgba(255,255,255,0.06)",
                      color: tier.popular ? "#0D2137" : "#fff",
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: checkoutMutation.isPending ? "wait" : "pointer",
                      transition: "background 0.2s, transform 0.15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    className="pricing-cta"
                  >
                    {checkoutMutation.isPending && checkoutMutation.variables === tier.tier ? (
                      <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />
                    ) : null}
                    {tier.tier === "pro" && currentTier === "none"
                      ? "START MY FREE TRIAL"
                      : currentTier === "none"
                        ? `Start ${tier.name}`
                        : `Upgrade to ${tier.name}`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        marginTop: 36,
        textAlign: "center",
        padding: "18px 24px",
        background: "rgba(13,33,55,0.04)",
        borderRadius: 10,
        border: "1px solid rgba(13,33,55,0.08)",
      }}>
        <p style={{ fontSize: "0.82rem", color: "var(--muted-foreground)", lineHeight: 1.6 }}>
          All plans include a legal disclaimer on every generated document.
          Nexus247 is not a law firm and does not provide legal advice.
          Cancel anytime. No long-term contracts.
        </p>
      </div>

      <RpaScoringModal open={rpaModalOpen} onOpenChange={setRpaModalOpen} authenticated />

      <style>{`
        .pricing-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 900px) {
          .pricing-grid {
            grid-template-columns: 1fr !important;
            max-width: 420px;
            margin-left: auto;
            margin-right: auto;
          }
        }
        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.25);
        }
        .pricing-cta:hover:not(:disabled) {
          filter: brightness(1.08);
          transform: scale(1.01);
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

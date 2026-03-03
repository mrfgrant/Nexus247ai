import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  FileText,
  MessageCircle,
  Calculator,
  Star,
  CheckCircle,
  ArrowRight,
  Lock,
  Scale,
  Brain,
} from "lucide-react";
import logoFull from "@assets/Nexus247_Logo_Name_1772555424645.png";

const features = [
  {
    icon: FileText,
    title: "CFR-Grounded Letters",
    description:
      "Nexus letters, personal statements, NODs, and more — each citing specific 38 CFR sections that VA raters look for.",
  },
  {
    icon: Brain,
    title: "Trained on Real Decisions",
    description:
      "Our AI learns from actual VA approvals and denials to understand how raters think and what arguments win claims.",
  },
  {
    icon: Scale,
    title: "RPA Quality Scoring",
    description:
      "Every letter is scored on 5 dimensions — CFR compliance, evidence strength, nexus quality, and rater readiness.",
  },
  {
    icon: MessageCircle,
    title: "AI Claims Advisor",
    description:
      "Get instant answers about your claim, C&P exam prep, filing strategy, and appeal options from our AI advisor.",
  },
  {
    icon: Calculator,
    title: "Rating Estimator",
    description:
      "Calculate your combined VA disability rating using the official whole-person method and see estimated monthly benefits.",
  },
  {
    icon: Shield,
    title: "Human Expert Support",
    description:
      "Request manual review from claims experts when you need human guidance on complex cases.",
  },
];

const tiers = [
  {
    name: "Basic",
    price: "$19",
    period: "/month",
    description: "Get started with essential claim tools",
    features: [
      "5 AI-generated letters per month",
      "Nexus, personal statements, buddy letters",
      "NODs and secondary condition letters",
      "Rating estimator",
      "AI Claims Chat",
      "RPA quality scoring",
    ],
    cta: "Start Basic",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "Everything in Basic, plus more",
    features: [
      "50 AI-generated letters per month",
      "All Basic features",
      "Priority support response",
      "Advanced knowledge base access",
      "Detailed improvement suggestions",
    ],
    cta: "Start Pro",
    popular: true,
  },
  {
    name: "Concierge",
    price: "$149",
    period: "/month",
    description: "White-glove service for complex claims",
    features: [
      "Unlimited AI-generated letters",
      "All Pro features",
      "AOD Motions & Good Cause Letters",
      "Priority human expert review",
      "1-on-1 claims strategy sessions",
    ],
    cta: "Start Concierge",
    popular: false,
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <img src={logoFull} alt="Nexus247" className="h-10" data-testid="img-landing-logo" />
        </div>
        <div className="flex items-center gap-3">
          <a href="/api/login">
            <Button variant="outline" data-testid="button-login">
              Log In
            </Button>
          </a>
          <a href="/api/login">
            <Button data-testid="button-get-started">Get Started</Button>
          </a>
        </div>
      </nav>

      <section className="relative py-20 px-6 text-center bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-3xl mx-auto space-y-6">
          <Badge variant="secondary" className="text-sm">
            <Star className="w-3 h-3 mr-1" />
            Trusted by Veterans Nationwide
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Win Your VA Claim with{" "}
            <span className="text-primary">AI-Powered</span> Letters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Generate professional nexus letters, personal statements, and NODs
            grounded in{" "}
            <strong>38 CFR regulations</strong> and trained on real rater
            decisions. Every letter is scored for quality before you submit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href="/api/login">
              <Button size="lg" data-testid="button-hero-cta">
                Start Your Claim
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href="#pricing">
              <Button variant="outline" size="lg" data-testid="button-view-pricing">
                View Pricing
              </Button>
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Encrypted & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span>38 CFR Grounded</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Everything You Need to Win Your Claim
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Professional-grade tools designed by claims experts, powered by AI
              that learns from real VA decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover-elevate">
                <CardContent className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-3 text-muted-foreground">
              Choose the plan that fits your claims needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative hover-elevate ${tier.popular ? "ring-2 ring-primary" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge>Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {tier.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tier.description}
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-foreground">
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a href="/api/login">
                    <Button
                      className="w-full"
                      variant={tier.popular ? "default" : "outline"}
                      data-testid={`button-${tier.name.toLowerCase()}-cta`}
                    >
                      {tier.cta}
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <Shield className="w-10 h-10 mx-auto text-primary" />
          <h2 className="text-2xl font-bold text-foreground">
            Legal Disclaimer
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Nexus247 generates AI-assisted draft documents intended as
            templates. We are not a law firm and do not provide legal advice.
            Review all documents before submission and consider consulting an
            accredited VA claims agent or attorney. No guarantee of claim
            outcomes is expressed or implied. All veteran data is encrypted at
            rest and in transit per HIPAA standards.
          </p>
        </div>
      </section>

      <footer className="py-8 px-6 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>Nexus247.ai. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>HIPAA Notice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

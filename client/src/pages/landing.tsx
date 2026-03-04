import { useState } from "react";
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
  ChevronDown,
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
      { text: "5 AI-generated letters per month", detail: "Nexus letters, personal statements, buddy letters, NODs, secondary condition letters, and increase claims — all CFR-grounded and scored for quality." },
      { text: "Nexus, personal statements, buddy letters", detail: "Each letter is tailored to your specific condition, service history, and medical records. Nexus letters are concise and ready for a medical professional to sign." },
      { text: "NODs and secondary condition letters", detail: "Notices of Disagreement cite specific rater errors and CFR violations. Secondary condition letters establish the medical link between conditions." },
      { text: "2 decision letter analyses per month", detail: "Upload your VA decision letter and get an AI breakdown of denial reasons, rater errors, missed evidence, and recommended next steps." },
      { text: "Rating estimator", detail: "Calculate your combined VA disability rating with 2026 COLA rates and SMC eligibility check." },
      { text: "AI Claims Chat", detail: "Ask questions about VA claims, CFR regulations, and appeals strategies. The advisor references your profile and conditions." },
      { text: "RPA quality scoring", detail: "Every document is scored on CFR accuracy, evidence strength, nexus clarity, and rater readiness — with specific improvement suggestions." },
    ],
    cta: "Start Basic",
    popular: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    description: "For veterans serious about winning claims",
    features: [
      { text: "50 AI-generated letters per month", detail: "Ten times the Basic limit. Generate letters for multiple conditions and iterations without worrying about running out." },
      { text: "All Basic features", detail: "Every document type, rating estimator, AI chat, and RPA quality scoring included." },
      { text: "C&P Exam Prep with printable cheat sheet", detail: "A personalized 8-section prep guide covering examiner questions, DBQ scoring criteria, worst-day symptom descriptions, and a printable one-pager to bring to your exam." },
      { text: "10 decision letter analyses per month", detail: "Analyze multiple decision letters, track patterns across denials, and build a comprehensive appeal strategy." },
      { text: "Cross-reference evidence analysis", detail: "Compares your medical records against decision letter findings to identify evidence gaps and calculate win probabilities." },
      { text: "Smart document gap alerts", detail: "Before your C&P exam, checks if you're missing a nexus letter or buddy letter and lets you generate them with one click." },
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
      { text: "Unlimited AI-generated letters", detail: "No monthly limits. Generate as many documents as you need for every condition and appeal." },
      { text: "All Pro features", detail: "Everything in Pro including C&P Exam Prep, cross-reference analysis, smart gap alerts, and AI chat with full medical records context." },
      { text: "50 C&P Exam Prep guides per month", detail: "Prepare for every exam across all your conditions. Generate updated prep guides as your evidence evolves." },
      { text: "AOD Motions & Good Cause Letters", detail: "Advance on Docket motions under 38 CFR § 20.900(c) and Good Cause letters under 38 U.S.C. § 7107 — exclusive to Concierge." },
      { text: "Priority human expert review", detail: "Your documents are reviewed by a claims specialist who provides feedback on strategy, evidence gaps, and submission timing." },
      { text: "1-on-1 claims strategy sessions", detail: "Schedule a session with a claims advisor to discuss your overall strategy and plan your appeals approach." },
    ],
    cta: "Start Concierge",
    popular: false,
  },
];

function LandingFeatureItem({ feature }: { feature: { text: string; detail: string } }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <li className="text-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-start gap-2 w-full text-left cursor-pointer"
      >
        <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <span className="flex-1 text-foreground">{feature.text}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground/50 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <p className="text-xs text-muted-foreground mt-1.5 ml-6 leading-relaxed">
          {feature.detail}
        </p>
      )}
    </li>
  );
}

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
                      <LandingFeatureItem key={feature.text} feature={feature} />
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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import {
  Lock,
  ArrowRight,
  FileText,
  Download,
  Shield,
  MessageSquare,
  Calculator,
  CheckCircle2,
} from "lucide-react";

const SCORE_DIMENSIONS = [
  { key: "cfrScore", label: "CFR Compliance" },
  { key: "nexusScore", label: "Nexus Strength" },
  { key: "evidenceScore", label: "Evidence Grounding" },
  { key: "raterReadinessScore", label: "Rater Readiness" },
] as const;

const PRICING_CHIPS = [
  { name: "Starter", price: "$29", period: "/mo" },
  { name: "Pro", price: "$49", period: "/mo" },
  { name: "Concierge", price: "$149", period: "/mo" },
];

const UNLOCK_ITEMS_LEFT = [
  { icon: FileText, text: "Complete letter with CFR citations" },
  { icon: CheckCircle2, text: "Watermark removed" },
  { icon: Download, text: "Downloadable PDF" },
];

const UNLOCK_ITEMS_RIGHT = [
  { icon: Shield, text: "RPA score report saved" },
  { icon: MessageSquare, text: "AI Claims Advisor access" },
  { icon: Calculator, text: "Rating estimator" },
];

interface TrialLetterPreviewProps {
  document: {
    title?: string;
    type?: string;
    overallScore?: number;
    cfrScore?: number;
    nexusScore?: number;
    evidenceScore?: number;
    raterReadinessScore?: number;
  };
  previewContent: string;
  veteranName: string;
  conditionName: string;
}

function AnimatedScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [dashOffset, setDashOffset] = useState(circumference);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashOffset(circumference - (circumference * score) / 100);
    }, 300);

    let current = 0;
    const increment = score / 40;
    const counter = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(counter);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 25);

    return () => {
      clearTimeout(timer);
      clearInterval(counter);
    };
  }, [score, circumference]);

  const scoreColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: scoreColor }} data-testid="text-animated-score">
          {animatedScore}
        </span>
        <span className="text-xs" style={{ color: "rgba(250,250,247,0.6)" }}>
          / 100
        </span>
      </div>
    </div>
  );
}

function AnimatedBar({
  score,
  label,
  delay,
}: {
  score: number;
  label: string;
  delay: number;
}) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), delay);
    return () => clearTimeout(timer);
  }, [score, delay]);

  const barColor = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span style={{ color: "rgba(250,250,247,0.75)" }}>{label}</span>
        <span className="font-semibold" style={{ color: barColor }}>
          {score}
        </span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${width}%`,
            background: barColor,
            transition: "width 1s ease-out",
          }}
        />
      </div>
    </div>
  );
}

export function TrialLetterPreview({
  document: doc,
  previewContent,
  veteranName,
  conditionName,
}: TrialLetterPreviewProps) {
  const overallScore = doc.overallScore || 0;

  const blurredPlaceholder = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

Pursuant to 38 CFR § 3.303(a), the veteran's condition is service-connected based on the following evidence and medical nexus established during active duty service. The medical evidence of record demonstrates a clear and unmistakable relationship between the current diagnosis and the in-service event, injury, or illness documented in the service treatment records.

The veteran's treating physician has provided a medical opinion stating that it is at least as likely as not that the current condition was incurred in or caused by the veteran's military service. This opinion is supported by the veteran's service treatment records, post-service medical records, and the current clinical findings.

Furthermore, the Board of Veterans' Appeals has consistently held that lay testimony regarding observable symptoms is competent evidence that may be considered in evaluating a claim for service connection under 38 U.S.C. § 1110.`;

  return (
    <div className="space-y-4" data-testid="trial-letter-preview">
      <div
        className="rounded-md p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, #0D2137 0%, #163352 55%, #1a3d60 100%)",
        }}
        data-testid="section-score-header"
      >
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <AnimatedScoreRing score={overallScore} />
          <div className="flex-1 w-full space-y-3">
            <div className="space-y-2.5">
              {SCORE_DIMENSIONS.map((dim, i) => (
                <AnimatedBar
                  key={dim.key}
                  score={(doc as any)[dim.key] || 0}
                  label={dim.label}
                  delay={400 + i * 200}
                />
              ))}
            </div>
            {overallScore >= 70 && (
              <Badge
                className="no-default-hover-elevate no-default-active-elevate"
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.3)",
                }}
                data-testid="badge-threshold"
              >
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Scores Above Submission Threshold
              </Badge>
            )}
          </div>
        </div>
        <div
          className="mt-4 pt-3 flex flex-wrap items-center gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(250,250,247,0.6)" }}
          data-testid="section-doc-meta"
        >
          {veteranName && <span>{veteranName}</span>}
          {conditionName && (
            <>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span>{conditionName}</span>
            </>
          )}
          {doc.type && (
            <>
              <span style={{ color: "rgba(255,255,255,0.2)" }}>|</span>
              <span className="capitalize">{doc.type?.replace(/_/g, " ")}</span>
            </>
          )}
        </div>
      </div>

      <div
        className="rounded-md p-4"
        style={{
          background: "rgba(212,164,62,0.08)",
          border: "1px solid rgba(212,164,62,0.35)",
        }}
        data-testid="section-trial-banner"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground" data-testid="text-trial-banner-title">
              Trial Preview
            </p>
            <p className="text-xs text-muted-foreground mt-0.5" data-testid="text-trial-banner-desc">
              Your letter scored {overallScore}/100 and is ready to submit. The first paragraph is shown below. Unlock the full letter to access all CFR citations and submit to the VA.
            </p>
          </div>
          <Link href="/pricing">
            <Button
              style={{
                background: "#D4A43E",
                color: "#0D2137",
                borderColor: "#D4A43E",
              }}
              className="whitespace-nowrap"
              data-testid="button-unlock-banner"
            >
              Unlock Full Letter
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div
        className="relative rounded-md border border-border bg-card"
        onContextMenu={(e) => e.preventDefault()}
        data-testid="section-letter-paper"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {[
            { top: "8%", left: "5%", rotate: -35 },
            { top: "30%", left: "55%", rotate: -35 },
            { top: "55%", left: "15%", rotate: -35 },
            { top: "75%", left: "60%", rotate: -35 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute whitespace-nowrap text-xs font-bold tracking-widest uppercase"
              style={{
                top: pos.top,
                left: pos.left,
                transform: `rotate(${pos.rotate}deg)`,
                color: "rgba(212,164,62,0.08)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
              }}
            >
              TRIAL — Nexus247.ai — Not for Submission
            </div>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          <div
            className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground"
            data-testid="text-preview-content"
          >
            {previewContent}
          </div>

          <div className="relative mt-4">
            <div
              className="absolute inset-x-0 top-0 h-16 z-10"
              style={{
                background: "linear-gradient(to bottom, hsl(var(--card)), transparent)",
              }}
            />
            <div
              className="font-mono text-sm leading-relaxed overflow-hidden"
              style={{
                filter: "blur(5px)",
                userSelect: "none",
                maxHeight: "280px",
                color: "hsl(var(--muted-foreground))",
              }}
              aria-hidden="true"
              data-testid="text-blurred-content"
            >
              {blurredPlaceholder}
            </div>

            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Card className="max-w-sm w-full mx-4">
                <CardContent className="p-5 text-center space-y-3">
                  <div
                    className="mx-auto flex items-center justify-center w-10 h-10 rounded-full"
                    style={{ background: "rgba(212,164,62,0.12)" }}
                  >
                    <Lock className="w-5 h-5" style={{ color: "#D4A43E" }} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground" data-testid="text-lock-score">
                      Your Letter Scored {overallScore}/100
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Unlock the complete CFR-grounded letter, remove watermarks, and download as PDF.
                    </p>
                  </div>
                  <Link href="/pricing">
                    <Button
                      className="w-full"
                      style={{
                        background: "#D4A43E",
                        color: "#0D2137",
                        borderColor: "#D4A43E",
                      }}
                      data-testid="button-generate-scored-letter"
                    >
                      START MY FREE TRIAL
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Button>
                  </Link>
                  <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
                    {PRICING_CHIPS.map((chip) => (
                      <Badge
                        key={chip.name}
                        variant="outline"
                        className="no-default-hover-elevate no-default-active-elevate text-xs"
                        data-testid={`badge-pricing-${chip.name.toLowerCase()}`}
                      >
                        {chip.name} {chip.price}{chip.period}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div
        className="rounded-md p-5 sm:p-6"
        style={{
          background: "linear-gradient(135deg, #0D2137 0%, #163352 55%, #1a3d60 100%)",
        }}
        data-testid="section-what-you-unlock"
      >
        <h3
          className="text-sm font-semibold mb-4"
          style={{ color: "#D4A43E" }}
        >
          What You Unlock
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2.5">
            {UNLOCK_ITEMS_LEFT.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 shrink-0" style={{ color: "#D4A43E" }} />
                <span className="text-xs" style={{ color: "rgba(250,250,247,0.85)" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {UNLOCK_ITEMS_RIGHT.map((item) => (
              <div key={item.text} className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4 shrink-0" style={{ color: "#D4A43E" }} />
                <span className="text-xs" style={{ color: "rgba(250,250,247,0.85)" }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          [data-testid="trial-letter-preview"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

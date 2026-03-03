import { useState, useEffect } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface ThinkingStep {
  icon: LucideIcon;
  label: string;
}

interface ThinkingStepsProps {
  isActive: boolean;
  steps: ThinkingStep[];
  delays: number[];
}

export function ThinkingSteps({ isActive, steps, delays }: ThinkingStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setCurrentStep(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    delays.forEach((delay, idx) => {
      if (idx === 0) return;
      timers.push(setTimeout(() => setCurrentStep(idx), delay));
    });

    return () => timers.forEach(clearTimeout);
  }, [isActive]);

  return (
    <div className="mt-4 p-5 rounded-lg bg-muted/50 border border-border" data-testid="thinking-steps">
      <p className="text-xs text-muted-foreground mb-4">
        This typically takes 15-30 seconds.
      </p>
      <div className="space-y-2.5">
        {steps.map((step, idx) => {
          if (idx > currentStep) return null;
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          const StepIcon = step.icon;
          return (
            <div
              key={idx}
              className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: "0ms" }}
              data-testid={`thinking-step-${idx}`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
              ) : (
                <StepIcon className="w-4 h-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${isComplete ? "text-muted-foreground" : isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

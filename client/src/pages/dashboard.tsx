import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Plus,
  MessageCircle,
  Stethoscope,
  TrendingUp,
  Shield,
  Star,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { getRankDisplayName } from "@shared/utils";

const tips = [
  "PACT Act: If you served post-9/11, you may qualify for presumptive service connection for toxic exposure conditions.",
  "C&P Exam Tip: Describe your WORST day, not your best. Raters assess based on the severity you report.",
  "38 CFR § 3.310: A secondary condition caused by a service-connected disability can also be rated.",
  "Always file for the highest rating you believe you deserve. The VA won't rate you higher than you claim.",
  "Buddy letters from fellow service members are powerful lay evidence under 38 CFR § 3.303(a).",
  "TDIU: If you can't work due to service-connected disabilities, you may qualify for 100% pay at 60%+ rating.",
];

function getRandomTip() {
  return tips[Math.floor(Math.random() * tips.length)];
}

function ScoreIndicator({ score, label }: { score: number; label: string }) {
  const color =
    score >= 80
      ? "text-green-600 dark:text-green-400"
      : score >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
  return (
    <div className="text-center">
      <div className={`text-xl font-bold ${color}`}>{score}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: dashboard, isLoading } = useQuery<any>({
    queryKey: ["/api/dashboard"],
  });

  const tip = getRandomTip();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  const tierColors: Record<string, string> = {
    none: "bg-muted text-muted-foreground",
    basic: "bg-primary text-primary-foreground",
    pro: "bg-accent text-accent-foreground",
    concierge: "bg-yellow-600 text-white dark:bg-yellow-500",
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
            Welcome back, {getRankDisplayName(dashboard?.profile?.rank, dashboard?.profile?.branch, user?.lastName, user?.firstName)}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
            Your VA claims command center
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge
            className={`${tierColors[dashboard?.tier || "none"]} text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1`}
            data-testid="badge-tier"
          >
            <Shield className="w-3 h-3 mr-1" />
            {(dashboard?.tier || "none").toUpperCase()} TIER
          </Badge>
          {dashboard?.trialEndsAt && new Date(dashboard.trialEndsAt) > new Date() && (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-[10px] sm:text-xs px-2 py-0.5" data-testid="badge-trial">
              Trial · {Math.ceil((new Date(dashboard.trialEndsAt).getTime() - Date.now()) / 86400000)}d left
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-3 sm:p-5">
            <p className="text-xs text-muted-foreground">Rating</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-combined-rating">
              {dashboard?.combinedRating || 0}%
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Est. ${dashboard?.estimatedMonthly?.toLocaleString() || 0}/mo
            </p>
            {dashboard?.smcSEligible && (
              <p className="text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-medium mt-0.5" data-testid="text-smc-eligible">
                SMC-S: ${dashboard?.smcSRate?.toLocaleString()}/mo
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-3 sm:p-5">
            <p className="text-xs text-muted-foreground">Documents</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-docs-count">
              {dashboard?.documentsThisMonth || 0}
              <span className="text-sm sm:text-base text-muted-foreground font-normal">
                /{dashboard?.tierLimit || 0}
              </span>
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">This month</p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-3 sm:p-5">
            <p className="text-xs text-muted-foreground">Conditions</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-conditions-count">
              {dashboard?.conditionsCount || 0}
            </p>
            {dashboard?.conditionsCount === 0 ? (
              <Link href="/conditions">
                <p className="text-[10px] sm:text-xs text-primary mt-0.5 hover:underline cursor-pointer" data-testid="link-add-condition-nudge">Add first condition →</p>
              </Link>
            ) : (
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">Tracked</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Link href="/generate">
          <Button className="w-full text-xs sm:text-sm h-9 sm:h-10" data-testid="button-quick-generate">
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Generate
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10" data-testid="button-quick-chat">
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Chat
          </Button>
        </Link>
        <Link href="/conditions">
          <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10" data-testid="button-quick-condition">
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Condition
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-foreground">Tip of the Day</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">{tip}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-base sm:text-lg flex items-center justify-between gap-1">
            Recent Documents
            <Link href="/documents">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm h-7 sm:h-9" data-testid="link-view-all-docs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          {!dashboard?.recentDocuments?.length ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 sm:mb-3 opacity-40" />
              <p className="text-xs sm:text-sm">No documents yet. Generate your first letter!</p>
            </div>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {dashboard.recentDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-2 sm:gap-3 p-2 sm:p-3 rounded-md bg-muted/30"
                  data-testid={`card-document-${doc.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {doc.title}
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()} · {doc.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    {doc.overallScore > 0 && (
                      <ScoreIndicator score={doc.overallScore} label="Score" />
                    )}
                    <Badge variant="outline" className="text-[10px] sm:text-xs">
                      {doc.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

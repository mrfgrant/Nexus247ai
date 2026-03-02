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
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-dashboard-title">
            Welcome back, {user?.firstName || "Veteran"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your VA claims command center
          </p>
        </div>
        <Badge
          className={`${tierColors[dashboard?.tier || "none"]} text-sm px-3 py-1`}
          data-testid="badge-tier"
        >
          <Shield className="w-3 h-3 mr-1" />
          {(dashboard?.tier || "none").toUpperCase()} TIER
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground">Combined Rating</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-combined-rating">
                  {dashboard?.combinedRating || 0}%
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Est. ${dashboard?.estimatedMonthly || 0}/mo
            </p>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground">Documents This Month</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-docs-count">
                  {dashboard?.documentsThisMonth || 0}
                  <span className="text-base text-muted-foreground font-normal">
                    /{dashboard?.tierLimit || 0}
                  </span>
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-5">
            <div className="flex items-center justify-between gap-1">
              <div>
                <p className="text-sm text-muted-foreground">Conditions</p>
                <p className="text-3xl font-bold text-foreground" data-testid="text-conditions-count">
                  {dashboard?.conditionsCount || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/generate">
          <Button data-testid="button-quick-generate">
            <FileText className="w-4 h-4 mr-2" />
            Generate Letter
          </Button>
        </Link>
        <Link href="/chat">
          <Button variant="outline" data-testid="button-quick-chat">
            <MessageCircle className="w-4 h-4 mr-2" />
            Claims Chat
          </Button>
        </Link>
        <Link href="/conditions">
          <Button variant="outline" data-testid="button-quick-condition">
            <Plus className="w-4 h-4 mr-2" />
            Add Condition
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-md bg-accent/20 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Tip of the Day</p>
            <p className="text-sm text-muted-foreground mt-1">{tip}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between gap-1">
            Recent Documents
            <Link href="/documents">
              <Button variant="ghost" size="sm" data-testid="link-view-all-docs">
                View All <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!dashboard?.recentDocuments?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No documents yet. Generate your first letter!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dashboard.recentDocuments.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-md bg-muted/30"
                  data-testid={`card-document-${doc.id}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">
                      {doc.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.createdAt).toLocaleDateString()} · {doc.wordCount} words
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.overallScore > 0 && (
                      <ScoreIndicator score={doc.overallScore} label="Score" />
                    )}
                    <Badge variant="outline" className="text-xs">
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

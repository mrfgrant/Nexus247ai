import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Shield, CreditCard, User, Settings as SettingsIcon, Loader2, ExternalLink } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(false);
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripe") === "success") {
      const sessionId = params.get("session_id");
      if (sessionId) {
        setVerifying(true);
        fetch(`/api/verify-checkout?session_id=${encodeURIComponent(sessionId)}`, {
          credentials: "include",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.tier) {
              toast({
                title: "Subscription activated!",
                description: `Your ${data.tier.charAt(0).toUpperCase() + data.tier.slice(1)} plan is now active.`,
              });
              queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
            } else {
              toast({
                title: "Payment received",
                description: "Your subscription is being processed. It may take a moment to activate.",
              });
            }
          })
          .catch(() => {
            toast({
              title: "Payment received",
              description: "Your subscription is being processed. Refresh the page in a moment.",
            });
          })
          .finally(() => {
            setVerifying(false);
            window.history.replaceState({}, "", window.location.pathname);
          });
      } else {
        toast({
          title: "Payment received",
          description: "Your subscription is being processed.",
        });
        window.history.replaceState({}, "", window.location.pathname);
      }
    }
  }, []);

  const portalMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/create-portal-session");
      return await res.json();
    },
    onSuccess: (data: { url: string }) => {
      window.location.href = data.url;
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading || verifying) {
    return (
      <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4">
        {verifying && (
          <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground">Verifying your payment and activating your subscription...</p>
          </div>
        )}
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-48" />
      </div>
    );
  }

  const tierLabels: Record<string, string> = {
    none: "No Active Plan",
    basic: "Basic - $19/mo",
    pro: "Pro - $49/mo",
    concierge: "Concierge - $149/mo",
  };

  const statusBadgeClass: Record<string, string> = {
    active: "bg-green-500/15 text-green-700 dark:text-green-400",
    past_due: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    canceled: "bg-red-500/15 text-red-700 dark:text-red-400",
  };

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-settings-title">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your account and subscription.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{user?.email || "Not set"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5" /> Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-medium text-foreground" data-testid="text-current-plan">
                {tierLabels[profile?.subscriptionTier || "none"]}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {profile?.subscriptionStatus && profile.subscriptionStatus !== "inactive" && (
                <Badge
                  className={statusBadgeClass[profile.subscriptionStatus] || ""}
                  data-testid="badge-subscription-status"
                >
                  {profile.subscriptionStatus.replace("_", " ").toUpperCase()}
                </Badge>
              )}
              <Badge className={profile?.subscriptionTier === "none" ? "bg-muted text-muted-foreground" : ""}>
                <Shield className="w-3 h-3 mr-1" />
                {(profile?.subscriptionTier || "none").toUpperCase()}
              </Badge>
            </div>
          </div>
          {profile?.trialEndsAt && new Date(profile.trialEndsAt) > new Date() && (
            <p className="text-sm text-muted-foreground" data-testid="text-trial-ends">
              Trial ends: {new Date(profile.trialEndsAt).toLocaleDateString()}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            <Link href="/pricing">
              <Button variant="outline" data-testid="button-change-plan">
                {profile?.subscriptionTier === "none" ? "Choose a Plan" : "Change Plan"}
              </Button>
            </Link>
            {profile?.stripeCustomerId && (
              <Button
                variant="outline"
                onClick={() => portalMutation.mutate()}
                disabled={portalMutation.isPending}
                data-testid="button-manage-billing"
              >
                {portalMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 mr-2" />
                )}
                Manage Billing
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" /> Veteran Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Branch</p>
                <p className="font-medium text-foreground">{profile.branch || "Not set"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Rating</p>
                <p className="font-medium text-foreground">{profile.currentRating || 0}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Discharge</p>
                <p className="font-medium text-foreground">{profile.dischargeType || "Not set"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium text-foreground capitalize">{profile.role || "user"}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No profile created yet.</p>
          )}
          <Link href="/intake">
            <Button variant="outline" size="sm" className="mt-4" data-testid="button-edit-profile">
              Edit Profile
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

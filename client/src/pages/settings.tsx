import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { Shield, CreditCard, User, Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profile"],
  });

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4">
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
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Plan</p>
              <p className="font-medium text-foreground" data-testid="text-current-plan">
                {tierLabels[profile?.subscriptionTier || "none"]}
              </p>
            </div>
            <Badge className={profile?.subscriptionTier === "none" ? "bg-muted text-muted-foreground" : ""}>
              <Shield className="w-3 h-3 mr-1" />
              {(profile?.subscriptionTier || "none").toUpperCase()}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Link href="/pricing">
              <Button variant="outline" data-testid="button-change-plan">
                {profile?.subscriptionTier === "none" ? "Choose a Plan" : "Change Plan"}
              </Button>
            </Link>
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

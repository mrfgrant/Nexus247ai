import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Users, Search, Shield, CreditCard, Clock, Crown, Edit } from "lucide-react";
import type { VeteranProfile } from "@shared/schema";

const tierColors: Record<string, string> = {
  none: "bg-muted text-muted-foreground",
  basic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  pro: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  concierge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

const roleColors: Record<string, string> = {
  user: "bg-muted text-muted-foreground",
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

function EditUserDialog({
  profile,
  onClose,
}: {
  profile: VeteranProfile;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [tier, setTier] = useState(profile.subscriptionTier || "none");
  const [role, setRole] = useState(profile.role || "user");
  const [trialDays, setTrialDays] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${profile.userId}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User updated" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" });
    },
  });

  function handleSave() {
    const data: any = {};
    if (tier !== (profile.subscriptionTier || "none")) data.subscriptionTier = tier;
    if (role !== (profile.role || "user")) data.role = role;
    if (trialDays) data.trialDays = parseInt(trialDays);
    mutation.mutate(data);
  }

  const trialActive = profile.trialEndsAt && new Date(profile.trialEndsAt) > new Date();
  const trialExpired = profile.trialEndsAt && new Date(profile.trialEndsAt) <= new Date();

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Manage User</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="p-3 rounded-md bg-muted/50 border border-border">
          <p className="text-sm font-medium text-foreground">{profile.userId}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {profile.branch || "No branch"} · Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}
          </p>
          {trialActive && (
            <Badge className="mt-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 text-xs">
              <Clock className="w-3 h-3 mr-1" /> Trial active until {new Date(profile.trialEndsAt!).toLocaleDateString()}
            </Badge>
          )}
          {trialExpired && (
            <Badge className="mt-1.5 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs">
              Trial expired {new Date(profile.trialEndsAt!).toLocaleDateString()}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <Label>Subscription Tier</Label>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger data-testid="select-tier">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (Free)</SelectItem>
              <SelectItem value="basic">Basic ($19/mo)</SelectItem>
              <SelectItem value="pro">Pro ($49/mo)</SelectItem>
              <SelectItem value="concierge">Concierge ($149/mo)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger data-testid="select-role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Start Free Trial (days)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              max={30}
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              placeholder="e.g., 3"
              data-testid="input-trial-days"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTrialDays("3")}
              className="shrink-0 text-xs"
              data-testid="button-3day-trial"
            >
              3 days
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setTrialDays("7")}
              className="shrink-0 text-xs"
              data-testid="button-7day-trial"
            >
              7 days
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Sets a time-limited trial. If tier is "None", it will be set to Basic automatically.
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={mutation.isPending} data-testid="button-save-user">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editProfile, setEditProfile] = useState<VeteranProfile | null>(null);

  const { data: profiles = [], isLoading } = useQuery<VeteranProfile[]>({
    queryKey: ["/api/admin/users"],
  });

  const filtered = search.trim()
    ? profiles.filter(
        (p) =>
          p.userId.toLowerCase().includes(search.toLowerCase()) ||
          (p.branch || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.role || "").toLowerCase().includes(search.toLowerCase()) ||
          (p.subscriptionTier || "").toLowerCase().includes(search.toLowerCase()),
      )
    : profiles;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-admin-users-title">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          {profiles.length} registered users · Manage tiers, roles, and trials
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">{profiles.length}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{profiles.filter((p) => p.subscriptionTier === "basic").length}</p>
            <p className="text-xs text-muted-foreground">Basic</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{profiles.filter((p) => p.subscriptionTier === "pro").length}</p>
            <p className="text-xs text-muted-foreground">Pro</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">{profiles.filter((p) => p.subscriptionTier === "concierge").length}</p>
            <p className="text-xs text-muted-foreground">Concierge</p>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user ID, branch, role, or tier..."
          className="pl-9"
          data-testid="input-search-users"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((profile) => {
          const trialActive = profile.trialEndsAt && new Date(profile.trialEndsAt) > new Date();
          return (
            <Card key={profile.id} data-testid={`card-user-${profile.userId}`}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{profile.userId}</p>
                      <Badge className={`text-[10px] sm:text-xs ${tierColors[profile.subscriptionTier || "none"]}`}>
                        <CreditCard className="w-3 h-3 mr-0.5" />
                        {(profile.subscriptionTier || "none").toUpperCase()}
                      </Badge>
                      <Badge className={`text-[10px] sm:text-xs ${roleColors[profile.role || "user"]}`}>
                        <Shield className="w-3 h-3 mr-0.5" />
                        {(profile.role || "user").toUpperCase()}
                      </Badge>
                      {trialActive && (
                        <Badge className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                          <Clock className="w-3 h-3 mr-0.5" />
                          Trial
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {profile.branch || "No branch"} · Rating: {profile.currentRating ?? 0}%
                      {trialActive && ` · Trial ends ${new Date(profile.trialEndsAt!).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditProfile(profile)}
                    data-testid={`button-edit-user-${profile.userId}`}
                  >
                    <Edit className="w-3.5 h-3.5 sm:mr-1" />
                    <span className="hidden sm:inline">Manage</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No users found matching your search.</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!editProfile} onOpenChange={(o) => { if (!o) setEditProfile(null); }}>
        {editProfile && (
          <EditUserDialog profile={editProfile} onClose={() => setEditProfile(null)} />
        )}
      </Dialog>
    </div>
  );
}

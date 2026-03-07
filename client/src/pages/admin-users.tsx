import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Search, Shield, CreditCard, Clock, Crown, Edit, Mail, Archive, ArchiveRestore, Trash2, Download, FileText, MessageSquare, ClipboardCheck, Activity } from "lucide-react";
import type { VeteranProfile } from "@shared/schema";
import { getRankDisplayName } from "@shared/utils";

type AdminProfile = VeteranProfile & {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
};

function getDisplayName(profile: AdminProfile): string {
  const rankDisplay = profile.rank ? getRankDisplayName(profile.rank, profile.branch || null, profile.lastName || null, profile.firstName || null) : "";
  const first = profile.firstName || "";
  const last = profile.lastName || "";
  if (rankDisplay && last) return `${rankDisplay} ${last}`;
  if (first && last) return `${first} ${last}`;
  if (last) return last;
  if (first) return first;
  if (profile.email) return profile.email;
  return profile.userId;
}

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
  profile: AdminProfile;
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
  const displayName = getDisplayName(profile);

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Manage User</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="p-3 rounded-md bg-muted/50 border border-border">
          <p className="text-sm font-medium text-foreground" data-testid="text-edit-user-name">{displayName}</p>
          {profile.email && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <Mail className="w-3 h-3" /> {profile.email}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            {profile.branch || "No branch"} · {profile.rank || "No rank"} · Joined {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}
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
              <SelectItem value="basic">Starter ($29/mo)</SelectItem>
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
            Sets a time-limited trial. If tier is "None", it will be set to Starter automatically.
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

function DeleteConfirmDialog({
  profile,
  onClose,
}: {
  profile: AdminProfile;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const displayName = getDisplayName(profile);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/admin/users/${profile.userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted", description: `All data for ${displayName} has been permanently deleted.` });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete user.", variant: "destructive" });
    },
  });

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Delete User Permanently</DialogTitle>
        <DialogDescription>
          This will permanently delete all data for <strong>{displayName}</strong>, including conditions, documents, incidents, chat messages, and all other associated records. This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={onClose} data-testid="button-cancel-delete">Cancel</Button>
        <Button
          variant="destructive"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          data-testid="button-confirm-delete"
        >
          {mutation.isPending ? "Deleting..." : "Delete Permanently"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

type ActivityEntry = {
  id: string;
  action: string;
  metadata: any;
  createdAt: string | null;
};

const ACTION_LABELS: Record<string, { label: string; icon: typeof FileText }> = {
  generate_document: { label: "Generated Document", icon: FileText },
  chat_message: { label: "AI Chat Message", icon: MessageSquare },
  cnp_prep: { label: "C&P Exam Prep", icon: ClipboardCheck },
};

function formatActionMeta(action: string, metadata: any): string | null {
  if (!metadata) return null;
  if (action === "generate_document" && metadata.documentType) {
    return metadata.documentType.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
  }
  if (action === "cnp_prep" && metadata.conditionName) {
    return metadata.conditionName;
  }
  return null;
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

function ActivityLogDialog({
  profile,
  onClose,
}: {
  profile: AdminProfile;
  onClose: () => void;
}) {
  const displayName = getDisplayName(profile);

  const { data: logs = [], isLoading, isError } = useQuery<ActivityEntry[]>({
    queryKey: ["/api/admin/users", profile.userId, "activity"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users/${profile.userId}/activity?limit=200`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
  });

  return (
    <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Activity Log
        </DialogTitle>
        <DialogDescription>
          {displayName} {profile.email && `· ${profile.email}`}
        </DialogDescription>
      </DialogHeader>
      {isError ? (
        <div className="py-10 text-center text-destructive">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-medium">Failed to load activity log.</p>
          <p className="text-xs text-muted-foreground mt-1">Please try again later.</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="py-10 text-center text-muted-foreground">
          <Activity className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm" data-testid="text-no-activity">No activity recorded yet.</p>
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-6 px-6" style={{ maxHeight: "60vh" }}>
          <div className="space-y-1 py-2">
            {logs.map(log => {
              const config = ACTION_LABELS[log.action] || { label: log.action.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()), icon: Activity };
              const Icon = config.icon;
              const meta = formatActionMeta(log.action, log.metadata);
              return (
                <div
                  key={log.id}
                  className="flex items-start gap-3 py-2 px-2 rounded-md hover:bg-muted/50 transition-colors"
                  data-testid={`activity-entry-${log.id}`}
                >
                  <div className="mt-0.5 p-1.5 rounded-md bg-muted shrink-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{config.label}</p>
                    {meta && <p className="text-xs text-muted-foreground truncate">{meta}</p>}
                  </div>
                  {log.createdAt && (
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5" title={new Date(log.createdAt).toLocaleString()}>
                      {timeAgo(log.createdAt)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">{logs.length} {logs.length === 1 ? "entry" : "entries"}</p>
        <Button variant="outline" size="sm" onClick={onClose} data-testid="button-close-activity">Close</Button>
      </div>
    </DialogContent>
  );
}

export default function AdminUsers() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editProfile, setEditProfile] = useState<AdminProfile | null>(null);
  const [deleteProfile, setDeleteProfile] = useState<AdminProfile | null>(null);
  const [activityProfile, setActivityProfile] = useState<AdminProfile | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  const { data: profiles = [], isLoading } = useQuery<AdminProfile[]>({
    queryKey: ["/api/admin/users", showArchived ? "archived" : "active"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/users?includeArchived=${showArchived}`);
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: "archive" | "unarchive" }) => {
      const res = await apiRequest("POST", `/api/admin/users/${userId}/${action}`);
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: variables.action === "archive" ? "User archived" : "User unarchived" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update user.", variant: "destructive" });
    },
  });

  function handleExport() {
    window.open("/api/admin/users/export", "_blank");
  }

  const filtered = search.trim()
    ? profiles.filter((p) => {
        const s = search.toLowerCase();
        const name = getDisplayName(p).toLowerCase();
        return (
          name.includes(s) ||
          p.userId.toLowerCase().includes(s) ||
          (p.email || "").toLowerCase().includes(s) ||
          (p.branch || "").toLowerCase().includes(s) ||
          (p.role || "").toLowerCase().includes(s) ||
          (p.subscriptionTier || "").toLowerCase().includes(s)
        );
      })
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
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-admin-users-title">
            User Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {profiles.length} {showArchived ? "total" : "active"} users · Manage tiers, roles, and trials
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} data-testid="button-export-users">
          <Download className="w-4 h-4 mr-1.5" />
          Export CSV
        </Button>
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
            <p className="text-xs text-muted-foreground">Starter</p>
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

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, branch, role, or tier..."
            className="pl-9"
            data-testid="input-search-users"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={showArchived}
            onCheckedChange={setShowArchived}
            data-testid="switch-show-archived"
          />
          <Label className="text-sm text-muted-foreground whitespace-nowrap cursor-pointer" onClick={() => setShowArchived(!showArchived)}>
            Show archived
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map((profile) => {
          const trialActive = profile.trialEndsAt && new Date(profile.trialEndsAt) > new Date();
          const isArchived = !!profile.archivedAt;
          const displayName = getDisplayName(profile);
          return (
            <Card
              key={profile.id}
              className={isArchived ? "opacity-60" : ""}
              data-testid={`card-user-${profile.userId}`}
            >
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        className="text-sm font-medium text-foreground truncate hover:underline hover:text-primary cursor-pointer text-left"
                        onClick={() => setActivityProfile(profile)}
                        data-testid={`text-user-name-${profile.userId}`}
                      >{displayName}</button>
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
                      {isArchived && (
                        <Badge className="text-[10px] sm:text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          <Archive className="w-3 h-3 mr-0.5" />
                          Archived
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {profile.email && <span className="mr-1">{profile.email} ·</span>}
                      {profile.branch || "No branch"} · Rating: {profile.currentRating ?? 0}%
                      {trialActive && ` · Trial ends ${new Date(profile.trialEndsAt!).toLocaleDateString()}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {isArchived ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => archiveMutation.mutate({ userId: profile.userId, action: "unarchive" })}
                        disabled={archiveMutation.isPending}
                        data-testid={`button-unarchive-user-${profile.userId}`}
                      >
                        <ArchiveRestore className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => archiveMutation.mutate({ userId: profile.userId, action: "archive" })}
                        disabled={archiveMutation.isPending}
                        data-testid={`button-archive-user-${profile.userId}`}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setDeleteProfile(profile)}
                      data-testid={`button-delete-user-${profile.userId}`}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
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

      <Dialog open={!!deleteProfile} onOpenChange={(o) => { if (!o) setDeleteProfile(null); }}>
        {deleteProfile && (
          <DeleteConfirmDialog profile={deleteProfile} onClose={() => setDeleteProfile(null)} />
        )}
      </Dialog>

      <Dialog open={!!activityProfile} onOpenChange={(o) => { if (!o) setActivityProfile(null); }}>
        {activityProfile && (
          <ActivityLogDialog profile={activityProfile} onClose={() => setActivityProfile(null)} />
        )}
      </Dialog>
    </div>
  );
}

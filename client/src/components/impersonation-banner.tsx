import { useMutation } from "@tanstack/react-query";
import { Eye, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function ImpersonationBanner() {
  const { user, isImpersonating } = useAuth();
  const { toast } = useToast();

  const stopMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/impersonate/stop");
    },
    onSuccess: async () => {
      // Refresh every cached query so the app re-renders against the admin's
      // own account once impersonation ends.
      await queryClient.invalidateQueries();
      window.location.href = "/admin/users";
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not exit user view. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!isImpersonating) return null;

  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.email ||
    "this user";

  return (
    <div
      className="fixed top-0 inset-x-0 z-[100] flex items-center justify-center gap-3 px-4 py-2 bg-amber-500 text-amber-950 shadow-md"
      data-testid="banner-impersonation"
    >
      <Eye className="w-4 h-4 shrink-0" />
      <span className="text-sm font-medium truncate">
        Viewing as <strong>{name}</strong> — read only
      </span>
      <Button
        size="sm"
        variant="outline"
        className="h-7 bg-white/90 hover:bg-white text-amber-950 border-amber-700 shrink-0"
        onClick={() => stopMutation.mutate()}
        disabled={stopMutation.isPending}
        data-testid="button-exit-impersonation"
      >
        {stopMutation.isPending ? (
          <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
        ) : (
          <LogOut className="w-3.5 h-3.5 mr-1" />
        )}
        Exit
      </Button>
    </div>
  );
}

import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { HeadphonesIcon, Clock, CheckCircle, MessageCircle, Send } from "lucide-react";
import type { SupportRequest } from "@shared/schema";
import { useState } from "react";

export default function AdminSupport() {
  const { toast } = useToast();
  const [responses, setResponses] = useState<Record<string, string>>({});

  const { data: requests = [], isLoading } = useQuery<SupportRequest[]>({
    queryKey: ["/api/support"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/support/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support"] });
      toast({ title: "Request updated" });
    },
    onError: () => {
      toast({ title: "Error", variant: "destructive" });
    },
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "resolved": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default: return "";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}
      </div>
    );
  }

  const stats = {
    open: requests.filter((r) => r.status === "open").length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    resolved: requests.filter((r) => r.status === "resolved").length,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-admin-support-title">
          Support Requests
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Manage veteran assistance requests.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-yellow-600">{stats.open}</p><p className="text-xs text-muted-foreground">Open</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p><p className="text-xs text-muted-foreground">In Progress</p></CardContent></Card>
        <Card><CardContent className="p-3 text-center"><p className="text-2xl font-bold text-green-600">{stats.resolved}</p><p className="text-xs text-muted-foreground">Resolved</p></CardContent></Card>
      </div>

      {!requests.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No support requests</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <Card key={req.id} data-testid={`card-admin-request-${req.id}`}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium text-foreground">{req.subject}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={`text-xs ${statusColor(req.status || "open")}`}>{req.status}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{req.priority}</Badge>
                      <span className="text-xs text-muted-foreground">
                        User: {req.userId} · {new Date(req.createdAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Select
                    value={req.status || "open"}
                    onValueChange={(v) => updateMutation.mutate({ id: req.id, data: { status: v } })}
                  >
                    <SelectTrigger className="w-[140px]" data-testid={`select-status-${req.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-sm text-foreground">{req.description}</p>

                {req.adminResponse && (
                  <div className="p-3 rounded-md bg-primary/5 border border-primary/10">
                    <p className="text-xs font-medium text-primary mb-1">Your Response</p>
                    <p className="text-sm text-foreground">{req.adminResponse}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Textarea
                    value={responses[req.id] || ""}
                    onChange={(e) => setResponses({ ...responses, [req.id]: e.target.value })}
                    placeholder="Write a response..."
                    rows={2}
                    className="flex-1"
                    data-testid={`input-admin-response-${req.id}`}
                  />
                  <Button
                    size="sm"
                    className="self-end"
                    disabled={!responses[req.id]?.trim()}
                    onClick={() => {
                      updateMutation.mutate({
                        id: req.id,
                        data: {
                          adminResponse: responses[req.id],
                          status: "in_progress",
                        },
                      });
                      setResponses({ ...responses, [req.id]: "" });
                    }}
                    data-testid={`button-respond-${req.id}`}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

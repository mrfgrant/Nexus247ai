import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { HeadphonesIcon, Plus, Clock, CheckCircle, MessageCircle } from "lucide-react";
import type { SupportRequest } from "@shared/schema";

export default function Support() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const { data: requests = [], isLoading } = useQuery<SupportRequest[]>({
    queryKey: ["/api/support"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/support", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/support"] });
      toast({ title: "Request submitted", description: "Our team will review your request." });
      setOpen(false);
      setSubject("");
      setDescription("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit request.", variant: "destructive" });
    },
  });

  const statusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-3.5 h-3.5 text-yellow-500" />;
      case "in_progress": return <MessageCircle className="w-3.5 h-3.5 text-blue-500" />;
      case "resolved": return <CheckCircle className="w-3.5 h-3.5 text-green-500" />;
      default: return <Clock className="w-3.5 h-3.5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2].map((i) => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-support-title">Get Help</h1>
          <p className="text-muted-foreground text-sm mt-1">Request human assistance with your claims.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-request"><Plus className="w-4 h-4 mr-2" /> New Request</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request Assistance</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Need help with PTSD claim appeal" data-testid="input-support-subject" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you need help with..." rows={5} data-testid="input-support-description" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => createMutation.mutate({ subject, description })} disabled={createMutation.isPending || !subject || !description} data-testid="button-submit-request">
                  {createMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {!requests.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HeadphonesIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No support requests</h3>
            <p className="text-sm text-muted-foreground mt-1">Create a request when you need expert help.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id} data-testid={`card-request-${req.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(req.status || "open")}
                      <h3 className="font-medium text-foreground">{req.subject}</h3>
                      <Badge variant="outline" className="text-xs capitalize">{req.status}</Badge>
                      <Badge variant="outline" className="text-xs capitalize">{req.priority}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.description}</p>
                    {req.adminResponse && (
                      <div className="mt-3 p-3 rounded-md bg-primary/5 border border-primary/10">
                        <p className="text-xs font-medium text-primary mb-1">Admin Response</p>
                        <p className="text-sm text-foreground">{req.adminResponse}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(req.createdAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

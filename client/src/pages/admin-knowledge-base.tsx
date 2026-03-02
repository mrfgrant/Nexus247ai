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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BookOpen, Plus, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import type { KnowledgeBaseEntry } from "@shared/schema";

function EntryDialog({
  entry,
  onClose,
}: {
  entry?: KnowledgeBaseEntry;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: entry?.title || "",
    category: entry?.category || "approved",
    conditionType: entry?.conditionType || "",
    content: entry?.content || "",
    denialReasons: entry?.denialReasons || "",
    cfrSections: entry?.cfrSections || "",
    outcome: entry?.outcome || "",
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (entry) {
        const res = await apiRequest("PATCH", `/api/knowledge-base/${entry.id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/knowledge-base", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-base"] });
      toast({ title: entry ? "Entry updated" : "Entry added" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", variant: "destructive" });
    },
  });

  return (
    <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{entry ? "Edit Entry" : "Add Knowledge Base Entry"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., PTSD Direct SC Approval - Combat Veteran" data-testid="input-kb-title" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger data-testid="select-kb-category"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
                <SelectItem value="remanded">Remanded</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Condition Type</Label>
            <Input value={form.conditionType} onChange={(e) => setForm({ ...form, conditionType: e.target.value })} placeholder="e.g., PTSD, Tinnitus" data-testid="input-kb-condition-type" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Outcome Summary</Label>
          <Input value={form.outcome} onChange={(e) => setForm({ ...form, outcome: e.target.value })} placeholder="e.g., Granted 70% SC for PTSD" data-testid="input-kb-outcome" />
        </div>
        <div className="space-y-2">
          <Label>CFR Sections Cited</Label>
          <Input value={form.cfrSections} onChange={(e) => setForm({ ...form, cfrSections: e.target.value })} placeholder="e.g., § 3.303, § 3.304(f)" data-testid="input-kb-cfr" />
        </div>
        <div className="space-y-2">
          <Label>Denial Reasons (if applicable)</Label>
          <Textarea value={form.denialReasons} onChange={(e) => setForm({ ...form, denialReasons: e.target.value })} placeholder="Reasons the claim was denied..." rows={2} data-testid="input-kb-denial-reasons" />
        </div>
        <div className="space-y-2">
          <Label>Full Content</Label>
          <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Paste the full decision text, submission letter, or analysis..." rows={6} data-testid="input-kb-content" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.title || !form.content} data-testid="button-save-kb">
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function AdminKnowledgeBase() {
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [editEntry, setEditEntry] = useState<KnowledgeBaseEntry | undefined>();

  const { data: entries = [], isLoading } = useQuery<KnowledgeBaseEntry[]>({
    queryKey: ["/api/knowledge-base"],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/knowledge-base/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/knowledge-base"] });
      toast({ title: "Entry deleted" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-kb-title">Knowledge Base</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload real claim submissions and VA decisions to train AI letter generation.
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={(o) => { setShowDialog(o); if (!o) setEditEntry(undefined); }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-kb"><Plus className="w-4 h-4 mr-2" /> Add Entry</Button>
          </DialogTrigger>
          <EntryDialog entry={editEntry} onClose={() => { setShowDialog(false); setEditEntry(undefined); }} />
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {["approved", "denied", "remanded", "reference"].map((cat) => {
          const count = entries.filter((e) => e.category === cat).length;
          return (
            <Card key={cat}>
              <CardContent className="p-3 text-center">
                <p className="text-xl sm:text-2xl font-bold text-foreground">{count}</p>
                <p className="text-xs text-muted-foreground capitalize">{cat}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!entries.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">Knowledge base is empty</h3>
            <p className="text-sm text-muted-foreground mt-1">Add real claim decisions to improve AI letter quality.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id} data-testid={`card-kb-${entry.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.category === "approved" ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                      ) : entry.category === "denied" ? (
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      ) : null}
                      <h3 className="font-medium text-foreground truncate">{entry.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline" className="text-xs capitalize">{entry.category}</Badge>
                      {entry.conditionType && <Badge variant="outline" className="text-xs">{entry.conditionType}</Badge>}
                      {entry.cfrSections && <Badge variant="outline" className="text-xs">{entry.cfrSections}</Badge>}
                    </div>
                    {entry.outcome && <p className="text-sm text-muted-foreground mt-2">{entry.outcome}</p>}
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{entry.content}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditEntry(entry); setShowDialog(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(entry.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
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

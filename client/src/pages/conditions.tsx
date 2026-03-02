import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Stethoscope, Trash2, Edit, AlertTriangle, MapPin, Calendar, Search, Zap } from "lucide-react";
import type { Condition, ServiceIncident } from "@shared/schema";
import { searchConditions, type ConditionCodeEntry } from "@/lib/condition-codes";

function ConditionDialog({
  condition,
  onClose,
}: {
  condition?: Condition;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    conditionName: condition?.conditionName || "",
    icd10Code: condition?.icd10Code || "",
    diagnosticCode: condition?.diagnosticCode || "",
    currentRating: condition?.currentRating || 0,
    claimedRating: condition?.claimedRating || 0,
    serviceConnected: condition?.serviceConnected || false,
    dateOfDiagnosis: condition?.dateOfDiagnosis || "",
    treatingPhysician: condition?.treatingPhysician || "",
    notes: condition?.notes || "",
  });

  const [suggestions, setSuggestions] = useState<ConditionCodeEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleConditionInput(value: string) {
    setForm({ ...form, conditionName: value });
    setAutoFilled(false);
    const results = searchConditions(value);
    setSuggestions(results);
    setShowSuggestions(results.length > 0);
  }

  function selectCondition(entry: ConditionCodeEntry) {
    setForm({
      ...form,
      conditionName: entry.name,
      icd10Code: entry.icd10,
      diagnosticCode: entry.diagnosticCode,
      claimedRating: !condition ? entry.maxRating : form.claimedRating,
    });
    setAutoFilled(true);
    setShowSuggestions(false);
  }

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (condition) {
        const res = await apiRequest("PATCH", `/api/conditions/${condition.id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/conditions", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conditions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({ title: condition ? "Condition updated" : "Condition added" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save condition.", variant: "destructive" });
    },
  });

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{condition ? "Edit Condition" : "Add Condition"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="space-y-2 relative">
          <Label>Condition Name</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              value={form.conditionName}
              onChange={(e) => handleConditionInput(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              placeholder="Start typing... e.g., PTSD, back pain, tinnitus"
              className="pl-9"
              data-testid="input-condition-name"
            />
          </div>
          <p className="text-xs text-muted-foreground">Type your condition and we'll auto-fill the medical codes for you.</p>
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="absolute z-50 left-0 right-0 top-[calc(100%-4px)] bg-popover border border-border rounded-md shadow-lg max-h-64 overflow-y-auto" data-testid="condition-suggestions">
              {suggestions.map((entry, idx) => (
                <button
                  key={entry.name}
                  className="w-full text-left px-3 py-2.5 hover:bg-accent transition-colors flex items-center justify-between gap-2 border-b border-border/50 last:border-0"
                  onClick={() => selectCondition(entry)}
                  data-testid={`suggestion-${idx}`}
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-foreground">{entry.name}</div>
                    <div className="text-xs text-muted-foreground">{entry.category}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">ICD: {entry.icd10}</Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">DC: {entry.diagnosticCode}</Badge>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              ICD-10 Code
              {autoFilled && <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"><Zap className="w-3 h-3" />Auto</span>}
            </Label>
            <Input value={form.icd10Code} onChange={(e) => setForm({ ...form, icd10Code: e.target.value })} placeholder="Auto-filled" className={autoFilled && form.icd10Code ? "border-emerald-500/40 bg-emerald-500/5" : ""} data-testid="input-icd10" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Diagnostic Code
              {autoFilled && <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"><Zap className="w-3 h-3" />Auto</span>}
            </Label>
            <Input value={form.diagnosticCode} onChange={(e) => setForm({ ...form, diagnosticCode: e.target.value })} placeholder="Auto-filled" className={autoFilled && form.diagnosticCode ? "border-emerald-500/40 bg-emerald-500/5" : ""} data-testid="input-diagnostic-code" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Current Rating (%)</Label>
            <Input type="number" min={0} max={100} value={form.currentRating} onChange={(e) => setForm({ ...form, currentRating: parseInt(e.target.value) || 0 })} data-testid="input-current-rating" />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              Claimed Rating (%)
              {autoFilled && !condition && <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400"><Zap className="w-3 h-3" />Auto</span>}
            </Label>
            <Input type="number" min={0} max={100} value={form.claimedRating} onChange={(e) => setForm({ ...form, claimedRating: parseInt(e.target.value) || 0 })} className={autoFilled && !condition && form.claimedRating ? "border-emerald-500/40 bg-emerald-500/5" : ""} data-testid="input-claimed-rating" />
            {autoFilled && !condition && (
              <p className="text-[10px] text-muted-foreground leading-tight">This is the maximum possible rating under the VA schedule for this diagnostic code. Actual ratings depend on symptom severity and evidence. This is not a guarantee.</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Date of Diagnosis</Label>
          <Input type="date" value={form.dateOfDiagnosis} onChange={(e) => setForm({ ...form, dateOfDiagnosis: e.target.value })} data-testid="input-diagnosis-date" />
        </div>
        <div className="space-y-2">
          <Label>Treating Physician</Label>
          <Input value={form.treatingPhysician} onChange={(e) => setForm({ ...form, treatingPhysician: e.target.value })} placeholder="Dr. Name" data-testid="input-physician" />
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={form.serviceConnected} onCheckedChange={(v) => setForm({ ...form, serviceConnected: !!v })} data-testid="checkbox-service-connected" />
          <Label className="text-sm font-normal">Currently service-connected</Label>
        </div>
        <div className="space-y-2">
          <Label>Notes</Label>
          <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional details..." data-testid="input-notes" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.conditionName} data-testid="button-save-condition">
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function IncidentDialog({
  conditionId,
  incident,
  onClose,
}: {
  conditionId: string;
  incident?: ServiceIncident;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({
    conditionId,
    incidentDate: incident?.incidentDate || "",
    location: incident?.location || "",
    description: incident?.description || "",
    documented: incident?.documented || false,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (incident) {
        const res = await apiRequest("PATCH", `/api/incidents/${incident.id}`, data);
        return res.json();
      }
      const res = await apiRequest("POST", "/api/incidents", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({ title: incident ? "Incident updated" : "Incident added" });
      onClose();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save incident.", variant: "destructive" });
    },
  });

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{incident ? "Edit Incident" : "Add Service Incident"}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} data-testid="input-incident-date" />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., FOB Falcon, Iraq" data-testid="input-incident-location" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe what happened..." rows={4} data-testid="input-incident-description" />
        </div>
        <div className="flex items-center gap-3">
          <Checkbox checked={form.documented} onCheckedChange={(v) => setForm({ ...form, documented: !!v })} data-testid="checkbox-documented" />
          <Label className="text-sm font-normal">Documented in service records</Label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => mutation.mutate(form)} disabled={mutation.isPending || !form.description} data-testid="button-save-incident">
            {mutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export default function Conditions() {
  const { toast } = useToast();
  const [editCondition, setEditCondition] = useState<Condition | undefined>();
  const [showConditionDialog, setShowConditionDialog] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  const [showIncidentDialog, setShowIncidentDialog] = useState<string | null>(null);
  const [editIncident, setEditIncident] = useState<ServiceIncident | undefined>();

  const { data: conditionsList = [], isLoading } = useQuery<Condition[]>({ queryKey: ["/api/conditions"] });
  const { data: incidents = [] } = useQuery<ServiceIncident[]>({ queryKey: ["/api/incidents"] });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/conditions/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conditions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({ title: "Condition deleted" });
    },
  });

  const deleteIncidentMutation = useMutation({
    mutationFn: async (id: string) => { await apiRequest("DELETE", `/api/incidents/${id}`); },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/incidents"] });
      toast({ title: "Incident deleted" });
    },
  });

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (<Skeleton key={i} className="h-40" />))}
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-2 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-conditions-title">Conditions & Incidents</h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1 hidden sm:block">Track your service-connected conditions and linking incidents.</p>
        </div>
        <Dialog open={showConditionDialog} onOpenChange={(o) => { setShowConditionDialog(o); if (!o) { setEditCondition(undefined); setDialogKey((k) => k + 1); } }}>
          <DialogTrigger asChild>
            <Button className="shrink-0 text-xs sm:text-sm" data-testid="button-add-condition"><Plus className="w-4 h-4 mr-1 sm:mr-2" /> Add Condition</Button>
          </DialogTrigger>
          <ConditionDialog key={editCondition?.id || `new-${dialogKey}`} condition={editCondition} onClose={() => { setShowConditionDialog(false); setEditCondition(undefined); }} />
        </Dialog>
      </div>

      {!conditionsList.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Stethoscope className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No conditions yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Add your first condition to start building your claim.</p>
          </CardContent>
        </Card>
      ) : (
        conditionsList.map((c) => {
          const condIncidents = incidents.filter((i) => i.conditionId === c.id);
          return (
            <Card key={c.id} data-testid={`card-condition-${c.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{c.conditionName}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      {c.icd10Code && <Badge variant="outline" className="text-xs">ICD-10: {c.icd10Code}</Badge>}
                      {c.diagnosticCode && <Badge variant="outline" className="text-xs">DC: {c.diagnosticCode}</Badge>}
                      {c.serviceConnected && <Badge className="text-xs">Service Connected</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => { setEditCondition(c); setShowConditionDialog(true); }} data-testid={`button-edit-condition-${c.id}`}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(c.id)} data-testid={`button-delete-condition-${c.id}`}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div><p className="text-muted-foreground">Current</p><p className="font-semibold">{c.currentRating || 0}%</p></div>
                  <div><p className="text-muted-foreground">Claimed</p><p className="font-semibold">{c.claimedRating || 0}%</p></div>
                  <div><p className="text-muted-foreground">Diagnosed</p><p className="font-semibold">{c.dateOfDiagnosis || "N/A"}</p></div>
                  <div><p className="text-muted-foreground">Physician</p><p className="font-semibold truncate">{c.treatingPhysician || "N/A"}</p></div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-medium text-foreground flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Service Incidents ({condIncidents.length})
                    </h4>
                    <Dialog open={showIncidentDialog === c.id} onOpenChange={(o) => { setShowIncidentDialog(o ? c.id : null); if (!o) setEditIncident(undefined); }}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" data-testid={`button-add-incident-${c.id}`}><Plus className="w-3 h-3 mr-1" /> Add Incident</Button>
                      </DialogTrigger>
                      <IncidentDialog conditionId={c.id} incident={editIncident} onClose={() => { setShowIncidentDialog(null); setEditIncident(undefined); }} />
                    </Dialog>
                  </div>
                  {condIncidents.length === 0 ? (
                    <p className="text-xs text-muted-foreground">No incidents linked. Add incidents to strengthen your nexus.</p>
                  ) : (
                    <div className="space-y-2">
                      {condIncidents.map((inc) => (
                        <div key={inc.id} className="flex items-start justify-between gap-2 p-2 rounded-md bg-muted/30 text-sm">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {inc.incidentDate && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{inc.incidentDate}</span>}
                              {inc.location && <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="w-3 h-3" />{inc.location}</span>}
                              {inc.documented && <Badge variant="outline" className="text-xs">Documented</Badge>}
                            </div>
                            <p className="text-foreground">{inc.description}</p>
                          </div>
                          <Button size="icon" variant="ghost" onClick={() => deleteIncidentMutation.mutate(inc.id)}>
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}

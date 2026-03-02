import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle, ChevronRight, ChevronLeft, Save } from "lucide-react";

const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];
const DISCHARGE_TYPES = ["Honorable", "General (Under Honorable)", "Other Than Honorable", "Bad Conduct", "Dishonorable"];
const STEPS = ["Military Service", "Deployments & Exposures", "VA Info", "Review & Save"];

export default function Intake() {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profile"],
    select: (data: any) => {
      if (data && !formData._loaded) {
        setFormData({ ...data, _loaded: true });
      }
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const { _loaded, id, createdAt, updatedAt, ...cleanData } = data;
      const res = await apiRequest("POST", "/api/profile", cleanData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      toast({ title: "Profile saved", description: "Your veteran profile has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    },
  });

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" data-testid="text-intake-title">Veteran Profile Intake</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete your profile to generate accurate claim documents.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                i === step
                  ? "bg-primary text-primary-foreground"
                  : i < step
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
              data-testid={`button-step-${i}`}
            >
              {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-5 text-center">{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Branch of Service</Label>
                  <Select value={formData.branch || ""} onValueChange={(v) => update("branch", v)}>
                    <SelectTrigger data-testid="select-branch"><SelectValue placeholder="Select branch" /></SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Rank</Label>
                  <Input value={formData.rank || ""} onChange={(e) => update("rank", e.target.value)} placeholder="e.g., E-5 / SGT" data-testid="input-rank" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>MOS / Rate</Label>
                <Input value={formData.mosRate || ""} onChange={(e) => update("mosRate", e.target.value)} placeholder="e.g., 11B Infantry" data-testid="input-mos" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Service Start Date</Label>
                  <Input type="date" value={formData.serviceStartDate || ""} onChange={(e) => update("serviceStartDate", e.target.value)} data-testid="input-start-date" />
                </div>
                <div className="space-y-2">
                  <Label>Service End Date</Label>
                  <Input type="date" value={formData.serviceEndDate || ""} onChange={(e) => update("serviceEndDate", e.target.value)} data-testid="input-end-date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Discharge Type</Label>
                <Select value={formData.dischargeType || ""} onValueChange={(v) => update("dischargeType", v)}>
                  <SelectTrigger data-testid="select-discharge"><SelectValue placeholder="Select discharge type" /></SelectTrigger>
                  <SelectContent>
                    {DISCHARGE_TYPES.map((d) => (<SelectItem key={d} value={d}>{d}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Deployment Locations (comma separated)</Label>
                <Input
                  value={formData.deploymentLocations?.join(", ") || ""}
                  onChange={(e) => update("deploymentLocations", e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean))}
                  placeholder="e.g., Iraq, Afghanistan, Kuwait"
                  data-testid="input-deployments"
                />
              </div>
              <div className="space-y-3 pt-2">
                <Label className="text-base">Exposure History</Label>
                {[
                  { key: "agentOrangeExposure", label: "Agent Orange Exposure" },
                  { key: "campLejeune", label: "Camp Lejeune Contaminated Water" },
                  { key: "burnPitExposure", label: "Burn Pit / Airborne Hazards" },
                  { key: "gulfWarService", label: "Gulf War Service (SW Asia Theater)" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3">
                    <Checkbox
                      checked={!!formData[key]}
                      onCheckedChange={(v) => update(key, !!v)}
                      data-testid={`checkbox-${key}`}
                    />
                    <Label className="text-sm font-normal">{label}</Label>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VA File Number</Label>
                  <Input value={formData.vaFileNumber || ""} onChange={(e) => update("vaFileNumber", e.target.value)} placeholder="Optional" data-testid="input-va-file" />
                </div>
                <div className="space-y-2">
                  <Label>Current VA Rating (%)</Label>
                  <Input type="number" min={0} max={100} value={formData.currentRating || ""} onChange={(e) => update("currentRating", parseInt(e.target.value) || 0)} data-testid="input-current-rating" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={formData.dateOfBirth || ""} onChange={(e) => update("dateOfBirth", e.target.value)} data-testid="input-dob" />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.address || ""} onChange={(e) => update("address", e.target.value)} placeholder="Street address" data-testid="input-address" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={formData.city || ""} onChange={(e) => update("city", e.target.value)} data-testid="input-city" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={formData.state || ""} onChange={(e) => update("state", e.target.value)} data-testid="input-state" />
                </div>
                <div className="space-y-2">
                  <Label>ZIP</Label>
                  <Input value={formData.zip || ""} onChange={(e) => update("zip", e.target.value)} data-testid="input-zip" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review your information before saving.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ["Branch", formData.branch],
                  ["Rank", formData.rank],
                  ["MOS/Rate", formData.mosRate],
                  ["Service Dates", `${formData.serviceStartDate || "N/A"} to ${formData.serviceEndDate || "N/A"}`],
                  ["Discharge", formData.dischargeType],
                  ["Deployments", formData.deploymentLocations?.join(", ")],
                  ["Current Rating", formData.currentRating ? `${formData.currentRating}%` : "Not rated"],
                  ["VA File #", formData.vaFileNumber],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <p className="text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground">{(value as string) || "Not provided"}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.agentOrangeExposure && <Badge variant="outline">Agent Orange</Badge>}
                {formData.campLejeune && <Badge variant="outline">Camp Lejeune</Badge>}
                {formData.burnPitExposure && <Badge variant="outline">Burn Pit</Badge>}
                {formData.gulfWarService && <Badge variant="outline">Gulf War</Badge>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} data-testid="button-prev-step">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep(step + 1)} data-testid="button-next-step">
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        ) : (
          <Button onClick={() => saveMutation.mutate(formData)} disabled={saveMutation.isPending} data-testid="button-save-profile">
            <Save className="w-4 h-4 mr-1" />
            {saveMutation.isPending ? "Saving..." : "Save Profile"}
          </Button>
        )}
      </div>
    </div>
  );
}

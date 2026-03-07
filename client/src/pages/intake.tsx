import { useState, useRef, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, ChevronRight, ChevronLeft, Save, Upload, FileText, Trash2, Loader2, AlertCircle, ArrowLeft, ExternalLink, Stethoscope, Info, Send } from "lucide-react";
import { Link } from "wouter";
import type { SupportingDocument, Condition } from "@shared/schema";
import { trackTrialStarted } from "@/lib/analytics";

const BRANCHES = ["Army", "Navy", "Air Force", "Marines", "Coast Guard", "Space Force"];
const DISCHARGE_TYPES = ["Honorable", "General (Under Honorable)", "Other Than Honorable", "Bad Conduct", "Dishonorable"];
const STEPS = ["Military Service", "Deployments & Exposures", "VA Info", "Supporting Documents", "Review & Save"];
const HEAR_ABOUT_OPTIONS = ["Google Search", "Social Media", "Word of Mouth", "Reddit/Forum", "VA Office/VSO", "YouTube", "Other"];

const DOC_CATEGORIES = [
  { value: "decision_letter", label: "VA Decision Letter", accept: ".pdf,.txt", description: "Upload your VA rating decision letter (PDF or text file)" },
  { value: "denial_letter", label: "VA Denial Letter", accept: ".pdf,.txt", description: "Upload any VA denial letters (PDF or text file)" },
  { value: "medical_records", label: "Medical Records", accept: ".txt", description: "Upload medical records exported to plain text (.txt). For optimal outcomes, include your service treatment records and any relevant medical documentation." },
];

export default function Intake() {
  const { toast } = useToast();
  const urlParams = new URLSearchParams(window.location.search);
  const fromSettings = urlParams.get("from") === "settings";
  const initialStep = parseInt(urlParams.get("step") || "0", 10);
  const [step, setStep] = useState(isNaN(initialStep) ? 0 : Math.min(Math.max(initialStep, 0), 4));
  const [formData, setFormData] = useState<any>({ hearAboutUs: "" });
  const [uploadCategory, setUploadCategory] = useState("decision_letter");
  const [referralEmail, setReferralEmail] = useState("");
  const [referralMessage, setReferralMessage] = useState("");
  const [deploymentLocationsText, setDeploymentLocationsText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading } = useQuery<any>({
    queryKey: ["/api/profile"],
    select: (data: any) => {
      if (data && !formData._loaded) {
        setFormData({ ...data, _loaded: true });
        if (Array.isArray(data.deploymentLocations)) {
          setDeploymentLocationsText(data.deploymentLocations.join(", "));
        }
      }
      return data;
    },
  });

  const { data: supportingDocs = [], isLoading: docsLoading } = useQuery<SupportingDocument[]>({
    queryKey: ["/api/supporting-documents"],
  });

  const { data: conditions = [] } = useQuery<Condition[]>({
    queryKey: ["/api/conditions"],
  });

  const [uploadFeedback, setUploadFeedback] = useState<{ fileName: string; conditionsFound: string[] } | null>(null);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const { _loaded, id, createdAt, updatedAt, ...cleanData } = data;
      cleanData.deploymentLocations = deploymentLocationsText
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      const res = await apiRequest("POST", "/api/profile", cleanData);
      return res.json();
    },
    onSuccess: () => {
      const wasNew = !profile || !profile.id;
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      if (wasNew) {
        trackTrialStarted();
      }
      toast({ title: "Profile saved", description: "Your veteran profile has been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, category }: { file: File; category: string }) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", category);
      const res = await fetch("/api/supporting-documents", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }
      return res.json();
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/supporting-documents"] });
      if (uploadCategory === "medical_records" && conditions.length > 0 && data?.extractedContext) {
        const found = conditions
          .filter((c) => {
            const name = c.conditionName.toLowerCase();
            const ctx = (data.extractedContext || "").toLowerCase();
            return ctx.includes(name) ||
              (c.icd10Code && ctx.includes(c.icd10Code.toLowerCase())) ||
              (c.diagnosticCode && ctx.includes(c.diagnosticCode.toLowerCase()));
          })
          .map((c) => c.conditionName);
        setUploadFeedback({ fileName: data.fileName, conditionsFound: found });
      } else {
        setUploadFeedback(null);
      }
      toast({ title: "Document uploaded", description: "Your file has been saved." });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: any) => {
      toast({ title: "Upload failed", description: error.message || "Please try again.", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/supporting-documents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/supporting-documents"] });
      toast({ title: "Document removed" });
    },
  });

  const referralMutation = useMutation({
    mutationFn: async ({ refereeEmail, message }: { refereeEmail: string; message: string }) => {
      const res = await apiRequest("POST", "/api/referrals", { refereeEmail, message });
      return res.json();
    },
    onSuccess: () => {
      setReferralEmail("");
      setReferralMessage("");
      toast({ title: "Referral sent", description: "Your battle buddy will receive an email about Nexus247." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send referral.", variant: "destructive" });
    },
  });

  const update = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate({ file, category: uploadCategory });
  };

  const categoryLabel = (cat: string) => DOC_CATEGORIES.find((c) => c.value === cat)?.label || cat;

  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  const isNewUser = !profile || !profile.id;

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      {isNewUser && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="pt-6 space-y-2">
            <h2 className="text-lg font-semibold text-foreground" data-testid="text-profile-required-heading">Complete Your Profile to Get Started</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-profile-required-body">
              For Nexus247 to generate accurate, CFR-grounded documents tailored to your claim, we need your military service details. This information helps our AI build letters that reference the right regulations and evidence for your specific situation.
            </p>
            <p className="text-xs text-muted-foreground/70" data-testid="text-profile-required-time">This usually takes about 5 minutes.</p>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-intake-title">Veteran Profile Intake</h1>
          <p className="text-muted-foreground text-sm mt-1">Complete your profile to generate accurate claim documents.</p>
        </div>
        {fromSettings && (
          <Link href="/settings">
            <Button variant="outline" size="sm" data-testid="button-back-to-settings">
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Settings
            </Button>
          </Link>
        )}
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
                  <Label>First Name</Label>
                  <Input value={formData.firstName || ""} onChange={(e) => update("firstName", e.target.value)} placeholder="e.g., John" data-testid="input-first-name" />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={formData.lastName || ""} onChange={(e) => update("lastName", e.target.value)} placeholder="e.g., Smith" data-testid="input-last-name" />
                </div>
              </div>
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
                  value={deploymentLocationsText}
                  onChange={(e) => setDeploymentLocationsText(e.target.value)}
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
            <>
              <div className="space-y-3">
                <div className="p-3 rounded-md bg-muted/50 border border-border">
                  <div className="flex items-start gap-2">
                    <Stethoscope className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="font-medium text-foreground" data-testid="text-conditions-guidance">Enter every condition you have or plan to claim — even ones you're exploring.</p>
                      <p>
                        The more conditions you add on the{" "}
                        <Link href="/conditions" className="text-primary underline underline-offset-2" data-testid="link-conditions-page">
                          Conditions page
                        </Link>
                        , the better our AI can extract relevant information from your medical records and generate stronger documents.
                      </p>
                      {conditions.length === 0 && (
                        <p className="text-xs text-destructive/80 mt-1" data-testid="text-no-conditions-warning">
                          You haven't added any conditions yet. Add your conditions first for the best results.
                        </p>
                      )}
                      {conditions.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {conditions.map((c) => (
                            <Badge key={c.id} variant="outline" className="text-xs" data-testid={`badge-condition-${c.id}`}>
                              {c.conditionName}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-muted/50 border border-border">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>
                        Documents are optional but significantly improve the accuracy and strength of your generated letters. Decision letters and denial letters accept both PDF and text files.
                      </p>
                      <p className="font-medium text-foreground" data-testid="text-medical-records-instructions">Medical records must be uploaded as plain text (.txt) files.</p>
                      <div className="mt-2 p-2 rounded-md bg-background border border-border text-xs space-y-1" data-testid="text-va-download-instructions">
                        <p className="font-medium text-foreground flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-primary shrink-0" />
                          How to download your records from VA.gov:
                        </p>
                        <ol className="list-decimal pl-5 space-y-0.5 text-muted-foreground">
                          <li>Go to <a href="https://www.va.gov/my-health/medical-records" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2" data-testid="link-va-records">VA.gov Medical Records <ExternalLink className="w-3 h-3 inline" /></a></li>
                          <li>Sign in with your VA account (Login.gov or ID.me)</li>
                          <li>Navigate to <strong>Blue Button Report</strong> or <strong>Health Records</strong></li>
                          <li>Select the date range (include your full service period)</li>
                          <li>Choose <strong>Text File (.txt)</strong> as the download format</li>
                          <li>Upload the downloaded .txt file here</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Document Type</Label>
                <Select value={uploadCategory} onValueChange={setUploadCategory}>
                  <SelectTrigger data-testid="select-doc-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {DOC_CATEGORIES.find((c) => c.value === uploadCategory)?.description}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept={DOC_CATEGORIES.find((c) => c.value === uploadCategory)?.accept || ".pdf,.txt"}
                  onChange={handleFileUpload}
                  className="flex-1"
                  data-testid="input-file-upload"
                />
                {uploadMutation.isPending && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </div>
                )}
              </div>

              {uploadFeedback && (
                <div className="p-3 rounded-md border border-border bg-muted/20 space-y-2" data-testid="upload-feedback">
                  <p className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Stethoscope className="w-4 h-4 text-primary shrink-0" />
                    Medical Records Analysis: {uploadFeedback.fileName}
                  </p>
                  {uploadFeedback.conditionsFound.length > 0 ? (
                    <div className="space-y-1.5">
                      <p className="text-xs text-muted-foreground">
                        Found references to {uploadFeedback.conditionsFound.length} of your {conditions.length} condition{conditions.length !== 1 ? "s" : ""}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {uploadFeedback.conditionsFound.map((name) => (
                          <Badge key={name} variant="outline" className="text-xs" data-testid={`badge-found-${name}`}>
                            <CheckCircle className="w-3 h-3 mr-1 text-green-600 dark:text-green-400" />
                            {name}
                          </Badge>
                        ))}
                      </div>
                      {uploadFeedback.conditionsFound.length < conditions.length && (
                        <p className="text-xs text-muted-foreground">
                          Some conditions were not found in this document. This is normal — they may appear in other records or may not yet be documented.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground" data-testid="text-no-conditions-found">
                      No specific condition references were detected in this upload. The records will still be available for document generation. Consider checking that your conditions are entered on the Conditions page.
                    </p>
                  )}
                </div>
              )}

              {docsLoading ? (
                <Skeleton className="h-20" />
              ) : supportingDocs.length > 0 ? (
                <div className="space-y-2 pt-2">
                  <Label>Uploaded Documents</Label>
                  {supportingDocs.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between gap-2 p-3 rounded-md border border-border bg-muted/20" data-testid={`doc-${doc.id}`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-primary shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{doc.fileName}</p>
                          <p className="text-xs text-muted-foreground">{categoryLabel(doc.category)} · {doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : ""}</p>
                        </div>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(doc.id)}
                        disabled={deleteMutation.isPending}
                        data-testid={`button-delete-doc-${doc.id}`}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Upload className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No documents uploaded yet.</p>
                  <p className="text-xs mt-1">This step is optional. You can add documents later.</p>
                </div>
              )}
            </>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Review your information before saving.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {[
                  ["Name", [formData.firstName, formData.lastName].filter(Boolean).join(" ") || null],
                  ["Branch", formData.branch],
                  ["Rank", formData.rank],
                  ["MOS/Rate", formData.mosRate],
                  ["Service Dates", `${formData.serviceStartDate || "N/A"} to ${formData.serviceEndDate || "N/A"}`],
                  ["Discharge", formData.dischargeType],
                  ["Deployments", deploymentLocationsText],
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
              {supportingDocs.length > 0 && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Supporting Documents ({supportingDocs.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {supportingDocs.map((doc) => (
                      <Badge key={doc.id} variant="outline" className="text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {doc.fileName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 pt-4 border-t border-border">
                <Label>How did you hear about Nexus247?</Label>
                <Select value={formData.hearAboutUs || ""} onValueChange={(v) => update("hearAboutUs", v)}>
                  <SelectTrigger data-testid="select-hear-about-us"><SelectValue placeholder="Select an option" /></SelectTrigger>
                  <SelectContent>
                    {HEAR_ABOUT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Share Nexus247 with a Battle Buddy</p>
                  <p className="text-xs text-muted-foreground mt-1">Know a fellow veteran who could benefit? Send them an invite.</p>
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    placeholder="Battle buddy's email"
                    data-testid="input-referral-email"
                  />
                  <Textarea
                    value={referralMessage}
                    onChange={(e) => setReferralMessage(e.target.value)}
                    placeholder="Add a personal message (optional)"
                    className="resize-none"
                    rows={2}
                    data-testid="input-referral-message"
                  />
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (!referralEmail.trim()) {
                        toast({ title: "Email required", description: "Enter your battle buddy's email address.", variant: "destructive" });
                        return;
                      }
                      referralMutation.mutate({ refereeEmail: referralEmail.trim(), message: referralMessage.trim() });
                    }}
                    disabled={referralMutation.isPending}
                    data-testid="button-send-referral"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    {referralMutation.isPending ? "Sending..." : "Send Referral"}
                  </Button>
                </div>
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

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Calculator,
  Plus,
  Trash2,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Home,
  Hand,
  Info,
} from "lucide-react";
import type { Condition } from "@shared/schema";

const VA_CONDITIONS = [
  { name: "PTSD", code: "DC 9411", minRating: 10 },
  { name: "Major Depressive Disorder", code: "DC 9434", minRating: 10 },
  { name: "Generalized Anxiety Disorder", code: "DC 9400", minRating: 10 },
  { name: "Bipolar Disorder", code: "DC 9432", minRating: 10 },
  { name: "Adjustment Disorder", code: "DC 9440", minRating: 10 },
  { name: "Tinnitus", code: "DC 6260", minRating: 10 },
  { name: "Hearing Loss (Bilateral)", code: "DC 6100", minRating: 0 },
  { name: "Sleep Apnea (Obstructive)", code: "DC 6847", minRating: 30 },
  { name: "Lumbosacral Strain (Low Back)", code: "DC 5237", minRating: 10 },
  { name: "Degenerative Arthritis of the Spine", code: "DC 5242", minRating: 10 },
  { name: "Intervertebral Disc Syndrome", code: "DC 5243", minRating: 10 },
  { name: "Cervical Strain (Neck)", code: "DC 5237", minRating: 10 },
  { name: "Knee Instability", code: "DC 5257", minRating: 10 },
  { name: "Knee Limited Flexion", code: "DC 5260", minRating: 10 },
  { name: "Knee Limited Extension", code: "DC 5261", minRating: 10 },
  { name: "Ankle Limited Motion", code: "DC 5271", minRating: 10 },
  { name: "Shoulder Limited Motion", code: "DC 5201", minRating: 20 },
  { name: "Plantar Fasciitis", code: "DC 5276", minRating: 10 },
  { name: "Flat Feet (Bilateral)", code: "DC 5276", minRating: 10 },
  { name: "Migraine Headaches", code: "DC 8100", minRating: 10 },
  { name: "Radiculopathy (Upper)", code: "DC 8510", minRating: 10 },
  { name: "Radiculopathy (Lower)", code: "DC 8520", minRating: 10 },
  { name: "Peripheral Neuropathy (Upper)", code: "DC 8515", minRating: 10 },
  { name: "Peripheral Neuropathy (Lower)", code: "DC 8520", minRating: 10 },
  { name: "Sinusitis (Chronic)", code: "DC 6513", minRating: 10 },
  { name: "Rhinitis (Allergic)", code: "DC 6522", minRating: 10 },
  { name: "Gastroesophageal Reflux (GERD)", code: "DC 7346", minRating: 10 },
  { name: "Irritable Bowel Syndrome (IBS)", code: "DC 7319", minRating: 10 },
  { name: "Erectile Dysfunction", code: "DC 7522", minRating: 0 },
  { name: "Diabetes Mellitus Type II", code: "DC 7913", minRating: 10 },
  { name: "Hypertension", code: "DC 7101", minRating: 10 },
  { name: "Traumatic Brain Injury (TBI)", code: "DC 8045", minRating: 10 },
  { name: "Scars (Painful/Unstable)", code: "DC 7804", minRating: 10 },
  { name: "Eczema / Dermatitis", code: "DC 7806", minRating: 10 },
  { name: "Asthma (Bronchial)", code: "DC 6602", minRating: 10 },
  { name: "Carpal Tunnel Syndrome", code: "DC 8515", minRating: 10 },
  { name: "Hip Limited Motion", code: "DC 5252", minRating: 10 },
  { name: "Fibromyalgia", code: "DC 5025", minRating: 10 },
  { name: "Chronic Fatigue Syndrome", code: "DC 6354", minRating: 10 },
  { name: "TMJ Disorder", code: "DC 9905", minRating: 10 },
];

function ConditionCombobox({
  value,
  onChange,
  onSelectCondition,
  index,
}: {
  value: string;
  onChange: (val: string) => void;
  onSelectCondition: (condition: typeof VA_CONDITIONS[0]) => void;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = value.length >= 1
    ? VA_CONDITIONS.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase()) ||
        c.code.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8)
    : [];

  const showDropdown = open && filtered.length > 0;

  useEffect(() => {
    setFocusedIdx(-1);
  }, [value]);

  const handleSelect = (condition: typeof VA_CONDITIONS[0]) => {
    onChange(condition.name);
    onSelectCondition(condition);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIdx((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && focusedIdx >= 0) {
      e.preventDefault();
      handleSelect(filtered[focusedIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="relative flex-1">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder="Start typing a condition..."
        data-testid={`input-condition-name-${index}`}
        autoComplete="off"
      />
      {showDropdown && (
        <div
          ref={listRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg max-h-48 overflow-y-auto"
          data-testid={`dropdown-conditions-${index}`}
        >
          {filtered.map((c, idx) => (
            <button
              key={c.name}
              type="button"
              className={`w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center justify-between gap-2 ${
                idx === focusedIdx ? "bg-accent" : ""
              }`}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(c);
              }}
              data-testid={`option-condition-${idx}`}
            >
              <span className="font-medium">{c.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {c.code} · min {c.minRating}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RatingEstimator() {
  const { toast } = useToast();
  const [entries, setEntries] = useState<{ name: string; rating: number }[]>([
    { name: "", rating: 0 },
  ]);
  const [result, setResult] = useState<any>(null);
  const [showSmcTable, setShowSmcTable] = useState(false);

  const { data: conditionsList = [] } = useQuery<Condition[]>({
    queryKey: ["/api/conditions"],
  });

  const calculateMutation = useMutation({
    mutationFn: async (conditions: any[]) => {
      const res = await apiRequest("POST", "/api/rating/estimate", { conditions });
      return res.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({ title: "Rating calculated" });
    },
    onError: () => {
      toast({ title: "Calculation failed", variant: "destructive" });
    },
  });

  const addEntry = () => {
    setEntries([...entries, { name: "", rating: 0 }]);
  };

  const removeEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const updateEntry = (index: number, field: string, value: any) => {
    const updated = [...entries];
    updated[index] = { ...updated[index], [field]: value };
    setEntries(updated);
  };

  const selectCondition = (index: number, condition: typeof VA_CONDITIONS[0]) => {
    const updated = [...entries];
    updated[index] = { name: condition.name, rating: condition.minRating };
    setEntries(updated);
  };

  const loadFromProfile = () => {
    if (conditionsList.length) {
      setEntries(
        conditionsList.map((c) => ({
          name: c.conditionName,
          rating: c.claimedRating || c.currentRating || 0,
        })),
      );
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground" data-testid="text-rating-title">
          Combined Rating Estimator
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Calculate your VA combined disability rating using the official whole-person method.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-md bg-primary/5 border border-primary/10">
        <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          The VA uses a "whole person" method to calculate combined ratings &mdash; your disabilities are
          not simply added together. Each additional condition is applied to your remaining healthy
          percentage. For example, a 50% plus a 30% does not equal 80%. Instead: 50% leaves 50% healthy,
          then 30% of that 50% = 15%, giving a combined 65% (rounded to 70%).
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-lg">Conditions & Ratings</CardTitle>
            {conditionsList.length > 0 && (
              <Button size="sm" variant="outline" onClick={loadFromProfile} data-testid="button-load-profile">
                Load from Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {entries.map((entry, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1 space-y-1">
                {i === 0 && (
                  <Label className="text-xs text-muted-foreground">Disability or medical condition rated by the VA</Label>
                )}
                <ConditionCombobox
                  value={entry.name}
                  onChange={(val) => updateEntry(i, "name", val)}
                  onSelectCondition={(c) => selectCondition(i, c)}
                  index={i}
                />
              </div>
              <div className="w-24 space-y-1">
                {i === 0 && (
                  <Label className="text-xs text-muted-foreground">VA Rating</Label>
                )}
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={10}
                  value={entry.rating}
                  onChange={(e) => updateEntry(i, "rating", parseInt(e.target.value) || 0)}
                  data-testid={`input-rating-${i}`}
                />
              </div>
              {entries.length > 1 && (
                <Button size="icon" variant="ghost" onClick={() => removeEntry(i)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <p className="text-xs text-muted-foreground">Start typing to see common VA-rated conditions, or enter your own.</p>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={addEntry} data-testid="button-add-rating">
              <Plus className="w-4 h-4 mr-1" /> Add Condition
            </Button>
            <Button
              onClick={() =>
                calculateMutation.mutate(
                  entries.filter((e) => e.name && e.rating > 0),
                )
              }
              disabled={calculateMutation.isPending || !entries.some((e) => e.rating > 0)}
              data-testid="button-calculate"
            >
              <Calculator className="w-4 h-4 mr-1" />
              {calculateMutation.isPending ? "Calculating..." : "Calculate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Combined Rating</p>
                  <p className="text-4xl font-bold text-primary" data-testid="text-combined-rating">
                    {result.combinedRating}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Monthly</p>
                  <p className="text-4xl font-bold text-foreground" data-testid="text-monthly-benefit">
                    <DollarSign className="w-7 h-7 inline" />
                    {result.estimatedMonthly?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Benefit</p>
                  <p className="text-4xl font-bold text-foreground">
                    <DollarSign className="w-7 h-7 inline" />
                    {(result.estimatedMonthly * 12).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.nextTier && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Next Rating Tier: {result.nextTier}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Monthly increase potential: +${result.monthlyIncreasePotential?.toLocaleString()}/mo
                      (${result.nextTierMonthly?.toLocaleString()}/mo total)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                {result.tdiuEligible ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    TDIU Eligibility
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.tdiuEligible
                      ? "You may be eligible for Total Disability based on Individual Unemployability (38 CFR § 4.16). TDIU pays at the 100% rate ($3,939/mo)."
                      : "Requires 60%+ combined with at least one 60%+ condition, or 70%+ combined with one 40%+ condition"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                {result.smcSEligible ? (
                  <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                ) : result.smcEligible ? (
                  <Star className="w-5 h-5 text-yellow-500 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium text-foreground">
                    SMC-S (Housebound)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.smcSEligible
                      ? `Eligible: 100% rating + additional 60%+ condition. SMC-S rate: $${result.smcSRate?.toLocaleString()}/mo`
                      : result.smcEligible
                        ? `100% rating achieved. SMC-S requires an additional condition rated 60%+. SMC-S rate: $${result.smcSRate?.toLocaleString()}/mo`
                        : "Requires 100% schedular rating plus an additional disability rated 60%+ (38 CFR § 3.350)"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Hand className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">SMC-K (Loss of Use)</p>
                  <p className="text-xs text-muted-foreground">
                    ${result.smcKRate}/mo added per qualifying loss (hand, foot, eye, reproductive organ). Up to 3 awards.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <button
                className="flex items-center justify-between w-full"
                onClick={() => setShowSmcTable(!showSmcTable)}
                data-testid="button-toggle-smc-table"
              >
                <CardTitle className="text-base flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  All SMC Levels & Rates (2026)
                </CardTitle>
                {showSmcTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </CardHeader>
            {showSmcTable && result.smcLevels && (
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {result.smcLevels.map((smc: any) => (
                    <div
                      key={smc.level}
                      className={`flex items-start gap-3 p-2.5 rounded-md border ${
                        smc.level === "S" && result.smcSEligible
                          ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                          : "border-border bg-muted/20"
                      }`}
                      data-testid={`smc-level-${smc.level}`}
                    >
                      <Badge variant="outline" className="shrink-0 font-mono text-xs min-w-[3rem] justify-center">
                        {smc.level}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground leading-relaxed">{smc.description}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground shrink-0 tabular-nums">
                        ${smc.rate.toLocaleString()}/mo
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>

          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground italic">
                This calculator uses the VA's whole-person impairment methodology per 38 CFR § 4.25.
                Rates shown are 2026 COLA rates (effective Dec 1, 2025) for a single veteran with no dependents.
                Actual rating and SMC eligibility may differ based on individual circumstances.
                Consult your VSO or an accredited VA claims agent for official determinations.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

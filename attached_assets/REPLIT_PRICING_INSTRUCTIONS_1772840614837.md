# Replit Agent Instructions — Pricing Update
## File to edit: `client/src/pages/landing.tsx`

---

## CHANGE 1 — Rename "Basic" to "Starter" and raise price to $29

Find this in the `tiers` array:
```
name: "Basic",
price: "$19",
description: "Get started with essential claim tools",
```

Replace with:
```
name: "Starter",
price: "$29",
description: "For veterans exploring their options",
```

Also find this feature text inside the Basic/Starter tier:
```
text: "All Basic features",
```
Replace with:
```
text: "All Starter features",
```

---

## CHANGE 2 — Add annual billing fields to each tier object

Each tier object needs two new fields. Add them at the end of each tier, before the closing `}`:

**Starter tier — add:**
```typescript
annualPrice: null,
annualSavings: null,
```

**Pro tier — add:**
```typescript
annualPrice: "$399",
annualSavings: "Save $189 — 3 months free",
```

**Concierge tier — add:**
```typescript
annualPrice: null,
annualSavings: null,
```

Also update the TypeScript type for tiers if there is one, adding:
```typescript
annualPrice: string | null;
annualSavings: string | null;
```

---

## CHANGE 3 — Add annual billing toggle state

Inside the `Landing()` function, find the existing useState declarations near the top:
```typescript
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const [rpaModalOpen, setRpaModalOpen] = useState(false);
```

Add this line directly below them:
```typescript
const [annualBilling, setAnnualBilling] = useState(false);
```

---

## CHANGE 4 — Update the pricing section header copy

Find this h2 inside the pricing section:
```
Simple, Transparent Pricing
```
Replace with:
```
Less than one hour of an attorney's time.
```

Find this paragraph below it:
```
Start with a <span ...>free 3-day Pro trial</span> — no credit card required. Then choose the plan that fits your claims needs.
```
Replace with:
```tsx
The average VA attorney charges $300–$500/hr and takes{" "}
<strong style={{ color: "var(--navy)" }}>20% of your retro pay</strong>. We charge a flat monthly
rate — and show you the score before you submit.
<br /><br />
Start with a <span style={{ color: "var(--gold)", fontWeight: 600 }}>free 3-day Pro trial</span> — no credit card required.
```

---

## CHANGE 5 — Add annual toggle UI above pricing cards

Find this line inside the pricing section (just before the `<PricingAnchor />` line, or before the tiers grid if PricingAnchor isn't added yet):
```tsx
<PricingAnchor />
```

Add this block ABOVE it:
```tsx
{/* Annual billing toggle */}
<div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 14, marginBottom: "3rem" }}>
  <span style={{ fontSize: "0.82rem", color: annualBilling ? "rgba(11,28,46,0.4)" : "var(--navy)", fontWeight: annualBilling ? 400 : 600, transition: "color 0.2s" }}>
    Monthly
  </span>
  <button
    type="button"
    onClick={() => setAnnualBilling(!annualBilling)}
    style={{
      width: 44, height: 24, borderRadius: 12,
      background: annualBilling ? "var(--gold)" : "rgba(11,28,46,0.15)",
      border: "none", cursor: "pointer", position: "relative", transition: "background 0.2s",
    }}
  >
    <div style={{
      position: "absolute", top: 3, left: annualBilling ? 23 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "#fff",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s",
    }} />
  </button>
  <span style={{ fontSize: "0.82rem", color: annualBilling ? "var(--navy)" : "rgba(11,28,46,0.4)", fontWeight: annualBilling ? 600 : 400, transition: "color 0.2s" }}>
    Annual
  </span>
  <span style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
    letterSpacing: "0.1em", color: "#1a9e6b",
    background: "rgba(26,158,107,0.1)", border: "1px solid rgba(26,158,107,0.25)",
    padding: "3px 10px", borderRadius: 20,
  }}>
    Pro: save $189/yr
  </span>
</div>
```

---

## CHANGE 6 — Update price display in each tier card

Find the price display block inside the tiers `.map()`:
```tsx
<div style={{
  fontFamily: "'DM Serif Display', serif", fontSize: "3rem",
  color: "#fff", lineHeight: 1, marginBottom: "0.3rem",
}}>
  {tier.price}<span style={{ fontSize: "1rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>/month</span>
</div>
```

Replace with:
```tsx
<div style={{
  fontFamily: "'DM Serif Display', serif", fontSize: "3rem",
  color: "#fff", lineHeight: 1, marginBottom: "0.3rem",
}}>
  {annualBilling && tier.annualPrice ? tier.annualPrice : tier.price}
  <span style={{ fontSize: "1rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
    {annualBilling && tier.annualPrice ? "/year" : "/month"}
  </span>
</div>
{annualBilling && tier.annualSavings && (
  <div style={{
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
    color: "#1a9e6b", letterSpacing: "0.08em", marginBottom: "0.4rem",
  }}>
    ✓ {tier.annualSavings}
  </div>
)}
```

---

## CHANGE 7 — Stripe price IDs (backend)
### File: `server/stripe.ts` or wherever PRICE_TO_TIER / TIER_TO_PRICE are defined

You need to add the new annual Pro price ID from Stripe. After creating the $399/yr Pro product in Stripe:

1. Copy the new Price ID (starts with `price_`)
2. Add it to the `PRICE_TO_TIER` map:
```typescript
"price_YOUR_ANNUAL_PRO_ID": "pro",
```
3. Add it to the `TIER_TO_PRICE` map or equivalent:
```typescript
pro_annual: "price_YOUR_ANNUAL_PRO_ID",
```

---

## CHANGE 8 — Checkout route (backend)
### File: `server/routes.ts`

Find the checkout session creation route (likely `/api/create-checkout-session` or similar).

Update it to accept an optional `billing` parameter and use the annual price ID when `billing === "annual"` and tier is `"pro"`:

```typescript
const { tier, billing } = req.body; // billing = "monthly" | "annual"

let priceId = TIER_TO_PRICE[tier]; // existing logic

if (tier === "pro" && billing === "annual") {
  priceId = TIER_TO_PRICE["pro_annual"]; // new annual price
}
```

The frontend CTA buttons currently all point to `/api/login`. The annual toggle is display-only for now — users select their plan after login. So this backend change can wait until you build the in-app plan selection screen.

---

## SUMMARY OF CHANGES
| # | File | What changes |
|---|------|-------------|
| 1–6 | `client/src/pages/landing.tsx` | Rename Basic→Starter, $19→$29, add annual toggle UI |
| 7 | `server/stripe.ts` | Add annual Pro price ID (do after Stripe setup) |
| 8 | `server/routes.ts` | Handle annual billing in checkout (can defer) |

Changes 1–6 are safe frontend-only edits. Changes 7–8 only needed when you're ready to sell the annual plan.

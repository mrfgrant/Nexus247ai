# Nexus247 - AI-Powered VA Claims Assistant

## Overview
Nexus247 is a SaaS application that helps veterans generate professional, CFR-grounded VA claims documents using AI. It includes document generation, RPA-style quality scoring, AI claims advisor chat, combined rating estimator, and subscription management.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, shadcn/ui, wouter (routing), TanStack React Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: Replit Auth (OIDC)
- **AI**: Anthropic Claude Sonnet (user's API key via ANTHROPIC_API_KEY env secret)
- **Payments**: Stripe (live keys configured, checkout + webhooks + portal)

## Architecture

### Database Schema (shared/schema.ts)
- `users` + `sessions` — Replit Auth (shared/models/auth.ts)
- `veteranProfiles` — military service, exposures, subscription tier, Stripe IDs
- `conditions` — ICD-10 codes, diagnostic codes, ratings
- `serviceIncidents` — linked to conditions
- `documents` — generated letters with RPA quality scores (5 dimensions)
- `knowledgeBaseEntries` — admin-uploaded real claim decisions
- `chatMessages` — AI claims advisor chat history
- `supportRequests` — human assistance tickets
- `ratingEstimates` — saved rating calculations
- `usageLogs` — usage tracking
- `supportingDocuments` — uploaded VA decision letters, denial letters, medical records
- `letterAnalyses` — saved decision letter analysis results (AI-parsed conditions, errors, appeals, recommendations) + cross-reference evidence gap data

### Backend (server/)
- `server/index.ts` — Express app setup (rawBody capture for Stripe webhooks)
- `server/routes.ts` — All API routes (profile, conditions, incidents, documents, generate, chat, support, knowledge base, rating, dashboard, Stripe checkout/webhook/portal)
- `server/storage.ts` — DatabaseStorage with IStorage interface
- `server/stripe.ts` — Stripe client, price/tier mappings, customer creation helper
- `server/prompts.ts` — CFR-grounded AI prompts for 8 document types + RPA scoring + chat + decision letter analysis
- `server/replit_integrations/auth/` — Replit Auth OIDC integration

### Shared Modules
- `shared/va-rates.ts` — Centralized 2026 VA compensation rates (MONTHLY_RATES, SMC_RATES, SMC_INFO)
- `shared/utils.ts` — `getRankDisplayName(rank, branch, lastName, firstName)` utility for branch-specific rank abbreviation mapping (all branches E-1 through E-9, O-1 through O-10, W-1 through W-5). Used in dashboard greeting, sidebar, chat, settings, AI prompts, and document generation.

### Frontend (client/src/)
- `App.tsx` — Routes + auth-gated layout (print page rendered outside sidebar)
- `components/app-sidebar.tsx` — Navigation sidebar with logo
- **Pages:**
  - `landing.tsx` — Public landing page with hero, features, pricing
  - `dashboard.tsx` — Veteran command center with stats, quick actions, SMC-S eligibility
  - `intake.tsx` — Multi-step veteran profile wizard (5 steps incl. supporting docs upload; deployment locations as free-text)
  - `conditions.tsx` — Conditions + service incidents CRUD (sidebar: "My Conditions")
  - `generate-document.tsx` — Document generation with RPA scoring, URL param pre-fill from analysis, animated thinking steps
  - `documents.tsx` — Document list with filtering, copy/download/print actions
  - `document-print.tsx` — Print-ready document layout for browser Save as PDF
  - `chat.tsx` — AI Claims Advisor chat with rich-text rendering, personalized context (profile, conditions, medical records, decision letter analysis), context banner (sidebar: "Ask VA Questions")
  - `rating-estimator.tsx` — Combined rating calculator with 40-condition auto-suggest combobox, CFR diagnostic codes, min ratings, SMC levels
  - `analyze-letter.tsx` — Upload/paste VA decision letters for AI analysis with saved history (sidebar: "Analyze Decision Letter")
  - `pricing.tsx` — 3-tier pricing comparison
  - `support.tsx` — Human assistance request form
  - `settings.tsx` — Account and subscription management
  - `admin-knowledge-base.tsx` — Admin: manage knowledge base entries
  - `admin-support.tsx` — Admin: manage support requests
  - `admin-users.tsx` — Admin: user management with tier/role/trial controls

### Document Types (8)
All tiers: nexus_letter, personal_statement, buddy_letter, nod, secondary_condition, increase_claim
Concierge only: aod_motion, good_cause_letter

### C&P Exam Prep (Pro+ Feature)
- Page: `client/src/pages/cnp-prep.tsx` — route `/cnp-prep`
- API: `POST /api/cnp-prep` with `{ conditionId }` — Pro/Concierge only
- Two parallel AI calls: full 8-section prep guide (4000 tokens) + printable one-pager cheat sheet (1500 tokens)
- Smart alerts: checks for missing nexus letter (warning) and always recommends buddy letter, with one-click generate buttons pre-filling the generate form
- Monthly limits via usageLogs (action "cnp_prep"): Pro=10, Concierge=50
- Prompts: `CNP_EXAM_PREP_PROMPT` + `CNP_EXAM_CHEATSHEET_PROMPT` in `server/prompts.ts`
- Sidebar: after "Generate Letter" with ClipboardCheck icon and Pro badge

### Subscription Tiers
- None: 0 docs/mo, 0 analyses/mo, 0 C&P preps/mo
- Basic ($19/mo): 5 docs/mo, 2 analyses/mo, 0 C&P preps/mo
- Pro ($49/mo): 50 docs/mo, 10 analyses/mo, 10 C&P preps/mo
- Concierge ($149/mo): 999 docs/mo, 50 analyses/mo, 50 C&P preps/mo + AOD/Good Cause

### Decision Letter Analysis
- Tier-gated: free users blocked, paid users limited by ANALYSIS_LIMITS
- Auto-includes uploaded medical records (category: medical_records) in analysis context
- Cross-reference feature: POST /api/analyze-letter/:id/cross-reference compares medical records against decision findings
- Cross-reference data saved to letterAnalyses.crossReferenceData (jsonb)
- Frontend shows Evidence Gap tab with completeness ratings, win probabilities, priority actions, medical tests needed
- Analysis recommendations have "Generate" buttons that pre-fill the generate form with type, condition, and context (denial reasons, rater errors, missed evidence)

### Document Generation Enhancements
- RPA scoring uses JSON extraction fallback (regex match for `{...}` if JSON.parse fails)
- Nexus letters capped at 2000 max_tokens and prompted for conciseness (under 800 words, signable by real medical professional)
- Generation route fetches latest decision letter analysis and injects findings (denial reasons, rater errors, missed evidence, CFR violations, cross-reference data) into prompt context
- Shared ThinkingSteps component (`client/src/components/thinking-steps.tsx`) used on both analyze and generate pages

### Trial System
- Admin can grant time-limited trials (1-30 days) via Admin > Manage Users
- Trials auto-set tier to Basic if user has no tier
- `getEffectiveTier()` in routes.ts checks trialEndsAt — expired trials revert to "none"
- Dashboard shows trial badge with remaining days
- `veteranProfiles.trialEndsAt` timestamp field tracks trial expiry

### Veteran Addressing Convention
Veterans are addressed by rank + last name throughout the app (e.g., "SPC Grant", "PO2 Smith"). The `getRankDisplayName()` utility in `shared/utils.ts` maps pay grades to branch-specific abbreviations. Used in: dashboard greeting, sidebar profile, chat UI + AI prompt, settings page, and all AI document generation prompts.

### Design Theme
Navy (#0D2137), navy-mid (#163352), gold (#D4A43E), gold-lt (#EAC76A), smoke (#FAFAF7), fog (#EFF0F3). Dark sidebar, military/veteran aesthetic.

### RPA Scoring Modal
- Reusable component: `client/src/components/rpa-scoring-modal.tsx`
- Shows 5 scoring dimensions table with navy/gold design, CTA to login or generate
- Triggered from: landing page feature card, pricing page feature lists, FAQ "How does RPA Quality Scoring work?" question
- Props: `open`, `onOpenChange`, `authenticated` (controls CTA link target)

### Landing Page Hero
- Two-column hero: left = copy + CTAs, right = animated Score Card widget
- Score Card shows 5 animated bars (CFR Compliance, Nexus Strength, Evidence Grounding, Diagnostic Clarity, Rater Readiness) with count-up to 86/100
- Mobile (<900px) stacks vertically

### Stripe Payment Integration
- `server/stripe.ts` — Stripe client + price/tier mappings + customer helper
- Price IDs: Basic=`price_1T776nEBRMFySHqpEY8vdmE9`, Pro=`price_1T777GEBRMFySHqpCBvns2rX`, Concierge=`price_1T778MEBRMFySHqpeyk2TGS4`
- Routes:
  - `POST /api/create-checkout-session` — creates Stripe Checkout Session (requires auth, takes `{ tier }`)
  - `POST /api/create-portal-session` — creates Stripe Customer Portal session (requires auth, needs stripeCustomerId)
  - `POST /api/stripe-webhook` — handles checkout.session.completed, subscription.updated, subscription.deleted, invoice.payment_failed
  - `GET /api/stripe-config` — returns publishable key
- Flow: Pricing button → checkout session → Stripe hosted payment → webhook updates subscriptionTier/status → redirect to /settings?stripe=success
- Webhook uses rawBody from index.ts for signature verification (STRIPE_WEBHOOK_SECRET optional but recommended for production)
- Storage methods: `updateStripeCustomerId`, `getProfileByStripeCustomerId`, `updateSubscriptionFromStripe`

## Environment Secrets
- `ANTHROPIC_API_KEY` — Claude API key
- `SESSION_SECRET` — Express session secret
- `STRIPE_SECRET_KEY` — Stripe secret key (sk_live_...)
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key (pk_live_...) for frontend
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret (optional, for signature verification)
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)

## Running
- `npm run dev` — starts Express + Vite dev server on port 5000
- `npm run db:push` — push schema to database

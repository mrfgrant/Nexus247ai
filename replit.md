# Nexus247 - AI-Powered VA Claims Assistant

## Overview
Nexus247 is a SaaS application that helps veterans generate professional, CFR-grounded VA claims documents using AI. It includes document generation, RPA-style quality scoring, AI claims advisor chat, combined rating estimator, and subscription management.

## Tech Stack
- **Frontend**: React + TypeScript, Vite, TailwindCSS, shadcn/ui, wouter (routing), TanStack React Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL via Drizzle ORM
- **Auth**: Replit Auth (OIDC)
- **AI**: Anthropic Claude Sonnet (user's API key via ANTHROPIC_API_KEY env secret)
- **Payments**: Stripe (not yet connected — needs user OAuth)

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
- `server/index.ts` — Express app setup
- `server/routes.ts` — All API routes (profile, conditions, incidents, documents, generate, chat, support, knowledge base, rating, dashboard)
- `server/storage.ts` — DatabaseStorage with IStorage interface
- `server/prompts.ts` — CFR-grounded AI prompts for 8 document types + RPA scoring + chat + decision letter analysis
- `server/replit_integrations/auth/` — Replit Auth OIDC integration

### Shared Modules
- `shared/va-rates.ts` — Centralized 2026 VA compensation rates (MONTHLY_RATES, SMC_RATES, SMC_INFO)

### Frontend (client/src/)
- `App.tsx` — Routes + auth-gated layout (print page rendered outside sidebar)
- `components/app-sidebar.tsx` — Navigation sidebar with logo
- **Pages:**
  - `landing.tsx` — Public landing page with hero, features, pricing
  - `dashboard.tsx` — Veteran command center with stats, quick actions, SMC-S eligibility
  - `intake.tsx` — Multi-step veteran profile wizard (5 steps incl. supporting docs upload; deployment locations as free-text)
  - `conditions.tsx` — Conditions + service incidents CRUD (sidebar: "My Conditions")
  - `generate-document.tsx` — Document generation with RPA scoring
  - `documents.tsx` — Document list with filtering, copy/download/print actions
  - `document-print.tsx` — Print-ready document layout for browser Save as PDF
  - `chat.tsx` — AI Claims Advisor chat with rich-text rendering (sidebar: "Ask VA Questions")
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

### Subscription Tiers
- None: 0 docs/mo, 0 analyses/mo
- Basic ($19/mo): 5 docs/mo, 2 analyses/mo
- Pro ($49/mo): 50 docs/mo, 10 analyses/mo
- Concierge ($149/mo): 999 docs/mo, 50 analyses/mo + AOD/Good Cause

### Decision Letter Analysis
- Tier-gated: free users blocked, paid users limited by ANALYSIS_LIMITS
- Auto-includes uploaded medical records (category: medical_records) in analysis context
- Cross-reference feature: POST /api/analyze-letter/:id/cross-reference compares medical records against decision findings
- Cross-reference data saved to letterAnalyses.crossReferenceData (jsonb)
- Frontend shows Evidence Gap tab with completeness ratings, win probabilities, priority actions, medical tests needed

### Trial System
- Admin can grant time-limited trials (1-30 days) via Admin > Manage Users
- Trials auto-set tier to Basic if user has no tier
- `getEffectiveTier()` in routes.ts checks trialEndsAt — expired trials revert to "none"
- Dashboard shows trial badge with remaining days
- `veteranProfiles.trialEndsAt` timestamp field tracks trial expiry

### Design Theme
Navy blue primary (#1a3a6b), warm gold accent (#d4a017), dark sidebar, military/veteran aesthetic

## Environment Secrets
- `ANTHROPIC_API_KEY` — Claude API key
- `SESSION_SECRET` — Express session secret
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)

## Running
- `npm run dev` — starts Express + Vite dev server on port 5000
- `npm run db:push` — push schema to database

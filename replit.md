# VetLetters - AI-Powered VA Claims Assistant

## Overview
VetLetters is a SaaS application that helps veterans generate professional, CFR-grounded VA claims documents using AI. It includes document generation, RPA-style quality scoring, AI claims advisor chat, combined rating estimator, and subscription management.

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

### Backend (server/)
- `server/index.ts` — Express app setup
- `server/routes.ts` — All API routes (profile, conditions, incidents, documents, generate, chat, support, knowledge base, rating, dashboard)
- `server/storage.ts` — DatabaseStorage with IStorage interface
- `server/prompts.ts` — CFR-grounded AI prompts for 8 document types + RPA scoring + chat
- `server/replit_integrations/auth/` — Replit Auth OIDC integration

### Frontend (client/src/)
- `App.tsx` — Routes + auth-gated layout
- `components/app-sidebar.tsx` — Navigation sidebar with logo
- **Pages:**
  - `landing.tsx` — Public landing page with hero, features, pricing
  - `dashboard.tsx` — Veteran command center with stats and quick actions
  - `intake.tsx` — Multi-step veteran profile wizard
  - `conditions.tsx` — Conditions + service incidents CRUD
  - `generate-document.tsx` — Document generation with RPA scoring
  - `documents.tsx` — Document list with filtering
  - `chat.tsx` — AI Claims Advisor chat
  - `rating-estimator.tsx` — Combined VA disability rating calculator
  - `pricing.tsx` — 3-tier pricing comparison
  - `support.tsx` — Human assistance request form
  - `settings.tsx` — Account and subscription management
  - `admin-knowledge-base.tsx` — Admin: manage knowledge base entries
  - `admin-support.tsx` — Admin: manage support requests

### Document Types (8)
All tiers: nexus_letter, personal_statement, buddy_letter, nod, secondary_condition, increase_claim
Concierge only: aod_motion, good_cause_letter

### Subscription Tiers
- None: 0 docs/mo
- Basic ($19/mo): 5 docs/mo
- Pro ($49/mo): 50 docs/mo
- Concierge ($149/mo): 999 docs/mo + AOD/Good Cause

### Design Theme
Navy blue primary (#1a3a6b), warm gold accent (#d4a017), dark sidebar, military/veteran aesthetic

## Environment Secrets
- `ANTHROPIC_API_KEY` — Claude API key
- `SESSION_SECRET` — Express session secret
- `DATABASE_URL` — PostgreSQL connection string (auto-provisioned)

## Running
- `npm run dev` — starts Express + Vite dev server on port 5000
- `npm run db:push` — push schema to database

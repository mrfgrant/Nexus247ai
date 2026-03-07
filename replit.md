# Nexus247 - AI-Powered VA Claims Assistant

## Overview
Nexus247 is a SaaS application designed to empower veterans by providing an AI-powered assistant for generating professional, CFR-grounded VA claims documents. The project aims to streamline the complex VA claims process through intelligent document generation, quality scoring, AI-driven advisory chat, and comprehensive rating estimations. It targets a market need for accessible, accurate, and efficient claim preparation, ultimately striving to improve veterans' access to entitled benefits. Key capabilities include AI-assisted document creation, RPA-style quality checks, an AI claims advisor, a combined rating estimator, and robust subscription management.

## User Preferences
The agent should prioritize delivering accurate, CFR-grounded information. When generating documents or providing advice, ensure conciseness and clarity, suitable for official use and easy comprehension. For document generation, prioritize output that is signable by medical professionals and adheres to VA guidelines. When explaining complex topics, break them down into easily digestible parts.

## System Architecture
The Nexus247 application is built with a modern web stack, featuring a React + TypeScript frontend, an Express.js + TypeScript backend, and a PostgreSQL database managed via Drizzle ORM. Authentication is handled by Replit Auth (OIDC), and AI functionalities are powered by Anthropic Claude Sonnet. Payments and subscription management are integrated using Stripe.

**UI/UX Decisions:**
The application adopts a military/veteran aesthetic with a color scheme of navy, gold, smoke, and fog. A dark sidebar provides consistent navigation. Key components like the RPA Scoring Modal and Landing Page Hero are designed for intuitive user interaction, with the hero featuring an animated Score Card for immediate engagement. Print-ready layouts are provided for documents.

**Technical Implementations:**
- **Database Schema:** Centralized schema (`shared/schema.ts`) includes tables for users, veteran profiles, conditions, service incidents, generated documents, knowledge base entries, chat messages, support requests, rating estimates, usage logs, supporting documents (with `extracted_context` column for smart medical records extraction), and letter analyses.
- **Backend Structure:** An Express.js server (`server/index.ts`) handles API routes for all core functionalities, including profile management, document generation, chat, support, knowledge base, and Stripe integrations. Prompts for AI interactions are centralized in `server/prompts.ts`.
- **Frontend Structure:** A React application (`client/src/`) manages routes and authentication-gated layouts. Key pages include a dashboard, multi-step veteran profile intake, conditions management, document generation and viewing, an AI claims advisor chat, a rating estimator, and a decision letter analysis tool.
- **Shared Modules:** Common utilities like VA compensation rates (`shared/va-rates.ts`) and a `getRankDisplayName` utility for veteran addressing (`shared/utils.ts`) are centralized.

**Feature Specifications:**
- **Document Types:** Supports 8 types of VA claims documents, with some specific to higher subscription tiers.
- **C&P Exam Prep:** A Pro+ feature providing AI-generated preparation guides and cheat sheets for C&P exams, with smart alerts and one-click generation buttons.
- **Subscription Tiers:** Differentiated access based on Starter ($29/mo), Pro ($49/mo or $399/yr), and Concierge ($149/mo) tiers, impacting document generation limits, analysis capabilities, and feature access. A 3-day Pro trial is automatically granted.
- **Decision Letter Analysis:** AI-powered analysis of VA decision letters, identifying conditions, errors, and recommendations. Includes a cross-reference feature to compare medical records against decision findings and highlight evidence gaps.
- **Document Generation Enhancements:** Incorporates RPA scoring, conciseness for nexus letters, and context injection from decision letter analyses.
- **Trial System:** Provides gated access to features during a trial period, offering previews of generated content with upgrade CTAs. Chat and C&P prep are also trial-gated, offering general guidance without personalized data.
- **Profile Completion Gate:** Enforces profile completion for full app access, directing users to the intake wizard.
- **Tier-Based Record Limits:** AI context limits for medical records and documents are scaled according to subscription tiers to ensure optimal AI analysis for paying users.
- **Veteran Addressing:** Standardized addressing convention using rank and last name throughout the application for a personalized experience.

## Stripe Configuration
- **Stripe Price IDs:**
  - Starter (basic): `price_1T887HEBRMFySHqpXnPtAymW` ($29/mo)
  - Pro: `price_1T777GEBRMFySHqpCBvns2rX` ($49/mo)
  - Pro Annual: `price_1T88AkEBRMFySHqp8lsI3H9Q` ($399/yr)
  - Concierge: `price_1T778MEBRMFySHqpeyk2TGS4` ($149/mo)
- **Payment Method Configuration**: `pmc_1SAh8XEBRMFySHqpizrLyWiZ` (Card, Amazon Pay, Apple Pay, Afterpay, Klarna, Zip)
- **Annual billing**: Pro tier only; checkout route accepts `billing: "annual"` param to select annual price
- **Admin account**: jamie@mrfgrant.com (userId 49807206) — tier=concierge, status=active

## Smart Medical Records Extraction
- **Module**: `server/extract.ts` — keyword-based extraction, no AI calls
- **How it works**: When medical records are uploaded, the system scans the full text for sections relevant to the veteran's claimed conditions using condition names, ICD-10 codes, diagnostic codes, and synonym matching
- **Storage**: Extracted text stored in `extracted_context` column on `supporting_documents` table
- **Triggers**: Runs automatically on medical records upload and when conditions are added/updated
- **AI usage**: All AI endpoints (chat, document generation, analysis, cross-reference, C&P prep) use `extracted_context` when available, falling back to full `content`
- **Admin endpoint**: `POST /api/re-extract-records` (userId 49807206 only) — triggers re-extraction for any user
- **Benefit**: Instead of truncating a 2M char file to 50K chars (losing older records), extracts condition-relevant sections from ALL years

## External Dependencies
- **Anthropic Claude Sonnet:** Used for all AI functionalities, including document generation, claims advisor chat, decision letter analysis, and C&P exam prep. Requires `ANTHROPIC_API_KEY`.
- **Stripe:** Integrated for payment processing, subscription management, and customer portals. Utilizes `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- **PostgreSQL:** The primary database for storing all application data, accessed via Drizzle ORM. Requires `DATABASE_URL`.
- **Replit Auth (OIDC):** Provides user authentication and session management. Requires `SESSION_SECRET`.
- **Resend:** Email service for sending branded welcome emails and admin notifications. Connected via Replit integration (connector). Verified sending domain: `mailer.nexus247.ai`. From address: `noreply@mailer.nexus247.ai`. Note: the connector's `fromEmail` returns `support@nexus247.ai` which is NOT a verified sending domain — always use `noreply@mailer.nexus247.ai` as the from address.

## Engagement Features (Unauthenticated Visitors)
- **Welcome Overlay** (`client/src/components/welcome-overlay.tsx`): Full-screen overlay on first visit thanking the veteran for their service. Auto-dismisses after 8s. Tracked via localStorage key `nexus247_welcome_shown`. z-index 70.
- **Cookie Consent Banner** (`client/src/components/cookie-consent.tsx`): Fixed bottom banner with Accept/Decline. Tracked via localStorage key `nexus247_cookies_accepted`. z-index 60. Shows after 1.5s delay.
- **Exit Intent Popup** (`client/src/components/exit-intent.tsx`): Triggers on desktop mouseleave (cursor exits viewport upward) after 10s on page. Shows "nothing to lose, 3-day free trial" message with CTA. Tracked via sessionStorage key `nexus247_exit_shown`. z-index 80.

## Welcome Email & Admin Notifications
- **Server modules**: `server/resend.ts` (Resend client via Replit connector), `server/emails.ts` (HTML templates + send functions)
- **From address**: `Nexus247 <noreply@mailer.nexus247.ai>` (hardcoded — do NOT use connector's fromEmail)
- **Welcome email**: Triggered on first profile creation (`POST /api/profile` when no existing profile). Addresses veteran by rank + last name from Replit Auth claims. Navy/gold branded HTML with 6 feature sections, "Where to Start" steps, gold CTA. CC: `support@nexus247.ai`.
- **Admin signup notification**: Separate email sent TO `support@nexus247.ai` whenever a new user signs up. Contains name, email, rank, branch, and signup date.
- **Admin test endpoint**: `POST /api/test-welcome-email` (userId 49807206 only) — accepts `email`, `rankTitle`, `lastName` in body to send to any address

## Admin User Management
- **Archive/Unarchive**: Soft-delete users by setting `archivedAt` timestamp. Archived users hidden by default in admin panel; toggle "Show archived" to view them with greyed styling + orange "Archived" badge.
- **Permanent Delete**: `DELETE /api/admin/users/:userId` removes veteran profile + all associated data (conditions, documents, incidents, chat messages, usage logs, supporting documents, letter analyses, rating estimates). Replit Auth user row preserved. Admin account (userId 49807206) cannot be deleted.
- **Export CSV**: `GET /api/admin/users/export` downloads CSV of all users with email, name, rank, branch, tier, status, trial dates, signup date.
- **Activity Log**: Click any user's name in the admin panel to open a dialog showing their full activity history (document generation, AI chat messages, C&P prep) with timestamps and metadata. Endpoint: `GET /api/admin/users/:userId/activity?limit=200`.
- **Endpoints**: `POST /api/admin/users/:userId/archive`, `POST /api/admin/users/:userId/unarchive`, `DELETE /api/admin/users/:userId`, `GET /api/admin/users/export`, `GET /api/admin/users/:userId/activity` — all admin-only.

## Trial Engagement Emails (Drip Campaign)
- **Trial Expiry Email**: Sent on the day a user's trial expires. Personalized with rank + last name. Branded HTML template with feature highlights and upgrade CTA. Tracked by `trialExpiryEmailSent` flag on veteran profile to prevent duplicates.
- **Day 7 Re-engagement Email**: Sent 7 days after trial expiry if user hasn't subscribed. Includes COMEBACK promo code. Personalized with rank + last name. Tracked by `day7ReengagementSent` flag.
- **From address**: `Nexus247 <noreply@mailer.nexus247.ai>` (same verified domain as welcome email).
- **Functions**: `sendTrialExpiryEmail()`, `sendDay7ReengagementEmail()` in `server/emails.ts`.

## Scheduled Jobs (node-cron)
- **Module**: `server/scheduler.ts` — started from `server/index.ts` on server boot.
- **Hourly job** (`:00` every hour): Checks for trial expiry emails (trial ending today, not yet sent) and day 7 re-engagement emails (trial expired 7+ days ago, not yet sent, user hasn't subscribed).
- **Daily report** (12:00 UTC / 7 AM ET): Sends activity summary to `support@nexus247.ai` via `sendDailyActivityReport()`. Includes new signups (last 24h), feature usage summary, trials expiring in next 48h, and recently expired trials.
- **Package**: `node-cron` (bundled via build allowlist in `script/build.ts`).

## Standalone Pages
- **MyScore** (`/myscore`): Public, standalone page for scoring nexus letters via AI. No auth, no database, no connection to main app. Uses Claude API via `POST /api/score-letter`. IP-based rate limiting (5 requests per 10 minutes per IP). PDF upload uses client-side pdf.js from CDN. Results show score (0-100), rating, summary, strengths, and improvements with CTA to sign up.

## Google Tag Manager & Conversion Tracking
- **GTM Container**: GTM-M43343V2 (in `client/index.html` and `/myscore` page — head script + noscript after body)
- **GA Property**: G-0ZBRWF6PP6 (configured inside GTM, no longer inline)
- **TikTok Pixel**: D6L6N5RC77U5VG9U3900 (in `client/index.html` and `/myscore` page — fires page view on all pages)
- **Analytics utility**: `client/src/lib/analytics.ts` — pushes GA events to `window.dataLayer` and TikTok events via `window.ttq.track()`
- **GA Conversion events**:
  - `sign_up` — fires once per device when a new user logs in without a profile (localStorage flag `nexus247_signup_tracked`)
  - `trial_started` — fires when a new user saves their profile for the first time (triggers 3-day Pro trial)
  - `begin_checkout` — fires when user clicks subscribe on the pricing page (includes tier name and price value)
  - `purchase` — fires on successful Stripe checkout verification (includes tier, value, transaction_id; guarded by sessionStorage to prevent double-fire)
- **TikTok Conversion events** (fire alongside GA events from same trigger points):
  - `CompleteRegistration` — alongside sign_up
  - `Subscribe` — alongside trial_started
  - `InitiateCheckout` — alongside begin_checkout
  - `CompletePayment` — alongside purchase

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
- **Database Schema:** Centralized schema (`shared/schema.ts`) includes tables for users, veteran profiles, conditions, service incidents, generated documents, knowledge base entries, chat messages, support requests, rating estimates, usage logs, supporting documents, and letter analyses.
- **Backend Structure:** An Express.js server (`server/index.ts`) handles API routes for all core functionalities, including profile management, document generation, chat, support, knowledge base, and Stripe integrations. Prompts for AI interactions are centralized in `server/prompts.ts`.
- **Frontend Structure:** A React application (`client/src/`) manages routes and authentication-gated layouts. Key pages include a dashboard, multi-step veteran profile intake, conditions management, document generation and viewing, an AI claims advisor chat, a rating estimator, and a decision letter analysis tool.
- **Shared Modules:** Common utilities like VA compensation rates (`shared/va-rates.ts`) and a `getRankDisplayName` utility for veteran addressing (`shared/utils.ts`) are centralized.

**Feature Specifications:**
- **Document Types:** Supports 8 types of VA claims documents, with some specific to higher subscription tiers.
- **C&P Exam Prep:** A Pro+ feature providing AI-generated preparation guides and cheat sheets for C&P exams, with smart alerts and one-click generation buttons.
- **Subscription Tiers:** Differentiated access based on Basic, Pro, and Concierge tiers, impacting document generation limits, analysis capabilities, and feature access. A 3-day Pro trial is automatically granted.
- **Decision Letter Analysis:** AI-powered analysis of VA decision letters, identifying conditions, errors, and recommendations. Includes a cross-reference feature to compare medical records against decision findings and highlight evidence gaps.
- **Document Generation Enhancements:** Incorporates RPA scoring, conciseness for nexus letters, and context injection from decision letter analyses.
- **Trial System:** Provides gated access to features during a trial period, offering previews of generated content with upgrade CTAs. Chat and C&P prep are also trial-gated, offering general guidance without personalized data.
- **Profile Completion Gate:** Enforces profile completion for full app access, directing users to the intake wizard.
- **Tier-Based Record Limits:** AI context limits for medical records and documents are scaled according to subscription tiers to ensure optimal AI analysis for paying users.
- **Veteran Addressing:** Standardized addressing convention using rank and last name throughout the application for a personalized experience.

## External Dependencies
- **Anthropic Claude Sonnet:** Used for all AI functionalities, including document generation, claims advisor chat, decision letter analysis, and C&P exam prep. Requires `ANTHROPIC_API_KEY`.
- **Stripe:** Integrated for payment processing, subscription management, and customer portals. Utilizes `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- **PostgreSQL:** The primary database for storing all application data, accessed via Drizzle ORM. Requires `DATABASE_URL`.
- **Replit Auth (OIDC):** Provides user authentication and session management. Requires `SESSION_SECRET`.
- **Resend:** Email service for sending branded welcome emails to new signups. Connected via Replit integration (connector). Domain verification required at resend.com/domains for production sending.

## Engagement Features (Unauthenticated Visitors)
- **Welcome Overlay** (`client/src/components/welcome-overlay.tsx`): Full-screen overlay on first visit thanking the veteran for their service. Auto-dismisses after 8s. Tracked via localStorage key `nexus247_welcome_shown`. z-index 70.
- **Cookie Consent Banner** (`client/src/components/cookie-consent.tsx`): Fixed bottom banner with Accept/Decline. Tracked via localStorage key `nexus247_cookies_accepted`. z-index 60. Shows after 1.5s delay.
- **Exit Intent Popup** (`client/src/components/exit-intent.tsx`): Triggers on desktop mouseleave (cursor exits viewport upward) after 10s on page. Shows "nothing to lose, 3-day free trial" message with CTA. Tracked via sessionStorage key `nexus247_exit_shown`. z-index 80.

## Welcome Email
- **Server modules**: `server/resend.ts` (Resend client via Replit connector), `server/emails.ts` (HTML template + send function)
- Triggered on first profile creation (`POST /api/profile` when no existing profile)
- Addresses veteran by rank + last name (e.g., "Dear SFC Grant")
- Navy/gold branded HTML email with 6 feature sections, "Where to Start" steps, gold CTA
- CC: `support@nexus247.ai` on every welcome email
- Admin test endpoint: `POST /api/test-welcome-email` (userId 49807206 only)

## Standalone Pages
- **MyScore** (`/myscore`): Public, standalone page for scoring nexus letters via AI. No auth, no database, no connection to main app. Uses Claude API via `POST /api/score-letter`. IP-based rate limiting (5 requests per 10 minutes per IP). PDF upload uses client-side pdf.js from CDN. Results show score (0-100), rating, summary, strengths, and improvements with CTA to sign up.

## Google Analytics Conversion Tracking
- **Analytics utility**: `client/src/lib/analytics.ts` — wraps `window.gtag()` calls with safe fallback
- **GA ID**: G-0ZBRWF6PP6 (in `client/index.html` and `/myscore` page)
- **Conversion events**:
  - `sign_up` — fires once per device when a new user logs in without a profile (localStorage flag `nexus247_signup_tracked`)
  - `trial_started` — fires when a new user saves their profile for the first time (triggers 3-day Pro trial)
  - `begin_checkout` — fires when user clicks subscribe on the pricing page (includes tier name and price value)
  - `purchase` — fires on successful Stripe checkout verification (includes tier, value, transaction_id; guarded by sessionStorage to prevent double-fire)
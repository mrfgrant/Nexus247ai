# Nexus247 - AI-Powered VA Claims Assistant

## Overview
Nexus247 is a SaaS application that empowers veterans by providing an AI-powered assistant for generating professional, CFR-grounded VA claims documents. The project aims to streamline the complex VA claims process through intelligent document generation, quality scoring, an AI-driven advisory chat, and comprehensive rating estimations. It targets a market need for accessible, accurate, and efficient claim preparation, ultimately striving to improve veterans' access to entitled benefits. Key capabilities include AI-assisted document creation, RPA-style quality checks, an AI claims advisor, a combined rating estimator, and robust subscription management.

## User Preferences
The agent should prioritize delivering accurate, CFR-grounded information. When generating documents or providing advice, ensure conciseness and clarity, suitable for official use and easy comprehension. For document generation, prioritize output that is signable by medical professionals and adheres to VA guidelines. When explaining complex topics, break them down into easily digestible parts.

## System Architecture
Nexus247 is built with a React + TypeScript frontend, an Express.js + TypeScript backend, and a PostgreSQL database managed via Drizzle ORM. Authentication is handled by Replit Auth (OIDC), and AI functionalities are powered by Anthropic Claude Sonnet. Payments and subscription management are integrated using Stripe.

**UI/UX Decisions:**
The application adopts a military/veteran aesthetic with a color scheme of navy, gold, smoke, and fog. A dark sidebar provides consistent navigation. Key components are designed for intuitive user interaction, including an animated Score Card for immediate engagement on the landing page hero. Print-ready layouts are provided for documents.

**Technical Implementations:**
- **Database Schema:** A centralized schema (`shared/schema.ts`) includes tables for users, veteran profiles, conditions, service incidents, generated documents, knowledge base entries, chat messages, support requests, rating estimates, usage logs, supporting documents (with `extracted_context`), and letter analyses.
- **Backend Structure:** An Express.js server (`server/index.ts`) handles API routes for core functionalities. AI prompts are centralized in `server/prompts.ts`.
- **Frontend Structure:** A React application (`client/src/`) manages routes and authentication-gated layouts, featuring a dashboard, multi-step veteran profile intake, conditions management, document generation and viewing, an AI claims advisor chat, a rating estimator, and a decision letter analysis tool.
- **Shared Modules:** Common utilities like VA compensation rates (`shared/va-rates.ts`) and a `getRankDisplayName` utility (`shared/utils.ts`) are centralized.
- **Document Generation:** Supports 8 types of VA claims documents, with RPA scoring, conciseness for nexus letters, and context injection from decision letter analyses.
- **AI-Powered Features:** Includes C&P Exam Prep (Pro+), Decision Letter Analysis (AI-powered identification of conditions, errors, recommendations, and evidence gaps), and a VA Claims Q&A Forum with AI-generated answers and feature CTAs.
- **Subscription Tiers:** Differentiated access based on Starter, Pro, and Concierge tiers, impacting document generation limits, analysis capabilities, and feature access. A 3-day Pro trial is automatically granted, with gated feature access and upgrade CTAs.
- **Smart Medical Records Extraction:** The system scans uploaded medical records for condition-relevant sections (using condition names, ICD-10 codes, etc.) and stores them in `extracted_context` for AI processing, falling back to full content if needed. This optimizes AI analysis for large documents.
- **Veteran Addressing:** Standardized addressing convention using rank and last name throughout the application.
- **Profile Completion Gate:** Enforces profile completion for full app access.
- **Tier-Based AI Context Limits:** AI context limits for medical records and documents scale with subscription tiers.
- **Scheduled Jobs:** Uses `node-cron` for hourly tasks (trial expiry and re-engagement emails) and daily reports.
- **Standalone MyScore Page:** A public page (`/myscore`) for scoring nexus letters via AI, independent of the main application, with IP-based rate limiting.

## External Dependencies
- **Anthropic Claude Sonnet:** Used for all AI functionalities (document generation, claims advisor chat, decision letter analysis, C&P exam prep, forum Q&A answering). Requires `ANTHROPIC_API_KEY`.
- **Stripe:** Integrated for payment processing, subscription management, and customer portals. Utilizes `STRIPE_SECRET_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- **PostgreSQL:** The primary database, accessed via Drizzle ORM. Requires `DATABASE_URL`.
- **Replit Auth (OIDC):** Provides user authentication and session management. Requires `SESSION_SECRET`.
- **Resend:** Email service for sending branded welcome emails, admin notifications, and trial drip campaign emails. Uses a Replit integration with a verified sending domain `mailer.nexus247.ai`.
- **Google Tag Manager (GTM-M43343V2):** Manages analytics and conversion tracking, including Google Analytics (G-0ZBRWF6PP6) and TikTok Pixel (D6L6N5RC77U5VG9U3900).
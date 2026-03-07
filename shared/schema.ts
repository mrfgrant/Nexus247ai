export * from "./models/auth";

import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  date,
  timestamp,
  jsonb,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

export const veteranProfiles = pgTable("veteran_profiles", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  branch: text("branch"),
  rank: text("rank"),
  mosRate: text("mos_rate"),
  serviceStartDate: date("service_start_date"),
  serviceEndDate: date("service_end_date"),
  dischargeType: text("discharge_type"),
  deploymentLocations: text("deployment_locations").array(),
  vaFileNumber: text("va_file_number"),
  currentRating: integer("current_rating"),
  dateOfBirth: date("date_of_birth"),
  ssnLast4: text("ssn_last4"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  agentOrangeExposure: boolean("agent_orange_exposure").default(false),
  campLejeune: boolean("camp_lejeune").default(false),
  burnPitExposure: boolean("burn_pit_exposure").default(false),
  gulfWarService: boolean("gulf_war_service").default(false),
  subscriptionTier: text("subscription_tier").default("none"),
  subscriptionStatus: text("subscription_status").default("inactive"),
  trialEndsAt: timestamp("trial_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  role: text("role").default("user"),
  archivedAt: timestamp("archived_at"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  hearAboutUs: text("hear_about_us"),
  firstLetterGeneratedAt: timestamp("first_letter_generated_at"),
  firstLetterConditionName: text("first_letter_condition_name"),
  firstLetterScore: integer("first_letter_score"),
  firstLetterPreview: text("first_letter_preview"),
  trialLetterEmailSent: boolean("trial_letter_email_sent").default(false),
  trialExpiryEmailSent: boolean("trial_expiry_email_sent").default(false),
  day7ReengagementSent: boolean("day7_reengagement_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const conditions = pgTable("conditions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conditionName: text("condition_name").notNull(),
  icd10Code: text("icd10_code"),
  diagnosticCode: text("diagnostic_code"),
  currentRating: integer("current_rating").default(0),
  claimedRating: integer("claimed_rating"),
  serviceConnected: boolean("service_connected").default(false),
  dateOfDiagnosis: date("date_of_diagnosis"),
  treatingPhysician: text("treating_physician"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const serviceIncidents = pgTable("service_incidents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conditionId: uuid("condition_id").references(() => conditions.id, {
    onDelete: "cascade",
  }),
  incidentDate: date("incident_date"),
  location: text("location"),
  description: text("description").notNull(),
  witnesses: text("witnesses").array(),
  documented: boolean("documented").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  documentType: text("document_type").notNull(),
  title: text("title").notNull(),
  conditionId: uuid("condition_id").references(() => conditions.id),
  content: text("content").notNull(),
  status: text("status").default("draft"),
  aiModel: text("ai_model").default("claude-sonnet-4-20250514"),
  wordCount: integer("word_count"),
  cfrScore: integer("cfr_score"),
  evidenceScore: integer("evidence_score"),
  nexusScore: integer("nexus_score"),
  raterReadinessScore: integer("rater_readiness_score"),
  overallScore: integer("overall_score"),
  improvementSuggestions: text("improvement_suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const knowledgeBaseEntries = pgTable("knowledge_base_entries", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  category: text("category").notNull(),
  conditionType: text("condition_type"),
  content: text("content").notNull(),
  denialReasons: text("denial_reasons"),
  cfrSections: text("cfr_sections"),
  outcome: text("outcome"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supportRequests = pgTable("support_requests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").default("open"),
  priority: text("priority").default("standard"),
  adminResponse: text("admin_response"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const ratingEstimates = pgTable("rating_estimates", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  conditions: jsonb("conditions").notNull(),
  combinedRating: integer("combined_rating"),
  estimatedMonthlyBenefit: integer("estimated_monthly_benefit"),
  breakdown: jsonb("breakdown"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usageLogs = pgTable("usage_logs", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  action: text("action").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVeteranProfileSchema = createInsertSchema(veteranProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertConditionSchema = createInsertSchema(conditions).omit({
  id: true,
  createdAt: true,
});
export const insertServiceIncidentSchema = createInsertSchema(serviceIncidents).omit({
  id: true,
  createdAt: true,
});
export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertKnowledgeBaseEntrySchema = createInsertSchema(knowledgeBaseEntries).omit({
  id: true,
  createdAt: true,
});
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});
export const insertSupportRequestSchema = createInsertSchema(supportRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertRatingEstimateSchema = createInsertSchema(ratingEstimates).omit({
  id: true,
  createdAt: true,
});

export type VeteranProfile = typeof veteranProfiles.$inferSelect;
export type InsertVeteranProfile = z.infer<typeof insertVeteranProfileSchema>;
export type Condition = typeof conditions.$inferSelect;
export type InsertCondition = z.infer<typeof insertConditionSchema>;
export type ServiceIncident = typeof serviceIncidents.$inferSelect;
export type InsertServiceIncident = z.infer<typeof insertServiceIncidentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type KnowledgeBaseEntry = typeof knowledgeBaseEntries.$inferSelect;
export type InsertKnowledgeBaseEntry = z.infer<typeof insertKnowledgeBaseEntrySchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type SupportRequest = typeof supportRequests.$inferSelect;
export type InsertSupportRequest = z.infer<typeof insertSupportRequestSchema>;
export type RatingEstimate = typeof ratingEstimates.$inferSelect;
export type InsertRatingEstimate = z.infer<typeof insertRatingEstimateSchema>;

export const supportingDocuments = pgTable("supporting_documents", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  content: text("content"),
  extractedContext: text("extracted_context"),
  fileSize: integer("file_size"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSupportingDocumentSchema = createInsertSchema(supportingDocuments).omit({
  id: true,
  createdAt: true,
});
export type SupportingDocument = typeof supportingDocuments.$inferSelect;
export type InsertSupportingDocument = z.infer<typeof insertSupportingDocumentSchema>;

export const letterAnalyses = pgTable("letter_analyses", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fileName: text("file_name"),
  summary: text("summary"),
  analysisData: jsonb("analysis_data").notNull(),
  crossReferenceData: jsonb("cross_reference_data"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLetterAnalysisSchema = createInsertSchema(letterAnalyses).omit({
  id: true,
  createdAt: true,
});
export type LetterAnalysis = typeof letterAnalyses.$inferSelect;
export type InsertLetterAnalysis = z.infer<typeof insertLetterAnalysisSchema>;

export const forumUsers = pgTable("forum_users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  rank: text("rank"),
  branch: text("branch"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertForumUserSchema = createInsertSchema(forumUsers).omit({
  id: true,
  createdAt: true,
});
export type ForumUser = typeof forumUsers.$inferSelect;
export type InsertForumUser = z.infer<typeof insertForumUserSchema>;

export const forumQuestions = pgTable("forum_questions", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  forumUserId: uuid("forum_user_id")
    .notNull()
    .references(() => forumUsers.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  aiAnswer: text("ai_answer"),
  category: text("category"),
  featureCta: text("feature_cta"),
  upvotes: integer("upvotes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

export const insertForumQuestionSchema = createInsertSchema(forumQuestions).omit({
  id: true,
  aiAnswer: true,
  category: true,
  featureCta: true,
  upvotes: true,
  createdAt: true,
  answeredAt: true,
});
export type ForumQuestion = typeof forumQuestions.$inferSelect;
export type InsertForumQuestion = z.infer<typeof insertForumQuestionSchema>;

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerUserId: varchar("referrer_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  referrerName: text("referrer_name"),
  refereeEmail: text("referee_email").notNull(),
  message: text("message"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  status: true,
  createdAt: true,
});
export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = z.infer<typeof insertReferralSchema>;

export const deviceFingerprints = pgTable("device_fingerprints", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  deviceId: text("device_id").notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeviceFingerprintSchema = createInsertSchema(deviceFingerprints).omit({
  id: true,
  createdAt: true,
});
export type DeviceFingerprint = typeof deviceFingerprints.$inferSelect;
export type InsertDeviceFingerprint = z.infer<typeof insertDeviceFingerprintSchema>;

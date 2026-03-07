import {
  veteranProfiles,
  conditions,
  serviceIncidents,
  documents,
  knowledgeBaseEntries,
  chatMessages,
  supportRequests,
  ratingEstimates,
  usageLogs,
  supportingDocuments,
  type VeteranProfile,
  type InsertVeteranProfile,
  type Condition,
  type InsertCondition,
  type ServiceIncident,
  type InsertServiceIncident,
  type Document,
  type InsertDocument,
  type KnowledgeBaseEntry,
  type InsertKnowledgeBaseEntry,
  type ChatMessage,
  type InsertChatMessage,
  type SupportRequest,
  type InsertSupportRequest,
  type RatingEstimate,
  type InsertRatingEstimate,
  type SupportingDocument,
  type InsertSupportingDocument,
  letterAnalyses,
  type LetterAnalysis,
  type InsertLetterAnalysis,
} from "@shared/schema";
import { users } from "@shared/models/auth";
import { db } from "./db";
import { eq, desc, and, sql, gte, isNull, isNotNull, lte, lt } from "drizzle-orm";

export interface IStorage {
  getVeteranProfile(userId: string): Promise<VeteranProfile | undefined>;
  upsertVeteranProfile(data: InsertVeteranProfile): Promise<VeteranProfile>;

  getConditions(userId: string): Promise<Condition[]>;
  getCondition(id: string): Promise<Condition | undefined>;
  createCondition(data: InsertCondition): Promise<Condition>;
  updateCondition(id: string, data: Partial<InsertCondition>): Promise<Condition | undefined>;
  deleteCondition(id: string): Promise<void>;

  getIncidents(userId: string): Promise<ServiceIncident[]>;
  getIncidentsByCondition(conditionId: string): Promise<ServiceIncident[]>;
  createIncident(data: InsertServiceIncident): Promise<ServiceIncident>;
  updateIncident(id: string, data: Partial<InsertServiceIncident>): Promise<ServiceIncident | undefined>;
  deleteIncident(id: string): Promise<void>;

  getDocuments(userId: string): Promise<Document[]>;
  getDocument(id: string): Promise<Document | undefined>;
  createDocument(data: InsertDocument): Promise<Document>;
  updateDocument(id: string, data: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: string): Promise<void>;
  getDocumentCountThisMonth(userId: string): Promise<number>;

  getKnowledgeBaseEntries(): Promise<KnowledgeBaseEntry[]>;
  getKnowledgeBaseEntry(id: string): Promise<KnowledgeBaseEntry | undefined>;
  createKnowledgeBaseEntry(data: InsertKnowledgeBaseEntry): Promise<KnowledgeBaseEntry>;
  updateKnowledgeBaseEntry(id: string, data: Partial<InsertKnowledgeBaseEntry>): Promise<KnowledgeBaseEntry | undefined>;
  deleteKnowledgeBaseEntry(id: string): Promise<void>;
  getRelevantKnowledgeBase(conditionType?: string): Promise<KnowledgeBaseEntry[]>;

  getChatMessages(userId: string): Promise<ChatMessage[]>;
  createChatMessage(data: InsertChatMessage): Promise<ChatMessage>;

  getSupportRequests(userId?: string): Promise<SupportRequest[]>;
  createSupportRequest(data: InsertSupportRequest): Promise<SupportRequest>;
  updateSupportRequest(id: string, data: Partial<InsertSupportRequest>): Promise<SupportRequest | undefined>;

  createRatingEstimate(data: InsertRatingEstimate): Promise<RatingEstimate>;
  getRatingEstimates(userId: string): Promise<RatingEstimate[]>;

  logUsage(userId: string, action: string, metadata?: any): Promise<void>;

  getAllProfiles(includeArchived?: boolean): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]>;
  adminUpdateProfile(userId: string, data: Partial<{ subscriptionTier: string; role: string; trialEndsAt: Date | null }>): Promise<VeteranProfile | undefined>;

  archiveProfile(userId: string): Promise<VeteranProfile | undefined>;
  unarchiveProfile(userId: string): Promise<VeteranProfile | undefined>;
  deleteAllUserData(userId: string): Promise<void>;

  getTrialExpiringProfiles(): Promise<(VeteranProfile & { email?: string | null })[]>;
  getDay7ReengagementProfiles(): Promise<(VeteranProfile & { email?: string | null })[]>;
  markTrialExpiryEmailSent(userId: string): Promise<void>;
  markDay7ReengagementSent(userId: string): Promise<void>;

  getRecentSignups(since: Date): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]>;
  getUsageSummary(since: Date): Promise<{ userId: string; action: string; count: number }[]>;
  getUserActivityLog(userId: string, limit?: number): Promise<{ id: string; action: string; metadata: any; createdAt: Date | null }[]>;
  getExpiringTrials(withinHours: number): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]>;
  getRecentlyExpiredTrials(since: Date): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]>;

  createSupportingDocument(data: InsertSupportingDocument): Promise<SupportingDocument>;
  getSupportingDocuments(userId: string): Promise<SupportingDocument[]>;
  updateSupportingDocumentContext(id: string, extractedContext: string): Promise<void>;
  deleteSupportingDocument(id: string, userId: string): Promise<void>;

  createLetterAnalysis(data: InsertLetterAnalysis): Promise<LetterAnalysis>;
  getLetterAnalyses(userId: string): Promise<LetterAnalysis[]>;
  getLetterAnalysis(id: string, userId: string): Promise<LetterAnalysis | undefined>;
  updateLetterAnalysis(id: string, userId: string, data: Partial<InsertLetterAnalysis>): Promise<LetterAnalysis | undefined>;
  deleteLetterAnalysis(id: string, userId: string): Promise<void>;
  getAnalysisCountThisMonth(userId: string): Promise<number>;

  updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void>;
  getProfileByStripeCustomerId(stripeCustomerId: string): Promise<VeteranProfile | undefined>;
  updateSubscriptionFromStripe(
    stripeCustomerId: string,
    data: {
      stripeSubscriptionId: string | null;
      subscriptionTier: string;
      subscriptionStatus: string;
      trialEndsAt?: Date | null;
    }
  ): Promise<VeteranProfile | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getVeteranProfile(userId: string): Promise<VeteranProfile | undefined> {
    const [profile] = await db.select().from(veteranProfiles).where(eq(veteranProfiles.userId, userId));
    return profile;
  }

  async upsertVeteranProfile(data: InsertVeteranProfile): Promise<VeteranProfile> {
    const [profile] = await db
      .insert(veteranProfiles)
      .values(data)
      .onConflictDoUpdate({
        target: veteranProfiles.userId,
        set: { ...data, updatedAt: new Date() },
      })
      .returning();
    return profile;
  }

  async getConditions(userId: string): Promise<Condition[]> {
    return db.select().from(conditions).where(eq(conditions.userId, userId)).orderBy(desc(conditions.createdAt));
  }

  async getCondition(id: string): Promise<Condition | undefined> {
    const [condition] = await db.select().from(conditions).where(eq(conditions.id, id));
    return condition;
  }

  async createCondition(data: InsertCondition): Promise<Condition> {
    const [condition] = await db.insert(conditions).values(data).returning();
    return condition;
  }

  async updateCondition(id: string, data: Partial<InsertCondition>): Promise<Condition | undefined> {
    const [condition] = await db.update(conditions).set(data).where(eq(conditions.id, id)).returning();
    return condition;
  }

  async deleteCondition(id: string): Promise<void> {
    await db.delete(conditions).where(eq(conditions.id, id));
  }

  async getIncidents(userId: string): Promise<ServiceIncident[]> {
    return db.select().from(serviceIncidents).where(eq(serviceIncidents.userId, userId)).orderBy(desc(serviceIncidents.createdAt));
  }

  async getIncidentsByCondition(conditionId: string): Promise<ServiceIncident[]> {
    return db.select().from(serviceIncidents).where(eq(serviceIncidents.conditionId, conditionId));
  }

  async createIncident(data: InsertServiceIncident): Promise<ServiceIncident> {
    const [incident] = await db.insert(serviceIncidents).values(data).returning();
    return incident;
  }

  async updateIncident(id: string, data: Partial<InsertServiceIncident>): Promise<ServiceIncident | undefined> {
    const [incident] = await db.update(serviceIncidents).set(data).where(eq(serviceIncidents.id, id)).returning();
    return incident;
  }

  async deleteIncident(id: string): Promise<void> {
    await db.delete(serviceIncidents).where(eq(serviceIncidents.id, id));
  }

  async getDocuments(userId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.createdAt));
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc;
  }

  async createDocument(data: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(data).returning();
    return doc;
  }

  async updateDocument(id: string, data: Partial<InsertDocument>): Promise<Document | undefined> {
    const [doc] = await db.update(documents).set({ ...data, updatedAt: new Date() }).where(eq(documents.id, id)).returning();
    return doc;
  }

  async deleteDocument(id: string): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async getDocumentCountThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(and(eq(documents.userId, userId), gte(documents.createdAt, startOfMonth)));
    return Number(result[0]?.count || 0);
  }

  async getKnowledgeBaseEntries(): Promise<KnowledgeBaseEntry[]> {
    return db.select().from(knowledgeBaseEntries).orderBy(desc(knowledgeBaseEntries.createdAt));
  }

  async getKnowledgeBaseEntry(id: string): Promise<KnowledgeBaseEntry | undefined> {
    const [entry] = await db.select().from(knowledgeBaseEntries).where(eq(knowledgeBaseEntries.id, id));
    return entry;
  }

  async createKnowledgeBaseEntry(data: InsertKnowledgeBaseEntry): Promise<KnowledgeBaseEntry> {
    const [entry] = await db.insert(knowledgeBaseEntries).values(data).returning();
    return entry;
  }

  async updateKnowledgeBaseEntry(id: string, data: Partial<InsertKnowledgeBaseEntry>): Promise<KnowledgeBaseEntry | undefined> {
    const [entry] = await db.update(knowledgeBaseEntries).set(data).where(eq(knowledgeBaseEntries.id, id)).returning();
    return entry;
  }

  async deleteKnowledgeBaseEntry(id: string): Promise<void> {
    await db.delete(knowledgeBaseEntries).where(eq(knowledgeBaseEntries.id, id));
  }

  async getRelevantKnowledgeBase(conditionType?: string): Promise<KnowledgeBaseEntry[]> {
    if (conditionType) {
      return db
        .select()
        .from(knowledgeBaseEntries)
        .where(eq(knowledgeBaseEntries.conditionType, conditionType))
        .limit(10);
    }
    return db.select().from(knowledgeBaseEntries).limit(10);
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.createdAt);
  }

  async createChatMessage(data: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(data).returning();
    return message;
  }

  async getSupportRequests(userId?: string): Promise<SupportRequest[]> {
    if (userId) {
      return db.select().from(supportRequests).where(eq(supportRequests.userId, userId)).orderBy(desc(supportRequests.createdAt));
    }
    return db.select().from(supportRequests).orderBy(desc(supportRequests.createdAt));
  }

  async createSupportRequest(data: InsertSupportRequest): Promise<SupportRequest> {
    const [request] = await db.insert(supportRequests).values(data).returning();
    return request;
  }

  async updateSupportRequest(id: string, data: Partial<InsertSupportRequest>): Promise<SupportRequest | undefined> {
    const [request] = await db
      .update(supportRequests)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(supportRequests.id, id))
      .returning();
    return request;
  }

  async createRatingEstimate(data: InsertRatingEstimate): Promise<RatingEstimate> {
    const [estimate] = await db.insert(ratingEstimates).values(data).returning();
    return estimate;
  }

  async getRatingEstimates(userId: string): Promise<RatingEstimate[]> {
    return db.select().from(ratingEstimates).where(eq(ratingEstimates.userId, userId)).orderBy(desc(ratingEstimates.createdAt));
  }

  async logUsage(userId: string, action: string, metadata?: any): Promise<void> {
    await db.insert(usageLogs).values({ userId, action, metadata });
  }

  async getUserActivityLog(userId: string, limit = 100): Promise<{ id: string; action: string; metadata: any; createdAt: Date | null }[]> {
    const rows = await db
      .select({
        id: usageLogs.id,
        action: usageLogs.action,
        metadata: usageLogs.metadata,
        createdAt: usageLogs.createdAt,
      })
      .from(usageLogs)
      .where(eq(usageLogs.userId, userId))
      .orderBy(desc(usageLogs.createdAt))
      .limit(limit);
    return rows;
  }

  async getAllProfiles(includeArchived = false): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]> {
    let query = db
      .select({
        profile: veteranProfiles,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id));

    const rows = includeArchived
      ? await query.orderBy(desc(veteranProfiles.createdAt))
      : await query.where(isNull(veteranProfiles.archivedAt)).orderBy(desc(veteranProfiles.createdAt));

    return rows.map(r => ({ ...r.profile, firstName: r.firstName, lastName: r.lastName, email: r.email }));
  }

  async adminUpdateProfile(userId: string, data: Partial<{ subscriptionTier: string; role: string; trialEndsAt: Date | null }>): Promise<VeteranProfile | undefined> {
    const [profile] = await db
      .update(veteranProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId))
      .returning();
    return profile;
  }

  async createSupportingDocument(data: InsertSupportingDocument): Promise<SupportingDocument> {
    const [doc] = await db.insert(supportingDocuments).values(data).returning();
    return doc;
  }

  async getSupportingDocuments(userId: string): Promise<SupportingDocument[]> {
    return db.select().from(supportingDocuments).where(eq(supportingDocuments.userId, userId)).orderBy(desc(supportingDocuments.createdAt));
  }

  async updateSupportingDocumentContext(id: string, extractedContext: string): Promise<void> {
    await db.update(supportingDocuments).set({ extractedContext }).where(eq(supportingDocuments.id, id));
  }

  async deleteSupportingDocument(id: string, userId: string): Promise<void> {
    await db.delete(supportingDocuments).where(and(eq(supportingDocuments.id, id), eq(supportingDocuments.userId, userId)));
  }

  async createLetterAnalysis(data: InsertLetterAnalysis): Promise<LetterAnalysis> {
    const [analysis] = await db.insert(letterAnalyses).values(data).returning();
    return analysis;
  }

  async getLetterAnalyses(userId: string): Promise<LetterAnalysis[]> {
    return db.select().from(letterAnalyses).where(eq(letterAnalyses.userId, userId)).orderBy(desc(letterAnalyses.createdAt));
  }

  async getLetterAnalysis(id: string, userId: string): Promise<LetterAnalysis | undefined> {
    const [analysis] = await db.select().from(letterAnalyses).where(and(eq(letterAnalyses.id, id), eq(letterAnalyses.userId, userId)));
    return analysis;
  }

  async updateLetterAnalysis(id: string, userId: string, data: Partial<InsertLetterAnalysis>): Promise<LetterAnalysis | undefined> {
    const [analysis] = await db.update(letterAnalyses).set(data).where(and(eq(letterAnalyses.id, id), eq(letterAnalyses.userId, userId))).returning();
    return analysis;
  }

  async deleteLetterAnalysis(id: string, userId: string): Promise<void> {
    await db.delete(letterAnalyses).where(and(eq(letterAnalyses.id, id), eq(letterAnalyses.userId, userId)));
  }

  async getAnalysisCountThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(letterAnalyses)
      .where(and(eq(letterAnalyses.userId, userId), gte(letterAnalyses.createdAt, startOfMonth)));
    return Number(result[0]?.count || 0);
  }

  async archiveProfile(userId: string): Promise<VeteranProfile | undefined> {
    const [profile] = await db
      .update(veteranProfiles)
      .set({ archivedAt: new Date(), updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId))
      .returning();
    return profile;
  }

  async unarchiveProfile(userId: string): Promise<VeteranProfile | undefined> {
    const [profile] = await db
      .update(veteranProfiles)
      .set({ archivedAt: null, updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId))
      .returning();
    return profile;
  }

  async deleteAllUserData(userId: string): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
    await db.delete(usageLogs).where(eq(usageLogs.userId, userId));
    await db.delete(ratingEstimates).where(eq(ratingEstimates.userId, userId));
    await db.delete(supportRequests).where(eq(supportRequests.userId, userId));
    await db.delete(letterAnalyses).where(eq(letterAnalyses.userId, userId));
    await db.delete(supportingDocuments).where(eq(supportingDocuments.userId, userId));
    await db.delete(documents).where(eq(documents.userId, userId));
    await db.delete(serviceIncidents).where(eq(serviceIncidents.userId, userId));
    await db.delete(conditions).where(eq(conditions.userId, userId));
    await db.delete(veteranProfiles).where(eq(veteranProfiles.userId, userId));
  }

  async getTrialExpiringProfiles(): Promise<(VeteranProfile & { email?: string | null })[]> {
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const rows = await db
      .select({ profile: veteranProfiles, email: users.email })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id))
      .where(and(
        isNotNull(veteranProfiles.trialEndsAt),
        gte(veteranProfiles.trialEndsAt, startOfDay),
        lte(veteranProfiles.trialEndsAt, endOfDay),
        eq(veteranProfiles.trialExpiryEmailSent, false),
        isNull(veteranProfiles.archivedAt),
        sql`(${veteranProfiles.subscriptionStatus} IS NULL OR ${veteranProfiles.subscriptionStatus} != 'active')`,
      ));
    return rows.map(r => ({ ...r.profile, email: r.email }));
  }

  async getDay7ReengagementProfiles(): Promise<(VeteranProfile & { email?: string | null })[]> {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);
    const rows = await db
      .select({ profile: veteranProfiles, email: users.email })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id))
      .where(and(
        isNotNull(veteranProfiles.trialEndsAt),
        lte(veteranProfiles.trialEndsAt, sevenDaysAgo),
        gte(veteranProfiles.trialEndsAt, eightDaysAgo),
        eq(veteranProfiles.day7ReengagementSent, false),
        isNull(veteranProfiles.archivedAt),
        sql`(${veteranProfiles.subscriptionStatus} IS NULL OR ${veteranProfiles.subscriptionStatus} != 'active')`,
      ));
    return rows.map(r => ({ ...r.profile, email: r.email }));
  }

  async markTrialExpiryEmailSent(userId: string): Promise<void> {
    await db.update(veteranProfiles)
      .set({ trialExpiryEmailSent: true, updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId));
  }

  async markDay7ReengagementSent(userId: string): Promise<void> {
    await db.update(veteranProfiles)
      .set({ day7ReengagementSent: true, updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId));
  }

  async getRecentSignups(since: Date): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]> {
    const rows = await db
      .select({
        profile: veteranProfiles,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id))
      .where(and(
        gte(veteranProfiles.createdAt, since),
        isNull(veteranProfiles.archivedAt),
      ))
      .orderBy(desc(veteranProfiles.createdAt));
    return rows.map(r => ({ ...r.profile, firstName: r.firstName, lastName: r.lastName, email: r.email }));
  }

  async getUsageSummary(since: Date): Promise<{ userId: string; action: string; count: number }[]> {
    const rows = await db
      .select({
        userId: usageLogs.userId,
        action: usageLogs.action,
        count: sql<number>`count(*)`,
      })
      .from(usageLogs)
      .where(gte(usageLogs.createdAt, since))
      .groupBy(usageLogs.userId, usageLogs.action);
    return rows.map(r => ({ userId: r.userId, action: r.action, count: Number(r.count) }));
  }

  async getExpiringTrials(withinHours: number): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]> {
    const now = new Date();
    const future = new Date(now.getTime() + withinHours * 60 * 60 * 1000);
    const rows = await db
      .select({
        profile: veteranProfiles,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id))
      .where(and(
        isNotNull(veteranProfiles.trialEndsAt),
        gte(veteranProfiles.trialEndsAt, now),
        lte(veteranProfiles.trialEndsAt, future),
        isNull(veteranProfiles.archivedAt),
        sql`(${veteranProfiles.subscriptionStatus} IS NULL OR ${veteranProfiles.subscriptionStatus} != 'active')`,
      ))
      .orderBy(veteranProfiles.trialEndsAt);
    return rows.map(r => ({ ...r.profile, firstName: r.firstName, lastName: r.lastName, email: r.email }));
  }

  async getRecentlyExpiredTrials(since: Date): Promise<(VeteranProfile & { firstName?: string | null; lastName?: string | null; email?: string | null })[]> {
    const now = new Date();
    const rows = await db
      .select({
        profile: veteranProfiles,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
      })
      .from(veteranProfiles)
      .leftJoin(users, eq(veteranProfiles.userId, users.id))
      .where(and(
        isNotNull(veteranProfiles.trialEndsAt),
        lte(veteranProfiles.trialEndsAt, now),
        gte(veteranProfiles.trialEndsAt, since),
        isNull(veteranProfiles.archivedAt),
        sql`(${veteranProfiles.subscriptionStatus} IS NULL OR ${veteranProfiles.subscriptionStatus} != 'active')`,
      ))
      .orderBy(desc(veteranProfiles.trialEndsAt));
    return rows.map(r => ({ ...r.profile, firstName: r.firstName, lastName: r.lastName, email: r.email }));
  }

  async updateStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
    await db
      .update(veteranProfiles)
      .set({ stripeCustomerId, updatedAt: new Date() })
      .where(eq(veteranProfiles.userId, userId));
  }

  async getProfileByStripeCustomerId(stripeCustomerId: string): Promise<VeteranProfile | undefined> {
    const [profile] = await db
      .select()
      .from(veteranProfiles)
      .where(eq(veteranProfiles.stripeCustomerId, stripeCustomerId));
    return profile;
  }

  async updateSubscriptionFromStripe(
    stripeCustomerId: string,
    data: {
      stripeSubscriptionId: string | null;
      subscriptionTier: string;
      subscriptionStatus: string;
      trialEndsAt?: Date | null;
    }
  ): Promise<VeteranProfile | undefined> {
    const updateData: any = {
      stripeSubscriptionId: data.stripeSubscriptionId,
      subscriptionTier: data.subscriptionTier,
      subscriptionStatus: data.subscriptionStatus,
      updatedAt: new Date(),
    };
    if (data.trialEndsAt !== undefined) {
      updateData.trialEndsAt = data.trialEndsAt;
    }
    const [profile] = await db
      .update(veteranProfiles)
      .set(updateData)
      .where(eq(veteranProfiles.stripeCustomerId, stripeCustomerId))
      .returning();
    return profile;
  }
}

export const storage = new DatabaseStorage();

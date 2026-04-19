import cron from "node-cron";
import { storage } from "./storage";
import { sendTrialExpiryEmail, sendDay7ReengagementEmail, sendDailyActivityReport, sendTrialLetterFollowupEmail } from "./emails";
import { maybeSendAlert } from "./alert";
import { getRankDisplayName } from "@shared/utils";
import Anthropic from "@anthropic-ai/sdk";

function getDisplayName(profile: any): string {
  const rankDisplay = profile.rank ? getRankDisplayName(profile.rank, profile.branch, profile.lastName, profile.firstName) : "";
  const last = profile.lastName || "";
  if (rankDisplay && last) return `${rankDisplay} ${last}`;
  if (profile.firstName && last) return `${profile.firstName} ${last}`;
  if (last) return last;
  if (profile.firstName) return profile.firstName;
  if (profile.email) return profile.email;
  return profile.userId;
}

async function checkTrialExpiryEmails(): Promise<void> {
  try {
    const profiles = await storage.getTrialExpiringProfiles();
    for (const profile of profiles) {
      if (!profile.email) continue;
      const rankTitle = profile.rank ? getRankDisplayName(profile.rank, profile.branch, null, null) : "";
      const lastName = profile.lastName || "";
      const sent = await sendTrialExpiryEmail(profile.email, rankTitle, lastName);
      if (sent) {
        await storage.markTrialExpiryEmailSent(profile.userId);
        console.log(`[scheduler] Trial expiry email sent to ${profile.email}`);
      } else {
        console.warn(`[scheduler] Trial expiry email failed for ${profile.email} — will retry next cycle`);
      }
    }
    if (profiles.length > 0) {
      console.log(`[scheduler] Processed ${profiles.length} trial expiry candidates`);
    }
  } catch (error) {
    console.error("[scheduler] Error checking trial expiry emails:", error);
  }
}

async function checkDay7ReengagementEmails(): Promise<void> {
  try {
    const profiles = await storage.getDay7ReengagementProfiles();
    for (const profile of profiles) {
      if (!profile.email) continue;
      const rankTitle = profile.rank ? getRankDisplayName(profile.rank, profile.branch, null, null) : "";
      const lastName = profile.lastName || "";
      const sent = await sendDay7ReengagementEmail(profile.email, rankTitle, lastName);
      if (sent) {
        await storage.markDay7ReengagementSent(profile.userId);
        console.log(`[scheduler] Day 7 re-engagement email sent to ${profile.email}`);
      } else {
        console.warn(`[scheduler] Day 7 re-engagement email failed for ${profile.email} — will retry next cycle`);
      }
    }
    if (profiles.length > 0) {
      console.log(`[scheduler] Processed ${profiles.length} day 7 re-engagement candidates`);
    }
  } catch (error) {
    console.error("[scheduler] Error checking day 7 re-engagement emails:", error);
  }
}

async function sendDailyReport(): Promise<void> {
  try {
    const since = new Date();
    since.setHours(since.getHours() - 24);

    const [newSignups, usageSummary, expiringTrials, expiredTrials, allProfiles] = await Promise.all([
      storage.getRecentSignups(since),
      storage.getUsageSummary(since),
      storage.getExpiringTrials(48),
      storage.getRecentlyExpiredTrials(since),
      storage.getAllProfiles(true),
    ]);

    const profileMap = new Map<string, any>();
    for (const p of allProfiles) {
      profileMap.set(p.userId, p);
    }

    const signupData = newSignups.map(p => ({
      name: getDisplayName(p),
      email: p.email || "unknown",
      rank: p.rank ? getRankDisplayName(p.rank, p.branch, p.lastName, p.firstName) : "N/A",
      branch: p.branch || "N/A",
    }));

    const userActions: Record<string, { userId: string; name: string; actions: { action: string; count: number }[] }> = {};
    for (const u of usageSummary) {
      if (!userActions[u.userId]) {
        const userProfile = profileMap.get(u.userId);
        userActions[u.userId] = {
          userId: u.userId,
          name: userProfile ? getDisplayName(userProfile) : u.userId,
          actions: [],
        };
      }
      userActions[u.userId].actions.push({ action: u.action, count: u.count });
    }

    const now = new Date();
    const expiringData = expiringTrials.map(p => ({
      name: getDisplayName(p),
      email: p.email || "unknown",
      hoursLeft: p.trialEndsAt ? Math.max(0, (new Date(p.trialEndsAt).getTime() - now.getTime()) / (1000 * 60 * 60)) : 0,
    }));

    const expiredData = expiredTrials.map(p => ({
      name: getDisplayName(p),
      email: p.email || "unknown",
    }));

    await sendDailyActivityReport({
      newSignups: signupData,
      usageSummary: Object.values(userActions),
      expiringTrials: expiringData,
      expiredTrials: expiredData,
    });

    console.log("[scheduler] Daily activity report sent");
  } catch (error) {
    console.error("[scheduler] Error sending daily report:", error);
  }
}

async function checkTrialLetterFollowupEmails(): Promise<void> {
  try {
    const profiles = await storage.getTrialLetterFollowupProfiles();
    for (const profile of profiles) {
      if (!profile.email) continue;
      const firstName = profile.firstName || "";
      const conditionName = profile.firstLetterConditionName || "your condition";
      const score = profile.firstLetterScore || 0;
      const preview = profile.firstLetterPreview || "";
      const sent = await sendTrialLetterFollowupEmail(profile.email, firstName, conditionName, score, preview);
      if (sent) {
        await storage.markTrialLetterEmailSent(profile.userId);
        console.log(`[scheduler] Trial letter followup email sent to ${profile.email}`);
      } else {
        console.warn(`[scheduler] Trial letter followup email failed for ${profile.email} — will retry next cycle`);
      }
    }
    if (profiles.length > 0) {
      console.log(`[scheduler] Processed ${profiles.length} trial letter followup candidates`);
    }
  } catch (error) {
    console.error("[scheduler] Error checking trial letter followup emails:", error);
  }
}

async function checkAIHealth(): Promise<void> {
  console.log("[scheduler] AI health check starting...");
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 5,
      messages: [{ role: "user", content: "Say OK" }],
    });
    const block = response.content[0];
    const text = block.type === "text" ? block.text : "";
    if (!text) throw new Error("Empty response from Claude");
    console.log(`[scheduler] AI health check passed — Claude responded: "${text}"`);
  } catch (error: any) {
    const message = error?.message || String(error);
    console.error("[scheduler] AI health check FAILED:", message);
    await maybeSendAlert({
      errorType: "AI Health Check Failed",
      message,
      stack: error?.stack,
      route: "scheduler/checkAIHealth",
    });
  }
}

export function startScheduler(): void {
  cron.schedule("0 * * * *", async () => {
    console.log("[scheduler] Hourly check starting...");
    await checkTrialExpiryEmails();
    await checkDay7ReengagementEmails();
    await checkTrialLetterFollowupEmails();
  });

  cron.schedule("0 7 * * *", async () => {
    console.log("[scheduler] Daily report starting (7 AM ET)...");
    await sendDailyReport();
  }, { timezone: "America/New_York" });

  cron.schedule("0 9 * * *", async () => {
    console.log("[scheduler] Daily AI health check starting (9 AM ET)...");
    await checkAIHealth();
  }, { timezone: "America/New_York" });

  console.log("[scheduler] Scheduler started — hourly email checks + daily report at 7 AM ET + AI health check at 9 AM ET");
}

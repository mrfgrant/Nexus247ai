import cron from "node-cron";
import { storage } from "./storage";
import { sendTrialExpiryEmail, sendDay7ReengagementEmail, sendDailyActivityReport } from "./emails";
import { getRankDisplayName } from "@shared/utils";

function getDisplayName(profile: any): string {
  const rankDisplay = profile.rank ? getRankDisplayName(profile.rank) : "";
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
      const rankTitle = profile.rank ? getRankDisplayName(profile.rank) : "";
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
      const rankTitle = profile.rank ? getRankDisplayName(profile.rank) : "";
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
      rank: p.rank ? getRankDisplayName(p.rank) : "N/A",
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

export function startScheduler(): void {
  cron.schedule("0 * * * *", async () => {
    console.log("[scheduler] Hourly check starting...");
    await checkTrialExpiryEmails();
    await checkDay7ReengagementEmails();
  });

  cron.schedule("0 7 * * *", async () => {
    console.log("[scheduler] Daily report starting (7 AM ET)...");
    await sendDailyReport();
  }, { timezone: "America/New_York" });

  console.log("[scheduler] Scheduler started — hourly email checks + daily report at 7 AM ET");
}

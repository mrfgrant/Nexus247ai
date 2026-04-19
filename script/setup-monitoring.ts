#!/usr/bin/env npx tsx
/**
 * Nexus247 Uptime Monitoring Setup
 *
 * This script configures UptimeRobot to monitor https://nexus247.ai/api/health
 * every 5 minutes and send email alerts to jamie@mrfgrant.com on downtime.
 *
 * Prerequisites:
 *   1. Create a free account at https://uptimerobot.com
 *   2. Go to My Settings → API Settings → Main API Key
 *   3. Set UPTIMEROBOT_API_KEY in your Replit Secrets
 *   4. Run: npx tsx script/setup-monitoring.ts
 */

const UPTIMEROBOT_API = "https://api.uptimerobot.com/v2";
const MONITOR_URL = "https://nexus247.ai/api/health";
const ALERT_EMAIL = "jamie@mrfgrant.com";
const MONITOR_NAME = "Nexus247 Health Check";
const CHECK_INTERVAL_SECONDS = 300; // 5 minutes

const API_KEY = process.env.UPTIMEROBOT_API_KEY;

if (!API_KEY) {
  console.error("ERROR: UPTIMEROBOT_API_KEY environment variable is not set.");
  console.error("Please set it in your Replit Secrets and try again.");
  process.exit(1);
}

async function apiCall(endpoint: string, params: Record<string, string | number>) {
  const body = new URLSearchParams({
    api_key: API_KEY!,
    format: "json",
    ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  });

  const response = await fetch(`${UPTIMEROBOT_API}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await response.json() as { stat: string; error?: { type: string; message: string }; [key: string]: unknown };

  if (data.stat !== "ok") {
    throw new Error(`UptimeRobot API error: ${JSON.stringify(data.error)}`);
  }

  return data;
}

interface AlertContact {
  id: string;
  email: string;
  isExactMatch: boolean;
}

async function getOrCreateAlertContact(): Promise<AlertContact> {
  console.log(`\nFetching alert contacts from UptimeRobot...`);

  const contacts = await apiCall("getAlertContacts", {}) as { alert_contacts: { id: string; friendly_name: string; value: string }[] };
  const list = contacts.alert_contacts ?? [];

  if (list.length === 0) {
    throw new Error(
      `No alert contacts found. Please add an alert contact in UptimeRobot first:\n` +
      `  https://uptimerobot.com → My Settings → Alert Contacts\n` +
      `  Add ${ALERT_EMAIL} and verify the email.`
    );
  }

  // Prefer exact email match
  const exactMatch = list.find((c) => c.value === ALERT_EMAIL);
  if (exactMatch) {
    console.log(`  ✓ Found exact alert contact for ${ALERT_EMAIL} (ID: ${exactMatch.id})`);
    return { id: exactMatch.id, email: exactMatch.value, isExactMatch: true };
  }

  // Fall back to whichever contact exists (free plan allows only 1) but warn clearly
  const fallback = list[0];
  console.log(`  ⚠ No alert contact found for ${ALERT_EMAIL}.`);
  console.log(`  Existing contact: "${fallback.friendly_name || fallback.value}" <${fallback.value}> (ID: ${fallback.id})`);
  console.log(`  ACTION REQUIRED: Update this contact to ${ALERT_EMAIL} in UptimeRobot:`);
  console.log(`    https://uptimerobot.com → My Settings → Alert Contacts`);
  return { id: fallback.id, email: fallback.value, isExactMatch: false };
}

async function getOrCreateMonitor(alertContactId: string): Promise<string> {
  console.log(`\nChecking for existing monitor: ${MONITOR_URL}`);

  const monitors = await apiCall("getMonitors", {}) as { monitors: { id: string; friendly_name: string; url: string; status: number }[] };

  const existing = monitors.monitors?.find(
    (m) => m.url === MONITOR_URL
  );

  if (existing) {
    console.log(`  ✓ Monitor already exists (ID: ${existing.id}, Status: ${existing.status})`);
    return existing.id;
  }

  console.log(`  Creating new monitor for ${MONITOR_URL}...`);
  const result = await apiCall("newMonitor", {
    friendly_name: MONITOR_NAME,
    url: MONITOR_URL,
    type: 1, // HTTP/HTTPS
    interval: CHECK_INTERVAL_SECONDS,
    alert_contacts: `${alertContactId}_0_0`, // contactId_threshold_recurrence
    http_method: 2, // GET
    http_username: "",
    http_password: "",
  }) as { monitor: { id: string } };

  const id = result.monitor.id;
  console.log(`  ✓ Monitor created (ID: ${id})`);
  return id;
}

async function ensureStatusPage(monitorId: string): Promise<void> {
  console.log("\nChecking public status pages...");

  try {
    const pages = await apiCall("getPSPs", {}) as {
      psps: { id: string | number; friendly_name: string; standard_url: string; custom_url: string; monitors: number | string }[];
    };

    const list = pages.psps ?? [];

    if (list.length > 0) {
      // Attach monitor to the first (or matching) existing page
      const page = list.find((p) => String(p.monitors) === String(monitorId)) ?? list[0];
      const url = page.standard_url || page.custom_url;

      if (String(page.monitors) !== String(monitorId)) {
        // Update the page to include our monitor
        await apiCall("editPSP", {
          id: String(page.id),
          friendly_name: "Nexus247 Status",
          monitors: monitorId,
          sort: 1,
        });
        console.log(`  ✓ Updated status page to include Nexus247 monitor`);
      } else {
        console.log(`  ✓ Status page already tracking this monitor`);
      }

      console.log(`  ✓ Public status page: ${url}`);
      console.log("  Share this URL with users so they can self-check site status.");
      return;
    }

    // Try creating a new page
    console.log("  Creating public status page...");
    const result = await apiCall("newPSP", {
      type: 1,
      friendly_name: "Nexus247 Status",
      monitors: monitorId,
      sort: 1,
    }) as { psp: { id: string; standard_url: string } };

    console.log(`  ✓ Public status page created: ${result.psp.standard_url}`);
    console.log("  Share this URL with users to check site status.");
  } catch (err) {
    console.log(`  (Status page setup skipped: ${(err as Error).message})`);
  }
}

async function main() {
  console.log("=== Nexus247 Uptime Monitoring Setup ===");
  console.log(`Target URL : ${MONITOR_URL}`);
  console.log(`Alert Email: ${ALERT_EMAIL}`);
  console.log(`Interval   : every ${CHECK_INTERVAL_SECONDS / 60} minutes`);

  try {
    const alertContact = await getOrCreateAlertContact();
    const monitorId = await getOrCreateMonitor(alertContact.id);
    await ensureStatusPage(monitorId);

    console.log("\n✅ Uptime monitoring setup complete!");
    console.log(`   Monitor: ${MONITOR_URL}`);
    console.log(`   Check interval: every ${CHECK_INTERVAL_SECONDS / 60} minutes`);

    if (alertContact.isExactMatch) {
      console.log(`   Alerts sent to: ${alertContact.email}`);
    } else {
      console.log(`   ⚠ Alerts currently sent to: ${alertContact.email}`);
      console.log(`   ⚠ TARGET address (${ALERT_EMAIL}) is NOT configured.`);
      console.log(`   ⚠ Update the alert contact in UptimeRobot to receive alerts at ${ALERT_EMAIL}.`);
    }

    console.log("\n   Log in at https://uptimerobot.com to view the dashboard.");
  } catch (err) {
    console.error("\n❌ Setup failed:", (err as Error).message);
    process.exit(1);
  }
}

main();

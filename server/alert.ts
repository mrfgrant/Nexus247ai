import { sendErrorAlertEmail } from "./emails";
import { sendSmsAlert } from "./twilio";

const alertRateMap = new Map<string, number>();
const ALERT_COOLDOWN_MS = 10 * 60 * 1000;

export async function maybeSendAlert(opts: Parameters<typeof sendErrorAlertEmail>[0]): Promise<void> {
  if (process.env.NODE_ENV !== "production") return;
  const key = opts.errorType;
  const last = alertRateMap.get(key) || 0;
  if (Date.now() - last < ALERT_COOLDOWN_MS) return;
  alertRateMap.set(key, Date.now());
  await Promise.all([
    sendErrorAlertEmail(opts).catch(() => {}),
    sendSmsAlert(opts).catch(() => {}),
  ]);
}

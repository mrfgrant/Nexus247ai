import twilio from "twilio";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) throw new Error("Twilio credentials not configured");
  return twilio(sid, token);
}

export async function sendSmsAlert(opts: {
  errorType: string;
  message: string;
  route?: string;
  method?: string;
}): Promise<void> {
  try {
    const from = process.env.TWILIO_FROM_NUMBER;
    const to = process.env.TWILIO_ALERT_TO_NUMBER;
    if (!from || !to) {
      console.error("[twilio] TWILIO_FROM_NUMBER or TWILIO_ALERT_TO_NUMBER not set");
      return;
    }

    const body = [
      `[Nexus247 ALERT] ${opts.errorType}`,
      `Route: ${opts.method || ""} ${opts.route || "server"}`,
      `Msg: ${opts.message.slice(0, 140)}`,
    ].join("\n");

    const client = getTwilioClient();
    await client.messages.create({ from, to, body });
    console.log(`[twilio] SMS alert sent to ${to}`);
  } catch (err) {
    console.error("[twilio] Failed to send SMS alert:", err);
  }
}

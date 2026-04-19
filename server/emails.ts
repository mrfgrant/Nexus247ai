import { getUncachableResendClient } from "./resend";

function buildFeature(num: string, title: string, desc: string): string {
  return `<tr><td style="padding:20px 40px 0;">
  <table cellpadding="0" cellspacing="0" width="100%"><tr>
    <td width="40" valign="top" style="padding-right:14px;">
      <div style="width:32px;height:32px;border-radius:50%;background:#0D2137;color:#D4A43E;text-align:center;line-height:32px;font-size:14px;font-weight:bold;">${num}</div>
    </td>
    <td>
      <p style="margin:0 0 4px;font-size:15px;font-weight:bold;color:#0D2137;">${title}</p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.55;">${desc}</p>
    </td>
  </tr></table>
</td></tr>`;
}

function buildStep(text: string): string {
  return `<tr><td style="padding:6px 0;font-size:14px;color:#444;line-height:1.5;">
  <span style="color:#D4A43E;font-weight:bold;margin-right:6px;">&#9656;</span> ${text}
</td></tr>`;
}

export function buildWelcomeEmailHtml(rankTitle: string, lastName: string): string {
  const greeting = rankTitle && lastName ? `${rankTitle} ${lastName}` : lastName || "Veteran";

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Welcome to Nexus247</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">

<tr><td style="background:#0D2137;padding:32px 40px;text-align:center;">
  <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#ffffff;letter-spacing:0.5px;">
    Nexus<span style="color:#D4A43E;">247</span>.ai
  </h1>
  <p style="margin:8px 0 0;font-size:13px;color:#ffffff;letter-spacing:1.5px;text-transform:uppercase;">
    Your AI Battle Buddy for VA Claims
  </p>
</td></tr>

<tr><td style="background:#D4A43E;height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

<tr><td style="padding:36px 40px 0;">
  <p style="margin:0;font-size:16px;color:#333;">Dear <strong>${greeting}</strong>,</p>
</td></tr>

<tr><td style="padding:20px 40px 0;">
  <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.65;">
    Welcome to Nexus247 &mdash; and welcome to a new way of fighting for what you've already earned.
  </p>
  <p style="margin:0 0 14px;font-size:15px;color:#444;line-height:1.65;">
    You served. You sacrificed. And you deserve benefits that reflect that service &mdash; fully, accurately, and without the bureaucratic runaround that has stopped too many veterans in their tracks.
  </p>
  <p style="margin:0;font-size:15px;color:#444;line-height:1.65;">
    <strong>That ends here.</strong>
  </p>
</td></tr>

<tr><td style="padding:20px 40px 0;">
  <p style="margin:0;font-size:15px;color:#444;line-height:1.65;">
    Nexus247 was built for one mission: to give every veteran the tools, the intelligence, and the precision to win their VA claim &mdash; regardless of whether it's a new claim, a supplemental, a denial, or a Higher Level Review. You now have access to all of it.
  </p>
</td></tr>

<tr><td style="padding:24px 40px 0;">
  <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9f7f3;border:1px solid #D4A43E;border-left:3px solid #D4A43E;border-radius:4px;">
    <tr><td style="padding:16px 20px;">
      <p style="margin:0 0 6px;font-size:15px;font-weight:bold;color:#0D2137;">Have a VA claims question?</p>
      <p style="margin:0;font-size:14px;color:#555;line-height:1.55;">Visit our <a href="https://nexus247.ai/forum" style="color:#D4A43E;font-weight:bold;text-decoration:none;">Q&amp;A Forum</a> &mdash; ask anything and get AI-powered answers grounded in 38 CFR, 24/7.</p>
    </td></tr>
  </table>
</td></tr>

<tr><td style="padding:32px 40px 0;">
  <h2 style="margin:0;font-size:20px;color:#0D2137;font-family:Georgia,'Times New Roman',serif;border-bottom:2px solid #D4A43E;padding-bottom:10px;">
    Here's What You're Now Armed With
  </h2>
</td></tr>

${buildFeature("01", "CFR-Grounded Nexus Letters", "Every letter we generate cites the exact 38 CFR sections VA raters are required to look for. No generic language. No templates. Your conditions, your records, your argument.")}
${buildFeature("02", "RPA Quality Scoring System", "Before you submit anything, your letter is scored across 5 dimensions &mdash; CFR Compliance, Nexus Strength, Evidence Grounding, Diagnostic Clarity, and Rater Readiness. If it scores low, we tell you exactly what to fix.")}
${buildFeature("03", "Decision Letter Analysis", "Upload your VA denial or rating decision letter. Our AI runs a 7-step analysis &mdash; then cross-references it against your medical records to build a personalized action plan with appeal steps, decision errors, key dates, and pre-generated response letters.")}
${buildFeature("04", "AI Claims Advisor &mdash; 24/7", "Ask anything about your specific case and get answers grounded in your actual records and the 38 CFR &mdash; not Google, not a forum post. Your battle buddy is always on.")}
${buildFeature("05", "Rating Estimator", "Calculate your combined VA disability rating using the official whole-person method before you ever file. Know where you stand before the VA tells you.")}
${buildFeature("06", "Human Expert Support", "When you need a real person in your corner &mdash; experienced claims specialists are available for manual review, strategy sessions, and C&amp;P exam preparation.")}

<tr><td style="padding:32px 40px 0;">
  <h2 style="margin:0;font-size:20px;color:#0D2137;font-family:Georgia,'Times New Roman',serif;border-bottom:2px solid #D4A43E;padding-bottom:10px;">
    Where to Start Right Now
  </h2>
</td></tr>

<tr><td style="padding:20px 40px 0;">
  <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.65;">
    The single most important thing you can do today is <strong>upload your records</strong>. Everything in Nexus247 gets sharper, more specific, and more powerful the moment your files are in the system. Here's the order we recommend:
  </p>
  <table cellpadding="0" cellspacing="0" width="100%">
    ${buildStep("Upload your medical records and service history")}
    ${buildStep("Run your first letter or analyze your decision letter")}
    ${buildStep("Review your RPA score &mdash; fix anything flagged before submitting")}
    ${buildStep("Ask the AI Claims Advisor your first question about your case")}
    ${buildStep("Check the Rating Estimator to see where your combined rating stands")}
  </table>
</td></tr>

<tr><td style="padding:24px 40px 0;">
  <p style="margin:0;font-size:15px;color:#444;line-height:1.65;">
    Your free trial gives you full access for 3 days &mdash; no credit card, no commitment. But don't wait. Every day your claim sits unworked is a day your benefits are delayed.
  </p>
</td></tr>

<tr><td style="padding:28px 40px 0;">
  <table cellpadding="0" cellspacing="0" width="100%"><tr>
    <td style="border-left:3px solid #D4A43E;padding:12px 20px;background:#f9f8f5;">
      <p style="margin:0;font-size:15px;color:#0D2137;font-style:italic;line-height:1.55;">
        &ldquo;The VA counts on veterans not knowing what's in their own file.<br>Nexus247 changes that.&rdquo;
      </p>
    </td>
  </tr></table>
</td></tr>

<tr><td style="padding:32px 40px 0;text-align:center;">
  <a href="https://nexus247.ai" style="display:inline-block;background:#D4A43E;color:#0D2137;font-size:16px;font-weight:bold;text-decoration:none;padding:14px 36px;border-radius:6px;letter-spacing:0.5px;">
    Log In &amp; Upload Your Records Now &rarr;
  </a>
</td></tr>

<tr><td style="padding:16px 40px 0;text-align:center;">
  <p style="margin:0;font-size:12px;color:#888;letter-spacing:0.3px;">
    3-Day Free Trial &nbsp;&middot;&nbsp; No Credit Card Required &nbsp;&middot;&nbsp; Cancel Anytime in One Click
  </p>
</td></tr>

<tr><td style="padding:32px 40px 0;">
  <p style="margin:0 0 4px;font-size:15px;color:#444;">We're in your corner.</p>
  <p style="margin:0;font-size:15px;color:#0D2137;font-weight:bold;">The Nexus247 Team</p>
  <p style="margin:4px 0 0;font-size:13px;color:#888;">nexus247.ai &nbsp;&middot;&nbsp; Your Battle Buddy. 24/7.</p>
</td></tr>

<tr><td style="padding:28px 40px 32px;">
  <table cellpadding="0" cellspacing="0" width="100%"><tr>
    <td style="border-top:1px solid #e5e5e5;padding-top:16px;text-align:center;">
      <p style="margin:0 0 6px;font-size:11px;color:#aaa;">
        Nexus247.ai &nbsp;&middot;&nbsp; Not a law firm &nbsp;&middot;&nbsp; Not affiliated with the VA
      </p>
      <p style="margin:0;font-size:11px;color:#aaa;">
        You received this email because you created an account at Nexus247.ai.
      </p>
    </td>
  </tr></table>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

const FALLBACK_FROM = "Nexus247 <noreply@mailer.nexus247.ai>";

export async function sendWelcomeEmail(toEmail: string, rankTitle: string, lastName: string): Promise<void> {
  try {
    const { client } = await getUncachableResendClient();
    const html = buildWelcomeEmailHtml(rankTitle, lastName);

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: toEmail,
      cc: "support@nexus247.ai",
      subject: "Welcome to Nexus247 — Your Mission Starts Now",
      html,
    });

    console.log(`[email] Welcome email sent to ${toEmail}:`, result);
  } catch (error) {
    console.error(`[email] Failed to send welcome email to ${toEmail}:`, error);
  }
}

export async function sendAdminSignupNotification(details: {
  email: string;
  rank?: string;
  branch?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  try {
    const { client } = await getUncachableResendClient();
    const name = [details.rank, details.firstName, details.lastName].filter(Boolean).join(" ") || "Unknown";

    const html = `<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">
  <h2 style="color:#0D2137;margin:0 0 16px;border-bottom:2px solid #D4A43E;padding-bottom:8px;">New Nexus247 Signup</h2>
  <table style="width:100%;font-size:14px;color:#333;">
    <tr><td style="padding:6px 0;font-weight:bold;width:100px;">Name:</td><td>${name}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Email:</td><td>${details.email}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Rank:</td><td>${details.rank || "Not provided"}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Branch:</td><td>${details.branch || "Not provided"}</td></tr>
    <tr><td style="padding:6px 0;font-weight:bold;">Date:</td><td>${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</td></tr>
  </table>
  <p style="margin:20px 0 0;font-size:12px;color:#888;">Nexus247.ai — Admin Notification</p>
</div>`;

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: "support@nexus247.ai",
      subject: `New Signup: ${name} (${details.email})`,
      html,
    });

    console.log(`[email] Admin signup notification sent for ${details.email}:`, result);
  } catch (error) {
    console.error(`[email] Failed to send admin signup notification for ${details.email}:`, error);
  }
}

export function buildTrialExpiryEmailHtml(rankTitle: string, lastName: string): string {
  const greeting = rankTitle && lastName ? `${rankTitle} ${lastName}` : lastName || "Veteran";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Nexus247 trial ends today</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#0D2137;padding:28px 40px;border-radius:8px 8px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:'Georgia',serif;font-size:22px;color:#ffffff;letter-spacing:0.02em;">
                    Nexus<span style="color:#D4A43E;">247</span>.ai
                  </span>
                </td>
                <td align="right">
                  <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);">
                    Trial Ending
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GOLD BAR -->
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#D4A43E,#e8bc58,#D4A43E);"></td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:48px 40px 36px;">

            <!-- Eyebrow -->
            <p style="margin:0 0 20px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#D4A43E;">
              Your Free Trial &middot; Ending Today
            </p>

            <!-- Greeting -->
            <p style="margin:0 0 16px;font-size:16px;color:#0D2137;font-family:Arial,sans-serif;font-weight:600;">
              ${greeting},
            </p>

            <!-- Headline -->
            <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:28px;color:#0D2137;line-height:1.2;font-weight:700;">
              Your claim doesn't stop.<br />Neither should your tools.
            </h1>

            <!-- Body -->
            <p style="margin:0 0 16px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              Your 3-day Pro trial ends today. Everything you've built &mdash; your letters, your RPA scores, your C&amp;P prep &mdash; stays in your account.
            </p>
            <p style="margin:0 0 28px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              But without an active plan, you won't be able to generate new letters, run new scores, or access your prep guides.
            </p>

            <!-- Proof block -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f3;border:1px solid #e8e4dc;border-left:3px solid #D4A43E;border-radius:4px;margin-bottom:32px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8f82;">
                    Why it matters
                  </p>
                  <p style="margin:0;font-family:'Georgia',serif;font-size:15px;color:#0D2137;line-height:1.6;font-style:italic;">
                    "I went from $175/month to $2,102/month. $25,000 in retro pay. No attorney. 
                    Four months. These are my actual VA payment records."
                  </p>
                  <p style="margin:8px 0 0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.1em;color:#9a8f82;text-transform:uppercase;">
                    &mdash; Nexus247 Founder &middot; 10% &rarr; 80% Rating
                  </p>
                </td>
              </tr>
            </table>

            <!-- Stat row -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
              <tr>
                <td width="33%" style="text-align:center;padding:0 8px;">
                  <div style="font-family:'Georgia',serif;font-size:24px;color:#D4A43E;font-weight:700;line-height:1;">$25k+</div>
                  <div style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8f82;margin-top:4px;">Retro pay</div>
                </td>
                <td width="33%" style="text-align:center;padding:0 8px;border-left:1px solid #e8e4dc;border-right:1px solid #e8e4dc;">
                  <div style="font-family:'Georgia',serif;font-size:24px;color:#D4A43E;font-weight:700;line-height:1;">10&rarr;80%</div>
                  <div style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8f82;margin-top:4px;">Rating jump</div>
                </td>
                <td width="33%" style="text-align:center;padding:0 8px;">
                  <div style="font-family:'Georgia',serif;font-size:24px;color:#D4A43E;font-weight:700;line-height:1;">4 mo.</div>
                  <div style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:0.1em;text-transform:uppercase;color:#9a8f82;margin-top:4px;">Start to win</div>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
              <tr>
                <td align="center">
                  <a href="https://nexus247.ai/pricing" style="display:inline-block;background:#D4A43E;color:#0D2137;text-decoration:none;padding:16px 40px;border-radius:4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                    Keep My Access &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 32px;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#9a8f82;">
              Starter from $29/mo &middot; Pro from $49/mo &middot; No long-term contract
            </p>

            <!-- What you lose -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf3e3;border:1px solid rgba(212,164,62,0.25);border-radius:6px;margin-bottom:8px;">
              <tr>
                <td style="padding:20px 24px;">
                  <p style="margin:0 0 12px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#D4A43E;">
                    What stops working after today
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;">&#10007; &nbsp;New nexus letter generation</td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;">&#10007; &nbsp;RPA scoring on new letters</td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;">&#10007; &nbsp;C&amp;P exam prep guides</td>
                    </tr>
                    <tr>
                      <td style="padding:3px 0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;">&#10007; &nbsp;AI claims advisor</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f4f3f0;padding:24px 40px;border-radius:0 0 8px 8px;border-top:1px solid #e8e4dc;">
            <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f82;text-align:center;">
              Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;text-align:center;">
              <a href="https://nexus247.ai" style="color:#b0a898;">Unsubscribe</a> &middot; <a href="https://nexus247.ai/privacy" style="color:#b0a898;">Privacy Policy</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

export function buildDay7ReengagementEmailHtml(rankTitle: string, lastName: string): string {
  const greeting = rankTitle && lastName ? `${rankTitle} ${lastName}` : lastName || "Veteran";
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Still fighting your claim alone?</title>
</head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:#0D2137;padding:28px 40px;border-radius:8px 8px 0 0;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <span style="font-family:'Georgia',serif;font-size:22px;color:#ffffff;letter-spacing:0.02em;">
                    Nexus<span style="color:#D4A43E;">247</span>.ai
                  </span>
                </td>
                <td align="right">
                  <span style="font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:rgba(255,255,255,0.35);">
                    7 Days Later
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GOLD BAR -->
        <tr>
          <td style="height:3px;background:linear-gradient(90deg,#D4A43E,#e8bc58,#D4A43E);"></td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:48px 40px 36px;">

            <!-- Eyebrow -->
            <p style="margin:0 0 20px;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#9a8f82;">
              Checking In
            </p>

            <!-- Greeting -->
            <p style="margin:0 0 16px;font-size:16px;color:#0D2137;font-family:Arial,sans-serif;font-weight:600;">
              ${greeting},
            </p>

            <!-- Headline -->
            <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:28px;color:#0D2137;line-height:1.2;font-weight:700;">
              The VA isn't waiting.<br /><em style="color:#D4A43E;">Your claim shouldn't either.</em>
            </h1>

            <!-- Intro -->
            <p style="margin:0 0 16px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              It's been a week since your trial ended. We're not going to pretend that's not a week your claim stood still.
            </p>
            <p style="margin:0 0 28px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              Every day without a strong nexus letter is a day the VA has an easier time saying no. Effective dates are real money &mdash; and they run from when you file, not when you're ready.
            </p>

            <!-- Timeline visual -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;background:#060d18;border-radius:8px;overflow:hidden;">
              <tr>
                <td style="padding:28px 28px 24px;">
                  <p style="margin:0 0 20px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#D4A43E;">
                    Real Results &middot; Founder's VA Records
                  </p>
                  <!-- Timeline rows -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="80" style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.3);padding:4px 0;vertical-align:top;">Dec 2020</td>
                      <td style="padding:4px 0 4px 12px;">
                        <div style="height:20px;width:8%;background:rgba(255,255,255,0.1);border-radius:3px;display:inline-block;"></div>
                        <span style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.3);margin-left:8px;">$144/mo &mdash; 10% rating</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.2);padding:4px 0;vertical-align:top;">2021&ndash;2024</td>
                      <td style="padding:4px 0 4px 12px;">
                        <span style="font-family:'Courier New',monospace;font-size:10px;color:rgba(255,255,255,0.2);font-style:italic;">4 years. COLA only. System doing the bare minimum.</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Courier New',monospace;font-size:10px;color:#D4A43E;padding:4px 0;vertical-align:top;font-weight:700;">Jan 2025</td>
                      <td style="padding:4px 0 4px 12px;">
                        <div style="height:20px;width:84%;background:linear-gradient(90deg,#D4A43E,#e8bc58);border-radius:3px;display:inline-block;"></div>
                        <span style="font-family:'Courier New',monospace;font-size:10px;color:#D4A43E;margin-left:8px;font-weight:700;">$1,759/mo &mdash; Nexus247</span>
                      </td>
                    </tr>
                    <tr>
                      <td style="font-family:'Courier New',monospace;font-size:10px;color:#D4A43E;padding:4px 0;vertical-align:top;font-weight:700;">Dec 2025</td>
                      <td style="padding:4px 0 4px 12px;">
                        <div style="height:20px;width:100%;background:linear-gradient(90deg,#D4A43E,#e8bc58);border-radius:3px;display:inline-block;"></div>
                        <span style="font-family:'Courier New',monospace;font-size:10px;color:#D4A43E;margin-left:8px;font-weight:700;">$2,102/mo &middot; 80% &middot; $25k retro</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <!-- The honest paragraph -->
            <p style="margin:0 0 16px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              For four years the VA gave the minimum. A COLA adjustment here, a denial there. It took the right letters &mdash; CFR-grounded, scored for quality, built around the actual evidence &mdash; to change that.
            </p>
            <p style="margin:0 0 32px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
              That's what Nexus247 does. Not magic. Just the right argument, in the right format, for how raters actually read claims.
            </p>

            <!-- Special offer block -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf3e3;border:1px solid rgba(212,164,62,0.3);border-radius:6px;margin-bottom:32px;">
              <tr>
                <td style="padding:24px 28px;">
                  <p style="margin:0 0 6px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#D4A43E;">
                    Come Back Offer
                  </p>
                  <p style="margin:0 0 12px;font-family:'Georgia',serif;font-size:18px;color:#0D2137;font-weight:700;">
                    First month of Pro for $29.
                  </p>
                  <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;line-height:1.6;">
                    Use code <strong style="font-family:'Courier New',monospace;background:#fff;padding:2px 8px;border:1px solid rgba(212,164,62,0.3);border-radius:3px;color:#0D2137;">COMEBACK</strong> at checkout. One time, for returning trial users only.
                  </p>
                  <a href="https://nexus247.ai/pricing?code=COMEBACK" style="display:inline-block;background:#D4A43E;color:#0D2137;text-decoration:none;padding:13px 32px;border-radius:4px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                    Claim My Offer &rarr;
                  </a>
                </td>
              </tr>
            </table>

            <!-- FAQ row — objection handling -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              <tr>
                <td style="border-top:1px solid #e8e4dc;padding-top:24px;">
                  <p style="margin:0 0 16px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8f82;">
                    Common Questions
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:14px;">
                  <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:14px;color:#0D2137;font-weight:700;">
                    "I'm not sure my condition qualifies."
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;line-height:1.6;font-weight:300;">
                    That's exactly what our AI analyzes. Upload your records and let the system tell you what's serviceable &mdash; including secondary conditions you may not have thought to claim.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding-bottom:14px;border-top:1px solid #f0ede8;padding-top:14px;">
                  <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:14px;color:#0D2137;font-weight:700;">
                    "I already have an attorney."
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;line-height:1.6;font-weight:300;">
                    Good. Use Nexus247 to score their letters before they go out. If they're not hitting 80+ on RPA, they're leaving money on the table &mdash; your money.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="border-top:1px solid #f0ede8;padding-top:14px;">
                  <p style="margin:0 0 4px;font-family:'Georgia',serif;font-size:14px;color:#0D2137;font-weight:700;">
                    "I can't afford it right now."
                  </p>
                  <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#4a4a4a;line-height:1.6;font-weight:300;">
                    $29 is less than one hour of an attorney's time. And unlike the attorney, we don't take 20% of your retro when you win.
                  </p>
                </td>
              </tr>
            </table>

            <!-- Final CTA -->
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <a href="https://nexus247.ai/pricing?code=COMEBACK" style="display:inline-block;background:#0D2137;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
                    Get Back to Work on My Claim &rarr;
                  </a>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-top:12px;">
                  <span style="font-family:Arial,sans-serif;font-size:11px;color:#9a8f82;">
                    Code COMEBACK &middot; First month $29 &middot; Cancel anytime
                  </span>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f4f3f0;padding:24px 40px;border-radius:0 0 8px 8px;border-top:1px solid #e8e4dc;">
            <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f82;text-align:center;">
              Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
            </p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;text-align:center;">
              <a href="https://nexus247.ai" style="color:#b0a898;">Unsubscribe</a> &middot; <a href="https://nexus247.ai/privacy" style="color:#b0a898;">Privacy Policy</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

export async function sendTrialExpiryEmail(toEmail: string, rankTitle: string, lastName: string): Promise<boolean> {
  try {
    const { client } = await getUncachableResendClient();
    const html = buildTrialExpiryEmailHtml(rankTitle, lastName);

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: toEmail,
      subject: "Your Nexus247 trial ends today — keep your progress",
      html,
    });

    console.log(`[email] Trial expiry email sent to ${toEmail}:`, result);
    return true;
  } catch (error) {
    console.error(`[email] Failed to send trial expiry email to ${toEmail}:`, error);
    return false;
  }
}

export async function sendDay7ReengagementEmail(toEmail: string, rankTitle: string, lastName: string): Promise<boolean> {
  try {
    const { client } = await getUncachableResendClient();
    const html = buildDay7ReengagementEmailHtml(rankTitle, lastName);

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: toEmail,
      subject: "Still fighting your claim alone?",
      html,
    });

    console.log(`[email] Day 7 re-engagement email sent to ${toEmail}:`, result);
    return true;
  } catch (error) {
    console.error(`[email] Failed to send day 7 re-engagement email to ${toEmail}:`, error);
    return false;
  }
}

export async function sendDailyActivityReport(data: {
  newSignups: { name: string; email: string; rank: string; branch: string }[];
  usageSummary: { userId: string; name: string; actions: { action: string; count: number }[] }[];
  expiringTrials: { name: string; email: string; hoursLeft: number }[];
  expiredTrials: { name: string; email: string }[];
}): Promise<void> {
  try {
    const { client } = await getUncachableResendClient();
    const now = new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", weekday: "long", year: "numeric", month: "long", day: "numeric" });

    const signupRows = data.newSignups.length > 0
      ? data.newSignups.map(s => `<tr><td style="padding:4px 8px;font-size:13px;color:#333;">${s.name}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${s.email}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${s.rank}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${s.branch}</td></tr>`).join("")
      : `<tr><td colspan="4" style="padding:8px;font-size:13px;color:#888;font-style:italic;">No new signups</td></tr>`;

    const usageRows = data.usageSummary.length > 0
      ? data.usageSummary.map(u => {
          const actionList = u.actions.map(a => `${a.action.replace(/_/g, " ")}: ${a.count}`).join(", ");
          return `<tr><td style="padding:4px 8px;font-size:13px;color:#333;">${u.name}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${actionList}</td></tr>`;
        }).join("")
      : `<tr><td colspan="2" style="padding:8px;font-size:13px;color:#888;font-style:italic;">No activity</td></tr>`;

    const expiringRows = data.expiringTrials.length > 0
      ? data.expiringTrials.map(e => `<tr><td style="padding:4px 8px;font-size:13px;color:#333;">${e.name}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${e.email}</td><td style="padding:4px 8px;font-size:13px;color:#D4A43E;font-weight:bold;">${Math.round(e.hoursLeft)}h left</td></tr>`).join("")
      : `<tr><td colspan="3" style="padding:8px;font-size:13px;color:#888;font-style:italic;">No trials expiring soon</td></tr>`;

    const expiredRows = data.expiredTrials.length > 0
      ? data.expiredTrials.map(e => `<tr><td style="padding:4px 8px;font-size:13px;color:#333;">${e.name}</td><td style="padding:4px 8px;font-size:13px;color:#333;">${e.email}</td></tr>`).join("")
      : `<tr><td colspan="2" style="padding:8px;font-size:13px;color:#888;font-style:italic;">No recently expired trials</td></tr>`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:32px 16px;">
<tr><td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;">

<tr><td style="background:#0D2137;padding:24px 32px;border-radius:8px 8px 0 0;">
  <span style="font-family:Georgia,serif;font-size:20px;color:#fff;">Nexus<span style="color:#D4A43E;">247</span>.ai</span>
  <span style="float:right;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.35);line-height:28px;">Daily Report</span>
</td></tr>
<tr><td style="height:3px;background:linear-gradient(90deg,#D4A43E,#e8bc58,#D4A43E);"></td></tr>

<tr><td style="background:#fff;padding:32px;">

  <h1 style="margin:0 0 4px;font-family:Georgia,serif;font-size:22px;color:#0D2137;">Daily Activity Report</h1>
  <p style="margin:0 0 24px;font-size:13px;color:#9a8f82;">${now}</p>

  <!-- New Signups -->
  <h2 style="margin:0 0 8px;font-size:14px;color:#0D2137;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #D4A43E;padding-bottom:6px;">New Signups (24h)</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr style="background:#f4f3f0;"><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Name</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Email</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Rank</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Branch</td></tr>
    ${signupRows}
  </table>

  <!-- Feature Usage -->
  <h2 style="margin:0 0 8px;font-size:14px;color:#0D2137;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #D4A43E;padding-bottom:6px;">Feature Usage (24h)</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr style="background:#f4f3f0;"><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">User</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Actions</td></tr>
    ${usageRows}
  </table>

  <!-- Expiring Trials -->
  <h2 style="margin:0 0 8px;font-size:14px;color:#0D2137;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #D4A43E;padding-bottom:6px;">Trials Expiring (48h)</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr style="background:#f4f3f0;"><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Name</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Email</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Time Left</td></tr>
    ${expiringRows}
  </table>

  <!-- Recently Expired -->
  <h2 style="margin:0 0 8px;font-size:14px;color:#0D2137;font-family:'Courier New',monospace;letter-spacing:0.1em;text-transform:uppercase;border-bottom:2px solid #D4A43E;padding-bottom:6px;">Expired Trials (24h) &mdash; Not Subscribed</h2>
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr style="background:#f4f3f0;"><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Name</td><td style="padding:4px 8px;font-size:11px;font-weight:bold;color:#666;">Email</td></tr>
    ${expiredRows}
  </table>

</td></tr>

<tr><td style="background:#f4f3f0;padding:16px 32px;border-radius:0 0 8px 8px;border-top:1px solid #e8e4dc;">
  <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f82;text-align:center;">
    Nexus247.ai &middot; Admin Daily Report
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body></html>`;

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: "support@nexus247.ai",
      subject: `Nexus247 Daily Report — ${now}`,
      html,
    });

    console.log(`[email] Daily activity report sent:`, result);
  } catch (error) {
    console.error(`[email] Failed to send daily activity report:`, error);
  }
}

export function buildTrialLetterFollowupHtml(firstName: string, conditionName: string, score: number, letterPreview: string): string {
  const name = firstName || "Veteran";
  const scoreContext = score >= 85
    ? "This is an excellent score — your letter is strong enough to submit as-is."
    : score >= 65
      ? "This is a solid score, but there are areas that could be strengthened before submission."
      : "This score suggests your letter needs significant improvement before submission.";

  const escapedPreview = letterPreview.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Your nexus letter is ready</title></head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="background:#0D2137;padding:28px 40px;border-radius:8px 8px 0 0;">
  <span style="font-family:'Georgia',serif;font-size:22px;color:#ffffff;letter-spacing:0.02em;">
    Nexus<span style="color:#D4A43E;">247</span>.ai
  </span>
</td></tr>

<tr><td style="height:3px;background:linear-gradient(90deg,#D4A43E,#e8bc58,#D4A43E);"></td></tr>

<tr><td style="background:#ffffff;padding:48px 40px 36px;">

  <p style="margin:0 0 16px;font-size:16px;color:#0D2137;font-family:Arial,sans-serif;font-weight:600;">
    ${name},
  </p>

  <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:26px;color:#0D2137;line-height:1.2;font-weight:700;">
    Your nexus letter for<br /><em style="color:#D4A43E;">${conditionName}</em> is ready.
  </h1>

  <p style="margin:0 0 28px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
    Yesterday you generated a nexus letter through Nexus247. Here's how it scored:
  </p>

  <!-- Score Display -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr><td align="center">
      <span style="font-family:'Georgia',serif;font-size:56px;font-weight:bold;color:#D4A43E;line-height:1;">${score}</span>
      <span style="font-family:Arial,sans-serif;font-size:18px;color:#9a8f82;">/100</span>
    </td></tr>
  </table>

  <p style="margin:0 0 8px;text-align:center;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#D4A43E;">
    RPA Quality Score
  </p>
  <p style="margin:0 0 32px;text-align:center;font-size:14px;color:#666;font-family:Arial,sans-serif;">
    ${scoreContext}
  </p>

  <!-- Letter Preview -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f7f3;border:1px solid #e8e4dc;border-left:3px solid #D4A43E;border-radius:4px;margin-bottom:24px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8f82;">
        Letter Preview
      </p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#444;line-height:1.65;">
        ${escapedPreview}
      </p>
    </td></tr>
  </table>

  <p style="margin:0 0 28px;text-align:center;font-size:15px;color:#0D2137;font-weight:600;font-family:Arial,sans-serif;">
    The rest of your letter is ready and waiting.
  </p>

  <!-- CTA -->
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr><td align="center">
      <a href="https://nexus247.ai/pricing" style="display:inline-block;background:#D4A43E;color:#0D2137;text-decoration:none;padding:16px 40px;border-radius:4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
        Unlock My Full Letter &rarr;
      </a>
    </td></tr>
  </table>

  <p style="margin:0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#9a8f82;">
    Starter from $29/mo &middot; Pro from $49/mo &middot; Cancel anytime
  </p>

</td></tr>

<tr><td style="background:#f4f3f0;padding:24px 40px;border-radius:0 0 8px 8px;border-top:1px solid #e8e4dc;">
  <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f82;text-align:center;">
    Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
  </p>
  <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;text-align:center;">
    You received this email because you generated a letter on Nexus247.ai.
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendTrialLetterFollowupEmail(toEmail: string, firstName: string, conditionName: string, score: number, letterPreview: string): Promise<boolean> {
  try {
    const { client } = await getUncachableResendClient();
    const html = buildTrialLetterFollowupHtml(firstName, conditionName, score, letterPreview);

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: toEmail,
      subject: `Your nexus letter for ${conditionName} is ready`,
      html,
    });

    console.log(`[email] Trial letter followup email sent to ${toEmail}:`, result);
    return true;
  } catch (error) {
    console.error(`[email] Failed to send trial letter followup email to ${toEmail}:`, error);
    return false;
  }
}

export function buildReferralEmailHtml(referrerName: string, message: string | null): string {
  const personalMessage = message
    ? `<tr><td style="padding:0 40px 20px;">
        <table cellpadding="0" cellspacing="0" width="100%" style="background:#f9f7f3;border-left:3px solid #D4A43E;border-radius:4px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.16em;text-transform:uppercase;color:#9a8f82;">Personal Note</p>
            <p style="margin:0;font-size:14px;color:#444;line-height:1.55;font-style:italic;">&ldquo;${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}&rdquo;</p>
          </td></tr>
        </table>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>You've been invited to Nexus247</title></head>
<body style="margin:0;padding:0;background:#f4f3f0;font-family:'Georgia',serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f3f0;padding:40px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<tr><td style="background:#0D2137;padding:28px 40px;border-radius:8px 8px 0 0;">
  <span style="font-family:'Georgia',serif;font-size:22px;color:#ffffff;letter-spacing:0.02em;">
    Nexus<span style="color:#D4A43E;">247</span>.ai
  </span>
</td></tr>

<tr><td style="height:3px;background:linear-gradient(90deg,#D4A43E,#e8bc58,#D4A43E);"></td></tr>

<tr><td style="background:#ffffff;padding:48px 40px 24px;">
  <h1 style="margin:0 0 20px;font-family:'Georgia',serif;font-size:26px;color:#0D2137;line-height:1.2;font-weight:700;">
    ${referrerName} thinks you<br />should check out Nexus247.
  </h1>

  <p style="margin:0 0 20px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
    A fellow veteran is using Nexus247 to build CFR-compliant nexus letters, analyze VA decisions, and prepare for C&amp;P exams &mdash; all powered by AI. They wanted you to have the same advantage.
  </p>
</td></tr>

${personalMessage}

<tr><td style="padding:0 40px 32px;">
  <p style="margin:0 0 20px;font-size:16px;color:#4a4a4a;line-height:1.7;font-family:Arial,sans-serif;font-weight:300;">
    Sign up and get a free 3-day Pro trial &mdash; no credit card required. Full access to every tool from day one.
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
    <tr><td align="center">
      <a href="https://nexus247.ai" style="display:inline-block;background:#D4A43E;color:#0D2137;text-decoration:none;padding:16px 40px;border-radius:4px;font-family:Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">
        Start My Free Trial &rarr;
      </a>
    </td></tr>
  </table>

  <p style="margin:0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#9a8f82;">
    3-Day Free Trial &middot; No Credit Card &middot; Cancel Anytime
  </p>
</td></tr>

<tr><td style="background:#f4f3f0;padding:24px 40px;border-radius:0 0 8px 8px;border-top:1px solid #e8e4dc;">
  <p style="margin:0 0 8px;font-family:'Courier New',monospace;font-size:9px;letter-spacing:0.12em;text-transform:uppercase;color:#9a8f82;text-align:center;">
    Nexus247.ai &middot; Not a law firm &middot; Not affiliated with the VA
  </p>
  <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#b0a898;text-align:center;">
    You received this email because a fellow veteran referred you.
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

export async function sendReferralEmail(toEmail: string, referrerName: string, message: string | null): Promise<void> {
  try {
    const { client } = await getUncachableResendClient();
    const html = buildReferralEmailHtml(referrerName, message);

    const result = await client.emails.send({
      from: FALLBACK_FROM,
      to: toEmail,
      subject: `${referrerName} thinks you should check out Nexus247.ai`,
      html,
    });

    console.log(`[email] Referral email sent to ${toEmail}:`, result);
  } catch (error) {
    console.error(`[email] Failed to send referral email to ${toEmail}:`, error);
  }
}

export async function sendErrorAlertEmail(opts: {
  errorType: string;
  message: string;
  stack?: string;
  route?: string;
  method?: string;
  userId?: string;
}): Promise<void> {
  try {
    const { client } = await getUncachableResendClient();
    const ts = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const stackLines = (opts.stack || "").split("\n").slice(0, 10).join("\n");

    const html = `<div style="font-family:monospace;max-width:680px;margin:0 auto;padding:20px;background:#0D2137;color:#e5e7eb;border-radius:8px;">
  <div style="border-bottom:2px solid #D4A43E;padding-bottom:12px;margin-bottom:16px;">
    <span style="font-size:20px;color:#D4A43E;font-weight:bold;">&#9888; Nexus247 Server Alert</span>
    <span style="float:right;font-size:12px;color:#9ca3af;">${ts} ET</span>
  </div>
  <table style="width:100%;font-size:13px;border-collapse:collapse;">
    <tr><td style="padding:4px 8px;color:#9ca3af;width:100px;">Type</td><td style="padding:4px 8px;color:#fbbf24;">${opts.errorType}</td></tr>
    <tr><td style="padding:4px 8px;color:#9ca3af;">Route</td><td style="padding:4px 8px;">${opts.method || ""} ${opts.route || "unknown"}</td></tr>
    ${opts.userId ? `<tr><td style="padding:4px 8px;color:#9ca3af;">User ID</td><td style="padding:4px 8px;">${opts.userId}</td></tr>` : ""}
    <tr><td style="padding:4px 8px;color:#9ca3af;vertical-align:top;">Message</td><td style="padding:4px 8px;color:#f87171;">${opts.message}</td></tr>
  </table>
  ${stackLines ? `<pre style="margin-top:16px;padding:12px;background:#060d18;border-radius:4px;font-size:11px;color:#d1d5db;overflow-x:auto;white-space:pre-wrap;">${stackLines}</pre>` : ""}
  <p style="margin-top:12px;font-size:11px;color:#6b7280;">Nexus247.ai — Production Error Alert</p>
</div>`;

    await client.emails.send({
      from: FALLBACK_FROM,
      to: "jamie@mrfgrant.com",
      subject: `[Nexus247 ALERT] ${opts.errorType} — ${opts.method || ""} ${opts.route || "server"} — ${ts}`,
      html,
    });
  } catch (err) {
    console.error("[email] Failed to send error alert:", err);
  }
}

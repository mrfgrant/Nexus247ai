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

export async function sendWelcomeEmail(toEmail: string, rankTitle: string, lastName: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    const html = buildWelcomeEmailHtml(rankTitle, lastName);

    const result = await client.emails.send({
      from: fromEmail || "Nexus247 <noreply@nexus247.ai>",
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

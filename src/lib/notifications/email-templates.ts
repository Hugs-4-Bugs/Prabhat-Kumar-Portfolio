/**
 * Email Templates — Phase 6
 * Responsive HTML templates for meeting confirmation emails.
 * Mobile-compatible, dark/light aware via inline styles.
 */

import type { MeetingEmailData } from "./email-types";

const BRAND_COLOR = "#7877C6";
const BRAND_NAME  = "QuantumAI";
const OWNER_NAME  = "Prabhat Kumar";

function formatDateTime(date: string, time: string, tz: string): string {
  try {
    const iso = `${date}T${time}:00`;
    const d = new Date(iso);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return `${date} at ${time} (${tz})`;
  }
}

function shell(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${BRAND_NAME}</title>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:#0d0d1a;font-family:Arial,Helvetica,sans-serif;">
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d1a;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#13132a;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,0.08);">
        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#1a1a3e,#13132a);padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
          <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">${BRAND_NAME}</div>
          <div style="font-size:11px;color:rgba(255,255,255,0.35);margin-top:4px;text-transform:uppercase;letter-spacing:2px;">powered by ${OWNER_NAME}</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
          <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.25);line-height:1.6;">
            This email was sent by ${BRAND_NAME} on behalf of ${OWNER_NAME}.<br/>
            prabhat.online
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function badge(text: string): string {
  return `<span style="display:inline-block;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;background:rgba(120,119,198,0.15);color:${BRAND_COLOR};border:1px solid rgba(120,119,198,0.3);">${text}</span>`;
}

function button(href: string, label: string, bg = BRAND_COLOR): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 24px;border-radius:10px;background:${bg};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;margin:4px;">${label}</a>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:12px;color:rgba(255,255,255,0.4);width:130px;vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.05);">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:rgba(255,255,255,0.85);vertical-align:top;border-bottom:1px solid rgba(255,255,255,0.05);">${value}</td>
  </tr>`;
}

// ── Visitor confirmation email ─────────────────────────────────────────────

export function buildVisitorConfirmationHtml(d: MeetingEmailData): string {
  const dt = formatDateTime(d.preferredDate, d.preferredTime, d.timezone);
  const content = `
    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">${badge("Meeting Confirmed")}</p>
    <h1 style="margin:16px 0 8px;font-size:22px;color:#ffffff;font-weight:700;">Your meeting is confirmed, ${d.visitorFirstName}!</h1>
    <p style="margin:0 0 28px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;">
      ${OWNER_NAME} is looking forward to speaking with you. Here are your meeting details:
    </p>
    <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;padding:4px 16px;margin-bottom:24px;">
      ${row("Date & Time", dt)}
      ${row("Timezone", d.timezone)}
      ${row("Duration", `${d.durationMinutes} minutes`)}
      ${row("Meeting ID", d.meetingId)}
    </table>
    <div style="text-align:center;margin:24px 0;">
      ${d.meetLink ? button(d.meetLink, "🎥 Join Google Meet") : ""}
      ${d.htmlLink ? button(d.htmlLink, "📅 View Calendar Event", "#2c2c5e") : ""}
    </div>
    <p style="margin:24px 0 0;font-size:12px;color:rgba(255,255,255,0.3);text-align:center;">
      If you need to make any changes, please reply to this email.
    </p>
  `;
  return shell(content, `Your meeting with ${OWNER_NAME} on ${d.preferredDate} is confirmed.`);
}

export function buildVisitorConfirmationText(d: MeetingEmailData): string {
  const dt = formatDateTime(d.preferredDate, d.preferredTime, d.timezone);
  return [
    `Meeting Confirmed — ${BRAND_NAME}`,
    ``,
    `Hi ${d.visitorFirstName},`,
    `Your meeting with ${OWNER_NAME} is confirmed.`,
    ``,
    `Date & Time : ${dt}`,
    `Timezone    : ${d.timezone}`,
    `Duration    : ${d.durationMinutes} minutes`,
    `Meeting ID  : ${d.meetingId}`,
    d.meetLink ? `Google Meet : ${d.meetLink}` : "",
    d.htmlLink ? `Calendar    : ${d.htmlLink}` : "",
  ].filter((l) => l !== undefined).join("\n");
}

// ── Owner notification email ───────────────────────────────────────────────

export function buildOwnerNotificationHtml(d: MeetingEmailData): string {
  const dt = formatDateTime(d.preferredDate, d.preferredTime, d.timezone);
  const content = `
    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">${badge("New Meeting Request")}</p>
    <h1 style="margin:16px 0 8px;font-size:20px;color:#ffffff;font-weight:700;">New meeting scheduled</h1>
    <p style="margin:0 0 24px;font-size:14px;color:rgba(255,255,255,0.55);line-height:1.6;">
      A visitor has booked a meeting through QuantumAI.
    </p>
    <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;padding:4px 16px;margin-bottom:20px;">
      ${row("Name", `${d.visitorFirstName} ${d.visitorLastName}`)}
      ${row("Email", `<a href="mailto:${d.visitorEmail}" style="color:${BRAND_COLOR};text-decoration:none;">${d.visitorEmail}</a>`)}
      ${row("Phone", `${d.visitorPhone}`)}
      ${d.visitorCompany ? row("Company", d.visitorCompany) : ""}
      ${d.visitorRole ? row("Role", d.visitorRole) : ""}
    </table>
    <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(255,255,255,0.03);border-radius:12px;padding:4px 16px;margin-bottom:20px;">
      ${row("Date & Time", dt)}
      ${row("Timezone", d.timezone)}
      ${row("Duration", `${d.durationMinutes} minutes`)}
      ${row("Meeting ID", d.meetingId)}
    </table>
    <table cellpadding="0" cellspacing="0" width="100%" style="background:rgba(120,119,198,0.05);border-radius:12px;padding:4px 16px;margin-bottom:24px;border:1px solid rgba(120,119,198,0.2);">
      ${row("Reason", d.reasonSummary)}
    </table>
    <div style="text-align:center;margin:20px 0;">
      ${d.meetLink ? button(d.meetLink, "🎥 Join Google Meet") : ""}
      ${d.htmlLink ? button(d.htmlLink, "📅 View Calendar Event", "#2c2c5e") : ""}
    </div>
  `;
  return shell(content, `New meeting: ${d.visitorFirstName} ${d.visitorLastName} — ${d.preferredDate}`);
}

export function buildOwnerNotificationText(d: MeetingEmailData): string {
  const dt = formatDateTime(d.preferredDate, d.preferredTime, d.timezone);
  return [
    `New Meeting — ${BRAND_NAME}`,
    ``,
    `Visitor    : ${d.visitorFirstName} ${d.visitorLastName}`,
    `Email      : ${d.visitorEmail}`,
    `Phone      : ${d.visitorPhone}`,
    d.visitorCompany ? `Company    : ${d.visitorCompany}` : "",
    d.visitorRole    ? `Role       : ${d.visitorRole}` : "",
    ``,
    `Date & Time: ${dt}`,
    `Timezone   : ${d.timezone}`,
    `Duration   : ${d.durationMinutes} minutes`,
    `Meeting ID : ${d.meetingId}`,
    ``,
    `Reason     : ${d.reasonSummary}`,
    ``,
    d.meetLink ? `Google Meet: ${d.meetLink}` : "",
    d.htmlLink ? `Calendar   : ${d.htmlLink}` : "",
  ].filter((l) => l !== undefined).join("\n");
}

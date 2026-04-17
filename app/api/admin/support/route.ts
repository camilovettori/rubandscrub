import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import {
  createSupportRequest,
  getMonthlySupportRequestUsage,
  SUPPORT_REQUEST_EMAIL,
  SUPPORT_REQUEST_MONTHLY_LIMIT,
  SUPPORT_REQUEST_PROJECT_KEY,
} from "@/lib/support-requests";
import { adminApiUnauthorizedResponse, getAdminAuthStatus } from "@/lib/auth/admin";

type SupportRequestBody = {
  subject?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildSupportEmailHtml(subject: string, message: string, requesterEmail: string) {
  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a">
      <h1 style="font-size:20px;margin:0 0 16px;">New support request</h1>
      <p style="margin:0 0 16px;">A new support request was submitted from the Rub &amp; Scrub admin area.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:0 0 18px;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#475569;width:28%;">Project</td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(
            SUPPORT_REQUEST_PROJECT_KEY
          )}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#475569;width:28%;">Subject</td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">${escapeHtml(
            subject
          )}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#475569;width:28%;vertical-align:top;">Message</td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;white-space:pre-wrap;">${escapeHtml(
            message
          )}</td>
        </tr>
        <tr>
          <td style="padding:10px 0 0;color:#475569;width:28%;">Submitted by</td>
          <td style="padding:10px 0 0;font-weight:600;">${escapeHtml(requesterEmail || "Unknown")}</td>
        </tr>
      </table>
      <p style="margin:0;">The monthly support limit is ${SUPPORT_REQUEST_MONTHLY_LIMIT} requests.</p>
    </div>
  `;
}

function buildSupportEmailText(subject: string, message: string, requesterEmail: string) {
  return [
    "New support request",
    "",
    `Project: ${SUPPORT_REQUEST_PROJECT_KEY}`,
    `Subject: ${subject}`,
    "",
    "Message:",
    message,
    "",
    `Submitted by: ${requesterEmail || "Unknown"}`,
    `Monthly support limit: ${SUPPORT_REQUEST_MONTHLY_LIMIT} requests`,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getAdminAuthStatus();

    if (!auth.authorized) {
      return adminApiUnauthorizedResponse(auth.reason);
    }

    const body = (await request.json()) as SupportRequestBody;
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!subject || !message) {
      return NextResponse.json(
        {
          error: "Please add both a subject and a message before sending the support request.",
        },
        { status: 400 }
      );
    }

    const usage = await getMonthlySupportRequestUsage();

    if (usage.usedThisMonth >= SUPPORT_REQUEST_MONTHLY_LIMIT) {
      return NextResponse.json(
        {
          error:
            "Your monthly support request limit has been reached. For urgent issues, contact hello@ziffera.ie or WhatsApp 0830483222.",
          usage,
        },
        { status: 429 }
      );
    }

    let supportRequest: Awaited<ReturnType<typeof createSupportRequest>>;

    try {
      supportRequest = await createSupportRequest({
        subject,
        message,
      });
    } catch (error) {
      console.error("Support request failed while saving the request:", {
        error,
        subject,
        projectKey: SUPPORT_REQUEST_PROJECT_KEY,
      });
      throw error;
    }

    try {
      await sendEmail({
        to: SUPPORT_REQUEST_EMAIL,
        subject: `[Rub & Scrub Support] ${subject}`,
        text: buildSupportEmailText(subject, message, auth.email),
        html: buildSupportEmailHtml(subject, message, auth.email),
      });
    } catch (error) {
      console.error("Support request failed while sending the email:", {
        error,
        subject,
        supportEmail: SUPPORT_REQUEST_EMAIL,
        requesterEmail: auth.email,
      });
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        supportRequest,
        usage: {
          usedThisMonth: usage.usedThisMonth + 1,
          limit: SUPPORT_REQUEST_MONTHLY_LIMIT,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Support request error:", error);
    return NextResponse.json(
      { error: "Unable to send the support request right now. Please try again." },
      { status: 500 }
    );
  }
}

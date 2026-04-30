import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email/resend";
import { getSiteSettings } from "@/lib/site-settings";

const allowedServices = ["Mini Valet", "Gold Valet", "Full Valet"];

type BookingRequestBody = {
  fullName?: string;
  phone?: string;
  email?: string;
  houseStreet?: string;
  address?: string;
  eircode?: string;
  service?: string;
  carModel?: string;
  extras?: string[];
  selectedExtras?: string[];
  notes?: string;
};

type BookingRequestDetails = {
  fullName: string;
  phone: string;
  email: string;
  houseStreet: string;
  address: string;
  eircode: string;
  service: string;
  carModel: string;
  extras: string[];
  notes: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeList(value: string[] | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => item.trim()).filter(Boolean);
}

function buildSummaryLines(details: BookingRequestDetails) {
  return [
    `Name: ${details.fullName}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Address: ${details.houseStreet}, ${details.address}`,
    `Eircode: ${details.eircode || "None provided"}`,
    `Service: ${details.service}`,
    `Car model: ${details.carModel}`,
    `Extras: ${details.extras.length > 0 ? details.extras.join(", ") : "None"}`,
    `Notes: ${details.notes || "None provided"}`,
  ];
}

function buildCustomerEmailHtml(details: BookingRequestDetails) {
  const summary = buildSummaryLines(details)
    .map(
      (line) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#475569;font-size:13px;line-height:1.5;width:42%;vertical-align:top;">
            ${escapeHtml(line.split(": ")[0])}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:13px;line-height:1.5;font-weight:600;vertical-align:top;">
            ${escapeHtml(line.slice(line.indexOf(": ") + 2))}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div style="margin:0;padding:0;background:#f3f7fc;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#f3f7fc;margin:0;padding:24px 12px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;margin:0 auto;">
              <tr>
                <td style="padding:0 0 16px;text-align:center;">
                  <img
                    src="https://www.rubandscrub.ie/images/logos.png"
                    width="170"
                    alt="Rub & Scrub Mobile Valeting Dublin logo"
                    style="display:block;margin:0 auto 4px;max-width:170px;width:170px;height:auto;border:0;outline:none;text-decoration:none;"
                  />
                </td>
              </tr>
              <tr>
                <td style="background:#ffffff;border:1px solid #dbe4f0;border-radius:18px;padding:32px 28px;font-family:Arial,Helvetica,sans-serif;">
                  <h1 style="margin:0 0 14px;font-size:24px;line-height:1.2;color:#0f172a;font-weight:700;text-align:center;">
                    Booking request received
                  </h1>
                  <p style="margin:0 auto 22px;max-width:520px;font-size:15px;line-height:1.7;color:#334155;text-align:center;">
                    Thanks for choosing Rub &amp; Scrub. We’ve received your valet request and our team will contact you shortly to confirm the booking.
                  </p>

                  <div style="border:1px solid #dbe4f0;border-radius:14px;overflow:hidden;background:#f8fbff;">
                    <div style="padding:14px 16px;border-bottom:1px solid #dbe4f0;background:#eef4fb;font-size:13px;line-height:1.4;font-weight:700;letter-spacing:0.02em;color:#0f172a;">
                      Booking summary
                    </div>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;padding:0 16px 4px;border-collapse:collapse;">
                      ${summary}
                    </table>
                  </div>

                  <p style="margin:20px 0 0;font-size:13px;line-height:1.6;color:#475569;text-align:center;">
                    This email confirms receipt of your request, not a confirmed appointment.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 12px 0;text-align:center;font-family:Arial,Helvetica,sans-serif;color:#475569;">
                  <p style="margin:0;font-size:14px;line-height:1.6;font-weight:700;color:#0f172a;">Rub &amp; Scrub</p>
                  <p style="margin:3px 0 0;font-size:13px;line-height:1.6;">Mobile Car Valeting in Dublin</p>
                  <p style="margin:3px 0 0;font-size:13px;line-height:1.6;">
                    <a href="https://www.rubandscrub.ie" style="color:#2563eb;text-decoration:none;">https://www.rubandscrub.ie</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function buildCustomerPlainTextMessage(details: BookingRequestDetails) {
  return [
    "Booking request received",
    "",
    "Thanks for choosing Rub & Scrub. We’ve received your valet request and our team will contact you shortly to confirm the booking.",
    "",
    ...buildSummaryLines(details),
    "",
    "This email confirms receipt of your request, not a confirmed appointment.",
    "",
    "Rub & Scrub",
    "Mobile Car Valeting in Dublin",
    "https://www.rubandscrub.ie",
  ].join("\n");
}

function buildHtmlMessage(title: string, intro: string, details: BookingRequestDetails) {
  const summary = buildSummaryLines(details)
    .map((line) => `<li style="margin:0 0 8px;">${escapeHtml(line)}</li>`)
    .join("");

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;line-height:1.6;color:#0f172a">
      <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(title)}</h1>
      <p style="margin:0 0 16px;">${escapeHtml(intro)}</p>
      <ul style="padding-left:20px;margin:0 0 16px;">${summary}</ul>
      <p style="margin:0;">This is an acknowledgement only. We will contact the customer shortly by WhatsApp or phone to confirm the visit.</p>
    </div>
  `;
}

function buildPlainTextMessage(title: string, intro: string, details: BookingRequestDetails) {
  return [
    title,
    "",
    intro,
    "",
    ...buildSummaryLines(details),
    "",
    "This is an acknowledgement only. We will contact the customer shortly by WhatsApp or phone to confirm the visit.",
  ].join("\n");
}

function parseBookingDetails(body: BookingRequestBody): BookingRequestDetails | null {
  const fullName = body.fullName?.trim();
  const phone = body.phone?.trim();
  const email = body.email?.trim();
  const houseStreet = body.houseStreet?.trim();
  const address = body.address?.trim();
  const service = body.service?.trim() ?? "";
  const carModel = body.carModel?.trim();
  const eircode = body.eircode?.trim() ?? "";
  const notes = body.notes?.trim() ?? "";
  const extras = normalizeList(body.extras ?? body.selectedExtras);

  if (
    !fullName ||
    !phone ||
    !email ||
    !houseStreet ||
    !address ||
    !allowedServices.includes(service) ||
    !carModel
  ) {
    return null;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return null;
  }

  return {
    fullName,
    phone,
    email,
    houseStreet,
    address,
    eircode,
    service,
    carModel,
    extras,
    notes,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as BookingRequestBody;
    const details = parseBookingDetails(body);
    const siteSettings = await getSiteSettings();

    if (!details) {
      return NextResponse.json(
        {
          error:
            "Please complete your name, phone, email, address, service, and car model before submitting.",
        },
        { status: 400 }
      );
    }

    await sendEmail({
      to: details.email,
      subject: "Booking request received",
      text: buildCustomerPlainTextMessage(details),
      html: buildCustomerEmailHtml(details),
      replyTo: siteSettings.notification_email || undefined,
    });

    let internalNotificationSent = false;

    if (siteSettings.notification_email.trim()) {
      try {
        await sendEmail({
          to: siteSettings.notification_email,
          subject: `New Rub & Scrub booking request from ${details.fullName}`,
          text: buildPlainTextMessage(
            "New booking request",
            "A new booking request was submitted through the website.",
            details
          ),
          html: buildHtmlMessage(
            "New booking request",
            "A new booking request was submitted through the website.",
            details
          ),
        });
        internalNotificationSent = true;
      } catch (error) {
        console.error("Internal booking notification failed:", error);
      }
    }

    return NextResponse.json(
      {
        success: true,
        internalNotificationSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking email error:", error);
    return NextResponse.json(
      { error: "Unable to send the confirmation email right now. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { defaultSiteSettings, normalizeReviewAliasPath } from "@/lib/site-settings";
import { adminApiUnauthorizedResponse, getAdminAuthStatus } from "@/lib/auth/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function isValidEmail(value: string) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await getAdminAuthStatus();

    if (!auth.authorized) {
      return adminApiUnauthorizedResponse(auth.reason);
    }

    const body = (await request.json()) as {
      whatsapp_number?: string;
      notification_email?: string;
      review_path?: string;
    };

    const whatsappNumber = body.whatsapp_number?.trim() ?? "";
    const notificationEmail = body.notification_email?.trim() ?? "";
    const supabase = createSupabaseServerClient();

    const { data: existingSettings, error: readError } = await supabase
      .from("site_settings")
      .select("id,review_path")
      .limit(1)
      .maybeSingle();

    if (readError) {
      console.error("Site settings read error:", readError);
    }

    const reviewPath = body.review_path
      ? normalizeReviewAliasPath(body.review_path)
      : existingSettings?.review_path ?? defaultSiteSettings.review_path;

    if (!whatsappNumber) {
      return NextResponse.json({ error: "WhatsApp number is required." }, { status: 400 });
    }

    if (!isValidEmail(notificationEmail)) {
      return NextResponse.json({ error: "Notification email is invalid." }, { status: 400 });
    }

    const settingsPayload = {
      whatsapp_number: whatsappNumber,
      notification_email: notificationEmail,
      review_path: reviewPath,
      updated_at: new Date().toISOString(),
    };

    const writeResult = existingSettings?.id
      ? await supabase
          .from("site_settings")
          .update(settingsPayload)
          .eq("id", existingSettings.id)
          .select("id")
          .single()
      : await supabase.from("site_settings").insert(settingsPayload).select("id").single();

    const { error: writeError } = writeResult;

    if (writeError) {
      console.error("Site settings upsert error:", writeError);
      return NextResponse.json(
        { error: "Unable to save site settings right now." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Site settings save error:", error);
    return NextResponse.json(
      { error: "Unable to save site settings right now." },
      { status: 500 }
    );
  }
}

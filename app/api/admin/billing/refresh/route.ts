import { NextResponse } from "next/server";
import { adminApiUnauthorizedResponse, getAdminAuthStatus } from "@/lib/auth/admin";
import { syncBillingSubscriptionSnapshot } from "@/lib/billing-subscriptions";

export async function POST() {
  try {
    const auth = await getAdminAuthStatus();

    if (!auth.authorized) {
      return adminApiUnauthorizedResponse(auth.reason);
    }

    const snapshot = await syncBillingSubscriptionSnapshot();

    return NextResponse.json(
      {
        success: true,
        snapshot,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Billing snapshot refresh error:", error);

    return NextResponse.json(
      {
        error: "Unable to refresh the billing snapshot right now.",
      },
      { status: 500 }
    );
  }
}

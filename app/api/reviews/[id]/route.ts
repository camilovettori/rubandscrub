import { NextRequest, NextResponse } from "next/server";
import { adminApiUnauthorizedResponse, getAdminAuthStatus } from "@/lib/auth/admin";
import { deleteReview, updateReviewStatus, type ReviewStatus } from "@/lib/reviews";

const allowedStatuses: ReviewStatus[] = ["pending", "approved", "rejected"];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await getAdminAuthStatus();

    if (!auth.authorized) {
      return adminApiUnauthorizedResponse(auth.reason);
    }

    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    if (!id) {
      return NextResponse.json({ error: "Missing review id." }, { status: 400 });
    }

    if (!body.status || !allowedStatuses.includes(body.status as ReviewStatus)) {
      return NextResponse.json(
        { error: "Invalid review status." },
        { status: 400 }
      );
    }

    const review = await updateReviewStatus(id, body.status as ReviewStatus);

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Review moderation error:", error);
    return NextResponse.json(
      { error: "Unable to update review status right now." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const auth = await getAdminAuthStatus();

    if (!auth.authorized) {
      return adminApiUnauthorizedResponse(auth.reason);
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing review id." }, { status: 400 });
    }

    await deleteReview(id);

    return NextResponse.json(
      {
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete review right now.";

    if (message === "Review not found.") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error("Review delete error:", error);
    return NextResponse.json(
      { error: "Unable to delete review right now." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createReview, type ReviewSubmission } from "@/lib/reviews";
import { getSiteSettings } from "@/lib/site-settings";

function parseRating(value: unknown) {
  const rating = typeof value === "string" ? Number(value) : typeof value === "number" ? value : null;

  return rating !== null && Number.isInteger(rating) && rating >= 1 && rating <= 5
    ? rating
    : null;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ReviewSubmission> & {
      rating?: unknown;
    };

    const name = body.name?.trim();
    const areaLocation = body.areaLocation?.trim();
    const reviewText = body.reviewText?.trim();
    const rating = parseRating(body.rating);

    if (!name || !areaLocation || !reviewText || rating === null) {
      return NextResponse.json(
        {
          error:
            "Please include your name, area/location, rating, and review text before submitting.",
        },
        { status: 400 }
      );
    }

    const review = await createReview({
      name,
      areaLocation,
      rating,
      reviewText,
      consent: body.consent !== false,
    });

    const siteSettings = await getSiteSettings();

    return NextResponse.json(
      {
        success: true,
        review,
        reviewLink: siteSettings.review_path,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Unable to submit your review right now. Please try again." },
      { status: 500 }
    );
  }
}

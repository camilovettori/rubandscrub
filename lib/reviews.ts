import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewRow = {
  id: string;
  name: string;
  area_location: string;
  rating: number;
  review_text: string;
  consent: boolean;
  status: ReviewStatus;
  created_at: string;
};

export type ReviewCard = {
  id: string;
  name: string;
  areaLocation: string;
  rating: number;
  reviewText: string;
  createdAt: string;
};

export type AdminReviewCard = ReviewCard & {
  consent: boolean;
  status: ReviewStatus;
};

export type ReviewSubmission = {
  name: string;
  areaLocation: string;
  rating: number;
  reviewText: string;
  consent: boolean;
};

export const featuredApprovedReviews: ReviewCard[] = [
  {
    id: "featured-sarah-murphy",
    name: "Sarah Murphy",
    areaLocation: "Dublin 4",
    rating: 5,
    reviewText:
      "Amazing service. The team arrived on time and left my car looking brand new. I will definitely book again.",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "featured-john-kelly",
    name: "John Kelly",
    areaLocation: "Dublin 15",
    rating: 5,
    reviewText:
      "Convenient mobile service that fits my busy schedule. Professional work and great value for money.",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "featured-emma-byrne",
    name: "Emma Byrne",
    areaLocation: "Dublin 6",
    rating: 5,
    reviewText:
      "Outstanding attention to detail. My car has never looked this good. Highly recommend.",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

function mapReviewRow(row: ReviewRow): ReviewCard {
  return {
    id: row.id,
    name: row.name,
    areaLocation: row.area_location,
    rating: row.rating,
    reviewText: row.review_text,
    createdAt: row.created_at,
  };
}

function mapAdminReviewRow(row: ReviewRow): AdminReviewCard {
  return {
    ...mapReviewRow(row),
    consent: row.consent,
    status: row.status,
  };
}

export async function getApprovedReviews() {
  try {
    noStore();
    const approvedReviews = await getReviewsByStatus("approved");
    const publicApprovedReviews = approvedReviews.map((review) => ({
      id: review.id,
      name: review.name,
      areaLocation: review.areaLocation,
      rating: review.rating,
      reviewText: review.reviewText,
      createdAt: review.createdAt,
    }));

    return publicApprovedReviews.length > 0 ? publicApprovedReviews : featuredApprovedReviews;
  } catch {
    return featuredApprovedReviews;
  }
}

export async function getReviewsByStatus(status: ReviewStatus, limit?: number) {
  noStore();
  const supabase = createSupabaseServerClient();
  let query = supabase
    .from("reviews")
    .select("id,name,area_location,rating,review_text,consent,status,created_at")
    .eq("status", status)
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapAdminReviewRow(row as ReviewRow));
}

export async function getAllReviews() {
  noStore();
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id,name,area_location,rating,review_text,consent,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => mapAdminReviewRow(row as ReviewRow));
}

export async function getPendingReviews(limit = 3) {
  noStore();
  return getReviewsByStatus("pending", limit);
}

export async function createReview(submission: ReviewSubmission) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: submission.name,
      area_location: submission.areaLocation,
      rating: submission.rating,
      review_text: submission.reviewText,
      consent: submission.consent,
      status: "pending",
    })
    .select("id,name,area_location,rating,review_text,consent,status,created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapReviewRow(data as ReviewRow);
}

export async function updateReviewStatus(reviewId: string, status: ReviewStatus) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId)
    .select("id,name,area_location,rating,review_text,consent,status,created_at")
    .single();

  if (error) {
    throw error;
  }

  return mapReviewRow(data as ReviewRow);
}

export async function deleteReview(reviewId: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .select("id");

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error("Review not found.");
  }

  return reviewId;
}

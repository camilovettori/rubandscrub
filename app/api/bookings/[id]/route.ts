import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type BookingStatus = Database["public"]["Tables"]["bookings"]["Row"]["status"];

const allowedStatuses: BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const body = (await request.json()) as { status?: string };
    const { id: bookingId } = await params;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing booking id." }, { status: 400 });
    }

    if (!body.status || !allowedStatuses.includes(body.status as BookingStatus)) {
      return NextResponse.json(
        {
          error:
            "Invalid status. Allowed values: pending, confirmed, completed, cancelled.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: body.status as BookingStatus })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);

      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Booking not found." }, { status: 404 });
      }

      return NextResponse.json(
        { error: "Failed to update booking status." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        booking: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

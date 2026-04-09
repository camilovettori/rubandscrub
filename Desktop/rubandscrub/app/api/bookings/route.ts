import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Server-side validation
    const requiredFields = [
      "fullName",
      "phone",
      "email",
      "houseNumber",
      "address",
      "service",
      "carModel",
      "preferredDate",
      "timeSlot",
    ];

    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Create Supabase client
    const supabase = createSupabaseServerClient();

    // Transform form data to database schema
    const bookingData = {
      full_name: body.fullName,
      phone: body.phone,
      email: body.email,
      house_street: body.houseNumber,
      address: body.address,
      eircode: body.eircode || "",
      service_type: body.service,
      car_model: body.carModel,
      selected_extras: body.selectedExtras || [],
      preferred_date: body.preferredDate,
      preferred_time_slot: body.timeSlot,
      notes: body.notes || null,
      status: "pending",
    } satisfies Database["public"]["Tables"]["bookings"]["Insert"];

    // Insert booking into Supabase
    const { data, error } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create booking. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Booking request received successfully",
        bookingId: data?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

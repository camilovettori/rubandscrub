import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerSessionClient } from "@/lib/supabase/ssr";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerSessionClient();
  await supabase.auth.signOut();

  return NextResponse.redirect(new URL("/admin/login", request.url));
}

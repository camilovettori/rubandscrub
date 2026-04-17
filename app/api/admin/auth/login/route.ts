import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerSessionClient } from "@/lib/supabase/ssr";
import { isAdminEmail } from "@/lib/auth/admin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const loginUrl = new URL("/admin/login", request.url);

  if (!email || !password) {
    loginUrl.searchParams.set("error", "unauthenticated");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = await createSupabaseServerSessionClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    loginUrl.searchParams.set("error", "unauthenticated");
    return NextResponse.redirect(loginUrl);
  }

  if (!isAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    loginUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL("/admin", request.url));
}

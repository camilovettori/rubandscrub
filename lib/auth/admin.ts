import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerSessionClient } from "@/lib/supabase/ssr";

export type AdminAuthStatus =
  | {
      authorized: true;
      user: User;
      email: string;
    }
  | {
      authorized: false;
      reason: "unauthenticated" | "forbidden";
    };

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function getAdminEmails() {
  const rawEmails = process.env.ADMIN_EMAILS ?? "";

  return rawEmails
    .split(/[\s,]+/)
    .map(normalizeEmail)
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const allowedEmails = new Set(getAdminEmails());
  return allowedEmails.has(normalizeEmail(email));
}

export async function getAdminAuthStatus(): Promise<AdminAuthStatus> {
  noStore();

  const supabase = await createSupabaseServerSessionClient();
  const { data, error } = await supabase.auth.getUser();
  const user = data.user;
  const email = user?.email ? normalizeEmail(user.email) : "";

  if (error || !user || !email) {
    return {
      authorized: false,
      reason: "unauthenticated",
    };
  }

  if (!isAdminEmail(email)) {
    return {
      authorized: false,
      reason: "forbidden",
    };
  }

  return {
    authorized: true,
    user,
    email,
  };
}

export async function requireAdminPage() {
  const auth = await getAdminAuthStatus();

  if (!auth.authorized) {
    redirect(`/admin/login?error=${auth.reason}`);
  }

  return auth;
}

export function adminApiUnauthorizedResponse(reason: "unauthenticated" | "forbidden") {
  return NextResponse.json(
    {
      error:
        reason === "unauthenticated"
          ? "Authentication required."
          : "You are not allowed to access this area.",
    },
    { status: reason === "unauthenticated" ? 401 : 403 }
  );
}

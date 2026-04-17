import { NextRequest, NextResponse } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/ssr";
import { isAdminEmail } from "@/lib/auth/admin";

function isAdminAuthPath(pathname: string) {
  return (
    pathname === "/admin/login" ||
    pathname === "/api/admin/auth/login" ||
    pathname === "/api/admin/auth/logout"
  );
}

function buildUnauthorizedResponse(request: NextRequest, reason: "unauthenticated" | "forbidden") {
  if (request.nextUrl.pathname.startsWith("/api/")) {
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

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("error", reason);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAdminAuthPath(pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, response);
  const { data, error } = await supabase.auth.getUser();
  const email = data.user?.email?.trim().toLowerCase() ?? "";

  if (error || !data.user || !email) {
    return buildUnauthorizedResponse(request, "unauthenticated");
  }

  if (!isAdminEmail(email)) {
    return buildUnauthorizedResponse(request, "forbidden");
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};

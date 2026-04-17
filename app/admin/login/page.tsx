import { redirect } from "next/navigation";
import { getAdminAuthStatus } from "@/lib/auth/admin";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error: string | undefined) {
  switch (error) {
    case "forbidden":
      return "This account does not have access to the admin area.";
    case "unauthenticated":
      return "Please sign in to continue.";
    default:
      return "";
  }
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const auth = await getAdminAuthStatus();

  if (auth.authorized) {
    redirect("/admin");
  }

  const resolvedSearchParams = searchParams ? await searchParams : {};
  const errorMessage = getErrorMessage(resolvedSearchParams.error);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full rounded-[28px] border border-slate-200 bg-white px-6 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">Admin</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Use your approved Rub &amp; Scrub admin account to access settings and reviews.
          </p>

          <form className="mt-6 space-y-4" method="post" action="/api/admin/auth/login">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                name="password"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Sign in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

import Image from "next/image";
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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="w-full rounded-[32px] border border-slate-200/80 bg-white px-6 py-8 shadow-[0_22px_70px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
              <Image
                src="/images/logos.png"
                alt="Rub & Scrub Mobile Valeting Dublin logo"
                width={120}
                height={40}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-blue-600">
              Admin
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
              Admin sign in
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
              Access settings and reviews with your approved Rub &amp; Scrub account.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Secure access for internal site management.
          </div>

          <form className="mt-6 space-y-4" method="post" action="/api/admin/auth/login">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                name="email"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                name="password"
                required
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </label>

            {errorMessage ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_35px_-18px_rgba(37,99,235,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_18px_45px_-18px_rgba(37,99,235,0.95)]"
            >
              Sign in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

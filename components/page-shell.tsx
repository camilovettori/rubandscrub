import type { ReactNode } from "react";

type PageShellProps = {
  intro: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function PageShell({ intro, title, description, children }: PageShellProps) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="space-y-4">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-blue-400">
          {intro}
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            {description}
          </p>
        </div>
      </section>

      {children}
    </main>
  );
}

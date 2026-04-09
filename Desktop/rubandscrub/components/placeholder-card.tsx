import type { ReactNode } from "react";

type PlaceholderCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function PlaceholderCard({
  title,
  description,
  children,
}: PlaceholderCardProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-5 space-y-2">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="text-sm leading-6 text-slate-300">{description}</p>
      </div>
      {children}
    </section>
  );
}

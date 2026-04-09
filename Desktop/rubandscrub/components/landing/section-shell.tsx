import type { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
}: SectionShellProps) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-12 space-y-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto max-w-2xl text-lg leading-7 text-gray-600">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

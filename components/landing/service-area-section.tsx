import { SectionShell } from "./section-shell";

export function ServiceAreaSection() {
  return (
    <SectionShell
      id="service-area"
      eyebrow="Service Area"
      title="Mobile valeting across Dublin and surrounding areas"
      description="We come directly to your home or workplace, so you can book without needing to visit a fixed location."
    >
      <div className="grid gap-4 rounded-3xl border border-blue-400/20 bg-slate-900/70 p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <p className="max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          Rub & Scrub is a mobile car valeting service for customers in Dublin and nearby
          areas. The focus is on convenience, professionalism, and a finish that feels
          premium without feeling overdesigned.
        </p>
        <div className="rounded-2xl border border-white/10 bg-blue-500/10 px-4 py-3 text-sm font-medium text-blue-100">
          Home or workplace visits
        </div>
      </div>
    </SectionShell>
  );
}

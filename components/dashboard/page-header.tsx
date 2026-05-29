import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function PageHeader({
  title,
  eyebrow,
  description,
  action,
}: {
  title: string;
  eyebrow: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <section className="mb-8 overflow-hidden rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-glow md:p-10">
      <div className="absolute" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-indigo-200">{eyebrow}</p>
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">{description}</p>
        </div>
        {action ?? <Button variant="secondary">Export report</Button>}
      </div>
    </section>
  );
}

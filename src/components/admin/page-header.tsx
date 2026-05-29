import { Button } from "@/components/ui/button";

export function PageHeader({ title, description, primaryAction, secondaryAction }: { title: string; description: string; primaryAction?: string; secondaryAction?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="mb-2 text-sm font-bold text-orange-600">Studymini Admin</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex gap-2">
        {secondaryAction ? <Button variant="outline">{secondaryAction}</Button> : null}
        {primaryAction ? <Button>{primaryAction}</Button> : null}
      </div>
    </div>
  );
}

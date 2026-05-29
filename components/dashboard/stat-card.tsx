import { TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const toneClasses: Record<string, string> = {
  indigo: "from-indigo-500 to-violet-500",
  emerald: "from-emerald-500 to-teal-500",
  amber: "from-amber-500 to-orange-500",
  rose: "from-rose-500 to-pink-500",
};

export function StatCard({ label, value, change, tone }: { label: string; value: string; change: string; tone: string }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
          </div>
          <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg", toneClasses[tone])}>
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>
        <p className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{change}</p>
      </CardContent>
    </Card>
  );
}

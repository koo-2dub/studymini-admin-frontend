import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { salesSeries, stats } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const max = Math.max(...salesSeries.map((item) => item.revenue));
  return (
    <>
      <PageHeader eyebrow="Revenue intelligence" title="Sales analytics" description="A polished mock analytics surface for revenue, refunds, learner acquisition, and campaign conversion." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>
      <Card className="mt-6">
        <CardHeader><CardTitle>Revenue by month</CardTitle><CardDescription>Mock SaaS analytics with visual bars.</CardDescription></CardHeader>
        <CardContent className="space-y-5">
          {salesSeries.map((item) => (
            <div key={item.month} className="grid items-center gap-3 md:grid-cols-[64px_1fr_80px]">
              <span className="font-bold text-slate-500">{item.month}</span>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${(item.revenue / max) * 100}%` }} /></div>
              <span className="text-right font-black">${item.revenue}k</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </>
  );
}

import { ArrowUpRight } from "lucide-react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { alerts, members, orders, salesSeries, stats } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        eyebrow="Command center"
        title="A polished operating dashboard for every StudyMini admin workflow."
        description="Monitor revenue, users, support queues, content questions, campaigns, points, vouchers, and popup promotions from one modern SaaS workspace."
        action={<Button size="lg">Review today <ArrowUpRight className="h-4 w-4" /></Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle>Sales momentum</CardTitle>
                <CardDescription>Mock revenue and refund trend for the current year.</CardDescription>
              </div>
              <Badge>May peak</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-end gap-4 rounded-3xl bg-gradient-to-br from-slate-50 to-indigo-50 p-5">
              {salesSeries.map((item) => (
                <div key={item.month} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex w-full items-end justify-center gap-1">
                    <div className="w-7 rounded-t-2xl bg-indigo-500 shadow-glow" style={{ height: `${item.revenue * 1.1}px` }} />
                    <div className="w-4 rounded-t-2xl bg-rose-300" style={{ height: `${item.refunds * 5}px` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Operational alerts</CardTitle>
            <CardDescription>Priority mock signals for admins.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => {
              const Icon = alert.icon;
              return (
                <div key={alert.title} className="rounded-3xl border bg-white p-4 shadow-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="font-bold">{alert.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{alert.detail}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <DataTable
          title="최근 유저"
          description="주요 유저 계정과 활동 상태입니다."
          data={members.slice(0, 4)}
          columns={[
            { key: "name", header: "유저" },
            { key: "plan", header: "요금제" },
            { key: "status", header: "상태", render: (member) => <StatusBadge value={member.status} /> },
            { key: "spend", header: "결제액" },
          ]}
        />
        <DataTable
          title="Latest orders"
          description="Payment events needing admin visibility."
          data={orders}
          columns={[
            { key: "id", header: "Order" },
            { key: "member", header: "유저" },
            { key: "amount", header: "Amount" },
            { key: "status", header: "상태", render: (order) => <StatusBadge value={order.status} /> },
          ]}
        />
      </section>
    </>
  );
}

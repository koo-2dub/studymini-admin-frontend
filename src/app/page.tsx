import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { OrdersChart, RevenueChart } from "@/components/admin/mock-chart";
import { StatusBadge } from "@/components/admin/status";
import { WorkflowStates } from "@/components/admin/workflow-states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, members, orders, popups } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader title="관리자 대시보드" description="오늘 처리해야 할 매출, 주문, 문의, 학습질문을 한 화면에서 확인합니다." primaryAction="운영 리포트 내보내기" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="shadow-soft">
            <CardHeader className="pb-3"><CardTitle className="text-sm text-muted-foreground">{stat.label}</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-black">{stat.format === "currency" ? formatCurrency(stat.value) : formatNumber(stat.value)}</p>
                <span className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700"><ArrowUpRight className="h-3 w-3" />{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Card><CardHeader><CardTitle>주간 매출 추이</CardTitle></CardHeader><CardContent><RevenueChart /></CardContent></Card>
        <Card><CardHeader><CardTitle>주문 건수</CardTitle></CardHeader><CardContent><OrdersChart /></CardContent></Card>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section><h2 className="mb-3 text-lg font-black">최근 회원</h2><DataTable data={members.slice(0, 3)} columns={[{ key: "id", header: "User ID", render: (m) => m.id }, { key: "name", header: "이름", render: (m) => m.name }, { key: "status", header: "상태", render: (m) => <StatusBadge value={m.status} /> }, { key: "joined", header: "가입일", render: (m) => m.joined }]} /></section>
        <section><h2 className="mb-3 text-lg font-black">최근 주문</h2><DataTable data={orders.slice(0, 3)} columns={[{ key: "id", header: "주문번호", render: (o) => o.id }, { key: "user", header: "회원", render: (o) => o.user }, { key: "amount", header: "금액", render: (o) => formatCurrency(o.amount) }, { key: "payment", header: "결제", render: (o) => <StatusBadge value={o.payment} /> }]} /></section>
      </div>
      <div className="mt-6"><WorkflowStates /></div>
      <Card className="mt-6 border-orange-200 bg-orange-50/70">
        <CardHeader><CardTitle className="flex items-center gap-2"><MousePointerClick className="h-5 w-5 text-orange-600" />팝업 클릭률 요약</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">{popups.map((popup) => <div key={popup.id} className="rounded-2xl bg-white p-4"><p className="font-bold">{popup.title}</p><p className="mt-2 text-2xl font-black text-orange-600">{popup.ctr}</p><p className="text-xs text-muted-foreground">노출 {formatNumber(popup.impressions)} / 클릭 {formatNumber(popup.clicks)}</p></div>)}</CardContent>
      </Card>
    </AppShell>
  );
}

import { Suspense } from "react";

import { OrdersDashboard } from "@/components/dashboard/orders-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { orders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <>
      <PageHeader eyebrow="Payments" title="Orders / Payments" description="주문 목록을 확인하고 행을 클릭해 상세 화면에서 운영 정보를 관리합니다." />
      <Suspense fallback={<div className="rounded-3xl border border-white/70 bg-white/85 p-6 text-sm font-bold text-slate-600 shadow-panel">주문 목록을 불러오는 중입니다...</div>}><OrdersDashboard orders={orders} /></Suspense>
    </>
  );
}

import { Suspense } from "react";

import { OrdersDashboard } from "@/components/dashboard/orders-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { adminOrders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <>
      <PageHeader eyebrow="Payments" title="주문/결제 관리" description="주문 목록, Export, CSV 업로드, PDF 다운로드 로그를 탭별로 분리해 운영합니다." />
      <Suspense fallback={<div className="rounded-3xl bg-white/80 p-6 text-sm font-semibold text-muted-foreground">주문 관리 화면을 불러오는 중입니다.</div>}>
        <OrdersDashboard orders={adminOrders} />
      </Suspense>
    </>
  );
}

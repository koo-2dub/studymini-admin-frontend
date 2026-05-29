import { OrdersDashboard } from "@/components/dashboard/orders-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { orders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Orders · Payments"
        title="주문/결제 관리"
        description="주문 조회, 수동 주문 생성, 결제 링크, Export, CSV 업로드, 송장 업로드, PDF 다운로드 로그를 한 화면에서 처리합니다."
      />
      <OrdersDashboard orders={orders} />
    </>
  );
}

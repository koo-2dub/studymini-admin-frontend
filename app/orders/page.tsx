import { OrdersDashboard } from "@/components/dashboard/orders-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { orders } from "@/lib/mock-data";

export default function OrdersPage() {
  return (
    <>
      <PageHeader eyebrow="Payments" title="Orders / Payments" description="주문, 결제, 배송, 환불 상태를 한 화면에서 운영합니다." />
      <OrdersDashboard orders={orders} />
    </>
  );
}

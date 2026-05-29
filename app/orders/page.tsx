import { OrdersConsole } from "@/components/dashboard/orders-console";
import { PageHeader } from "@/components/dashboard/page-header";
import { orderExports, orders, pdfDownloadLogs } from "@/lib/mock-data";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;

  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Orders / Payments"
        description="검색, 필터, 목록, 상세 이동 흐름으로 운영하는 주문/결제 콘솔입니다."
      />
      <OrdersConsole activeTab={tab ?? "list"} orders={orders} exports={orderExports} pdfLogs={pdfDownloadLogs} />
    </>
  );
}

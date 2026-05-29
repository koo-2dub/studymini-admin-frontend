import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { UploadExportPanel } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function OrdersPage() {
  return <AppShell><PageHeader title="주문 / 결제 관리" description="결제상태, 환불, 영수증, 수동 주문과 결제 링크 생성을 처리합니다." primaryAction="결제 링크 생성" secondaryAction="수동 주문 생성" /><div className="mb-6"><UploadExportPanel /></div><DataTable data={orders} filters={["전체", "결제완료", "입금대기", "환불요청", "배송대기", "기간"]} columns={[{ key: "id", header: "주문번호", render: (o) => <Link className="font-bold text-orange-600" href={`/orders/${o.id}`}>{o.id}</Link> }, { key: "user", header: "회원", render: (o) => o.user }, { key: "product", header: "상품", render: (o) => o.product }, { key: "amount", header: "결제금액", render: (o) => formatCurrency(o.amount) }, { key: "payment", header: "결제상태", render: (o) => <StatusBadge value={o.payment} /> }, { key: "fulfillment", header: "처리상태", render: (o) => <StatusBadge value={o.fulfillment} /> }, { key: "actions", header: "액션", render: (o) => <div className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href={`/orders/${o.id}`}>상세</Link></Button><Button variant="outline" size="sm">영수증</Button></div> }]} /></AppShell>;
}

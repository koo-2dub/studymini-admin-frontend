import { AppShell } from "@/components/admin/app-shell";
import { ActionBar, DetailTabs } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { orders } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((item) => item.id === id) ?? orders[0];
  return <AppShell><PageHeader title={`${order.id} 주문 상세`} description="결제/환불/배송 처리와 영수증 확인을 위한 목업 상세 화면입니다." primaryAction="환불 처리" secondaryAction="영수증 보기" /><DetailTabs tabs={["주문 정보", "결제", "배송", "환불", "관리 로그"]} /><Card><CardHeader><CardTitle>{order.product}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-5"><Info label="회원" value={order.user} /><Info label="결제금액" value={formatCurrency(order.amount)} /><Info label="결제상태" value={<StatusBadge value={order.payment} />} /><Info label="처리상태" value={<StatusBadge value={order.fulfillment} />} /><Info label="생성일" value={order.created} /></CardContent></Card><div className="mt-6"><ActionBar actions={["환불 버튼 UI", "영수증 버튼 UI", "결제 링크 재발송", "확인 다이얼로그 열기", "토스트 테스트"]} /></div></AppShell>;
}
function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 font-bold">{value}</div></div>; }

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, PackageCheck, Receipt, RotateCcw } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminOrders } from "@/lib/mock-data";

const formatCurrency = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const formatDate = (value: string) => value ? value.replaceAll("-", ".") : "-";
const statusVariant = (value: string) => value.includes("완료") ? "success" : value.includes("대기") || value.includes("준비") || value.includes("배송중") ? "warning" : value.includes("실패") || value.includes("환불") ? "rose" : "slate";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = adminOrders.find((item) => item.id === id);
  if (!order) notFound();

  return (
    <>
      <PageHeader eyebrow="Order detail" title={`주문 상세 ${order.id}`} description="PDF 요구사항의 결제, 쿠폰, 포인트, 배송, 환불, 관리자 처리 정보를 별도 상세 페이지에서 확인합니다." />
      <div className="mb-5">
        <Button asChild variant="outline"><Link href="/orders"><ArrowLeft className="h-4 w-4" />주문 목록으로</Link></Button>
      </div>
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-4">
          <InfoCard label="주문번호" value={order.id} />
          <InfoCard label="주문생성일" value={formatDate(order.createdAt)} />
          <InfoCard label="주문결제일" value={formatDate(order.paidAt)} />
          <Card><CardContent className="space-y-2 pt-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">상태</p><div className="flex flex-wrap gap-2"><Badge variant={statusVariant(order.orderStatus)}>{order.orderStatus}</Badge><Badge variant={statusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge></div></CardContent></Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>주문자 / 배송 정보</CardTitle><CardDescription>User ID 클릭 시 승인된 유저 상세 화면으로 이동합니다.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Detail label="주문자 정보" value={order.memberName} />
              <Detail label="User ID" value={<Link href={`/members/${order.memberId}`} className="font-black text-indigo-700 hover:underline">{order.memberId}</Link>} />
              <Detail label="이메일" value={order.email} />
              <Detail label="전화번호" value={order.phone} />
              <Detail label="배송 주소" value={order.address} wide />
              <Detail label="배송메모" value={order.deliveryMemo || "-"} wide />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>결제 정보</CardTitle><CardDescription>지불방법, 할부, 무이자, 영수증/환불 액션을 포함합니다.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Detail label="지불방법" value={order.paymentMethod} />
              <Detail label="할부개월" value={order.installmentMonths ? `${order.installmentMonths}개월` : "일시불"} />
              <Detail label="무이자 여부" value={order.interestFree ? "무이자" : "일반"} />
              <Detail label="최종 결제금액" value={formatCurrency(order.finalAmount)} />
              <Detail label="환불금액" value={formatCurrency(order.refundAmount)} />
              <Detail label="결제 후 적립 포인트" value={`${order.earnedPoints.toLocaleString("ko-KR")}P`} />
              <div className="flex flex-wrap gap-2 md:col-span-2">
                <Button><Receipt className="h-4 w-4" />영수증 조회</Button>
                <Button variant="outline"><RotateCcw className="h-4 w-4" />환불 버튼</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>상품 / 쿠폰 / 포인트</CardTitle><CardDescription>상품 금액부터 쿠폰, 포인트, 배송비까지 계산 근거를 표시합니다.</CardDescription></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Detail label="상품명" value={order.productName} />
              <Detail label="SKU" value={order.sku} />
              <Detail label="수량" value={`${order.quantity}개`} />
              <Detail label="상품금액" value={formatCurrency(order.productAmount)} />
              <Detail label="쿠폰 코드" value={order.couponCode || "-"} />
              <Detail label="쿠폰 사용금액" value={formatCurrency(order.couponAmount)} />
              <Detail label="포인트 사용금액" value={`${order.usedPoints.toLocaleString("ko-KR")}P`} />
              <Detail label="배송비" value={formatCurrency(order.shippingFee)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>배송 / 관리자 처리</CardTitle><CardDescription>송장 등록/수정, 관리자 메모, 처리 로그를 확인합니다.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Detail label="배송상태" value={<Badge variant={statusVariant(order.shippingStatus)}>{order.shippingStatus}</Badge>} />
                <Detail label="배송회사" value={order.invoiceCompany || "-"} />
                <Detail label="송장번호" value={order.invoiceNumber || "-"} />
                <Detail label="주문상태" value={<Badge variant={statusVariant(order.orderStatus)}>{order.orderStatus}</Badge>} />
              </div>
              <Button variant="outline"><PackageCheck className="h-4 w-4" />송장 등록/수정 버튼</Button>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">관리자 메모</p><p className="mt-2 whitespace-pre-line text-sm font-semibold text-slate-800">{order.adminMemo}</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground"><FileText className="h-4 w-4" />처리 로그</p><ol className="mt-3 space-y-2 text-sm font-semibold text-slate-800">{order.processLogs.map((log) => <li key={log}>• {log}</li>)}</ol></div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) { return <Card><CardContent className="pt-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-xl font-black text-slate-950">{value}</p></CardContent></Card>; }
function Detail({ label, value, wide = false }: { label: string; value: React.ReactNode; wide?: boolean }) { return <div className={wide ? "md:col-span-2" : undefined}><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><div className="mt-1 text-sm font-semibold text-slate-900">{value}</div></div>; }

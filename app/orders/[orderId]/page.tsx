import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, RefreshCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, type AdminOrder } from "@/lib/mock-data";

export function generateStaticParams() {
  return orders.map((order) => ({ orderId: order.id }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  const order = findOrder(orderId);

  if (!order) {
    notFound();
  }

  const finalPaidAmount = Math.max(order.paymentAmount - order.refundAmount, 0);
  const refundable = order.paymentStatus === "결제완료" || order.paymentStatus === "환불요청";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/orders"><ArrowLeft className="h-4 w-4" />Orders로 돌아가기</Link>
          </Button>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">Order detail</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{order.id}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">고객, 결제, 배송, 환불, 운영 메모와 로그를 한 화면에서 확인합니다.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline"><FileText className="h-4 w-4" />영수증 조회</Button>
          <Button type="button" disabled={!refundable}><RefreshCcw className="h-4 w-4" />환불 처리</Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <SummaryTile label="주문상태" value={order.orderStatus} badge />
        <SummaryTile label="결제상태" value={order.paymentStatus} badge />
        <SummaryTile label="배송상태" value={order.shippingStatus} badge />
        <SummaryTile label="결제금액" value={formatCurrency(order.paymentAmount)} />
        <SummaryTile label="환불금액" value={formatCurrency(order.refundAmount)} tone="rose" />
        <SummaryTile label="최종 결제금액" value={formatCurrency(finalPaidAmount)} tone="indigo" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <InfoCard
            title="기본 정보"
            description="주문 생성과 상품 식별 정보입니다."
            rows={[
              ["주문번호", order.id],
              ["주문일", order.date],
              ["결제일", order.paidAt ?? "-"],
              ["주문 경로", order.orderChannel],
              ["국가", order.country],
              ["언어", order.language],
              ["상품명", order.product],
              ["SKU", order.sku],
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>고객 정보</CardTitle>
              <CardDescription>주문자와 회원 상세 연결 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              <InfoRow label="이름" value={order.member} />
              <InfoRow label="이메일" value={order.email} />
              <InfoRow label="전화번호" value={order.phone} />
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500">User ID</p>
                <Link href={`/members/${order.userId}`} className="mt-1 inline-flex items-center gap-1 font-mono text-sm font-black text-indigo-700 hover:text-indigo-900">
                  {order.userId}
                </Link>
              </div>
            </CardContent>
          </Card>

          <InfoCard
            title="결제 정보"
            description="승인 정보와 할인/배송비 반영 내역입니다."
            rows={[
              ["결제수단", order.paymentMethod],
              ["결제 승인번호", order.paymentApprovalNumber ?? "-"],
              ["PG사", order.pgProvider ?? "-"],
              ["원 결제금액", formatCurrency(order.originalAmount)],
              ["쿠폰 할인", `-${formatCurrency(order.couponDiscountAmount)}`],
              ["포인트 사용", `-${formatCurrency(order.pointUsedAmount)}`],
              ["배송비", formatCurrency(order.shippingFee)],
              ["최종 결제금액", formatCurrency(order.paymentAmount)],
            ]}
          />

          <InfoCard
            title="배송 정보"
            description="수령지, 송장, 출고/완료 정보를 확인합니다."
            rows={[
              ["배송상태", order.shippingStatus],
              ["수령인", order.recipient],
              ["전화번호", order.shippingPhone],
              ["주소", order.shippingAddress],
              ["배송메모", order.shippingMemo ?? "-"],
              ["택배사", order.courier ?? "-"],
              ["송장번호", order.invoiceNumber ?? "-"],
              ["출고일", order.shippedAt ?? "-"],
              ["배송완료일", order.deliveredAt ?? "-"],
            ]}
          />

          <Card id="refunds">
            <CardHeader>
              <CardTitle>환불 이력</CardTitle>
              <CardDescription>환불 요청, 부분/전체 환불, 처리자와 처리일을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              {order.refunds.length > 0 ? (
                <Table className="min-w-[980px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
                  <TableHeader>
                    <TableRow><TableHead>환불 요청일</TableHead><TableHead>환불 사유</TableHead><TableHead>환불 금액</TableHead><TableHead>유형</TableHead><TableHead>상태</TableHead><TableHead>처리자</TableHead><TableHead>처리일</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.refunds.map((refund) => (
                      <TableRow key={refund.id}>
                        <TableCell className="whitespace-nowrap">{refund.requestedAt}</TableCell>
                        <TableCell className="max-w-72"><p className="truncate">{refund.reason}</p></TableCell>
                        <TableCell className="whitespace-nowrap text-right font-bold text-rose-700">{formatCurrency(refund.amount)}</TableCell>
                        <TableCell>{refund.type}</TableCell>
                        <TableCell><KoreanStatusBadge value={refund.status} /></TableCell>
                        <TableCell>{refund.processor ?? "-"}</TableCell>
                        <TableCell className="whitespace-nowrap">{refund.processedAt ?? "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">환불 이력이 없습니다.</div>
              )}
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>관리자 메모</CardTitle>
              <CardDescription>운영자가 확인해야 할 내부 메모입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.adminMemos.length > 0 ? order.adminMemos.map((memo) => (
                <div key={memo.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2 text-xs font-bold text-slate-500"><span>{memo.author}</span><span>{memo.createdAt}</span></div>
                  <p className="mt-2 text-sm font-semibold text-slate-800">{memo.body}</p>
                </div>
              )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">등록된 메모가 없습니다.</p>}
              <div className="space-y-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/50 p-4">
                <textarea className="min-h-24 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none" placeholder="관리자 메모를 입력하세요. Mock UI입니다." />
                <Button type="button" className="w-full">메모 추가</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로그</CardTitle>
              <CardDescription>주문 상태, 결제, 배송, 환불 로그입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {order.logs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="slate">{log.type}</Badge>
                    <span className="text-xs font-bold text-slate-500">{log.createdAt}</span>
                  </div>
                  <p className="mt-2 text-sm font-black text-slate-900">{log.message}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">actor: {log.actor}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>
      </section>
    </div>
  );
}

function findOrder(orderId: string): AdminOrder | undefined {
  const existing = orders.find((order) => order.id === orderId);
  if (existing) return existing;
  if (!orderId.startsWith("ORD-M-")) return undefined;

  return {
    id: orderId,
    member: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    userId: "SM-1024",
    product: "교재 추가 배송",
    amount: "₩33,000",
    status: "결제대기",
    date: "2026-05-29",
    paymentAmount: 33000,
    refundAmount: 0,
    paymentStatus: "결제대기",
    orderStatus: "결제필요",
    shippingStatus: "배송전",
    couponUsed: true,
    pointsUsed: true,
    country: "KR",
    language: "ko",
    paymentMethod: "결제링크",
    sku: "BOOK-ADD-01",
    orderChannel: "관리자 생성",
    originalAmount: 35000,
    couponDiscountAmount: 3000,
    pointUsedAmount: 2000,
    shippingFee: 3000,
    pgProvider: "Mock PG",
    recipient: "김지윤",
    shippingPhone: "010-4821-1024",
    shippingAddress: "서울특별시 강남구 테헤란로 123, 8층",
    shippingMemo: "수동 주문 생성 mock 데이터",
    refunds: [],
    adminMemos: [{ id: "MEMO-MOCK-1", author: "system", createdAt: "2026-05-29 00:00", body: "수동 주문 생성 후 자동 이동 확인용 mock 상세입니다." }],
    logs: [
      { id: "LOG-MOCK-1", type: "order", message: "수동 주문 생성", actor: "admin mock", createdAt: "2026-05-29 00:00" },
      { id: "LOG-MOCK-2", type: "payment", message: "결제 링크 발급 대기", actor: "system", createdAt: "2026-05-29 00:01" },
    ],
  };
}

function SummaryTile({ label, value, badge = false, tone = "slate" }: { label: string; value: string; badge?: boolean; tone?: "slate" | "rose" | "indigo" }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <div className="mt-3">{badge ? <KoreanStatusBadge value={value} /> : <p className={tone === "rose" ? "text-2xl font-black text-rose-700" : tone === "indigo" ? "text-2xl font-black text-indigo-700" : "text-2xl font-black text-slate-950"}>{value}</p>}</div>
      </CardContent>
    </Card>
  );
}

function InfoCard({ title, description, rows }: { title: string; description: string; rows: [string, string][] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => <InfoRow key={label} label={label} value={value} />)}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function KoreanStatusBadge({ value }: { value: string }) {
  const variant = value.match(/완료|결제완료|배송완료/)
    ? "success"
    : value.match(/환불|취소|실패/)
      ? "rose"
      : value.match(/대기|접수|처리|배송중|배송전|필요/)
        ? "warning"
        : "slate";

  return <Badge variant={variant}>{value}</Badge>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

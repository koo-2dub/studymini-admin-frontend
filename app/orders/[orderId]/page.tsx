import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CreditCard, PackageCheck, RefreshCcw, Truck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  const quantity = 1;
  const finalPaidAmount = Math.max(order.paymentAmount - order.refundAmount, 0);
  const refundable = order.paymentStatus === "결제완료" || order.paymentStatus === "환불요청";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/orders"><ArrowLeft className="h-4 w-4" />주문 목록으로 돌아가기</Link>
          </Button>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-indigo-600">Order detail</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{order.id}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">주문 정보, 회원 정보, 상품 정보와 운영 정보를 상세 화면에서 확인합니다.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <KoreanStatusBadge value={order.orderStatus} />
          <KoreanStatusBadge value={order.paymentStatus} />
          <KoreanStatusBadge value={order.shippingStatus} />
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <InfoCard
            title="주문 정보"
            description="주문 진행 상태를 판단하기 위한 기본 정보입니다."
            rows={[
              ["주문번호", order.id],
              ["주문일", order.date],
              ["주문상태", order.orderStatus, "badge"],
              ["결제상태", order.paymentStatus, "badge"],
              ["배송상태", order.shippingStatus, "badge"],
            ]}
          />

          <InfoCard
            title="회원 정보"
            description="주문자와 배송지 정보를 확인합니다."
            rows={[
              ["User ID", order.userId, "memberLink"],
              ["이름", order.member],
              ["이메일", order.email],
              ["전화번호", order.phone],
              ["배송지", order.shippingAddress],
            ]}
          />

          <InfoCard
            title="상품 정보"
            description="상품, 할인, 배송비와 최종 결제금액입니다."
            rows={[
              ["상품명", order.product],
              ["SKU", order.sku],
              ["수량", `${quantity.toLocaleString()}개`],
              ["상품금액", formatCurrency(order.originalAmount)],
              ["쿠폰 할인", `-${formatCurrency(order.couponDiscountAmount)}`],
              ["포인트 사용", `-${formatCurrency(order.pointUsedAmount)}`],
              ["배송비", formatCurrency(order.shippingFee)],
              ["최종 결제금액", formatCurrency(order.paymentAmount)],
            ]}
          />
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
          <Card>
            <CardHeader>
              <CardTitle>운영 정보</CardTitle>
              <CardDescription>결제 링크, 송장, 배송, 환불 처리 진입점입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" className="w-full justify-start" variant="secondary"><CreditCard className="h-4 w-4" />결제 링크 생성</Button>
              <Button type="button" className="w-full justify-start" variant="outline"><PackageCheck className="h-4 w-4" />송장 등록</Button>
              <Button type="button" className="w-full justify-start" variant="outline"><Truck className="h-4 w-4" />배송 처리</Button>
              <Button type="button" className="w-full justify-start" variant="outline" disabled={!refundable}><RefreshCcw className="h-4 w-4" />환불 처리</Button>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-600">
                <p>택배사: <span className="font-black text-slate-900">{order.courier ?? "-"}</span></p>
                <p className="mt-2">송장번호: <span className="font-black text-slate-900">{order.invoiceNumber ?? "-"}</span></p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 메모</CardTitle>
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
                <textarea className="min-h-24 w-full rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm outline-none" placeholder="운영 메모를 입력하세요. Mock UI입니다." />
                <Button type="button" className="w-full">메모 추가</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>처리 로그</CardTitle>
              <CardDescription>주문, 결제, 배송, 환불 처리 이력입니다.</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>환불 요약</CardTitle>
              <CardDescription>환불 처리 상태와 환불 후 결제금액입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="환불금액" value={formatCurrency(order.refundAmount)} />
              <InfoRow label="환불 후 결제금액" value={formatCurrency(finalPaidAmount)} />
              {order.refunds.length > 0 ? order.refunds.map((refund) => (
                <div key={refund.id} className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm">
                  <div className="flex items-center justify-between gap-2"><KoreanStatusBadge value={refund.status} /><span className="font-black text-rose-700">{formatCurrency(refund.amount)}</span></div>
                  <p className="mt-2 font-semibold text-slate-700">{refund.reason}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{refund.requestedAt} · {refund.processor ?? "미처리"}</p>
                </div>
              )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">환불 이력이 없습니다.</p>}
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

type InfoRowData = [label: string, value: string, type?: "badge" | "memberLink"];

function InfoCard({ title, description, rows }: { title: string; description: string; rows: InfoRowData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value, type]) => <InfoRow key={label} label={label} value={value} type={type} />)}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, type }: { label: string; value: string; type?: "badge" | "memberLink" }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <div className="mt-1">
        {type === "badge" ? <KoreanStatusBadge value={value} /> : null}
        {type === "memberLink" ? (
          <Link href={`/members/${value}`} className="font-mono text-sm font-black text-indigo-700 hover:text-indigo-900">{value}</Link>
        ) : null}
        {!type ? <p className="break-words text-sm font-black text-slate-900">{value}</p> : null}
      </div>
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

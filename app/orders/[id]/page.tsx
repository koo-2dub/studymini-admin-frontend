"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Copy, ReceiptText, Undo2, UserRound } from "lucide-react";

import { OrderStatusBadge } from "@/components/dashboard/orders-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { orders } from "@/lib/mock-data";

const formatCurrency = (value: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const order = orders.find((item) => item.id === params.id);
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundType, setRefundType] = useState("전체환불");
  const [refundReason, setRefundReason] = useState("");

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-950"><ArrowLeft className="h-4 w-4" />주문 목록으로 돌아가기</Link>

      <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-glow">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-200">주문 상세</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight md:text-5xl">{order.id}</h1>
              <OrderStatusBadge value={order.orderStatus} />
              <OrderStatusBadge value={order.status} />
            </div>
            <p className="mt-4 text-slate-300">주문자 {order.member} · {order.userId} · {order.product}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => alert("Mock action: 영수증을 새 창으로 표시합니다.")}><ReceiptText className="h-4 w-4" />영수증 보기</Button>
            <Button variant="secondary" onClick={() => setRefundOpen(true)}><Undo2 className="h-4 w-4" />환불 처리</Button>
            <Button variant="secondary" onClick={() => alert("Mock action: 결제 링크가 복사되었습니다.")}><Copy className="h-4 w-4" />결제 링크 복사</Button>
            <Button variant="secondary" asChild><Link href={`/members/${order.userId}`}><UserRound className="h-4 w-4" />유저 상세 보기</Link></Button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <Summary label="최종 결제금액" value={formatCurrency(order.finalAmount)} />
        <Summary label="상품금액" value={formatCurrency(order.productAmount)} />
        <Summary label="쿠폰 할인" value={formatCurrency(order.couponAmount)} />
        <Summary label="포인트 사용" value={formatCurrency(order.pointAmount)} />
        <Summary label="배송비" value={formatCurrency(order.shippingFee)} />
        <Summary label="적립 예정 포인트" value={`${order.expectedPoints.toLocaleString()}P`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <InfoCard title="주문자 정보" description="SECTION A" rows={[["이름", order.member], ["User ID", order.userId], ["이메일", order.email], ["전화번호", order.phone], ["회원상태", order.memberStatus]]} action={<Button variant="outline" asChild><Link href={`/members/${order.userId}`}>유저 상세 보기</Link></Button>} />
        <InfoCard title="배송 정보" description="SECTION B" rows={[["수령인", order.recipient], ["전화번호", order.phone], ["주소", order.shippingAddress], ["배송메모", order.shippingMemo || "-"], ["배송회사", order.carrier || "-"], ["송장번호", order.invoiceNo || "-"], ["배송상태", order.shippingStatus]]} />
        <InfoCard title="상품 정보" description="SECTION C" rows={[["상품명", order.product], ["SKU", order.sku], ["수량", String(order.quantity)], ["상품금액", formatCurrency(order.productAmount)], ["연결된 수업/그룹", order.linkedClass]]} />
        <InfoCard title="결제 정보" description="SECTION D" rows={[["결제수단", order.paymentMethod], ["할부개월", order.installmentMonths], ["무이자 여부", order.interestFree], ["주문생성일", order.createdAt], ["결제일", order.paidAt || "-"], ["쿠폰코드", order.couponCode || "-"], ["쿠폰 사용금액", formatCurrency(order.couponAmount)], ["포인트 사용금액", formatCurrency(order.pointAmount)], ["최종 결제금액", formatCurrency(order.finalAmount)], ["적립 예정 포인트", `${order.expectedPoints.toLocaleString()}P`]]} />
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>관리자 메모</CardTitle><CardDescription>SECTION E</CardDescription></CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5"><p className="text-sm font-bold text-slate-500">내부 메모</p><p className="mt-3 whitespace-pre-line text-sm font-semibold leading-6 text-slate-900">{order.internalMemo}</p></div>
            <div className="rounded-3xl bg-slate-50 p-5"><p className="text-sm font-bold text-slate-500">처리 로그</p><ul className="mt-3 space-y-2 text-sm font-semibold text-slate-900">{order.processLogs.map((log) => <li key={log}>• {log}</li>)}</ul></div>
          </CardContent>
        </Card>
      </section>

      {refundOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg">
            <CardHeader><CardTitle>환불 처리 Confirmation Dialog</CardTitle><CardDescription>Mock action only. 확인을 눌러도 실제 환불은 실행되지 않습니다.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              <label className="block space-y-2 text-sm font-bold text-slate-600"><span>환불사유 입력</span><textarea className="min-h-28 w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" value={refundReason} onChange={(event) => setRefundReason(event.target.value)} placeholder="고객 요청, 중복 결제 등" /></label>
              <div className="grid grid-cols-2 gap-3">{["전체환불", "부분환불"].map((type) => <button key={type} onClick={() => setRefundType(type)} className={`rounded-2xl border px-4 py-3 text-sm font-black ${refundType === type ? "border-indigo-300 bg-indigo-50 text-indigo-700" : "border-slate-200 bg-white text-slate-600"}`}>{type}</button>)}</div>
              <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setRefundOpen(false)}>취소</Button><Button onClick={() => { alert(`Mock action: ${refundType} 요청이 기록되었습니다. 사유: ${refundReason || "미입력"}`); setRefundOpen(false); }}>Mock 환불 기록</Button></div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return <Card><CardContent className="p-5"><p className="text-sm font-bold text-muted-foreground">{label}</p><p className="mt-3 text-xl font-black tracking-tight">{value}</p></CardContent></Card>;
}

function InfoCard({ title, description, rows, action }: { title: string; description: string; rows: string[][]; action?: React.ReactNode }) {
  return <Card><CardHeader><div className="flex items-start justify-between gap-4"><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div>{action}</div></CardHeader><CardContent className="space-y-3">{rows.map(([label, value]) => <div key={label} className="grid gap-2 rounded-2xl bg-slate-50 px-4 py-3 text-sm sm:grid-cols-[150px_1fr]"><span className="font-bold text-slate-500">{label}</span><span className="font-semibold text-slate-950">{value}</span></div>)}</CardContent></Card>;
}

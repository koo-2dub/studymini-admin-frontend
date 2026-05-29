import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ClipboardList, CreditCard, Package, ReceiptText, Truck, UserRound, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders } from "@/lib/mock-data";

export function generateStaticParams() {
  return orders.map((order) => ({ id: order.id }));
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = orders.find((item) => item.id === id);
  if (!order) notFound();

  return (
    <>
      <PageHeader
        eyebrow="주문 상세"
        title={order.id}
        description="주문 목록에서 선택한 단일 주문의 처리 정보, 결제/환불, 배송, 로그를 확인합니다."
        action={<Button asChild variant="secondary"><Link href="/orders"><ArrowLeft className="h-4 w-4" />주문 목록으로</Link></Button>}
      />
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="주문상태" value={order.orderStatus} change="운영 처리 기준" tone="indigo" />
        <StatCard label="결제상태" value={order.paymentStatus} change={order.paidAt} tone="emerald" />
        <StatCard label="최종 결제금액" value={formatCurrency(order.paymentAmount - order.refundAmount)} change="환불 차감" tone="amber" />
        <StatCard label="배송상태" value={order.shippingStatus} change={order.invoiceNo === "미등록" ? "송장 등록 필요" : order.invoiceNo} tone="rose" />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <InfoCard icon={ReceiptText} title="주문번호" description="주문 기본 식별 정보">
          <Detail label="주문번호" value={order.id} />
          <Detail label="주문일" value={order.orderedAt} />
          <div className="flex flex-wrap gap-2 pt-2">
            <StatusBadge value={order.orderStatus} />
            <StatusBadge value={order.paymentStatus} />
            <StatusBadge value={order.shippingStatus} />
          </div>
        </InfoCard>
        <InfoCard icon={UserRound} title="주문자 정보" description="주문자 또는 User ID 클릭 시 유저 상세로 이동합니다.">
          <Detail label="주문자" value={<Link className="font-bold text-indigo-700" href={`/members/${order.memberId}`}>{order.member}</Link>} />
          <Detail label="User ID" value={<Link className="font-mono font-bold text-indigo-700" href={`/members/${order.memberId}`}>{order.memberId}</Link>} />
          <Detail label="이메일" value={order.email} />
          <Detail label="전화번호" value={order.phone} />
        </InfoCard>
        <InfoCard icon={Truck} title="배송 정보" description="배송지와 송장 상태를 관리합니다.">
          <Detail label="배송지" value={order.shippingAddress} />
          <Detail label="배송상태" value={order.shippingStatus} />
          <Detail label="송장번호" value={order.invoiceNo} />
          <div className="pt-3"><Button variant="outline">송장 등록/수정</Button></div>
        </InfoCard>
        <InfoCard icon={Package} title="상품 정보" description="주문 상품과 할인 사용 여부">
          <Detail label="상품명" value={order.product} />
          <Detail label="쿠폰사용" value={order.couponUsed ? "사용" : "미사용"} />
          <Detail label="포인트사용" value={order.pointsUsed ? "사용" : "미사용"} />
        </InfoCard>
        <InfoCard icon={CreditCard} title="결제 정보" description="결제금액, 환불금액, 최종 결제금액">
          <Detail label="결제금액" value={formatCurrency(order.paymentAmount)} />
          <Detail label="환불금액" value={formatCurrency(order.refundAmount)} />
          <Detail label="최종 결제금액" value={formatCurrency(order.paymentAmount - order.refundAmount)} />
          <Detail label="결제일" value={order.paidAt} />
        </InfoCard>
        <InfoCard icon={ClipboardList} title="환불 처리 / 관리자 메모" description="환불 검토와 내부 운영 메모">
          <Detail label="환불 처리" value={order.refundAmount > 0 || order.paymentStatus === "환불요청" ? "검토 필요" : "요청 없음"} />
          <Detail label="관리자 메모" value={order.adminMemo} />
          <div className="pt-3"><Button variant="outline">환불 처리 업데이트</Button></div>
        </InfoCard>
      </section>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>처리 로그</CardTitle>
          <CardDescription>주문 생성 이후 관리자/시스템 처리 이력입니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>시간</TableHead><TableHead>내용</TableHead></TableRow></TableHeader>
            <TableBody>
              {order.logs.map((log) => {
                const [date, time, ...message] = log.split(" ");
                return <TableRow key={log}><TableCell className="whitespace-nowrap font-mono">{date} {time}</TableCell><TableCell>{message.join(" ")}</TableCell></TableRow>;
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function InfoCard({ icon: Icon, title, description, children }: { icon: typeof ReceiptText; title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-indigo-600" />{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 rounded-2xl bg-slate-50/80 p-4 sm:grid-cols-[140px_1fr] sm:items-center">
      <span className="text-xs font-black uppercase tracking-wider text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Copy,
  CreditCard,
  Download,
  FileText,
  ListChecks,
  PackageCheck,
  PlusCircle,
  ReceiptText,
  RefreshCcw,
  RotateCcw,
  Search,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminOrder, OrderRefund } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TODAY = "2026-05-29";

type FeatureKey = "list" | "refunds" | "manual" | "payment-link" | "export" | "order-upload" | "invoice-upload" | "pdf-logs";

type OrderFilters = {
  orderId: string;
  customerQuery: string;
  product: string;
  country: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  shippingStatus: string;
  refundStatus: string;
  couponUsed: string;
  pointsUsed: string;
  startDate: string;
  endDate: string;
};

type ManualOrderFormState = {
  userId: string;
  customerName: string;
  email: string;
  customerPhone: string;
  country: string;
  language: string;
  orderChannel: string;
  paymentMethod: string;
  shippingRequired: string;
  recipient: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingMemo: string;
  selectedProduct: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  couponCode: string;
  couponAmount: number;
  pointAmount: number;
  shippingFee: number;
};

type RefundRow = OrderRefund & Pick<AdminOrder, "id" | "member" | "email" | "userId" | "product" | "paymentAmount">;

const emptyFilters: OrderFilters = {
  orderId: "",
  customerQuery: "",
  product: "all",
  country: "all",
  paymentMethod: "all",
  paymentStatus: "all",
  orderStatus: "all",
  shippingStatus: "all",
  refundStatus: "all",
  couponUsed: "all",
  pointsUsed: "all",
  startDate: "",
  endDate: "",
};

const manualProducts = [
  { id: "BIZ-KO-12W", name: "비즈니스 회화 집중반", sku: "BIZ-KO-12W", price: 229000 },
  { id: "SPA-BASIC-08W", name: "스페인어 베이직", sku: "SPA-BASIC-08W", price: 149000 },
  { id: "BOOK-ADD-01", name: "교재 추가 배송", sku: "BOOK-ADD-01", price: 35000 },
  { id: "COACH-1ON1-01", name: "1:1 코칭", sku: "COACH-1ON1-01", price: 50000 },
];

const defaultManualOrder: ManualOrderFormState = {
  userId: "SM-1024",
  customerName: "지윤 김",
  email: "jiyoon.kim@example.com",
  customerPhone: "010-4821-1024",
  country: "KR",
  language: "ko",
  orderChannel: "관리자 생성",
  paymentMethod: "결제링크",
  shippingRequired: "true",
  recipient: "김지윤",
  shippingPhone: "010-4821-1024",
  shippingAddress: "서울특별시 강남구 테헤란로 123, 8층",
  shippingMemo: "부재 시 문 앞에 놓아주세요.",
  selectedProduct: "BOOK-ADD-01",
  productName: "교재 추가 배송",
  sku: "BOOK-ADD-01",
  quantity: 1,
  price: 35000,
  couponCode: "WELCOME10",
  couponAmount: 3000,
  pointAmount: 2000,
  shippingFee: 3000,
};

const features: { key: FeatureKey; label: string; description: string; icon: typeof ListChecks }[] = [
  { key: "list", label: "주문 목록", description: "검색·상태·기간별 주문 조회", icon: ListChecks },
  { key: "refunds", label: "환불 관리", description: "환불 요청·승인·완료 처리", icon: RefreshCcw },
  { key: "manual", label: "수동 주문 생성", description: "관리자 직접 주문 등록", icon: PlusCircle },
  { key: "order-upload", label: "주문 업로드", description: "대량 주문 파일 업로드", icon: Upload },
  { key: "invoice-upload", label: "송장 업로드", description: "배송 송장 일괄 반영", icon: PackageCheck },
  { key: "export", label: "Export", description: "필터 결과 엑셀 다운로드", icon: Download },
  { key: "pdf-logs", label: "PDF 로그", description: "영수증·청구서 로그 확인", icon: FileText },
  { key: "payment-link", label: "결제 링크 생성", description: "결제 요청 링크 발급", icon: CreditCard },
];

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const searchParams = useSearchParams();
  const initialFilters = useMemo(() => ({
    ...emptyFilters,
    startDate: searchParams.get("startDate") ?? "",
    endDate: searchParams.get("endDate") ?? "",
  }), [searchParams]);
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("list");
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    const startDate = searchParams.get("startDate") ?? "";
    const endDate = searchParams.get("endDate") ?? "";
    if (!startDate && !endDate) return;
    setFilters((current) => ({ ...current, startDate, endDate }));
  }, [searchParams]);

  const productOptions = useMemo(() => Array.from(new Set(orders.map((order) => order.product))), [orders]);
  const countryOptions = useMemo(() => Array.from(new Set(orders.map((order) => order.country))), [orders]);
  const paymentMethods = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentMethod))), [orders]);
  const paymentStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentStatus))), [orders]);
  const orderStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.orderStatus))), [orders]);
  const shippingStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.shippingStatus))), [orders]);

  const refundRows = useMemo(
    () => orders.flatMap((order) => order.refunds.map((refund) => ({ ...refund, id: order.id, member: order.member, email: order.email, userId: order.userId, product: order.product, paymentAmount: order.paymentAmount }))),
    [orders],
  );

  const filteredOrders = useMemo(() => {
    const normalizedOrderId = filters.orderId.trim().toLowerCase();
    const normalizedCustomer = filters.customerQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const customerSearchable = [order.member, order.email, order.phone, order.userId].join(" ").toLowerCase();
      const hasRefund = order.refundAmount > 0 || order.refunds.length > 0 || order.paymentStatus === "환불요청";
      const matchesOrderId = !normalizedOrderId || order.id.toLowerCase().includes(normalizedOrderId);
      const matchesCustomer = !normalizedCustomer || customerSearchable.includes(normalizedCustomer);
      const matchesProduct = filters.product === "all" || order.product === filters.product;
      const matchesCountry = filters.country === "all" || order.country === filters.country;
      const matchesPaymentMethod = filters.paymentMethod === "all" || order.paymentMethod === filters.paymentMethod;
      const matchesStart = !filters.startDate || order.date >= filters.startDate;
      const matchesEnd = !filters.endDate || order.date <= filters.endDate;
      const matchesPayment = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
      const matchesOrder = filters.orderStatus === "all" || order.orderStatus === filters.orderStatus;
      const matchesShipping = filters.shippingStatus === "all" || order.shippingStatus === filters.shippingStatus;
      const matchesRefund = filters.refundStatus === "all" || (filters.refundStatus === "none" ? !hasRefund : hasRefund);
      const matchesCoupon = filters.couponUsed === "all" || String(order.couponUsed) === filters.couponUsed;
      const matchesPoints = filters.pointsUsed === "all" || String(order.pointsUsed) === filters.pointsUsed;

      return matchesOrderId && matchesCustomer && matchesProduct && matchesCountry && matchesPaymentMethod && matchesStart && matchesEnd && matchesPayment && matchesOrder && matchesShipping && matchesRefund && matchesCoupon && matchesPoints;
    });
  }, [filters, orders]);


  const filteredOrderStats = useMemo(() => {
    const refundedOrders = filteredOrders.filter((order) => order.refundAmount > 0 || order.refunds.some((refund) => refund.status === "환불 완료"));

    return {
      total: filteredOrders.length,
      paid: filteredOrders.filter((order) => order.paymentStatus === "결제완료").length,
      pending: filteredOrders.filter((order) => order.paymentStatus === "결제대기").length,
      canceled: filteredOrders.filter((order) => order.orderStatus === "취소").length,
      refundRequested: filteredOrders.filter((order) => order.paymentStatus === "환불요청" || order.refunds.some((refund) => refund.status === "환불 요청" || refund.status === "환불 승인 대기")).length,
      refunded: refundedOrders.length,
    };
  }, [filteredOrders]);

  const todayOrders = orders.filter((order) => order.date === TODAY);
  const paidOrders = orders.filter((order) => order.paymentStatus === "결제완료" || order.paymentStatus === "환불요청");
  const pendingPayments = orders.filter((order) => order.paymentStatus === "결제대기");
  const waitingShipping = orders.filter((order) => order.shippingStatus === "배송대기");
  const refundRequests = refundRows.filter((refund) => refund.status === "환불 요청" || refund.status === "환불 승인 대기");
  const totalPaymentAmount = paidOrders.reduce((sum, order) => sum + order.paymentAmount, 0);
  const refundTotal = orders.reduce((sum, order) => sum + order.refundAmount, 0);
  const netRevenue = totalPaymentAmount - refundTotal;

  const updateFilter = (key: keyof OrderFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyQuickFilter = (nextFilters: Partial<OrderFilters>, feature: FeatureKey = "list") => {
    setActiveFeature(feature);
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">핵심 KPI</h2>
          <p className="text-sm font-semibold text-slate-500">총 결제금액, 총 환불금액, 실제 순매출을 먼저 확인합니다.</p>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <SummaryCard label="순매출" value={formatCurrency(netRevenue)} detail="총 결제금액 - 총 환불금액" onClick={() => applyQuickFilter({})} size="primary" />
          <SummaryCard label="총 결제금액" value={formatCurrency(totalPaymentAmount)} detail="결제완료 및 환불요청 주문 합계" onClick={() => applyQuickFilter({ paymentStatus: "결제완료" })} size="primary" />
          <SummaryCard label="총 환불금액" value={formatCurrency(refundTotal)} detail="환불 이력 주문" onClick={() => applyQuickFilter({ refundStatus: "has" })} tone="rose" size="primary" />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="오늘 주문" value={`${todayOrders.length.toLocaleString()}건`} detail={`주문일 ${TODAY}`} onClick={() => applyQuickFilter({ startDate: TODAY, endDate: TODAY })} />
        <SummaryCard label="결제 대기" value={`${pendingPayments.length.toLocaleString()}건`} detail="결제상태 결제대기" onClick={() => applyQuickFilter({ paymentStatus: "결제대기" })} />
        <SummaryCard label="배송 대기" value={`${waitingShipping.length.toLocaleString()}건`} detail="배송상태 배송대기" onClick={() => applyQuickFilter({ shippingStatus: "배송대기" })} />
        <SummaryCard label="환불 요청" value={`${refundRequests.length.toLocaleString()}건`} detail="환불 관리로 이동" onClick={() => applyQuickFilter({}, "refunds")} tone="rose" />
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-black text-slate-950">운영 액션</h2>
          <p className="text-sm font-semibold text-slate-500">Orders / Payments 내부에서 주문·환불·업로드·로그 업무를 처리합니다.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const active = activeFeature === feature.key;

            return (
              <button
                key={feature.key}
                type="button"
                onClick={() => setActiveFeature(feature.key)}
                className={cn(
                  "rounded-3xl border p-4 text-left shadow-panel transition-all",
                  active ? "border-indigo-300 bg-indigo-600 text-white shadow-glow" : "border-white/70 bg-white/85 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white",
                )}
              >
                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-indigo-600")} />
                <p className="mt-3 text-sm font-black">{feature.label}</p>
                <p className={cn("mt-1 text-xs font-semibold", active ? "text-indigo-100" : "text-slate-500")}>{feature.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {activeFeature === "list" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>주문 목록 필터</CardTitle>
              <CardDescription>주문번호, 회원, 상품, 국가, 결제수단과 상태 조건을 조합해 주문을 찾습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <FilterInput label="주문번호" value={filters.orderId} onChange={(value) => updateFilter("orderId", value)} placeholder="ORD-5028" />
                <FilterInput label="회원명/이메일/User ID" value={filters.customerQuery} onChange={(value) => updateFilter("customerQuery", value)} placeholder="지윤 김, email, SM-1024" />
                <FilterSelect label="상품" value={filters.product} onChange={(value) => updateFilter("product", value)} options={productOptions} allLabel="전체 상품" />
                <FilterSelect label="국가" value={filters.country} onChange={(value) => updateFilter("country", value)} options={countryOptions} allLabel="전체 국가" />
                <FilterSelect label="결제수단" value={filters.paymentMethod} onChange={(value) => updateFilter("paymentMethod", value)} options={paymentMethods} allLabel="전체 결제수단" />
                <FilterSelect label="결제상태" value={filters.paymentStatus} onChange={(value) => updateFilter("paymentStatus", value)} options={paymentStatuses} allLabel="전체 결제상태" />
                <FilterSelect label="주문상태" value={filters.orderStatus} onChange={(value) => updateFilter("orderStatus", value)} options={orderStatuses} allLabel="전체 주문상태" />
                <FilterSelect label="배송상태" value={filters.shippingStatus} onChange={(value) => updateFilter("shippingStatus", value)} options={shippingStatuses} allLabel="전체 배송상태" />
                <FilterSelect label="환불 여부" value={filters.refundStatus} onChange={(value) => updateFilter("refundStatus", value)} options={["has", "none"]} allLabel="전체" formatOption={(value) => (value === "has" ? "환불 있음" : "환불 없음")} />
                <FilterSelect label="쿠폰 사용 여부" value={filters.couponUsed} onChange={(value) => updateFilter("couponUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
                <FilterSelect label="포인트 사용 여부" value={filters.pointsUsed} onChange={(value) => updateFilter("pointsUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
                <div className="grid grid-cols-2 gap-3">
                  <FilterInput label="주문 시작일" type="date" value={filters.startDate} onChange={(value) => updateFilter("startDate", value)} />
                  <FilterInput label="주문 종료일" type="date" value={filters.endDate} onChange={(value) => updateFilter("endDate", value)} />
                </div>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setFilters((current) => ({ ...current }))}>필터 적용</Button>
                <Button type="button" variant="outline" onClick={() => setFilters(emptyFilters)}><RotateCcw className="h-4 w-4" />초기화</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>주문 목록</CardTitle>
              <CardDescription>{filteredOrders.length.toLocaleString()}건의 주문이 표시됩니다. 행 클릭 시 주문 상세로 이동합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <ListStat label="총 주문건수" value={`${filteredOrderStats.total.toLocaleString()}건`} />
                <ListStat label="결제완료" value={`${filteredOrderStats.paid.toLocaleString()}건`} />
                <ListStat label="결제대기" value={`${filteredOrderStats.pending.toLocaleString()}건`} />
                <ListStat label="취소" value={`${filteredOrderStats.canceled.toLocaleString()}건`} />
                <ListStat label="환불요청" value={`${filteredOrderStats.refundRequested.toLocaleString()}건`} tone="rose" />
                <ListStat label="환불완료" value={`${filteredOrderStats.refunded.toLocaleString()}건`} tone="rose" />
              </div>
              <div className="overflow-x-auto">
              <Table className="min-w-[1480px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead>회원</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>결제금액</TableHead>
                    <TableHead>환불금액</TableHead>
                    <TableHead>결제상태</TableHead>
                    <TableHead>배송상태</TableHead>
                    <TableHead>주문상태</TableHead>
                    <TableHead>결제수단</TableHead>
                    <TableHead>결제일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <OrderTableRow key={order.id} order={order} />
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {activeFeature === "refunds" && <RefundManagementPanel refunds={refundRows} />}
      {activeFeature === "manual" && <ManualOrderForm />}
      {activeFeature === "payment-link" && <PaymentLinkPanel />}
      {activeFeature === "export" && <UtilityPanel title="Export" description="현재 주문 필터 기준으로 주문 데이터를 엑셀 파일로 내려받습니다." action="Export 파일 생성" icon={Download} />}
      {activeFeature === "order-upload" && <UploadPanel title="주문 업로드" description="대량 주문 생성 파일을 업로드하고 검수 결과를 확인합니다." />}
      {activeFeature === "invoice-upload" && <UploadPanel title="송장 업로드" description="배송사와 송장번호를 일괄 반영합니다." />}
      {activeFeature === "pdf-logs" && <PdfLogPanel />}
    </div>
  );
}

function OrderTableRow({ order }: { order: AdminOrder }) {
  const router = useRouter();

  return (
    <TableRow className="cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
      <TableCell className="font-mono font-bold">{order.id}</TableCell>
      <TableCell>{order.date}</TableCell>
      <TableCell className="min-w-56 max-w-64">
        <p className="truncate font-bold text-slate-900">{order.member}</p>
        <p className="truncate text-xs text-muted-foreground">{order.email}</p>
      </TableCell>
      <TableCell>
        <Link href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()} className="font-mono font-bold text-indigo-700 hover:text-indigo-900">
          {order.userId}
        </Link>
      </TableCell>
      <TableCell className="min-w-64 max-w-72"><p className="truncate font-semibold">{order.product}</p><p className="truncate font-mono text-xs text-slate-500">{order.sku}</p></TableCell>
      <MoneyCell value={order.paymentAmount} />
      <MoneyCell value={order.refundAmount} tone={order.refundAmount > 0 ? "rose" : "slate"} mutedWhenZero />
      <TableCell><KoreanStatusBadge value={order.paymentStatus} /></TableCell>
      <TableCell><KoreanStatusBadge value={order.shippingStatus} /></TableCell>
      <TableCell><KoreanStatusBadge value={order.orderStatus} /></TableCell>
      <TableCell>{order.paymentMethod}</TableCell>
      <TableCell>{order.paidAt ?? "-"}</TableCell>
    </TableRow>
  );
}

function RefundManagementPanel({ refunds }: { refunds: RefundRow[] }) {
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  const filteredRefunds = refunds.filter((refund) => {
    const normalized = query.trim().toLowerCase();
    const matchesStatus = status === "all" || refund.status === status;
    const matchesQuery = !normalized || [refund.id, refund.member, refund.email, refund.userId, refund.product].join(" ").toLowerCase().includes(normalized);
    return matchesStatus && matchesQuery;
  });

  const requested = refunds.filter((refund) => refund.status === "환불 요청").length;
  const pending = refunds.filter((refund) => refund.status === "환불 승인 대기").length;
  const totalRefundAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0);

  return (
    <div className="space-y-5">
      {toast ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{toast}</div> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <MiniMetric label="환불 요청" value={`${requested.toLocaleString()}건`} tone="rose" />
        <MiniMetric label="승인 대기" value={`${pending.toLocaleString()}건`} />
        <MiniMetric label="총 환불금액" value={formatCurrency(totalRefundAmount)} tone="rose" />
      </section>
      <Card>
        <CardHeader>
          <CardTitle>환불 관리</CardTitle>
          <CardDescription>Orders / Payments 내부에서 환불 요청, 승인 대기, 완료, 거절, 부분/전체 환불 흐름을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-3">
            <FilterInput label="주문/회원/상품 검색" value={query} onChange={setQuery} placeholder="ORD-5027, Monica, 교재" />
            <FilterSelect label="환불 상태" value={status} onChange={setStatus} options={["환불 요청", "환불 승인 대기", "환불 완료", "환불 거절"]} allLabel="전체 상태" />
          </div>
          <div className="overflow-x-auto">
            <Table className="min-w-[1320px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>회원</TableHead>
                  <TableHead>환불금액</TableHead>
                  <TableHead>환불사유</TableHead>
                  <TableHead>환불상태</TableHead>
                  <TableHead>요청일</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>환불 가능 금액</TableHead>
                  <TableHead>처리자</TableHead>
                  <TableHead>액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.map((refund) => (
                  <TableRow key={`${refund.id}-${refund.requestedAt}`}>
                    <TableCell><Link href={`/orders/${refund.id}?section=refunds`} className="font-mono font-bold text-indigo-700 hover:text-indigo-900">{refund.id}</Link></TableCell>
                    <TableCell className="min-w-56 max-w-64"><p className="truncate font-bold">{refund.member}</p><p className="truncate text-xs text-slate-500">{refund.email}</p></TableCell>
                    <MoneyCell value={refund.amount} tone="rose" />
                    <TableCell className="min-w-56 max-w-72"><p className="truncate font-semibold">{refund.reason}</p></TableCell>
                    <TableCell><KoreanStatusBadge value={refund.status} /></TableCell>
                    <TableCell>{refund.requestedAt}</TableCell>
                    <TableCell className="min-w-56 max-w-72"><p className="truncate">{refund.product}</p></TableCell>
                    <MoneyCell value={refund.availableAmount} />
                    <TableCell>{refund.processor ?? "-"}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {refund.status === "환불 요청" || refund.status === "환불 승인 대기" ? (
                          <>
                            <Button type="button" size="sm" onClick={() => setToast(`${refund.id} 환불 승인 mock 처리되었습니다.`)}>승인</Button>
                            <Button type="button" size="sm" variant="outline" onClick={() => setToast(`${refund.id} 환불 거절 mock 처리되었습니다.`)}>거절</Button>
                          </>
                        ) : (
                          <Button type="button" size="sm" variant="outline" onClick={() => setToast(`${refund.id} 상세 확인 mock 처리되었습니다.`)}>상세</Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ManualOrderForm() {
  const router = useRouter();
  const [form, setForm] = useState<ManualOrderFormState>(defaultManualOrder);
  const [toast, setToast] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const productAmount = form.quantity * form.price;
  const finalAmount = Math.max(productAmount - form.couponAmount - form.pointAmount + form.shippingFee, 0);
  const previewOrderId = `ORD-M-${TODAY.replaceAll("-", "")}-001`;

  const updateProduct = (productId: string) => {
    const product = manualProducts.find((item) => item.id === productId);
    if (!product) return;
    setForm((current) => ({ ...current, selectedProduct: product.id, productName: product.name, sku: product.sku, price: product.price }));
  };

  const createOrder = () => {
    router.push(`/orders/${previewOrderId}`);
  };

  const createPaymentLink = () => {
    const link = `https://studymini.com/mock-checkout/${previewOrderId}?amount=${finalAmount}`;
    setPaymentLink(link);
    setToast("mock 결제 링크가 생성되었습니다.");
  };

  const copyPaymentLink = async () => {
    if (!paymentLink) return;
    await navigator.clipboard.writeText(paymentLink);
    setToast("결제 링크를 클립보드에 복사했습니다.");
  };

  const resetManualOrder = () => {
    setForm(defaultManualOrder);
    setPaymentLink("");
    setToast("수동 주문 입력값을 초기화했습니다.");
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-5">
        {toast ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{toast}</div> : null}
        <FormSection title="고객 정보" description="회원 식별과 주문 국가/언어를 함께 입력합니다.">
          <TextField required label="User ID" value={form.userId} onChange={(value) => setForm((current) => ({ ...current, userId: value }))} />
          <TextField required label="이름" value={form.customerName} onChange={(value) => setForm((current) => ({ ...current, customerName: value }))} />
          <TextField required label="이메일 주소" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <TextField required label="전화번호" type="tel" value={form.customerPhone} onChange={(value) => setForm((current) => ({ ...current, customerPhone: value }))} />
          <TextField required label="국가" value={form.country} onChange={(value) => setForm((current) => ({ ...current, country: value }))} />
          <TextField required label="언어" value={form.language} onChange={(value) => setForm((current) => ({ ...current, language: value }))} />
        </FormSection>
        <FormSection title="배송 정보" description="교재 또는 실물 상품 배송에 필요한 정보를 입력합니다.">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>배송 필요 여부</span>
            <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={form.shippingRequired} onChange={(event) => setForm((current) => ({ ...current, shippingRequired: event.target.value }))}>
              <option value="true">배송 필요</option>
              <option value="false">배송 없음</option>
            </select>
          </label>
          <TextField required label="수령인" value={form.recipient} onChange={(value) => setForm((current) => ({ ...current, recipient: value }))} />
          <TextField required label="전화번호" type="tel" value={form.shippingPhone} onChange={(value) => setForm((current) => ({ ...current, shippingPhone: value }))} />
          <TextAreaField required label="배송 주소" value={form.shippingAddress} onChange={(value) => setForm((current) => ({ ...current, shippingAddress: value }))} />
          <TextAreaField label="배송 메모" value={form.shippingMemo} onChange={(value) => setForm((current) => ({ ...current, shippingMemo: value }))} />
        </FormSection>
        <FormSection title="상품 정보" description="상품 선택 시 상품명, SKU, 가격이 mock data로 채워집니다.">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>상품 선택 <span className="text-rose-500">*</span></span>
            <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={form.selectedProduct} onChange={(event) => updateProduct(event.target.value)}>
              {manualProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
            </select>
          </label>
          <TextField required label="상품명" value={form.productName} onChange={(value) => setForm((current) => ({ ...current, productName: value }))} />
          <TextField required label="SKU" value={form.sku} onChange={(value) => setForm((current) => ({ ...current, sku: value }))} />
          <TextField required label="수량" type="number" value={form.quantity} onChange={(value) => setForm((current) => ({ ...current, quantity: toNumber(value) }))} />
          <TextField required label="가격" type="number" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: toNumber(value) }))} />
        </FormSection>
        <FormSection title="할인/결제 정보" description="상품금액 - 쿠폰 할인 - 포인트 사용 + 배송비 = 최종 결제금액입니다.">
          <TextField required label="주문 경로" value={form.orderChannel} onChange={(value) => setForm((current) => ({ ...current, orderChannel: value }))} />
          <TextField required label="결제수단" value={form.paymentMethod} onChange={(value) => setForm((current) => ({ ...current, paymentMethod: value }))} />
          <TextField label="쿠폰 코드" value={form.couponCode} onChange={(value) => setForm((current) => ({ ...current, couponCode: value }))} />
          <TextField label="쿠폰 사용 금액" type="number" value={form.couponAmount} onChange={(value) => setForm((current) => ({ ...current, couponAmount: toNumber(value) }))} />
          <TextField label="포인트 사용 금액" type="number" value={form.pointAmount} onChange={(value) => setForm((current) => ({ ...current, pointAmount: toNumber(value) }))} />
          <TextField required label="배송료" type="number" value={form.shippingFee} onChange={(value) => setForm((current) => ({ ...current, shippingFee: toNumber(value) }))} />
          <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <span>최종 결제금액 <span className="text-rose-500">*</span></span>
            <input className="h-12 w-full rounded-2xl border border-indigo-200 bg-indigo-50 px-4 text-lg font-black text-indigo-700" readOnly value={formatCurrency(finalAmount)} />
          </label>
        </FormSection>
      </div>
      <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
        <Card className="border-indigo-100 bg-indigo-50/70">
          <CardHeader>
            <CardTitle>주문 미리보기</CardTitle>
            <CardDescription>주문 생성 시 생성된 주문 상세 화면으로 자동 이동합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["주문번호", previewOrderId],
              ["생성 후 이동", `/orders/${previewOrderId}`],
              ["주문생성일", TODAY],
              ["주문상태", "결제필요"],
              ["고객명", form.customerName],
              ["User ID", form.userId],
              ["국가/언어", `${form.country} / ${form.language}`],
              ["주문 경로", form.orderChannel],
              ["결제수단", form.paymentMethod],
              ["배송 필요", form.shippingRequired === "true" ? "예" : "아니오"],
              ["배송 주소", form.shippingAddress],
              ["상품명", form.productName],
              ["SKU", form.sku],
              ["수량", `${form.quantity.toLocaleString()}개`],
              ["상품금액", formatCurrency(productAmount)],
              ["쿠폰 사용 금액", `-${formatCurrency(form.couponAmount)}`],
              ["포인트 사용 금액", `-${formatCurrency(form.pointAmount)}`],
              ["배송료", formatCurrency(form.shippingFee)],
              ["최종 결제금액", formatCurrency(finalAmount)],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-4 border-b border-indigo-100 pb-3 last:border-0 last:pb-0">
                <span className="w-28 shrink-0 font-bold text-slate-500">{label}</span>
                <span className="break-all font-semibold text-slate-900">{value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {paymentLink ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mock 결제 링크</CardTitle>
              <CardDescription>API 연결 없이 화면 확인용으로 생성된 링크입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="break-all rounded-2xl bg-slate-100 p-3 text-sm font-semibold text-slate-700">{paymentLink}</div>
              <Button className="w-full" variant="outline" onClick={copyPaymentLink}><Copy className="h-4 w-4" />복사</Button>
            </CardContent>
          </Card>
        ) : null}
        <Card>
          <CardContent className="space-y-3 p-5">
            <Button className="w-full" onClick={createOrder}>주문 생성 후 상세로 이동</Button>
            <Button className="w-full" variant="secondary" onClick={createPaymentLink}>결제 링크 생성</Button>
            <Button className="w-full" variant="outline" onClick={resetManualOrder}><RotateCcw className="h-4 w-4" />초기화</Button>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function PaymentLinkPanel() {
  return <UtilityPanel title="결제 링크 생성" description="주문자에게 전달할 일회성 결제 링크를 생성하고 만료 시간을 관리합니다." action="결제 링크 생성" icon={CreditCard} />;
}

function UtilityPanel({ title, description, action, icon: Icon }: { title: string; description: string; action: string; icon: typeof CreditCard }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Icon className="h-5 w-5 text-indigo-600" />{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-3">
          <FilterInput label="시작일" type="date" value="" onChange={() => undefined} />
          <FilterInput label="종료일" type="date" value="" onChange={() => undefined} />
          <FilterSelect label="처리상태" value="all" onChange={() => undefined} options={["대기", "완료", "실패"]} allLabel="전체" />
        </div>
        <Button type="button" className="mt-6">{action}</Button>
      </CardContent>
    </Card>
  );
}

function UploadPanel({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5 text-indigo-600" />{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/50 p-8 text-center">
          <Upload className="mx-auto h-8 w-8 text-indigo-500" />
          <p className="mt-3 font-black text-slate-900">파일을 선택하거나 드래그해서 업로드하세요.</p>
          <p className="mt-1 text-sm text-slate-500">지원 형식: CSV, XLSX</p>
          <Button type="button" className="mt-5">파일 선택</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PdfLogPanel() {
  const logs = [
    { id: "PDF-1029", file: "ORD-5028 영수증", admin: "admin@studymini.kr", downloadedAt: "2026-05-29 14:22" },
    { id: "PDF-1028", file: "ORD-5019 청구서", admin: "ops@studymini.kr", downloadedAt: "2026-05-29 11:08" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-indigo-600" />PDF 로그</CardTitle>
        <CardDescription>주문 관련 PDF 다운로드 이력을 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow><TableHead>로그 ID</TableHead><TableHead>파일</TableHead><TableHead>관리자</TableHead><TableHead>다운로드 일시</TableHead></TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}><TableCell className="font-mono font-bold">{log.id}</TableCell><TableCell>{log.file}</TableCell><TableCell>{log.admin}</TableCell><TableCell>{log.downloadedAt}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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

function SummaryCard({ label, value, detail, onClick, tone = "indigo", size = "status" }: { label: string; value: string; detail: string; onClick: () => void; tone?: "indigo" | "rose"; size?: "primary" | "status" }) {
  const primary = size === "primary";

  return (
    <button type="button" onClick={onClick} className={cn("rounded-3xl border border-white/70 bg-white/85 text-left shadow-panel transition-all hover:-translate-y-0.5 hover:bg-white", primary ? "p-7" : "p-5", tone === "rose" ? "hover:border-rose-200" : "hover:border-indigo-200")}>
      <p className={cn("font-bold text-slate-500", primary ? "text-base" : "text-sm")}>{label}</p>
      <p className={cn("mt-3 font-black tracking-tight", primary ? "text-4xl xl:text-5xl" : "text-2xl", tone === "rose" ? "text-rose-700" : "text-slate-950")}>{value}</p>
      <p className={cn("mt-3 font-semibold text-slate-600", primary ? "text-base" : "text-sm")}>{detail} · 빠른 이동</p>
    </button>
  );
}

function MiniMetric({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-sm font-bold text-slate-500">{label}</p>
        <p className={cn("mt-2 text-2xl font-black", tone === "rose" ? "text-rose-700" : "text-slate-950")}>{value}</p>
      </CardContent>
    </Card>
  );
}

function ListStat({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className={cn("ml-2 text-sm font-black", tone === "rose" ? "text-rose-700" : "text-slate-900")}>{value}</span>
    </div>
  );
}

function FilterInput({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
        {type === "text" ? <Search className="h-4 w-4 text-slate-400" /> : null}
        <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" />
      </div>
    </label>
  );
}

function FilterSelect({ label, value, onChange, options, allLabel, formatOption }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string; formatOption?: (value: string) => string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{formatOption ? formatOption(option) : option}</option>)}
      </select>
    </label>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function TextField({ label, value, onChange, type = "text", required = false }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label} {required ? <span className="text-rose-500">*</span> : null}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
      <span>{label} {required ? <span className="text-rose-500">*</span> : null}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
    </label>
  );
}

function MoneyCell({ value, tone = "slate", mutedWhenZero = false }: { value: number; tone?: "slate" | "rose"; mutedWhenZero?: boolean }) {
  const empty = mutedWhenZero && value === 0;
  return <TableCell className={cn("whitespace-nowrap text-right font-bold", tone === "rose" ? "text-rose-700" : "text-slate-900", empty && "text-slate-400")}>{empty ? "-" : formatCurrency(value)}</TableCell>;
}

function toNumber(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

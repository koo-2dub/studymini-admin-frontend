"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Copy,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  ListChecks,
  PackageCheck,
  PlusCircle,
  ReceiptText,
  RotateCcw,
  Search,
  Upload,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AdminOrder } from "@/lib/mock-data";

const TODAY = "2026-05-29";

type FeatureKey = "list" | "manual" | "payment-link" | "export" | "order-upload" | "invoice-upload" | "pdf-logs";

type OrderFilters = {
  query: string;
  product: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  orderStatus: string;
  shippingStatus: string;
  couponUsed: string;
  pointsUsed: string;
};

type ManualOrderFormState = {
  userId: string;
  customerName: string;
  email: string;
  customerPhone: string;
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

const emptyFilters: OrderFilters = {
  query: "",
  product: "all",
  startDate: "",
  endDate: "",
  paymentStatus: "all",
  orderStatus: "all",
  shippingStatus: "all",
  couponUsed: "all",
  pointsUsed: "all",
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
  { key: "manual", label: "수동 주문 생성", description: "관리자 직접 주문 등록", icon: PlusCircle },
  { key: "payment-link", label: "결제 링크", description: "결제 요청 링크 발급", icon: CreditCard },
  { key: "export", label: "주문 Export", description: "필터 결과 엑셀 다운로드", icon: Download },
  { key: "order-upload", label: "주문 Upload", description: "대량 주문 파일 업로드", icon: Upload },
  { key: "invoice-upload", label: "송장 Upload", description: "배송 송장 일괄 반영", icon: PackageCheck },
  { key: "pdf-logs", label: "PDF 다운로드 로그", description: "영수증·청구서 로그 확인", icon: FileText },
];

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const [activeFeature, setActiveFeature] = useState<FeatureKey>("list");
  const [filters, setFilters] = useState(emptyFilters);

  const productOptions = useMemo(() => Array.from(new Set(orders.map((order) => order.product))), [orders]);
  const paymentStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentStatus))), [orders]);
  const orderStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.orderStatus))), [orders]);
  const shippingStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.shippingStatus))), [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return orders.filter((order) => {
      const searchable = [order.id, order.member, order.email, order.phone, order.userId, order.product].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || searchable.includes(normalizedQuery);
      const matchesProduct = filters.product === "all" || order.product === filters.product;
      const matchesStart = !filters.startDate || order.date >= filters.startDate;
      const matchesEnd = !filters.endDate || order.date <= filters.endDate;
      const matchesPayment = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
      const matchesOrder = filters.orderStatus === "all" || order.orderStatus === filters.orderStatus;
      const matchesShipping = filters.shippingStatus === "all" || order.shippingStatus === filters.shippingStatus;
      const matchesCoupon = filters.couponUsed === "all" || String(order.couponUsed) === filters.couponUsed;
      const matchesPoints = filters.pointsUsed === "all" || String(order.pointsUsed) === filters.pointsUsed;

      return matchesQuery && matchesProduct && matchesStart && matchesEnd && matchesPayment && matchesOrder && matchesShipping && matchesCoupon && matchesPoints;
    });
  }, [filters, orders]);

  const todayOrders = orders.filter((order) => order.date === TODAY);
  const paidOrders = orders.filter((order) => order.paymentStatus === "결제완료");
  const waitingShipping = orders.filter((order) => order.shippingStatus === "배송대기");
  const todayPaidOrders = orders.filter((order) => order.date === TODAY && order.paymentStatus === "결제완료");
  const refundRequests = orders.filter((order) => order.paymentStatus === "환불요청");
  const todayRevenue = todayPaidOrders.reduce((sum, order) => sum + order.paymentAmount, 0);
  const refundTotal = refundRequests.reduce((sum, order) => sum + order.refundAmount, 0);

  const updateFilter = (key: keyof OrderFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyQuickFilter = (nextFilters: Partial<OrderFilters>) => {
    setActiveFeature("list");
    setFilters((current) => ({ ...current, ...nextFilters }));
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
      </section>

      {activeFeature === "list" && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="오늘 주문" value={`${todayOrders.length.toLocaleString()}건`} detail={`주문일 ${TODAY}`} onClick={() => applyQuickFilter({ startDate: TODAY, endDate: TODAY })} />
            <SummaryCard label="결제완료" value={`${paidOrders.length.toLocaleString()}건`} detail="결제상태 결제완료" onClick={() => applyQuickFilter({ paymentStatus: "결제완료" })} />
            <SummaryCard label="배송대기" value={`${waitingShipping.length.toLocaleString()}건`} detail="배송상태 배송대기" onClick={() => applyQuickFilter({ shippingStatus: "배송대기" })} />
            <button
              type="button"
              onClick={() => applyQuickFilter({ startDate: TODAY, endDate: TODAY, paymentStatus: "결제완료" })}
              className="rounded-3xl border border-white/70 bg-white/85 p-5 text-left shadow-panel transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white"
            >
              <p className="text-sm font-bold text-slate-500">오늘 매출</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{formatCurrency(todayRevenue)}</p>
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  applyQuickFilter({ paymentStatus: "환불요청" });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    applyQuickFilter({ paymentStatus: "환불요청" });
                  }
                }}
                className="mt-3 inline-flex rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 outline-none ring-rose-200 transition hover:bg-rose-100 focus:ring-2"
              >
                환불요청 {refundRequests.length.toLocaleString()}건 · 총 환불금액 {formatCurrency(refundTotal)}
              </span>
            </button>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>주문 목록 필터</CardTitle>
              <CardDescription>주문번호, 주문자, 연락처, 상품, 기간과 처리 상태를 조합해 주문을 찾습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="주문번호, 주문자, 이메일, 전화번호, User ID 검색"
                  className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <FilterSelect label="상품" value={filters.product} onChange={(value) => updateFilter("product", value)} options={productOptions} allLabel="전체 상품" />
                <FilterSelect label="결제상태" value={filters.paymentStatus} onChange={(value) => updateFilter("paymentStatus", value)} options={paymentStatuses} allLabel="전체 결제상태" />
                <FilterInput label="시작일" type="date" value={filters.startDate} onChange={(value) => updateFilter("startDate", value)} />
                <FilterInput label="종료일" type="date" value={filters.endDate} onChange={(value) => updateFilter("endDate", value)} />
                <FilterSelect label="주문상태" value={filters.orderStatus} onChange={(value) => updateFilter("orderStatus", value)} options={orderStatuses} allLabel="전체 주문상태" />
                <FilterSelect label="배송상태" value={filters.shippingStatus} onChange={(value) => updateFilter("shippingStatus", value)} options={shippingStatuses} allLabel="전체 배송상태" />
                <FilterSelect label="쿠폰 사용" value={filters.couponUsed} onChange={(value) => updateFilter("couponUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
                <FilterSelect label="포인트 사용" value={filters.pointsUsed} onChange={(value) => updateFilter("pointsUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
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
              <CardDescription>{filteredOrders.length.toLocaleString()}건의 주문이 표시됩니다. 주문 행은 주문 상세로, 주문자와 User ID는 유저 상세로 이동합니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>주문자</TableHead>
                    <TableHead>상품명</TableHead>
                    <TableHead>결제금액</TableHead>
                    <TableHead>환불금액</TableHead>
                    <TableHead>결제상태</TableHead>
                    <TableHead>주문상태</TableHead>
                    <TableHead>배송상태</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead>결제일</TableHead>
                    <TableHead>User ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer" onClick={() => { window.location.href = `/orders/${order.id}`; }}>
                      <TableCell className="font-mono font-bold">{order.id}</TableCell>
                      <TableCell>
                        <Link href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-indigo-700">
                          {order.member}<ExternalLink className="h-3 w-3" />
                        </Link>
                        <p className="text-xs text-muted-foreground">{order.phone}</p>
                      </TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{formatCurrency(order.paymentAmount)}</TableCell>
                      <TableCell>{formatCurrency(order.refundAmount)}</TableCell>
                      <TableCell><KoreanStatusBadge value={order.paymentStatus} /></TableCell>
                      <TableCell><KoreanStatusBadge value={order.orderStatus} /></TableCell>
                      <TableCell><KoreanStatusBadge value={order.shippingStatus} /></TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{order.paidAt ?? "-"}</TableCell>
                      <TableCell>
                        <Link href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()} className="font-mono font-bold text-indigo-700 hover:text-indigo-900">
                          {order.userId}
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {activeFeature === "manual" && <ManualOrderForm />}
      {activeFeature === "payment-link" && <PaymentLinkPanel />}
      {activeFeature === "export" && <UtilityPanel title="주문 Export" description="필터 결과를 기준으로 주문 데이터를 엑셀 파일로 내려받습니다." action="Export 파일 생성" icon={Download} />}
      {activeFeature === "order-upload" && <UploadPanel title="주문 Upload" description="대량 주문 생성 파일을 업로드하고 검수 결과를 확인합니다." />}
      {activeFeature === "invoice-upload" && <UploadPanel title="송장 Upload" description="배송사와 송장번호를 일괄 반영합니다." />}
      {activeFeature === "pdf-logs" && <PdfLogPanel />}
    </div>
  );
}

function KoreanStatusBadge({ value }: { value: string }) {
  const variant = value.match(/완료|결제완료|배송완료/)
    ? "success"
    : value.match(/환불|취소|실패/)
      ? "rose"
      : value.match(/대기|접수|처리|배송중|배송전/)
        ? "warning"
        : "slate";

  return <Badge variant={variant}>{value}</Badge>;
}

function SummaryCard({ label, value, detail, onClick }: { label: string; value: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="rounded-3xl border border-white/70 bg-white/85 p-5 text-left shadow-panel transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
      <p className="mt-3 text-sm font-semibold text-slate-600">{detail} · 빠른 필터</p>
    </button>
  );
}

function FilterInput({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
    </label>
  );
}

function FilterSelect({ label, value, onChange, options, allLabel, formatOption = (option) => option }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string; formatOption?: (option: string) => string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
        <option value="all">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{formatOption(option)}</option>)}
      </select>
    </label>
  );
}

function TextField({ label, value, onChange, required = false, type = "text", placeholder }: { label: string; value: string | number; onChange: (value: string) => void; required?: boolean; type?: "text" | "email" | "tel" | "number"; placeholder?: string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label} {required ? <span className="text-rose-500">*</span> : null}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label} {required ? <span className="text-rose-500">*</span> : null}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
      />
    </label>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function ManualOrderForm() {
  const [form, setForm] = useState<ManualOrderFormState>(defaultManualOrder);
  const [toast, setToast] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const productAmount = form.price * form.quantity;
  const finalAmount = Math.max(productAmount - form.couponAmount - form.pointAmount + form.shippingFee, 0);
  const previewOrderId = `ORD-M-${TODAY.replaceAll("-", "")}-001`;

  const updateProduct = (productId: string) => {
    const product = manualProducts.find((item) => item.id === productId);
    if (!product) return;
    setForm((current) => ({ ...current, selectedProduct: product.id, productName: product.name, sku: product.sku, price: product.price }));
  };

  const createOrder = () => {
    setToast(`${previewOrderId} 주문이 mock으로 생성되었습니다.`);
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
        <FormSection title="고객 정보" description="주문을 생성할 고객의 기본 정보를 입력합니다.">
          <TextField required label="User ID" value={form.userId} onChange={(value) => setForm((current) => ({ ...current, userId: value }))} />
          <TextField required label="이름" value={form.customerName} onChange={(value) => setForm((current) => ({ ...current, customerName: value }))} />
          <TextField required label="이메일 주소" type="email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} />
          <TextField required label="전화번호" type="tel" value={form.customerPhone} onChange={(value) => setForm((current) => ({ ...current, customerPhone: value }))} />
        </FormSection>
        <FormSection title="배송 정보" description="교재 또는 실물 상품 배송에 필요한 정보를 입력합니다.">
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
        <FormSection title="할인/결제 정보" description="쿠폰, 포인트, 배송료를 반영해 최종 결제금액을 계산합니다.">
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
            <CardDescription>입력값 기반으로 생성될 주문 정보를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              ["주문번호", previewOrderId],
              ["주문생성일", TODAY],
              ["주문상태", "결제필요"],
              ["고객명", form.customerName],
              ["User ID", form.userId],
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
                <span className="font-semibold text-slate-900">{value}</span>
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
            <Button className="w-full" onClick={createOrder}>주문 생성</Button>
            <Button className="w-full" variant="secondary" onClick={createPaymentLink}>결제 링크 생성</Button>
            <Button className="w-full" variant="outline" onClick={resetManualOrder}><RotateCcw className="h-4 w-4" />초기화</Button>
          </CardContent>
        </Card>
      </aside>
    </section>
  );
}

function PaymentLinkPanel() {
  return <UtilityPanel title="결제 링크" description="주문자에게 전달할 일회성 결제 링크를 생성하고 만료 시간을 관리합니다." action="결제 링크 생성" icon={CreditCard} />;
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
    { id: "PDF-1029", file: "ORD-4924 영수증", admin: "admin@studymini.kr", downloadedAt: "2026-05-29 14:22" },
    { id: "PDF-1028", file: "ORD-4919 청구서", admin: "ops@studymini.kr", downloadedAt: "2026-05-29 11:08" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ReceiptText className="h-5 w-5 text-indigo-600" />PDF 다운로드 로그</CardTitle>
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

function toNumber(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

"use client";

import { Copy, CreditCard, PackageCheck, ReceiptText, RotateCcw, Truck } from "lucide-react";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type OrderRecord = {
  id: string;
  orderDate: string;
  customerName: string;
  userId: string;
  productName: string;
  sku: string;
  quantity: number;
  amount: number;
  paymentStatus: "결제완료" | "결제대기" | "환불요청" | "결제실패";
  deliveryStatus: "배송전" | "배송대기" | "배송중" | "배송완료" | "-";
  orderStatus: "주문완료" | "환불요청" | "결제필요" | "취소";
};

type QuickFilter = "오늘 주문" | "결제완료" | "배송대기" | "오늘 매출" | "환불요청";

type OrderForm = {
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

const today = "2026-05-29";

const orderRecords: OrderRecord[] = [
  {
    id: "ORD-5028",
    orderDate: "2026-05-29",
    customerName: "지윤 김",
    userId: "SM-1024",
    productName: "비즈니스 회화 집중반",
    sku: "BIZ-KO-12W",
    quantity: 1,
    amount: 215000,
    paymentStatus: "결제완료",
    deliveryStatus: "배송대기",
    orderStatus: "주문완료",
  },
  {
    id: "ORD-5027",
    orderDate: "2026-05-29",
    customerName: "Monica Shin",
    userId: "SM-1032",
    productName: "교재 추가 배송",
    sku: "BOOK-ADD-01",
    quantity: 1,
    amount: 0,
    paymentStatus: "환불요청",
    deliveryStatus: "-",
    orderStatus: "환불요청",
  },
  {
    id: "ORD-5022",
    orderDate: "2026-05-28",
    customerName: "Oscar Ha",
    userId: "SM-1031",
    productName: "스페인어 베이직",
    sku: "SPA-BASIC-08W",
    quantity: 1,
    amount: 149000,
    paymentStatus: "결제대기",
    deliveryStatus: "배송전",
    orderStatus: "결제필요",
  },
  {
    id: "ORD-5019",
    orderDate: "2026-05-27",
    customerName: "서준 이",
    userId: "SM-1022",
    productName: "영어 리스닝 스타터",
    sku: "ENG-LISTEN-04W",
    quantity: 1,
    amount: 99000,
    paymentStatus: "결제완료",
    deliveryStatus: "배송완료",
    orderStatus: "주문완료",
  },
  {
    id: "ORD-5015",
    orderDate: "2026-05-26",
    customerName: "민서 박",
    userId: "SM-1023",
    productName: "1:1 코칭",
    sku: "COACH-1ON1-01",
    quantity: 2,
    amount: 100000,
    paymentStatus: "결제실패",
    deliveryStatus: "-",
    orderStatus: "취소",
  },
];

const products = [
  { id: "BIZ-KO-12W", name: "비즈니스 회화 집중반", sku: "BIZ-KO-12W", price: 229000 },
  { id: "SPA-BASIC-08W", name: "스페인어 베이직", sku: "SPA-BASIC-08W", price: 149000 },
  { id: "BOOK-ADD-01", name: "교재 추가 배송", sku: "BOOK-ADD-01", price: 35000 },
  { id: "COACH-1ON1-01", name: "1:1 코칭", sku: "COACH-1ON1-01", price: 50000 },
];

const defaultForm: OrderForm = {
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

const currencyFormatter = new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 });

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function toNumber(value: string) {
  return Number(value.replace(/[^0-9]/g, "")) || 0;
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  type?: "text" | "email" | "tel" | "number";
  placeholder?: string;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </span>
      <input
        className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        min={type === "number" ? 0 : undefined}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
      <span>
        {label} {required ? <span className="text-rose-500">*</span> : null}
      </span>
      <textarea
        className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
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

function QuickFilterCard({
  title,
  value,
  helper,
  icon,
  active,
  onClick,
  children,
}: {
  title: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group cursor-pointer rounded-3xl border border-white/70 bg-white/85 p-5 text-left shadow-panel backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        active && "border-indigo-300 bg-indigo-50/80 ring-2 ring-indigo-200",
      )}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="rounded-2xl bg-indigo-100 p-3 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">{icon}</div>
      </div>
      <div className="mt-4 space-y-1 text-sm font-semibold text-slate-600">
        <p>{helper}</p>
        {children}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"list" | "manual">("list");
  const [filters, setFilters] = useState({ orderDate: "", paymentStatus: "", deliveryStatus: "", keyword: "" });
  const [quickFilter, setQuickFilter] = useState<QuickFilter | null>(null);
  const [form, setForm] = useState<OrderForm>(defaultForm);
  const [toast, setToast] = useState("");
  const [paymentLink, setPaymentLink] = useState("");

  const summary = useMemo(() => {
    const todayOrders = orderRecords.filter((order) => order.orderDate === today);
    const paidOrders = orderRecords.filter((order) => order.paymentStatus === "결제완료");
    const pendingDelivery = orderRecords.filter((order) => ["배송전", "배송대기"].includes(order.deliveryStatus));
    const refundRequests = orderRecords.filter((order) => order.paymentStatus === "환불요청" || order.orderStatus === "환불요청");
    const todayPaidOrders = todayOrders.filter((order) => order.paymentStatus === "결제완료");

    return {
      todayOrders: todayOrders.length,
      paidOrders: paidOrders.length,
      pendingDelivery: pendingDelivery.length,
      todayRevenue: todayPaidOrders.reduce((sum, order) => sum + order.amount, 0),
      refundRequests: refundRequests.length,
      refundAmount: 0,
    };
  }, []);

  const filteredOrders = useMemo(() => {
    return orderRecords.filter((order) => {
      const matchesDate = !filters.orderDate || order.orderDate === filters.orderDate;
      const matchesPayment = !filters.paymentStatus || order.paymentStatus === filters.paymentStatus;
      const matchesDelivery = !filters.deliveryStatus || (filters.deliveryStatus === "배송대기" ? ["배송전", "배송대기"].includes(order.deliveryStatus) : order.deliveryStatus === filters.deliveryStatus);
      const keyword = filters.keyword.trim().toLowerCase();
      const matchesKeyword =
        !keyword ||
        [order.id, order.customerName, order.userId, order.productName, order.sku].some((value) => value.toLowerCase().includes(keyword));
      const matchesRefund = quickFilter !== "환불요청" || order.paymentStatus === "환불요청" || order.orderStatus === "환불요청";

      return matchesDate && matchesPayment && matchesDelivery && matchesKeyword && matchesRefund;
    });
  }, [filters, quickFilter]);

  const productAmount = form.price * form.quantity;
  const finalAmount = Math.max(productAmount - form.couponAmount - form.pointAmount + form.shippingFee, 0);
  const previewOrderId = `ORD-M-${today.replaceAll("-", "")}-001`;

  const applyQuickFilter = (filter: QuickFilter) => {
    setQuickFilter(filter);

    if (filter === "오늘 주문") {
      setFilters((current) => ({ ...current, orderDate: today, paymentStatus: "", deliveryStatus: "" }));
    }

    if (filter === "결제완료") {
      setFilters((current) => ({ ...current, orderDate: "", paymentStatus: "결제완료", deliveryStatus: "" }));
    }

    if (filter === "배송대기") {
      setFilters((current) => ({ ...current, orderDate: "", paymentStatus: "", deliveryStatus: "배송대기" }));
    }

    if (filter === "오늘 매출") {
      setFilters((current) => ({ ...current, orderDate: today, paymentStatus: "결제완료", deliveryStatus: "" }));
    }

    if (filter === "환불요청") {
      setFilters((current) => ({ ...current, orderDate: "", paymentStatus: "", deliveryStatus: "" }));
    }
  };

  const resetFilters = () => {
    setFilters({ orderDate: "", paymentStatus: "", deliveryStatus: "", keyword: "" });
    setQuickFilter(null);
  };

  const updateProduct = (productId: string) => {
    const product = products.find((item) => item.id === productId);
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
    setForm(defaultForm);
    setPaymentLink("");
    setToast("수동 주문 입력값을 초기화했습니다.");
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Orders / Payments"
        title="주문/결제 관리"
        description="주문 목록을 빠르게 필터링하고, 고객에게 전달할 수 있는 mock 수동 주문 및 결제 링크를 생성합니다."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickFilterCard
          active={quickFilter === "오늘 주문"}
          helper={`주문일 ${today}`}
          icon={<ReceiptText className="h-5 w-5" />}
          title="오늘 주문"
          value={`${summary.todayOrders.toLocaleString()}건`}
          onClick={() => applyQuickFilter("오늘 주문")}
        />
        <QuickFilterCard
          active={quickFilter === "결제완료"}
          helper="결제상태 결제완료"
          icon={<CreditCard className="h-5 w-5" />}
          title="결제완료"
          value={`${summary.paidOrders.toLocaleString()}건`}
          onClick={() => applyQuickFilter("결제완료")}
        />
        <QuickFilterCard
          active={quickFilter === "배송대기"}
          helper="배송전 또는 배송대기"
          icon={<Truck className="h-5 w-5" />}
          title="배송대기"
          value={`${summary.pendingDelivery.toLocaleString()}건`}
          onClick={() => applyQuickFilter("배송대기")}
        />
        <QuickFilterCard
          active={quickFilter === "오늘 매출"}
          helper="주문일 오늘 + 결제완료"
          icon={<PackageCheck className="h-5 w-5" />}
          title="오늘 매출"
          value={formatCurrency(summary.todayRevenue)}
          onClick={() => applyQuickFilter("오늘 매출")}
        >
          <button
            className="rounded-full px-0.5 text-left text-rose-600 underline-offset-4 hover:underline"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              applyQuickFilter("환불요청");
            }}
          >
            환불요청 {summary.refundRequests.toLocaleString()}건
          </button>
          <p>총 환불금액 {formatCurrency(summary.refundAmount)}</p>
        </QuickFilterCard>
      </section>

      <div className="flex flex-wrap gap-3 rounded-3xl border border-white/70 bg-white/75 p-2 shadow-sm backdrop-blur-xl">
        <Button variant={activeTab === "list" ? "default" : "ghost"} onClick={() => setActiveTab("list")}>주문 목록</Button>
        <Button variant={activeTab === "manual" ? "default" : "ghost"} onClick={() => setActiveTab("manual")}>수동 주문 생성</Button>
      </div>

      {activeTab === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>주문 목록</CardTitle>
            <CardDescription>Summary 카드를 클릭하면 아래 필터가 자동 적용됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
              {quickFilter ? <Badge variant="default">적용된 빠른 필터: {quickFilter}</Badge> : <Badge variant="slate">빠른 필터 미적용</Badge>}
              <div className="grid gap-3 md:grid-cols-4">
                <TextField label="주문일" type="text" value={filters.orderDate} placeholder="YYYY-MM-DD" onChange={(value) => setFilters((current) => ({ ...current, orderDate: value }))} />
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  <span>결제상태</span>
                  <select
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={filters.paymentStatus}
                    onChange={(event) => setFilters((current) => ({ ...current, paymentStatus: event.target.value }))}
                  >
                    <option value="">전체</option>
                    <option value="결제완료">결제완료</option>
                    <option value="결제대기">결제대기</option>
                    <option value="결제실패">결제실패</option>
                    <option value="환불요청">환불요청</option>
                  </select>
                </label>
                <label className="space-y-2 text-sm font-semibold text-slate-700">
                  <span>배송상태</span>
                  <select
                    className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                    value={filters.deliveryStatus}
                    onChange={(event) => setFilters((current) => ({ ...current, deliveryStatus: event.target.value }))}
                  >
                    <option value="">전체</option>
                    <option value="배송대기">배송전/배송대기</option>
                    <option value="배송중">배송중</option>
                    <option value="배송완료">배송완료</option>
                  </select>
                </label>
                <TextField label="검색" value={filters.keyword} placeholder="주문번호, 고객명, SKU" onChange={(value) => setFilters((current) => ({ ...current, keyword: value }))} />
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={resetFilters}><RotateCcw className="h-4 w-4" />초기화</Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>주문번호</TableHead>
                    <TableHead>주문일</TableHead>
                    <TableHead>고객</TableHead>
                    <TableHead>상품</TableHead>
                    <TableHead>금액</TableHead>
                    <TableHead>결제상태</TableHead>
                    <TableHead>배송상태</TableHead>
                    <TableHead>주문상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-bold">{order.id}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>{order.customerName}<br /><span className="text-xs text-muted-foreground">{order.userId}</span></TableCell>
                      <TableCell>{order.productName}<br /><span className="text-xs text-muted-foreground">{order.sku} · {order.quantity}개</span></TableCell>
                      <TableCell>{formatCurrency(order.amount)}</TableCell>
                      <TableCell><StatusBadge value={order.paymentStatus} /></TableCell>
                      <TableCell><StatusBadge value={order.deliveryStatus} /></TableCell>
                      <TableCell><StatusBadge value={order.orderStatus} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
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
                <select
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  value={form.selectedProduct}
                  onChange={(event) => updateProduct(event.target.value)}
                >
                  {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </label>
              <TextField required label="상품명" value={form.productName} onChange={(value) => setForm((current) => ({ ...current, productName: value }))} />
              <TextField required label="SKU" value={form.sku} onChange={(value) => setForm((current) => ({ ...current, sku: value }))} />
              <TextField required label="수량" type="number" value={form.quantity} onChange={(value) => setForm((current) => ({ ...current, quantity: toNumber(value) }))} />
              <TextField required label="가격" type="number" value={form.price} onChange={(value) => setForm((current) => ({ ...current, price: toNumber(value) }))} />
            </FormSection>

            <FormSection title="할인·결제 정보" description="쿠폰, 포인트, 배송료를 반영해 최종 결제금액을 계산합니다.">
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
                  ["주문생성일", today],
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
      )}
    </div>
  );
}

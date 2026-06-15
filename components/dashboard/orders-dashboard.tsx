"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Search, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members, type AdminOrder } from "@/lib/mock-data";

type OrderListFilters = {
  query: string;
  orderStatus: string;
  paymentStatus: string;
  shippingStatus: string;
};

const emptyFilters: OrderListFilters = {
  query: "",
  orderStatus: "all",
  paymentStatus: "all",
  shippingStatus: "all",
};

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(emptyFilters);
  const [paymentLinkOpen, setPaymentLinkOpen] = useState(false);

  const orderStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.orderStatus))), [orders]);
  const paymentStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentStatus))), [orders]);
  const shippingStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.shippingStatus))), [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery = normalizedQuery
        ? [order.id, order.member, order.product].some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;
      const matchesOrderStatus = filters.orderStatus === "all" || order.orderStatus === filters.orderStatus;
      const matchesPaymentStatus = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
      const matchesShippingStatus = filters.shippingStatus === "all" || order.shippingStatus === filters.shippingStatus;

      return matchesQuery && matchesOrderStatus && matchesPaymentStatus && matchesShippingStatus;
    });
  }, [filters, orders]);

  const updateFilter = (key: keyof OrderListFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>주문 목록</CardTitle>
            <CardDescription>주문 행을 클릭하면 주문 상세 화면으로 이동합니다.</CardDescription>
          </div>
          <Button type="button" onClick={() => setPaymentLinkOpen(true)}><CreditCard className="h-4 w-4" />결제 링크 생성</Button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="space-y-2 text-sm font-semibold text-slate-700">
              <span>주문번호 / 주문자 / 상품명</span>
              <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="ORD-5028, 지윤 김, 비즈니스 회화"
                />
              </div>
            </label>
            <FilterSelect label="주문상태" value={filters.orderStatus} onChange={(value) => updateFilter("orderStatus", value)} options={orderStatuses} />
            <FilterSelect label="결제상태" value={filters.paymentStatus} onChange={(value) => updateFilter("paymentStatus", value)} options={paymentStatuses} />
            <FilterSelect label="배송상태" value={filters.shippingStatus} onChange={(value) => updateFilter("shippingStatus", value)} options={shippingStatuses} />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100">
            <Table className="min-w-[1040px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>주문자</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead className="text-right">결제금액</TableHead>
                  <TableHead>주문일</TableHead>
                  <TableHead>주문상태</TableHead>
                  <TableHead>결제상태</TableHead>
                  <TableHead>배송상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    tabIndex={0}
                    onClick={() => router.push(`/orders/${order.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") router.push(`/orders/${order.id}`);
                    }}
                    className="cursor-pointer transition hover:bg-indigo-50/70 focus:bg-indigo-50/70 focus:outline-none"
                  >
                    <TableCell className="font-mono font-black text-indigo-700">{order.id}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{order.member}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{order.product}</TableCell>
                    <TableCell className="text-right font-black text-slate-950">{formatCurrency(order.paymentAmount)}</TableCell>
                    <TableCell className="font-semibold text-slate-600">{order.date}</TableCell>
                    <TableCell><KoreanStatusBadge value={order.orderStatus} /></TableCell>
                    <TableCell><KoreanStatusBadge value={order.paymentStatus} /></TableCell>
                    <TableCell><KoreanStatusBadge value={order.shippingStatus} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">조건에 맞는 주문이 없습니다.</div>
          ) : (
            <p className="text-right text-sm font-bold text-slate-500">총 {filteredOrders.length.toLocaleString()}건</p>
          )}
        </CardContent>
      </Card>
      {paymentLinkOpen ? <PaymentLinkDialog onClose={() => setPaymentLinkOpen(false)} /> : null}
    </div>
  );
}

const paymentLinkProducts = [
  { id: "JP-POWERPACK", name: "일본어 파워팩", price: 500000 },
  { id: "BIZ-KO-12W", name: "비즈니스 회화 집중반", price: 229000 },
  { id: "SPA-BASIC-08W", name: "스페인어 베이직", price: 149000 },
  { id: "BOOK-ADD-01", name: "교재 추가 배송", price: 35000 },
];

function PaymentLinkDialog({ onClose }: { onClose: () => void }) {
  const [selectedUserId, setSelectedUserId] = useState(members[0]?.id ?? "");
  const [selectedProductId, setSelectedProductId] = useState(paymentLinkProducts[0].id);
  const [memo, setMemo] = useState("도서만 구매 요청");
  const [paymentAmount, setPaymentAmount] = useState(paymentLinkProducts[0].price);
  const [shippingFee, setShippingFee] = useState(3000);
  const [createdLink, setCreatedLink] = useState("");

  const selectedUser = members.find((member) => member.id === selectedUserId) ?? members[0];
  const selectedProduct = paymentLinkProducts.find((product) => product.id === selectedProductId) ?? paymentLinkProducts[0];
  const finalAmount = paymentAmount + shippingFee;

  const updateProduct = (productId: string) => {
    const product = paymentLinkProducts.find((item) => item.id === productId);
    if (!product) return;
    setSelectedProductId(product.id);
    setPaymentAmount(product.price);
    setCreatedLink("");
  };

  const createPaymentLink = () => {
    setCreatedLink(`https://studymini.com/checkout/link/${selectedUser.id}-${selectedProduct.id}?amount=${finalAmount}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <Card className="w-full max-w-5xl border-white/80 bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>결제 링크 생성</CardTitle>
            <CardDescription>주문이 생성되기 전, 특정 유저에게 전달할 결제 링크를 만듭니다. 배송정보는 유저가 결제 화면에서 직접 입력합니다.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}><X className="h-4 w-4" />닫기</Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-5">
            <FormSection title="유저 선택" description="유저 리스트에서 결제 링크를 전달할 대상을 선택합니다.">
              <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                <span>유저 검색/선택</span>
                <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)}>
                  {members.map((member) => <option key={member.id} value={member.id}>{member.name} / {member.email} / {member.id}</option>)}
                </select>
              </label>
              <ReadOnlyField label="이름" value={selectedUser.name} />
              <ReadOnlyField label="이메일" value={selectedUser.email} />
              <ReadOnlyField label="User ID" value={selectedUser.id} />
            </FormSection>

            <FormSection title="상품 선택" description="상품 원가와 별도로 실제 결제 받을 금액을 입력합니다.">
              <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                <span>상품 리스트</span>
                <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={selectedProductId} onChange={(event) => updateProduct(event.target.value)}>
                  {paymentLinkProducts.map((product) => <option key={product.id} value={product.id}>{product.name} / {formatCurrency(product.price)}</option>)}
                </select>
              </label>
              <ReadOnlyField label="상품명" value={selectedProduct.name} />
              <ReadOnlyField label="원가" value={formatCurrency(selectedProduct.price)} />
              <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
                <span>상품 메모</span>
                <textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="도서만 구매 요청" />
              </label>
              <NumberField label="실제 결제금액" value={paymentAmount} onChange={setPaymentAmount} />
              <NumberField label="배송비" value={shippingFee} onChange={setShippingFee} />
            </FormSection>
          </div>

          <aside className="space-y-4">
            <Card className="border-indigo-100 bg-indigo-50/70">
              <CardHeader>
                <CardTitle className="text-base">최종 결제금액 미리보기</CardTitle>
                <CardDescription>실제 결제금액 + 배송비 기준입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <PreviewRow label="상품 원가" value={formatCurrency(selectedProduct.price)} />
                <PreviewRow label="실제 결제금액" value={formatCurrency(paymentAmount)} />
                <PreviewRow label="배송비" value={formatCurrency(shippingFee)} />
                <div className="border-t border-indigo-100 pt-3">
                  <p className="text-xs font-bold text-slate-500">최종 결제금액</p>
                  <p className="mt-1 text-3xl font-black text-indigo-700">{formatCurrency(finalAmount)}</p>
                </div>
                <p className="rounded-2xl bg-white/80 p-3 text-xs font-semibold text-slate-600">생성된 링크의 결제 화면에서 유저가 배송정보를 직접 입력합니다.</p>
                <Button type="button" className="w-full" onClick={createPaymentLink}>링크 생성</Button>
              </CardContent>
            </Card>
            {createdLink ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">생성된 결제 링크</CardTitle>
                  <CardDescription>유저에게 전달할 mock 링크입니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="break-all rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">{createdLink}</p>
                </CardContent>
              </Card>
            ) : null}
          </aside>
        </CardContent>
      </Card>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">{children}</CardContent>
    </Card>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input type="number" className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} />
    </label>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="font-black text-slate-900">{value}</span>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <select className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="all">전체</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
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

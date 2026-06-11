"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminOrder } from "@/lib/mock-data";

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
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
          <CardDescription>주문 행을 클릭하면 주문 상세 화면으로 이동합니다.</CardDescription>
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

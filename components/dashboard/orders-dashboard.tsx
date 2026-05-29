"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
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
  const [filters, setFilters] = useState<OrderFilters>(emptyFilters);

  const productOptions = useMemo(() => Array.from(new Set(orders.map((order) => order.product))), [orders]);
  const paymentStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentStatus))), [orders]);
  const orderStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.orderStatus))), [orders]);
  const shippingStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.shippingStatus))), [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return orders.filter((order) => {
      const searchable = [order.id, order.member, order.email, order.phone, order.userId].join(" ").toLowerCase();
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
    <div className="space-y-6">
      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
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
              <Icon className={cn("mb-3 h-5 w-5", active ? "text-white" : "text-indigo-600")} />
              <p className="font-black">{feature.label}</p>
              <p className={cn("mt-1 text-xs leading-5", active ? "text-indigo-100" : "text-slate-500")}>{feature.description}</p>
            </button>
          );
        })}
      </section>

      {activeFeature === "list" && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="오늘 주문" value={`${todayOrders.length.toLocaleString()}건`} detail="주문일 오늘" onClick={() => applyQuickFilter({ startDate: TODAY, endDate: TODAY })} />
            <SummaryCard label="결제완료" value={`${paidOrders.length.toLocaleString()}건`} detail="결제상태 결제완료" onClick={() => applyQuickFilter({ paymentStatus: "결제완료" })} />
            <SummaryCard label="배송대기" value={`${waitingShipping.length.toLocaleString()}건`} detail="배송상태 배송대기" onClick={() => applyQuickFilter({ shippingStatus: "배송대기" })} />
            <button
              type="button"
              onClick={() => applyQuickFilter({ startDate: TODAY, endDate: TODAY, paymentStatus: "결제완료" })}
              className="rounded-3xl border border-white/70 bg-white/85 p-5 text-left shadow-panel transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white"
            >
              <p className="text-sm font-bold text-slate-500">오늘 매출</p>
              <p className="mt-2 text-2xl font-black text-slate-950">{formatCurrency(todayRevenue)}</p>
              <div
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
                className="mt-3 rounded-2xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 outline-none ring-rose-200 transition hover:bg-rose-100 focus:ring-2"
              >
                환불요청 {refundRequests.length.toLocaleString()}건 · 총 환불금액 {formatCurrency(refundTotal)}
              </div>
            </button>
          </section>

          <Card>
            <CardHeader>
              <CardTitle>주문 목록 필터</CardTitle>
              <CardDescription>주문번호, 주문자, 연락처, 상품, 기간과 처리 상태를 조합해 주문을 찾습니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-4">
                <label className="space-y-2 lg:col-span-2">
                  <span className="text-sm font-bold text-slate-600">검색</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      value={filters.query}
                      onChange={(event) => updateFilter("query", event.target.value)}
                      placeholder="주문번호, 주문자, 이메일, 전화번호, User ID 검색"
                      className="h-8 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                    />
                  </div>
                </label>
                <FilterSelect label="상품 필터" value={filters.product} onChange={(value) => updateFilter("product", value)} options={productOptions} allLabel="전체 상품" />
                <FilterSelect label="결제상태" value={filters.paymentStatus} onChange={(value) => updateFilter("paymentStatus", value)} options={paymentStatuses} allLabel="전체 결제상태" />
                <FilterInput label="주문일 시작" type="date" value={filters.startDate} onChange={(value) => updateFilter("startDate", value)} />
                <FilterInput label="주문일 종료" type="date" value={filters.endDate} onChange={(value) => updateFilter("endDate", value)} />
                <FilterSelect label="주문상태" value={filters.orderStatus} onChange={(value) => updateFilter("orderStatus", value)} options={orderStatuses} allLabel="전체 주문상태" />
                <FilterSelect label="배송상태" value={filters.shippingStatus} onChange={(value) => updateFilter("shippingStatus", value)} options={shippingStatuses} allLabel="전체 배송상태" />
                <FilterSelect label="쿠폰사용" value={filters.couponUsed} onChange={(value) => updateFilter("couponUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
                <FilterSelect label="포인트사용" value={filters.pointsUsed} onChange={(value) => updateFilter("pointsUsed", value)} options={["true", "false"]} allLabel="전체" formatOption={(value) => (value === "true" ? "사용" : "미사용")} />
                <div className="flex items-end gap-2 lg:col-span-2">
                  <Button type="button" className="flex-1" onClick={() => setFilters((current) => ({ ...current }))}>필터 적용</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setFilters(emptyFilters)}><RotateCcw className="h-4 w-4" />초기화</Button>
                </div>
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
                      <TableCell className="font-mono font-bold text-indigo-700">{order.id}</TableCell>
                      <TableCell>
                        <Link href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()} className="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-indigo-700">
                          {order.member}<ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell className="min-w-48 font-medium">{order.product}</TableCell>
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
      {activeFeature === "export" && <UtilityPanel title="주문 Export" description="현재 필터 조건 또는 기간 조건으로 주문 데이터를 내려받습니다." action="Export 파일 생성" icon={Download} />}
      {activeFeature === "order-upload" && <UploadPanel title="주문 Upload" description="CSV/XLSX 파일로 대량 주문을 검수 후 등록합니다." />}
      {activeFeature === "invoice-upload" && <UploadPanel title="송장 Upload" description="택배사, 송장번호, 배송상태를 일괄 업데이트합니다." />}
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
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      <p className="mt-1 text-xs font-semibold text-indigo-600">{detail} 빠른 필터</p>
    </button>
  );
}

function FilterInput({ label, type = "text", value, onChange }: { label: string; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" />
    </label>
  );
}

function FilterSelect({ label, value, onChange, options, allLabel, formatOption = (option) => option }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string; formatOption?: (option: string) => string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
        <option value="all">{allLabel}</option>
        {options.map((option) => <option key={option} value={option}>{formatOption(option)}</option>)}
      </select>
    </label>
  );
}

function ManualOrderForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>수동 주문 생성</CardTitle>
        <CardDescription>결제 링크 없이 관리자 확인 후 주문을 직접 등록하는 화면입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-2">
          <FilterInput label="User ID" value="" onChange={() => undefined} />
          <FilterInput label="주문자명" value="" onChange={() => undefined} />
          <FilterInput label="상품명" value="" onChange={() => undefined} />
          <FilterInput label="결제금액" value="" onChange={() => undefined} />
          <FilterSelect label="결제상태" value="결제대기" onChange={() => undefined} options={["결제대기", "결제완료"]} allLabel="상태 선택" />
          <FilterSelect label="주문상태" value="주문접수" onChange={() => undefined} options={["주문접수", "처리중", "완료"]} allLabel="상태 선택" />
          <label className="space-y-2 lg:col-span-2">
            <span className="text-sm font-bold text-slate-600">관리자 메모</span>
            <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100" placeholder="수동 생성 사유와 확인 내용을 입력하세요." />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="outline">임시 저장</Button>
          <Button type="button"><PlusCircle className="h-4 w-4" />수동 주문 생성</Button>
        </div>
      </CardContent>
    </Card>
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

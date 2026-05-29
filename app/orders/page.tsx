"use client";

import { useMemo, useState } from "react";
import { Download, FileText, PackageCheck, ReceiptText } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, type OrderRecord } from "@/lib/mock-data";

const customerTypeOptions = ["전체", "구매회원", "미구매회원"];
const paymentStatusOptions = ["전체", "결제완료", "결제대기", "환불검토", "결제실패"];
const orderStatusOptions = ["전체", "주문완료", "처리중", "취소요청", "주문취소"];
const productOptions = ["전체", "영어 스타터", "비즈니스 회화 집중반", "일본어 문법 완성", "HSK 실전반"];

const pdfDownloadLogs = [
  { id: "PDF-1029", userId: "SM-1024", user: "지윤 김", document: "결제 영수증", orderId: "ORD-4924", downloadedAt: "2026-05-29 10:24" },
  { id: "PDF-1028", userId: "SM-1020", user: "도윤 정", document: "거래명세서", orderId: "ORD-4875", downloadedAt: "2026-05-29 09:18" },
  { id: "PDF-1027", userId: "SM-1021", user: "하린 최", document: "환불 접수 확인서", orderId: "ORD-4863", downloadedAt: "2026-05-28 17:42" },
  { id: "PDF-1026", userId: "SM-1022", user: "서준 이", document: "결제 영수증", orderId: "ORD-4917", downloadedAt: "2026-05-27 14:08" },
];

const formatCurrency = (value: number) => `₩${value.toLocaleString("ko-KR")}`;

export default function OrdersPage() {
  const [filters, setFilters] = useState({ customerType: "전체", product: "전체", paymentStatus: "전체", orderStatus: "전체" });
  const [exportFilters, setExportFilters] = useState({ paymentStatus: "전체", orderStatus: "전체", product: "전체" });

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesCustomerType = filters.customerType === "전체" || order.customerType === filters.customerType;
      const matchesProduct = filters.product === "전체" || order.product === filters.product;
      const matchesPaymentStatus = filters.paymentStatus === "전체" || order.paymentStatus === filters.paymentStatus;
      const matchesOrderStatus = filters.orderStatus === "전체" || order.orderStatus === filters.orderStatus;

      return matchesCustomerType && matchesProduct && matchesPaymentStatus && matchesOrderStatus;
    });
  }, [filters]);

  const selectedOrder = filteredOrders[0] ?? orders[0];
  const todayDownloadCount = pdfDownloadLogs.filter((log) => log.downloadedAt.startsWith("2026-05-29")).length;
  const downloadUserCount = new Set(pdfDownloadLogs.map((log) => log.userId)).size;

  const updateFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const updateExportFilter = (key: keyof typeof exportFilters, value: string) => setExportFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payments"
        title="Orders / Payments"
        description="주문, 결제, 환불, 배송, 다운로드 이력을 운영팀 기준으로 확인합니다."
      />

      <Card>
        <CardHeader>
          <CardTitle>주문 검색 필터</CardTitle>
          <CardDescription>유저 관리와 동일한 셀렉트 필터 방식으로 주문 조건을 좁힙니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <FilterSelect label="고객구분" value={filters.customerType} options={customerTypeOptions} onChange={(value) => updateFilter("customerType", value)} />
            <FilterSelect label="상품" value={filters.product} options={productOptions} onChange={(value) => updateFilter("product", value)} />
            <FilterSelect label="결제상태" value={filters.paymentStatus} options={paymentStatusOptions} onChange={(value) => updateFilter("paymentStatus", value)} />
            <FilterSelect label="주문상태" value={filters.orderStatus} options={orderStatusOptions} onChange={(value) => updateFilter("orderStatus", value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
          <CardDescription>현재 조건에 맞는 주문 {filteredOrders.length.toLocaleString()}건</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["주문번호", "주문자", "상품명", "결제금액", "환불금액", "결제상태", "주문상태", "배송상태", "주문일", "결제일", "User ID"].map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-bold text-slate-950">{order.id}</TableCell>
                  <TableCell>{order.member}</TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.paymentAmount)}</TableCell>
                  <TableCell>{formatCurrency(order.refundAmount)}</TableCell>
                  <TableCell><StatusBadge value={order.paymentStatus} /></TableCell>
                  <TableCell><StatusBadge value={order.orderStatus} /></TableCell>
                  <TableCell><StatusBadge value={order.shippingStatus} /></TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>{order.paymentDate}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <OrderDetailCard order={selectedOrder} />

      <Card>
        <CardHeader>
          <CardTitle>주문 Export</CardTitle>
          <CardDescription>운영 다운로드 전 결제상태, 주문상태, 상품 조건을 추가로 지정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <FilterSelect label="결제상태" value={exportFilters.paymentStatus} options={paymentStatusOptions} onChange={(value) => updateExportFilter("paymentStatus", value)} />
            <FilterSelect label="주문상태" value={exportFilters.orderStatus} options={orderStatusOptions} onChange={(value) => updateExportFilter("orderStatus", value)} />
            <FilterSelect label="상품" value={exportFilters.product} options={productOptions} onChange={(value) => updateExportFilter("product", value)} />
          </div>
          <Button type="button" variant="outline"><Download className="h-4 w-4" />선택 조건으로 Export</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PDF 다운로드 로그</CardTitle>
          <CardDescription>영수증, 거래명세서, 환불 문서 다운로드 활동을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-3">
            <KpiCard icon={Download} label="총 다운로드 횟수" value={`${pdfDownloadLogs.length.toLocaleString()}회`} />
            <KpiCard icon={FileText} label="오늘 다운로드 수" value={`${todayDownloadCount.toLocaleString()}회`} />
            <KpiCard icon={ReceiptText} label="다운로드 사용자 수" value={`${downloadUserCount.toLocaleString()}명`} />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {["로그 ID", "User ID", "사용자", "문서", "주문번호", "다운로드 일시"].map((header) => <TableHead key={header}>{header}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pdfDownloadLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-semibold">{log.id}</TableCell>
                    <TableCell>{log.userId}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.document}</TableCell>
                    <TableCell>{log.orderId}</TableCell>
                    <TableCell>{log.downloadedAt}</TableCell>
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

function OrderDetailCard({ order }: { order: OrderRecord }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-3">
            <CardTitle>주문 상세</CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="font-bold text-slate-950">주문번호 {order.id}</span>
              <span>주문자 {order.member}</span>
              <span>상품명 {order.product}</span>
              <StatusBadge value={order.paymentStatus} />
            </div>
          </div>
          <div className="rounded-2xl bg-indigo-50 px-5 py-4 text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">최종 결제금액</p>
            <p className="mt-1 text-2xl font-black text-indigo-700">{formatCurrency(order.finalPaymentAmount)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
          <p className="mb-4 text-sm font-bold text-slate-950">결제 요약</p>
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="결제금액" value={formatCurrency(order.paymentAmount)} />
            <Info label="환불금액" value={formatCurrency(order.refundAmount)} />
            <Info label="주문상태" value={order.orderStatus} />
            <Info label="결제일" value={order.paymentDate} />
          </div>
        </div>
        <div className="rounded-3xl border border-slate-100 bg-white p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold text-slate-950">배송 정보</p>
              <p className="mt-1 text-sm text-muted-foreground">운송장 처리는 목업 액션입니다.</p>
            </div>
            <PackageCheck className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="space-y-3">
            <Info label="배송상태" value={order.shippingStatus} />
            <Info label="운송장번호" value={order.trackingNumber} />
            <div className="flex flex-wrap gap-2 pt-2">
              <Button type="button" size="sm">송장 등록</Button>
              <Button type="button" size="sm" variant="outline">송장 수정</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function StatusBadge({ value }: { value: string }) {
  const variant = value.match(/완료|배송중|구매회원/) ? "success" : value.match(/실패|취소|환불/) ? "rose" : value.match(/대기|처리|준비/) ? "warning" : "slate";
  return <Badge variant={variant}>{value}</Badge>;
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: typeof Download; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

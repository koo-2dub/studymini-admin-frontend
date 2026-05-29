"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, FileDown, Receipt, RefreshCw, Search, UploadCloud } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { AdminOrder } from "@/lib/mock-data";
import { invoiceUploadPreview, orderUploadPreview, pdfDownloadLogs } from "@/lib/mock-data";

type TabKey = "list" | "export" | "order-upload" | "invoice-upload" | "pdf-log";
type OrderFilters = {
  search: string;
  orderFrom: string;
  orderTo: string;
  product: string;
  paymentStatus: string;
  orderStatus: string;
  shippingStatus: string;
  couponUsed: string;
  pointsUsed: string;
};
type ExportFilters = {
  createdFrom: string;
  createdTo: string;
  paidFrom: string;
  paidTo: string;
  completedFrom: string;
  completedTo: string;
  orderId: string;
  memberId: string;
  name: string;
  email: string;
  product: string;
  paymentStatus: string;
  orderStatus: string;
};
type PdfFilters = { downloadedFrom: string; downloadedTo: string; className: string; memberId: string; orderId: string };

const today = "2026-05-29";
const orderInitialFilters: OrderFilters = {
  search: "",
  orderFrom: "",
  orderTo: "",
  product: "전체",
  paymentStatus: "전체",
  orderStatus: "전체",
  shippingStatus: "전체",
  couponUsed: "전체",
  pointsUsed: "전체",
};
const exportInitialFilters: ExportFilters = {
  createdFrom: "",
  createdTo: "",
  paidFrom: "",
  paidTo: "",
  completedFrom: "",
  completedTo: "",
  orderId: "",
  memberId: "",
  name: "",
  email: "",
  product: "전체",
  paymentStatus: "전체",
  orderStatus: "전체",
};
const pdfInitialFilters: PdfFilters = { downloadedFrom: "", downloadedTo: "", className: "", memberId: "", orderId: "" };

const tabItems: { key: TabKey; label: string; description: string }[] = [
  { key: "list", label: "주문 목록", description: "Summary, 필터, 목록만 표시" },
  { key: "export", label: "주문 Export", description: "Export 전용 필터와 컬럼" },
  { key: "order-upload", label: "주문 Upload", description: "주문 CSV 검증" },
  { key: "invoice-upload", label: "송장 Upload", description: "송장 CSV 검증" },
  { key: "pdf-log", label: "PDF 다운로드 로그", description: "다운로드 이력 조회" },
];

const formatCurrency = (value: number) => `${value.toLocaleString("ko-KR")}원`;
const formatDate = (value: string) => value ? value.replaceAll("-", ".") : "-";
const statusVariant = (value: string) => value.includes("완료") ? "success" : value.includes("대기") || value.includes("준비") || value.includes("배송중") ? "warning" : value.includes("실패") || value.includes("환불") ? "rose" : "slate";

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabKey | null) ?? "list";

  const changeTab = (tab: TabKey) => router.push(tab === "list" ? "/orders" : `/orders?tab=${tab}`);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-3 pt-6 md:grid-cols-5">
          {tabItems.map((tab) => (
            <button key={tab.key} onClick={() => changeTab(tab.key)} className={cn("rounded-2xl border p-4 text-left transition-all", activeTab === tab.key ? "border-indigo-200 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50")}>
              <div className="font-black text-slate-950">{tab.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{tab.description}</div>
            </button>
          ))}
        </CardContent>
      </Card>

      {activeTab === "export" ? <OrderExportTab orders={orders} /> : activeTab === "order-upload" ? <OrderUploadTab /> : activeTab === "invoice-upload" ? <InvoiceUploadTab /> : activeTab === "pdf-log" ? <PdfLogTab /> : <OrderListTab orders={orders} />}
    </div>
  );
}

function OrderListTab({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [draftFilters, setDraftFilters] = useState(orderInitialFilters);
  const [filters, setFilters] = useState(orderInitialFilters);
  const productOptions = useMemo(() => ["전체", ...Array.from(new Set(orders.map((order) => order.productName)))], [orders]);

  const summary = useMemo(() => ({
    todayOrders: orders.filter((order) => order.createdAt === today).length,
    paid: orders.filter((order) => order.paymentStatus === "결제완료").length,
    shippingWaiting: orders.filter((order) => order.shippingStatus === "배송대기").length,
    refundRequested: orders.filter((order) => order.orderStatus === "환불요청").length,
    todayRevenue: orders.filter((order) => order.paidAt === today && order.paymentStatus === "결제완료").reduce((sum, order) => sum + order.finalAmount, 0),
  }), [orders]);

  const filteredOrders = useMemo(() => filterOrders(orders, filters), [filters, orders]);
  const update = (key: keyof OrderFilters, value: string) => setDraftFilters((current) => ({ ...current, [key]: value }));

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-5">
        <SummaryCard label="오늘 주문" value={`${summary.todayOrders}건`} />
        <SummaryCard label="결제완료" value={`${summary.paid}건`} />
        <SummaryCard label="배송대기" value={`${summary.shippingWaiting}건`} />
        <SummaryCard label="환불요청" value={`${summary.refundRequested}건`} tone="rose" />
        <SummaryCard label="오늘 매출" value={formatCurrency(summary.todayRevenue)} tone="indigo" />
      </section>
      <Card>
        <CardHeader><CardTitle>주문 검색/필터</CardTitle><CardDescription>주문번호, 주문자, 이메일, 전화번호, User ID와 상태 조건으로 주문 목록을 조회합니다.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-4">
            <SearchInput label="검색" value={draftFilters.search} placeholder="주문번호, 주문자, 이메일, 전화번호, User ID" onChange={(value) => update("search", value)} className="lg:col-span-2" />
            <FilterInput label="주문일 시작" type="date" value={draftFilters.orderFrom} onChange={(value) => update("orderFrom", value)} />
            <FilterInput label="주문일 종료" type="date" value={draftFilters.orderTo} onChange={(value) => update("orderTo", value)} />
            <FilterSelect label="상품" value={draftFilters.product} options={productOptions} onChange={(value) => update("product", value)} />
            <FilterSelect label="결제상태" value={draftFilters.paymentStatus} options={["전체", "결제완료", "결제대기", "결제실패", "부분환불", "환불완료"]} onChange={(value) => update("paymentStatus", value)} />
            <FilterSelect label="주문상태" value={draftFilters.orderStatus} options={["전체", "주문완료", "배송준비", "배송중", "배송완료", "환불요청", "환불완료"]} onChange={(value) => update("orderStatus", value)} />
            <FilterSelect label="배송상태" value={draftFilters.shippingStatus} options={["전체", "배송없음", "배송대기", "배송중", "배송완료"]} onChange={(value) => update("shippingStatus", value)} />
            <FilterSelect label="쿠폰사용" value={draftFilters.couponUsed} options={["전체", "사용", "미사용"]} onChange={(value) => update("couponUsed", value)} />
            <FilterSelect label="포인트사용" value={draftFilters.pointsUsed} options={["전체", "사용", "미사용"]} onChange={(value) => update("pointsUsed", value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setFilters(draftFilters)}><Search className="h-4 w-4" />필터 적용</Button>
            <Button variant="outline" onClick={() => { setDraftFilters(orderInitialFilters); setFilters(orderInitialFilters); }}><RefreshCw className="h-4 w-4" />초기화</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>주문 목록</CardTitle><CardDescription>현재 조건에 맞는 주문 {filteredOrders.length.toLocaleString()}건 · 행 클릭 시 주문 상세로 이동합니다.</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto"><Table><TableHeader><TableRow>{["주문번호", "주문자", "상품명", "결제금액", "환불금액", "결제상태", "주문상태", "배송상태", "주문일", "결제일", "User ID"].map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{filteredOrders.map((order) => <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}><TableCell className="font-black text-indigo-700">{order.id}</TableCell><TableCell><Link className="font-bold text-slate-950 hover:text-indigo-600" href={`/members/${order.memberId}`} onClick={(event) => event.stopPropagation()}>{order.memberName}</Link></TableCell><TableCell>{order.productName}</TableCell><TableCell className="font-semibold">{formatCurrency(order.finalAmount)}</TableCell><TableCell className={cn("font-semibold", order.refundAmount > 0 && "text-rose-600")}>{formatCurrency(order.refundAmount)}</TableCell><TableCell><Badge variant={statusVariant(order.paymentStatus)}>{order.paymentStatus}</Badge></TableCell><TableCell><Badge variant={statusVariant(order.orderStatus)}>{order.orderStatus}</Badge></TableCell><TableCell><Badge variant={statusVariant(order.shippingStatus)}>{order.shippingStatus}</Badge></TableCell><TableCell>{formatDate(order.createdAt)}</TableCell><TableCell>{formatDate(order.paidAt)}</TableCell><TableCell><Link className="font-bold text-indigo-700 hover:underline" href={`/members/${order.memberId}`} onClick={(event) => event.stopPropagation()}>{order.memberId}</Link></TableCell></TableRow>)}</TableBody></Table></CardContent>
      </Card>
    </div>
  );
}

function filterOrders(orders: AdminOrder[], filters: OrderFilters) {
  return orders.filter((order) => {
    const search = filters.search.trim().toLowerCase();
    const searchMatched = search ? [order.id, order.memberName, order.email, order.phone, order.memberId].some((value) => value.toLowerCase().includes(search)) : true;
    return searchMatched && (!filters.orderFrom || order.createdAt >= filters.orderFrom) && (!filters.orderTo || order.createdAt <= filters.orderTo) && (filters.product === "전체" || order.productName === filters.product) && (filters.paymentStatus === "전체" || order.paymentStatus === filters.paymentStatus) && (filters.orderStatus === "전체" || order.orderStatus === filters.orderStatus) && (filters.shippingStatus === "전체" || order.shippingStatus === filters.shippingStatus) && (filters.couponUsed === "전체" || (filters.couponUsed === "사용" ? Boolean(order.couponCode || order.couponAmount) : !order.couponCode && order.couponAmount === 0)) && (filters.pointsUsed === "전체" || (filters.pointsUsed === "사용" ? order.usedPoints > 0 : order.usedPoints === 0));
  });
}

function OrderExportTab({ orders }: { orders: AdminOrder[] }) {
  const [filters, setFilters] = useState(exportInitialFilters);
  const productOptions = useMemo(() => ["전체", ...Array.from(new Set(orders.map((order) => order.productName)))], [orders]);
  const filteredOrders = useMemo(() => orders.filter((order) => (!filters.createdFrom || order.createdAt >= filters.createdFrom) && (!filters.createdTo || order.createdAt <= filters.createdTo) && (!filters.paidFrom || order.paidAt >= filters.paidFrom) && (!filters.paidTo || order.paidAt <= filters.paidTo) && (!filters.completedFrom || order.completedAt >= filters.completedFrom) && (!filters.completedTo || order.completedAt <= filters.completedTo) && (!filters.orderId || order.id.toLowerCase().includes(filters.orderId.toLowerCase())) && (!filters.memberId || order.memberId.toLowerCase().includes(filters.memberId.toLowerCase())) && (!filters.name || order.memberName.includes(filters.name)) && (!filters.email || order.email.toLowerCase().includes(filters.email.toLowerCase())) && (filters.product === "전체" || order.productName === filters.product) && (filters.paymentStatus === "전체" || order.paymentStatus === filters.paymentStatus) && (filters.orderStatus === "전체" || order.orderStatus === filters.orderStatus)), [filters, orders]);
  const update = (key: keyof ExportFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  return <div className="space-y-6"><Card><CardHeader><CardTitle>주문 Export 필터</CardTitle><CardDescription>주문 Export 탭은 Export 기능만 표시합니다.</CardDescription></CardHeader><CardContent className="space-y-4"><div className="grid gap-4 lg:grid-cols-4"><FilterInput label="주문생성일 시작" type="date" value={filters.createdFrom} onChange={(value) => update("createdFrom", value)} /><FilterInput label="주문생성일 종료" type="date" value={filters.createdTo} onChange={(value) => update("createdTo", value)} /><FilterInput label="주문결제일 시작" type="date" value={filters.paidFrom} onChange={(value) => update("paidFrom", value)} /><FilterInput label="주문결제일 종료" type="date" value={filters.paidTo} onChange={(value) => update("paidTo", value)} /><FilterInput label="주문완료일 시작" type="date" value={filters.completedFrom} onChange={(value) => update("completedFrom", value)} /><FilterInput label="주문완료일 종료" type="date" value={filters.completedTo} onChange={(value) => update("completedTo", value)} /><FilterInput label="주문번호" type="text" value={filters.orderId} onChange={(value) => update("orderId", value)} /><FilterInput label="User ID" type="text" value={filters.memberId} onChange={(value) => update("memberId", value)} /><FilterInput label="이름" type="text" value={filters.name} onChange={(value) => update("name", value)} /><FilterInput label="이메일" type="text" value={filters.email} onChange={(value) => update("email", value)} /><FilterSelect label="상품" value={filters.product} options={productOptions} onChange={(value) => update("product", value)} /><FilterSelect label="결제상태" value={filters.paymentStatus} options={["전체", "결제완료", "결제대기", "결제실패", "부분환불", "환불완료"]} onChange={(value) => update("paymentStatus", value)} /><FilterSelect label="주문상태" value={filters.orderStatus} options={["전체", "주문완료", "배송준비", "배송중", "배송완료", "환불요청", "환불완료"]} onChange={(value) => update("orderStatus", value)} /></div><Button><Download className="h-4 w-4" />CSV Export mock</Button></CardContent></Card><Card><CardHeader><CardTitle>Export 컬럼 미리보기</CardTitle><CardDescription>{filteredOrders.length.toLocaleString()}건이 Export 대상입니다.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow>{["주문번호", "주문생성일", "주문결제일", "주문상태", "이름", "User ID", "이메일", "전화번호", "상품명", "수량", "금액", "SKU", "신규/기존 회원", "지불방법", "할부개월", "쿠폰", "쿠폰 사용금액", "포인트", "포인트 사용금액"].map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{filteredOrders.map((order) => <TableRow key={order.id}><TableCell>{order.id}</TableCell><TableCell>{formatDate(order.createdAt)}</TableCell><TableCell>{formatDate(order.paidAt)}</TableCell><TableCell>{order.orderStatus}</TableCell><TableCell>{order.memberName}</TableCell><TableCell>{order.memberId}</TableCell><TableCell>{order.email}</TableCell><TableCell>{order.phone}</TableCell><TableCell>{order.productName}</TableCell><TableCell>{order.quantity}</TableCell><TableCell>{formatCurrency(order.finalAmount)}</TableCell><TableCell>{order.sku}</TableCell><TableCell>{order.isNewMember ? "신규" : "기존"}</TableCell><TableCell>{order.paymentMethod}</TableCell><TableCell>{order.installmentMonths ? `${order.installmentMonths}개월` : "일시불"}</TableCell><TableCell>{order.couponCode || "-"}</TableCell><TableCell>{formatCurrency(order.couponAmount)}</TableCell><TableCell>{order.usedPoints > 0 ? "사용" : "미사용"}</TableCell><TableCell>{order.usedPoints.toLocaleString("ko-KR")}P</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>;
}

function OrderUploadTab() { return <UploadTab title="주문 Upload" description="주문 CSV 필수 컬럼을 기준으로 검증합니다." sampleName="order-sample.csv" requiredColumns={["User ID", "이름", "이메일 주소", "전화번호", "배송 주소", "상품아이디", "수량", "가격", "쿠폰", "포인트", "배송료", "배송메모"]} rows={orderUploadPreview} columns={["row", "userId", "name", "email", "productId", "quantity", "price", "result"]} />; }
function InvoiceUploadTab() { return <UploadTab title="송장 Upload" description="송장 CSV 필수 컬럼을 기준으로 검증합니다." sampleName="invoice-sample.csv" requiredColumns={["주문번호", "상품명", "배송회사", "송장번호", "주문상태"]} rows={invoiceUploadPreview} columns={["row", "orderId", "productName", "carrier", "invoiceNo", "orderStatus", "result"]} />; }

function UploadTab({ title, description, sampleName, requiredColumns, rows, columns }: { title: string; description: string; sampleName: string; requiredColumns: string[]; rows: Record<string, string | number>[]; columns: string[] }) {
  const [toast, setToast] = useState("");
  return <div className="space-y-6"><Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader><CardContent className="space-y-5"><div className="flex flex-wrap gap-2"><Button variant="outline"><FileDown className="h-4 w-4" />샘플 CSV 다운로드 ({sampleName})</Button><Button onClick={() => { setToast("업로드 결과 mock toast: 검증 2건 / 정상 1건 / 확인 필요 1건"); setTimeout(() => setToast(""), 3500); }}><UploadCloud className="h-4 w-4" />업로드 결과 mock toast</Button></div><div><p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">필수 컬럼</p><div className="flex flex-wrap gap-2">{requiredColumns.map((column) => <Badge key={column} variant="slate">{column}</Badge>)}</div></div><label className="flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 p-8 text-center"><UploadCloud className="mb-3 h-9 w-9 text-indigo-500" /><span className="font-black text-slate-950">CSV 파일을 드래그하거나 클릭해서 업로드</span><span className="mt-1 text-sm text-muted-foreground">mock UI: 실제 파일 저장 없이 검증 결과 예시를 표시합니다.</span><input className="sr-only" type="file" accept=".csv" onChange={() => setToast("CSV 파일 선택됨: mock 검증 결과가 갱신되었습니다.")} /></label>{toast && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{toast}</div>}</CardContent></Card><Card><CardHeader><CardTitle>검증 결과 테이블</CardTitle><CardDescription>업로드 전/후 동일한 테이블 영역에 검증 결과를 표시합니다.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow>{columns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={String(row.row)}>{columns.map((column) => <TableCell key={column}>{String(row[column] ?? "-")}</TableCell>)}</TableRow>)}</TableBody></Table></CardContent></Card></div>;
}

function PdfLogTab() {
  const [filters, setFilters] = useState(pdfInitialFilters);
  const filteredLogs = useMemo(() => pdfDownloadLogs.filter((log) => (!filters.downloadedFrom || log.lastDownloadedAt.slice(0, 10) >= filters.downloadedFrom) && (!filters.downloadedTo || log.lastDownloadedAt.slice(0, 10) <= filters.downloadedTo) && (!filters.className || log.className.includes(filters.className)) && (!filters.memberId || log.memberId.toLowerCase().includes(filters.memberId.toLowerCase())) && (!filters.orderId || log.orderId.toLowerCase().includes(filters.orderId.toLowerCase()))), [filters]);
  const totalDownloads = filteredLogs.reduce((sum, log) => sum + log.downloadCount, 0);
  const todayDownloads = filteredLogs.filter((log) => log.lastDownloadedAt.startsWith(today)).reduce((sum, log) => sum + log.downloadCount, 0);
  const users = new Set(filteredLogs.map((log) => log.memberId)).size;
  const update = (key: keyof PdfFilters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  return <div className="space-y-6"><Card><CardHeader><CardTitle>PDF 다운로드 로그 필터</CardTitle><CardDescription>다운로드 일자, 수업명, User ID, 주문번호 기준으로 조회합니다.</CardDescription></CardHeader><CardContent><div className="grid gap-4 lg:grid-cols-4"><FilterInput label="다운로드 일자 시작" type="date" value={filters.downloadedFrom} onChange={(value) => update("downloadedFrom", value)} /><FilterInput label="다운로드 일자 종료" type="date" value={filters.downloadedTo} onChange={(value) => update("downloadedTo", value)} /><FilterInput label="수업명" type="text" value={filters.className} onChange={(value) => update("className", value)} /><FilterInput label="User ID" type="text" value={filters.memberId} onChange={(value) => update("memberId", value)} /><FilterInput label="주문번호" type="text" value={filters.orderId} onChange={(value) => update("orderId", value)} /></div></CardContent></Card><section className="grid gap-4 md:grid-cols-3"><SummaryCard label="총 다운로드 횟수" value={`${totalDownloads}회`} /><SummaryCard label="오늘 다운로드 수" value={`${todayDownloads}회`} tone="indigo" /><SummaryCard label="다운로드 사용자 수" value={`${users}명`} /></section><Card><CardHeader><CardTitle>PDF 다운로드 로그</CardTitle><CardDescription>수업 파일별 최초/최근 다운로드와 누적 횟수를 표시합니다.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table><TableHeader><TableRow>{["주문번호", "주문결제일", "이름", "User ID", "수업명", "수업파일명", "최초 다운로드", "최근 다운로드", "다운로드 횟수"].map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader><TableBody>{filteredLogs.map((log) => <TableRow key={`${log.orderId}-${log.fileName}`}><TableCell>{log.orderId}</TableCell><TableCell>{formatDate(log.paidAt)}</TableCell><TableCell>{log.name}</TableCell><TableCell>{log.memberId}</TableCell><TableCell>{log.className}</TableCell><TableCell>{log.fileName}</TableCell><TableCell>{log.firstDownloadedAt}</TableCell><TableCell>{log.lastDownloadedAt}</TableCell><TableCell>{log.downloadCount}회</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></div>;
}

function SummaryCard({ label, value, tone = "slate" }: { label: string; value: string; tone?: "slate" | "rose" | "indigo" }) { return <Card className={cn(tone === "indigo" && "bg-indigo-50/90", tone === "rose" && "bg-rose-50/90")}><CardContent className="pt-6"><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-black text-slate-950">{value}</p></CardContent></Card>; }
function SearchInput({ label, value, placeholder, onChange, className }: { label: string; value: string; placeholder: string; onChange: (value: string) => void; className?: string }) { return <label className={cn("space-y-2", className)}><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span><div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3"><Search className="h-4 w-4 text-muted-foreground" /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 flex-1 bg-transparent text-sm outline-none" /></div></label>; }
function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) { return <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">{options.map((option) => <option key={option}>{option}</option>)}</select></label>; }
function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) { return <label className="space-y-2"><span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" /></label>; }

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Copy, Download, FileUp, RefreshCw, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminOrder, OrderPaymentStatus, OrderStatus, ShippingStatus } from "@/lib/mock-data";

const tabs = ["주문 목록", "수동 주문 생성", "결제 링크", "주문 Export", "주문 Upload", "송장 Upload", "PDF 다운로드 로그"] as const;
type Tab = (typeof tabs)[number];

type Filters = {
  query: string;
  startDate: string;
  endDate: string;
  paymentStatus: "전체" | OrderPaymentStatus;
  orderStatus: "전체" | OrderStatus;
  product: string;
  couponUsed: "전체" | "사용" | "미사용";
  pointUsed: "전체" | "사용" | "미사용";
  shippingStatus: "전체" | ShippingStatus;
};

const defaultFilters: Filters = {
  query: "",
  startDate: "",
  endDate: "",
  paymentStatus: "전체",
  orderStatus: "전체",
  product: "",
  couponUsed: "전체",
  pointUsed: "전체",
  shippingStatus: "전체",
};

const paymentStatuses = ["전체", "결제완료", "결제대기", "결제실패", "환불요청", "환불완료"] as const;
const orderStatuses = ["전체", "신규주문", "처리중", "배송준비", "배송중", "완료", "취소"] as const;
const shippingStatuses = ["전체", "배송전", "배송중", "배송완료"] as const;
const usageOptions = ["전체", "사용", "미사용"] as const;

const exportColumns = ["주문번호", "주문생성일", "주문결제일", "주문상태", "이름", "User ID", "이메일", "전화번호", "상품명", "수량", "금액", "SKU", "신규/기존회원", "지불방법", "할부개월", "쿠폰", "쿠폰 사용금액", "포인트", "포인트 사용금액"];
const orderUploadColumns = ["User ID", "이름", "이메일", "전화번호", "배송주소", "상품ID", "수량", "가격", "쿠폰", "포인트", "배송료", "배송메모"];
const invoiceUploadColumns = ["주문번호", "상품명", "배송회사", "송장번호", "주문상태"];

const pdfLogs = [
  { orderId: "ORD-4924", paidAt: "2026-05-29", name: "지윤 김", userId: "SM-1024", className: "비즈니스 회화 집중반", fileName: "business-speaking-week1.pdf", first: "2026-05-29 10:12", recent: "2026-05-29 13:40", count: 3 },
  { orderId: "ORD-4917", paidAt: "2026-05-21", name: "서준 이", userId: "SM-1022", className: "영어 리스닝 스타터", fileName: "listening-starter-pack.pdf", first: "2026-05-21 15:01", recent: "2026-05-28 09:10", count: 8 },
  { orderId: "ORD-4875", paidAt: "2026-04-28", name: "도윤 정", userId: "SM-1020", className: "HSK 실전반", fileName: "hsk-practice-test.pdf", first: "2026-04-28 12:30", recent: "2026-05-20 22:14", count: 5 },
];

const formatCurrency = (value: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);

function statusVariant(value: string): "success" | "warning" | "rose" | "slate" | "default" {
  if (["결제완료", "완료", "배송완료", "활성", "사용완료", "정상"].includes(value)) return "success";
  if (["결제대기", "환불요청", "처리중", "배송준비", "배송중", "신규주문"].includes(value)) return "warning";
  if (["결제실패", "환불완료", "취소", "탈퇴", "만료"].includes(value)) return "rose";
  return "slate";
}

export function OrderStatusBadge({ value }: { value: string }) {
  return <Badge variant={statusVariant(value)}>{value}</Badge>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-600">
      <span>{label}</span>
      {children}
    </label>
  );
}

function inputClass(extra = "") {
  return `h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 ${extra}`;
}

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const [activeTab, setActiveTab] = useState<Tab>("주문 목록");

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto rounded-3xl border border-white/70 bg-white/80 p-2 shadow-sm backdrop-blur-xl">
        <div className="flex min-w-max gap-2">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === tab ? "bg-slate-950 text-white shadow-glow" : "text-slate-600 hover:bg-white hover:text-slate-950"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "주문 목록" && <OrderList orders={orders} />}
      {activeTab === "수동 주문 생성" && <ManualOrderCreation />}
      {activeTab === "결제 링크" && <PaymentLinks orders={orders} />}
      {activeTab === "주문 Export" && <OrderExport orders={orders} />}
      {activeTab === "주문 Upload" && <UploadPanel title="주문 Upload" columns={orderUploadColumns} sampleName="studymini-order-sample.csv" />}
      {activeTab === "송장 Upload" && <UploadPanel title="송장 Upload" columns={invoiceUploadColumns} sampleName="studymini-invoice-sample.csv" />}
      {activeTab === "PDF 다운로드 로그" && <PdfDownloadLog />}
    </div>
  );
}

function OrderList({ orders }: { orders: AdminOrder[] }) {
  const [draft, setDraft] = useState(defaultFilters);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const query = filters.query.trim().toLowerCase();
      const matchesQuery = !query || [order.id, order.member, order.email, order.phone, order.userId].some((value) => value.toLowerCase().includes(query));
      const matchesStart = !filters.startDate || order.createdAt >= filters.startDate;
      const matchesEnd = !filters.endDate || order.createdAt <= filters.endDate;
      const matchesPayment = filters.paymentStatus === "전체" || order.status === filters.paymentStatus;
      const matchesOrder = filters.orderStatus === "전체" || order.orderStatus === filters.orderStatus;
      const matchesProduct = !filters.product || order.product.toLowerCase().includes(filters.product.toLowerCase());
      const matchesCoupon = filters.couponUsed === "전체" || (filters.couponUsed === "사용" ? order.couponAmount > 0 : order.couponAmount === 0);
      const matchesPoint = filters.pointUsed === "전체" || (filters.pointUsed === "사용" ? order.pointAmount > 0 : order.pointAmount === 0);
      const matchesShipping = filters.shippingStatus === "전체" || order.shippingStatus === filters.shippingStatus;
      return matchesQuery && matchesStart && matchesEnd && matchesPayment && matchesOrder && matchesProduct && matchesCoupon && matchesPoint && matchesShipping;
    });
  }, [filters, orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const pageOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);
  const todayOrders = orders.filter((order) => order.createdAt === "2026-05-29");
  const todayRevenue = todayOrders.reduce((sum, order) => order.status === "결제완료" ? sum + order.finalAmount : sum, 0);

  function applyFilters() {
    setFilters(draft);
    setPage(1);
  }

  function resetFilters() {
    setDraft(defaultFilters);
    setFilters(defaultFilters);
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard label="오늘 주문" value={`${todayOrders.length}건`} detail="2026-05-29 기준" />
        <SummaryCard label="결제완료" value={`${orders.filter((order) => order.status === "결제완료").length}건`} detail="즉시 출고/제공 가능" />
        <SummaryCard label="배송대기" value={`${orders.filter((order) => order.shippingStatus === "배송전").length}건`} detail="송장 확인 필요" />
        <SummaryCard label="환불요청" value={`${orders.filter((order) => order.status === "환불요청").length}건`} detail="관리자 확인 대기" />
        <SummaryCard label="오늘 매출" value={formatCurrency(todayRevenue)} detail="결제완료 기준" />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>주문 검색 필터</CardTitle>
          <CardDescription>주문번호, 이름, 이메일, 전화번호, User ID를 빠르게 조회합니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Search">
            <div className="relative"><Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" /><input className={inputClass("pl-9")} placeholder="주문번호 / 이름 / 이메일 / 전화번호 / User ID" value={draft.query} onChange={(event) => setDraft({ ...draft, query: event.target.value })} /></div>
          </Field>
          <Field label="시작일"><input type="date" className={inputClass()} value={draft.startDate} onChange={(event) => setDraft({ ...draft, startDate: event.target.value })} /></Field>
          <Field label="종료일"><input type="date" className={inputClass()} value={draft.endDate} onChange={(event) => setDraft({ ...draft, endDate: event.target.value })} /></Field>
          <Field label="상품"><input className={inputClass()} placeholder="상품명" value={draft.product} onChange={(event) => setDraft({ ...draft, product: event.target.value })} /></Field>
          <SelectField label="결제상태" value={draft.paymentStatus} options={paymentStatuses} onChange={(value) => setDraft({ ...draft, paymentStatus: value as Filters["paymentStatus"] })} />
          <SelectField label="주문상태" value={draft.orderStatus} options={orderStatuses} onChange={(value) => setDraft({ ...draft, orderStatus: value as Filters["orderStatus"] })} />
          <SelectField label="쿠폰사용" value={draft.couponUsed} options={usageOptions} onChange={(value) => setDraft({ ...draft, couponUsed: value as Filters["couponUsed"] })} />
          <SelectField label="포인트사용" value={draft.pointUsed} options={usageOptions} onChange={(value) => setDraft({ ...draft, pointUsed: value as Filters["pointUsed"] })} />
          <SelectField label="배송상태" value={draft.shippingStatus} options={shippingStatuses} onChange={(value) => setDraft({ ...draft, shippingStatus: value as Filters["shippingStatus"] })} />
          <div className="flex items-end gap-2 md:col-span-2 xl:col-span-3">
            <Button onClick={applyFilters}>필터 적용</Button>
            <Button variant="outline" onClick={resetFilters}>초기화</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
          <CardDescription>행 클릭 시 주문 상세로 이동합니다. 주문자와 User ID는 유저 상세로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1120px]">
            <TableHeader><TableRow>{["주문번호", "주문자", "User ID", "상품명", "결제금액", "결제상태", "주문상태", "배송상태", "주문일", "결제일"].map((head) => <TableHead key={head}>{head}</TableHead>)}</TableRow></TableHeader>
            <TableBody>
              {pageOrders.map((order) => (
                <TableRow key={order.id} className="cursor-pointer" onClick={() => { window.location.href = `/orders/${order.id}`; }}>
                  <TableCell className="font-bold text-slate-950">{order.id}</TableCell>
                  <TableCell><Link className="font-bold text-indigo-600 hover:underline" href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()}>{order.member}</Link></TableCell>
                  <TableCell><Link className="font-bold text-indigo-600 hover:underline" href={`/members/${order.userId}`} onClick={(event) => event.stopPropagation()}>{order.userId}</Link></TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell className="font-bold">{formatCurrency(order.finalAmount)}</TableCell>
                  <TableCell><OrderStatusBadge value={order.status} /></TableCell>
                  <TableCell><OrderStatusBadge value={order.orderStatus} /></TableCell>
                  <TableCell><OrderStatusBadge value={order.shippingStatus} /></TableCell>
                  <TableCell>{order.createdAt}</TableCell>
                  <TableCell>{order.paidAt || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination page={page} totalPages={totalPages} total={filteredOrders.length} onPage={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <Card><CardContent className="p-5"><p className="text-sm font-bold text-muted-foreground">{label}</p><p className="mt-3 text-2xl font-black">{value}</p><p className="mt-2 text-xs font-semibold text-slate-500">{detail}</p></CardContent></Card>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <Field label={label}><select className={inputClass()} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select></Field>;
}

function Pagination({ page, totalPages, total, onPage }: { page: number; totalPages: number; total: number; onPage: (page: number) => void }) {
  return <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>총 {total}건 · {page}/{totalPages} 페이지</span><div className="flex gap-2"><Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>이전</Button><Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>다음</Button></div></div>;
}

function ManualOrderCreation() {
  const [form, setForm] = useState({ userId: "SM-1023", name: "민서 박", email: "minseo.park@example.com", phone: "010-3488-1023", address: "부산시 해운대구 센텀중앙로 77", product: "스페인어 베이직 교재", price: "49000", coupon: "4900", points: "0", shippingFee: "3000" });
  const finalPrice = Number(form.price || 0) - Number(form.coupon || 0) - Number(form.points || 0) + Number(form.shippingFee || 0);
  const update = (key: keyof typeof form, value: string) => setForm({ ...form, [key]: value });

  return <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]"><Card><CardHeader><CardTitle>수동 주문 생성</CardTitle><CardDescription>상담/교재 판매 등 운영자가 직접 주문을 만들고 결제 링크를 생성합니다.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{Object.entries({ userId: "User ID", name: "이름", email: "이메일", phone: "전화번호", address: "배송주소", product: "상품", price: "가격", coupon: "쿠폰", points: "포인트", shippingFee: "배송료" }).map(([key, label]) => <Field key={key} label={label}><input className={inputClass()} value={form[key as keyof typeof form]} onChange={(event) => update(key as keyof typeof form, event.target.value)} /></Field>)}<div className="md:col-span-2"><Button onClick={() => alert("Mock action: 결제 링크가 생성되었습니다.")}>결제 링크 생성</Button></div></CardContent></Card><Card><CardHeader><CardTitle>Preview</CardTitle><CardDescription>생성 전 운영자가 확인해야 하는 주문 요약입니다.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><PreviewRow label="주문번호" value="ORD-MANUAL-NEW" /><PreviewRow label="주문생성일" value="2026-05-29" /><PreviewRow label="주문상태" value="신규주문" /><PreviewRow label="배송주소" value={form.address} /><PreviewRow label="상품명" value={form.product} /><PreviewRow label="SKU" value="MANUAL-SKU-001" /><PreviewRow label="수량" value="1" /><PreviewRow label="쿠폰 사용금액" value={formatCurrency(Number(form.coupon || 0))} /><PreviewRow label="포인트 사용금액" value={formatCurrency(Number(form.points || 0))} /><PreviewRow label="최종 결제금액" value={formatCurrency(finalPrice)} /></CardContent></Card></div>;
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3"><span className="font-bold text-slate-500">{label}</span><span className="text-right font-semibold text-slate-900">{value}</span></div>;
}

function PaymentLinks({ orders }: { orders: AdminOrder[] }) {
  return <Card><CardHeader><CardTitle>결제 링크</CardTitle><CardDescription>대기/수동 주문의 결제 링크를 복사하거나 재생성합니다.</CardDescription></CardHeader><CardContent className="overflow-x-auto"><Table className="min-w-[820px]"><TableHeader><TableRow>{["주문번호", "고객명", "상품명", "결제금액", "링크상태", "만료일", "Actions"].map((head) => <TableHead key={head}>{head}</TableHead>)}</TableRow></TableHeader><TableBody>{orders.map((order) => <TableRow key={order.id} className="cursor-pointer"><TableCell className="font-bold">{order.id}</TableCell><TableCell>{order.member}</TableCell><TableCell>{order.product}</TableCell><TableCell>{formatCurrency(order.finalAmount)}</TableCell><TableCell><OrderStatusBadge value={order.paymentLinkStatus} /></TableCell><TableCell>{order.paymentLinkExpiresAt}</TableCell><TableCell className="space-x-2"><Button variant="outline" size="sm" onClick={() => alert("Mock action: 링크가 복사되었습니다.")}><Copy className="h-3.5 w-3.5" />링크 복사</Button><Button variant="outline" size="sm" onClick={() => alert("Mock action: 링크가 재생성되었습니다.")}><RefreshCw className="h-3.5 w-3.5" />링크 재생성</Button></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>;
}

function OrderExport({ orders }: { orders: AdminOrder[] }) {
  const [filters, setFilters] = useState({ createdAt: "", paidAt: "", completedAt: "", orderId: "", userId: "", name: "", email: "", product: "" });
  const exportedOrders = orders.filter((order) => {
    return (!filters.createdAt || order.createdAt === filters.createdAt)
      && (!filters.paidAt || order.paidAt === filters.paidAt)
      && (!filters.completedAt || order.completedAt === filters.completedAt)
      && (!filters.orderId || order.id.toLowerCase().includes(filters.orderId.toLowerCase()))
      && (!filters.userId || order.userId.toLowerCase().includes(filters.userId.toLowerCase()))
      && (!filters.name || order.member.includes(filters.name))
      && (!filters.email || order.email.toLowerCase().includes(filters.email.toLowerCase()))
      && (!filters.product || order.product.toLowerCase().includes(filters.product.toLowerCase()));
  });

  return <Card><CardHeader><CardTitle>주문 Export</CardTitle><CardDescription>주문생성일, 주문결제일, 주문완료일, 주문번호, User ID, 이름, 이메일, 상품 기준으로 내보냅니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Field label="주문생성일"><input type="date" className={inputClass()} value={filters.createdAt} onChange={(event) => setFilters({ ...filters, createdAt: event.target.value })} /></Field><Field label="주문결제일"><input type="date" className={inputClass()} value={filters.paidAt} onChange={(event) => setFilters({ ...filters, paidAt: event.target.value })} /></Field><Field label="주문완료일"><input type="date" className={inputClass()} value={filters.completedAt} onChange={(event) => setFilters({ ...filters, completedAt: event.target.value })} /></Field><Field label="주문번호"><input className={inputClass()} placeholder="ORD-" value={filters.orderId} onChange={(event) => setFilters({ ...filters, orderId: event.target.value })} /></Field><Field label="User ID"><input className={inputClass()} placeholder="SM-" value={filters.userId} onChange={(event) => setFilters({ ...filters, userId: event.target.value })} /></Field><Field label="이름"><input className={inputClass()} value={filters.name} onChange={(event) => setFilters({ ...filters, name: event.target.value })} /></Field><Field label="이메일"><input className={inputClass()} value={filters.email} onChange={(event) => setFilters({ ...filters, email: event.target.value })} /></Field><Field label="상품"><input className={inputClass()} value={filters.product} onChange={(event) => setFilters({ ...filters, product: event.target.value })} /></Field></div><div className="flex flex-wrap items-center gap-3"><Button onClick={() => alert("Mock action: Export 파일 생성 요청이 접수되었습니다.")}><Download className="h-4 w-4" />Export 다운로드</Button><Button variant="outline" onClick={() => setFilters({ createdAt: "", paidAt: "", completedAt: "", orderId: "", userId: "", name: "", email: "", product: "" })}>초기화</Button><span className="text-sm font-semibold text-slate-500">필터 결과 {exportedOrders.length}건</span></div><div className="overflow-x-auto rounded-2xl border"><Table className="min-w-[1800px]"><TableHeader><TableRow>{exportColumns.map((column) => <TableHead key={column}>{column}</TableHead>)}</TableRow></TableHeader><TableBody>{exportedOrders.map((order) => <TableRow key={order.id}><TableCell>{order.id}</TableCell><TableCell>{order.createdAt}</TableCell><TableCell>{order.paidAt || "-"}</TableCell><TableCell>{order.orderStatus}</TableCell><TableCell>{order.member}</TableCell><TableCell>{order.userId}</TableCell><TableCell>{order.email}</TableCell><TableCell>{order.phone}</TableCell><TableCell>{order.product}</TableCell><TableCell>{order.quantity}</TableCell><TableCell>{formatCurrency(order.finalAmount)}</TableCell><TableCell>{order.sku}</TableCell><TableCell>{order.memberType}</TableCell><TableCell>{order.paymentMethod}</TableCell><TableCell>{order.installmentMonths}</TableCell><TableCell>{order.couponCode || "-"}</TableCell><TableCell>{formatCurrency(order.couponAmount)}</TableCell><TableCell>{order.pointAmount > 0 ? "사용" : "미사용"}</TableCell><TableCell>{formatCurrency(order.pointAmount)}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>;
}

function UploadPanel({ title, columns, sampleName }: { title: string; columns: string[]; sampleName: string }) {
  const [toast, setToast] = useState("");
  const rows = columns.map((column, index) => ({ column, status: index % 5 === 0 ? "확인 필요" : "정상", message: index % 5 === 0 ? "샘플 데이터 누락 여부 확인" : "형식 통과" }));
  return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>CSV 업로드 UI, 샘플 CSV 다운로드, 검증 결과 테이블, 업로드 결과 Toast를 제공합니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="rounded-3xl border-2 border-dashed border-indigo-200 bg-indigo-50/60 p-10 text-center"><FileUp className="mx-auto h-10 w-10 text-indigo-500" /><p className="mt-4 text-lg font-black">CSV 파일을 이 영역에 업로드하세요</p><p className="mt-2 text-sm text-muted-foreground">Mock UI입니다. 실제 파일 처리는 실행하지 않습니다.</p><div className="mt-5 flex justify-center gap-2"><Button variant="outline" onClick={() => setToast(`${sampleName} 다운로드가 준비되었습니다.`)}>샘플 CSV 다운로드</Button><Button onClick={() => setToast(`${title} 검증 및 업로드가 완료되었습니다.`)}>업로드 실행</Button></div></div>{toast && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">업로드 결과 Toast: {toast}</div>}<div className="overflow-x-auto rounded-2xl border"><Table className="min-w-[720px]"><TableHeader><TableRow><TableHead>컬럼</TableHead><TableHead>검증상태</TableHead><TableHead>메시지</TableHead></TableRow></TableHeader><TableBody>{rows.map((row) => <TableRow key={row.column}><TableCell className="font-bold">{row.column}</TableCell><TableCell><OrderStatusBadge value={row.status} /></TableCell><TableCell>{row.message}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>;
}

function PdfDownloadLog() {
  const [query, setQuery] = useState({ date: "", className: "", userId: "", orderId: "" });
  const logs = pdfLogs.filter((log) => (!query.date || log.paidAt === query.date) && (!query.className || log.className.includes(query.className)) && (!query.userId || log.userId.includes(query.userId)) && (!query.orderId || log.orderId.includes(query.orderId)));
  return <Card><CardHeader><CardTitle>PDF 다운로드 로그</CardTitle><CardDescription>수업 PDF 파일의 최초/최근 다운로드와 횟수를 추적합니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-4 md:grid-cols-4"><Field label="다운로드일"><input type="date" className={inputClass()} value={query.date} onChange={(event) => setQuery({ ...query, date: event.target.value })} /></Field><Field label="수업명"><input className={inputClass()} value={query.className} onChange={(event) => setQuery({ ...query, className: event.target.value })} /></Field><Field label="User ID"><input className={inputClass()} value={query.userId} onChange={(event) => setQuery({ ...query, userId: event.target.value })} /></Field><Field label="주문번호"><input className={inputClass()} value={query.orderId} onChange={(event) => setQuery({ ...query, orderId: event.target.value })} /></Field></div><div className="overflow-x-auto"><Table className="min-w-[980px]"><TableHeader><TableRow>{["주문번호", "주문결제일", "이름", "User ID", "수업명", "파일명", "최초 다운로드", "최근 다운로드", "다운로드 횟수"].map((head) => <TableHead key={head}>{head}</TableHead>)}</TableRow></TableHeader><TableBody>{logs.map((log) => <TableRow key={`${log.orderId}-${log.fileName}`} className="cursor-pointer"><TableCell className="font-bold">{log.orderId}</TableCell><TableCell>{log.paidAt}</TableCell><TableCell>{log.name}</TableCell><TableCell>{log.userId}</TableCell><TableCell>{log.className}</TableCell><TableCell>{log.fileName}</TableCell><TableCell>{log.first}</TableCell><TableCell>{log.recent}</TableCell><TableCell>{log.count}</TableCell></TableRow>)}</TableBody></Table></div></CardContent></Card>;
}

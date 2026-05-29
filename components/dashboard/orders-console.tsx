"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, LinkIcon, PackageCheck, Plus, Search, Upload, type LucideIcon } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { OrderRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "list", label: "주문 목록" },
  { id: "manual", label: "수동 주문 생성" },
  { id: "links", label: "결제 링크" },
  { id: "export", label: "주문 Export" },
  { id: "order-upload", label: "주문 Upload" },
  { id: "invoice-upload", label: "송장 Upload" },
  { id: "pdf-logs", label: "PDF 다운로드 로그" },
] as const;

type OrderTab = (typeof tabs)[number]["id"];

type OrderExport = {
  id: string;
  period: string;
  format: string;
  requestedBy: string;
  status: string;
  createdAt: string;
};

type PdfDownloadLog = {
  id: string;
  orderId: string;
  document: string;
  downloadedBy: string;
  downloadedAt: string;
  ip: string;
};

export function OrdersConsole({
  activeTab,
  orders,
  exports,
  pdfLogs,
}: {
  activeTab: string;
  orders: OrderRecord[];
  exports: OrderExport[];
  pdfLogs: PdfDownloadLog[];
}) {
  const currentTab = tabs.some((tab) => tab.id === activeTab) ? (activeTab as OrderTab) : "list";

  return (
    <div className="space-y-6">
      <nav className="flex gap-2 overflow-x-auto rounded-3xl border border-white/70 bg-white/70 p-2 shadow-panel backdrop-blur-xl">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.id === "list" ? "/orders" : `/orders?tab=${tab.id}`}
            className={cn(
              "whitespace-nowrap rounded-2xl px-4 py-2 text-sm font-bold text-slate-500 transition-all hover:bg-white hover:text-indigo-700",
              currentTab === tab.id && "bg-indigo-600 text-white shadow-glow hover:bg-indigo-600 hover:text-white",
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
      {currentTab === "list" && <OrderListTab orders={orders} />}
      {currentTab === "manual" && <ManualOrderTab />}
      {currentTab === "links" && <PaymentLinksTab />}
      {currentTab === "export" && <OrderExportTab exports={exports} />}
      {currentTab === "order-upload" && <UploadTab title="주문 Upload" description="외부 판매 채널 주문 파일을 업로드하고 검증 결과만 확인합니다." icon={Upload} />}
      {currentTab === "invoice-upload" && <UploadTab title="송장 Upload" description="택배사 송장 파일을 업로드하고 주문별 배송상태를 갱신합니다." icon={PackageCheck} />}
      {currentTab === "pdf-logs" && <PdfLogsTab logs={pdfLogs} />}
    </div>
  );
}

function OrderListTab({ orders }: { orders: OrderRecord[] }) {
  const todayOrders = orders.filter((order) => order.orderedAt.startsWith("2026-05-29"));
  const paidOrders = orders.filter((order) => order.paymentStatus === "결제완료");
  const pendingShipments = orders.filter((order) => order.shippingStatus === "배송대기");
  const refundRequests = orders.filter((order) => order.paymentStatus === "환불요청");
  const todayRevenue = todayOrders.reduce((total, order) => total + order.paymentAmount - order.refundAmount, 0);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="오늘 주문" value={`${todayOrders.length}건`} change="2026-05-29 기준" tone="indigo" />
        <StatCard label="결제완료" value={`${paidOrders.length}건`} change="정상 결제 주문" tone="emerald" />
        <StatCard label="배송대기" value={`${pendingShipments.length}건`} change="송장 등록 필요" tone="amber" />
        <StatCard label="환불요청" value={`${refundRequests.length}건`} change="검토 대기" tone="rose" />
        <StatCard label="오늘 매출" value={formatCurrency(todayRevenue)} change="환불 차감" tone="indigo" />
      </section>
      <OrderFilters />
      <OrderTable orders={orders} />
    </div>
  );
}

function OrderFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 검색/필터</CardTitle>
        <CardDescription>주문번호, 주문자, 이메일, 전화번호, User ID와 운영 조건으로 주문을 찾습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-4">
          <FilterField className="lg:col-span-2" label="검색" placeholder="주문번호, 주문자, 이메일, 전화번호, User ID" />
          <FilterField label="주문일 시작" type="date" />
          <FilterField label="주문일 종료" type="date" />
          <FilterSelect label="상품" options={["전체 상품", "비즈니스 회화 집중반", "영어 리스닝 스타터", "스페인어 베이직", "HSK 실전반"]} />
          <FilterSelect label="결제상태" options={["전체", "결제완료", "입금대기", "결제실패", "환불요청", "부분환불"]} />
          <FilterSelect label="주문상태" options={["전체", "접수", "결제확인", "처리중", "취소요청", "완료"]} />
          <FilterSelect label="배송상태" options={["전체", "배송없음", "배송대기", "배송중", "배송완료"]} />
          <FilterSelect label="쿠폰사용" options={["전체", "사용", "미사용"]} />
          <FilterSelect label="포인트사용" options={["전체", "사용", "미사용"]} />
        </div>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button variant="outline" type="button">초기화</Button>
          <Button type="button"><Search className="h-4 w-4" />필터 적용</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function OrderTable({ orders }: { orders: OrderRecord[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>주문 목록</CardTitle>
        <CardDescription>주문 row를 클릭하면 주문 상세로 이동합니다. 주문자 또는 User ID는 유저 상세로 이동합니다.</CardDescription>
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
            {orders.map((order) => (
              <TableRow key={order.id} className="cursor-pointer" onClick={() => router.push(`/orders/${order.id}`)}>
                <TableCell className="font-mono font-bold text-indigo-700">{order.id}</TableCell>
                <TableCell>
                  <Link className="font-bold text-slate-900 hover:text-indigo-700" href={`/members/${order.memberId}`} onClick={(event) => event.stopPropagation()}>
                    {order.member}
                  </Link>
                </TableCell>
                <TableCell className="min-w-48 font-medium">{order.product}</TableCell>
                <TableCell>{formatCurrency(order.paymentAmount)}</TableCell>
                <TableCell>{formatCurrency(order.refundAmount)}</TableCell>
                <TableCell><StatusBadge value={order.paymentStatus} /></TableCell>
                <TableCell><StatusBadge value={order.orderStatus} /></TableCell>
                <TableCell><StatusBadge value={order.shippingStatus} /></TableCell>
                <TableCell className="whitespace-nowrap">{order.orderedAt}</TableCell>
                <TableCell className="whitespace-nowrap">{order.paidAt}</TableCell>
                <TableCell>
                  <Link className="font-mono font-bold text-indigo-700 hover:text-indigo-900" href={`/members/${order.memberId}`} onClick={(event) => event.stopPropagation()}>
                    {order.memberId}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ManualOrderTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>수동 주문 생성</CardTitle>
        <CardDescription>주문 목록과 분리된 화면에서 운영자가 수동 주문을 생성합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <FilterField label="User ID" placeholder="SM-1024" />
        <FilterField label="상품명" placeholder="상품 검색" />
        <FilterField label="결제금액" placeholder="229000" />
        <div className="lg:col-span-3 flex justify-end"><Button><Plus className="h-4 w-4" />수동 주문 생성</Button></div>
      </CardContent>
    </Card>
  );
}

function PaymentLinksTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>결제 링크</CardTitle>
        <CardDescription>결제 링크 생성과 발송 상태만 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 lg:grid-cols-3">
        <FilterField label="수신자" placeholder="이메일 또는 전화번호" />
        <FilterField label="상품" placeholder="상품 선택" />
        <FilterField label="금액" placeholder="99000" />
        <div className="lg:col-span-3 flex justify-end"><Button><LinkIcon className="h-4 w-4" />결제 링크 생성</Button></div>
      </CardContent>
    </Card>
  );
}

function OrderExportTab({ exports }: { exports: OrderExport[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Export 필터</CardTitle>
          <CardDescription>내보낼 주문 조건을 지정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-4">
          <FilterField label="시작일" type="date" />
          <FilterField label="종료일" type="date" />
          <FilterSelect label="파일 형식" options={["CSV", "XLSX"]} />
          <div className="flex items-end"><Button className="w-full"><Download className="h-4 w-4" />다운로드</Button></div>
        </CardContent>
      </Card>
      <SimpleTable title="Export 테이블" description="생성된 주문 Export 이력입니다." headers={["Export ID", "기간", "형식", "요청자", "상태", "생성일"]} rows={exports.map((item) => [item.id, item.period, item.format, item.requestedBy, item.status, item.createdAt])} />
    </div>
  );
}

function PdfLogsTab({ logs }: { logs: PdfDownloadLog[] }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="오늘 PDF 다운로드" value="1건" change="영수증/명세서 포함" tone="indigo" />
        <StatCard label="이번 달 다운로드" value={`${logs.length}건`} change="감사 로그 보관" tone="emerald" />
        <StatCard label="고유 요청자" value="3명" change="운영/재무/지원" tone="amber" />
      </section>
      <SimpleTable title="PDF 로그 테이블" description="PDF 문서 다운로드 감사 로그입니다." headers={["Log ID", "주문번호", "문서", "다운로드 담당자", "다운로드 일시", "IP"]} rows={logs.map((item) => [item.id, item.orderId, item.document, item.downloadedBy, item.downloadedAt, item.ip])} />
    </div>
  );
}

function UploadTab({ title, description, icon: Icon }: { title: string; description: string; icon: LucideIcon }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 p-10 text-center">
          <Icon className="mx-auto h-10 w-10 text-indigo-600" />
          <p className="mt-4 text-lg font-black text-slate-900">CSV/XLSX 파일 업로드</p>
          <p className="mt-2 text-sm text-slate-500">파일 검증 결과와 처리 성공/실패 건수만 이 탭에서 표시됩니다.</p>
          <Button className="mt-5" variant="secondary">파일 선택</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleTable({ title, description, headers, rows }: { title: string; description: string; headers: string[]; rows: string[][] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>{headers.map((header) => <TableHead key={header}>{header}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.join("-")}>{row.map((cell) => <TableCell key={cell}>{cell}</TableCell>)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function FilterField({ label, placeholder, type = "text", className }: { label: string; placeholder?: string; type?: string; className?: string }) {
  return (
    <label className={cn("space-y-2 text-sm font-bold text-slate-600", className)}>
      <span>{label}</span>
      <input className="h-11 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100" placeholder={placeholder} type={type} />
    </label>
  );
}

function FilterSelect({ label, options }: { label: string; options: string[] }) {
  return (
    <label className="space-y-2 text-sm font-bold text-slate-600">
      <span>{label}</span>
      <select className="h-11 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

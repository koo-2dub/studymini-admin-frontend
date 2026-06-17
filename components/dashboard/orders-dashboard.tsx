"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, PlusCircle, Search, X } from "lucide-react";

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
  orderSource: string;
  startDate: string;
  endDate: string;
};

const emptyFilters: OrderListFilters = {
  query: "",
  orderStatus: "all",
  paymentStatus: "all",
  shippingStatus: "all",
  orderSource: "all",
  startDate: "",
  endDate: "",
};

const today = new Date().toISOString().slice(0, 10);

export function OrdersDashboard({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(emptyFilters);
  const [paymentLinkOpen, setPaymentLinkOpen] = useState(false);
  const [manualOrderOpen, setManualOrderOpen] = useState(false);

  const orderStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.orderStatus))), [orders]);
  const paymentStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.paymentStatus))), [orders]);
  const shippingStatuses = useMemo(() => Array.from(new Set(orders.map((order) => order.shippingStatus))), [orders]);
  const orderSources = ["자사몰", "결제 링크", "이즈웰", "수동 등록"];

  const filteredOrders = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery = normalizedQuery
        ? [order.id, order.member, order.product].some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;
      const matchesOrderStatus = filters.orderStatus === "all" || order.orderStatus === filters.orderStatus;
      const matchesPaymentStatus = filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus;
      const matchesShippingStatus = filters.shippingStatus === "all" || order.shippingStatus === filters.shippingStatus;
      const matchesOrderSource = filters.orderSource === "all" || order.orderSource === filters.orderSource;
      const matchesStartDate = !filters.startDate || order.date >= filters.startDate;
      const matchesEndDate = !filters.endDate || order.date <= filters.endDate;

      return matchesQuery && matchesOrderStatus && matchesPaymentStatus && matchesShippingStatus && matchesOrderSource && matchesStartDate && matchesEndDate;
    });
  }, [filters, orders]);

  const todayOrders = useMemo(() => orders.filter((order) => order.date === today), [orders]);
  const todayPaidAmount = todayOrders.reduce((sum, order) => order.paymentStatus === "결제완료" || order.paymentStatus === "환불요청" ? sum + order.paymentAmount : sum, 0);
  const todayRefundAmount = todayOrders.reduce((sum, order) => sum + order.refundAmount, 0);

  const updateFilter = (key: keyof OrderListFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const setDateRange = (startDate: string, endDate: string) => {
    setFilters((current) => ({ ...current, startDate, endDate }));
  };

  const applyRecentDays = (days: number) => {
    const end = new Date(today);
    const start = new Date(today);
    start.setDate(end.getDate() - (days - 1));
    setDateRange(start.toISOString().slice(0, 10), today);
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard label="오늘 주문 건수" value={`${todayOrders.length.toLocaleString()}건`} detail={`오늘 기준 · ${today}`} />
        <KpiCard label="오늘 결제금액" value={formatCurrency(todayPaidAmount)} detail={`오늘 기준 · ${today}`} />
        <KpiCard label="오늘 환불금액" value={formatCurrency(todayRefundAmount)} detail={`오늘 기준 · ${today}`} tone="rose" />
      </section>

      <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>주문 목록</CardTitle>
            <CardDescription>주문 행을 클릭하면 주문 상세 화면으로 이동합니다.</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={() => setManualOrderOpen(true)}><PlusCircle className="h-4 w-4" />주문 생성</Button>
            <Button type="button" variant="outline" onClick={() => setPaymentLinkOpen(true)}><CreditCard className="h-4 w-4" />결제 링크 생성</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
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
            <FilterSelect label="주문 출처" value={filters.orderSource} onChange={(value) => updateFilter("orderSource", value)} options={orderSources} />
            <div className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2 xl:col-span-5">
              <span>주문일</span>
              <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <input type="date" className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={filters.startDate} onChange={(event) => updateFilter("startDate", event.target.value)} />
                  <span className="text-center text-slate-400">~</span>
                  <input type="date" className="h-12 rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={filters.endDate} onChange={(event) => updateFilter("endDate", event.target.value)} />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={() => setDateRange(today, today)}>오늘</Button>
                  <Button type="button" variant="outline" onClick={() => applyRecentDays(7)}>최근 7일</Button>
                  <Button type="button" variant="outline" onClick={() => applyRecentDays(30)}>최근 30일</Button>
                  <Button type="button" variant="secondary" onClick={() => setDateRange("", "")}>전체</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-100">
            <Table className="min-w-[1160px] [&_td]:whitespace-nowrap [&_th]:whitespace-nowrap">
              <TableHeader>
                <TableRow>
                  <TableHead>주문번호</TableHead>
                  <TableHead>주문자</TableHead>
                  <TableHead>상품명</TableHead>
                  <TableHead>주문 출처</TableHead>
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
                    <TableCell><Badge variant={order.orderSource === "자사몰" ? "slate" : "success"}>{order.orderSource}</Badge></TableCell>
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
      {manualOrderOpen ? <ManualOrderDialog onClose={() => setManualOrderOpen(false)} /> : null}
      {paymentLinkOpen ? <PaymentLinkDialog onClose={() => setPaymentLinkOpen(false)} /> : null}
    </div>
  );
}

const paymentLinkProducts = [
  { id: "PACK-JP-POWER", name: "일본어 파워팩", price: 500000 },
  { id: "BIZ-KO-12W", name: "비즈니스 회화 집중반", price: 229000 },
  { id: "SPA-BASIC-08W", name: "스페인어 베이직", price: 149000 },
  { id: "BOOK-ADD-01", name: "교재 추가 배송", price: 35000 },
];

function PaymentLinkDialog({ onClose }: { onClose: () => void }) {
  const [userQuery, setUserQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [memo, setMemo] = useState("도서만 구매 요청");
  const [paymentAmount, setPaymentAmount] = useState(paymentLinkProducts[0].price);
  const [shippingFee, setShippingFee] = useState(3000);
  const [createdLink, setCreatedLink] = useState("");

  const normalizedUserQuery = userQuery.trim().toLowerCase();
  const normalizedProductQuery = productQuery.trim().toLowerCase();
  const userResults = members.filter((member) => !normalizedUserQuery || [member.id, member.name, member.email].join(" ").toLowerCase().includes(normalizedUserQuery)).slice(0, 5);
  const productResults = paymentLinkProducts.filter((product) => !normalizedProductQuery || [product.id, product.name].join(" ").toLowerCase().includes(normalizedProductQuery)).slice(0, 5);
  const selectedUser = members.find((member) => member.id === selectedUserId);
  const selectedProduct = paymentLinkProducts.find((product) => product.id === selectedProductId);
  const finalAmount = paymentAmount + shippingFee;

  const updateProduct = (productId: string) => {
    const product = paymentLinkProducts.find((item) => item.id === productId);
    if (!product) return;
    setSelectedProductId(product.id);
    setProductQuery(product.id);
    setPaymentAmount(product.price);
    setCreatedLink("");
  };

  const createPaymentLink = () => {
    if (!selectedUser || !selectedProduct) return;
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
            <FormSection title="유저 선택" description="User ID를 검색한 뒤 결제 링크를 전달할 상담 완료 고객을 선택합니다.">
              <SearchField label="User ID 검색" value={userQuery} onChange={(value) => { setUserQuery(value); setCreatedLink(""); }} placeholder="SM-1024" />
              <div className="space-y-2 md:col-span-2">
                {userResults.map((member) => (
                  <button key={member.id} type="button" onClick={() => { setSelectedUserId(member.id); setUserQuery(member.id); setCreatedLink(""); }} className={selectedUserId === member.id ? "w-full rounded-2xl border border-indigo-300 bg-indigo-50 p-4 text-left shadow-sm" : "w-full rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"}>
                    <p className="font-mono text-sm font-black text-indigo-700">{member.id}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="text-xs font-semibold text-slate-500">{member.email}</p>
                  </button>
                ))}
              </div>
            </FormSection>

            <FormSection title="상품 선택" description="코스 ID 또는 패키지 ID를 검색한 뒤 상품을 선택합니다.">
              <SearchField label="코스 ID / 패키지 ID 검색" value={productQuery} onChange={(value) => { setProductQuery(value); setCreatedLink(""); }} placeholder="PACK-JP-POWER" />
              <div className="space-y-2 md:col-span-2">
                {productResults.map((product) => (
                  <button key={product.id} type="button" onClick={() => updateProduct(product.id)} className={selectedProductId === product.id ? "w-full rounded-2xl border border-indigo-300 bg-indigo-50 p-4 text-left shadow-sm" : "w-full rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"}>
                    <p className="font-mono text-sm font-black text-indigo-700">{product.id}</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">{product.name}</p>
                    <p className="text-xs font-semibold text-slate-500">원가 {formatCurrency(product.price)}</p>
                  </button>
                ))}
              </div>
              {selectedProduct ? <ReadOnlyField label="선택 상품 원가" value={formatCurrency(selectedProduct.price)} /> : null}
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
                <PreviewRow label="실제 결제금액" value={formatCurrency(paymentAmount)} />
                <PreviewRow label="배송비" value={formatCurrency(shippingFee)} />
                <div className="border-t border-indigo-100 pt-3">
                  <p className="text-xs font-bold text-slate-500">최종 결제금액</p>
                  <p className="mt-1 text-3xl font-black text-indigo-700">{formatCurrency(finalAmount)}</p>
                </div>
                <p className="rounded-2xl bg-white/80 p-3 text-xs font-semibold text-slate-600">생성된 링크의 결제 화면에서 유저가 배송정보를 직접 입력합니다.</p>
                <Button type="button" className="w-full" onClick={createPaymentLink} disabled={!selectedUser || !selectedProduct}>링크 생성</Button>
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

const manualOrderProducts = [
  { id: "COURSE-BIZ-KO-12W", sku: "BIZ-KO-12W", name: "비즈니스 회화 집중반", type: "코스", productType: "디지털 상품", requiresShipping: false, price: 215000, summary: "12주 비즈니스 한국어 회화 · 온라인 수업 24개", lessons: ["비즈니스 자기소개", "회의 표현", "이메일 표현", "프레젠테이션 말하기"], permissions: ["비즈니스 회화 집중반", "비즈니스 자기소개", "회의 표현", "이메일 표현", "프레젠테이션 말하기"] },
  { id: "COURSE-EN-LISTENING-STARTER", sku: "EN-LISTENING-STARTER", name: "영어 리스닝 스타터", type: "코스", productType: "디지털 상품", requiresShipping: false, price: 99000, summary: "영어 듣기 입문 과정 · 핵심 레슨 18개", lessons: ["영어 리스닝 1단계", "영어 리스닝 2단계", "쉐도잉 트레이닝"], permissions: ["영어 리스닝 스타터", "영어 리스닝 1단계", "영어 리스닝 2단계", "쉐도잉 트레이닝"] },
  { id: "PACK-JP-POWER", sku: "JP-POWER-PACK", name: "일본어 파워팩", type: "패키지", productType: "디지털 + 페이퍼", requiresShipping: true, price: 500000, summary: "일본어 기초 + 문법 + 네이티브 회화 패키지", lessons: ["일본어 1단계", "일본어 2단계", "일본어 3단계", "일본어 4단계"], permissions: ["일본어 파워팩", "일본어 1단계", "일본어 2단계", "일본어 3단계", "일본어 4단계"] },
  { id: "PACK-SPA-BASIC", sku: "SPA-BASIC-08W", name: "스페인어 베이직 패키지", type: "패키지", productType: "디지털 + 페이퍼", requiresShipping: true, price: 149000, summary: "스페인어 베이직 8주 과정 + 복습 자료", lessons: ["스페인어 1단계", "스페인어 2단계", "스페인어 회화 입문"], permissions: ["스페인어 베이직 패키지", "스페인어 1단계", "스페인어 2단계", "스페인어 회화 입문"] },
];

function ManualOrderDialog({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("jiyoon.kim@example.com");
  const [name, setName] = useState("복지몰 고객");
  const [phone, setPhone] = useState("010-0000-0000");
  const [temporaryPassword, setTemporaryPassword] = useState("Studymini!2026");
  const [source, setSource] = useState("이즈웰");
  const [requestedAt, setRequestedAt] = useState("2026-06-17");
  const [externalOrderNumber, setExternalOrderNumber] = useState("EZW-20260617-001");
  const [paidAt, setPaidAt] = useState("2026-06-17");
  const [memo, setMemo] = useState("이즈웰 복지몰 결제 확인 후 강의 지급");
  const [productQuery, setProductQuery] = useState("JP-POWER");
  const [selectedProductId, setSelectedProductId] = useState(manualOrderProducts[2].id);
  const [paymentAmount, setPaymentAmount] = useState(manualOrderProducts[2].price);
  const [recipient, setRecipient] = useState("복지몰 고객");
  const [shippingPhone, setShippingPhone] = useState("010-0000-0000");
  const [shippingAddress, setShippingAddress] = useState("서울특별시 강남구 테헤란로 123");
  const [shippingDetailAddress, setShippingDetailAddress] = useState("8층");
  const [shippingPostalCode, setShippingPostalCode] = useState("06234");
  const [shippingMemo, setShippingMemo] = useState("배송 전 연락 부탁드립니다.");

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = members.find((member) => member.email.toLowerCase() === normalizedEmail);
  const selectedProduct = manualOrderProducts.find((product) => product.id === selectedProductId);
  const normalizedProductQuery = productQuery.trim().toLowerCase();
  const productResults = manualOrderProducts.filter((product) => !normalizedProductQuery || [product.id, product.sku, product.name, product.type].join(" ").toLowerCase().includes(normalizedProductQuery)).slice(0, 5);
  const requiresShipping = selectedProduct?.requiresShipping ?? false;
  const hasShippingInfo = requiresShipping && [recipient, shippingPhone, shippingAddress, shippingDetailAddress, shippingPostalCode].some((value) => value.trim());
  const userStatus = existingUser ? "🟢 기존 회원 발견" : "🟡 신규 회원 생성 예정";
  const previewName = existingUser?.name ?? name;
  const previewMemberId = existingUser?.id ?? "신규 회원 생성 후 발급";
  const userResultLabel = existingUser ? "기존 회원 매칭" : "신규 회원 생성";

  const selectProduct = (productId: string) => {
    const product = manualOrderProducts.find((item) => item.id === productId);
    if (!product) return;
    setSelectedProductId(product.id);
    setProductQuery(product.sku);
    setPaymentAmount(product.price);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-8 backdrop-blur-sm">
      <Card className="w-full max-w-6xl border-white/80 bg-white shadow-2xl">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>주문 생성</CardTitle>
            <CardDescription>이미 외부몰에서 결제한 주문을 바탕으로 유저 생성/매칭, 강의 지급, 주문 기록 생성을 한 번에 처리합니다.</CardDescription>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}><X className="h-4 w-4" />닫기</Button>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-5">
            <FormSection title="1. 이메일로 유저 검색" description="이메일을 먼저 입력해 기존 유저 여부를 확인합니다.">
              <TextField label="이메일 *" value={email} onChange={setEmail} placeholder="customer@example.com" />
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 md:col-span-2">
                {existingUser ? (
                  <div className="space-y-2 text-sm">
                    <Badge variant="success">🟢 기존 회원 발견</Badge>
                    <PreviewRow label="User ID" value={existingUser.id} />
                    <PreviewRow label="이름" value={existingUser.name} />
                    <PreviewRow label="이메일" value={existingUser.email} />
                    <PreviewRow label="전화번호" value={existingUser.phone} />
                    <p className="text-xs font-semibold text-slate-600">기존 유저에게 강의를 지급합니다. 비밀번호 생성 필드는 비활성화됩니다.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Badge variant="warning">🟡 신규 회원 생성 예정</Badge>
                    <p className="text-sm font-semibold text-slate-600">신규 회원 생성 후 강의 지급까지 함께 처리됩니다.</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <TextField label="이름/닉네임" value={name} onChange={setName} placeholder="복지몰 고객" />
                      <TextField label="전화번호" value={phone} onChange={setPhone} placeholder="010-0000-0000" />
                      <TextField label="임시 비밀번호 생성" value={temporaryPassword} onChange={setTemporaryPassword} placeholder="임시 비밀번호" />
                    </div>
                  </div>
                )}
              </div>
            </FormSection>

            <FormSection title="2. 주문 정보" description="외부몰에서 전달받은 주문/결제 정보를 입력합니다.">
              <label className="space-y-2 text-sm font-semibold text-slate-700"><span>주문 출처</span><select className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none" value={source} onChange={(event) => setSource(event.target.value)}><option>이즈웰</option><option>수동 등록</option><option>기타</option></select></label>
              <TextField label="요청일 / 주문일" value={requestedAt} onChange={setRequestedAt} placeholder="YYYY-MM-DD" />
              <TextField label="외부 주문번호" value={externalOrderNumber} onChange={setExternalOrderNumber} placeholder="EZW-20260617-001" />
              <TextField label="결제일" value={paidAt} onChange={setPaidAt} placeholder="YYYY-MM-DD" />
              <NumberField label="구매 금액" value={paymentAmount} onChange={setPaymentAmount} />
              <label className="space-y-2 text-sm font-semibold text-slate-700"><span>메모</span><textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold outline-none" value={memo} onChange={(event) => setMemo(event.target.value)} /></label>
            </FormSection>

            <FormSection title="3. 상품/강의 선택" description="코스 ID, 패키지 ID 또는 SKU로 검색해 지급할 상품/강의를 선택합니다.">
              <SearchField label="코스 ID / 패키지 ID / SKU 검색" value={productQuery} onChange={setProductQuery} placeholder="COURSE-, PACK-, SKU" />
              <div className="space-y-2 md:col-span-2">{productResults.map((product) => <button key={product.id} type="button" onClick={() => selectProduct(product.id)} className={selectedProductId === product.id ? "w-full rounded-2xl border border-indigo-300 bg-indigo-50 p-4 text-left shadow-sm" : "w-full rounded-2xl border border-slate-100 bg-white p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"}><p className="text-sm font-black text-slate-900">{product.name}</p><p className="mt-1 text-xs font-bold text-indigo-700">{product.productType}</p><p className="mt-1 font-mono text-xs font-semibold text-slate-500">{product.sku} · {product.id}</p><p className="mt-2 text-xs font-semibold text-slate-600">{product.summary}</p></button>)}</div>
              {selectedProduct ? <><ReadOnlyField label="상품명" value={selectedProduct.name} /><ReadOnlyField label="상품 ID" value={selectedProduct.id} /><ReadOnlyField label="SKU" value={selectedProduct.sku} /><ReadOnlyField label="상품 유형" value={selectedProduct.productType} /><ReadOnlyField label="상품 구분" value={selectedProduct.type} /><ReadOnlyField label="포함 강의/수업 요약" value={selectedProduct.summary} /><GrantPreview product={selectedProduct} /></> : null}
            </FormSection>

            {requiresShipping ? <FormSection title="4. 배송 정보" description="선택 상품이 페이퍼를 포함하므로 배송 정보를 주문 기록에 함께 저장합니다.">
              <TextField label="수령인" value={recipient} onChange={setRecipient} placeholder="수령인" />
              <TextField label="전화번호" value={shippingPhone} onChange={setShippingPhone} placeholder="010-0000-0000" />
              <TextField label="주소" value={shippingAddress} onChange={setShippingAddress} placeholder="기본 주소" />
              <TextField label="상세 주소" value={shippingDetailAddress} onChange={setShippingDetailAddress} placeholder="상세 주소" />
              <TextField label="우편번호" value={shippingPostalCode} onChange={setShippingPostalCode} placeholder="00000" />
              <label className="space-y-2 text-sm font-semibold text-slate-700"><span>배송 메모</span><textarea className="min-h-24 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm font-semibold outline-none" value={shippingMemo} onChange={(event) => setShippingMemo(event.target.value)} /></label>
            </FormSection> : null}
          </div>
          <aside className="space-y-4">
            <Card className="border-indigo-100 bg-indigo-50/70">
              <CardHeader><CardTitle className="text-base">생성 미리보기</CardTitle><CardDescription>저장 시 생성되는 결과를 확인합니다.</CardDescription></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-2xl bg-white/80 p-4"><Badge variant={existingUser ? "success" : "warning"}>{userStatus}</Badge><p className="mt-2 break-all font-black text-slate-900">{email || "이메일 필수"}</p></div>
                <div className="rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold text-slate-500">최종 생성 결과</p><div className="mt-3 space-y-2"><PreviewRow label="회원" value={previewMemberId} /><PreviewRow label="주문 출처" value={source} /><PreviewRow label="지급 상품" value={selectedProduct?.name ?? "미선택"} /><PreviewRow label="결제 금액" value={formatCurrency(paymentAmount)} /><PreviewRow label="배송 정보" value={requiresShipping ? "필요" : "불필요"} /><PreviewRow label="생성 유형" value={userResultLabel} /></div></div>
                <PreviewRow label="이름" value={previewName || "-"} />
                <PreviewRow label="주문 출처" value={source} />
                <PreviewRow label="외부 주문번호" value={externalOrderNumber || "-"} />
                <PreviewRow label="선택 상품/강의" value={selectedProduct?.name ?? "미선택"} />
                <PreviewRow label="구매 금액" value={formatCurrency(paymentAmount)} />
                <PreviewRow label="배송 정보 입력 여부" value={requiresShipping ? (hasShippingInfo ? "입력됨" : "미입력") : "불필요"} />
                <div className="rounded-2xl bg-white/80 p-4"><p className="text-xs font-bold text-slate-500">생성 결과</p><ul className="mt-2 space-y-2 text-sm font-black text-slate-900"><li>✓ {userResultLabel}</li>{selectedProduct?.permissions.map((permission) => <li key={permission}>✓ {permission} 지급</li>)}<li>✓ 주문 기록 생성</li></ul><p className="mt-2 text-xs font-semibold text-slate-600">외부 주문번호, 주문 출처, 구매 금액, 배송 정보가 주문 기록에 저장됩니다.</p></div>
                <Button type="button" className="w-full" disabled={!email || !selectedProduct}>주문 생성</Button>
              </CardContent>
            </Card>
          </aside>
        </CardContent>
      </Card>
    </div>
  );
}

function GrantPreview({ product }: { product: { name: string; type: string; productType: string; lessons: string[]; permissions: string[] } }) {
  return (
    <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4 md:col-span-2">
      <p className="text-xs font-bold text-slate-500">지급 예정 권한</p>
      <ul className="mt-2 space-y-2 text-sm font-black text-slate-900">
        {product.permissions.map((permission) => <li key={permission}>✓ {permission}</li>)}
      </ul>
      <p className="mt-4 text-xs font-bold text-slate-500">{product.type === "패키지" ? "지급 예정 패키지" : "지급 예정 강의"}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{product.name}</p>
      <p className="mt-1 text-xs font-semibold text-indigo-700">상품 유형: {product.productType}</p>
      <p className="mt-3 text-xs font-bold text-slate-500">하위 포함 강의</p>
      <ul className="mt-2 grid gap-2 text-sm font-semibold text-slate-700 sm:grid-cols-2">
        {product.lessons.map((lesson) => <li key={lesson} className="rounded-xl bg-white/80 px-3 py-2">• {lesson}</li>)}
      </ul>
    </div>
  );
}

function KpiCard({ label, value, detail, tone = "indigo" }: { label: string; value: string; detail: string; tone?: "indigo" | "rose" }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm font-black text-slate-500">{label}</p>
        <p className={tone === "rose" ? "mt-3 text-3xl font-black text-rose-700" : "mt-3 text-3xl font-black text-slate-950"}>{value}</p>
        <p className="mt-2 text-xs font-bold text-slate-500">{detail}</p>
      </CardContent>
    </Card>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input className="h-12 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 text-sm font-semibold outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function SearchField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700 md:col-span-2">
      <span>{label}</span>
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 px-4 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100">
        <Search className="h-4 w-4 text-slate-400" />
        <input className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
      </div>
    </label>
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

  return <Badge variant={variant}>{simplifyStatus(value)}</Badge>;
}

function simplifyStatus(value: string) {
  const labels: Record<string, string> = { 주문완료: "완료", 결제완료: "완료", 결제대기: "대기", 결제실패: "실패", 환불완료: "환불완료" };
  return labels[value] ?? value;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

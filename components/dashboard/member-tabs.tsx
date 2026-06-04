"use client";

import { useState } from "react";
import { Coins, CreditCard, MessageSquareText, NotebookPen, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MemberRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "기본정보", icon: Sparkles },
  { id: "orders", label: "주문", icon: CreditCard },
  { id: "points", label: "포인트", icon: Coins },
  { id: "inquiries", label: "문의", icon: MessageSquareText },
  { id: "memos", label: "관리자메모", icon: NotebookPen },
] as const;

type TabId = (typeof tabs)[number]["id"];

type MemberPointHistory = {
  date: string;
  type: string;
  amount: number;
  balance: number;
  actor: string;
  reason: string;
};

const pointHistoryByMember: Record<string, MemberPointHistory[]> = {
  "SM-1024": [
    { date: "2026-06-04 10:24", type: "관리자 지급", amount: 5000, balance: 9850, actor: "관리자 김민수", reason: "CS 보상" },
    { date: "2026-06-01 09:00", type: "캠페인 지급", amount: 15000, balance: 4850, actor: "csv-import", reason: "6월 복귀 회원 리워드" },
    { date: "2026-05-29 14:11", type: "주문 사용", amount: -2000, balance: 4850, actor: "주문 시스템", reason: "비즈니스 회화 집중반 주문 사용" },
    { date: "2026-05-20 11:04", type: "학습 리워드", amount: 300, balance: 6850, actor: "system", reason: "7일 연속 학습" },
    { date: "2026-05-13 16:40", type: "주문 적립", amount: 1490, balance: 6550, actor: "주문 시스템", reason: "스페인어 베이직 구매 적립" },
  ],
  "SM-1023": [
    { date: "2026-06-04 09:18", type: "CSV 지급", amount: 3000, balance: 3300, actor: "csv-import", reason: "이벤트 지급" },
    { date: "2026-05-27 10:02", type: "신규 가입", amount: 300, balance: 300, actor: "system", reason: "회원가입 기본 적립" },
  ],
  "SM-1021": [
    { date: "2026-06-01 09:05", type: "지급 실패", amount: 0, balance: 2130, actor: "batch", reason: "휴면 회원" },
    { date: "2026-05-18 08:43", type: "캠페인 지급", amount: 12000, balance: 2130, actor: "csv-import", reason: "복귀 캠페인 대상" },
  ],
};

const pointHistoryTotalByMember: Record<string, number> = {
  "SM-1024": 15,
  "SM-1023": 2,
  "SM-1021": 8,
};

export function MemberTabs({ member }: { member: MemberRecord }) {
  const [active, setActive] = useState<TabId>("overview");
  const pointHistories = getPointHistories(member);
  const pointHistoryTotal = pointHistoryTotalByMember[member.id] ?? pointHistories.length;
  const inquiryCount = member.inquiries.length;
  const lessonQuestionCount = member.lessonQuestions.length;

  return (
    <Card>
      <CardHeader className="px-5 py-4">
        <CardTitle>유저 상세 처리 영역</CardTitle>
        <CardDescription>회원 기본정보와 주요 이력을 최소 탭으로 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <CountSummary label="주문" value={`${member.orders.length.toLocaleString()}건`} />
          <CountSummary label="포인트 내역" value={`${pointHistoryTotal.toLocaleString()}건`} />
          <CountSummary label="문의" value={`${inquiryCount.toLocaleString()}건`} />
          <CountSummary label="학습질문" value={`${lessonQuestionCount.toLocaleString()}건`} />
        </div>
        <div className="sticky top-4 z-20 mb-4 grid grid-cols-5 gap-2 rounded-2xl border border-slate-200 bg-slate-100/95 p-2 shadow-sm backdrop-blur">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold text-slate-500 transition-all",
                  active === tab.id && "bg-white text-indigo-600 shadow-sm",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {active === "overview" && <OverviewPanel member={member} />}
        {active === "orders" && <OrdersPanel member={member} />}
        {active === "points" && <PointPanel member={member} histories={pointHistories} />}
        {active === "inquiries" && <InquiryPanel member={member} />}
        {active === "memos" && <MemoPanel items={member.adminMemos} />}
      </CardContent>
    </Card>
  );
}

function CountSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="whitespace-nowrap text-xs font-black uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 whitespace-nowrap text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function OverviewPanel({ member }: { member: MemberRecord }) {
  const rows = [
    ["회원상태", member.status],
    ["고객구분", member.customerType],
    ["마케팅 수신", member.marketingConsent ? "동의" : "미동의"],
    ["가입일", member.joined],
    ["최근 로그인", member.lastLogin],
    ["휴대폰", member.phone],
    ["수강그룹", [...member.courses.map((course) => `강의: ${course}`), ...member.groups.map((group) => `그룹: ${group}`)].join("\n") || "수강/그룹 이력 없음"],
    ["쿠폰/바우처", [...member.coupons, ...member.vouchers].join("\n") || "보유 내역 없음"],
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border bg-white">
      <Table>
        <TableBody>
          {rows.map(([label, value]) => (
            <TableRow key={label}>
              <TableCell className="w-36 whitespace-nowrap bg-slate-50 font-black text-slate-500">{label}</TableCell>
              <TableCell className="min-w-96 whitespace-pre-line font-semibold text-slate-800">{value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OrdersPanel({ member }: { member: MemberRecord }) {
  const orders = member.orders;

  return (
    <div className="overflow-x-auto rounded-3xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {['주문일', '주문번호', '상품', '금액', '상태'].map((header) => <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length ? orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="whitespace-nowrap">{order.date}</TableCell>
              <TableCell className="whitespace-nowrap font-mono text-xs font-bold text-indigo-700">{order.id}</TableCell>
              <TableCell className="min-w-56 font-semibold">{order.product}</TableCell>
              <TableCell className="whitespace-nowrap text-right font-black">{formatCurrency(order.amount)}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant={order.status === "결제완료" ? "success" : "warning"}>{order.status}</Badge></TableCell>
            </TableRow>
          )) : (
            <TableRow><TableCell colSpan={5} className="py-10 text-center text-sm font-semibold text-slate-500">주문 내역이 없습니다.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function PointPanel({ member, histories }: { member: MemberRecord; histories: MemberPointHistory[] }) {
  return (
    <div className="overflow-x-auto rounded-3xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {['일시', '유형', '변경 포인트', '잔액', '처리자', '사유'].map((header) => <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {histories.map((history) => (
            <TableRow key={`${history.date}-${history.type}`}>
              <TableCell className="whitespace-nowrap">{history.date}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant={history.amount < 0 ? "rose" : history.amount > 0 ? "success" : "warning"}>{history.type}</Badge></TableCell>
              <TableCell className={cn("whitespace-nowrap text-right font-black", history.amount > 0 ? "text-emerald-600" : history.amount < 0 ? "text-rose-600" : "text-slate-600")}>{formatPointAmount(history.amount)}</TableCell>
              <TableCell className="whitespace-nowrap text-right font-bold">{history.balance.toLocaleString()}P</TableCell>
              <TableCell className="whitespace-nowrap font-semibold">{history.actor}</TableCell>
              <TableCell className="min-w-48">{history.reason}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function InquiryPanel({ member }: { member: MemberRecord }) {
  const rows = [
    ...member.inquiries.map((item, index) => ({ type: "일반 문의", item, date: index === 0 ? "2026-06-02" : "2026-05-30" })),
    ...member.lessonQuestions.map((item, index) => ({ type: "학습질문", item, date: index === 0 ? "2026-05-30" : "2026-05-28" })),
  ];

  return (
    <div className="overflow-x-auto rounded-3xl border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            {['유형', '내용', '상태', '최근 처리일'].map((header) => <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length ? rows.map((row) => {
            const status = getStatusFromText(row.item);
            return (
              <TableRow key={`${row.type}-${row.item}`}>
                <TableCell className="whitespace-nowrap"><Badge variant={row.type === "학습질문" ? "slate" : "warning"}>{row.type}</Badge></TableCell>
                <TableCell className="min-w-72 font-semibold text-slate-700">{row.item}</TableCell>
                <TableCell className="whitespace-nowrap"><Badge variant={status.includes("완료") || status.includes("답변 완료") ? "success" : "warning"}>{status}</Badge></TableCell>
                <TableCell className="whitespace-nowrap">{row.date}</TableCell>
              </TableRow>
            );
          }) : (
            <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm font-semibold text-slate-500">문의 또는 학습질문 내역이 없습니다.</TableCell></TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function MemoPanel({ items }: { items: string[] }) {
  const visibleItems = items.filter(Boolean);

  return (
    <div className="rounded-3xl border bg-white p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-black">관리자 메모 ({visibleItems.length})</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">최근 관리자 메모를 넓게 표시합니다.</p>
        </div>
        <button type="button" className="whitespace-nowrap rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-600 shadow-sm hover:bg-indigo-50">
          전체 보기
        </button>
      </div>
      <div className="overflow-x-auto rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              {['No.', '메모', '작성자', '작성일'].map((header) => <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>)}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleItems.length ? visibleItems.map((item, index) => (
              <TableRow key={`${item}-${index}`}>
                <TableCell className="whitespace-nowrap font-bold text-muted-foreground">{index + 1}</TableCell>
                <TableCell className="min-w-[28rem] whitespace-pre-line py-4 font-semibold text-slate-700">{item}</TableCell>
                <TableCell className="whitespace-nowrap font-semibold">관리자</TableCell>
                <TableCell className="whitespace-nowrap">{index === 0 ? "2026-06-03" : index === 1 ? "2026-05-29" : "2026-05-20"}</TableCell>
              </TableRow>
            )) : (
              <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm font-semibold text-slate-500">관리자 메모가 없습니다.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function getPointHistories(member: MemberRecord) {
  return pointHistoryByMember[member.id] ?? [
    { date: "2026-06-01 10:00", type: "관리자 지급", amount: member.points, balance: member.points, actor: "관리자", reason: "운영 조정" },
  ];
}

function getStatusFromText(value: string) {
  if (value.includes("처리 완료")) return "처리 완료";
  if (value.includes("답변 완료")) return "답변 완료";
  if (value.includes("답변 대기")) return "답변 대기";
  if (value.includes("처리 중")) return "처리 중";
  return "확인 필요";
}

function formatPointAmount(value: number) {
  if (value > 0) return `+${value.toLocaleString()}P`;
  if (value < 0) return `-${Math.abs(value).toLocaleString()}P`;
  return "0P";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

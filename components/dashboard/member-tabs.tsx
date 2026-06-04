"use client";

import { useState } from "react";
import { BookOpenCheck, Coins, CreditCard, Gift, LogIn, MessageSquareText, NotebookPen, Sparkles, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MemberRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "기본정보", icon: Sparkles },
  { id: "orders", label: "주문 내역", icon: CreditCard },
  { id: "learning", label: "수강/그룹", icon: BookOpenCheck },
  { id: "points", label: "포인트", icon: Coins },
  { id: "coupons", label: "쿠폰/바우처", icon: Gift },
  { id: "inquiries", label: "일반 문의", icon: MessageSquareText },
  { id: "questions", label: "학습 질문", icon: UsersRound },
  { id: "memos", label: "관리자 메모", icon: NotebookPen },
] as const;

export function MemberTabs({ member }: { member: MemberRecord }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview");
  const recentOrder = member.orders[0];
  const recentInquiry = member.inquiries[0] ?? member.lessonQuestions[0];
  const recentPoint = pointHistoryByMember[member.id]?.[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 상세 처리 영역</CardTitle>
        <CardDescription>목록에서 제거한 운영 정보를 탭별로 확인하고 처리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <RecentActivityCard
            icon={CreditCard}
            label="최근 주문"
            value={recentOrder ? `${recentOrder.date} · ${recentOrder.product}` : "주문 내역 없음"}
            target="주문 탭으로 이동"
            onClick={() => setActive("orders")}
          />
          <RecentActivityCard
            icon={LogIn}
            label="최근 로그인"
            value={member.lastLogin}
            target="기본정보 탭으로 이동"
            onClick={() => setActive("overview")}
          />
          <RecentActivityCard
            icon={Coins}
            label="최근 포인트 적립"
            value={recentPoint ? `${recentPoint.date} · ${formatPointAmount(recentPoint.amount)}` : `${member.points.toLocaleString()}P 보유`}
            target="포인트 탭으로 이동"
            onClick={() => setActive("points")}
          />
          <RecentActivityCard
            icon={MessageSquareText}
            label="최근 문의"
            value={recentInquiry ?? "문의 내역 없음"}
            target="문의 탭으로 이동"
            onClick={() => setActive("inquiries")}
          />
        </div>
        <div className="sticky top-4 z-20 mb-6 grid gap-2 rounded-2xl border border-slate-200 bg-slate-100/95 p-2 shadow-sm backdrop-blur md:grid-cols-4 xl:grid-cols-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-slate-500 transition-all",
                  active === tab.id && "bg-white text-indigo-600 shadow-sm",
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {active === "overview" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Info label="회원상태" value={member.status} />
            <Info label="고객구분" value={member.customerType} />
            <Info label="마케팅 수신" value={member.marketingConsent ? "동의" : "미동의"} />
            <Info label="가입일" value={member.joined} />
            <Info label="최근 로그인" value={member.lastLogin} />
            <Info label="휴대폰" value={member.phone} />
          </div>
        )}
        {active === "orders" && (
          <Panel
            title="주문 내역"
            items={member.orders.map((order) => `${order.date} · ${order.product} · ${formatCurrency(order.amount)} · ${order.status}`)}
            empty="주문 내역이 없습니다."
          />
        )}
        {active === "learning" && (
          <Panel
            title="수강/그룹"
            items={[...member.courses.map((course) => `수강 강의: ${course}`), ...member.groups.map((group) => `그룹: ${group}`), `완료 레슨: ${member.lessons.toLocaleString()}개`]}
            empty="수강 또는 그룹 이력이 없습니다."
          />
        )}
        {active === "points" && <PointPanel member={member} />}
        {active === "coupons" && (
          <Panel
            title="쿠폰/바우처"
            items={[...member.coupons.map((coupon) => `쿠폰: ${coupon}`), ...member.vouchers.map((voucher) => `바우처: ${voucher}`)]}
            empty="쿠폰/바우처 내역이 없습니다."
          />
        )}
        {active === "inquiries" && <Panel title="일반 문의" items={member.inquiries} empty="일반 문의 내역이 없습니다." />}
        {active === "questions" && <Panel title="학습 질문" items={member.lessonQuestions} empty="학습 질문 내역이 없습니다." />}
        {active === "memos" && <MemoPanel items={member.adminMemos} />}
      </CardContent>
    </Card>
  );
}

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


function RecentActivityCard({
  icon: Icon,
  label,
  value,
  target,
  onClick,
}: {
  icon: typeof CreditCard;
  label: string;
  value: string;
  target: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-3xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <div className="flex items-start gap-3">
        <span className="rounded-2xl bg-indigo-50 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
          <Icon className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-black uppercase tracking-wider text-slate-400">{label}</span>
          <span className="mt-1 block truncate text-sm font-black text-slate-900">{value}</span>
          <span className="mt-2 block text-xs font-bold text-indigo-600">{target}</span>
        </span>
      </div>
    </button>
  );
}

function MemoPanel({ items }: { items: string[] }) {
  const visibleItems = items.filter(Boolean);

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-black">관리자 메모 ({visibleItems.length})</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">최근 메모를 먼저 보여주며 전체 보기로 전체 이력을 확인합니다.</p>
        </div>
        <button type="button" className="rounded-2xl border border-indigo-200 bg-white px-4 py-2 text-sm font-black text-indigo-600 shadow-sm hover:bg-indigo-50">
          전체 보기
        </button>
      </div>
      <div className="mt-4 space-y-3">
        {(visibleItems.length ? visibleItems.slice(0, 3) : ["관리자 메모가 없습니다."]).map((item) => (
          <div key={item} className="whitespace-pre-line rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function PointPanel({ member }: { member: MemberRecord }) {
  const histories = pointHistoryByMember[member.id] ?? [
    { date: "2026-06-01 10:00", type: "관리자 지급", amount: member.points, balance: member.points, actor: "관리자", reason: "운영 조정" },
  ];
  const expiringPoints = histories.filter((history) => history.type.includes("캠페인") && history.amount > 0).reduce((sum, history) => sum + Math.round(history.amount * 0.6), 0);
  const recentEarnedAt = histories.find((history) => history.amount > 0)?.date ?? "-";
  const recentUsedAt = histories.find((history) => history.amount < 0)?.date ?? "-";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Info label="현재 보유 포인트" value={`${member.points.toLocaleString()}P`} />
        <Info label="소멸 예정 포인트" value={`${expiringPoints.toLocaleString()}P`} />
        <Info label="최근 적립일" value={recentEarnedAt} />
        <Info label="최근 사용일" value={recentUsedAt} />
      </div>
      <div className="overflow-x-auto rounded-3xl border bg-white">
        <Table>
          <TableHeader><TableRow><TableHead className="whitespace-nowrap">일시</TableHead><TableHead className="whitespace-nowrap">유형</TableHead><TableHead className="whitespace-nowrap">변경 포인트</TableHead><TableHead className="whitespace-nowrap">잔액</TableHead><TableHead className="whitespace-nowrap">처리자</TableHead><TableHead className="whitespace-nowrap">사유</TableHead></TableRow></TableHeader>
          <TableBody>
            {histories.map((history) => (
              <TableRow key={`${history.date}-${history.type}`}>
                <TableCell className="whitespace-nowrap">{history.date}</TableCell>
                <TableCell className="whitespace-nowrap"><Badge variant={history.amount < 0 ? "rose" : history.amount > 0 ? "success" : "warning"}>{history.type}</Badge></TableCell>
                <TableCell className={cn("whitespace-nowrap font-black", history.amount > 0 ? "text-emerald-600" : history.amount < 0 ? "text-rose-600" : "text-slate-600")}>{formatPointAmount(history.amount)}</TableCell>
                <TableCell className="whitespace-nowrap">{history.balance.toLocaleString()}P</TableCell>
                <TableCell className="whitespace-nowrap font-semibold">{history.actor}</TableCell>
                <TableCell className="min-w-48">{history.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function formatPointAmount(value: number) {
  if (value > 0) return `+${value.toLocaleString()}P`;
  if (value < 0) return `-${Math.abs(value).toLocaleString()}P`;
  return "0P";
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 whitespace-pre-line font-black text-slate-800">{value}</p>
    </div>
  );
}

function Panel({ title, items, empty = "표시할 내역이 없습니다." }: { title: string; items: string[]; empty?: string }) {
  const visibleItems = items.filter(Boolean);

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-6">
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 space-y-3">
        {(visibleItems.length ? visibleItems : [empty]).map((item) => (
          <div key={item} className="whitespace-pre-line rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 shadow-sm">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

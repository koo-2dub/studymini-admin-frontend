"use client";

import { useState } from "react";
import { BookOpenCheck, Coins, CreditCard, Gift, MessageSquareText, NotebookPen, Sparkles, UsersRound } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { MemberRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "기본 정보", icon: Sparkles },
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 상세 처리 영역</CardTitle>
        <CardDescription>목록에서 제거한 운영 정보를 탭별로 확인하고 처리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-2 rounded-2xl bg-slate-100 p-2 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="닉네임" value={member.name} />
            <Info label="User ID" value={member.id} />
            <Info label="이메일" value={member.email} />
            <Info label="전화번호" value={member.phone} />
            <Info label="회원상태" value={member.status} />
            <Info label="마케팅 수신동의" value={member.marketingConsent ? "동의" : "미동의"} />
            <Info label="가입일" value={member.joined} />
            <Info label="최근 로그인" value={member.lastLogin} />
            <Info label="고객구분" value={member.customerType} />
            <Info label="누적 주문수" value={`${member.orderCount.toLocaleString()}건`} />
            <Info label="누적 결제금액" value={formatCurrency(member.totalPayment)} />
            <Info label="수강상태" value={member.learningStatus} />
          </div>
        )}
        {active === "orders" && <Panel title="주문 내역" items={member.orders.map((order) => `${order.date} · ${order.product} · ${formatCurrency(order.amount)} · ${order.status}`)} empty="주문 내역이 없습니다." />}
        {active === "learning" && <Panel title="수강/그룹" items={[...member.courses.map((course) => `수강 강의: ${course}`), ...member.groups.map((group) => `그룹: ${group}`), `완료 레슨: ${member.lessons.toLocaleString()}개`]} empty="수강 또는 그룹 이력이 없습니다." />}
        {active === "points" && <Panel title="포인트" items={[`보유 포인트: ${member.points.toLocaleString()}P`, "최근 적립/사용 내역은 포인트 관리에서 교차 확인하세요."]} />}
        {active === "coupons" && <Panel title="쿠폰/바우처" items={[...member.coupons.map((coupon) => `쿠폰: ${coupon}`), ...member.vouchers.map((voucher) => `바우처: ${voucher}`)]} empty="쿠폰/바우처 내역이 없습니다." />}
        {active === "inquiries" && <Panel title="일반 문의" items={member.inquiries} empty="일반 문의 이력이 없습니다." />}
        {active === "questions" && <Panel title="학습 질문" items={member.lessonQuestions} empty="학습 질문 이력이 없습니다." />}
        {active === "memos" && <Panel title="관리자 메모" items={member.adminMemos} empty="관리자 메모가 없습니다." />}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-700">{value}</p>
    </div>
  );
}

function Panel({ title, items, empty = "표시할 내역이 없습니다." }: { title: string; items: string[]; empty?: string }) {
  const visibleItems = items.filter(Boolean);

  return (
    <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-6">
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 space-y-3">
        {(visibleItems.length ? visibleItems : [empty]).map((item) => <div key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 shadow-sm">{item}</div>)}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

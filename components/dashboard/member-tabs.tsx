"use client";

import type React from "react";
import { useState } from "react";
import { BookOpenCheck, ClipboardList, CreditCard, MessageSquareText, NotebookPen, Sparkles, TicketPercent, WalletCards } from "lucide-react";

import { MarketingBadge, StatusBadge } from "@/components/dashboard/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Member } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "basic", label: "기본 정보", icon: Sparkles },
  { id: "orders", label: "주문 내역", icon: CreditCard },
  { id: "classes", label: "수강/그룹", icon: BookOpenCheck },
  { id: "points", label: "포인트", icon: WalletCards },
  { id: "coupons", label: "쿠폰/바우처", icon: TicketPercent },
  { id: "inquiries", label: "일반 문의", icon: MessageSquareText },
  { id: "questions", label: "학습 질문", icon: ClipboardList },
  { id: "memo", label: "관리자 메모", icon: NotebookPen },
] as const;

export function MemberTabs({ member, timeline }: { member: Member; timeline: string[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("basic");

  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 상세 정보</CardTitle>
        <CardDescription>목록에서 제외한 운영 데이터를 탭별로 분리했습니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-2 rounded-2xl bg-slate-100 p-2 sm:grid-cols-2 xl:grid-cols-4">
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

        {active === "basic" && (
          <div className="grid gap-3 md:grid-cols-2">
            <Info label="닉네임" value={member.nickname} />
            <Info label="User ID" value={member.id} />
            <Info label="이메일" value={member.email} />
            <Info label="전화번호" value={member.phone} />
            <Info label="회원 상태" value={<StatusBadge value={member.status} />} />
            <Info label="마케팅 수신동의" value={<MarketingBadge agreed={member.marketingConsent} />} />
            <Info label="가입일" value={member.joined} />
            <Info label="최근 로그인" value={member.recentLogin} />
            <Info label="누적 주문수" value={`${member.orderCount.toLocaleString()}건`} />
            <Info label="누적 결제금액" value={member.spend} />
          </div>
        )}
        {active === "orders" && <Panel title="주문 내역" items={[`${member.orderCount.toLocaleString()}건의 누적 주문`, `${member.spend} 누적 결제금액`, "최근 결제: Pro Annual 갱신 완료"]} />}
        {active === "classes" && <Panel title="수강/그룹" items={[`${member.lessons.toLocaleString()}개 강의 수강`, `그룹/세그먼트: ${member.segment}`, ...timeline.filter((item) => item.includes("lesson") || item.includes("Algebra") || item.includes("Physics"))]} />}
        {active === "points" && <Panel title="포인트" items={[`현재 포인트: ${member.points.toLocaleString()}P`, "최근 적립: 학습 streak 보너스 +250P", "최근 차감: 코칭 바우처 교환 -1,000P"]} />}
        {active === "coupons" && <Panel title="쿠폰/바우처" items={["사용 쿠폰: SPRING26 25% 할인", "보유 바우처: 1:1 coaching", "만료 예정 쿠폰 없음"]} />}
        {active === "inquiries" && <Panel title="일반 문의" items={["최근 문의: 결제 영수증 이름 변경", "처리 상태: 답변 완료", "미처리 일반 문의 없음"]} />}
        {active === "questions" && <Panel title="학습 질문" items={["최근 질문: Physics Lab 08", "담당 선생님 배정 완료", "평균 답변 시간: 42분"]} />}
        {active === "memo" && <Panel title="관리자 메모" items={["VIP 상담 이력이 있어 결제 문의 우선 확인", "휴면 전환 전 리마인드 캠페인 발송 대상", "상태 변경은 이 탭에서 사유와 함께 기록"]} />}
      </CardContent>
    </Card>
  );
}

function Info({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
      <div className="mt-2 break-words text-sm font-black text-slate-800">{value}</div>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border bg-gradient-to-br from-white to-indigo-50 p-6">
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.map((item) => <div key={item} className="rounded-2xl bg-white/80 p-4 text-sm font-semibold text-slate-600 shadow-sm">{item}</div>)}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { BookOpenCheck, CreditCard, MessageSquareText, Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "개요", icon: Sparkles },
  { id: "orders", label: "주문", icon: CreditCard },
  { id: "lessons", label: "레슨", icon: BookOpenCheck },
  { id: "support", label: "문의", icon: MessageSquareText },
] as const;

type Member = {
  name: string;
  plan: string;
  spend: string;
  points: number;
  lessons: number;
  segment: string;
};

export function MemberTabs({ member, timeline }: { member: Member; timeline: string[] }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("overview");

  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 관리 워크스페이스</CardTitle>
        <CardDescription>유저 계정 운영에 필요한 정보를 탭으로 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid gap-2 rounded-2xl bg-slate-100 p-2 md:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActive(tab.id)}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition-all",
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
          <div className="grid gap-4 md:grid-cols-3">
            {["요금제: " + member.plan, "세그먼트: " + member.segment, "포인트: " + member.points.toLocaleString()].map((item) => (
              <div key={item} className="rounded-3xl border bg-white p-5 font-bold shadow-sm">{item}</div>
            ))}
          </div>
        )}
        {active === "orders" && <Panel title="결제 내역" items={[`${member.spend} 누적 결제`, "최근 갱신 결제 성공", "mock data 기준 차지백 없음"]} />}
        {active === "lessons" && <Panel title="학습 활동" items={[`${member.lessons}개 레슨 완료`, ...timeline.filter((item) => item.includes("lesson") || item.includes("Algebra") || item.includes("Physics"))]} />}
        {active === "support" && <Panel title="문의 컨텍스트" items={["선호 채널: 이메일", "최근 만족도 점수: 96%", "현재 에스컬레이션 없음"]} />}
      </CardContent>
    </Card>
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

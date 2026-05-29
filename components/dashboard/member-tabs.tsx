"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "basic", label: "기본 정보" },
  { id: "orders", label: "주문 내역" },
  { id: "courses", label: "수강/그룹" },
  { id: "points", label: "포인트" },
  { id: "coupons", label: "쿠폰/바우처" },
  { id: "general-inquiries", label: "일반 문의" },
  { id: "lesson-questions", label: "학습 질문" },
  { id: "admin-memos", label: "관리자 메모" },
] as const;

type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  customerType: string;
  status: string;
  marketingConsent: string;
  joined: string;
  lastLogin: string;
};

const placeholderContent: Record<Exclude<(typeof tabs)[number]["id"], "basic">, string> = {
  orders: "선택한 유저의 주문 내역을 확인합니다.",
  courses: "선택한 유저의 수강 강의와 그룹 배정 정보를 확인합니다.",
  points: "선택한 유저의 포인트 적립/사용 내역을 확인합니다.",
  coupons: "선택한 유저에게 발급된 쿠폰과 바우처를 확인합니다.",
  "general-inquiries": "선택한 유저의 일반 문의 접수 및 처리 내역을 확인합니다.",
  "lesson-questions": "선택한 유저의 학습 질문과 답변 상태를 확인합니다.",
  "admin-memos": "선택한 유저에 대한 내부 관리자 메모를 확인합니다.",
};

export function MemberTabs({ member }: { member: Member }) {
  const [active, setActive] = useState<(typeof tabs)[number]["id"]>("basic");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cn(
                "rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500 transition-colors",
                active === tab.id && "border-indigo-200 bg-indigo-50 text-indigo-700",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "basic" ? <BasicInfo member={member} /> : <EmptyPanel text={placeholderContent[active]} />}
      </CardContent>
    </Card>
  );
}

function BasicInfo({ member }: { member: Member }) {
  const rows = [
    { label: "닉네임", value: member.name },
    { label: "User ID", value: member.id },
    { label: "이메일", value: member.email },
    { label: "전화번호", value: member.phone },
    { label: "고객구분", value: member.customerType },
    { label: "회원상태", value: member.status },
    { label: "마케팅 수신동의", value: member.marketingConsent },
    { label: "가입일", value: member.joined },
    { label: "최근 로그인", value: member.lastLogin },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-bold text-slate-400">{row.label}</p>
          <p className="mt-2 text-sm font-semibold text-slate-800">{row.value}</p>
        </div>
      ))}
    </div>
  );
}

function EmptyPanel({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold text-slate-500">{text}</div>;
}

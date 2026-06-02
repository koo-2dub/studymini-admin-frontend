"use client";

import { ArrowLeft, CalendarClock, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { getGroupTypeTone, groupTypeOptions, type GroupType } from "../data";

const initialForm = {
  groupName: "",
  type: "마케팅" as GroupType,
  description: "",
  startedAt: "2026-06-10",
  endedAt: "2026-06-30",
  autoExpire: true,
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-slate-600">{children}</span>;
}

export default function CreateGroupPage() {
  const [form, setForm] = useState(initialForm);

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="그룹 생성"
        description="기간제 수강 권한을 제공할 새 그룹의 기본 정보를 입력합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lms/groups"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              취소
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60"
              title="생성 기능은 mock 상태입니다."
            >
              <Save className="h-4 w-4" />
              생성
            </button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">운영 기간</p>
              <p className="mt-1 font-bold text-slate-900">{form.startedAt} ~ {form.endedAt}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">자동 만료</p>
              <div className="mt-2"><Badge variant={form.autoExpire ? "success" : "slate"}>{form.autoExpire ? "ON" : "OFF"}</Badge></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">그룹 유형</p>
              <div className="mt-2"><Badge variant={getGroupTypeTone(form.type)}>{form.type}</Badge></div>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>그룹 생성에 필요한 필수 정보를 입력합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <FieldLabel>그룹명</FieldLabel>
              <input
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                placeholder="예: 레뷰 일본어 베이직 6월 체험단"
                value={form.groupName}
                onChange={(event) => updateForm("groupName", event.target.value)}
              />
            </label>
            <label>
              <FieldLabel>그룹 유형</FieldLabel>
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={form.type}
                onChange={(event) => updateForm("type", event.target.value as GroupType)}
              >
                {groupTypeOptions.filter((option) => option !== "전체").map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label>
              <FieldLabel>시작일</FieldLabel>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={form.startedAt}
                onChange={(event) => updateForm("startedAt", event.target.value)}
              />
            </label>
            <label>
              <FieldLabel>종료일</FieldLabel>
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={form.endedAt}
                onChange={(event) => updateForm("endedAt", event.target.value)}
              />
            </label>
          </div>
          <label className="block">
            <FieldLabel>설명</FieldLabel>
            <textarea
              className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
              placeholder="그룹 목적과 제공 기간을 입력하세요."
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
            />
          </label>
          <div>
            <FieldLabel>자동 만료</FieldLabel>
            <button
              type="button"
              className="mt-2 flex h-10 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
              onClick={() => updateForm("autoExpire", !form.autoExpire)}
            >
              <span>종료일 이후 수업 접근 권한 자동 회수</span>
              <Badge variant={form.autoExpire ? "success" : "slate"}>{form.autoExpire ? "ON" : "OFF"}</Badge>
            </button>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-800">
            자동 만료 기본값은 ON입니다. 종료일이 지나면 참여 유저는 해당 그룹의 수업 접근 권한을 잃습니다.
          </div>
        </CardContent>
      </Card>
    </>
  );
}

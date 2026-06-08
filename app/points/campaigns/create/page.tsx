"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarClock, FileSpreadsheet, Search, Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { campaignPurposes, formatPoints, pointTypes, type PointCampaignPurpose, type PointType } from "../../data";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" {...props} />;
}

function Select({ children, value, defaultValue, onChange }: { children: React.ReactNode; value?: string; defaultValue?: string; onChange?: React.ChangeEventHandler<HTMLSelectElement> }) {
  const selectProps = onChange ? { value, onChange } : { defaultValue: defaultValue ?? value };

  return <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" {...selectProps}>{children}</select>;
}

const previewTargets = [
  { name: "지윤 김", email: "jiyoon.kim@example.com", userId: "SM-1024", points: 5000, status: "검증 완료" },
  { name: "민서 박", email: "minseo.park@example.com", userId: "SM-1023", points: 5000, status: "검증 완료" },
  { name: "Sora Choi", email: "sora.choi@example.com", userId: "SM-1021", points: 5000, status: "검증 완료" },
];

export default function PointCampaignCreatePage() {
  const [pointType, setPointType] = useState<PointType>("일반 포인트");
  const [purpose, setPurpose] = useState<PointCampaignPurpose>("신규가입");
  const expectedTargetCount = previewTargets.length;
  const expectedTotal = previewTargets.reduce((sum, target) => sum + target.points, 0);
  const expectedExpiringTotal = pointType === "기간제 포인트" ? expectedTotal : 0;
  const summaryText = useMemo(() => {
    if (pointType === "일반 포인트") return "일반 포인트 · 지급일 기준 유효기간 설정";
    return "기간제 포인트 · 지급일과 만료일 설정";
  }, [pointType]);

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 캠페인 생성"
        description="신규가입, 이벤트, 리뷰, 복귀회원, 환급 이벤트 등 포인트 지급 캠페인을 생성합니다."
        action={<Button asChild variant="secondary"><Link href="/points">포인트 관리로</Link></Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>캠페인명, 목적, 포인트 유형, 관리자 메모를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="캠페인명"><Input defaultValue="신규가입 기본 포인트" /></Field>
            <Field label="캠페인 목적"><Select value={purpose} onChange={(event) => setPurpose(event.target.value as PointCampaignPurpose)}>{campaignPurposes.map((option) => <option key={option}>{option}</option>)}</Select></Field>
            <Field label="포인트 유형"><Select value={pointType} onChange={(event) => setPointType(event.target.value as PointType)}>{pointTypes.map((option) => <option key={option}>{option}</option>)}</Select></Field>
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              관리자 메모
              <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" defaultValue={`${purpose} 목적의 ${pointType} 지급 캠페인입니다.`} />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-primary" />지급 및 유효기간 설정</CardTitle>
            <CardDescription>포인트 유형에 따라 지급일 이후 필요한 유효기간 또는 만료일만 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="지급 포인트"><Input defaultValue="5000" /></Field>
            <Field label="지급 대상"><Select value="선택/CSV 대상"><option>선택/CSV 대상</option><option>조건 충족 전체 회원</option><option>신규가입 회원</option></Select></Field>
            <Field label="지급일"><Input type="date" defaultValue="2026-07-01" /></Field>
            {pointType === "일반 포인트" ? (
              <Field label="유효기간"><Select value="정책 기본값 12개월"><option>정책 기본값 12개월</option><option>6개월</option><option>12개월</option><option>24개월</option></Select></Field>
            ) : (
              <Field label="만료일"><Input type="date" defaultValue="2026-07-31" /></Field>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>지급 대상 추가</CardTitle>
            <CardDescription>회원 검색 또는 CSV 업로드로 지급 대상자를 추가합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <Field label="회원 검색">
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="이름, 이메일, User ID" />
                  </div>
                </Field>
                <Button className="w-full" variant="secondary">검색 회원 추가</Button>
              </div>
              <div className="rounded-2xl border-2 border-dashed border-indigo-100 bg-indigo-50/60 p-6 text-center">
                <FileSpreadsheet className="mx-auto h-10 w-10 text-primary" />
                <p className="mt-3 text-sm font-black">CSV 업로드</p>
                <p className="mt-1 text-xs text-slate-500">user_id, email, points 컬럼을 사용하는 템플릿입니다.</p>
                <Button className="mt-4" variant="secondary">CSV 파일 선택</Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">예상 지급 대상</p><p className="mt-2 text-2xl font-black text-slate-950">{expectedTargetCount}명</p><p className="mt-1 text-xs font-semibold text-indigo-700">선택/업로드 즉시 반영</p></div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">예상 지급 포인트</p><p className="mt-2 text-2xl font-black text-slate-950">{formatPoints(expectedTotal)}</p><p className="mt-1 text-xs font-semibold text-emerald-700">대상별 지급 포인트 합계</p></div>
              <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4"><p className="text-xs font-bold text-rose-700">예상 소멸 예정 포인트</p><p className="mt-2 text-2xl font-black text-slate-950">{formatPoints(expectedExpiringTotal)}</p><p className="mt-1 text-xs font-semibold text-rose-700">기간제 포인트 선택 시 반영</p></div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead className="whitespace-nowrap">이름</TableHead><TableHead className="whitespace-nowrap">이메일</TableHead><TableHead className="whitespace-nowrap">User ID</TableHead><TableHead className="whitespace-nowrap">지급 포인트</TableHead><TableHead className="whitespace-nowrap">상태</TableHead></TableRow></TableHeader>
                <TableBody>
                  {previewTargets.map((target) => (
                    <TableRow key={target.userId}>
                      <TableCell className="whitespace-nowrap font-semibold">{target.name}</TableCell>
                      <TableCell className="whitespace-nowrap">{target.email}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs font-bold text-primary">{target.userId}</TableCell>
                      <TableCell className="whitespace-nowrap font-black">{formatPoints(target.points)}</TableCell>
                      <TableCell className="whitespace-nowrap"><Badge variant="success">{target.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />검토 요약</CardTitle>
            <CardDescription>저장 전 캠페인 설정과 예상 지급 규모를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">캠페인 설정 요약</p><p className="mt-2 font-black text-slate-950">{purpose} · {summaryText}</p></div>
              <div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">예상 지급 대상 수</p><p className="mt-2 text-2xl font-black text-slate-950">{expectedTargetCount}명</p></div>
              <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">예상 총 지급 포인트</p><p className="mt-2 text-2xl font-black text-slate-950">{formatPoints(expectedTotal)}</p></div>
              <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-bold text-rose-700">예상 소멸 예정 포인트</p><p className="mt-2 text-2xl font-black text-slate-950">{formatPoints(expectedExpiringTotal)}</p></div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button asChild variant="secondary"><Link href="/points">취소</Link></Button>
              <Button type="button"><Send className="mr-2 h-4 w-4" />저장</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

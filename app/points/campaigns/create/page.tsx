import Link from "next/link";
import { FileSpreadsheet, Search, Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPoints } from "../../data";

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

function Select({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
  return <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={defaultValue}>{children}</select>;
}

const previewTargets = [
  { name: "지윤 김", email: "jiyoon.kim@example.com", userId: "SM-1024", points: 5000, status: "검증 완료" },
  { name: "민서 박", email: "minseo.park@example.com", userId: "SM-1023", points: 5000, status: "검증 완료" },
  { name: "Sora Choi", email: "sora.choi@example.com", userId: "SM-1021", points: 5000, status: "검증 완료" },
];

export default function PointCampaignCreatePage() {
  const expectedTotal = previewTargets.reduce((sum, target) => sum + target.points, 0);

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="기간제한 포인트 캠페인 생성"
        description="기간, 만료 기준, 지급 설정, 대상자를 Mock UI로 구성하고 저장 전 요약을 검토합니다."
        action={<Button asChild variant="secondary"><Link href="/points">포인트 관리로</Link></Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>운영자가 캠페인을 식별할 수 있는 이름, 코드, 상태를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Field label="캠페인명"><Input defaultValue="7월 장기 미사용 회원 리마인드" /></Field>
            <Field label="캠페인 코드"><Input defaultValue="POINT-REMIND-202607" /></Field>
            <Field label="월렛 선택"><Select defaultValue="기간제 포인트"><option>기간제 포인트</option><option>이벤트 포인트</option><option>일반 포인트</option></Select></Field>
            <Field label="상태"><Select defaultValue="예정"><option>예정</option><option>진행중</option><option>종료</option></Select></Field>
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              설명/메모
              <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" defaultValue="30일 이상 접속하지 않은 회원에게 재방문 유도를 위한 기간제한 포인트를 지급합니다." />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>기간/만료 설정</CardTitle>
            <CardDescription>지급 가능 기간, 실제 사용 가능 기간, 만료 기준을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Field label="지급 가능 시작일"><Input type="date" defaultValue="2026-07-01" /></Field>
            <Field label="지급 가능 종료일"><Input type="date" defaultValue="2026-07-31" /></Field>
            <Field label="사용 시작일"><Input type="date" defaultValue="2026-07-01" /></Field>
            <Field label="사용 종료일"><Input type="date" defaultValue="2026-08-15" /></Field>
            <Field label="만료 기준"><Select defaultValue="사용 종료일 23:59"><option>사용 종료일 23:59</option><option>캠페인 종료일</option><option>지급일 기준 30일</option></Select></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>지급 설정</CardTitle>
            <CardDescription>지급 포인트와 발송 여부, 관리자 사유를 지정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="기본 지급 포인트"><Input defaultValue="5000" /></Field>
            <Field label="지급 유형"><Select defaultValue="고정 포인트"><option>고정 포인트</option><option>회원별 포인트</option></Select></Field>
            <Field label="알림 발송 여부"><Select defaultValue="발송"><option>발송</option><option>미발송</option></Select></Field>
            <Field label="관리자 사유"><Select defaultValue="리마인드 이벤트"><option>리마인드 이벤트</option><option>CS 보상</option><option>마케팅 캠페인</option><option>기타</option></Select></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>대상자 추가</CardTitle>
            <CardDescription>회원 검색 또는 CSV 업로드로 대상자를 추가하는 Mock UI입니다.</CardDescription>
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
                <p className="mt-1 text-xs text-slate-500">user_id, email, points 컬럼을 사용하는 Mock 템플릿입니다.</p>
                <Button className="mt-4" variant="secondary">CSV 파일 선택</Button>
              </div>
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
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">캠페인 설정 요약</p><p className="mt-2 font-black text-slate-950">기간제 포인트 · 예정 · 사용 종료일 만료</p></div>
              <div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">예상 지급 대상 수</p><p className="mt-2 text-2xl font-black text-slate-950">{previewTargets.length}명</p></div>
              <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">예상 총 지급 포인트</p><p className="mt-2 text-2xl font-black text-slate-950">{formatPoints(expectedTotal)}</p></div>
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

import { ArrowLeft, CalendarDays, FileUp, Search, ShieldCheck, UserPlus } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const selectedContents = [
  { type: "코스", name: "스페인어 베이직", status: "공개", category: "스페인어" },
  { type: "패키지", name: "프리미엄 회화 패키지", status: "공개", category: "패키지" },
];

const previewMembers = [
  { name: "지윤 김", email: "jiyoon.kim@example.com", id: "SM-1024", status: "정상" },
  { name: "민서 박", email: "minseo.park@example.com", id: "SM-1023", status: "정상" },
];

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="text-sm font-bold text-slate-600">{children}</span>;
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" {...props} />;
}

function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" {...props} />;
}

export default function TrialCreateMockPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 생성"
        description="기본 정보, 기간, 대상 코스/패키지, 회원 추가 영역을 배치한 체험단 생성 화면입니다."
        action={
          <Link
            href="/access/trials"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>체험단명과 내부 운영 정보를 입력하는 영역입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>체험단명</FieldLabel>
                  <FormInput defaultValue="2026 여름 프리미엄 체험단" />
                </label>
                <label>
                  <FieldLabel>담당자</FieldLabel>
                  <FormInput defaultValue="Admin Team" />
                </label>
              </div>
              <label className="block">
                <FieldLabel>설명</FieldLabel>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                  defaultValue="마케팅 모집 리스트 기반으로 코스와 패키지 체험 권한을 기간 한정 부여합니다."
                />
              </label>
              <label className="block">
                <FieldLabel>관리자 메모</FieldLabel>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                  placeholder="내부 운영 메모를 입력하세요."
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-indigo-500" />
                <CardTitle>기간 / 권한 정책</CardTitle>
              </div>
              <CardDescription>종료일 이후 체험단 권한은 자동 만료되는 것으로 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>시작일</FieldLabel>
                  <FormInput type="date" defaultValue="2026-06-01" />
                </label>
                <label>
                  <FieldLabel>종료일</FieldLabel>
                  <FormInput type="date" defaultValue="2026-06-30" />
                </label>
                <label>
                  <FieldLabel>권한 부여 시점</FieldLabel>
                  <FormSelect defaultValue="시작일 자동 부여">
                    <option>시작일 자동 부여</option>
                    <option>즉시 부여</option>
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>종료 후 처리</FieldLabel>
                  <FormSelect defaultValue="자동 만료">
                    <option>자동 만료</option>
                    <option>수동 확인</option>
                  </FormSelect>
                </label>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                체험단 만료 시 체험단으로 부여된 권한만 회수되며 기존 유료 수강권은 유지됩니다.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대상 코스 / 패키지</CardTitle>
              <CardDescription>콘텐츠 검색과 선택 목록을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button variant="outline" disabled><Search className="h-4 w-4" /> 콘텐츠 검색</Button>
                <Button variant="outline" disabled>코스 + 패키지 선택</Button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>유형</TableHead>
                      <TableHead>콘텐츠명</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedContents.map((content) => (
                      <TableRow key={content.name}>
                        <TableCell><Badge variant="default">{content.type}</Badge></TableCell>
                        <TableCell className="font-semibold">{content.name}</TableCell>
                        <TableCell><Badge variant="success">{content.status}</Badge></TableCell>
                        <TableCell>{content.category}</TableCell>
                        <TableCell><Button size="sm" variant="ghost" disabled>제거</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>참여 회원</CardTitle>
              <CardDescription>회원 검색과 CSV 업로드는 실제 기능 연결 전 화면 요소만 구성합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                <Button variant="outline" disabled><UserPlus className="h-4 w-4" /> 회원 검색</Button>
                <Button variant="outline" disabled><FileUp className="h-4 w-4" /> CSV 업로드</Button>
                <Button variant="outline" disabled>CSV 템플릿 다운로드</Button>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>회원명</TableHead>
                      <TableHead>이메일</TableHead>
                      <TableHead>회원 ID</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-semibold">{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.id}</TableCell>
                        <TableCell><Badge variant="success">{member.status}</Badge></TableCell>
                        <TableCell><Button size="sm" variant="ghost" disabled>제외</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <CardTitle>생성 요약</CardTitle>
              </div>
              <CardDescription>저장 전 설정 내용을 확인하는 요약 카드입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">상태</span><Badge variant="warning">예정</Badge></div>
              <div className="flex justify-between"><span className="text-slate-500">대상 콘텐츠</span><strong>2개</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">참여 회원</span><strong>2명</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">만료 정책</span><strong>자동 만료</strong></div>
              <Button className="w-full" disabled>체험단 생성</Button>
              <Button className="w-full" variant="outline" disabled>임시저장</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

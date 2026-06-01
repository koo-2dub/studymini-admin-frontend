"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AnswerStatusBadge, PublicStatusBadge } from "@/components/dashboard/inquiry-badges";
import { ClickableTable, CourseLink, FilterActions, Pagination, SelectInput, SummaryGrid, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput, UserLink } from "@/components/dashboard/inquiry-shared";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LessonInquiry } from "@/lib/mock-data";

const PAGE_SIZE = 4;
const TODAY = "2026-06-01";
const defaultFilters = { query: "", startDate: "", endDate: "", language: "all", publicStatus: "all", answerStatus: "all", assignee: "all", course: "all" };
const languageOptions = ["영어", "일본어", "중국어", "스페인어", "프랑스어", "독일어", "이탈리아어", "러시아어", "아랍어", "포르투갈어", "한국어"];

export function LessonInquiriesDashboard({ inquiries }: { inquiries: LessonInquiry[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(defaultFilters);
  const [trashOnly, setTrashOnly] = useState(false);
  const [page, setPage] = useState(1);
  const assignees = useMemo(() => Array.from(new Set(inquiries.map((item) => item.assignee))), [inquiries]);
  const courses = useMemo(() => Array.from(new Set(inquiries.map((item) => item.courseDisplay))), [inquiries]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const searchable = [item.inquiryId, item.userName, item.email, item.userId, item.question, item.content, item.courseDisplay].join(" ").toLowerCase();
      return (!trashOnly || item.publicStatus === "휴지통")
        && (!q || searchable.includes(q))
        && (!filters.startDate || item.createdAt.slice(0, 10) >= filters.startDate)
        && (!filters.endDate || item.createdAt.slice(0, 10) <= filters.endDate)
        && (filters.language === "all" || item.language === filters.language)
        && (filters.publicStatus === "all" || item.publicStatus === filters.publicStatus)
        && (filters.answerStatus === "all" || item.answerStatus === filters.answerStatus)
        && (filters.assignee === "all" || item.assignee === filters.assignee)
        && (filters.course === "all" || item.courseDisplay === filters.course);
    });
  }, [filters, inquiries, trashOnly]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const reset = () => { setFilters(defaultFilters); setTrashOnly(false); setPage(1); };
  const update = (key: keyof typeof filters, value: string) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1); };

  return (
    <>
      <SummaryGrid items={[
        { label: "전체 학습 문의", value: inquiries.length, tone: "text-slate-950" },
        { label: "미답변", value: inquiries.filter((i) => i.answerStatus === "미답변").length, tone: "text-amber-600" },
        { label: "답변완료", value: inquiries.filter((i) => i.answerStatus === "답변완료").length, tone: "text-emerald-600" },
        { label: "보류", value: inquiries.filter((i) => i.answerStatus === "보류").length, tone: "text-slate-500" },
        { label: "오늘 접수", value: inquiries.filter((i) => i.createdAt.startsWith(TODAY)).length, tone: "text-indigo-600" },
      ]} />
      <Card className="mb-6">
        <CardHeader><CardTitle>학습 문의 필터</CardTitle><CardDescription>승인 전 질문은 공개되지 않으며, 휴지통은 탭 또는 공개 상태 필터로 확인할 수 있습니다.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2"><Button variant={!trashOnly ? "default" : "outline"} onClick={() => { setTrashOnly(false); setPage(1); }}>전체 목록</Button><Button variant={trashOnly ? "default" : "outline"} onClick={() => { setTrashOnly(true); update("publicStatus", "all"); }}>휴지통 보기</Button></div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <label className="space-y-2 text-sm font-bold text-slate-600">검색<TextInput value={filters.query} onChange={(e) => update("query", e.target.value)} placeholder="문의번호, 유저명, 이메일, User ID, 질문 내용, 강의명" /></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">언어<SelectInput value={filters.language} onChange={(e) => update("language", e.target.value)}><option value="all">전체</option>{languageOptions.map((lang) => <option key={lang}>{lang}</option>)}</SelectInput></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">공개 상태<SelectInput value={filters.publicStatus} onChange={(e) => update("publicStatus", e.target.value)}><option value="all">전체</option><option>승인 대기</option><option>승인됨</option><option>휴지통</option></SelectInput></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">답변 상태<SelectInput value={filters.answerStatus} onChange={(e) => update("answerStatus", e.target.value)}><option value="all">전체</option><option>미답변</option><option>답변완료</option><option>보류</option></SelectInput></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">담당자<SelectInput value={filters.assignee} onChange={(e) => update("assignee", e.target.value)}><option value="all">전체</option>{assignees.map((name) => <option key={name}>{name}</option>)}</SelectInput></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">강의<SelectInput value={filters.course} onChange={(e) => update("course", e.target.value)}><option value="all">전체</option>{courses.map((course) => <option key={course}>{course}</option>)}</SelectInput></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">문의일 시작<TextInput type="date" value={filters.startDate} onChange={(e) => update("startDate", e.target.value)} /></label>
            <label className="space-y-2 text-sm font-bold text-slate-600">문의일 종료<TextInput type="date" value={filters.endDate} onChange={(e) => update("endDate", e.target.value)} /></label>
            <FilterActions onReset={reset} />
          </div>
        </CardContent>
      </Card>
      {trashOnly ? <TrashTable items={paged} routerPush={(id) => router.push(`/inquiries/lesson/${id}`)} /> : <NormalTable items={paged} routerPush={(id) => router.push(`/inquiries/lesson/${id}`)} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

function NormalTable({ items, routerPush }: { items: LessonInquiry[]; routerPush: (id: string) => void }) {
  return <ClickableTable title="학습 문의 목록" description="강의 정보는 임시로 studymini.com 새 탭을 열며, 행 클릭 시 상세로 이동합니다.">
    <TableHeader><TableRow><TableHead>문의번호</TableHead><TableHead>유저</TableHead><TableHead>User ID</TableHead><TableHead>언어</TableHead><TableHead>강의 정보</TableHead><TableHead>질문 미리보기</TableHead><TableHead>공개 상태</TableHead><TableHead>답변 상태</TableHead><TableHead>담당자</TableHead><TableHead>문의일</TableHead><TableHead>답변일</TableHead></TableRow></TableHeader>
    <TableBody>{items.map((item) => <TableRow key={item.inquiryId} className="cursor-pointer" onClick={() => routerPush(item.inquiryId)}><TableCell className="font-mono text-xs font-bold">{item.inquiryId}</TableCell><TableCell><UserLink userId={item.userId}>{item.userName}</UserLink></TableCell><TableCell><UserLink userId={item.userId}>{item.userId}</UserLink></TableCell><TableCell>{item.language}</TableCell><TableCell><CourseLink>{item.courseDisplay}</CourseLink></TableCell><TableCell className="max-w-[260px] truncate text-slate-500">{item.question}</TableCell><TableCell><PublicStatusBadge value={item.publicStatus} /></TableCell><TableCell><AnswerStatusBadge value={item.answerStatus} /></TableCell><TableCell>{item.assignee}</TableCell><TableCell>{item.createdAt}</TableCell><TableCell>{item.answeredAt}</TableCell></TableRow>)}</TableBody>
  </ClickableTable>;
}

function TrashTable({ items, routerPush }: { items: LessonInquiry[]; routerPush: (id: string) => void }) {
  const permanentDelete = (id: string) => {
    if (window.confirm(`${id} 학습 문의를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      window.alert("목업 화면입니다. 실제 영구 삭제 API 연동 전입니다.");
    }
  };
  return <ClickableTable title="학습 문의 휴지통" description="휴지통 문의는 복구할 수 있으며, 영구 삭제는 확인 창을 거칩니다.">
    <TableHeader><TableRow><TableHead>문의번호</TableHead><TableHead>유저</TableHead><TableHead>User ID</TableHead><TableHead>언어</TableHead><TableHead>강의 정보</TableHead><TableHead>질문 미리보기</TableHead><TableHead>삭제일</TableHead><TableHead>삭제한 관리자</TableHead><TableHead>액션</TableHead></TableRow></TableHeader>
    <TableBody>{items.map((item) => <TableRow key={item.inquiryId} className="cursor-pointer" onClick={() => routerPush(item.inquiryId)}><TableCell className="font-mono text-xs font-bold">{item.inquiryId}</TableCell><TableCell><UserLink userId={item.userId}>{item.userName}</UserLink></TableCell><TableCell><UserLink userId={item.userId}>{item.userId}</UserLink></TableCell><TableCell>{item.language}</TableCell><TableCell><CourseLink>{item.courseDisplay}</CourseLink></TableCell><TableCell className="max-w-[260px] truncate text-slate-500">{item.question}</TableCell><TableCell>{item.deletedAt ?? "-"}</TableCell><TableCell>{item.deletedBy ?? "-"}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); window.alert("목업 화면입니다. 복구 API 연동 전입니다."); }}>복구</Button><Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); permanentDelete(item.inquiryId); }}>영구 삭제</Button></div></TableCell></TableRow>)}</TableBody>
  </ClickableTable>;
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { AnswerStatusBadge } from "@/components/dashboard/inquiry-badges";
import { ClickableTable, FilterActions, Pagination, SelectInput, SummaryGrid, TableBody, TableCell, TableHead, TableHeader, TableRow, TextInput, UserLink } from "@/components/dashboard/inquiry-shared";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { GeneralInquiry } from "@/lib/mock-data";

const PAGE_SIZE = 4;
const TODAY = "2026-06-01";
const defaultFilters = { query: "", startDate: "", endDate: "", status: "all", assignee: "all" };

export function GeneralInquiriesDashboard({ inquiries }: { inquiries: GeneralInquiry[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const assignees = useMemo(() => Array.from(new Set(inquiries.map((item) => item.assignee))), [inquiries]);

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    return inquiries.filter((item) => {
      const searchable = [item.inquiryId, item.userName, item.email, item.userId, item.title, item.content].join(" ").toLowerCase();
      return (!q || searchable.includes(q))
        && (!filters.startDate || item.createdAt.slice(0, 10) >= filters.startDate)
        && (!filters.endDate || item.createdAt.slice(0, 10) <= filters.endDate)
        && (filters.status === "all" || item.status === filters.status)
        && (filters.assignee === "all" || item.assignee === filters.assignee);
    });
  }, [filters, inquiries]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const reset = () => { setFilters(defaultFilters); setPage(1); };
  const update = (key: keyof typeof filters, value: string) => { setFilters((prev) => ({ ...prev, [key]: value })); setPage(1); };

  return (
    <>
      <SummaryGrid items={[
        { label: "전체 문의", value: inquiries.length, tone: "text-slate-950" },
        { label: "미답변", value: inquiries.filter((i) => i.status === "미답변").length, tone: "text-amber-600" },
        { label: "답변완료", value: inquiries.filter((i) => i.status === "답변완료").length, tone: "text-emerald-600" },
        { label: "보류", value: inquiries.filter((i) => i.status === "보류").length, tone: "text-slate-500" },
        { label: "오늘 접수", value: inquiries.filter((i) => i.createdAt.startsWith(TODAY)).length, tone: "text-indigo-600" },
      ]} />
      <Card className="mb-6">
        <CardHeader><CardTitle>일반 문의 필터</CardTitle><CardDescription>문의번호, 유저, 이메일, User ID, 제목, 내용과 기간·답변상태·담당자를 조합해 조회합니다.</CardDescription></CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
          <label className="space-y-2 text-sm font-bold text-slate-600">검색<TextInput value={filters.query} onChange={(e) => update("query", e.target.value)} placeholder="문의번호, 유저명, 이메일, User ID, 제목, 내용" /></label>
          <label className="space-y-2 text-sm font-bold text-slate-600">문의일 시작<TextInput type="date" value={filters.startDate} onChange={(e) => update("startDate", e.target.value)} /></label>
          <label className="space-y-2 text-sm font-bold text-slate-600">문의일 종료<TextInput type="date" value={filters.endDate} onChange={(e) => update("endDate", e.target.value)} /></label>
          <label className="space-y-2 text-sm font-bold text-slate-600">답변상태<SelectInput value={filters.status} onChange={(e) => update("status", e.target.value)}><option value="all">전체</option><option>미답변</option><option>답변완료</option><option>보류</option></SelectInput></label>
          <label className="space-y-2 text-sm font-bold text-slate-600">담당자<SelectInput value={filters.assignee} onChange={(e) => update("assignee", e.target.value)}><option value="all">전체</option>{assignees.map((name) => <option key={name}>{name}</option>)}</SelectInput></label>
          <FilterActions onReset={reset} />
        </CardContent>
      </Card>
      <ClickableTable title="일반 문의 목록" description="행을 클릭하면 일반 문의 상세로 이동합니다. 유저명 또는 User ID는 유저 상세로 연결됩니다.">
        <TableHeader><TableRow><TableHead>문의번호</TableHead><TableHead>유저</TableHead><TableHead>User ID</TableHead><TableHead>이메일</TableHead><TableHead>제목</TableHead><TableHead>내용 미리보기</TableHead><TableHead>답변상태</TableHead><TableHead>담당자</TableHead><TableHead>문의일</TableHead><TableHead>답변일</TableHead></TableRow></TableHeader>
        <TableBody>{paged.map((item) => (
          <TableRow key={item.inquiryId} className="cursor-pointer" onClick={() => router.push(`/inquiries/general/${item.inquiryId}`)}>
            <TableCell className="font-mono text-xs font-bold">{item.inquiryId}</TableCell><TableCell><UserLink userId={item.userId}>{item.userName}</UserLink></TableCell><TableCell><UserLink userId={item.userId}>{item.userId}</UserLink></TableCell><TableCell>{item.email}</TableCell><TableCell className="font-bold">{item.title}</TableCell><TableCell className="max-w-[260px] truncate text-slate-500">{item.content}</TableCell><TableCell><AnswerStatusBadge value={item.status} /></TableCell><TableCell>{item.assignee}</TableCell><TableCell>{item.createdAt}</TableCell><TableCell>{item.answeredAt}</TableCell>
          </TableRow>
        ))}</TableBody>
      </ClickableTable>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

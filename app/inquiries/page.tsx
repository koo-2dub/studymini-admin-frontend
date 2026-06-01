import type { ReactNode } from "react";

import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

import { generalInquiries, inquiryAssignees, inquiryStatuses, type InquiryStatus } from "./data";

type InquirySearchParams = {
  q?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  assignee?: string;
};

const statusVariants: Record<InquiryStatus, "success" | "warning" | "slate"> = {
  미답변: "warning",
  답변완료: "success",
  보류: "slate",
};

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<InquirySearchParams> }) {
  const filters = await searchParams;
  const filteredInquiries = generalInquiries.filter((inquiry) => {
    const keyword = filters.q?.trim().toLowerCase();
    const inquiryDate = inquiry.createdAt.slice(0, 10);
    const matchesKeyword = keyword
      ? [inquiry.userName, inquiry.email, inquiry.title, inquiry.content].some((value) => value.toLowerCase().includes(keyword))
      : true;
    const matchesStartDate = filters.startDate ? inquiryDate >= filters.startDate : true;
    const matchesEndDate = filters.endDate ? inquiryDate <= filters.endDate : true;
    const matchesStatus = filters.status && filters.status !== "전체" ? inquiry.status === filters.status : true;
    const matchesAssignee = filters.assignee && filters.assignee !== "전체" ? inquiry.assignee === filters.assignee : true;

    return matchesKeyword && matchesStartDate && matchesEndDate && matchesStatus && matchesAssignee;
  });

  return (
    <>
      <PageHeader
        eyebrow="고객 지원"
        title="일반 문의"
        description="일반 문의의 답변 상태, 담당자, 문의일을 확인하고 상세 페이지에서 답변을 처리합니다."
        action={<span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-indigo-100">총 {filteredInquiries.length}건</span>}
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>일반 문의 필터</CardTitle>
          <CardDescription>유저명, 이메일, 제목, 내용과 처리 조건으로 일반 문의를 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 lg:grid-cols-12">
            <label className="space-y-2 lg:col-span-4">
              <span className="text-sm font-bold text-slate-700">검색</span>
              <input
                name="q"
                defaultValue={filters.q ?? ""}
                placeholder="유저명, 이메일, 제목, 내용"
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-bold text-slate-700">문의일 시작</span>
              <input
                type="date"
                name="startDate"
                defaultValue={filters.startDate ?? ""}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-bold text-slate-700">문의일 종료</span>
              <input
                type="date"
                name="endDate"
                defaultValue={filters.endDate ?? ""}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
            </label>
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-bold text-slate-700">답변상태</span>
              <select
                name="status"
                defaultValue={filters.status ?? "전체"}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {inquiryStatuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
            <label className="space-y-2 lg:col-span-2">
              <span className="text-sm font-bold text-slate-700">담당자</span>
              <select
                name="assignee"
                defaultValue={filters.assignee ?? "전체"}
                className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              >
                {inquiryAssignees.map((assignee) => <option key={assignee}>{assignee}</option>)}
              </select>
            </label>
            <div className="flex flex-wrap items-end gap-3 lg:col-span-12">
              <Button type="submit">필터 적용</Button>
              <Button asChild variant="outline">
                <Link href="/inquiries">초기화</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>일반 문의 목록</CardTitle>
          <CardDescription>행을 클릭하면 일반 문의 상세 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1080px]">
            <TableHeader>
              <TableRow>
                <TableHead>유저</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>내용 미리보기</TableHead>
                <TableHead>답변상태</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>문의일</TableHead>
                <TableHead>답변일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow key={inquiry.id} className="cursor-pointer">
                  <TableCell className="whitespace-nowrap font-bold text-indigo-700">
                    <Link className="hover:underline" href={`/members/${inquiry.memberId}`}>{inquiry.userName}</Link>
                  </TableCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="whitespace-nowrap font-mono text-xs text-slate-600">{inquiry.email}</LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="max-w-[220px] font-bold text-slate-900">
                    <span className="line-clamp-2">{inquiry.title}</span>
                  </LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="max-w-[280px] text-slate-600">
                    <span className="line-clamp-2">{inquiry.content}</span>
                  </LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`}>
                    <Badge className="whitespace-nowrap" variant={statusVariants[inquiry.status]}>{inquiry.status}</Badge>
                  </LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="whitespace-nowrap">{inquiry.assignee}</LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="max-w-[120px] text-slate-600">
                    <span className="line-clamp-2">{inquiry.createdAt}</span>
                  </LinkedCell>
                  <LinkedCell href={`/inquiries/${inquiry.id}`} className="max-w-[120px] text-slate-600">
                    <span className="line-clamp-2">{inquiry.answeredAt}</span>
                  </LinkedCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function LinkedCell({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return (
    <TableCell className={cn("p-0", className)}>
      <Link className="block h-full p-4" href={href}>{children}</Link>
    </TableCell>
  );
}

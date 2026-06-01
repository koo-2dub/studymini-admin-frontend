"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { inquiries, type Inquiry, type InquiryStatus } from "./data";

const statusOptions: Array<"전체" | InquiryStatus> = ["전체", "미답변", "답변완료"];

const initialFilters = {
  query: "",
  startDate: "",
  endDate: "",
  status: "전체" as "전체" | InquiryStatus,
};

export function InquiriesDashboard() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(() => {
    const today = "2026-06-01";
    const weekStart = "2026-06-01";

    return {
      todayCount: inquiries.filter((inquiry) => inquiry.inquiryDate === today).length,
      weekCount: inquiries.filter((inquiry) => inquiry.inquiryDate >= weekStart).length,
      unansweredCount: inquiries.filter((inquiry) => inquiry.status === "미답변").length,
    };
  }, []);

  const filteredInquiries = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return inquiries.filter((inquiry) => {
      const matchesKeyword = keyword
        ? [inquiry.requester, inquiry.email, inquiry.subject, inquiry.content].some((value) =>
            value.toLowerCase().includes(keyword),
          )
        : true;
      const matchesStart = appliedFilters.startDate ? inquiry.inquiryDate >= appliedFilters.startDate : true;
      const matchesEnd = appliedFilters.endDate ? inquiry.inquiryDate <= appliedFilters.endDate : true;
      const matchesStatus = appliedFilters.status === "전체" ? true : inquiry.status === appliedFilters.status;

      return matchesKeyword && matchesStart && matchesEnd && matchesStatus;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const openDetail = (inquiry: Inquiry) => {
    router.push(`/inquiries/${inquiry.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="General inquiries"
        description="일반 문의 목록, 답변 상태, 담당자를 확인하고 상세 화면에서 답변을 처리합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="오늘 일반 문의 수" value={String(summary.todayCount)} change="2026-06-01 접수" tone="indigo" />
        <StatCard label="이번주 일반 문의 수" value={String(summary.weekCount)} change="이번주 누적" tone="emerald" />
        <StatCard label="미답변 수" value={String(summary.unansweredCount)} change="답변 필요" tone="amber" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>유저명, 이메일, 제목, 내용과 문의일, 답변상태로 일반 문의를 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(150px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="유저명, 이메일, 제목, 내용"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                />
              </div>
            </label>
            <label className="text-sm font-bold text-slate-600">
              문의일 시작
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.startDate}
                onChange={(event) => updateFilter("startDate", event.target.value)}
              />
            </label>
            <label className="text-sm font-bold text-slate-600">
              문의일 종료
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.endDate}
                onChange={(event) => updateFilter("endDate", event.target.value)}
              />
            </label>
            <label className="text-sm font-bold text-slate-600">
              답변상태
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button type="button" onClick={applyFilters}>필터 적용</Button>
            <Button type="button" variant="outline" onClick={resetFilters}>초기화</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>일반 문의 목록</CardTitle>
          <CardDescription>목록의 아무 행이나 클릭하면 일반 문의 상세 화면으로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>문의번호</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>문의자</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>답변상태</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>문의일</TableHead>
                <TableHead>답변일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(inquiry)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(inquiry);
                    }
                  }}
                >
                  <TableCell className="font-bold text-slate-900">{inquiry.id}</TableCell>
                  <TableCell className="min-w-56 font-semibold text-slate-800">{inquiry.subject}</TableCell>
                  <TableCell>{inquiry.requester}</TableCell>
                  <TableCell>{inquiry.email}</TableCell>
                  <TableCell><InquiryStatusBadge status={inquiry.status} /></TableCell>
                  <TableCell>{inquiry.assignee}</TableCell>
                  <TableCell>{inquiry.inquiryDate}</TableCell>
                  <TableCell>{inquiry.answeredAt}</TableCell>
                </TableRow>
              ))}
              {filteredInquiries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center font-semibold text-slate-500">
                    필터 조건에 맞는 일반 문의가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return <Badge variant={status === "답변완료" ? "success" : "warning"}>{status}</Badge>;
}

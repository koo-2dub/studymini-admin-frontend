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
        eyebrow="일반 문의"
        title="일반 문의"
        description="회원의 일반 문의 접수 현황을 확인하고 1회 답변을 저장합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="오늘 문의 수" value={`${summary.todayCount.toLocaleString()}건`} change="2026-06-01 접수" tone="indigo" />
        <StatCard label="이번주 총 문의 수" value={`${summary.weekCount.toLocaleString()}건`} change="이번주 접수 누적" tone="emerald" />
        <StatCard label="미답변 수" value={`${summary.unansweredCount.toLocaleString()}건`} change="답변 저장 필요" tone="amber" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-600" />
            필터
          </CardTitle>
          <CardDescription>유저명, 이메일, 제목, 내용과 문의일, 답변상태로 일반 문의를 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto_auto]">
            <label className="space-y-2 text-sm font-bold text-slate-700">
              검색
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-xl border border-input bg-white/80 pl-9 pr-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                  placeholder="유저명, 이메일, 제목, 내용"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                />
              </div>
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              문의일 시작
              <input
                type="date"
                className="h-10 w-full rounded-xl border border-input bg-white/80 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                value={filters.startDate}
                onChange={(event) => updateFilter("startDate", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              문의일 종료
              <input
                type="date"
                className="h-10 w-full rounded-xl border border-input bg-white/80 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                value={filters.endDate}
                onChange={(event) => updateFilter("endDate", event.target.value)}
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              답변상태
              <select
                className="h-10 w-full rounded-xl border border-input bg-white/80 px-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end">
              <Button className="w-full" type="button" onClick={applyFilters}>필터 적용</Button>
            </div>
            <div className="flex items-end">
              <Button className="w-full" type="button" variant="outline" onClick={resetFilters}>초기화</Button>
            </div>
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
                  className="cursor-pointer hover:bg-indigo-50/80 focus-within:bg-indigo-50/80"
                  tabIndex={0}
                  onClick={() => openDetail(inquiry)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(inquiry);
                    }
                  }}
                >
                  <TableCell className="font-mono font-bold text-indigo-700">{inquiry.id}</TableCell>
                  <TableCell className="min-w-56 font-semibold text-slate-900">{inquiry.subject}</TableCell>
                  <TableCell>{inquiry.requester}</TableCell>
                  <TableCell className="text-slate-600">{inquiry.email}</TableCell>
                  <TableCell><InquiryStatusBadge status={inquiry.status} /></TableCell>
                  <TableCell>{inquiry.assignee}</TableCell>
                  <TableCell>{inquiry.inquiryDate}</TableCell>
                  <TableCell>{inquiry.answeredAt}</TableCell>
                </TableRow>
              ))}
              {filteredInquiries.length === 0 && (
                <TableRow>
                  <TableCell className="py-10 text-center text-muted-foreground" colSpan={8}>필터 조건에 맞는 일반 문의가 없습니다.</TableCell>
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

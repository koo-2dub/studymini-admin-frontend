"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { InquiryFilterActions, InquiryFilterInput, InquiryFilterSelect, InquirySearchField, answerStatusOptions, toSelectOptions } from "@/components/dashboard/inquiry-filter-controls";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generalInquiries } from "@/lib/inquiry-data";

type GeneralInquiryFilters = {
  search: string;
  startDate: string;
  endDate: string;
  answerStatus: string;
  manager: string;
};

const defaultFilters: GeneralInquiryFilters = {
  search: "",
  startDate: "",
  endDate: "",
  answerStatus: "전체",
  manager: "전체",
};

export default function InquiriesPage() {
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const managers = useMemo(() => Array.from(new Set(generalInquiries.map((inquiry) => inquiry.manager))), []);

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = appliedFilters.search.trim().toLowerCase();

    return generalInquiries.filter((inquiry) => {
      const matchedSearch = !normalizedSearch || [inquiry.id, inquiry.title, inquiry.requester, inquiry.userId, inquiry.email]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchedStartDate = !appliedFilters.startDate || inquiry.inquiryDate >= appliedFilters.startDate;
      const matchedEndDate = !appliedFilters.endDate || inquiry.inquiryDate <= appliedFilters.endDate;
      const matchedAnswerStatus = appliedFilters.answerStatus === "전체" || inquiry.answerStatus === appliedFilters.answerStatus;
      const matchedManager = appliedFilters.manager === "전체" || inquiry.manager === appliedFilters.manager;

      return matchedSearch && matchedStartDate && matchedEndDate && matchedAnswerStatus && matchedManager;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof GeneralInquiryFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="문의 관리" title="일반 문의" description="회원의 일반 문의를 검색, 기간, 답변상태, 담당자 기준으로 조회하고 상세 페이지에서 답변을 관리합니다." />

      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
          <CardDescription>PR22에서 사용하던 문의 관리 필터 UI를 유지합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-4">
            <InquirySearchField value={draftFilters.search} onChange={(value) => updateFilter("search", value)} placeholder="문의 제목, 문의자, User ID, 이메일" />
            <InquiryFilterInput label="문의일 시작" type="date" value={draftFilters.startDate} onChange={(value) => updateFilter("startDate", value)} />
            <InquiryFilterInput label="문의일 종료" type="date" value={draftFilters.endDate} onChange={(value) => updateFilter("endDate", value)} />
            <InquiryFilterSelect label="답변상태" value={draftFilters.answerStatus} onChange={(value) => updateFilter("answerStatus", value)} options={answerStatusOptions} />
            <InquiryFilterSelect label="담당자" value={draftFilters.manager} onChange={(value) => updateFilter("manager", value)} options={toSelectOptions(managers, "전체 담당자")} />
            <InquiryFilterActions onApply={() => setAppliedFilters(draftFilters)} onReset={resetFilters} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>일반 문의 목록</CardTitle>
          <CardDescription>현재 조건에 맞는 문의 {filteredInquiries.length.toLocaleString()}건 · 제목을 클릭하면 상세 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["No.", "문의번호", "제목", "문의자", "문의일", "답변상태", "담당자"].map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInquiries.map((inquiry, index) => (
                <TableRow key={inquiry.id} className="cursor-pointer hover:bg-slate-50">
                  <TableCell className="font-semibold text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-semibold">{inquiry.id}</TableCell>
                  <TableCell>
                    <Link className="font-bold text-slate-950 hover:text-primary" href={`/inquiries/${inquiry.id}`}>{inquiry.title}</Link>
                  </TableCell>
                  <TableCell>{inquiry.requester}</TableCell>
                  <TableCell>{inquiry.inquiryDate}</TableCell>
                  <TableCell><AnswerBadge value={inquiry.answerStatus} /></TableCell>
                  <TableCell>{inquiry.manager}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AnswerBadge({ value }: { value: string }) {
  const variant = value === "답변완료" ? "success" : value === "답변중" ? "warning" : "rose";
  return <Badge variant={variant}>{value}</Badge>;
}

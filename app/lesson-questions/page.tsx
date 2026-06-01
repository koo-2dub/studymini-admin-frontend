"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { InquiryFilterActions, InquiryFilterInput, InquiryFilterSelect, InquirySearchField, answerStatusOptions, toSelectOptions } from "@/components/dashboard/inquiry-filter-controls";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { learningInquiries } from "@/lib/inquiry-data";

type LearningInquiryFilters = {
  search: string;
  language: string;
  course: string;
  visibility: string;
  answerStatus: string;
  manager: string;
  startDate: string;
  endDate: string;
};

const defaultFilters: LearningInquiryFilters = {
  search: "",
  language: "전체",
  course: "전체",
  visibility: "전체",
  answerStatus: "전체",
  manager: "전체",
  startDate: "",
  endDate: "",
};

export default function LessonQuestionsPage() {
  const [draftFilters, setDraftFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);

  const languages = useMemo(() => Array.from(new Set(learningInquiries.map((inquiry) => inquiry.language))), []);
  const courses = useMemo(() => Array.from(new Set(learningInquiries.map((inquiry) => inquiry.course))), []);
  const managers = useMemo(() => Array.from(new Set(learningInquiries.map((inquiry) => inquiry.manager))), []);

  const filteredInquiries = useMemo(() => {
    const normalizedSearch = appliedFilters.search.trim().toLowerCase();

    return learningInquiries.filter((inquiry) => {
      const matchedSearch = !normalizedSearch || [inquiry.id, inquiry.title, inquiry.requester, inquiry.userId, inquiry.lesson]
        .some((value) => value.toLowerCase().includes(normalizedSearch));
      const matchedLanguage = appliedFilters.language === "전체" || inquiry.language === appliedFilters.language;
      const matchedCourse = appliedFilters.course === "전체" || inquiry.course === appliedFilters.course;
      const matchedVisibility = appliedFilters.visibility === "전체" || inquiry.visibility === appliedFilters.visibility;
      const matchedAnswerStatus = appliedFilters.answerStatus === "전체" || inquiry.answerStatus === appliedFilters.answerStatus;
      const matchedManager = appliedFilters.manager === "전체" || inquiry.manager === appliedFilters.manager;
      const matchedStartDate = !appliedFilters.startDate || inquiry.inquiryDate >= appliedFilters.startDate;
      const matchedEndDate = !appliedFilters.endDate || inquiry.inquiryDate <= appliedFilters.endDate;

      return matchedSearch && matchedLanguage && matchedCourse && matchedVisibility && matchedAnswerStatus && matchedManager && matchedStartDate && matchedEndDate;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof LearningInquiryFilters, value: string) => {
    setDraftFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="문의 관리" title="학습 문의" description="학습 문의를 검색, 언어, 강의, 공개상태, 답변상태, 담당자, 문의일 기준으로 조회하고 상세 페이지에서 답변을 관리합니다." />

      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
          <CardDescription>PR22에서 사용하던 학습 문의 필터 UI를 유지합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-4">
            <InquirySearchField value={draftFilters.search} onChange={(value) => updateFilter("search", value)} placeholder="문의 제목, 문의자, User ID, 레슨" />
            <InquiryFilterSelect label="언어" value={draftFilters.language} onChange={(value) => updateFilter("language", value)} options={toSelectOptions(languages, "전체 언어")} />
            <InquiryFilterSelect label="강의" value={draftFilters.course} onChange={(value) => updateFilter("course", value)} options={toSelectOptions(courses, "전체 강의")} />
            <InquiryFilterSelect label="공개상태" value={draftFilters.visibility} onChange={(value) => updateFilter("visibility", value)} options={toSelectOptions(["공개", "비공개"], "전체 공개상태")} />
            <InquiryFilterSelect label="답변상태" value={draftFilters.answerStatus} onChange={(value) => updateFilter("answerStatus", value)} options={answerStatusOptions} />
            <InquiryFilterSelect label="담당자" value={draftFilters.manager} onChange={(value) => updateFilter("manager", value)} options={toSelectOptions(managers, "전체 담당자")} />
            <InquiryFilterInput label="문의일 시작" type="date" value={draftFilters.startDate} onChange={(value) => updateFilter("startDate", value)} />
            <InquiryFilterInput label="문의일 종료" type="date" value={draftFilters.endDate} onChange={(value) => updateFilter("endDate", value)} />
            <InquiryFilterActions onApply={() => setAppliedFilters(draftFilters)} onReset={resetFilters} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>학습 문의 목록</CardTitle>
          <CardDescription>현재 조건에 맞는 문의 {filteredInquiries.length.toLocaleString()}건 · 제목을 클릭하면 상세 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["No.", "문의번호", "제목", "언어", "강의", "공개상태", "답변상태", "담당자", "문의일"].map((header) => (
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
                    <Link className="font-bold text-slate-950 hover:text-primary" href={`/lesson-questions/${inquiry.id}`}>{inquiry.title}</Link>
                  </TableCell>
                  <TableCell>{inquiry.language}</TableCell>
                  <TableCell>{inquiry.course}</TableCell>
                  <TableCell><Badge variant={inquiry.visibility === "공개" ? "success" : "slate"}>{inquiry.visibility}</Badge></TableCell>
                  <TableCell><AnswerBadge value={inquiry.answerStatus} /></TableCell>
                  <TableCell>{inquiry.manager}</TableCell>
                  <TableCell>{inquiry.inquiryDate}</TableCell>
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

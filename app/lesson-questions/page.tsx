"use client";

import { useState } from "react";
import { BookOpenCheck, CalendarDays, CheckCircle2, MessageCircleQuestion, RotateCcw, Search, Trash2 } from "lucide-react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";

type LessonQuestionFilters = {
  query: string;
  startDate: string;
  endDate: string;
  status: string;
  teacher: string;
  visibility: string;
};

const emptyFilters: LessonQuestionFilters = {
  query: "",
  startDate: "",
  endDate: "",
  status: "all",
  teacher: "all",
  visibility: "all",
};

const summaryItems = [
  { label: "오늘 학습 문의 수", value: lessonQuestions.length, badge: "Today", icon: MessageCircleQuestion },
  { label: "이번주 학습 문의 수", value: lessonQuestions.length, badge: "7 days", icon: CalendarDays },
  { label: "승인 대기 수", value: lessonQuestions.filter((question) => question.status === "Teacher assigned").length, badge: "Review", icon: CheckCircle2 },
  { label: "미답변 수", value: lessonQuestions.filter((question) => question.status === "Needs answer").length, badge: "Pending", icon: BookOpenCheck },
  { label: "휴지통 수", value: 0, badge: "Trash", icon: Trash2 },
];

export default function LessonQuestionsPage() {
  const [filters, setFilters] = useState(emptyFilters);

  const updateFilter = (key: keyof LessonQuestionFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <>
      <PageHeader
        eyebrow="Academic support"
        title="Lesson questions"
        description="Route learner lesson questions to teachers and monitor response freshness."
      />
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {summaryItems.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.label} className="rounded-3xl">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="text-sm font-bold text-slate-500">{item.label}</p>
                    <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{item.value.toLocaleString()}건</p>
                    <Badge variant="slate" className="mt-3">{item.badge}</Badge>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
        <Card>
          <CardHeader>
            <CardTitle>Lesson questions filter</CardTitle>
            <CardDescription>Search lesson questions, dates, answer status, assignment, and visibility in a compact grid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2 md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search</span>
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={filters.query}
                    onChange={(event) => updateFilter("query", event.target.value)}
                    placeholder="Question, lesson, member"
                    className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>
              <FilterInput label="Start date" type="date" value={filters.startDate} onChange={(value) => updateFilter("startDate", value)} />
              <FilterInput label="End date" type="date" value={filters.endDate} onChange={(value) => updateFilter("endDate", value)} />
              <FilterSelect label="Status" value={filters.status} onChange={(value) => updateFilter("status", value)} options={["all", "Teacher assigned", "Needs answer", "Answered"]} allLabel="All statuses" />
              <FilterSelect label="Teacher" value={filters.teacher} onChange={(value) => updateFilter("teacher", value)} options={["all", "Assigned", "Unassigned"]} allLabel="All teachers" />
              <FilterSelect label="Visibility" value={filters.visibility} onChange={(value) => updateFilter("visibility", value)} options={["all", "Published", "Hidden", "Trash"]} allLabel="All visibility" />
              <div className="flex items-end justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setFilters((current) => ({ ...current }))}>필터 적용</Button>
                <Button type="button" variant="outline" onClick={() => setFilters(emptyFilters)}><RotateCcw className="h-4 w-4" />초기화</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <DataTable
          title="Question queue"
          description="Mock content help requests from students."
          data={lessonQuestions}
          columns={[
            { key: "id", header: "Question" },
            { key: "lesson", header: "Lesson" },
            { key: "member", header: "Member" },
            { key: "age", header: "Age" },
            { key: "status", header: "Status", render: (question) => <StatusBadge value={question.status} /> },
          ]}
        />
      </div>
    </>
  );
}

function FilterSelect({
  label,
  value,
  options,
  allLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option} value={option}>{option === "all" ? allLabel : option}</option>)}
      </select>
    </label>
  );
}

function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
    </label>
  );
}

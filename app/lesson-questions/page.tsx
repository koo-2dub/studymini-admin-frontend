import { TrendingUp } from "lucide-react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const summaryCards = [
  { label: "오늘 학습 문의 수", value: "2건", badge: "2026-06-01 접수", tone: "from-indigo-500 to-violet-500" },
  { label: "이번주 학습 문의 수", value: "5건", badge: "이번주 누적", tone: "from-emerald-500 to-teal-500" },
  { label: "승인 대기 수", value: "2건", badge: "공개 승인 필요", tone: "from-sky-500 to-cyan-500" },
  { label: "미답변 수", value: "3건", badge: "답변 저장 필요", tone: "from-amber-500 to-orange-500" },
  { label: "휴지통 수", value: "2건", badge: "휴지통 보관", tone: "from-slate-500 to-slate-700" },
];

function LessonQuestionSummary() {
  return (
    <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {summaryCards.map((card) => (
        <Card key={card.label} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
                <p className="mt-3 text-3xl font-black tracking-tight">{card.value}</p>
              </div>
              <div className={cn("rounded-2xl bg-gradient-to-br p-3 text-white shadow-lg", card.tone)}>
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-5 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">{card.badge}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}

export default function LessonQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academic support"
        title="Lesson questions"
        description="Route learner lesson questions to teachers and monitor response freshness."
      />
      <LessonQuestionSummary />
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
    </>
  );
}

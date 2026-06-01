"use client";

import { RotateCcw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { lessonQuestionCourses, lessonQuestions, type LessonQuestionRecord } from "./data";

const languages = ["전체", "영어", "일본어", "중국어", "스페인어", "프랑스어", "독일어", "이탈리아어"];
const visibilityOptions = ["전체", "승인 대기", "승인됨", "휴지통"];
const answerOptions = ["전체", "미답변", "답변완료"];

const badgeVariant = (value: string): BadgeProps["variant"] => {
  if (value === "승인됨" || value === "답변완료") return "success";
  if (value === "승인 대기" || value === "미답변") return "warning";
  if (value === "휴지통") return "rose";
  return "slate";
};

function formatDateTime(value?: string) {
  if (!value) return "-";
  const [date, time] = value.split(" ");
  return <span className="whitespace-nowrap">{date} {time}</span>;
}

function FilterInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="text-sm font-bold text-slate-600">
      {label}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export default function LessonQuestionsPage() {
  const router = useRouter();
  const [trashMode, setTrashMode] = useState(false);
  const [toast, setToast] = useState("");

  const activeQuestions = lessonQuestions.filter((question) => question.visibilityStatus !== "휴지통");
  const trashedQuestions = lessonQuestions.filter((question) => question.visibilityStatus === "휴지통");

  const summary = useMemo(
    () => ({
      today: lessonQuestions.filter((question) => question.askedAt.startsWith("2026-06-01")).length,
      week: lessonQuestions.filter((question) => question.askedAt >= "2026-05-26").length,
      pending: lessonQuestions.filter((question) => question.visibilityStatus === "승인 대기").length,
      unanswered: lessonQuestions.filter(
        (question) => question.answerStatus === "미답변" && question.visibilityStatus !== "휴지통",
      ).length,
      trash: trashedQuestions.length,
    }),
    [trashedQuestions.length],
  );

  const handleRestore = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    setToast(`${id} 학습 문의를 일반 목록으로 복구했습니다. (mock)`);
  };

  const handleDelete = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    if (window.confirm("영구 삭제하면 복구할 수 없습니다. 계속 진행할까요?")) {
      setToast(`${id} 학습 문의를 영구 삭제 처리했습니다. (mock)`);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Academic support"
        title="Lesson questions"
        description="학습 문의를 승인하고 답변 상태와 휴지통 항목을 관리합니다."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="오늘 학습 문의 수" value={String(summary.today)} change="2026-06-01 접수" tone="indigo" />
        <StatCard label="이번주 학습 문의 수" value={String(summary.week)} change="이번주 누적" tone="emerald" />
        <StatCard label="승인 대기 수" value={String(summary.pending)} change="검토 필요" tone="amber" />
        <StatCard label="미답변 수" value={String(summary.unanswered)} change="답변 필요" tone="rose" />
        <StatCard label="휴지통 수" value={String(summary.trash)} change="삭제 항목" tone="indigo" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>필터</CardTitle>
          <CardDescription>유저, 강의, 공개상태, 답변상태, 문의일 기준으로 학습 문의를 찾습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-5 flex justify-end">
            <Button type="button" variant="outline" onClick={() => setTrashMode((value) => !value)}>
              <Trash2 className="h-4 w-4" />
              {trashMode ? "일반 목록 보기" : "휴지통 보기"}
            </Button>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.3fr)_repeat(5,minmax(120px,1fr))]">
            <FilterInput label="검색">
              <div className="flex h-10 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none" placeholder="유저명, 질문 내용" />
              </div>
            </FilterInput>
            <FilterInput label="언어">
              <select className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none">
                {languages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </FilterInput>
            <FilterInput label="강의">
              <select className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none">
                <option>전체</option>
                {lessonQuestionCourses.map((course) => (
                  <option key={course}>{course}</option>
                ))}
              </select>
            </FilterInput>
            <FilterInput label="공개상태">
              <select className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none">
                {visibilityOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FilterInput>
            <FilterInput label="답변상태">
              <select className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none">
                {answerOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </FilterInput>
            <FilterInput label="문의일">
              <input type="date" className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" />
            </FilterInput>
          </div>

          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button type="button">필터 적용</Button>
            <Button type="button" variant="outline">초기화</Button>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div className="mb-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {toast}
        </div>
      )}

      {trashMode ? (
        <TrashTable questions={trashedQuestions} onRestore={handleRestore} onDelete={handleDelete} />
      ) : (
        <LessonQuestionTable questions={activeQuestions} onRowClick={(question) => router.push(`/lesson-questions/${question.id}`)} />
      )}
    </>
  );
}

function LessonQuestionTable({ questions, onRowClick }: { questions: LessonQuestionRecord[]; onRowClick: (question: LessonQuestionRecord) => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>학습 문의 목록</CardTitle>
        <CardDescription>행을 클릭하면 별도 상세 페이지에서 승인 및 답변 처리를 진행합니다.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저</TableHead>
              <TableHead>언어</TableHead>
              <TableHead>강의 정보</TableHead>
              <TableHead>질문 미리보기</TableHead>
              <TableHead>공개상태</TableHead>
              <TableHead>답변상태</TableHead>
              <TableHead>문의일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id} className="cursor-pointer" onClick={() => onRowClick(question)}>
                <TableCell>
                  <button
                    className="text-left font-bold text-indigo-600 hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {question.userName}
                  </button>
                </TableCell>
                <TableCell>{question.language}</TableCell>
                <TableCell className="min-w-56">
                  <p className="font-bold text-slate-900">{question.courseLevel} / {question.lessonDay}</p>
                  <p className="text-sm text-slate-500">{question.lectureTitle}</p>
                </TableCell>
                <TableCell className="min-w-72 text-slate-600">{question.questionPreview}</TableCell>
                <TableCell><Badge variant={badgeVariant(question.visibilityStatus)}>{question.visibilityStatus}</Badge></TableCell>
                <TableCell><Badge variant={badgeVariant(question.answerStatus)}>{question.answerStatus}</Badge></TableCell>
                <TableCell>{formatDateTime(question.askedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TrashTable({
  questions,
  onRestore,
  onDelete,
}: {
  questions: LessonQuestionRecord[];
  onRestore: (event: React.MouseEvent, id: string) => void;
  onDelete: (event: React.MouseEvent, id: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>휴지통 목록</CardTitle>
        <CardDescription>삭제된 학습 문의를 복구하거나 영구 삭제합니다.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저</TableHead>
              <TableHead>언어</TableHead>
              <TableHead>강의 정보</TableHead>
              <TableHead>질문 미리보기</TableHead>
              <TableHead>삭제일</TableHead>
              <TableHead>삭제한 관리자</TableHead>
              <TableHead>액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell className="font-bold text-slate-900">{question.userName}</TableCell>
                <TableCell>{question.language}</TableCell>
                <TableCell className="min-w-56">
                  <p className="font-bold text-slate-900">{question.courseLevel} / {question.lessonDay}</p>
                  <p className="text-sm text-slate-500">{question.lectureTitle}</p>
                </TableCell>
                <TableCell className="min-w-72 text-slate-600">{question.questionPreview}</TableCell>
                <TableCell>{formatDateTime(question.deletedAt)}</TableCell>
                <TableCell>{question.deletedBy}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={(event) => onRestore(event, question.id)}>
                      <RotateCcw className="h-4 w-4" />
                      복구
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={(event) => onDelete(event, question.id)}>
                      영구 삭제
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

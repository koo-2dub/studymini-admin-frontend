"use client";

import { useState } from "react";
import { ArchiveRestore, CheckCircle2, Send, Trash2, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lessonQuestions } from "@/lib/mock-data";

type ViewMode = "active" | "trash";

const publicStatusVariants: Record<string, "success" | "warning" | "slate"> = {
  승인됨: "success",
  "승인 대기": "warning",
  보류: "slate",
};

const answerStatusVariants: Record<string, "success" | "warning" | "slate"> = {
  "답변 완료": "success",
  "답변 대기": "warning",
  "작성 불가": "slate",
};

export default function LessonQuestionsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("active");
  const [toast, setToast] = useState<string | null>(null);
  const activeQuestions = lessonQuestions.filter((question) => question.lifecycleStatus !== "휴지통");
  const trashQuestions = lessonQuestions.filter((question) => question.lifecycleStatus === "휴지통");
  const selectedQuestion = activeQuestions[0];
  const trashDetailQuestion = trashQuestions[0];
  const latestAnswer = selectedQuestion.answers.at(-1);
  const currentWriter = latestAnswer?.author ?? "김운영";

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2600);
  };

  const handlePermanentDelete = (questionId: string) => {
    const confirmed = window.confirm("영구 삭제하면 복구할 수 없습니다. 계속 진행하시겠습니까?");
    if (confirmed) {
      showToast(`${questionId} 영구 삭제 mock action이 완료되었습니다.`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic support"
        title="Lesson questions"
        description="Route learner lesson questions to teachers and monitor response freshness."
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle>Question queue</CardTitle>
            <CardDescription>학습 문의 목록과 휴지통을 분리해 관리합니다.</CardDescription>
          </div>
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <Button
              size="sm"
              variant={viewMode === "active" ? "default" : "ghost"}
              onClick={() => setViewMode("active")}
            >
              전체 목록
            </Button>
            <Button
              size="sm"
              variant={viewMode === "trash" ? "default" : "ghost"}
              onClick={() => setViewMode("trash")}
            >
              휴지통
            </Button>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {viewMode === "active" ? (
            <Table className="min-w-[1240px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]">선택</TableHead>
                  <TableHead className="w-[120px]">유저</TableHead>
                  <TableHead className="w-[88px]">언어</TableHead>
                  <TableHead className="w-[260px]">강의 정보</TableHead>
                  <TableHead className="w-[270px]">질문 미리보기</TableHead>
                  <TableHead className="w-[118px]">공개상태</TableHead>
                  <TableHead className="w-[118px]">답변상태</TableHead>
                  <TableHead className="w-[110px]">담당자</TableHead>
                  <TableHead className="w-[100px]">문의일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <input type="checkbox" aria-label={`${question.id} 선택`} className="h-4 w-4 rounded border-slate-300" />
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-slate-900">{question.user}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700">{question.language}</TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-700">{question.lessonInfo}</span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-600">{question.questionPreview}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className="min-w-[86px] justify-center whitespace-nowrap" variant={publicStatusVariants[question.publicStatus]}>
                        {question.publicStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="min-w-[86px] justify-center whitespace-nowrap" variant={answerStatusVariants[question.answerStatus]}>
                        {question.answerStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700">{question.manager}</TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-600">{question.createdAt}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table className="min-w-[1120px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">유저</TableHead>
                  <TableHead className="w-[88px]">언어</TableHead>
                  <TableHead className="w-[260px]">강의 정보</TableHead>
                  <TableHead className="w-[270px]">질문 미리보기</TableHead>
                  <TableHead className="w-[110px]">삭제일</TableHead>
                  <TableHead className="w-[130px]">삭제한 관리자</TableHead>
                  <TableHead className="w-[140px]">액션</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trashQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="whitespace-nowrap font-semibold text-slate-900">{question.user}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700">{question.language}</TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-700">{question.lessonInfo}</span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-600">{question.questionPreview}</span>
                    </TableCell>
                    <TableCell>
                      <span className="line-clamp-2 leading-5 text-slate-600">{question.deletedAt}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-slate-700">{question.deletedBy}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" onClick={() => showToast(`${question.id} 복구 mock action이 완료되었습니다.`)}>
                          <ArchiveRestore className="h-4 w-4" />복구
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handlePermanentDelete(question.id)}>
                          <Trash2 className="h-4 w-4" />영구 삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedQuestion.lessonInfo}</CardTitle>
          <CardDescription>
            {selectedQuestion.user} · {selectedQuestion.language} · 강의 바로가기는 상세 화면에서만 제공합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <section className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {selectedQuestion.questionBody}
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedQuestion.lifecycleStatus === "승인 대기" && (
                <>
                  <Button size="sm"><CheckCircle2 className="h-4 w-4" />승인</Button>
                  <Button size="sm" variant="outline">보류</Button>
                  <Button size="sm" variant="outline">휴지통으로 이동</Button>
                </>
              )}
              {selectedQuestion.lifecycleStatus === "승인됨" && (
                <>
                  <Button size="sm" variant="outline">보류</Button>
                  <Button size="sm" variant="outline">휴지통으로 이동</Button>
                </>
              )}
              {selectedQuestion.lifecycleStatus === "답변 완료" && <Button size="sm" variant="outline">휴지통으로 이동</Button>}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-slate-900">답변 이력</h3>
              {selectedQuestion.answers.map((answer) => (
                <div key={answer.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <UserRoundCheck className="h-4 w-4" />
                    <span className="font-semibold text-slate-700">작성자: {answer.author}</span>
                    <span>{answer.createdAt}</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{answer.content}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">답변 작성</h3>
                <p className="text-sm text-slate-500">작성자: {currentWriter}</p>
              </div>
              <Badge className="whitespace-nowrap" variant="success">승인됨</Badge>
            </div>
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-white bg-white/90 p-4 text-sm leading-6 outline-none ring-indigo-200 transition focus:ring-2"
              defaultValue="학습 문의 답변을 입력합니다. 저장한 관리자가 자동으로 담당자로 표시됩니다."
              aria-label="학습 문의 답변"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm"><Send className="h-4 w-4" />답변 저장</Button>
              <Button size="sm" variant="outline">답변 완료 처리</Button>
            </div>
          </section>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>휴지통 상태 상세 액션</CardTitle>
          <CardDescription>휴지통 상태에서는 복구와 영구 삭제만 제공하고 답변 작성은 비활성화합니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-slate-900">{trashDetailQuestion.lessonInfo}</p>
            <p className="text-sm text-slate-500">답변 작성 불가 · 삭제일 {trashDetailQuestion.deletedAt}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => showToast(`${trashDetailQuestion.id} 복구 mock action이 완료되었습니다.`)}>
              <ArchiveRestore className="h-4 w-4" />복구
            </Button>
            <Button size="sm" variant="outline" onClick={() => handlePermanentDelete(trashDetailQuestion.id)}>
              <Trash2 className="h-4 w-4" />영구 삭제
            </Button>
          </div>
        </CardContent>
      </Card>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-panel">
          {toast}
        </div>
      )}
    </div>
  );
}

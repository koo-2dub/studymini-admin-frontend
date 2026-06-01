import { BookOpenCheck, CheckCircle2, Clock3, MessageSquareText, StickyNote, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";

const question = lessonQuestions[0];

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {label}
      <select className="h-10 rounded-xl border border-border bg-white/80 px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue={value}>
        <option>{value}</option>
      </select>
    </label>
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

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced filters</CardTitle>
            <CardDescription>PR24 filter set is preserved with academic workflow and course metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(5,1fr)]">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search
                <input
                  className="h-10 rounded-xl border border-border bg-white/80 px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  defaultValue="concept, proof, lab"
                />
              </label>
              <FilterSelect label="Workflow" value="Approval needed" />
              <FilterSelect label="Course" value="All courses" />
              <FilterSelect label="Teacher" value="Assigned + mine" />
              <FilterSelect label="Visibility" value="Public + private" />
              <FilterSelect label="SLA" value="Oldest first" />
            </div>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
              <Badge variant="warning">Needs review</Badge>
              <Badge variant="slate">Has attachment</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <Card>
            <CardHeader>
              <CardTitle>Question queue</CardTitle>
              <CardDescription>PR23 queue layout with routing, approval, and freshness context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lessonQuestions.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.id}</p>
                      <h3 className="mt-1 font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.preview}</p>
                    </div>
                    <Badge variant={item.status === "Answered" ? "success" : item.status === "Needs answer" ? "warning" : "slate"}>{item.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
                    <span>Lesson: {item.lesson}</span>
                    <span>Member: {item.member}</span>
                    <span>Teacher: {item.teacher}</span>
                    <span>Age: {item.age}</span>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{question.title}</CardTitle>
                  <CardDescription>{question.id} · {question.member} · {question.lesson}</CardDescription>
                </div>
                <Badge variant="warning">{question.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-950"><BookOpenCheck className="size-4" /> 강의 정보</div>
                <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                  <div><dt className="font-bold text-slate-500">Course</dt><dd className="text-slate-900">{question.course}</dd></div>
                  <div><dt className="font-bold text-slate-500">Lesson</dt><dd className="text-slate-900">{question.lesson}</dd></div>
                  <div><dt className="font-bold text-slate-500">Teacher</dt><dd className="text-slate-900">{question.teacher}</dd></div>
                  <div><dt className="font-bold text-slate-500">Visibility</dt><dd className="text-slate-900">{question.visibility}</dd></div>
                </dl>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><MessageSquareText className="size-4" /> 질문 원문 전체</div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{question.body}</p>
              </section>

              <section className="flex flex-wrap gap-2">
                <Button><CheckCircle2 className="size-4" /> 승인 버튼</Button>
                <Button variant="secondary">보류 버튼</Button>
                <Button variant="outline"><Trash2 className="size-4" /> 휴지통 이동 버튼</Button>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><MessageSquareText className="size-4" /> 답변 작성</div>
                <textarea
                  className="min-h-40 w-full rounded-2xl border border-border bg-white/90 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  defaultValue={question.draftAnswer}
                />
                <div className="flex flex-wrap gap-2">
                  <Button>답변 저장</Button>
                  <Button variant="secondary">답변 완료 처리</Button>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Clock3 className="size-4" /> 답변 이력</div>
                <div className="space-y-3">
                  {question.answerHistory.map((answer) => (
                    <div key={answer.at} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex flex-wrap justify-between gap-2 text-xs font-bold text-muted-foreground">
                        <span>{answer.author}</span>
                        <span>{answer.at}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{answer.message}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900"><StickyNote className="size-4" /> 관리자 메모</div>
                <textarea className="mt-3 min-h-24 w-full rounded-xl border border-amber-200 bg-white/80 p-3 text-sm leading-6 outline-none" defaultValue={question.adminMemo} />
              </section>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return lessonQuestions.map((question) => ({ id: question.id }));
}

export default async function LessonQuestionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const question = lessonQuestions.find((item) => item.id === id);

  if (!question) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="Lesson question detail"
        title={question.lesson.title}
        description={`${question.id} · ${question.member} · ${question.createdAt}`}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href="/lesson-questions">Back to list</Link></Button>
        <Button>Approve</Button>
        <Button variant="secondary">Hold</Button>
        <Button variant="outline">Move to trash</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full original question</CardTitle>
              <CardDescription>Status: <StatusBadge value={question.status} /></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-5 leading-7 text-slate-800">{question.question}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Write answer</CardTitle>
              <CardDescription>The answer author is automatically shown as the person in charge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                담당자: 답변 작성 관리자 자동 지정
              </div>
              <textarea
                className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="학습 문의 답변을 입력하세요."
              />
              <Button>Submit answer</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer history</CardTitle>
              <CardDescription>Previous replies and the answering administrator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.answerHistory.map((answer) => (
                <div key={`${answer.admin}-${answer.answeredAt}`} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-slate-900">{answer.admin}</span>
                    <span className="text-muted-foreground">{answer.answeredAt}</span>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{answer.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User information</CardTitle>
              <CardDescription>Learner profile for support context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Info label="Name" value={question.user.name} />
              <Info label="User ID" value={question.user.id} />
              <Info label="Email" value={question.user.email} />
              <Info label="Phone" value={question.user.phone} />
              <Button asChild className="w-full"><Link href={`/members/${question.user.id}`}>View user detail</Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lesson information</CardTitle>
              <CardDescription>Course context for the question.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <Info label="Course" value={question.lesson.course} />
              <Info label="Lesson" value={question.lesson.title} />
              <Info label="Teacher" value={question.lesson.teacher} />
              <Info label="Lesson ID" value={question.lesson.id} />
              <Button asChild variant="outline" className="w-full"><Link href={question.lesson.href}>Open lesson detail</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  );
}

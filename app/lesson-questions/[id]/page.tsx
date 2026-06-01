import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";

export function generateStaticParams() {
  return lessonQuestions.map((question) => ({ id: question.id }));
}

export default async function LessonQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = lessonQuestions.find((item) => item.id === id);
  if (!question) notFound();

  const isAnswered = question.status === "Answered";

  return (
    <>
      <PageHeader eyebrow="Academic support" title={question.lesson} description={`${question.id} · Lesson question detail and moderation workspace.`} />
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question content</CardTitle>
              <CardDescription>Full learner question and lesson context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={question.status} />
                <Badge variant="slate">Waiting {question.age}</Badge>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Lesson</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{question.lesson}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Question</p>
                <p className="mt-2 rounded-2xl bg-slate-50 p-4 leading-7">
                  I watched the lesson and tried the practice problem, but I am still unsure why this answer is correct. Could a teacher explain the key concept and show the solving steps?
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer editor</CardTitle>
              <CardDescription>Write the teacher or admin answer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none ring-indigo-100 transition focus:ring-4" defaultValue={isAnswered ? "The question has been answered. Review or update the explanation here." : "Thanks for the question. The important idea in this lesson is..."} />
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline">Save draft</Button>
                <Button>Publish answer</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User info</CardTitle>
              <CardDescription>Learner profile for this question.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-950">Name:</span> {question.member}</p>
              <p><span className="font-semibold text-slate-950">Question:</span> {question.id}</p>
              <p><span className="font-semibold text-slate-950">Contact:</span> {question.member.toLowerCase().replaceAll(" ", ".")}@example.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moderation actions</CardTitle>
              <CardDescription>Approval, hold, trash, recovery, and deletion states.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button>Approve</Button>
              <Button variant="outline">Reject approval</Button>
              <Button variant="outline">Hold</Button>
              <Button variant="outline">Move to trash</Button>
              <Button variant="outline">Recover</Button>
              <Button variant="outline">Permanent delete</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer history</CardTitle>
              <CardDescription>Response and moderation activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p className="rounded-2xl bg-slate-50 p-4">Question received and routed to the academic support queue.</p>
              <p className="rounded-2xl bg-slate-50 p-4">Teacher assignment status: {question.status}.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin memo</CardTitle>
              <CardDescription>Internal memo for academic operators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none ring-indigo-100 transition focus:ring-4" defaultValue="Confirm teacher assignment and answer quality before approval." />
              <div className="flex justify-end">
                <Button>Update memo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

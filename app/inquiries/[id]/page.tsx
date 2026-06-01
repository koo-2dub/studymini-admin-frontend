import Link from "next/link";
import { notFound } from "next/navigation";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inquiries } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

export default async function InquiryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);

  if (!inquiry) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="General inquiry detail"
        title={inquiry.subject}
        description={`${inquiry.id} · ${inquiry.requester} · ${inquiry.createdAt}`}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Button asChild variant="outline"><Link href="/inquiries">Back to list</Link></Button>
        <Button asChild><Link href={`/members/${inquiry.user.id}`}>View user detail</Link></Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full inquiry content</CardTitle>
              <CardDescription>Category: {inquiry.category} · Priority: {inquiry.priority} · <StatusBadge value={inquiry.status} /></CardDescription>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-5 leading-7 text-slate-800">{inquiry.content}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Write answer</CardTitle>
              <CardDescription>The administrator who submits this answer is recorded as the person in charge.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                담당자: 답변 작성 관리자 자동 지정
              </div>
              <textarea
                className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="답변 내용을 입력하세요."
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
              {inquiry.answerHistory.map((answer) => (
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

        <Card>
          <CardHeader>
            <CardTitle>User information</CardTitle>
            <CardDescription>Requester profile for support context.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <Info label="Name" value={inquiry.user.name} />
            <Info label="User ID" value={inquiry.user.id} />
            <Info label="Email" value={inquiry.user.email} />
            <Info label="Phone" value={inquiry.user.phone} />
            <Info label="Customer type" value={inquiry.user.customerType} />
            <Button asChild className="w-full"><Link href={`/members/${inquiry.user.id}`}>View user detail</Link></Button>
          </CardContent>
        </Card>
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

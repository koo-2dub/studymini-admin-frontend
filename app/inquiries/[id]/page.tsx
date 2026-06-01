import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { generalInquiries, getInquiryById, type InquiryStatus } from "../data";

const statusVariants: Record<InquiryStatus, "success" | "warning" | "slate"> = {
  미답변: "warning",
  답변완료: "success",
  보류: "slate",
};

export function generateStaticParams() {
  return generalInquiries.map((inquiry) => ({ id: inquiry.id }));
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = getInquiryById(id);
  if (!inquiry) notFound();

  return (
    <>
      <PageHeader
        eyebrow="일반 문의 상세"
        title="일반 문의"
        description={`${inquiry.userName}님의 일반 문의 내용을 확인하고 답변을 작성합니다.`}
        action={<span className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-indigo-100">{inquiry.id}</span>}
      />

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>문의 정보</CardTitle>
              <CardDescription>일반 문의의 기본 접수 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <InfoItem label="문의번호" value={inquiry.id} />
              <InfoItem label="문의일" value={inquiry.createdAt} />
              <InfoItem label="문의자" value={inquiry.userName} />
              <InfoItem label="이메일" value={inquiry.email} />
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">답변상태</p>
                <Badge className="mt-2 whitespace-nowrap" variant={statusVariants[inquiry.status]}>{inquiry.status}</Badge>
              </div>
              <InfoItem label="담당자" value={inquiry.assignee} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>문의 내용</CardTitle>
              <CardDescription>문의 제목, 본문, 첨부파일을 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-sm font-bold text-slate-500">제목</p>
                <h3 className="mt-2 text-xl font-black text-slate-950">{inquiry.title}</h3>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">문의 본문 전체</p>
                <p className="mt-2 whitespace-pre-line rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700">{inquiry.content}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">첨부파일</p>
                <div className="mt-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
                  {inquiry.attachments.length > 0 ? (
                    <ul className="space-y-2 text-sm font-semibold text-indigo-700">
                      {inquiry.attachments.map((file) => <li key={file}>📎 {file}</li>)}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-500">첨부파일이 없습니다.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>답변 작성</CardTitle>
              <CardDescription>답변 작성자가 담당자로 표시됩니다. 별도 담당자 지정은 없습니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-indigo-50 px-4 py-3 text-sm">
                <span className="font-bold text-slate-600">작성자 표시</span>
                <span className="font-black text-indigo-700">현재 관리자명: {inquiry.currentAdmin}</span>
              </div>
              <textarea
                defaultValue={inquiry.draftAnswer}
                placeholder="회원에게 전달할 답변을 입력하세요."
                className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              <div className="flex flex-wrap gap-3">
                <Button>답변 저장</Button>
                <Button variant="secondary">답변 완료 처리</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>답변 이력</CardTitle>
              <CardDescription>저장된 답변일, 답변 작성자, 답변 내용입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {inquiry.answers.length > 0 ? inquiry.answers.map((answer) => (
                <article key={`${answer.answeredAt}-${answer.author}`} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-black text-slate-900">{answer.author}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-slate-500">{answer.answeredAt}</span>
                  </div>
                  <p className="mt-3 whitespace-pre-line leading-7 text-slate-700">{answer.content}</p>
                </article>
              )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">아직 저장된 답변 이력이 없습니다.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>관리자 메모</CardTitle>
              <CardDescription>외부에 노출되지 않는 내부 메모와 처리 로그입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                defaultValue={inquiry.memo}
                placeholder="내부 공유용 메모를 입력하세요."
                className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              />
              <Button>메모 저장</Button>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="mb-3 text-sm font-black text-slate-700">처리 로그</p>
                <ol className="space-y-3 text-sm text-slate-600">
                  {inquiry.logs.map((log) => (
                    <li key={`${log.loggedAt}-${log.content}`} className="border-l-2 border-indigo-200 pl-3">
                      <p className="font-bold text-slate-900">{log.loggedAt}</p>
                      <p>{log.content}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-2 break-words font-bold text-slate-900">{value}</p>
    </div>
  );
}

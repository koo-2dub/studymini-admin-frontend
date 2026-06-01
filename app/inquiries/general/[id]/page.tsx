import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText } from "lucide-react";

import { WorkflowStatusBadge } from "@/components/dashboard/inquiry-badges";
import { TextArea } from "@/components/dashboard/inquiry-shared";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { generalInquiries } from "@/lib/mock-data";

export function generateStaticParams() {
  return generalInquiries.map((item) => ({ id: item.inquiryId }));
}

export default async function GeneralInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = generalInquiries.find((item) => item.inquiryId === id);
  if (!inquiry) notFound();

  return (
    <>
      <PageHeader eyebrow="문의 관리" title="일반 문의 상세" description={`${inquiry.inquiryId} · ${inquiry.createdAt} 접수된 문의를 확인하고 답변합니다.`} action={<Button asChild variant="secondary"><Link href="/inquiries/general"><ArrowLeft className="h-4 w-4" />목록으로</Link></Button>} />
      <section className="mb-6 flex flex-wrap items-center gap-3 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm"><span className="font-mono text-sm font-black text-slate-700">{inquiry.inquiryId}</span><WorkflowStatusBadge value={inquiry.status} /><span className="text-sm font-semibold text-slate-500">문의일 {inquiry.createdAt}</span></section>
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card><CardHeader><CardTitle>유저 정보</CardTitle><CardDescription>문의 작성자 기본 정보</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><Info label="닉네임/이름" value={inquiry.userName} /><Info label="User ID" value={inquiry.userId} /><Info label="이메일" value={inquiry.email} /><Info label="전화번호" value={inquiry.phone} /><Info label="회원상태" value={inquiry.memberStatus} /><Button asChild className="mt-3"><Link href={`/members/${inquiry.userId}`}>유저 상세 보기</Link></Button></CardContent></Card>
        <Card><CardHeader><CardTitle>문의 내용</CardTitle><CardDescription>내 프로필 문의하기로 등록된 본문</CardDescription></CardHeader><CardContent className="space-y-4"><Info label="제목" value={inquiry.title} /><div><p className="mb-2 text-xs font-bold text-slate-500">문의 본문</p><p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{inquiry.content}</p></div><Info label="문의일" value={inquiry.createdAt} /><Attachment files={inquiry.attachments} /></CardContent></Card>
        <Card><CardHeader><CardTitle>답변 작성</CardTitle><CardDescription>저장 후 답변 완료 처리할 수 있습니다.</CardDescription></CardHeader><CardContent className="space-y-4"><TextArea defaultValue={inquiry.answerHistory[0]?.content ?? ""} placeholder="답변 내용을 입력하세요." /><Info label="답변 담당자" value={inquiry.assignee} /><div className="flex gap-2"><Button>답변 저장</Button><Button variant="outline">답변 완료 처리</Button></div></CardContent></Card>
        <Card><CardHeader><CardTitle>답변 이력</CardTitle></CardHeader><CardContent className="space-y-3">{inquiry.answerHistory.length ? inquiry.answerHistory.map((answer) => <div key={answer.answeredAt} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">{answer.answeredAt} · {answer.adminName}</p><p className="mt-2 text-sm leading-7">{answer.content}</p></div>) : <p className="text-sm text-slate-500">등록된 답변 이력이 없습니다.</p>}</CardContent></Card>
        <Card className="xl:col-span-2"><CardHeader><CardTitle>관리자 메모</CardTitle><CardDescription>내부 메모와 처리 로그</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7">{inquiry.internalMemo}</div><div className="space-y-2">{inquiry.processLogs.map((log) => <p key={log} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-100">{log}</p>)}</div></CardContent></Card>
      </section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-800">{value}</span></div>; }
function Attachment({ files }: { files: string[] }) { return <div><p className="mb-2 text-xs font-bold text-slate-500">첨부파일</p><div className="rounded-2xl border border-dashed border-slate-200 p-4">{files.length ? files.map((file) => <Badge key={file} variant="slate" className="mr-2"><FileText className="mr-1 h-3 w-3" />{file}</Badge>) : <span className="text-sm text-slate-400">첨부파일 없음</span>}</div></div>; }

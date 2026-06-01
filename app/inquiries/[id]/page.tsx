import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generalInquiries } from "@/lib/inquiry-data";

export default async function GeneralInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = generalInquiries.find((item) => item.id === id);

  if (!inquiry) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="일반 문의 상세" title={inquiry.title} description="목록과 분리된 상세 페이지에서 문의 내용과 답변 처리 정보를 확인합니다." />
      <Button asChild variant="outline"><Link href="/inquiries">일반 문의 목록으로</Link></Button>

      <Card>
        <CardHeader><CardTitle>문의 정보</CardTitle></CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <DetailItem label="문의번호" value={inquiry.id} />
          <DetailItem label="문의일" value={inquiry.inquiryDate} />
          <DetailItem label="문의자" value={`${inquiry.requester} (${inquiry.userId})`} />
          <DetailItem label="이메일" value={inquiry.email} />
          <DetailItem label="답변상태" value={<AnswerBadge value={inquiry.answerStatus} />} />
          <DetailItem label="담당자" value={inquiry.manager} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>문의 내용</CardTitle></CardHeader>
        <CardContent className="text-sm leading-7 text-slate-700">{inquiry.content}</CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>답변</CardTitle></CardHeader>
        <CardContent className="text-sm leading-7 text-slate-700">{inquiry.answer || "아직 등록된 답변이 없습니다."}</CardContent>
      </Card>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function AnswerBadge({ value }: { value: string }) {
  const variant = value === "답변완료" ? "success" : value === "답변중" ? "warning" : "rose";
  return <Badge variant={variant}>{value}</Badge>;
}

import { ArrowLeft, CalendarDays, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { inquiries } from "../data";
import { AnswerPanel } from "./answer-panel";

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);

  if (!inquiry) notFound();

  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="General inquiry detail"
        description="일반 문의 상세 내용을 확인하고 답변을 저장합니다."
        action={
          <Link
            href="/inquiries"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <InfoCard icon={UserRound} label="문의자" value={inquiry.requester} />
        <InfoCard icon={Mail} label="이메일" value={inquiry.email} />
        <InfoCard icon={CalendarDays} label="문의일" value={inquiry.inquiryDate} />
        <Card>
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">답변상태</p>
              <div className="mt-2">
                <Badge variant={inquiry.status === "답변완료" ? "success" : "warning"}>{inquiry.status}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">담당자</p>
              <p className="mt-2 font-bold text-slate-900">{inquiry.assignee}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>문의 내용</CardTitle>
            <CardDescription>일반 문의의 제목과 문의 본문입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">제목</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{inquiry.subject}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">문의 본문</p>
              <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">{inquiry.content}</p>
            </div>
          </CardContent>
        </Card>

        <AnswerPanel inquiry={inquiry} />
      </div>
    </>
  );
}

import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Mail, UserRound } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inquiries } from "../data";
import { AnswerPanel } from "./answer-panel";

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);
  if (!inquiry) notFound();

  return (
    <>
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/inquiries">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        </Button>
      </div>

      <PageHeader
        eyebrow="일반 문의 상세"
        title={inquiry.id}
        description="일반 문의의 제목과 본문을 확인하고 1회 답변을 저장합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <UserRound className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-xs font-bold text-muted-foreground">문의자</p>
              <p className="font-black">{inquiry.requester}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Mail className="h-5 w-5 text-indigo-600" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-muted-foreground">이메일</p>
              <p className="truncate font-black">{inquiry.email}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <CalendarDays className="h-5 w-5 text-indigo-600" />
            <div>
              <p className="text-xs font-bold text-muted-foreground">문의일</p>
              <p className="font-black">{inquiry.inquiryDate}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-5">
            <Badge variant={inquiry.status === "답변완료" ? "success" : "warning"}>{inquiry.status}</Badge>
            <div>
              <p className="text-xs font-bold text-muted-foreground">담당자</p>
              <p className="font-black">{inquiry.assignee}</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>문의 내용</CardTitle>
          <CardDescription>일반 문의의 제목과 문의 본문입니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-bold text-muted-foreground">제목</p>
            <p className="rounded-2xl bg-slate-50 p-4 text-lg font-black text-slate-900">{inquiry.subject}</p>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-muted-foreground">문의 본문</p>
            <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700">{inquiry.content}</p>
          </div>
        </CardContent>
      </Card>

      <AnswerPanel inquiry={inquiry} />
    </>
  );
}

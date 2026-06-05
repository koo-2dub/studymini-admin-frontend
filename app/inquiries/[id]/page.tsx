import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { UserInfoCard } from "@/app/_components/user-info-card";
import { PageHeader } from "@/components/dashboard/page-header";
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
      <PageHeader
        eyebrow="일반 문의"
        title="일반 문의 상세"
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
      <div className="space-y-6">
        <UserInfoCard
          title="문의자 정보"
          description="일반 문의를 등록한 회원의 기본 정보와 회원 상세 링크입니다."
          user={{
            name: inquiry.requester,
            memberId: inquiry.memberId,
            email: inquiry.email,
            phone: inquiry.phone,
            memberStatus: inquiry.memberStatus,
            lastLogin: inquiry.lastLogin,
          }}
        />
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

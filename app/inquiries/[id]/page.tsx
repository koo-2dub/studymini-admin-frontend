import { ArrowLeft, Download, File, FileText, ImageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { UserInfoCard } from "@/app/_components/user-info-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { inquiries, type InquiryAttachment } from "../data";
import { AnswerPanel } from "./answer-panel";

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

const fileTypeLabel = (type: InquiryAttachment["type"]) => {
  if (type === "image") return "이미지";
  if (type === "pdf") return "PDF";
  return "기타 파일";
};

function AttachmentPreview({ attachment }: { attachment: InquiryAttachment }) {
  if (attachment.type === "image") {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600">
        {attachment.thumbnailUrl ? (
          <img src={attachment.thumbnailUrl} alt={`${attachment.name} 썸네일`} className="h-full w-full object-cover" />
        ) : (
          <ImageIcon className="h-7 w-7" />
        )}
      </div>
    );
  }

  if (attachment.type === "pdf") {
    return (
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-600">
        <FileText className="h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 text-slate-500">
      <File className="h-7 w-7" />
    </div>
  );
}

function AttachmentSection({ attachments }: { attachments: InquiryAttachment[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>첨부파일</CardTitle>
        <CardDescription>유저가 문의 등록 시 업로드한 파일입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {attachments.length > 0 ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {attachments.map((attachment) => (
              <li key={attachment.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <AttachmentPreview attachment={attachment} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-black text-slate-950">{attachment.name}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{attachment.mimeType}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={attachment.downloadUrl} download>
                        <Download className="h-4 w-4" />
                        다운로드
                      </a>
                    </Button>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-bold text-slate-400">파일 타입</p>
                      <p className="font-semibold">{fileTypeLabel(attachment.type)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">파일 용량</p>
                      <p className="font-semibold">{attachment.size}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">업로드 일시</p>
                      <p className="font-semibold">{attachment.uploadedAt}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm font-semibold text-slate-400">
            첨부파일 없음
          </div>
        )}
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
        <AttachmentSection attachments={inquiry.attachments} />
        <AnswerPanel inquiry={inquiry} />
      </div>
    </>
  );
}

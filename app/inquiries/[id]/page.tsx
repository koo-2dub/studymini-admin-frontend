import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { generalInquiries } from "@/lib/inquiry-state";
import { InquiryDetailClient } from "./inquiry-detail-client";

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = generalInquiries.find((item) => item.id === id);

  if (!inquiry) {
    notFound();
  }

  return (
    <>
      <PageHeader
        eyebrow="General inquiry"
        title={inquiry.subject}
        description="일반 문의는 관리자 답변 1개와 별도 관리자 메모로 관리합니다."
      />
      <InquiryDetailClient inquiry={inquiry} />
    </>
  );
}

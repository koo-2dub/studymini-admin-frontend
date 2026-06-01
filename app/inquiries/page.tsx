import { PageHeader } from "@/components/dashboard/page-header";
import { InquiriesClient } from "./inquiries-client";

export default function InquiriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="일반 문의"
        description="회원의 일반 문의 답변 상태와 담당자를 확인합니다."
      />
      <InquiriesClient />
    </>
  );
}

import { InquiriesDashboard } from "@/components/dashboard/inquiries-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { inquiries } from "@/lib/mock-data";

export default function InquiriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="문의 관리"
        title="일반 문의"
        description="운영자가 문의 내용을 확인하고 담당자 배정부터 답변 완료 처리까지 한 화면에서 진행합니다."
      />
      <InquiriesDashboard initialInquiries={inquiries} />
    </>
  );
}

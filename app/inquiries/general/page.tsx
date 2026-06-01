import { GeneralInquiriesDashboard } from "@/components/dashboard/general-inquiries-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { generalInquiries } from "@/lib/mock-data";

export default function GeneralInquiriesPage() {
  return (
    <>
      <PageHeader eyebrow="문의 관리" title="일반 문의" description="내 프로필의 문의하기로 접수된 문의를 확인하고 관리자 답변을 작성합니다." />
      <GeneralInquiriesDashboard inquiries={generalInquiries} />
    </>
  );
}

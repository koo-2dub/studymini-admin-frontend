import { LessonInquiriesDashboard } from "@/components/dashboard/lesson-inquiries-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { lessonInquiries } from "@/lib/mock-data";

export default function LessonInquiriesPage() {
  return (
    <>
      <PageHeader eyebrow="문의 관리" title="학습 문의" description="강의 하단 질문을 승인·검수한 뒤 공개 답변을 작성합니다. 승인 전 질문은 사용자에게 공개되지 않습니다." />
      <LessonInquiriesDashboard inquiries={lessonInquiries} />
    </>
  );
}

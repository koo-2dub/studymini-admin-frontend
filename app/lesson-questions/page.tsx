import { LessonQuestionsDashboard } from "@/components/dashboard/lesson-questions-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { lessonQuestions } from "@/lib/mock-data";

export default function LessonQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="문의 관리"
        title="학습 문의"
        description="학습 질문의 공개 승인 상태와 담당자 배정, 답변 처리를 함께 관리합니다."
      />
      <LessonQuestionsDashboard initialQuestions={lessonQuestions} />
    </>
  );
}

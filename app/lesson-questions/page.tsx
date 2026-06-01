import { PageHeader } from "@/components/dashboard/page-header";
import { lessonQuestions } from "@/lib/mock-data";

import { LessonQuestionList } from "./lesson-question-list";

export default function LessonQuestionsPage() {
  return (
    <>
      <PageHeader eyebrow="Academic support" title="Lesson questions" description="Route learner lesson questions to teachers and monitor response freshness." />
      <LessonQuestionList data={lessonQuestions} />
    </>
  );
}

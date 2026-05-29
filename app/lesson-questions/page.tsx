import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { lessonQuestions } from "@/lib/mock-data";

export default function LessonQuestionsPage() {
  return <><PageHeader eyebrow="Academic support" title="Lesson questions" description="Route learner lesson questions to teachers and monitor response freshness." /><DataTable title="Question queue" description="Mock content help requests from students." data={lessonQuestions} columns={[{key:"id",header:"Question"},{key:"lesson",header:"Lesson"},{key:"member",header:"Member"},{key:"age",header:"Age"},{key:"status",header:"Status",render:(question)=><StatusBadge value={question.status}/>}]} /></>;
}

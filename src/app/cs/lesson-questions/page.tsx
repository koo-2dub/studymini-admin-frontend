import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { lessonQuestions } from "@/lib/mock-data";
export default function LessonQuestionsPage() { return <AppShell><PageHeader title="학습 질문" description="언어, 코스, 레슨, 상태, 기간, 담당자 기준으로 LMS와 연결된 질문을 관리합니다." primaryAction="튜터 배정" /><DataTable data={lessonQuestions} filters={["언어", "코스", "레슨", "상태", "기간", "담당자"]} columns={[{ key: "id", header: "질문 ID", render: (q) => <Link className="font-bold text-orange-600" href={`/cs/lesson-questions/${q.id}`}>{q.id}</Link> }, { key: "language", header: "언어", render: (q) => q.language }, { key: "course", header: "코스", render: (q) => q.course }, { key: "lesson", header: "레슨", render: (q) => q.lesson }, { key: "user", header: "사용자", render: (q) => q.user }, { key: "preview", header: "질문 미리보기", render: (q) => q.preview }, { key: "created", header: "생성일", render: (q) => q.created }, { key: "status", header: "상태", render: (q) => <StatusBadge value={q.status} /> }, { key: "assignee", header: "답변자", render: (q) => q.assignee }, { key: "action", header: "액션", render: (q) => <Button asChild variant="outline" size="sm"><Link href={`/cs/lesson-questions/${q.id}`}>답변</Link></Button> }]} /></AppShell>; }

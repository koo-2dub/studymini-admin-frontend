import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { QuickLinks } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { courses } from "@/lib/mock-data";
export default function CoursesPage() { return <AppShell><PageHeader title="LMS 관리" description="언어, 코스, 레슨, 그룹, PDF 다운로드 로그를 관리하고 학습 질문과 연결합니다." primaryAction="코스 생성" /><div className="mb-6"><QuickLinks links={[{ href: "/lms/languages", label: "Languages list" }, { href: "/lms/lessons", label: "Lessons list" }, { href: "/lms/groups", label: "Groups list" }, { href: "/lms/pdf-download-logs", label: "PDF download log" }, { href: "/cs/lesson-questions", label: "Lesson Questions" }]} /></div><DataTable data={courses} filters={["언어", "상태", "그룹", "수정일"]} columns={[{ key: "id", header: "코스 ID", render: (c) => <Link className="font-bold text-orange-600" href={`/lms/courses/${c.id}`}>{c.id}</Link> }, { key: "language", header: "언어", render: (c) => c.language }, { key: "title", header: "코스명", render: (c) => c.title }, { key: "lessons", header: "레슨", render: (c) => `${c.lessons}개` }, { key: "groups", header: "그룹", render: (c) => `${c.groups}개` }, { key: "status", header: "상태", render: (c) => <StatusBadge value={c.status} /> }, { key: "action", header: "액션", render: (c) => <Button asChild variant="outline" size="sm"><Link href={`/lms/courses/${c.id}`}>상세</Link></Button> }]} /></AppShell>; }

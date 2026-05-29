import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { generalInquiries } from "@/lib/mock-data";
export default function GeneralInquiriesPage() { return <AppShell><PageHeader title="일반 문의" description="상태, 기간, 담당자로 필터링하고 Slack 수신 여부와 답변자를 확인합니다." primaryAction="담당자 일괄 배정" /><DataTable data={generalInquiries} filters={["상태", "기간", "담당자", "Slack 수신", "미답변만"]} columns={[{ key: "id", header: "문의 ID", render: (q) => <Link className="font-bold text-orange-600" href={`/cs/general-inquiries/${q.id}`}>{q.id}</Link> }, { key: "user", header: "사용자", render: (q) => q.user }, { key: "email", header: "이메일", render: (q) => q.email }, { key: "title", header: "제목", render: (q) => q.title }, { key: "preview", header: "내용 미리보기", render: (q) => q.preview }, { key: "created", header: "생성일", render: (q) => q.created }, { key: "status", header: "상태", render: (q) => <StatusBadge value={q.status} /> }, { key: "assignee", header: "답변자", render: (q) => q.assignee }, { key: "answered", header: "답변일", render: (q) => q.answeredAt }, { key: "action", header: "액션", render: (q) => <Button asChild variant="outline" size="sm"><Link href={`/cs/general-inquiries/${q.id}`}>답변</Link></Button> }]} /></AppShell>; }

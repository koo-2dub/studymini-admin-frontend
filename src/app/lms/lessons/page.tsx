import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
const rows = [
  { id: "LESSONS-001", name: "스페인어 베이직", count: "48", status: "운영중" },
  { id: "LESSONS-002", name: "독일어 패키지", count: "72", status: "운영중" },
  { id: "LESSONS-003", name: "프랑스어 올인원", count: "64", status: "준비중" },
];
export default function Page() { return <AppShell><PageHeader title="LMS lessons" description="LMS lessons 목업 리스트입니다. 개발자가 이후 AWS API와 연결합니다." primaryAction="새 항목 추가" /><DataTable data={rows} filters={["언어", "상태", "수정일"]} columns={[{ key: "id", header: "ID", render: (r) => r.id }, { key: "name", header: "이름", render: (r) => r.name }, { key: "count", header: "수량/로그", render: (r) => r.count }, { key: "status", header: "상태", render: (r) => r.status }]} /></AppShell>; }

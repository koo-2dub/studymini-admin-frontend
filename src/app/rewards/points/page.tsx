import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { FormMockup } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
const rows = [{ id: "RW-001", type: "정책", name: "기본 적립", status: "활성" }, { id: "RW-002", type: "만료", name: "연말 소멸", status: "예약" }, { id: "RW-003", type: "수동조정", name: "CS 보상", status: "완료" }];
export default function Page() { return <AppShell><PageHeader title="Rewards points" description="바우처 발급, 포인트 정책, 만료 설정, 기간 한정 지갑, 로그, 수동 조정, 대량 업로드 UI입니다." primaryAction="저장" /><div className="mb-6"><FormMockup title="설정/발급 폼" fields={["대상 회원", "정책명", "포인트", "만료일", "관리 메모"]} /></div><DataTable data={rows} filters={["유형", "상태", "기간"]} columns={[{ key: "id", header: "ID", render: (r) => r.id }, { key: "type", header: "유형", render: (r) => r.type }, { key: "name", header: "이름", render: (r) => r.name }, { key: "status", header: "상태", render: (r) => r.status }]} /></AppShell>; }

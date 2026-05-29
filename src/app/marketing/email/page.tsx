import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { FormMockup } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
const rows = [{ id: "MSG-001", channel: "Email", title: "결제 완료", status: "발송" }, { id: "MSG-002", channel: "Alimtalk", title: "수강 시작 안내", status: "예약" }, { id: "MSG-003", channel: "SMS", title: "쿠폰 만료 안내", status: "실패" }];
export default function Page() { return <AppShell><PageHeader title="Marketing email" description="이메일 알림, 알림톡/SMS 설정, 발송 로그를 확인하는 목업 화면입니다." primaryAction="템플릿 저장" /><div className="mb-6"><FormMockup title="메시지 설정" fields={["채널", "템플릿명", "제목", "본문", "발송 조건", "상태"]} /></div><DataTable data={rows} filters={["채널", "상태", "기간"]} columns={[{ key: "id", header: "ID", render: (r) => r.id }, { key: "channel", header: "채널", render: (r) => r.channel }, { key: "title", header: "제목", render: (r) => r.title }, { key: "status", header: "상태", render: (r) => r.status }]} /></AppShell>; }

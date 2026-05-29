import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { members } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function MembersPage() {
  return <AppShell><PageHeader title="회원 관리" description="이름, 이메일, 휴대폰, wp_id, User ID로 검색하고 상태별로 필터링합니다." primaryAction="회원 세그먼트 저장" /><DataTable data={members} searchPlaceholder="이름, 이메일, 휴대폰, wp_id, User ID 검색" filters={["전체", "활성", "휴면", "탈퇴", "가입일", "구매금액"]} columns={[{ key: "id", header: "User ID", render: (m) => <Link className="font-bold text-orange-600" href={`/members/${m.id}`}>{m.id}</Link> }, { key: "name", header: "이름", render: (m) => m.name }, { key: "email", header: "이메일", render: (m) => m.email }, { key: "phone", header: "휴대폰", render: (m) => m.phone }, { key: "wp", header: "wp_id", render: (m) => m.wpId }, { key: "status", header: "상태", render: (m) => <StatusBadge value={m.status} /> }, { key: "paid", header: "누적결제", render: (m) => formatCurrency(m.totalPaid) }, { key: "action", header: "액션", render: (m) => <Button asChild variant="outline" size="sm"><Link href={`/members/${m.id}`}>상세</Link></Button> }]} /></AppShell>;
}

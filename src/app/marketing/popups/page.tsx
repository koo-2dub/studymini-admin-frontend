import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { PopupPreview, QuickLinks } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { popups } from "@/lib/mock-data";
import { formatNumber } from "@/lib/utils";
export default function PopupsPage() { return <AppShell><PageHeader title="마케팅 / CRM - 팝업 관리" description="팝업 생성, 노출 위치, 기간, 디바이스, Bitly URL, CTA 옵션과 성과를 관리합니다." primaryAction="팝업 생성" /><div className="mb-6 grid gap-6 xl:grid-cols-[1fr_360px]"><QuickLinks links={[{ href: "/marketing/email", label: "Email notifications" }, { href: "/marketing/alimtalk-sms", label: "Alimtalk/SMS settings" }, { href: "/marketing/send-logs", label: "Send logs" }]} /><PopupPreview /></div><DataTable data={popups} filters={["상태", "노출 페이지", "기간", "PC/Mobile"]} columns={[{ key: "id", header: "팝업 ID", render: (p) => <Link className="font-bold text-orange-600" href={`/marketing/popups/${p.id}`}>{p.id}</Link> }, { key: "title", header: "제목", render: (p) => p.title }, { key: "page", header: "노출 페이지", render: (p) => p.page }, { key: "period", header: "노출 기간", render: (p) => p.period }, { key: "device", header: "디바이스", render: (p) => p.device }, { key: "status", header: "상태", render: (p) => <StatusBadge value={p.status} /> }, { key: "impressions", header: "노출", render: (p) => formatNumber(p.impressions) }, { key: "clicks", header: "클릭", render: (p) => formatNumber(p.clicks) }, { key: "ctr", header: "클릭률", render: (p) => p.ctr }, { key: "action", header: "액션", render: (p) => <Button asChild variant="outline" size="sm"><Link href={`/marketing/popups/${p.id}`}>편집</Link></Button> }]} /></AppShell>; }

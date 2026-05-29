import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { DataTable } from "@/components/admin/data-table";
import { GeneratorBox, QuickLinks } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { coupons } from "@/lib/mock-data";
export default function CouponsPage() { return <AppShell><PageHeader title="쿠폰 / 바우처 / 포인트" description="쿠폰 생성, 바우처 발급, 포인트 정책/만료/지갑/로그/수동 조정을 관리합니다." primaryAction="쿠폰 생성" secondaryAction="대량 포인트 업로드" /><div className="mb-6 space-y-4"><QuickLinks links={[{ href: "/rewards/coupons/new", label: "Coupon create/edit" }, { href: "/rewards/vouchers", label: "Voucher issue" }, { href: "/rewards/points", label: "Point policy/settings/log" }]} /><GeneratorBox /></div><DataTable data={coupons} filters={["상태", "유형", "사용기간"]} columns={[{ key: "id", header: "쿠폰 ID", render: (c) => c.id }, { key: "name", header: "쿠폰명", render: (c) => <Link className="font-bold text-orange-600" href="/rewards/coupons/new">{c.name}</Link> }, { key: "code", header: "코드", render: (c) => c.code }, { key: "type", header: "유형", render: (c) => c.type }, { key: "value", header: "혜택", render: (c) => c.value }, { key: "issued", header: "발급", render: (c) => c.issued }, { key: "used", header: "사용", render: (c) => c.used }, { key: "status", header: "상태", render: (c) => <StatusBadge value={c.status} /> }]} /></AppShell>; }

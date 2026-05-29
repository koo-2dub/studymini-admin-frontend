import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { coupons } from "@/lib/mock-data";

export default function CouponsPage() {
  return <><PageHeader eyebrow="Promotions" title="Coupons" description="Manage mock discount codes, expiry windows, redemption counts, and campaign health." /><DataTable title="Coupon campaigns" description="Reusable promo-code management view." data={coupons.map((coupon) => ({ id: coupon.code, ...coupon }))} columns={[{key:"code",header:"Code"},{key:"discount",header:"Discount"},{key:"used",header:"Used"},{key:"expires",header:"Expires"},{key:"status",header:"Status",render:(coupon)=><StatusBadge value={coupon.status}/>}]} /></>;
}

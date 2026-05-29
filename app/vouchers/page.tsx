import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { vouchers } from "@/lib/mock-data";

export default function VouchersPage() {
  return <><PageHeader eyebrow="Benefits" title="Vouchers" description="Issue, schedule, and reconcile learner vouchers using mock operational data." /><DataTable title="Voucher registry" description="Benefits assigned through points, campaigns, or admin grants." data={vouchers.map((voucher) => ({ id: voucher.code, ...voucher }))} columns={[{key:"code",header:"Code"},{key:"owner",header:"Owner"},{key:"value",header:"Value"},{key:"status",header:"Status",render:(voucher)=><StatusBadge value={voucher.status}/>}]} /></>;
}

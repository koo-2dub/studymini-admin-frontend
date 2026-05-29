import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { orders } from "@/lib/mock-data";

export default function OrdersPage() {
  return <><PageHeader eyebrow="Payments" title="Orders / Payments" description="Mock payment operations for subscriptions, renewals, refunds, and failed charges." /><DataTable title="Payment ledger" description="Recent transactions with payment state." data={orders} columns={[{key:"id",header:"Order"},{key:"member",header:"유저"},{key:"product",header:"Product"},{key:"amount",header:"Amount"},{key:"date",header:"Date"},{key:"status",header:"Status",render:(order)=><StatusBadge value={order.status}/>}]} /></>;
}

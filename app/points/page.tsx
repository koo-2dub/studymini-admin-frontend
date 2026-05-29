import { DataTable } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { pointsLedger } from "@/lib/mock-data";

export default function PointsPage() {
  return <><PageHeader eyebrow="Rewards" title="Points" description="Audit the user rewards economy with earned and redeemed point transactions." /><DataTable title="Points ledger" description="Mock reward activity across user accounts." data={pointsLedger.map((entry, index) => ({ id: `${index}`, ...entry }))} columns={[{key:"member",header:"유저"},{key:"action",header:"Action"},{key:"points",header:"Points"},{key:"date",header:"Date"}]} /></>;
}

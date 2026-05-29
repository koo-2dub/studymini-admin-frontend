import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { popups } from "@/lib/mock-data";

export default function PopupsPage() {
  return <><PageHeader eyebrow="On-site messaging" title="Popup management" description="Plan banners, launch modals, and maintenance notices for different audiences." /><DataTable title="Popup campaigns" description="Mock popup performance and publishing workflow." data={popups.map((popup, index) => ({ id: `${index}`, ...popup }))} columns={[{key:"title",header:"Popup"},{key:"audience",header:"Audience"},{key:"impressions",header:"Impressions"},{key:"status",header:"Status",render:(popup)=><StatusBadge value={popup.status}/>}]} /></>;
}

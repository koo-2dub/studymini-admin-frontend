import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { inquiries } from "@/lib/mock-data";

export default function InquiriesPage() {
  return <><PageHeader eyebrow="Support desk" title="General inquiries" description="Triage user questions, billing issues, and platform support requests." /><DataTable title="Inquiry queue" description="Mock general support tickets grouped by urgency." data={inquiries} columns={[{key:"id",header:"Ticket"},{key:"subject",header:"Subject"},{key:"requester",header:"Requester"},{key:"priority",header:"Priority"},{key:"status",header:"Status",render:(inquiry)=><StatusBadge value={inquiry.status}/>}]} /></>;
}

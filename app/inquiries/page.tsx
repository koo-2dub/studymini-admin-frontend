import { PageHeader } from "@/components/dashboard/page-header";
import { inquiries } from "@/lib/mock-data";

import { InquiryList } from "./inquiry-list";

export default function InquiriesPage() {
  return (
    <>
      <PageHeader eyebrow="Support desk" title="General inquiries" description="Triage member questions, billing issues, and platform support requests." />
      <InquiryList data={inquiries} />
    </>
  );
}

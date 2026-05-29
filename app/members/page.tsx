import Link from "next/link";
import { Eye } from "lucide-react";

import { DataTable, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { members } from "@/lib/mock-data";

export default function MembersPage() {
  return (
    <>
      <PageHeader eyebrow="Learner CRM" title="Members" description="Search, segment, and inspect StudyMini learners using polished mock account data." />
      <DataTable
        title="Member directory"
        description="Every row links to a member detail workspace with working tabs."
        data={members}
        columns={[
          { key: "name", header: "Member", render: (member) => <div><p className="font-bold">{member.name}</p><p className="text-xs text-muted-foreground">{member.email}</p></div> },
          { key: "plan", header: "Plan" },
          { key: "segment", header: "Segment" },
          { key: "status", header: "Status", render: (member) => <StatusBadge value={member.status} /> },
          { key: "spend", header: "Spend" },
          { key: "id", header: "Detail", render: (member) => <Button asChild variant="outline" size="sm"><Link href={`/members/${member.id}`}><Eye className="h-3.5 w-3.5" />Open</Link></Button> },
        ]}
      />
    </>
  );
}

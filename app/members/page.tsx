import { MembersDashboard } from "@/components/dashboard/members-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { members } from "@/lib/mock-data";

export default function MembersPage() {
  return (
    <>
      <PageHeader eyebrow="Learner CRM" title="Members" description="Search, segment, and inspect StudyMini learners using polished mock account data." />
      <MembersDashboard members={members} />
    </>
  );
}

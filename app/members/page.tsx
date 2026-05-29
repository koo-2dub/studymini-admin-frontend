import { MembersDashboard } from "@/components/dashboard/members-dashboard";
import { PageHeader } from "@/components/dashboard/page-header";
import { members } from "@/lib/mock-data";

export default function MembersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Learner CRM"
        title="Members"
        description="유저 현황을 확인하고 조건별로 유저 목록을 검색합니다."
      />
      <MembersDashboard members={members} />
    </>
  );
}

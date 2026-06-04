import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrialById, initialTrialMembers } from "../data";
import { TrialMemberManager } from "../trial-member-ux";

function statusVariant(value: string) {
  if (value === "진행중") return "success";
  if (value === "예정") return "warning";
  return "slate";
}

export default async function TrialDetailPage({ params }: { params: Promise<{ trialId: string }> }) {
  const { trialId } = await params;
  const trial = getTrialById(trialId);

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 상세"
        description="체험단 정보와 참여 회원별 부여 콘텐츠 권한을 관리합니다."
      />
      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>{trial.name}</CardTitle>
              <CardDescription>{trial.memo}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant(trial.status)}>{trial.status}</Badge>
              <Button asChild variant="outline" size="sm"><Link href="/access/trials">목록으로</Link></Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">기간</p>
              <p className="mt-2 font-semibold text-slate-800">{trial.startDate} ~ {trial.endDate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">참여 회원</p>
              <p className="mt-2 font-semibold text-slate-800">{trial.memberCount}명</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">대상 콘텐츠</p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{trial.content.map((content) => `${content.type}: ${content.title}`).join(" / ")}</p>
            </div>
          </CardContent>
        </Card>

        <TrialMemberManager
          title="참여 회원 목록"
          description="회원 추가와 CSV 업로드를 통해 참여 회원을 추가하고, 목록에서 현재 부여된 콘텐츠(코스/패키지)를 바로 확인합니다."
          initialMembers={initialTrialMembers}
          grantedContent={trial.content}
          mode="detail"
        />
      </div>
    </>
  );
}

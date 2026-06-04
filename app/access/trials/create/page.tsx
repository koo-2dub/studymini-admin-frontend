import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trialContents } from "../data";
import { TrialMemberManager } from "../trial-member-ux";

export default function CreateTrialPage() {
  const defaultContents = [trialContents[0], trialContents[2]];

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 생성"
        description="체험단 기본 정보, 대상 콘텐츠, 참여 회원을 저장 전 미리 구성합니다."
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>mock 상태로 체험단 생성 정보를 입력하는 화면입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              체험단명
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="신규 체험단" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              담당 부서
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="Growth Team" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              시작일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-04" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              종료일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-07-04" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>대상 콘텐츠</CardTitle>
            <CardDescription>체험단 참여 회원에게 부여될 코스/패키지 권한입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {trialContents.map((content) => (
              <label key={content.id} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-sm font-semibold text-slate-700">
                <input type="checkbox" defaultChecked={defaultContents.some((selected) => selected.id === content.id)} />
                <span>{content.type}: {content.title}</span>
              </label>
            ))}
          </CardContent>
        </Card>

        <TrialMemberManager
          title="참여 회원"
          description="생성 화면에서도 회원 검색 추가와 CSV 업로드로 참여 회원을 미리 추가할 수 있습니다."
          grantedContent={defaultContents}
          mode="preview"
        />

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline"><Link href="/access/trials">취소</Link></Button>
          <Button type="button">저장</Button>
        </div>
      </div>
    </>
  );
}

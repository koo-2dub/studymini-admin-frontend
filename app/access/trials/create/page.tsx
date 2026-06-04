import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrialCreateParticipationSection } from "../trial-member-ux";

export default function CreateTrialPage() {
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
            <CardDescription>체험단명, 기간, 설명/메모를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              체험단명
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="신규 체험단" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              시작일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-04" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              종료일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-07-04" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              설명/메모
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                defaultValue="체험단 운영 목적과 안내 메모를 입력하세요."
              />
            </label>
          </CardContent>
        </Card>

        <TrialCreateParticipationSection />

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline"><Link href="/access/trials">취소</Link></Button>
          <Button type="button">저장</Button>
        </div>
      </div>
    </>
  );
}

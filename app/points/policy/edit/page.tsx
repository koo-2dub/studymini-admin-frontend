import Link from "next/link";
import { Settings } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" {...props} />;
}

function Select({ children, defaultValue }: { children: React.ReactNode; defaultValue?: string }) {
  return <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={defaultValue}>{children}</select>;
}


export default function PointPolicyEditPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 정책 수정"
        description="포인트 사용 한도, 기본 유효기간, 차감 우선순위 등 실제 운영 정책값만 수정합니다."
        action={<Button asChild variant="secondary"><Link href="/points">포인트 관리로</Link></Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />공통 사용 정책</CardTitle>
            <CardDescription>신규가입 지급 포인트는 정책이 아니라 포인트 캠페인 생성에서 관리합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="최대 사용 가능 비율"><Input defaultValue="20%" /></Field>
            <Field label="최소 사용 가능 포인트"><Input defaultValue="1000" /></Field>
            <Field label="일반 포인트 유효기간 기본값"><Select defaultValue="지급일 기준 12개월"><option>지급일 기준 6개월</option><option>지급일 기준 12개월</option><option>지급일 기준 24개월</option></Select></Field>
            <Field label="차감 우선순위"><Select defaultValue="기간제 포인트 → 일반 포인트"><option>기간제 포인트 → 일반 포인트</option></Select></Field>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button asChild variant="secondary"><Link href="/points">취소</Link></Button>
          <Button type="button">저장</Button>
        </div>
      </div>
    </>
  );
}

import Link from "next/link";
import { AlertCircle, AlertTriangle, CheckCircle2, Settings } from "lucide-react";

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

const reviewRows = [
  ["최대 사용 가능 비율", "주문 금액의 50%", "주문 금액의 20%"],
  ["최소 사용 가능 포인트", "500P", "1,000P"],
  ["일반 포인트 유효기간 기본값", "지급일 기준 6개월", "지급일 기준 12개월"],
  ["소멸 알림 기준", "D-7, D-1", "D-30, D-7, D-1"],
  ["차감 우선순위", "소멸 임박 포인트 우선", "기간제 포인트 → 일반 포인트"],
];

const operationalWarnings = [
  "최대 사용 가능 비율 변경",
  "최소 사용 가능 포인트 변경",
  "일반 포인트 유효기간 변경",
  "소멸 알림 기준 변경",
  "차감 우선순위 변경",
];

export default function PointPolicyEditPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 정책 수정"
        description="포인트 사용 한도, 유효기간, 소멸 알림, 차감 우선순위 등 공통 정책만 수정합니다."
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
            <Field label="소멸 알림 기준"><Input defaultValue="D-30, D-7, D-1" /></Field>
            <Field label="차감 우선순위"><Select defaultValue="기간제 포인트 → 일반 포인트"><option>기간제 포인트 → 일반 포인트</option></Select></Field>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" />포인트 사용 정책 설명</CardTitle>
              <CardDescription>운영자가 저장 전 계산 기준을 명확히 확인할 수 있도록 고정 노출합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm font-semibold leading-7 text-slate-700">
              <p className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900">
                포인트 사용 한도는 일반/기간제 포인트별로 따로 계산하지 않고, 회원의 전체 사용 가능 포인트를 기준으로 계산합니다.
              </p>
              <div className="rounded-2xl border border-slate-100 bg-white p-4">
                <p className="font-black text-slate-950">차감 순서</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>기간제 포인트</li>
                  <li>일반 포인트</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>사용 가능 포인트 계산 예시</CardTitle>
              <CardDescription>상품금액 100,000원, 최대 사용 가능 비율 20% 기준입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                ["일반 포인트", "3,000P"],
                ["기간제 포인트", "5,000P"],
                ["총 보유 포인트", "8,000P"],
                ["상품금액", "100,000원"],
                ["주문 기준 최대 사용 가능 포인트", "20,000P"],
                ["실제 사용 가능 포인트", "8,000P"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 font-semibold">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-black text-slate-950">{value}</span>
                </div>
              ))}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 font-black text-emerald-900">
                차감 순서: 기간제 포인트 5,000P → 일반 포인트 3,000P
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />저장 전 검토 요약</CardTitle>
            <CardDescription>실제 저장 없이 변경 전/후 비교를 보여주는 Mock 검토 영역입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <div className="flex items-center gap-2 font-black"><AlertTriangle className="h-5 w-5" />⚠️ 주의</div>
              <p className="mt-2 text-sm font-semibold text-amber-800">운영 영향도가 큰 공통 정책 변경은 저장 전 담당자가 한 번 더 검토해야 합니다.</p>
              <ul className="mt-3 grid gap-2 text-sm font-semibold md:grid-cols-2">
                {operationalWarnings.map((warning) => <li key={warning} className="rounded-xl bg-white/70 px-3 py-2">{warning}</li>)}
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b text-left text-slate-500"><th className="whitespace-nowrap py-3">항목</th><th className="whitespace-nowrap py-3">변경 전</th><th className="whitespace-nowrap py-3">변경 후</th></tr></thead>
                <tbody>
                  {reviewRows.map(([label, before, after]) => (
                    <tr key={label} className="border-b last:border-0"><td className="whitespace-nowrap py-3 font-semibold text-slate-800">{label}</td><td className="whitespace-nowrap py-3 text-slate-500">{before}</td><td className="whitespace-nowrap py-3 font-black text-primary">{after}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button asChild variant="secondary"><Link href="/points">취소</Link></Button>
              <Button type="button">저장</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

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
  ["신규회원 지급 포인트", "1,000P", "2,000P"],
  ["최대 사용 가능 비율", "주문 금액의 50%", "주문 금액의 60%"],
  ["소멸 안내일", "D-7, D-1", "D-30, D-7, D-1"],
  ["알림 발송 최소 포인트", "1,000P", "500P"],
];

const operationalWarnings = [
  "신규회원 지급 포인트 감소",
  "최대 사용 가능 비율 감소",
  "소멸 정책 활성화",
  "소멸 주기 변경",
  "알림 발송 정책 변경",
];

export default function PointPolicyEditPage() {
  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 정책 수정"
        description="기본 정책과 소멸 정책을 Mock 입력 화면에서 수정하고 저장 전 변경 요약을 검토합니다."
        action={<Button asChild variant="secondary"><Link href="/points">포인트 관리로</Link></Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />기본 정책</CardTitle>
            <CardDescription>포인트 사용 가능 조건과 관리자 처리 사유 필수 여부를 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="포인트 기능 사용 여부"><Select defaultValue="사용"><option>사용</option><option>미사용</option></Select></Field>
            <Field label="기본 월렛"><Select defaultValue="일반 포인트"><option>일반 포인트</option><option>이벤트 포인트</option><option>기간제 포인트</option></Select></Field>
            <Field label="신규회원 지급 포인트"><Input defaultValue="2000" /></Field>
            <Field label="최대 사용 가능 비율"><Input defaultValue="60%" /></Field>
            <Field label="최소 사용 포인트"><Input defaultValue="1000" /></Field>
            <Field label="최대 사용 포인트"><Input defaultValue="50000" /></Field>
            <Field label="사용 단위"><Input defaultValue="100" /></Field>
            <Field label="관리자 지급 사유 필수 여부"><Select defaultValue="필수"><option>필수</option><option>선택</option></Select></Field>
            <Field label="관리자 차감 사유 필수 여부"><Select defaultValue="필수"><option>필수</option><option>선택</option></Select></Field>
            <Field label="SET 처리 사유 필수 여부"><Select defaultValue="필수"><option>필수</option><option>선택</option></Select></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" />소멸 정책</CardTitle>
            <CardDescription>포인트 소멸 실행 기준과 회원 안내 알림 조건을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="소멸 기능 사용 여부"><Select defaultValue="사용"><option>사용</option><option>미사용</option></Select></Field>
            <Field label="일반 포인트 유효기간"><Select defaultValue="적립 후 12개월"><option>적립 후 6개월</option><option>적립 후 12개월</option><option>적립 후 24개월</option></Select></Field>
            <Field label="기간제 포인트 만료 기준"><Select defaultValue="캠페인 종료일"><option>캠페인 종료일</option><option>사용 종료일</option><option>지급일 기준 N일</option></Select></Field>
            <Field label="소멸 처리 실행 주기"><Select defaultValue="매일"><option>매일</option><option>매주</option><option>매월</option></Select></Field>
            <Field label="소멸 처리 시각"><Input type="time" defaultValue="00:00" /></Field>
            <Field label="소멸 알림 발송 여부"><Select defaultValue="발송"><option>발송</option><option>미발송</option></Select></Field>
            <Field label="소멸 안내일"><Input defaultValue="D-30, D-7, D-1" /></Field>
            <Field label="알림 발송 최소 포인트"><Input defaultValue="500" /></Field>
            <Field label="알림톡 발송 여부"><Select defaultValue="발송"><option>발송</option><option>미발송</option></Select></Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-primary" />저장 전 검토 요약</CardTitle>
            <CardDescription>실제 저장 없이 변경 전/후 비교를 보여주는 Mock 검토 영역입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900">
              <div className="flex items-center gap-2 font-black">
                <AlertTriangle className="h-5 w-5" />
                ⚠️ 주의
              </div>
              <p className="mt-2 text-sm font-semibold text-amber-800">운영 영향도가 큰 변경은 저장 전 담당자가 한 번 더 검토해야 합니다.</p>
              <ul className="mt-3 grid gap-2 text-sm font-semibold md:grid-cols-2">
                {operationalWarnings.map((warning) => (
                  <li key={warning} className="rounded-xl bg-white/70 px-3 py-2">{warning}</li>
                ))}
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead><tr className="border-b text-left text-slate-500"><th className="whitespace-nowrap py-3">항목</th><th className="whitespace-nowrap py-3">변경 전</th><th className="whitespace-nowrap py-3">변경 후</th></tr></thead>
                <tbody>
                  {reviewRows.map(([label, before, after]) => (
                    <tr key={label} className="border-b last:border-0">
                      <td className="whitespace-nowrap py-3 font-semibold text-slate-800">{label}</td>
                      <td className="whitespace-nowrap py-3 text-slate-500">{before}</td>
                      <td className="whitespace-nowrap py-3 font-black text-primary">{after}</td>
                    </tr>
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

import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { discountLabel, formatCurrency, formatNumber, getCouponById, targetLabel, usageRate, type CouponStatus } from "../data";

function statusVariant(value: CouponStatus) {
  if (value === "진행중") return "success";
  if (value === "예정" || value === "한도소진") return "warning";
  if (value === "비활성") return "rose";
  return "slate";
}

function summaryCard(label: string, value: string, helper?: string) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-800">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

export default async function CouponDetailPage({ params }: { params: Promise<{ couponId: string }> }) {
  const { couponId } = await params;
  const coupon = getCouponById(couponId);
  const rate = usageRate(coupon.usedCount, coupon.issuedCount);
  const unusedCount = Math.max(coupon.issuedCount - coupon.usedCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Promotions"
        title="쿠폰 상세"
        description="쿠폰 설정과 발급/사용 현황, 사용 회원 목록, 수정 정책 안내를 확인합니다."
        action={<Button asChild variant="secondary"><Link href="/coupons">목록으로</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>{coupon.name}</CardTitle>
              <CardDescription>{coupon.description}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant(coupon.status)} className="whitespace-nowrap">{coupon.status}</Badge>
              <Badge variant="slate" className="whitespace-nowrap">{coupon.issueType}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
            {summaryCard("상태", coupon.status, coupon.issueType)}
            {summaryCard("할인 정보", discountLabel(coupon), coupon.discountType)}
            {summaryCard("사용 기간", `${coupon.startDate} ~ ${coupon.endDate}`)}
            {summaryCard("발급 수", formatNumber(coupon.issuedCount))}
            {summaryCard("사용 수", formatNumber(coupon.usedCount))}
            {summaryCard("미사용 수", formatNumber(unusedCount))}
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">사용률</p>
              <div className="mt-3 h-2 rounded-full bg-white">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} />
              </div>
              <p className="mt-2 font-semibold text-slate-800">{rate}%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>쿠폰의 운영 식별 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">쿠폰 ID</span><span className="font-mono text-slate-800">{coupon.id}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">쿠폰명</span><span className="font-semibold text-slate-800">{coupon.name}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">상태</span><Badge variant={statusVariant(coupon.status)}>{coupon.status}</Badge></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">발급 방식</span><span className="font-semibold text-slate-800">{coupon.issueType}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">생성일</span><span className="font-semibold text-slate-800">{coupon.createdAt}</span></div>
              {coupon.couponCode && <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">쿠폰 코드</span><span className="font-mono font-semibold text-slate-800">{coupon.couponCode}</span></div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>할인/조건</CardTitle>
              <CardDescription>할인 설정과 사용 제한 조건입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">할인 방식</span><span className="font-semibold text-slate-800">{coupon.discountType}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">할인 정보</span><span className="font-semibold text-primary">{discountLabel(coupon)}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">최소 결제금액</span><span className="font-semibold text-slate-800">{coupon.minPaymentAmount ? formatCurrency(coupon.minPaymentAmount) : "제한 없음"}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">회원당 사용 횟수</span><span className="font-semibold text-slate-800">{coupon.memberUsageLimit}회</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">전체 사용 한도</span><span className="font-semibold text-slate-800">{coupon.totalUsageLimit ? `${formatNumber(coupon.totalUsageLimit)}회` : "무제한"}</span></div>
              <div className="flex justify-between gap-4 rounded-xl bg-slate-50 p-3"><span className="font-semibold text-slate-500">사용 가능 기간</span><span className="font-semibold text-slate-800">{coupon.startDate} ~ {coupon.endDate}</span></div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>적용 대상</CardTitle>
            <CardDescription>{targetLabel(coupon)}</CardDescription>
          </CardHeader>
          <CardContent>
            {coupon.targetType === "전체 상품" ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-800">전체 상품에 적용되는 쿠폰입니다.</div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-100">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">유형</TableHead>
                      <TableHead className="whitespace-nowrap">이름</TableHead>
                      <TableHead className="whitespace-nowrap">ID</TableHead>
                      <TableHead className="whitespace-nowrap">정보</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupon.targets.map((target) => (
                      <TableRow key={target.id}>
                        <TableCell className="whitespace-nowrap"><Badge variant="slate">{target.type}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-slate-900">{target.title}</TableCell>
                        <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">{target.id}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm text-slate-600">{target.meta}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발급/사용 현황</CardTitle>
            <CardDescription>발급 수량과 사용량, 잔여 한도를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {summaryCard("발급 수", `${formatNumber(coupon.issuedCount)}건`)}
            {summaryCard("사용 수", `${formatNumber(coupon.usedCount)}건`)}
            {summaryCard("미사용 수", `${formatNumber(unusedCount)}건`)}
            {summaryCard("총 할인 금액", formatCurrency(coupon.usedMembers.reduce((sum, member) => sum + member.discountAmount, 0)))}
            {summaryCard("잔여 전체 한도", coupon.totalUsageLimit ? `${formatNumber(Math.max(coupon.totalUsageLimit - coupon.usedCount, 0))}회` : "무제한")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용 회원 목록</CardTitle>
            <CardDescription>User ID를 클릭하면 회원 상세 Mock Link로 이동합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">이름</TableHead>
                  <TableHead className="whitespace-nowrap">이메일</TableHead>
                  <TableHead className="whitespace-nowrap">User ID</TableHead>
                  <TableHead className="whitespace-nowrap">주문번호</TableHead>
                  <TableHead className="whitespace-nowrap text-right">할인금액</TableHead>
                  <TableHead className="whitespace-nowrap">사용일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupon.usedMembers.length > 0 ? coupon.usedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="whitespace-nowrap font-semibold text-slate-900">{member.name}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">{member.email}</TableCell>
                    <TableCell className="whitespace-nowrap"><Link href={`/members/${member.userId}`} className="font-mono text-sm font-bold text-primary underline-offset-4 hover:underline">{member.userId}</Link></TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">{member.orderNo}</TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-primary">{formatCurrency(member.discountAmount)}</TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">{member.usedAt}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">아직 사용 회원이 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>수정 정책 안내</CardTitle>
            <CardDescription>사용 이력이 있는 쿠폰 기준의 1차 운영 정책 안내입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <p className="font-bold text-rose-700">사용 이력이 있으면 수정 불가</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-rose-700">
                <li>할인 방식</li>
                <li>할인 금액</li>
                <li>할인율</li>
                <li>최대 할인 금액</li>
                <li>적용 대상</li>
                <li>최소 결제금액</li>
                <li>발급 방식</li>
                <li>쿠폰 코드</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="font-bold text-emerald-700">사용 이력이 있어도 가능</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6 text-emerald-700">
                <li>종료일 변경</li>
                <li>전체 사용 한도 변경</li>
                <li>비활성화</li>
                <li>종료 처리</li>
                <li>내부 메모 수정</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  couponCampaigns,
  discountLabel,
  formatNumber,
  targetLabel,
  usageRate,
  type CouponDiscountType,
  type CouponIssueType,
  type CouponStatus,
  type CouponTargetType,
} from "./data";

const statusOptions: Array<"전체" | CouponStatus> = ["전체", "진행중", "예정", "종료", "비활성", "한도소진"];
const discountOptions: Array<"전체" | CouponDiscountType> = ["전체", "정액 할인", "정률 할인"];
const issueOptions: Array<"전체" | CouponIssueType> = ["전체", "자동 발급", "쿠폰 코드 배포", "특정 회원 지급"];
const targetOptions: Array<"전체" | CouponTargetType> = ["전체", "전체 상품", "특정 언어", "특정 코스", "특정 패키지"];

function statusVariant(value: CouponStatus) {
  if (value === "진행중") return "success";
  if (value === "예정" || value === "한도소진") return "warning";
  if (value === "비활성") return "rose";
  return "slate";
}

export default function CouponsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("전체");
  const [discountType, setDiscountType] = useState<(typeof discountOptions)[number]>("전체");
  const [issueType, setIssueType] = useState<(typeof issueOptions)[number]>("전체");
  const [targetType, setTargetType] = useState<(typeof targetOptions)[number]>("전체");

  const filteredCoupons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return couponCampaigns.filter((coupon) => {
      const matchesQuery = !normalizedQuery || `${coupon.name} ${coupon.description} ${coupon.couponCode ?? ""}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "전체" || coupon.status === status;
      const matchesDiscount = discountType === "전체" || coupon.discountType === discountType;
      const matchesIssue = issueType === "전체" || coupon.issueType === issueType;
      const matchesTarget = targetType === "전체" || coupon.targetType === targetType;

      return matchesQuery && matchesStatus && matchesDiscount && matchesIssue && matchesTarget;
    });
  }, [discountType, issueType, query, status, targetType]);

  return (
    <>
      <PageHeader
        eyebrow="Promotions"
        title="쿠폰 관리"
        description="할인 방식, 적용 대상, 발급 방식, 사용 현황을 운영 가능한 Mock UI로 확인합니다."
        action={<Button asChild variant="secondary"><Link href="/coupons/create">쿠폰 생성</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>쿠폰 필터</CardTitle>
            <CardDescription>검색어와 쿠폰 운영 조건으로 목록을 좁혀 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-5">
            <label className="space-y-1 text-sm font-semibold text-slate-700 lg:col-span-2">
              검색
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="쿠폰명, 설명, 쿠폰 코드 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              상태
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                {statusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              할인 방식
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={discountType} onChange={(event) => setDiscountType(event.target.value as typeof discountType)}>
                {discountOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              발급 방식
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={issueType} onChange={(event) => setIssueType(event.target.value as typeof issueType)}>
                {issueOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700 lg:col-span-2">
              적용 대상
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={targetType} onChange={(event) => setTargetType(event.target.value as typeof targetType)}>
                {targetOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>쿠폰 목록</CardTitle>
              <CardDescription>행을 클릭하면 쿠폰 상세 화면으로 이동합니다. 액션 컬럼은 제공하지 않습니다.</CardDescription>
            </div>
            <Badge variant="slate">{formatNumber(filteredCoupons.length)}개 표시</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[1320px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[96px] whitespace-nowrap">상태</TableHead>
                  <TableHead className="whitespace-nowrap">쿠폰명</TableHead>
                  <TableHead className="whitespace-nowrap">발급 방식</TableHead>
                  <TableHead className="whitespace-nowrap">할인 정보</TableHead>
                  <TableHead className="whitespace-nowrap">적용 대상</TableHead>
                  <TableHead className="whitespace-nowrap">사용 기간</TableHead>
                  <TableHead className="whitespace-nowrap text-right">발급 수</TableHead>
                  <TableHead className="whitespace-nowrap text-right">사용 수</TableHead>
                  <TableHead className="whitespace-nowrap">사용률</TableHead>
                  <TableHead className="whitespace-nowrap text-right">전체 사용 한도</TableHead>
                  <TableHead className="whitespace-nowrap">생성일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCoupons.map((coupon) => {
                  const detailHref = `/coupons/${coupon.id}`;
                  const rate = usageRate(coupon.usedCount, coupon.issuedCount);

                  return (
                    <TableRow key={coupon.id} className="cursor-pointer">
                      <TableCell className="w-[96px] whitespace-nowrap">
                        <Link href={detailHref} className="block py-1"><Badge variant={statusVariant(coupon.status)} className="whitespace-nowrap">{coupon.status}</Badge></Link>
                      </TableCell>
                      <TableCell>
                        <Link href={detailHref} className="block min-w-[240px] py-1">
                          <span className="block whitespace-nowrap font-bold text-slate-900">{coupon.name}</span>
                          <span className="mt-1 block whitespace-nowrap text-xs text-slate-500">{coupon.description}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-slate-700"><Link href={detailHref} className="block py-1">{coupon.issueType}</Link></TableCell>
                      <TableCell className="whitespace-nowrap font-semibold text-primary"><Link href={detailHref} className="block py-1">{discountLabel(coupon)}</Link></TableCell>
                      <TableCell className="min-w-[220px] whitespace-nowrap text-sm text-slate-600"><Link href={detailHref} className="block py-1">{targetLabel(coupon)}</Link></TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-slate-600"><Link href={detailHref} className="block py-1">{coupon.startDate} ~ {coupon.endDate}</Link></TableCell>
                      <TableCell className="whitespace-nowrap text-right font-semibold"><Link href={detailHref} className="block py-1">{formatNumber(coupon.issuedCount)}</Link></TableCell>
                      <TableCell className="whitespace-nowrap text-right font-semibold text-primary"><Link href={detailHref} className="block py-1">{formatNumber(coupon.usedCount)}</Link></TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Link href={detailHref} className="block min-w-[120px] py-1">
                          <div className="h-2 rounded-full bg-slate-100">
                            <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} />
                          </div>
                          <span className="mt-1 block text-xs font-bold text-slate-600">{rate}%</span>
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-right font-semibold text-slate-700">
                        <Link href={detailHref} className="block py-1">{coupon.totalUsageLimit ? formatNumber(coupon.totalUsageLimit) : "무제한"}</Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-slate-600"><Link href={detailHref} className="block py-1">{coupon.createdAt}</Link></TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

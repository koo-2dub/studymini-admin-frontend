"use client";

import { Boxes, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  formatWon,
  getDigitalOption,
  getPaperDigitalOption,
  getSalesStatusTone,
  languageScopeOptions,
  packageSummaries,
  packageVisibilityOptions,
  salesStatusOptions,
} from "../_data/catalog";
import type { LanguageScope, LmsVisibility, PackageSummary, SalesStatus } from "../_data/types";

const initialFilters = {
  query: "",
  language: "전체",
  languageScope: "전체" as "전체" | LanguageScope,
  salesStatus: "전체" as "전체" | SalesStatus,
  visibility: "전체" as "전체" | LmsVisibility,
};

export function PackageManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const languageOptions = useMemo(
    () => ["전체", ...Array.from(new Set(packageSummaries.flatMap((lmsPackage) => lmsPackage.languages)))],
    [],
  );

  const summary = useMemo(() => {
    const sellingPackages = packageSummaries.filter((lmsPackage) => lmsPackage.salesStatus === "판매중");
    const reviewPackages = packageSummaries.filter(
      (lmsPackage) => lmsPackage.salesStatus !== "판매중" || lmsPackage.visibility === "비공개",
    );
    const totalRevenue = packageSummaries.reduce((sum, lmsPackage) => sum + lmsPackage.revenue, 0);
    const averageDiscountRate = packageSummaries.length
      ? packageSummaries.reduce((sum, lmsPackage) => sum + getDigitalOption(lmsPackage.optionSummaries).discountRate, 0) / packageSummaries.length
      : 0;

    return {
      totalCount: packageSummaries.length,
      sellingCount: sellingPackages.length,
      reviewCount: reviewPackages.length,
      totalRevenue,
      averageDiscountRate,
    };
  }, []);

  const filteredPackages = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return packageSummaries.filter((lmsPackage) => {
      const searchable = [
        lmsPackage.id,
        lmsPackage.name,
        lmsPackage.displayName,
        lmsPackage.internalName,
        ...lmsPackage.courses.map((course) => `${course.language} ${course.name} ${course.displayName}`),
      ]
        .join(" ")
        .toLowerCase();
      const matchesKeyword = keyword ? searchable.includes(keyword) : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : lmsPackage.languages.includes(appliedFilters.language);
      const matchesLanguageScope =
        appliedFilters.languageScope === "전체" ? true : lmsPackage.languageScope === appliedFilters.languageScope;
      const matchesSalesStatus =
        appliedFilters.salesStatus === "전체" ? true : lmsPackage.salesStatus === appliedFilters.salesStatus;
      const matchesVisibility = appliedFilters.visibility === "전체" ? true : lmsPackage.visibility === appliedFilters.visibility;

      return matchesKeyword && matchesLanguage && matchesLanguageScope && matchesSalesStatus && matchesVisibility;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const openDetail = (lmsPackage: PackageSummary) => {
    router.push(`/lms/packages/${lmsPackage.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title="패키지 관리"
        description="여러 언어의 코스를 묶어 판매하는 패키지 상품과 가격, 할인율, 권한 미리보기를 관리합니다."
        action={
          <Link
            href="/lms/packages/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
            패키지 생성
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="전체 패키지" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="판매중" value={String(summary.sellingCount)} change="현재 판매 가능" tone="emerald" />
        <StatCard label="검수 필요" value={String(summary.reviewCount)} change="비공개 또는 판매중지" tone="amber" />
        <StatCard label="패키지 매출" value={formatWon(summary.totalRevenue)} change="결제 완료 기준" tone="rose" />
        <StatCard label="평균 할인율" value={`${summary.averageDiscountRate.toFixed(1)}%`} change="정가 합계 대비" tone="indigo" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>패키지명, 포함 코스, 언어 구성, 판매상태와 공개상태로 패키지를 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(140px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="패키지명, 코스명, 패키지 ID"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                />
              </div>
            </label>
            <FilterSelect label="언어" value={filters.language} onChange={(value) => updateFilter("language", value)} options={languageOptions} />
            <FilterSelect
              label="언어 구성"
              value={filters.languageScope}
              onChange={(value) => updateFilter("languageScope", value)}
              options={[...languageScopeOptions]}
            />
            <FilterSelect
              label="판매상태"
              value={filters.salesStatus}
              onChange={(value) => updateFilter("salesStatus", value)}
              options={salesStatusOptions}
            />
            <FilterSelect
              label="공개상태"
              value={filters.visibility}
              onChange={(value) => updateFilter("visibility", value)}
              options={[...packageVisibilityOptions]}
            />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button type="button" onClick={applyFilters}>필터 적용</Button>
            <Button type="button" variant="outline" onClick={resetFilters}>초기화</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-indigo-500" />
            <CardTitle>패키지 목록</CardTitle>
          </div>
          <CardDescription>단일 언어·복수 언어 패키지를 모두 표시합니다. 행을 클릭하면 패키지 상세로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>패키지명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>포함 코스</TableHead>
                <TableHead>코스 수</TableHead>
                <TableHead>수업/레슨</TableHead>
                <TableHead>디지털 가격</TableHead>
                <TableHead>페이퍼+디지털 가격</TableHead>
                <TableHead>할인율</TableHead>
                <TableHead>판매상태</TableHead>
                <TableHead>주문</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((lmsPackage) => (
                <TableRow
                  key={lmsPackage.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(lmsPackage)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(lmsPackage);
                    }
                  }}
                >
                  <TableCell className="min-w-64 font-bold text-slate-900">
                    <div>{lmsPackage.displayName}</div>
                    <div className="mt-1 font-mono text-xs font-semibold text-slate-500">{lmsPackage.id}</div>
                  </TableCell>
                  <TableCell className="min-w-32">
                    <Badge variant={lmsPackage.languageScope === "복수 언어" ? "warning" : "default"}>{lmsPackage.languageScope}</Badge>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{lmsPackage.languages.join(", ")}</div>
                  </TableCell>
                  <TableCell className="min-w-52 text-sm font-semibold text-slate-700">
                    {lmsPackage.courses.map((course) => `${course.language} ${course.name}`).join(" · ")}
                  </TableCell>
                  <TableCell>{lmsPackage.courses.length}개</TableCell>
                  <TableCell>{lmsPackage.classCount}개 / {lmsPackage.lessonCount}개</TableCell>
                  <TableCell className="font-bold text-slate-900">{formatWon(getDigitalOption(lmsPackage.productOptions).price)}</TableCell>
                  <TableCell className="font-bold text-slate-900">
                    <div className="space-y-1">
                      <p>{formatWon(getPaperDigitalOption(lmsPackage.productOptions).price)}</p>
                      <Badge variant="warning">배송 필요</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-indigo-700">
                    {getDigitalOption(lmsPackage.optionSummaries).discountRate.toFixed(1)}% / {getPaperDigitalOption(lmsPackage.optionSummaries).discountRate.toFixed(1)}%
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={getSalesStatusTone(lmsPackage.salesStatus)}>{lmsPackage.salesStatus}</Badge>
                      <div><Badge variant={lmsPackage.visibility === "공개" ? "success" : "slate"}>{lmsPackage.visibility}</Badge></div>
                    </div>
                  </TableCell>
                  <TableCell>{lmsPackage.paidOrderCount} / {lmsPackage.orderCount}건</TableCell>
                  <TableCell>{lmsPackage.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredPackages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={11} className="py-10 text-center font-semibold text-slate-500">
                    조건에 맞는 패키지가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <label className="text-sm font-bold text-slate-600">
      {label}
      <select
        className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

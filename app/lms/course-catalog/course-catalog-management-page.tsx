"use client";

import { Boxes, PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formatWon, getSalesStatusTone, lmsCourses } from "../_data/catalog";
import type { LmsCourse } from "../_data/types";
import {
  courseCatalogLanguageOptions,
  courseCatalogSalesStatusOptions,
  courseCatalogVisibilityOptions,
  packageIncludedOptions,
  type CourseCatalogFilterState,
} from "./data";

const initialFilters: CourseCatalogFilterState = {
  query: "",
  language: "전체",
  salesStatus: "전체",
  visibility: "전체",
  packageIncluded: "전체",
};

export function CourseCatalogManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(
    () => ({
      totalCount: lmsCourses.length,
      sellingCount: lmsCourses.filter((course) => course.salesStatus === "판매중").length,
      privateCount: lmsCourses.filter((course) => course.visibility === "비공개").length,
      packagedCount: lmsCourses.filter((course) => course.packageCount > 0).length,
    }),
    [],
  );

  const filteredCourses = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return lmsCourses.filter((course) => {
      const searchable = [course.name, course.displayName].join(" ").toLowerCase();
      const matchesKeyword = keyword ? searchable.includes(keyword) : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : course.language === appliedFilters.language;
      const matchesSalesStatus =
        appliedFilters.salesStatus === "전체" ? true : course.salesStatus === appliedFilters.salesStatus;
      const matchesVisibility = appliedFilters.visibility === "전체" ? true : course.visibility === appliedFilters.visibility;
      const matchesPackageIncluded =
        appliedFilters.packageIncluded === "전체"
          ? true
          : appliedFilters.packageIncluded === "포함"
            ? course.packageCount > 0
            : course.packageCount === 0;

      return matchesKeyword && matchesLanguage && matchesSalesStatus && matchesVisibility && matchesPackageIncluded;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof CourseCatalogFilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const openDetail = (course: LmsCourse) => {
    router.push(`/lms/course-catalog/${course.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title="코스 관리"
        description="언어별 판매 단위인 코스와 패키지 포함 관계, 수업/레슨 권한 범위를 확인합니다."
        action={
          <Button type="button" onClick={() => router.push("/lms/course-catalog/create")}>
            <PlusCircle className="h-4 w-4" />
            코스 생성
          </Button>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="전체 코스 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="판매중 코스 수" value={String(summary.sellingCount)} change="현재 판매 가능" tone="emerald" />
        <StatCard label="비공개 코스 수" value={String(summary.privateCount)} change="학습자 미노출" tone="amber" />
        <StatCard label="패키지 포함 코스 수" value={String(summary.packagedCount)} change="패키지 연결 있음" tone="rose" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>코스명, 언어, 판매상태, 공개상태와 패키지 포함 여부로 코스를 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(140px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="코스명"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                />
              </div>
            </label>
            <label className="text-sm font-bold text-slate-600">
              언어
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.language}
                onChange={(event) => updateFilter("language", event.target.value)}
              >
                {courseCatalogLanguageOptions.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              판매상태
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.salesStatus}
                onChange={(event) => updateFilter("salesStatus", event.target.value)}
              >
                {courseCatalogSalesStatusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              공개상태
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.visibility}
                onChange={(event) => updateFilter("visibility", event.target.value)}
              >
                {courseCatalogVisibilityOptions.map((visibility) => (
                  <option key={visibility}>{visibility}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              패키지 포함 여부
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.packageIncluded}
                onChange={(event) => updateFilter("packageIncluded", event.target.value)}
              >
                {packageIncludedOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
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
            <CardTitle>코스 목록</CardTitle>
          </div>
          <CardDescription>목록의 아무 행이나 클릭하면 코스 상세 화면으로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>코스명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>판매상태</TableHead>
                <TableHead>공개상태</TableHead>
                <TableHead>포함 수업 수</TableHead>
                <TableHead>포함 레슨 수</TableHead>
                <TableHead>포함 패키지 수</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow
                  key={course.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(course)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(course);
                    }
                  }}
                >
                  <TableCell className="min-w-48 font-bold text-slate-900">{course.displayName}</TableCell>
                  <TableCell>{course.language}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{formatWon(course.price)}</TableCell>
                  <TableCell>
                    <Badge variant={getSalesStatusTone(course.salesStatus)}>{course.salesStatus}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={course.visibility === "공개" ? "success" : "slate"}>{course.visibility}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">{course.classCount}개</TableCell>
                  <TableCell className="font-semibold text-slate-900">{course.lessonCount}개</TableCell>
                  <TableCell className="font-semibold text-slate-900">{course.packageCount}개</TableCell>
                  <TableCell>{course.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="py-10 text-center font-semibold text-slate-500">
                    필터 조건에 맞는 코스가 없습니다.
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

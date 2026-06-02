"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  courseClasses,
  courseFilterOptions,
  courseVisibilityOptions,
  type CourseClass,
  type CourseVisibility,
} from "./data";

const initialFilters = {
  query: "",
  language: "전체",
  course: "전체",
  visibility: "전체" as "전체" | CourseVisibility,
};

export function CourseManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(
    () => ({
      totalCount: courseClasses.length,
      publicCount: courseClasses.filter((courseClass) => courseClass.visibility === "공개").length,
      privateCount: courseClasses.filter((courseClass) => courseClass.visibility === "비공개").length,
    }),
    [],
  );

  const filteredCourseClasses = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return courseClasses.filter((courseClass) => {
      const matchesKeyword = keyword
        ? [courseClass.className, courseClass.language, courseClass.course].some((value) =>
            value.toLowerCase().includes(keyword),
          )
        : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : courseClass.language === appliedFilters.language;
      const matchesCourse = appliedFilters.course === "전체" ? true : courseClass.course === appliedFilters.course;
      const matchesVisibility =
        appliedFilters.visibility === "전체" ? true : courseClass.visibility === appliedFilters.visibility;

      return matchesKeyword && matchesLanguage && matchesCourse && matchesVisibility;
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

  const openDetail = (courseClass: CourseClass) => {
    router.push(`/lms/courses/${courseClass.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="수업 관리"
        description="언어, 코스별 수업 단계와 포함된 레슨 구성을 확인합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="전체 수업 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="공개 수업 수" value={String(summary.publicCount)} change="학습자 노출" tone="emerald" />
        <StatCard label="비공개 수업 수" value={String(summary.privateCount)} change="관리자 확인 필요" tone="amber" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>언어, 코스, 공개상태와 검색어로 수업을 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(3,minmax(140px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="수업명, 언어, 코스"
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
                {courseFilterOptions.languages.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              코스
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.course}
                onChange={(event) => updateFilter("course", event.target.value)}
              >
                {courseFilterOptions.courses.map((course) => (
                  <option key={course}>{course}</option>
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
                {courseVisibilityOptions.map((visibility) => (
                  <option key={visibility}>{visibility}</option>
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
          <CardTitle>수업 목록</CardTitle>
          <CardDescription>목록의 아무 행이나 클릭하면 수업 상세 화면으로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>수업명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>코스</TableHead>
                <TableHead>레슨 수</TableHead>
                <TableHead>공개상태</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourseClasses.map((courseClass) => (
                <TableRow
                  key={courseClass.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(courseClass)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(courseClass);
                    }
                  }}
                >
                  <TableCell className="min-w-48 font-bold text-slate-900">{courseClass.className}</TableCell>
                  <TableCell>{courseClass.language}</TableCell>
                  <TableCell>{courseClass.course}</TableCell>
                  <TableCell className="font-semibold text-slate-900">{courseClass.lessons.length}개</TableCell>
                  <TableCell>
                    <Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge>
                  </TableCell>
                  <TableCell>{courseClass.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredCourseClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center font-semibold text-slate-500">
                    필터 조건에 맞는 수업이 없습니다.
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

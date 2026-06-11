"use client";

import { BookOpen, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { courseClasses, courseFilterOptions, type CourseClass } from "./data";

const initialFilters = {
  query: "",
  language: "전체",
};

export function CourseManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(() => {
    const lessonCount = courseClasses.reduce((sum, courseClass) => sum + courseClass.lessons.length, 0);

    return {
      totalCount: courseClasses.length,
      lessonCount,
      averageLessonCount: courseClasses.length ? Math.round((lessonCount / courseClasses.length) * 10) / 10 : 0,
    };
  }, []);

  const filteredCourseClasses = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return courseClasses.filter((courseClass) => {
      const matchesKeyword = keyword
        ? [courseClass.className, courseClass.language].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : courseClass.language === appliedFilters.language;

      return matchesKeyword && matchesLanguage;
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
        description="먼저 만들어진 수업과 포함된 레슨 구성을 확인합니다."
        action={
          <Link
            href="/lms/courses/create-class"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            수업 생성
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="전체 수업 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="포함된 레슨 수" value={`${summary.lessonCount}개`} change="수업에 포함된 레슨 합계" tone="emerald" />
        <StatCard label="평균 레슨 수" value={`${summary.averageLessonCount}개`} change="수업당 평균 구성" tone="amber" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>수업명, 언어로 수업을 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.8fr)]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="수업명, 언어"
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
            <BookOpen className="h-5 w-5 text-indigo-500" />
            <CardTitle>수업 목록</CardTitle>
          </div>
          <CardDescription>수업명, 언어, 포함된 레슨 수, 수정일만 표시합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>수업명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>포함된 레슨 수</TableHead>
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
                  <TableCell className="font-semibold text-slate-900">{courseClass.lessons.length}개</TableCell>
                  <TableCell>{courseClass.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredCourseClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="py-10 text-center font-semibold text-slate-500">
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

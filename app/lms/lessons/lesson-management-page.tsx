"use client";

import { PlusCircle, Search, SlidersHorizontal } from "lucide-react";
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
  getLessonLinkedClassCount,
  getLessonLinkedCourseCount,
  hasLessonAudio,
  hasLessonQuiz,
  hasLessonVideo,
  lessonLanguageOptions,
  lessons,
  type Lesson,
} from "./data";

const initialFilters = {
  query: "",
  language: "전체",
};

function RegistrationBadge({ registered }: { registered: boolean }) {
  return <Badge variant={registered ? "success" : "slate"}>{registered ? "등록됨" : "없음"}</Badge>;
}

export function LessonManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(
    () => ({
      totalCount: lessons.length,
      videoCount: lessons.filter(hasLessonVideo).length,
      unlinkedCount: lessons.filter((lesson) => getLessonLinkedClassCount(lesson) === 0).length,
    }),
    [],
  );

  const filteredLessons = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesKeyword = keyword
        ? [lesson.lessonName, lesson.language, lesson.description].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : lesson.language === appliedFilters.language;

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

  const openDetail = (lesson: Lesson) => {
    router.push(`/lms/lessons/${lesson.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="레슨 관리"
        description="레슨은 독립 콘텐츠 단위로 관리하며, 영상·오디오·퀴즈 링크와 이후 수업/코스 연결 현황을 확인합니다."
        action={
          <Button asChild variant="secondary">
            <Link href="/lms/lessons/create">
              <PlusCircle className="h-4 w-4" />
              레슨 생성
            </Link>
          </Button>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="전체 레슨 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="영상 등록 레슨" value={String(summary.videoCount)} change="상세에서 player 표시" tone="emerald" />
        <StatCard label="미연결 레슨" value={String(summary.unlinkedCount)} change="수업 구성 전 독립 레슨" tone="amber" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>레슨명, 언어, 설명/메모를 기준으로 독립 레슨을 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(260px,1.4fr)_minmax(160px,0.6fr)]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="레슨명, 언어, 설명/메모"
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
                {lessonLanguageOptions.map((language) => (
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
        <CardHeader className="gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>레슨 목록</CardTitle>
            <CardDescription>목록의 아무 행이나 클릭하면 레슨 상세 화면으로 이동합니다.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/lms/lessons/create">
              <PlusCircle className="h-4 w-4" />
              레슨 생성
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>레슨명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>영상 등록 여부</TableHead>
                <TableHead>오디오 등록 여부</TableHead>
                <TableHead>퀴즈 링크 등록 여부</TableHead>
                <TableHead>연결된 수업 수</TableHead>
                <TableHead>연결된 코스 수</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLessons.map((lesson) => (
                <TableRow
                  key={lesson.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(lesson)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(lesson);
                    }
                  }}
                >
                  <TableCell className="min-w-44 font-bold text-slate-900">{lesson.lessonName}</TableCell>
                  <TableCell>{lesson.language}</TableCell>
                  <TableCell><RegistrationBadge registered={hasLessonVideo(lesson)} /></TableCell>
                  <TableCell><RegistrationBadge registered={hasLessonAudio(lesson)} /></TableCell>
                  <TableCell><RegistrationBadge registered={hasLessonQuiz(lesson)} /></TableCell>
                  <TableCell className="font-semibold text-slate-800">{getLessonLinkedClassCount(lesson)}개</TableCell>
                  <TableCell className="font-semibold text-slate-800">{getLessonLinkedCourseCount(lesson)}개</TableCell>
                  <TableCell>{lesson.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredLessons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center font-semibold text-slate-500">
                    필터 조건에 맞는 레슨이 없습니다.
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

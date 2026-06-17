"use client";

import { Box, PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getBlockUsedLessonCount } from "../lessons/data";
import { blockLanguageOptions, blocks, blockTypeOptions, hasBlockMediaUrl, type BlockType, type ContentBlock } from "./data";

const initialFilters = { query: "", language: "전체", type: "전체" };

function BlockTypeBadge({ type }: { type: BlockType }) {
  const variant = type === "영상" ? "default" : type === "오디오" ? "success" : "warning";
  return <Badge variant={variant}>{type}</Badge>;
}

export function BlockManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(() => ({
    totalCount: blocks.length,
    videoCount: blocks.filter((block) => block.type === "영상").length,
    audioCount: blocks.filter((block) => block.type === "오디오").length,
    quizCount: blocks.filter((block) => block.type === "퀴즈 링크").length,
  }), []);

  const filteredBlocks = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return blocks.filter((block) => {
      const matchesKeyword = keyword
        ? [block.blockName, block.language, block.type, block.mediaUrl, block.description].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesLanguage = appliedFilters.language === "전체" ? true : block.language === appliedFilters.language;
      const matchesType = appliedFilters.type === "전체" ? true : block.type === appliedFilters.type;

      return matchesKeyword && matchesLanguage && matchesType;
    });
  }, [appliedFilters]);

  const updateFilter = (key: keyof typeof filters, value: string) => setFilters((current) => ({ ...current, [key]: value }));
  const applyFilters = () => setAppliedFilters(filters);
  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };
  const openDetail = (block: ContentBlock) => router.push(`/lms/blocks/${block.id}`);

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="블록 관리"
        description="레슨을 구성하는 최하위 콘텐츠 단위인 영상·오디오·퀴즈 링크 블록을 관리합니다."
        action={
          <Button asChild variant="secondary">
            <Link href="/lms/blocks/create">
              <PlusCircle className="h-4 w-4" />
              블록 생성
            </Link>
          </Button>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="전체 블록 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="영상 블록" value={String(summary.videoCount)} change="video player 제공" tone="emerald" />
        <StatCard label="오디오 블록" value={String(summary.audioCount)} change="audio player 제공" tone="amber" />
        <StatCard label="퀴즈 링크 블록" value={String(summary.quizCount)} change="바로가기 링크 제공" tone="rose" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>블록명, 유형, 언어, URL을 기준으로 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(240px,1.4fr)_minmax(140px,0.5fr)_minmax(140px,0.5fr)]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="블록명, URL, 설명" value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} />
              </div>
            </label>
            <label className="text-sm font-bold text-slate-600">
              언어
              <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={filters.language} onChange={(event) => updateFilter("language", event.target.value)}>
                {blockLanguageOptions.map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              블록 유형
              <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
                <option>전체</option>
                {blockTypeOptions.map((type) => <option key={type}>{type}</option>)}
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
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-indigo-500" />
              <CardTitle>블록 목록</CardTitle>
            </div>
            <CardDescription>목록의 아무 행이나 클릭하면 블록 상세 화면으로 이동합니다.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/lms/blocks/create">
              <PlusCircle className="h-4 w-4" />
              블록 생성
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>블록명</TableHead>
                <TableHead>블록 유형</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>미디어 URL 또는 링크</TableHead>
                <TableHead>사용 중인 레슨 수</TableHead>
                <TableHead>수정일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBlocks.map((block) => (
                <TableRow key={block.id} tabIndex={0} className="cursor-pointer" onClick={() => openDetail(block)} onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openDetail(block);
                  }
                }}>
                  <TableCell className="min-w-52 font-bold text-slate-900">{block.blockName}</TableCell>
                  <TableCell><BlockTypeBadge type={block.type} /></TableCell>
                  <TableCell>{block.language}</TableCell>
                  <TableCell className="max-w-md truncate font-mono text-xs text-slate-600">{hasBlockMediaUrl(block) ? block.mediaUrl : "미등록"}</TableCell>
                  <TableCell className="font-semibold text-slate-800">{getBlockUsedLessonCount(block.id)}개</TableCell>
                  <TableCell>{block.updatedAt}</TableCell>
                </TableRow>
              ))}
              {filteredBlocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center font-semibold text-slate-500">필터 조건에 맞는 블록이 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

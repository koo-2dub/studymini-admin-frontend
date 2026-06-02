"use client";

import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  getEndingSoonGroups,
  getGroupStatusTone,
  getGroupTypeTone,
  groupStatusOptions,
  groupTypeOptions,
  lmsGroups,
  type GroupStatus,
  type GroupType,
  type LmsGroup,
} from "./data";

const initialFilters = {
  query: "",
  type: "전체" as "전체" | GroupType,
  status: "전체" as "전체" | GroupStatus,
  startedAt: "",
  endedAt: "",
};

export function GroupManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const summary = useMemo(
    () => ({
      totalCount: lmsGroups.length,
      activeCount: lmsGroups.filter((group) => group.status === "진행중").length,
      endingSoonCount: getEndingSoonGroups().length,
      endedCount: lmsGroups.filter((group) => group.status === "종료").length,
    }),
    [],
  );

  const filteredGroups = useMemo(() => {
    const keyword = appliedFilters.query.trim().toLowerCase();

    return lmsGroups.filter((group) => {
      const matchesKeyword = keyword
        ? [group.groupName, group.companyName, group.campaignName].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesType = appliedFilters.type === "전체" ? true : group.type === appliedFilters.type;
      const matchesStatus = appliedFilters.status === "전체" ? true : group.status === appliedFilters.status;
      const matchesStartedAt = appliedFilters.startedAt ? group.startedAt >= appliedFilters.startedAt : true;
      const matchesEndedAt = appliedFilters.endedAt ? group.endedAt <= appliedFilters.endedAt : true;

      return matchesKeyword && matchesType && matchesStatus && matchesStartedAt && matchesEndedAt;
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

  const openDetail = (group: LmsGroup) => {
    router.push(`/lms/groups/${group.id}`);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="그룹 관리"
        description="기간제 수강 권한을 제공하는 마케팅, B2B, 내부 테스트 그룹을 관리합니다."
        action={
          <Link
            href="/lms/groups/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
            그룹 생성
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard label="전체 그룹 수" value={String(summary.totalCount)} change="Mock 데이터 기준" tone="indigo" />
        <StatCard label="진행중 그룹 수" value={String(summary.activeCount)} change="기간제 수강 제공 중" tone="emerald" />
        <StatCard label="종료 예정 그룹 수" value={String(summary.endingSoonCount)} change="21일 이내 종료" tone="amber" />
        <StatCard label="종료된 그룹 수" value={String(summary.endedCount)} change="권한 회수 완료" tone="rose" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
            <CardTitle>필터</CardTitle>
          </div>
          <CardDescription>그룹명, 회사명, 캠페인명과 유형, 상태, 기간으로 그룹을 검색합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(140px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  placeholder="그룹명, 회사명, 캠페인명"
                  value={filters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                />
              </div>
            </label>
            <label className="text-sm font-bold text-slate-600">
              그룹 유형
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.type}
                onChange={(event) => updateFilter("type", event.target.value)}
              >
                {groupTypeOptions.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              상태
              <select
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.status}
                onChange={(event) => updateFilter("status", event.target.value)}
              >
                {groupStatusOptions.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              시작일
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.startedAt}
                onChange={(event) => updateFilter("startedAt", event.target.value)}
              />
            </label>
            <label className="text-sm font-bold text-slate-600">
              종료일
              <input
                type="date"
                className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                value={filters.endedAt}
                onChange={(event) => updateFilter("endedAt", event.target.value)}
              />
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
          <CardTitle>그룹 목록</CardTitle>
          <CardDescription>목록의 아무 행이나 클릭하면 그룹 상세 화면으로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>그룹명</TableHead>
                <TableHead>유형</TableHead>
                <TableHead>제공 수업 수</TableHead>
                <TableHead>참여 유저 수</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>자동 만료</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow
                  key={group.id}
                  tabIndex={0}
                  className="cursor-pointer"
                  onClick={() => openDetail(group)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openDetail(group);
                    }
                  }}
                >
                  <TableCell className="min-w-56 font-bold text-slate-900">
                    <div>{group.groupName}</div>
                    <div className="mt-1 text-xs font-semibold text-slate-500">{group.companyName} · {group.campaignName}</div>
                  </TableCell>
                  <TableCell><Badge variant={getGroupTypeTone(group.type)}>{group.type}</Badge></TableCell>
                  <TableCell>{group.classes.length}개</TableCell>
                  <TableCell>{group.users.length}명</TableCell>
                  <TableCell>{group.startedAt}</TableCell>
                  <TableCell>{group.endedAt}</TableCell>
                  <TableCell><Badge variant={getGroupStatusTone(group.status)}>{group.status}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={group.autoExpire ? "success" : "slate"}>{group.autoExpire ? "ON" : "OFF"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filteredGroups.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="py-10 text-center font-semibold text-slate-500">
                    조건에 맞는 그룹이 없습니다.
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

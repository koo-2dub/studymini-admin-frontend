"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { MemberRecord } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Member = MemberRecord;

type FilterState = {
  search: string;
  joinedFrom: string;
  joinedTo: string;
  segment: string;
  status: string;
  lastLogin: string;
};

const today = new Date("2026-05-29T00:00:00Z");
const oneDay = 24 * 60 * 60 * 1000;
const initialFilters: FilterState = {
  search: "",
  joinedFrom: "",
  joinedTo: "",
  segment: "전체",
  status: "전체",
  lastLogin: "전체",
};

function daysAgo(date: string) {
  return Math.floor((today.getTime() - new Date(`${date}T00:00:00Z`).getTime()) / oneDay);
}

function isWithinLastDays(date: string, days: number) {
  const diff = daysAgo(date);
  return diff >= 0 && diff < days;
}

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

function countBy<T extends string>(items: Member[], key: (member: Member) => T) {
  return items.reduce<Record<T, number>>((acc, member) => {
    const value = key(member);
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export function MembersDashboard({ members }: { members: Member[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  const summary = useMemo(() => {
    const total = members.length;
    const todayJoined = members.filter((member) => member.joined === "2026-05-29").length;
    const sevenDayJoined = members.filter((member) => isWithinLastDays(member.joined, 7)).length;
    const statusCounts = countBy(members, (member) => member.status);
    const segmentCounts = countBy(members, (member) => member.segment);
    const dailyJoinCounts = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today.getTime() - (6 - index) * oneDay);
      const isoDate = date.toISOString().slice(0, 10);
      return {
        label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
        value: members.filter((member) => member.joined === isoDate).length,
      };
    });

    return {
      total,
      todayJoined,
      sevenDayJoined,
      purchaseMembers: segmentCounts["구매회원"] ?? 0,
      dormantMembers: statusCounts["휴면"] ?? 0,
      dailyJoinCounts,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const search = filters.search.trim().toLowerCase();
      const matchedSearch = search ? [member.name, member.id, member.email].some((value) => value.toLowerCase().includes(search)) : true;
      const matchedJoinedFrom = filters.joinedFrom ? member.joined >= filters.joinedFrom : true;
      const matchedJoinedTo = filters.joinedTo ? member.joined <= filters.joinedTo : true;
      const matchedSegment = filters.segment === "전체" || member.segment === filters.segment;
      const matchedStatus = filters.status === "전체" || member.status === filters.status;
      const loginDays = daysAgo(member.lastLogin);
      const matchedLastLogin =
        filters.lastLogin === "전체" ||
        (filters.lastLogin === "7일 이내" && loginDays >= 0 && loginDays <= 7) ||
        (filters.lastLogin === "30일 이내" && loginDays >= 0 && loginDays <= 30) ||
        (filters.lastLogin === "90일 이상 미접속" && loginDays >= 90);

      return matchedSearch && matchedJoinedFrom && matchedJoinedTo && matchedSegment && matchedStatus && matchedLastLogin;
    });
  }, [filters, members]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <section>
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950">전체 유저 현황</h2>
            <p className="text-sm text-muted-foreground">전체 회원 {summary.total.toLocaleString()}명 · 운영 핵심 KPI만 상단에 표시합니다.</p>
          </div>
        </div>
        <div className="grid gap-3 xl:grid-cols-[1.7fr_0.8fr]">
          <Card>
            <CardContent className="grid grid-cols-2 gap-3 p-4 xl:grid-cols-4">
              <SummaryMetric label="오늘 가입" value={`${summary.todayJoined.toLocaleString()}명`} emphasis />
              <SummaryMetric label="최근 7일 가입" value={`${summary.sevenDayJoined.toLocaleString()}명`} emphasis />
              <SummaryMetric label="구매 회원" value={`${summary.purchaseMembers.toLocaleString()}명`} emphasis />
              <SummaryMetric label="휴면 회원" value={`${summary.dormantMembers.toLocaleString()}명`} emphasis />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="px-4 py-3">
              <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-indigo-500" />최근 가입 추이</CardTitle>
              <CardDescription>최근 7일</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <div className="flex h-20 items-end gap-2 rounded-2xl bg-gradient-to-b from-slate-50 to-white p-3">
                {summary.dailyJoinCounts.map((item) => {
                  const max = Math.max(...summary.dailyJoinCounts.map((count) => count.value), 1);
                  const height = Math.max((item.value / max) * 100, item.value ? 18 : 5);
                  return (
                    <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-1 text-center">
                      <div className="text-[11px] font-bold text-slate-700">{item.value}</div>
                      <div className="flex flex-1 items-end">
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-sky-400 shadow-sm transition-all"
                          style={{ height: `${height}%` }}
                          aria-label={`${item.label} 가입 ${item.value}명`}
                        />
                      </div>
                      <div className="whitespace-nowrap text-[10px] font-semibold text-muted-foreground">{item.label}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle>필터</CardTitle>
          <CardDescription>필터 적용 시 아래 유저 목록만 변경됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="px-5 pb-5 pt-0">
          <div className="grid gap-3 lg:grid-cols-5">
            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">검색</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="닉네임, User ID, 이메일"
                  className="h-10 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </label>
            <FilterInput label="가입일 시작" type="date" value={filters.joinedFrom} onChange={(value) => updateFilter("joinedFrom", value)} />
            <FilterInput label="가입일 종료" type="date" value={filters.joinedTo} onChange={(value) => updateFilter("joinedTo", value)} />
            <FilterSelect label="고객구분" value={filters.segment} options={["전체", "구매회원", "미구매회원"]} onChange={(value) => updateFilter("segment", value)} />
            <FilterSelect label="회원상태" value={filters.status} options={["전체", "정상", "휴면", "탈퇴"]} onChange={(value) => updateFilter("status", value)} />
            <FilterSelect label="최근 로그인" value={filters.lastLogin} options={["전체", "7일 이내", "30일 이내", "90일 이상 미접속"]} onChange={(value) => updateFilter("lastLogin", value)} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="px-5 py-4">
          <CardTitle>유저 목록</CardTitle>
          <CardDescription>현재 조건에 맞는 유저 {filteredMembers.length.toLocaleString()}명 · 행 전체를 클릭하면 유저 상세로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto px-5 pb-5 pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "닉네임",
                  "User ID",
                  "이메일",
                  "고객구분",
                  "회원상태",
                  "구매 횟수",
                  "누적 결제 금액",
                  "보유 포인트",
                  "가입일",
                  "최근 로그인",
                ].map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={() => router.push(`/members/${member.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") router.push(`/members/${member.id}`);
                  }}
                >
                  <TableCell className="whitespace-nowrap font-bold text-slate-950">{member.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs font-bold text-indigo-700">{member.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{member.email}</TableCell>
                  <TableCell className="whitespace-nowrap"><Badge variant={member.segment === "구매회원" ? "success" : "slate"}>{member.segment}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap"><Badge variant={member.status === "정상" ? "success" : member.status === "휴면" ? "warning" : "rose"}>{member.status}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap text-right font-bold">{member.orderCount.toLocaleString()}건</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-bold">{formatCurrency(member.totalPayment)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-bold">{member.points.toLocaleString()}P</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(member.joined)}</TableCell>
                  <TableCell className="whitespace-nowrap">{formatDate(member.lastLogin)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryMetric({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={cn("rounded-2xl bg-slate-50 p-4", emphasis && "bg-indigo-50")}> 
      <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 whitespace-nowrap font-black text-slate-950", emphasis ? "text-3xl" : "text-xl")}>{value}</p>
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
    </label>
  );
}

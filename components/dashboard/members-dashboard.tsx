"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Member = {
  id: string;
  name: string;
  email: string;
  status: string;
  joined: string;
  segment: string;
  marketingConsent: boolean;
  lastLogin: string;
  courseStatus: string;
};

type FilterState = {
  search: string;
  joinedFrom: string;
  joinedTo: string;
  segment: string;
  status: string;
  marketing: string;
  lastLogin: string;
  courseStatus: string;
};

const today = new Date("2026-05-29T00:00:00Z");
const oneDay = 24 * 60 * 60 * 1000;

const initialFilters: FilterState = {
  search: "",
  joinedFrom: "",
  joinedTo: "",
  segment: "전체",
  status: "전체",
  marketing: "전체",
  lastLogin: "전체",
  courseStatus: "전체",
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

function countBy<T extends string>(items: Member[], key: (member: Member) => T) {
  return items.reduce<Record<T, number>>((acc, member) => {
    const value = key(member);
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {} as Record<T, number>);
}

export function MembersDashboard({ members }: { members: Member[] }) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const summary = useMemo(() => {
    const total = members.length;
    const todayJoined = members.filter((member) => member.joined === "2026-05-29").length;
    const sevenDayJoined = members.filter((member) => isWithinLastDays(member.joined, 7)).length;
    const statusCounts = countBy(members, (member) => member.status);
    const segmentCounts = countBy(members, (member) => member.segment);
    const marketingAgreed = members.filter((member) => member.marketingConsent).length;
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
      statusCounts,
      segmentCounts,
      marketingRate: total ? Math.round((marketingAgreed / total) * 100) : 0,
      marketingAgreed,
      dailyJoinCounts,
    };
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const search = filters.search.trim().toLowerCase();
      const matchedSearch = search
        ? [member.name, member.id, member.email].some((value) => value.toLowerCase().includes(search))
        : true;
      const matchedJoinedFrom = filters.joinedFrom ? member.joined >= filters.joinedFrom : true;
      const matchedJoinedTo = filters.joinedTo ? member.joined <= filters.joinedTo : true;
      const matchedSegment = filters.segment === "전체" || member.segment === filters.segment;
      const matchedStatus = filters.status === "전체" || member.status === filters.status;
      const matchedMarketing =
        filters.marketing === "전체" ||
        (filters.marketing === "동의" ? member.marketingConsent : !member.marketingConsent);
      const loginDays = daysAgo(member.lastLogin);
      const matchedLastLogin =
        filters.lastLogin === "전체" ||
        (filters.lastLogin === "7일 이내" && loginDays >= 0 && loginDays <= 7) ||
        (filters.lastLogin === "30일 이내" && loginDays >= 0 && loginDays <= 30) ||
        (filters.lastLogin === "90일 이상 미접속" && loginDays >= 90);
      const matchedCourseStatus = filters.courseStatus === "전체" || member.courseStatus === filters.courseStatus;

      return (
        matchedSearch &&
        matchedJoinedFrom &&
        matchedJoinedTo &&
        matchedSegment &&
        matchedStatus &&
        matchedMarketing &&
        matchedLastLogin &&
        matchedCourseStatus
      );
    });
  }, [filters, members]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-950">전체 유저 현황</h2>
            <p className="text-sm text-muted-foreground">필터와 관계없이 전체 회원 기준으로 집계됩니다.</p>
          </div>
        </div>
        <div className="grid gap-4 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base"><UsersRound className="h-5 w-5 text-indigo-500" />전체 유저 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryMetric label="전체 유저 수" value={`${summary.total.toLocaleString()}명`} emphasis />
              <div className="grid grid-cols-2 gap-3">
                <SummaryMetric label="오늘 가입" value={`${summary.todayJoined}명`} />
                <SummaryMetric label="최근 7일 가입" value={`${summary.sevenDayJoined}명`} />
              </div>
            </CardContent>
          </Card>
          <DistributionCard title="회원 상태 분포" items={["정상", "휴면", "탈퇴"].map((label) => ({ label, value: summary.statusCounts[label] ?? 0 }))} total={summary.total} />
          <DistributionCard title="고객구분 분포" items={["구매회원", "미구매회원"].map((label) => ({ label, value: summary.segmentCounts[label] ?? 0 }))} total={summary.total} />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">마케팅 수신동의율</CardTitle>
              <CardDescription>전체 유저 중 동의 회원 비율</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black text-slate-950">{summary.marketingRate}%</div>
              <p className="mt-1 text-sm text-muted-foreground">동의 {summary.marketingAgreed}명 / 전체 {summary.total}명</p>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${summary.marketingRate}%` }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader className="flex-col gap-3 md:flex-row md:items-start md:justify-between md:space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-indigo-500" />최근 가입 추이</CardTitle>
            <CardDescription>최근 7일 가입자 수 기준</CardDescription>
          </div>
          <div className="grid grid-cols-2 gap-3 text-right">
            <SummaryMetric label="오늘 가입" value={`${summary.todayJoined}명`} />
            <SummaryMetric label="최근 7일 가입" value={`${summary.sevenDayJoined}명`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex h-72 items-end gap-3 rounded-3xl bg-gradient-to-b from-slate-50 to-white p-5">
            {summary.dailyJoinCounts.map((item) => {
              const max = Math.max(...summary.dailyJoinCounts.map((count) => count.value), 1);
              const height = Math.max((item.value / max) * 100, item.value ? 18 : 5);
              return (
                <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3 text-center">
                  <div className="text-sm font-bold text-slate-700">{item.value}명</div>
                  <div className="flex flex-1 items-end">
                    <div
                      className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-600 to-sky-400 shadow-sm transition-all"
                      style={{ height: `${height}%` }}
                      aria-label={`${item.label} 가입 ${item.value}명`}
                    />
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground">{item.label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
          <CardDescription>필터 적용 시 아래 유저 목록만 변경되며 상단 전체 유저 현황은 유지됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-4">
            <label className="space-y-2 lg:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">검색</span>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  value={filters.search}
                  onChange={(event) => updateFilter("search", event.target.value)}
                  placeholder="닉네임, User ID, 이메일"
                  className="h-11 flex-1 bg-transparent text-sm outline-none"
                />
              </div>
            </label>
            <FilterInput label="가입일 시작" type="date" value={filters.joinedFrom} onChange={(value) => updateFilter("joinedFrom", value)} />
            <FilterInput label="가입일 종료" type="date" value={filters.joinedTo} onChange={(value) => updateFilter("joinedTo", value)} />
            <FilterSelect label="고객구분" value={filters.segment} options={["전체", "구매회원", "미구매회원"]} onChange={(value) => updateFilter("segment", value)} />
            <FilterSelect label="회원상태" value={filters.status} options={["전체", "정상", "휴면", "탈퇴"]} onChange={(value) => updateFilter("status", value)} />
            <FilterSelect label="마케팅 수신" value={filters.marketing} options={["전체", "동의", "미동의"]} onChange={(value) => updateFilter("marketing", value)} />
            <FilterSelect label="최근 로그인" value={filters.lastLogin} options={["전체", "7일 이내", "30일 이내", "90일 이상 미접속"]} onChange={(value) => updateFilter("lastLogin", value)} />
            <FilterSelect label="수강상태" value={filters.courseStatus} options={["전체", "수강중", "수강 이력 있음", "수강 이력 없음"]} onChange={(value) => updateFilter("courseStatus", value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>유저 목록</CardTitle>
          <CardDescription>현재 조건에 맞는 유저 {filteredMembers.length.toLocaleString()}명 · 행 전체를 클릭하면 유저 상세로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "No.",
                  "닉네임",
                  "User ID",
                  "이메일",
                  "고객구분",
                  "회원상태",
                  "가입일",
                  "최근 로그인",
                ].map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member, index) => (
                <TableRow
                  key={member.id}
                  className="cursor-pointer"
                  tabIndex={0}
                  onClick={() => router.push(`/members/${member.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") router.push(`/members/${member.id}`);
                  }}
                >
                  <TableCell className="font-semibold text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-bold text-slate-950">{member.name}</TableCell>
                  <TableCell>{member.id}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell><Badge variant={member.segment === "구매회원" ? "success" : "slate"}>{member.segment}</Badge></TableCell>
                  <TableCell><Badge variant={member.status === "정상" ? "success" : member.status === "휴면" ? "warning" : "rose"}>{member.status}</Badge></TableCell>
                  <TableCell>{formatDate(member.joined)}</TableCell>
                  <TableCell>{formatDate(member.lastLogin)}</TableCell>
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
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 font-black text-slate-950", emphasis ? "text-3xl" : "text-xl")}>{value}</p>
    </div>
  );
}

function DistributionCard({ title, items, total }: { title: string; items: { label: string; value: number }[]; total: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>전체 유저 기준</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const percent = total ? Math.round((item.value / total) * 100) : 0;
          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700">{item.label}</span>
                <span className="text-muted-foreground">{item.value}명 · {percent}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
    </label>
  );
}

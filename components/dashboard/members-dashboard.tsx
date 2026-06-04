"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, TrendingUp, UsersRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const TODAY_ISO = "2026-05-29";
const today = new Date(`${TODAY_ISO}T00:00:00Z`);
const oneDay = 24 * 60 * 60 * 1000;

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
  orderCount: number;
  totalPayment: number;
  points: number;
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
    const todayJoined = members.filter((member) => member.joined === TODAY_ISO).length;
    const yesterday = new Date(today.getTime() - oneDay).toISOString().slice(0, 10);
    const yesterdayJoined = members.filter((member) => member.joined === yesterday).length;
    const sevenDayJoined = members.filter((member) => isWithinLastDays(member.joined, 7)).length;
    const thirtyDayJoined = members.filter((member) => isWithinLastDays(member.joined, 30)).length;
    const statusCounts = countBy(members, (member) => member.status);
    const purchaseMembers = members.filter((member) => member.segment === "구매회원" || member.orderCount > 0).length;
    const dormantMembers = statusCounts["휴면"] ?? 0;
    const marketingAgreed = members.filter((member) => member.marketingConsent).length;
    const dailyJoinCounts = Array.from({ length: 14 }, (_, index) => {
      const date = new Date(today.getTime() - (13 - index) * oneDay);
      const isoDate = date.toISOString().slice(0, 10);
      return {
        label: `${date.getUTCMonth() + 1}/${date.getUTCDate()}`,
        value: members.filter((member) => member.joined === isoDate).length,
      };
    });

    return {
      total,
      todayJoined,
      yesterdayJoined,
      sevenDayJoined,
      thirtyDayJoined,
      purchaseMembers,
      dormantMembers,
      statusCounts,
      marketingRate: total ? Math.round((marketingAgreed / total) * 100) : 0,
      marketingAgreed,
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
      const matchedMarketing = filters.marketing === "전체" || (filters.marketing === "동의" ? member.marketingConsent : !member.marketingConsent);
      const loginDays = daysAgo(member.lastLogin);
      const matchedLastLogin =
        filters.lastLogin === "전체" ||
        (filters.lastLogin === "7일 이내" && loginDays >= 0 && loginDays <= 7) ||
        (filters.lastLogin === "30일 이내" && loginDays >= 0 && loginDays <= 30) ||
        (filters.lastLogin === "90일 이상 미접속" && loginDays >= 90);
      const matchedCourseStatus = filters.courseStatus === "전체" || member.courseStatus === filters.courseStatus;

      return matchedSearch && matchedJoinedFrom && matchedJoinedTo && matchedSegment && matchedStatus && matchedMarketing && matchedLastLogin && matchedCourseStatus;
    });
  }, [filters, members]);

  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-black text-slate-950">전체 유저 현황</h2>
          <p className="text-sm text-muted-foreground">운영자가 가장 자주 확인하는 가입 추이와 회원 가치 지표를 먼저 보여줍니다.</p>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl"><TrendingUp className="h-6 w-6 text-indigo-500" />최근 가입 추이</CardTitle>
              <CardDescription>Mock 기준일 {formatDate(TODAY_ISO)} · 최근 14일 가입자 흐름</CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryMetric label="오늘 가입" value={`${summary.todayJoined.toLocaleString()}명`} emphasis />
              <SummaryMetric label="어제 가입" value={`${summary.yesterdayJoined.toLocaleString()}명`} />
              <SummaryMetric label="최근 7일 가입" value={`${summary.sevenDayJoined.toLocaleString()}명`} />
              <SummaryMetric label="최근 30일 가입" value={`${summary.thirtyDayJoined.toLocaleString()}명`} />
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex h-96 min-w-[760px] items-end gap-3 rounded-3xl bg-gradient-to-b from-indigo-50 via-slate-50 to-white p-5">
              {summary.dailyJoinCounts.map((item) => {
                const max = Math.max(...summary.dailyJoinCounts.map((count) => count.value), 1);
                const height = Math.max((item.value / max) * 100, item.value ? 18 : 5);
                return (
                  <div key={item.label} className="flex h-full flex-1 flex-col justify-end gap-3 text-center">
                    <div className="whitespace-nowrap text-sm font-bold text-slate-700">{item.value}명</div>
                    <div className="flex flex-1 items-end">
                      <div
                        className="w-full rounded-t-2xl bg-gradient-to-t from-indigo-600 to-sky-400 shadow-sm transition-all"
                        style={{ height: `${height}%` }}
                        aria-label={`${item.label} 가입 ${item.value}명`}
                      />
                    </div>
                    <div className="whitespace-nowrap text-xs font-semibold text-muted-foreground">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PriorityCard label="전체 회원" value={`${summary.total.toLocaleString()}명`} helper="전체 가입 회원" tone="indigo" />
        <PriorityCard label="구매 회원" value={`${summary.purchaseMembers.toLocaleString()}명`} helper="1회 이상 구매 또는 구매회원" tone="emerald" />
        <PriorityCard label="휴면 회원" value={`${summary.dormantMembers.toLocaleString()}명`} helper="복귀 캠페인 우선 대상" tone="amber" />
        <PriorityCard label="오늘 가입" value={`${summary.todayJoined.toLocaleString()}명`} helper="당일 온보딩 확인" tone="sky" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">마케팅 수신동의율</CardTitle>
            <CardDescription>보조 지표 · 전체 회원 중 동의 비율</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-slate-950">{summary.marketingRate}%</div>
            <p className="mt-1 text-sm text-muted-foreground">동의 {summary.marketingAgreed}명 / 전체 {summary.total}명</p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" style={{ width: `${summary.marketingRate}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-base">회원상태 운영 참고</CardTitle>
              <CardDescription>상태별 비중은 필터와 관계없이 전체 회원 기준입니다.</CardDescription>
            </div>
            <UsersRound className="h-5 w-5 text-indigo-500" />
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            {(["정상", "휴면", "탈퇴"] as const).map((label) => {
              const value = summary.statusCounts[label] ?? 0;
              const percent = summary.total ? Math.round((value / summary.total) * 100) : 0;
              return <SummaryMetric key={label} label={label} value={`${value.toLocaleString()}명`} helper={`${percent}%`} />;
            })}
          </CardContent>
        </Card>
      </section>

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
          <CardDescription>현재 조건에 맞는 유저 {filteredMembers.length.toLocaleString()}명 · 구매 규모와 포인트를 함께 확인할 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1180px]">
            <TableHeader>
              <TableRow>
                {["No.", "닉네임", "User ID", "이메일", "고객구분", "회원상태", "구매 횟수", "누적 결제 금액", "보유 포인트", "가입일", "최근 로그인"].map((header) => (
                  <TableHead key={header} className="whitespace-nowrap">{header}</TableHead>
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
                  <TableCell className="whitespace-nowrap font-semibold text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap font-bold text-slate-950">{member.name}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-xs font-bold text-indigo-700">{member.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{member.email}</TableCell>
                  <TableCell className="whitespace-nowrap"><Badge variant={member.segment === "구매회원" ? "success" : "slate"}>{member.segment}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap"><Badge variant={member.status === "정상" ? "success" : member.status === "휴면" ? "warning" : "rose"}>{member.status}</Badge></TableCell>
                  <TableCell className="whitespace-nowrap text-right font-black text-slate-800">{member.orderCount.toLocaleString()}회</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-black text-slate-950">{formatCurrency(member.totalPayment)}</TableCell>
                  <TableCell className="whitespace-nowrap text-right font-black text-emerald-700">{member.points.toLocaleString()}P</TableCell>
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

function SummaryMetric({ label, value, helper, emphasis = false }: { label: string; value: string; helper?: string; emphasis?: boolean }) {
  return (
    <div className={cn("rounded-2xl bg-white/80 p-4 shadow-sm ring-1 ring-slate-100", emphasis && "bg-indigo-50 ring-indigo-100")}>
      <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={cn("mt-1 whitespace-nowrap font-black text-slate-950", emphasis ? "text-3xl" : "text-xl")}>{value}</p>
      {helper && <p className="mt-1 whitespace-nowrap text-xs font-bold text-muted-foreground">{helper}</p>}
    </div>
  );
}

function PriorityCard({ label, value, helper, tone }: { label: string; value: string; helper: string; tone: "indigo" | "emerald" | "amber" | "sky" }) {
  const toneClass = {
    indigo: "from-indigo-50 to-white text-indigo-700",
    emerald: "from-emerald-50 to-white text-emerald-700",
    amber: "from-amber-50 to-white text-amber-700",
    sky: "from-sky-50 to-white text-sky-700",
  }[tone];

  return (
    <Card className="overflow-hidden">
      <CardContent className={cn("bg-gradient-to-br p-6", toneClass)}>
        <p className="whitespace-nowrap text-sm font-black text-slate-600">{label}</p>
        <p className="mt-3 whitespace-nowrap text-4xl font-black">{value}</p>
        <p className="mt-2 whitespace-nowrap text-sm font-bold text-slate-500">{helper}</p>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function FilterInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-2">
      <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm font-semibold outline-none" />
    </label>
  );
}

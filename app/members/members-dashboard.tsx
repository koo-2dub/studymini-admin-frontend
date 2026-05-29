"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, Search, UsersRound } from "lucide-react";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TODAY = "2026-05-29";
const MS_PER_DAY = 24 * 60 * 60 * 1000;

const statusLabels = ["정상", "휴면", "탈퇴"] as const;
const customerLabels = ["구매회원", "미구매회원"] as const;

function daysBetween(date: string, baseDate: string) {
  return Math.round((Date.parse(`${baseDate}T00:00:00Z`) - Date.parse(`${date}T00:00:00Z`)) / MS_PER_DAY);
}

function formatShortDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric" }).format(new Date(`${date}T00:00:00Z`));
}

function getPercent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function buildDistribution<T extends string>(labels: readonly T[], getter: (member: (typeof members)[number]) => T) {
  return labels.map((label) => ({
    label,
    value: members.filter((member) => getter(member) === label).length,
  }));
}

const palette = {
  status: ["bg-emerald-500", "bg-amber-400", "bg-rose-500"],
  customer: ["bg-indigo-500", "bg-slate-300"],
  marketing: ["bg-sky-500", "bg-slate-300"],
};

function MiniDistribution({
  title,
  description,
  data,
  colors,
}: {
  title: string;
  description: string;
  data: { label: string; value: number }[];
  colors: string[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="min-h-[190px]">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
          {data.map((item, index) => (
            <div
              key={item.label}
              className={cn(colors[index], "transition-all")}
              style={{ width: `${getPercent(item.value, total)}%` }}
              title={`${item.label} ${item.value}명`}
            />
          ))}
        </div>
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-slate-600">
                <span className={cn("h-2.5 w-2.5 rounded-full", colors[index])} />
                {item.label}
              </span>
              <span className="font-bold text-slate-900">
                {item.value}명 <span className="text-xs text-muted-foreground">{getPercent(item.value, total)}%</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCard({ stats }: { stats: { label: string; value: string }[] }) {
  return (
    <Card className="min-h-[190px] bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
      <CardHeader className="p-4 pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base text-white">전체 유저 요약</CardTitle>
            <CardDescription className="text-white/75">필터와 무관한 전체 데이터 기준</CardDescription>
          </div>
          <div className="rounded-2xl bg-white/15 p-2">
            <UsersRound className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 p-4 pt-0 sm:grid-cols-5 xl:grid-cols-2">
        {stats.map((stat, index) => (
          <div key={stat.label} className={cn("rounded-2xl bg-white/12 p-3", index === 0 && "col-span-2 sm:col-span-1 xl:col-span-2")}>
            <p className="text-xs text-white/70">{stat.label}</p>
            <p className="mt-1 text-2xl font-black tracking-tight">{stat.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SignupTrend({ data }: { data: { date: string; count: number }[] }) {
  const maxValue = Math.max(...data.map((item) => item.count), 1);
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="min-h-[190px]">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">최근 가입 추이</CardTitle>
            <CardDescription>최근 7일 가입자 수</CardDescription>
          </div>
          <Badge variant="default">총 {total}명</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex h-24 items-end gap-2 rounded-2xl bg-slate-50 p-3">
          {data.map((item) => (
            <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-14 w-full items-end justify-center">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-sky-400"
                  style={{ height: `${Math.max((item.count / maxValue) * 100, item.count > 0 ? 16 : 4)}%` }}
                  title={`${formatShortDate(item.date)} ${item.count}명`}
                />
              </div>
              <span className="text-[10px] font-semibold text-slate-500">{formatShortDate(item.date)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MarketingConsent({ agreed, declined }: { agreed: number; declined: number }) {
  const total = agreed + declined;
  const agreedPercent = getPercent(agreed, total);

  return (
    <Card className="min-h-[190px]">
      <CardHeader className="p-4 pb-3">
        <CardTitle className="text-base">마케팅 수신동의율</CardTitle>
        <CardDescription>전체 유저 기준 동의 / 미동의</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <div>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-black text-slate-950">{agreedPercent}%</p>
            <p className="text-sm font-semibold text-slate-500">{agreed}명 동의</p>
          </div>
          <div className="mt-3 flex h-4 overflow-hidden rounded-full bg-slate-100">
            <div className={palette.marketing[0]} style={{ width: `${agreedPercent}%` }} />
            <div className={palette.marketing[1]} style={{ width: `${100 - agreedPercent}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">동의 <b>{agreed}명</b></div>
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">미동의 <b>{declined}명</b></div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MembersDashboard() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("전체");
  const [customerType, setCustomerType] = useState("전체");

  const totalUsers = members.length;
  const todayJoined = members.filter((member) => member.joined === TODAY).length;
  const recent7Joined = members.filter((member) => daysBetween(member.joined, TODAY) >= 0 && daysBetween(member.joined, TODAY) < 7).length;
  const purchasedUsers = members.filter((member) => member.customerType === "구매회원").length;
  const nonPurchasedUsers = totalUsers - purchasedUsers;
  const marketingAgreed = members.filter((member) => member.marketingConsent).length;
  const statusDistribution = buildDistribution(statusLabels, (member) => member.statusGroup);
  const customerDistribution = buildDistribution(customerLabels, (member) => member.customerType);
  const signupTrend = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(Date.parse(`${TODAY}T00:00:00Z`) - (6 - index) * MS_PER_DAY).toISOString().slice(0, 10);
    return { date, count: members.filter((member) => member.joined === date).length };
  });

  const filteredMembers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return members.filter((member) => {
      const matchesQuery = normalizedQuery.length === 0
        || member.name.toLowerCase().includes(normalizedQuery)
        || member.email.toLowerCase().includes(normalizedQuery)
        || member.id.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "전체" || member.statusGroup === status;
      const matchesCustomerType = customerType === "전체" || member.customerType === customerType;

      return matchesQuery && matchesStatus && matchesCustomerType;
    });
  }, [customerType, query, status]);

  return (
    <>
      <PageHeader eyebrow="User CRM" title="유저 관리" description="전체 현황은 고정 요약 대시보드로, 목록은 현재 필터 조건에 맞춰 확인합니다." />

      <section className="mb-6">
        <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-950">전체 유저 현황</h2>
            <p className="text-sm text-muted-foreground">상단 그래프와 숫자는 필터 적용 여부와 관계없이 전체 유저 데이터 기준입니다.</p>
          </div>
          <Badge variant="slate">기준일 {TODAY}</Badge>
        </div>
        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <SummaryCard
            stats={[
              { label: "전체 유저 수", value: `${totalUsers}명` },
              { label: "오늘 가입", value: `${todayJoined}명` },
              { label: "최근 7일 가입", value: `${recent7Joined}명` },
              { label: "구매회원 수", value: `${purchasedUsers}명` },
              { label: "미구매회원 수", value: `${nonPurchasedUsers}명` },
            ]}
          />
          <MiniDistribution title="회원 상태 분포" description="정상 · 휴면 · 탈퇴" data={statusDistribution} colors={palette.status} />
          <MiniDistribution title="고객구분 분포" description="구매회원 · 미구매회원" data={customerDistribution} colors={palette.customer} />
          <SignupTrend data={signupTrend} />
          <MarketingConsent agreed={marketingAgreed} declined={totalUsers - marketingAgreed} />
        </div>
      </section>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <CardTitle>유저 목록</CardTitle>
              <CardDescription>현재 조건에 맞는 유저 {filteredMembers.length.toLocaleString()}명을 표시합니다.</CardDescription>
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(220px,1fr)_160px_180px]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-xl border bg-white/80 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="이름, 이메일, ID 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <select
                className="h-10 rounded-xl border bg-white/80 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option>전체</option>
                {statusLabels.map((label) => <option key={label}>{label}</option>)}
              </select>
              <select
                className="h-10 rounded-xl border bg-white/80 px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                value={customerType}
                onChange={(event) => setCustomerType(event.target.value)}
              >
                <option>전체</option>
                {customerLabels.map((label) => <option key={label}>{label}</option>)}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>유저</TableHead>
                <TableHead>플랜</TableHead>
                <TableHead>고객구분</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>구매금액</TableHead>
                <TableHead>상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div>
                      <p className="font-bold">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{member.plan}</TableCell>
                  <TableCell>{member.customerType}</TableCell>
                  <TableCell><StatusBadge value={member.statusGroup} /></TableCell>
                  <TableCell>{member.joined}</TableCell>
                  <TableCell>{member.spend}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/members/${member.id}`}><Eye className="h-3.5 w-3.5" />Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredMembers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                    현재 조건에 맞는 유저가 없습니다. 필터를 조정해 주세요.
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

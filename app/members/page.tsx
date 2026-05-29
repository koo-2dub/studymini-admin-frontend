import type { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Filter, MailCheck, Search, UsersRound } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { StatusBadge } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const memberListRows = members.map((member, index) => {
  const customerTypes = ["프리미엄", "신규", "기업", "관심필요"];
  const lastLogins = ["2026-05-28 14:22", "2026-05-27 09:10", "2026-05-29 08:45", "2026-05-20 18:03"];
  const marketingAgreed = [true, true, false, true];
  const statusLabels: Record<string, string> = {
    Active: "정상",
    Trial: "체험",
    Paused: "중지",
  };

  return {
    ...member,
    no: members.length - index,
    nickname: member.name,
    customerType: customerTypes[index] ?? "일반",
    statusLabel: statusLabels[member.status] ?? member.status,
    lastLogin: lastLogins[index] ?? "-",
    marketingAgreed: marketingAgreed[index] ?? false,
  };
});

const totalUsers = memberListRows.length;
const activeUsers = memberListRows.filter((member) => member.status === "Active").length;
const marketingAgreedUsers = memberListRows.filter((member) => member.marketingAgreed).length;
const marketingConsentRate = Math.round((marketingAgreedUsers / totalUsers) * 100);

const statusDistribution = [
  { label: "정상", value: activeUsers, tone: "bg-emerald-500" },
  { label: "체험", value: memberListRows.filter((member) => member.status === "Trial").length, tone: "bg-amber-500" },
  { label: "중지", value: memberListRows.filter((member) => member.status === "Paused").length, tone: "bg-slate-400" },
];

const customerTypeDistribution = Array.from(
  memberListRows.reduce((acc, member) => acc.set(member.customerType, (acc.get(member.customerType) ?? 0) + 1), new Map<string, number>()),
).map(([label, value]) => ({ label, value }));

const recentJoinTrend = [
  { label: "10월", value: memberListRows.filter((member) => member.joined.startsWith("2025-10")).length },
  { label: "12월", value: memberListRows.filter((member) => member.joined.startsWith("2025-12")).length },
  { label: "1월", value: memberListRows.filter((member) => member.joined.startsWith("2026-01")).length },
  { label: "3월", value: memberListRows.filter((member) => member.joined.startsWith("2026-03")).length },
];

const filterChips = ["전체", "정상", "체험", "중지", "프리미엄", "기업"];

function percent(value: number) {
  return Math.round((value / totalUsers) * 100);
}

function RowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link className={cn("block h-full w-full py-4", className)} href={href}>
      {children}
    </Link>
  );
}

export default function MembersPage() {
  return (
    <>
      <PageHeader
        eyebrow="User CRM"
        title="유저 관리"
        description="전체 유저 현황과 상태별 분포를 확인하고, 행을 클릭해 유저 상세로 이동합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="상단 전체 유저 현황 영역">
        <StatCard label="전체 유저" value={totalUsers.toLocaleString()} change="등록된 전체 계정" tone="indigo" />
        <StatCard label="정상 회원" value={activeUsers.toLocaleString()} change={`${percent(activeUsers)}% 활성 상태`} tone="emerald" />
        <StatCard label="최근 가입" value="2" change="2026년 신규 가입" tone="amber" />
        <StatCard label="마케팅 수신동의율" value={`${marketingConsentRate}%`} change={`${marketingAgreedUsers}명 동의`} tone="rose" />
      </section>

      <section className="mb-6 grid gap-4 xl:grid-cols-[1fr_1fr_0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UsersRound className="h-5 w-5 text-indigo-500" />회원 상태 분포</CardTitle>
            <CardDescription>현재 회원 상태별 비중입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusDistribution.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm font-bold">
                  <span>{item.label}</span>
                  <span>{item.value}명 · {percent(item.value)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={cn("h-full rounded-full", item.tone)} style={{ width: `${percent(item.value)}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5 text-indigo-500" />고객구분 분포</CardTitle>
            <CardDescription>운영 관리 기준의 고객 그룹입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {customerTypeDistribution.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                <p className="mt-2 text-2xl font-black">{item.value}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MailCheck className="h-5 w-5 text-indigo-500" />마케팅 수신동의율</CardTitle>
            <CardDescription>프로모션 수신 동의 현황입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-36 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-400 text-white shadow-glow">
              <div className="text-center">
                <p className="text-4xl font-black">{marketingConsentRate}%</p>
                <p className="text-xs font-bold opacity-80">동의 {marketingAgreedUsers}명</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-indigo-500" />최근 가입 추이</CardTitle>
            <CardDescription>가입월 기준 최근 유입 흐름입니다.</CardDescription>
          </CardHeader>
          <CardContent className="flex h-40 items-end gap-3">
            {recentJoinTrend.map((item) => (
              <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-24 w-full items-end rounded-2xl bg-slate-100 px-2">
                  <div className="w-full rounded-xl bg-gradient-to-t from-indigo-500 to-sky-400" style={{ height: `${Math.max(item.value * 70, 12)}%` }} />
                </div>
                <span className="text-xs font-bold text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card className="mb-6" aria-label="필터 영역">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5 text-indigo-500" />필터 영역</CardTitle>
          <CardDescription>검색어, 회원상태, 고객구분, 가입일 조건으로 유저 목록을 좁힐 수 있습니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-muted-foreground">닉네임 / User ID / 이메일 검색</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-muted-foreground">회원상태 전체</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-muted-foreground">고객구분 전체</div>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-muted-foreground">가입일 전체</div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {filterChips.map((chip) => <Badge key={chip}>{chip}</Badge>)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>유저 목록</CardTitle>
          <CardDescription>행을 클릭하면 해당 유저 상세 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>고객구분</TableHead>
                <TableHead>회원상태</TableHead>
                <TableHead>가입일</TableHead>
                <TableHead>최근 로그인</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberListRows.map((member) => {
                const href = `/members/${member.id}`;

                return (
                  <TableRow key={member.id} className="group cursor-pointer">
                    <TableCell className="p-0"><RowLink href={href} className="px-4 font-bold">{member.no}</RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4 font-black text-slate-900 group-hover:text-indigo-600">{member.nickname}</RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4 font-mono text-xs font-bold text-muted-foreground">{member.id}</RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4 text-sm text-slate-600">{member.email}</RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4"><Badge>{member.customerType}</Badge></RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4"><StatusBadge value={member.statusLabel} /></RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4 text-sm font-semibold text-slate-600">{member.joined}</RowLink></TableCell>
                    <TableCell className="p-0"><RowLink href={href} className="px-4 text-sm font-semibold text-slate-600">{member.lastLogin}</RowLink></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

"use client";

import Link from "next/link";
import { Eye, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { DataTable, MarketingBadge, StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { members, type Member, type MemberStatus } from "@/lib/mock-data";

type LoginFilter = "all" | "7" | "30" | "90";
type FilterState = {
  query: string;
  startDate: string;
  endDate: string;
  status: "all" | MemberStatus;
  marketing: "all" | "agreed" | "denied";
  recentLogin: LoginFilter;
};

const sortedMembers = [...members].sort((a, b) => b.joined.localeCompare(a.joined));
const totalMembers = sortedMembers.length;

const defaultFilters: FilterState = {
  query: "",
  startDate: "",
  endDate: "",
  status: "all",
  marketing: "all",
  recentLogin: "all",
};

const loginCutoffs: Record<Exclude<LoginFilter, "all">, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
};

function toDateOnly(value: string) {
  return value.slice(0, 10);
}

function daysSinceLogin(value: string) {
  const today = new Date("2026-05-29T00:00:00Z");
  const loginDate = new Date(`${value.replace(" ", "T")}:00+09:00`);
  return Math.floor((today.getTime() - loginDate.getTime()) / (1000 * 60 * 60 * 24));
}

export default function MembersPage() {
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(defaultFilters);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = appliedFilters.query.trim().toLowerCase();

    return sortedMembers.filter((member) => {
      const matchesQuery = normalizedQuery
        ? [member.nickname, member.id, member.email, member.phone].some((value) => value.toLowerCase().includes(normalizedQuery))
        : true;
      const matchesStart = appliedFilters.startDate ? member.joined >= appliedFilters.startDate : true;
      const matchesEnd = appliedFilters.endDate ? member.joined <= appliedFilters.endDate : true;
      const matchesStatus = appliedFilters.status === "all" ? true : member.status === appliedFilters.status;
      const matchesMarketing =
        appliedFilters.marketing === "all" ? true : appliedFilters.marketing === "agreed" ? member.marketingConsent : !member.marketingConsent;
      const loginAge = daysSinceLogin(member.recentLogin);
      const matchesLogin =
        appliedFilters.recentLogin === "all"
          ? true
          : appliedFilters.recentLogin === "90"
            ? loginAge >= loginCutoffs[appliedFilters.recentLogin]
            : loginAge <= loginCutoffs[appliedFilters.recentLogin];

      return matchesQuery && matchesStart && matchesEnd && matchesStatus && matchesMarketing && matchesLogin;
    });
  }, [appliedFilters]);

  const summary = {
    all: members.length,
    active: members.filter((member) => member.status === "정상").length,
    dormant: members.filter((member) => member.status === "휴면").length,
    withdrawn: members.filter((member) => member.status === "탈퇴").length,
    marketing: members.filter((member) => member.marketingConsent).length,
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
  };

  return (
    <>
      <PageHeader
        eyebrow="운영자 CRM"
        title="유저 관리"
        description="가입일 최신순으로 유저를 확인하고, 상세 화면에서 주문·수강·포인트·문의 이력을 관리합니다."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="전체" value={summary.all.toLocaleString()} change="총 유저 수" tone="indigo" />
        <StatCard label="정상" value={summary.active.toLocaleString()} change="이용 가능" tone="emerald" />
        <StatCard label="휴면" value={summary.dormant.toLocaleString()} change="장기 미접속" tone="amber" />
        <StatCard label="탈퇴" value={summary.withdrawn.toLocaleString()} change="서비스 해지" tone="rose" />
        <StatCard label="마케팅 동의" value={summary.marketing.toLocaleString()} change="수신 동의" tone="indigo" />
      </section>

      <Card className="mb-6">
        <CardContent className="grid gap-4 p-5 xl:grid-cols-[1.6fr_1fr_1fr_1fr_1fr_auto_auto]">
          <label className="space-y-2 text-sm font-bold text-slate-700">
            검색
            <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={draftFilters.query}
                onChange={(event) => setDraftFilters((filters) => ({ ...filters, query: event.target.value }))}
                placeholder="닉네임, User ID, 이메일, 전화번호"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">
            가입 시작일
            <input type="date" value={draftFilters.startDate} onChange={(event) => setDraftFilters((filters) => ({ ...filters, startDate: event.target.value }))} className="h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none" />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">
            가입 종료일
            <input type="date" value={draftFilters.endDate} onChange={(event) => setDraftFilters((filters) => ({ ...filters, endDate: event.target.value }))} className="h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none" />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">
            회원 상태
            <select value={draftFilters.status} onChange={(event) => setDraftFilters((filters) => ({ ...filters, status: event.target.value as "all" | MemberStatus }))} className="h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none">
              <option value="all">전체</option>
              <option value="정상">정상</option>
              <option value="휴면">휴면</option>
              <option value="탈퇴">탈퇴</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">
            마케팅 수신
            <select value={draftFilters.marketing} onChange={(event) => setDraftFilters((filters) => ({ ...filters, marketing: event.target.value as "all" | "agreed" | "denied" }))} className="h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none">
              <option value="all">전체</option>
              <option value="agreed">동의</option>
              <option value="denied">미동의</option>
            </select>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700 xl:min-w-40">
            최근 로그인
            <select value={draftFilters.recentLogin} onChange={(event) => setDraftFilters((filters) => ({ ...filters, recentLogin: event.target.value as LoginFilter }))} className="h-10 w-full rounded-xl border bg-white px-3 text-sm outline-none">
              <option value="all">전체</option>
              <option value="7">7일 이내</option>
              <option value="30">30일 이내</option>
              <option value="90">90일 이상 미접속</option>
            </select>
          </label>
          <div className="flex items-end gap-2">
            <Button type="button" className="h-10" onClick={() => setAppliedFilters(draftFilters)}>필터 적용</Button>
            <Button type="button" variant="outline" className="h-10" onClick={resetFilters}><RotateCcw className="h-4 w-4" />초기화</Button>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="유저 목록"
        description="가입일 최신순으로 정렬되어 있으며 No.는 전체 유저 수 기준 역순으로 표시됩니다."
        data={filteredMembers}
        columns={[
          { key: "no", header: "No.", render: (member: Member) => totalMembers - sortedMembers.findIndex((item) => item.id === member.id) },
          { key: "nickname", header: "닉네임", render: (member) => <span className="font-bold text-slate-900">{member.nickname}</span> },
          { key: "id", header: "User ID", render: (member) => <span className="whitespace-nowrap font-mono text-xs font-bold text-slate-600">{member.id}</span> },
          { key: "email", header: "이메일", render: (member) => <span className="whitespace-nowrap text-sm text-slate-700">{member.email}</span> },
          { key: "phone", header: "전화번호", render: (member) => <span className="whitespace-nowrap text-sm text-slate-700">{member.phone}</span> },
          { key: "status", header: "회원 상태", render: (member) => <StatusBadge value={member.status} /> },
          { key: "marketingConsent", header: "마케팅 수신", render: (member) => <MarketingBadge agreed={member.marketingConsent} /> },
          { key: "joined", header: "가입일", render: (member) => <span className="whitespace-nowrap">{toDateOnly(member.joined)}</span> },
          { key: "recentLogin", header: "최근 로그인", render: (member) => <span className="whitespace-nowrap">{toDateOnly(member.recentLogin)}</span> },
          { key: "action", header: "액션", render: (member) => <Button asChild variant="outline" size="sm"><Link href={`/members/${member.id}`}><Eye className="h-3.5 w-3.5" />상세</Link></Button> },
        ]}
      />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { CustomerBadge, MemberStatusBadge } from "@/components/dashboard/member-badges";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members, type CustomerType, type LearningStatus, type MemberRecord, type MemberStatus } from "@/lib/mock-data";

type FilterState = {
  query: string;
  joinedFrom: string;
  joinedTo: string;
  customerType: "전체" | CustomerType;
  status: "전체" | MemberStatus;
  marketing: "전체" | "동의" | "미동의";
  lastLogin: "전체" | "7일 이내" | "30일 이내" | "90일 이상 미접속";
  learningStatus: "전체" | LearningStatus;
};

const defaultFilters: FilterState = {
  query: "",
  joinedFrom: "",
  joinedTo: "",
  customerType: "전체",
  status: "전체",
  marketing: "전체",
  lastLogin: "전체",
  learningStatus: "전체",
};

const today = "2026-05-29";

export default function MembersPage() {
  const router = useRouter();
  const [draftFilters, setDraftFilters] = useState<FilterState>(defaultFilters);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => b.joined.localeCompare(a.joined) || b.id.localeCompare(a.id)),
    [],
  );

  const filteredMembers = useMemo(() => sortedMembers.filter((member) => matchesFilters(member, filters)), [filters, sortedMembers]);

  const summaryCards = [
    { label: "전체 유저", value: members.length.toLocaleString() },
    { label: "정상 유저", value: members.filter((member) => member.status === "정상").length.toLocaleString() },
    { label: "휴면 유저", value: members.filter((member) => member.status === "휴면").length.toLocaleString() },
    { label: "탈퇴 유저", value: members.filter((member) => member.status === "탈퇴").length.toLocaleString() },
    { label: "마케팅 동의", value: members.filter((member) => member.marketingConsent).length.toLocaleString() },
    { label: "오늘 가입", value: members.filter((member) => member.joined === today).length.toLocaleString() },
  ];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <PageHeader eyebrow="유저 관리" title="유저 관리" description="목록은 빠른 찾기용으로 간결하게 유지하고, 확인과 처리는 유저 상세에서 진행합니다." />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="p-5">
              <p className="text-sm font-semibold text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-3xl font-black tracking-tight text-slate-950">{card.value}</p>
              <p className="mt-1 text-xs text-slate-400">전체 유저 데이터 기준</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <CardTitle>필터</CardTitle>
              <CardDescription>닉네임, User ID, 이메일과 운영 조건으로 유저를 찾습니다.</CardDescription>
            </div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-black text-indigo-700">
              현재 조건에 맞는 유저 {filteredMembers.length.toLocaleString()}명
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-12">
            <label className="lg:col-span-4">
              <span className="filter-label">검색</span>
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  value={draftFilters.query}
                  onChange={(event) => updateFilter("query", event.target.value)}
                  placeholder="닉네임, User ID, 이메일 검색"
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </label>
            <label className="lg:col-span-2">
              <span className="filter-label">가입일 시작</span>
              <input className="filter-input mt-2" type="date" value={draftFilters.joinedFrom} onChange={(event) => updateFilter("joinedFrom", event.target.value)} />
            </label>
            <label className="lg:col-span-2">
              <span className="filter-label">가입일 종료</span>
              <input className="filter-input mt-2" type="date" value={draftFilters.joinedTo} onChange={(event) => updateFilter("joinedTo", event.target.value)} />
            </label>
            <FilterSelect label="고객구분" value={draftFilters.customerType} onChange={(value) => updateFilter("customerType", value as FilterState["customerType"])} options={["전체", "구매회원", "미구매회원"]} />
            <FilterSelect label="회원상태" value={draftFilters.status} onChange={(value) => updateFilter("status", value as FilterState["status"])} options={["전체", "정상", "휴면", "탈퇴"]} />
            <FilterSelect label="마케팅 수신" value={draftFilters.marketing} onChange={(value) => updateFilter("marketing", value as FilterState["marketing"])} options={["전체", "동의", "미동의"]} />
            <FilterSelect label="최근 로그인" value={draftFilters.lastLogin} onChange={(value) => updateFilter("lastLogin", value as FilterState["lastLogin"])} options={["전체", "7일 이내", "30일 이내", "90일 이상 미접속"]} />
            <FilterSelect label="수강상태" value={draftFilters.learningStatus} onChange={(value) => updateFilter("learningStatus", value as FilterState["learningStatus"])} options={["전체", "수강중", "수강 이력 있음", "수강 이력 없음"]} />
          </div>
          <div className="mt-5 flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDraftFilters(defaultFilters);
                setFilters(defaultFilters);
              }}
            >
              초기화
            </Button>
            <Button type="button" onClick={() => setFilters(draftFilters)}>필터 적용</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>유저 목록</CardTitle>
          <CardDescription>가입일 최신순이며, 행을 클릭하면 유저 상세 페이지로 이동합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[980px]">
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
              {filteredMembers.map((member) => {
                const no = members.length - sortedMembers.findIndex((item) => item.id === member.id);
                return (
                  <TableRow
                    key={member.id}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/members/${member.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") router.push(`/members/${member.id}`);
                    }}
                    className="cursor-pointer hover:bg-indigo-50/70"
                  >
                    <TableCell className="font-bold text-slate-500">{no}</TableCell>
                    <TableCell className="font-black text-indigo-700 underline-offset-4 hover:underline">{member.name}</TableCell>
                    <TableCell className="font-mono text-xs font-bold text-indigo-700">{member.id}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{member.email}</TableCell>
                    <TableCell><CustomerBadge value={member.customerType} /></TableCell>
                    <TableCell><MemberStatusBadge value={member.status} /></TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(member.joined)}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(member.lastLogin)}</TableCell>
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

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="lg:col-span-2">
      <span className="filter-label">{label}</span>
      <select className="filter-input mt-2" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function matchesFilters(member: MemberRecord, filters: FilterState) {
  const query = filters.query.trim().toLowerCase();
  const matchesQuery = !query || [member.name, member.id, member.email].some((value) => value.toLowerCase().includes(query));
  const matchesJoinedFrom = !filters.joinedFrom || member.joined >= filters.joinedFrom;
  const matchesJoinedTo = !filters.joinedTo || member.joined <= filters.joinedTo;
  const matchesCustomerType = filters.customerType === "전체" || member.customerType === filters.customerType;
  const matchesStatus = filters.status === "전체" || member.status === filters.status;
  const matchesMarketing = filters.marketing === "전체" || (filters.marketing === "동의" ? member.marketingConsent : !member.marketingConsent);
  const matchesLastLogin = filters.lastLogin === "전체" || matchesLastLoginFilter(member.lastLogin, filters.lastLogin);
  const matchesLearningStatus = filters.learningStatus === "전체" || member.learningStatus === filters.learningStatus;

  return matchesQuery && matchesJoinedFrom && matchesJoinedTo && matchesCustomerType && matchesStatus && matchesMarketing && matchesLastLogin && matchesLearningStatus;
}

function matchesLastLoginFilter(lastLogin: string, filter: FilterState["lastLogin"]) {
  const diffDays = Math.floor((new Date(`${today}T00:00:00Z`).getTime() - new Date(`${lastLogin}T00:00:00Z`).getTime()) / 86400000);

  if (filter === "7일 이내") return diffDays <= 7;
  if (filter === "30일 이내") return diffDays <= 30;
  if (filter === "90일 이상 미접속") return diffDays >= 90;
  return true;
}

function formatDate(value: string) {
  return value.slice(0, 10);
}

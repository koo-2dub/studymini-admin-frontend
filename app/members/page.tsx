"use client";

import Link from "next/link";
import { Eye, RotateCcw, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { members } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type UserStatus = "전체" | "정상" | "휴면" | "탈퇴";
type MarketingFilter = "전체" | "동의" | "미동의";

type Filters = {
  keyword: string;
  joinedFrom: string;
  joinedTo: string;
  status: UserStatus;
  marketing: MarketingFilter;
};

const initialFilters: Filters = {
  keyword: "",
  joinedFrom: "",
  joinedTo: "",
  status: "전체",
  marketing: "전체",
};

const sortedUsers = [...members].sort((a, b) => b.joined.localeCompare(a.joined));

export default function MembersPage() {
  const [draftFilters, setDraftFilters] = useState<Filters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<Filters>(initialFilters);

  const summary = useMemo(() => {
    return {
      total: members.length,
      active: members.filter((member) => member.status === "정상").length,
      dormant: members.filter((member) => member.status === "휴면").length,
      withdrawn: members.filter((member) => member.status === "탈퇴").length,
      marketing: members.filter((member) => member.marketingConsent).length,
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = appliedFilters.keyword.trim().toLowerCase();

    return sortedUsers.filter((member) => {
      const matchesKeyword = keyword
        ? [member.name, member.id, member.email, member.phone].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesJoinedFrom = appliedFilters.joinedFrom ? member.joined >= appliedFilters.joinedFrom : true;
      const matchesJoinedTo = appliedFilters.joinedTo ? member.joined <= appliedFilters.joinedTo : true;
      const matchesStatus = appliedFilters.status === "전체" ? true : member.status === appliedFilters.status;
      const matchesMarketing =
        appliedFilters.marketing === "전체"
          ? true
          : appliedFilters.marketing === "동의"
            ? member.marketingConsent
            : !member.marketingConsent;

      return matchesKeyword && matchesJoinedFrom && matchesJoinedTo && matchesStatus && matchesMarketing;
    });
  }, [appliedFilters]);

  const resetFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <>
      <PageHeader
        eyebrow="유저 CRM"
        title="유저 관리"
        description="가입 유저를 검색·필터링하고 최신 가입자부터 빠르게 확인하는 운영용 유저 목록입니다."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="총 유저 수" value={summary.total.toLocaleString()} change="전체 mock 유저" tone="indigo" />
        <StatCard label="정상 유저 수" value={summary.active.toLocaleString()} change="서비스 이용 가능" tone="emerald" />
        <StatCard label="휴면 유저 수" value={summary.dormant.toLocaleString()} change="재활성화 대상" tone="amber" />
        <StatCard label="탈퇴 유저 수" value={summary.withdrawn.toLocaleString()} change="계정 종료" tone="rose" />
        <StatCard label="마케팅 수신동의 수" value={summary.marketing.toLocaleString()} change="캠페인 발송 가능" tone="indigo" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            유저 검색 및 필터
          </CardTitle>
          <CardDescription>닉네임, User ID, 이메일, 전화번호와 가입 기간, 상태, 마케팅 수신동의 여부로 유저를 필터링합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-[1.6fr_1.2fr_1fr_1fr_auto]">
            <label className="space-y-2 text-sm font-bold text-slate-700">
              검색
              <input
                value={draftFilters.keyword}
                onChange={(event) => setDraftFilters((filters) => ({ ...filters, keyword: event.target.value }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="닉네임, User ID, 이메일, 전화번호 검색"
              />
            </label>
            <div className="space-y-2 text-sm font-bold text-slate-700">
              가입 기간
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  type="date"
                  value={draftFilters.joinedFrom}
                  onChange={(event) => setDraftFilters((filters) => ({ ...filters, joinedFrom: event.target.value }))}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  aria-label="가입 시작일"
                />
                <input
                  type="date"
                  value={draftFilters.joinedTo}
                  onChange={(event) => setDraftFilters((filters) => ({ ...filters, joinedTo: event.target.value }))}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  aria-label="가입 종료일"
                />
              </div>
            </div>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              회원 상태
              <select
                value={draftFilters.status}
                onChange={(event) => setDraftFilters((filters) => ({ ...filters, status: event.target.value as UserStatus }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                {(["전체", "정상", "휴면", "탈퇴"] as const).map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-700">
              마케팅 수신동의
              <select
                value={draftFilters.marketing}
                onChange={(event) => setDraftFilters((filters) => ({ ...filters, marketing: event.target.value as MarketingFilter }))}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
              >
                {(["전체", "동의", "미동의"] as const).map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-2">
              <Button type="button" variant="outline" className="h-11" onClick={resetFilters}>
                <RotateCcw className="h-4 w-4" />
                초기화
              </Button>
              <Button type="button" className="h-11" onClick={() => setAppliedFilters(draftFilters)}>
                필터 적용
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle>유저 목록</CardTitle>
            <CardDescription>가입일자 최신순으로 정렬되며, 현재 조건에 맞는 유저 {filteredUsers.length.toLocaleString()}명을 표시합니다.</CardDescription>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">총 유저 수 {summary.total.toLocaleString()}명</div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1120px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No.</TableHead>
                <TableHead>닉네임</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>이메일</TableHead>
                <TableHead>전화번호</TableHead>
                <TableHead>회원 상태</TableHead>
                <TableHead>마케팅 수신동의</TableHead>
                <TableHead>가입일자</TableHead>
                <TableHead>최근 로그인</TableHead>
                <TableHead>액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((member, index) => (
                <TableRow key={member.id}>
                  <TableCell className="font-black text-slate-500">{index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link href={`/members/${member.id}`} className="font-black text-slate-900 underline-offset-4 hover:text-primary hover:underline">
                      {member.name}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-bold text-slate-700">{member.id}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">{member.email}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">{member.phone}</TableCell>
                  <TableCell>
                    <UserStatusBadge status={member.status} />
                  </TableCell>
                  <TableCell>
                    <MarketingBadge consent={member.marketingConsent} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold text-slate-700">{member.joined}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">{member.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex whitespace-nowrap">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/members/${member.id}`}>
                          <Eye className="h-3.5 w-3.5" />
                          상세 보기
                        </Link>
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="ml-2">
                        상태 변경
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className="py-12 text-center text-sm font-semibold text-slate-500">
                    조건에 맞는 유저가 없습니다. 필터를 초기화하거나 검색어를 변경해주세요.
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

function UserStatusBadge({ status }: { status: string }) {
  return (
    <Badge variant={status === "정상" ? "success" : status === "탈퇴" ? "rose" : "slate"} className="whitespace-nowrap">
      {status}
    </Badge>
  );
}

function MarketingBadge({ consent }: { consent: boolean }) {
  return (
    <Badge variant={consent ? "success" : "slate"} className={cn("whitespace-nowrap", consent ? "border-indigo-200 bg-indigo-50 text-indigo-700" : undefined)}>
      {consent ? "동의" : "미동의"}
    </Badge>
  );
}

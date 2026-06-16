"use client";

import Link from "next/link";
import { CheckCircle2, Search, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { events, eventStatusOptions, eventStatusVariant, type EventStatus } from "./data";

const statusOptions: Array<"전체" | EventStatus> = ["전체", ...eventStatusOptions];
const detailImageColumns = [
  { key: "desktop1920", label: "1920" },
  { key: "desktop1280", label: "1280" },
  { key: "tablet768", label: "768" },
  { key: "mobile375", label: "375" },
] as const;

function ImageStatusBadge({ registered }: { registered: boolean }) {
  return registered ? (
    <Badge variant="success" className="gap-1 whitespace-nowrap"><CheckCircle2 className="h-3 w-3" />등록됨</Badge>
  ) : (
    <Badge variant="rose" className="gap-1 whitespace-nowrap"><XCircle className="h-3 w-3" />미등록</Badge>
  );
}

export default function EventsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusOptions)[number]>("전체");

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return events.filter((event) => {
      const matchesQuery = !normalizedQuery || `${event.title} ${event.cardTitle} ${event.cardBottomText}`.toLowerCase().includes(normalizedQuery);
      const matchesStatus = status === "전체" || event.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <>
      <PageHeader
        eyebrow="Marketing"
        title="이벤트 관리"
        description="웹사이트에 노출되는 이벤트를 생성, 수정, 관리합니다. 행을 클릭하면 상세/수정 화면으로 이동합니다."
        action={<Button asChild variant="secondary"><Link href="/events/create">이벤트 생성</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>이벤트 필터</CardTitle>
            <CardDescription>이벤트 타이틀, 카드 타이틀, 카드 하단 문구와 노출 상태로 목록을 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-[1fr_220px]">
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              검색
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="이벤트 타이틀, 카드 타이틀, 카드 하단 문구 검색"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              이벤트 상태
              <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
                {statusOptions.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>이벤트 목록</CardTitle>
              <CardDescription>썸네일, 노출 기간, 상세 이미지 등록 상태를 row/column 형태로 확인합니다.</CardDescription>
            </div>
            <Badge variant="slate">{filteredEvents.length.toLocaleString("ko-KR")}개 표시</Badge>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[1280px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[112px] whitespace-nowrap">썸네일</TableHead>
                  <TableHead className="whitespace-nowrap">이벤트 타이틀</TableHead>
                  <TableHead className="whitespace-nowrap">카드 하단 문구</TableHead>
                  <TableHead className="whitespace-nowrap">상태</TableHead>
                  <TableHead className="whitespace-nowrap">노출 시작일</TableHead>
                  <TableHead className="whitespace-nowrap">노출 종료일</TableHead>
                  {detailImageColumns.map((column) => <TableHead key={column.key} className="whitespace-nowrap text-center">{column.label}</TableHead>)}
                  <TableHead className="whitespace-nowrap">수정일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const detailHref = `/events/${event.id}`;

                  return (
                    <TableRow
                      key={event.id}
                      className="cursor-pointer"
                      role="link"
                      tabIndex={0}
                      onClick={() => router.push(detailHref)}
                      onKeyDown={(keyEvent) => {
                        if (keyEvent.key === "Enter" || keyEvent.key === " ") router.push(detailHref);
                      }}
                    >
                      <TableCell><img src={event.thumbnailImage} alt={`${event.title} 썸네일 이미지`} className="h-14 w-20 rounded-2xl object-cover" /></TableCell>
                      <TableCell>
                        <div className="min-w-[220px] py-1">
                          <span className="block whitespace-nowrap font-bold text-slate-900">{event.title}</span>
                          <span className="mt-1 block whitespace-nowrap text-xs font-semibold text-primary">{event.cardTitle}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[280px] text-sm text-slate-600"><span className="line-clamp-2 py-1">{event.cardBottomText}</span></TableCell>
                      <TableCell className="whitespace-nowrap"><Badge variant={eventStatusVariant(event.status)}>{event.status}</Badge></TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-slate-700">{event.startDate}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-semibold text-slate-700">{event.endDate}</TableCell>
                      {detailImageColumns.map((column) => (
                        <TableCell key={column.key} className="text-center"><div className="flex justify-center"><ImageStatusBadge registered={Boolean(event.detailImages[column.key])} /></div></TableCell>
                      ))}
                      <TableCell className="whitespace-nowrap text-sm text-slate-600">{event.updatedAt}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { CalendarDays, Eye, Pencil, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { events, eventStatusOptions, eventStatusVariant, type EventStatus } from "./data";

const statusOptions: Array<"전체" | EventStatus> = ["전체", ...eventStatusOptions];

export default function EventsPage() {
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
        description="웹사이트에 노출되는 이벤트를 생성, 수정, 관리합니다."
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

        <section className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.map((event) => {
            const detailHref = `/events/${event.id}`;

            return (
              <Card key={event.id} className="overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img src={event.thumbnailImage} alt={`${event.title} 썸네일 이미지`} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
                  <div className="absolute left-4 top-4"><Badge variant={eventStatusVariant(event.status)}>{event.status}</Badge></div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <CardTitle>{event.title}</CardTitle>
                      <CardDescription className="font-semibold text-primary">{event.cardTitle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="min-h-10 text-sm text-slate-600">{event.cardBottomText}</p>
                  <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-4 text-xs text-slate-500">
                    <div>
                      <dt className="flex items-center gap-1 font-bold text-slate-700"><CalendarDays className="h-3.5 w-3.5" />노출 시작일</dt>
                      <dd className="mt-1">{event.startDate}</dd>
                    </div>
                    <div>
                      <dt className="font-bold text-slate-700">노출 종료일</dt>
                      <dd className="mt-1">{event.endDate}</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="font-bold text-slate-700">수정일</dt>
                      <dd className="mt-1">{event.updatedAt}</dd>
                    </div>
                  </dl>
                  <div className="flex gap-2">
                    <Button asChild className="flex-1"><Link href={detailHref}><Eye className="h-4 w-4" />상세 보기</Link></Button>
                    <Button asChild variant="outline" className="flex-1"><Link href={detailHref}><Pencil className="h-4 w-4" />수정</Link></Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </div>
    </>
  );
}

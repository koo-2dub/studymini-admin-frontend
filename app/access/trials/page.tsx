import { AlertCircle, CalendarClock, FileUp, Plus, Search, UserPlus } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { trialCampaigns, type TrialPermissionStatus, type TrialStatus } from "./data";

const statusVariant: Record<TrialStatus, "default" | "success" | "warning" | "rose" | "slate"> = {
  예정: "warning",
  진행중: "success",
  종료: "slate",
  중단: "rose",
};

const permissionVariant: Record<TrialPermissionStatus, "default" | "success" | "warning" | "rose" | "slate"> = {
  정상: "success",
  "처리 예정": "warning",
  "만료 실패": "rose",
  "만료 완료": "slate",
};

export default function AccessTrialsPage() {
  const activeCount = trialCampaigns.filter((campaign) => campaign.status === "진행중").length;
  const upcomingCount = trialCampaigns.filter((campaign) => campaign.status === "예정").length;
  const failedCount = trialCampaigns.filter((campaign) => campaign.permissionStatus === "만료 실패").length;
  const totalParticipants = trialCampaigns.reduce((sum, campaign) => sum + campaign.participantCount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 관리"
        description="수강코드 없이 관리자가 직접 회원을 추가하고 기간 기반 체험 권한을 운영하는 mock UI입니다."
        action={
          <Link
            href="/access/trials/new"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <Plus className="h-4 w-4" />
            체험단 생성
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="전체 체험단" value={String(trialCampaigns.length)} change="Mock 캠페인" tone="indigo" />
        <StatCard label="진행중" value={String(activeCount)} change="권한 활성 대상" tone="emerald" />
        <StatCard label="시작 예정" value={String(upcomingCount)} change="시작일 대기" tone="amber" />
        <StatCard label="누적 참여자" value={`${totalParticipants}명`} change={`${failedCount}건 만료 확인 필요`} tone="rose" />
      </section>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-500" />
            <CardTitle>검색 / 필터</CardTitle>
          </div>
          <CardDescription>현재는 기능 연결 전이며, 입력 컨트롤은 화면 구조 확인용 placeholder입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(140px,1fr))]">
            <label className="text-sm font-bold text-slate-600">
              검색어
              <input className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" placeholder="체험단명, 담당자, 콘텐츠명" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              상태
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option>전체</option>
                <option>예정</option>
                <option>진행중</option>
                <option>종료</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              콘텐츠 유형
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none">
                <option>전체</option>
                <option>코스</option>
                <option>패키지</option>
                <option>혼합</option>
              </select>
            </label>
            <label className="text-sm font-bold text-slate-600">
              시작일
              <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </label>
            <label className="text-sm font-bold text-slate-600">
              종료일
              <input type="date" className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none" />
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm" disabled>검색 placeholder</Button>
            <Button size="sm" variant="outline" disabled>초기화 placeholder</Button>
            <Button size="sm" variant="outline" disabled><CalendarClock className="h-3.5 w-3.5" /> 종료 임박</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>체험단 목록</CardTitle>
              <CardDescription>체험단명, 상태, 참여 회원 수, 대상 콘텐츠와 권한 처리 상태를 한 번에 확인합니다.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" disabled><UserPlus className="h-3.5 w-3.5" /> 회원 검색 placeholder</Button>
              <Button variant="outline" size="sm" disabled><FileUp className="h-3.5 w-3.5" /> CSV 업로드 placeholder</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>체험단명</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>참여 회원</TableHead>
                <TableHead>대상 콘텐츠</TableHead>
                <TableHead>기간</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>권한 상태</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialCampaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <Link href={`/access/trials/${campaign.id}`} className="font-bold text-slate-950 hover:text-primary">
                      {campaign.name}
                    </Link>
                    <p className="mt-1 text-xs text-slate-500">{campaign.note}</p>
                  </TableCell>
                  <TableCell><Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge></TableCell>
                  <TableCell>
                    <p className="font-bold text-slate-900">{campaign.activeParticipantCount} / {campaign.participantCount}명</p>
                    <p className="text-xs text-slate-500">활성 / 전체</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-slate-800">{campaign.contentType}</p>
                    <p className="text-xs text-slate-500">{campaign.targetContents[0]}{campaign.targetContents.length > 1 ? ` 외 ${campaign.targetContents.length - 1}개` : ""}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-800">{campaign.startsAt} ~</p>
                    <p className="text-xs text-slate-500">{campaign.endsAt}</p>
                  </TableCell>
                  <TableCell>{campaign.manager}</TableCell>
                  <TableCell>
                    <Badge variant={permissionVariant[campaign.permissionStatus]}>
                      {campaign.permissionStatus === "만료 실패" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {campaign.permissionStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link href={`/access/trials/${campaign.id}`} className="text-sm font-bold text-primary hover:underline">상세</Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

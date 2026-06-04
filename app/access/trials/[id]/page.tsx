import { ArrowLeft, CalendarClock, FileDown, FileUp, RefreshCw, UserPlus } from "lucide-react";
import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  getTrialCampaign,
  trialLogs,
  trialParticipants,
  trialTargetContents,
  type TrialLog,
  type TrialParticipant,
  type TrialStatus,
} from "../data";

const statusVariant: Record<TrialStatus, "default" | "success" | "warning" | "rose" | "slate"> = {
  예정: "warning",
  진행중: "success",
  종료: "slate",
  중단: "rose",
};

const participantStatusVariant: Record<TrialParticipant["permissionStatus"], "default" | "success" | "warning" | "rose" | "slate"> = {
  예정: "warning",
  활성: "success",
  만료: "slate",
  연장됨: "default",
  실패: "rose",
};

const logVariant: Record<TrialLog["result"], "default" | "success" | "warning" | "rose" | "slate"> = {
  성공: "success",
  실패: "rose",
};

type TrialDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TrialDetailMockPage({ params }: TrialDetailPageProps) {
  const { id } = await params;
  const campaign = getTrialCampaign(id);
  const expiredCount = trialParticipants.filter((participant) => participant.permissionStatus === "만료").length;
  const failedCount = trialParticipants.filter((participant) => participant.permissionStatus === "실패").length;
  const extendedCount = trialParticipants.filter((participant) => participant.permissionStatus === "연장됨").length;

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title={campaign.name}
        description="기본 정보, 참여 회원, 대상 콘텐츠, 권한 상태, 로그를 한 화면에 배치한 mock 상세 화면입니다."
        action={
          <Link
            href="/access/trials"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label="상태" value={campaign.status} change="Mock 상태" tone="indigo" />
        <StatCard label="참여 회원" value={`${campaign.participantCount}명`} change={`${campaign.activeParticipantCount}명 활성`} tone="emerald" />
        <StatCard label="대상 콘텐츠" value={`${trialTargetContents.length}개`} change={campaign.contentType} tone="indigo" />
        <StatCard label="체험 기간" value="D-26" change={`${campaign.endsAt} 종료`} tone="amber" />
        <StatCard label="권한 처리" value={campaign.permissionStatus} change="placeholder" tone={failedCount > 0 ? "rose" : "emerald"} />
      </section>

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" disabled><UserPlus className="h-4 w-4" /> 회원 검색 placeholder</Button>
        <Button variant="outline" disabled><FileUp className="h-4 w-4" /> CSV 업로드 placeholder</Button>
        <Button variant="outline" disabled><CalendarClock className="h-4 w-4" /> 선택 회원 연장 placeholder</Button>
        <Button variant="outline" disabled><RefreshCw className="h-4 w-4" /> 만료 재처리 placeholder</Button>
        <Button variant="outline" disabled><FileDown className="h-4 w-4" /> 결과 다운로드 placeholder</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>기본 정보</CardTitle>
                  <CardDescription>캠페인 운영 정보와 기간 정책을 표시합니다.</CardDescription>
                </div>
                <Badge variant={statusVariant[campaign.status]}>{campaign.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-400">체험단명</dt><dd className="mt-1 font-semibold">{campaign.name}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-400">담당자</dt><dd className="mt-1 font-semibold">{campaign.manager}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-400">시작일</dt><dd className="mt-1 font-semibold">{campaign.startsAt}</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4"><dt className="text-xs font-bold uppercase text-slate-400">종료일</dt><dd className="mt-1 font-semibold">{campaign.endsAt} 23:59:59</dd></div>
                <div className="rounded-2xl bg-slate-50 p-4 md:col-span-2"><dt className="text-xs font-bold uppercase text-slate-400">관리자 메모</dt><dd className="mt-1 text-sm text-slate-700">{campaign.note}</dd></div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>참여 회원 목록</CardTitle>
              <CardDescription>회원 추가, CSV 업로드, 권한 지급 액션은 비활성 placeholder입니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>회원</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>추가 정보</TableHead>
                    <TableHead>권한 상태</TableHead>
                    <TableHead>개인 기간</TableHead>
                    <TableHead>관리</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialParticipants.map((participant) => (
                    <TableRow key={participant.id}>
                      <TableCell>
                        <p className="font-bold text-slate-900">{participant.name}</p>
                        <p className="text-xs text-slate-500">{participant.id}</p>
                      </TableCell>
                      <TableCell>
                        <p>{participant.email}</p>
                        <p className="text-xs text-slate-500">{participant.phone}</p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{participant.addMethod}</p>
                        <p className="text-xs text-slate-500">{participant.addedAt} 추가</p>
                      </TableCell>
                      <TableCell><Badge variant={participantStatusVariant[participant.permissionStatus]}>{participant.permissionStatus}</Badge></TableCell>
                      <TableCell>
                        <p>{participant.startsAt}</p>
                        <p className="text-xs text-slate-500">~ {participant.endsAt}</p>
                      </TableCell>
                      <TableCell className="space-x-2">
                        <Button size="sm" variant="ghost" disabled>연장</Button>
                        <Button size="sm" variant="ghost" disabled>제외</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대상 콘텐츠</CardTitle>
              <CardDescription>체험 기간 동안 권한을 부여할 코스와 패키지입니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>유형</TableHead>
                    <TableHead>콘텐츠명</TableHead>
                    <TableHead>콘텐츠 ID</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>카테고리</TableHead>
                    <TableHead>추가일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialTargetContents.map((content) => (
                    <TableRow key={content.id}>
                      <TableCell><Badge variant="default">{content.type}</Badge></TableCell>
                      <TableCell className="font-semibold">{content.name}</TableCell>
                      <TableCell>{content.id}</TableCell>
                      <TableCell><Badge variant={content.status === "공개" ? "success" : "warning"}>{content.status}</Badge></TableCell>
                      <TableCell>{content.category}</TableCell>
                      <TableCell>{content.addedAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로그</CardTitle>
              <CardDescription>시스템/관리자 이벤트를 감사 로그 형태로 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>발생일시</TableHead>
                    <TableHead>유형</TableHead>
                    <TableHead>내용</TableHead>
                    <TableHead>수행자</TableHead>
                    <TableHead>결과</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trialLogs.map((log) => (
                    <TableRow key={`${log.time}-${log.message}`}>
                      <TableCell>{log.time}</TableCell>
                      <TableCell><Badge variant="slate">{log.type}</Badge></TableCell>
                      <TableCell>{log.message}</TableCell>
                      <TableCell>{log.actor}</TableCell>
                      <TableCell><Badge variant={logVariant[log.result]}>{log.result}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>권한 / 만료 상태</CardTitle>
              <CardDescription>권한 지급은 실제 동작 없이 상태 카드로만 표현합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">활성 권한</span><strong>{campaign.activeParticipantCount}명</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">만료 완료</span><strong>{expiredCount}명</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">수동 연장</span><strong>{extendedCount}명</strong></div>
              <div className="flex justify-between"><span className="text-slate-500">처리 실패</span><strong className="text-rose-600">{failedCount}명</strong></div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                자동 만료, 일부 회원 연장, 실패 건 재처리는 실제 API 연결 전 placeholder 버튼으로만 제공합니다.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>운영 체크리스트</CardTitle>
              <CardDescription>상세 화면에서 확인할 운영 신호입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p>• 종료일 이후 체험단 출처 권한만 만료</p>
              <p>• 기존 구매/수동 지급 권한은 유지</p>
              <p>• 회원 제외/연장 작업은 로그 기록 필요</p>
              <p>• CSV 업로드 결과는 추후 미리보기 단계에서 검증</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Bell, CalendarClock, ClipboardList, FileSpreadsheet } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExportButton } from "../../export-button";
import {
  campaigns,
  expirationRate,
  formatNumber,
  formatPoints,
  getCampaignById,
  getCampaignExpiredMembers,
  getCampaignExpiringMembers,
  getExpirationSnapshot,
} from "../../data";

function statusVariant(status: string) {
  if (["진행중", "발송 완료"].includes(status)) return "success";
  if (["예정", "대기"].includes(status)) return "warning";
  if (["종료", "미발송"].includes(status)) return "rose";
  return "slate";
}

function summaryCard(label: string, value: string, helper?: string) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
      {helper && <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>}
    </div>
  );
}

function infoRow(label: string, value: React.ReactNode) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3 text-sm">
      <span className="font-semibold text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}

export function generateStaticParams() {
  return campaigns.map((campaign) => ({ campaignId: campaign.id }));
}

export default async function PointCampaignDetailPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const campaign = getCampaignById(campaignId);

  if (!campaign) notFound();

  const expiringMembers = getCampaignExpiringMembers(campaign.id);
  const expiredMembers = getCampaignExpiredMembers(campaign.id);
  const snapshot = getExpirationSnapshot(campaign.id);
  const rate = expirationRate(campaign);

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="기간제한 포인트 캠페인 상세"
        description="기간제한 포인트를 누구에게 지급했고, 누가 언제 얼마를 소멸 예정으로 보유 중인지 확인합니다."
        action={<Button asChild variant="secondary"><Link href="/points">포인트 목록으로</Link></Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.period} · {campaign.expirationRule}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge>
              <Badge variant="slate">{campaign.wallet}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCard("캠페인 상태", campaign.status, campaign.wallet)}
            {summaryCard("지급 대상 수", `${formatNumber(campaign.targetCount)}명`, "캠페인 타겟")}
            {summaryCard("지급 완료 수", `${formatNumber(campaign.issuedCount)}명`, `${Math.round((campaign.issuedCount / Math.max(campaign.targetCount, 1)) * 100)}% 지급 완료`)}
            {summaryCard("총 지급 포인트", formatPoints(campaign.amount), "누적 지급")}
            {summaryCard("사용 포인트", formatPoints(campaign.usedPoints), "회원 사용 완료")}
            {summaryCard("잔여 포인트", formatPoints(campaign.remainingPoints), "현재 미사용 잔액")}
            {summaryCard("만료 예정 포인트", formatPoints(campaign.expiringPoints), "운영 확인 대상")}
            {summaryCard("만료율", `${rate}%`, "총 지급 대비 만료 예정")}
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>캠페인 기본 정보</CardTitle>
              <CardDescription>운영자가 정책과 만료 기준을 빠르게 대조할 수 있는 정보입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {infoRow("캠페인명", campaign.name)}
              {infoRow("월렛", campaign.wallet)}
              {infoRow("지급 시작일", campaign.startDate)}
              {infoRow("지급 종료일", campaign.endDate)}
              {infoRow("만료 기준", campaign.expirationRule)}
              {infoRow("담당 정책", campaign.policy)}
              {infoRow("생성일", campaign.createdAt)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>소멸 현황</CardTitle>
              <CardDescription>이미 소멸된 포인트와 향후 소멸 예정 규모를 기간별로 집계합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {summaryCard("이미 소멸된 포인트", formatPoints(snapshot.expired), "시스템 소멸 처리 완료")}
              {summaryCard("7일 내 소멸 예정", formatPoints(snapshot.within7Days), "즉시 알림 우선순위")}
              {summaryCard("30일 내 소멸 예정", formatPoints(snapshot.within30Days), "대시보드 지표 연결")}
              {summaryCard("60일 내 소멸 예정", formatPoints(snapshot.within60Days), "장기 모니터링")}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div>
              <CardTitle>만료 예정 회원 목록</CardTitle>
              <CardDescription>회원별 현재 보유 포인트, 만료 예정 포인트, 알림 발송 여부를 확인합니다.</CardDescription>
            </div>
            <ExportButton
              filename={`${campaign.id}-expiring-members.csv`}
              label="만료 예정 회원 엑셀 다운로드"
              rows={expiringMembers.map((member) => ({
                이름: member.name,
                이메일: member.email,
                UserID: member.userId,
                현재보유포인트: member.currentPoints,
                만료예정포인트: member.expiringPoints,
                만료예정일: member.expiresAt,
                최근사용일: member.lastUsedAt,
                알림발송여부: member.notificationSent ? "발송 완료" : "미발송",
              }))}
            />
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>이름</TableHead><TableHead>이메일</TableHead><TableHead>User ID</TableHead><TableHead>현재 보유 포인트</TableHead><TableHead>만료 예정 포인트</TableHead><TableHead>만료 예정일</TableHead><TableHead>최근 사용일</TableHead><TableHead>알림 발송 여부</TableHead></TableRow></TableHeader>
              <TableBody>
                {expiringMembers.map((member) => (
                  <TableRow key={`${member.userId}-${member.expiresAt}`}>
                    <TableCell className="font-semibold">{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell><Link href={`/members/${member.userId}`} className="font-mono text-xs font-bold text-primary underline-offset-4 hover:underline">{member.userId}</Link></TableCell>
                    <TableCell>{formatPoints(member.currentPoints)}</TableCell>
                    <TableCell className="font-black text-rose-600">{formatPoints(member.expiringPoints)}</TableCell>
                    <TableCell>{member.expiresAt}</TableCell>
                    <TableCell>{member.lastUsedAt}</TableCell>
                    <TableCell><Badge variant={statusVariant(member.notificationSent ? "발송 완료" : "미발송")}>{member.notificationSent ? "발송 완료" : "미발송"}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader>
              <CardTitle>운영 액션</CardTitle>
              <CardDescription>실제 처리 없이 운영 흐름을 확인하는 Mock UI입니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ExportButton
                filename={`${campaign.id}-expiring-members.csv`}
                label="만료 예정 회원 엑셀 다운로드"
                rows={expiringMembers.map((member) => ({ 이름: member.name, 이메일: member.email, UserID: member.userId, 만료예정포인트: member.expiringPoints, 만료예정일: member.expiresAt }))}
                className="w-full"
              />
              <Button className="w-full" variant="secondary"><Bell className="mr-2 h-4 w-4" />알림 발송</Button>
              <Button className="w-full" variant="outline"><ClipboardList className="mr-2 h-4 w-4" />만료 처리 로그 보기</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              <div>
                <CardTitle>소멸 완료 회원 목록</CardTitle>
                <CardDescription>소멸 처리가 완료된 회원을 다운로드 대상으로 제공합니다.</CardDescription>
              </div>
              <ExportButton
                filename={`${campaign.id}-expired-members.csv`}
                label="소멸 완료 회원 엑셀 다운로드"
                rows={expiredMembers.map((member) => ({
                  이름: member.name,
                  이메일: member.email,
                  UserID: member.userId,
                  소멸포인트: member.expiredPoints,
                  소멸일시: member.expiredAt,
                  사유: member.reason,
                }))}
              />
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>이름</TableHead><TableHead>이메일</TableHead><TableHead>User ID</TableHead><TableHead>소멸 포인트</TableHead><TableHead>소멸 일시</TableHead><TableHead>사유</TableHead></TableRow></TableHeader>
                <TableBody>
                  {expiredMembers.length ? expiredMembers.map((member) => (
                    <TableRow key={`${member.userId}-${member.expiredAt}`}>
                      <TableCell className="font-semibold">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell><Link href={`/members/${member.userId}`} className="font-mono text-xs font-bold text-primary underline-offset-4 hover:underline">{member.userId}</Link></TableCell>
                      <TableCell className="font-black text-rose-600">{formatPoints(member.expiredPoints)}</TableCell>
                      <TableCell>{member.expiredAt}</TableCell>
                      <TableCell>{member.reason}</TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500">아직 소멸 완료 회원이 없습니다.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5 text-primary" />운영 메모</CardTitle>
            <CardDescription>만료 예정 회원 알림과 소멸 처리 로그는 추후 API 연동 전까지 Mock 상태로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm leading-6 text-indigo-900">
            <FileSpreadsheet className="mb-2 h-5 w-5" />
            엑셀 다운로드 버튼은 브라우저에서 열 수 있는 CSV 파일을 생성하며, 기간제한 포인트 운영 확인용 Mock 데이터 기준으로 동작합니다.
          </CardContent>
        </Card>
      </div>
    </>
  );
}

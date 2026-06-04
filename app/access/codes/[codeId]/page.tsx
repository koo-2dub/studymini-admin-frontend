import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, getAccessCodeCampaignById, usageRate } from "../data";

function statusVariant(value: string) {
  if (value === "진행중" || value === "미사용") return "success";
  if (value === "예정") return "warning";
  if (value === "폐기" || value === "만료") return "rose";
  return "slate";
}

export default async function AccessCodeDetailPage({ params }: { params: Promise<{ codeId: string }> }) {
  const { codeId } = await params;
  const campaign = getAccessCodeCampaignById(codeId);
  const rate = usageRate(campaign.usedCount, campaign.issuedCount);
  const unusedCount = campaign.issuedCount - campaign.usedCount;

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="수강코드 상세"
        description="B2B 수강코드 기본 정보, 사용 현황, 코드별 상태와 운영 로그를 확인합니다."
        action={<Button asChild variant="secondary"><Link href="/access/codes">목록으로</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
            <div className="space-y-2">
              <CardTitle>{campaign.name}</CardTitle>
              <CardDescription>{campaign.memo}</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge>
              <Badge variant="slate">{campaign.codeType}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">입력 가능 기간</p>
              <p className="mt-2 font-semibold text-slate-800">{campaign.availableStartDate} ~ {campaign.availableEndDate}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">권한 기간</p>
              <p className="mt-2 font-semibold text-slate-800">{campaign.accessPeriod}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">발급 / 사용 / 미사용</p>
              <p className="mt-2 font-semibold text-slate-800">{formatNumber(campaign.issuedCount)} / {formatNumber(campaign.usedCount)} / {formatNumber(unusedCount)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">사용률</p>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} />
              </div>
              <p className="mt-2 font-semibold text-slate-800">{rate}%</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>수강코드 운영 주체와 제한 정책입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <InfoRow label="기업/기관" value={campaign.organization} />
              <InfoRow label="코드 유형" value={campaign.codeType} />
              <InfoRow label="권한 시작 기준" value={campaign.accessStartBasis} />
              <InfoRow label="사용 제한" value={campaign.usageLimit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>대상 콘텐츠</CardTitle>
              <CardDescription>코드 입력 시 부여되는 코스 또는 패키지 권한입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaign.content.map((content) => (
                <div key={content.id} className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={content.type === "패키지" ? "default" : "slate"}>{content.type}</Badge>
                    <p className="font-bold text-slate-900">{content.title}</p>
                  </div>
                  <p className="mt-2 font-mono text-xs text-slate-500">{content.id}</p>
                  <p className="mt-1 text-sm text-slate-600">권장 기간: {content.duration}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>코드 사용 현황</CardTitle>
            <CardDescription>발급 수량 대비 사용 수량과 코드 상태별 운영 현황입니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-4">
            <MetricCard label="발급 수량" value={`${formatNumber(campaign.issuedCount)}개`} />
            <MetricCard label="사용 수량" value={`${formatNumber(campaign.usedCount)}개`} tone="text-primary" />
            <MetricCard label="미사용 수량" value={`${formatNumber(unusedCount)}개`} />
            <MetricCard label="사용률" value={`${rate}%`} tone="text-emerald-700" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용 회원 목록</CardTitle>
            <CardDescription>User ID를 클릭하면 회원 상세 mock link로 이동합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[980px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">이름</TableHead>
                  <TableHead className="whitespace-nowrap">이메일</TableHead>
                  <TableHead className="whitespace-nowrap">User ID</TableHead>
                  <TableHead className="whitespace-nowrap">입력한 코드</TableHead>
                  <TableHead className="whitespace-nowrap">권한 시작일</TableHead>
                  <TableHead className="whitespace-nowrap">권한 종료일</TableHead>
                  <TableHead className="whitespace-nowrap">사용일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.members.length > 0 ? campaign.members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-semibold text-slate-900">{member.name}</TableCell>
                    <TableCell className="text-slate-600">{member.email}</TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-primary">
                      <Link href={`/members/${member.userId}`} className="hover:underline">{member.userId}</Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-slate-600">{member.enteredCode}</TableCell>
                    <TableCell className="whitespace-nowrap">{member.accessStartDate}</TableCell>
                    <TableCell className="whitespace-nowrap">{member.accessEndDate}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{member.usedAt}</TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center text-sm font-semibold text-slate-500">아직 코드를 입력한 회원이 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>코드 목록</CardTitle>
            <CardDescription>개별 코드 또는 공용 코드의 상태를 미사용, 사용완료, 만료, 폐기로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-[840px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">코드</TableHead>
                  <TableHead className="whitespace-nowrap">상태</TableHead>
                  <TableHead className="whitespace-nowrap">사용 회원</TableHead>
                  <TableHead className="whitespace-nowrap">사용일</TableHead>
                  <TableHead className="whitespace-nowrap">메모</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaign.codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-mono text-xs font-semibold text-slate-900">{code.code}</TableCell>
                    <TableCell><Badge variant={statusVariant(code.status)}>{code.status}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{code.assignee ?? "-"}</TableCell>
                    <TableCell className="whitespace-nowrap text-slate-600">{code.usedAt ?? "-"}</TableCell>
                    <TableCell className="min-w-[220px] text-slate-600">{code.memo ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>운영 메모</CardTitle>
              <CardDescription>담당자 전달 방식, 회수 정책, 운영 주의사항입니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700">{campaign.operationMemo}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로그</CardTitle>
              <CardDescription>수강코드 생성, 수정, 사용 이벤트 mock 로그입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {campaign.logs.map((log) => (
                <div key={log.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{log.action}</p>
                    <span className="text-xs font-semibold text-slate-400">{log.createdAt}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{log.actor}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function MetricCard({ label, value, tone = "text-slate-900" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase text-slate-400">{label}</p>
      <p className={`mt-2 text-2xl font-black ${tone}`}>{value}</p>
    </div>
  );
}

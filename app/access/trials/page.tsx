import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { trialCampaigns } from "./data";

function statusVariant(value: string) {
  if (value === "진행중") return "success";
  if (value === "예정") return "warning";
  return "slate";
}

export default function AccessTrialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 관리"
        description="체험단 캠페인과 참여 회원의 수강 권한을 관리합니다."
      />
      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
          <div className="space-y-2">
            <CardTitle>체험단 캠페인</CardTitle>
            <CardDescription>체험단 생성, 상세 확인, 참여 회원 추가 UX를 확인할 수 있습니다.</CardDescription>
          </div>
          <Button asChild>
            <Link href="/access/trials/create">체험단 생성</Link>
          </Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[980px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">체험단명</TableHead>
                <TableHead className="whitespace-nowrap">상태</TableHead>
                <TableHead className="whitespace-nowrap">대상 콘텐츠</TableHead>
                <TableHead className="whitespace-nowrap">기간</TableHead>
                <TableHead className="whitespace-nowrap">참여 회원</TableHead>
                <TableHead className="whitespace-nowrap">담당</TableHead>
                <TableHead className="whitespace-nowrap">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialCampaigns.map((trial) => (
                <TableRow key={trial.id}>
                  <TableCell>
                    <div className="min-w-[220px]">
                      <p className="font-bold text-slate-900">{trial.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{trial.memo}</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant={statusVariant(trial.status)}>{trial.status}</Badge></TableCell>
                  <TableCell className="min-w-[240px] text-sm text-slate-600">
                    {trial.content.map((content) => `${content.type}: ${content.title}`).join(" / ")}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{trial.startDate} ~ {trial.endDate}</TableCell>
                  <TableCell className="whitespace-nowrap font-semibold">{trial.memberCount}명</TableCell>
                  <TableCell className="whitespace-nowrap">{trial.owner}</TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/access/trials/${trial.id}`}>상세 보기</Link>
                    </Button>
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

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
          <Table className="min-w-[860px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">체험단명</TableHead>
                <TableHead className="w-[96px] whitespace-nowrap">상태</TableHead>
                <TableHead className="whitespace-nowrap">참여 회원</TableHead>
                <TableHead className="whitespace-nowrap">대상 콘텐츠</TableHead>
                <TableHead className="whitespace-nowrap">기간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trialCampaigns.map((trial) => {
                const detailHref = `/access/trials/${trial.id}`;

                return (
                  <TableRow key={trial.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={detailHref} className="block min-w-[220px] py-1">
                        <span className="block font-bold text-slate-900">{trial.name}</span>
                        <span className="mt-1 block text-xs text-slate-500">{trial.memo}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="w-[96px] whitespace-nowrap">
                      <Link href={detailHref} className="block py-1">
                        <Badge variant={statusVariant(trial.status)} className="whitespace-nowrap">{trial.status}</Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold">
                      <Link href={detailHref} className="block py-1">{trial.memberCount}명</Link>
                    </TableCell>
                    <TableCell className="min-w-[240px] text-sm text-slate-600">
                      <Link href={detailHref} className="block py-1">
                        {trial.content.map((content) => `${content.type}: ${content.title}`).join(" / ")}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link href={detailHref} className="block py-1">{trial.startDate} ~ {trial.endDate}</Link>
                    </TableCell>
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

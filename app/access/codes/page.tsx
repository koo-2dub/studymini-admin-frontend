import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accessCodeCampaigns, formatNumber, usageRate } from "./data";

function statusVariant(value: string) {
  if (value === "진행중") return "success";
  if (value === "예정") return "warning";
  if (value === "폐기") return "rose";
  return "slate";
}

export default function AccessCodesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="수강코드 관리"
        description="B2B 수강코드 생성, 배포, 사용 현황을 관리합니다."
        action={<Button asChild variant="secondary"><Link href="/access/codes/create">수강코드 생성</Link></Button>}
      />
      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
          <div className="space-y-2">
            <CardTitle>B2B 수강코드 목록</CardTitle>
            <CardDescription>기업/기관 담당자에게 전달한 수강코드의 입력 기간, 권한 기간, 사용률을 확인합니다.</CardDescription>
          </div>
          <Badge variant="slate">Mock UI</Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1120px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">수강코드명</TableHead>
                <TableHead className="w-[96px] whitespace-nowrap">상태</TableHead>
                <TableHead className="whitespace-nowrap">코드 유형</TableHead>
                <TableHead className="whitespace-nowrap">대상 콘텐츠</TableHead>
                <TableHead className="whitespace-nowrap text-right">발급 수량</TableHead>
                <TableHead className="whitespace-nowrap text-right">사용 수량</TableHead>
                <TableHead className="whitespace-nowrap text-right">미사용 수량</TableHead>
                <TableHead className="whitespace-nowrap">사용률</TableHead>
                <TableHead className="whitespace-nowrap">입력 가능 기간</TableHead>
                <TableHead className="whitespace-nowrap">권한 기간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessCodeCampaigns.map((campaign) => {
                const detailHref = `/access/codes/${campaign.id}`;
                const unusedCount = campaign.issuedCount - campaign.usedCount;
                const rate = usageRate(campaign.usedCount, campaign.issuedCount);

                return (
                  <TableRow key={campaign.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={detailHref} className="block min-w-[240px] py-1">
                        <span className="block font-bold text-slate-900">{campaign.name}</span>
                        <span className="mt-1 block text-xs text-slate-500">{campaign.organization}</span>
                      </Link>
                    </TableCell>
                    <TableCell className="w-[96px] whitespace-nowrap">
                      <Link href={detailHref} className="block py-1"><Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge></Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-semibold text-slate-700">
                      <Link href={detailHref} className="block py-1">{campaign.codeType}</Link>
                    </TableCell>
                    <TableCell className="min-w-[240px] text-sm text-slate-600">
                      <Link href={detailHref} className="block py-1">
                        {campaign.content.map((content) => `${content.type}: ${content.title}`).join(" / ")}
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold">
                      <Link href={detailHref} className="block py-1">{formatNumber(campaign.issuedCount)}</Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-primary">
                      <Link href={detailHref} className="block py-1">{formatNumber(campaign.usedCount)}</Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right font-semibold text-slate-600">
                      <Link href={detailHref} className="block py-1">{formatNumber(unusedCount)}</Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link href={detailHref} className="block min-w-[120px] py-1">
                        <div className="h-2 rounded-full bg-slate-100">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="mt-1 block text-xs font-bold text-slate-600">{rate}%</span>
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-600">
                      <Link href={detailHref} className="block py-1">{campaign.availableStartDate} ~ {campaign.availableEndDate}</Link>
                    </TableCell>
                    <TableCell className="min-w-[220px] text-sm text-slate-600">
                      <Link href={detailHref} className="block py-1">{campaign.accessPeriod}</Link>
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

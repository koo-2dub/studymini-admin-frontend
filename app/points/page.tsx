"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Coins, FileSpreadsheet, MinusCircle, PlusCircle, Search, Settings, ShieldAlert } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ExportButton } from "./export-button";
import { campaignPurposes, campaigns, formatNumber, formatPoints, pointTypes, type PointCampaignPurpose, type PointType } from "./data";

type PointTab = "dashboard" | "policy" | "campaigns" | "manual" | "logs";
type AdjustmentMode = "개별 지급" | "CSV 지급" | "개별 차감" | "CSV 차감" | "SET";
type PointLogType = "전체" | "지급" | "차감" | "SET" | "사용" | "소멸";
type PointMethod = "전체" | "캠페인" | "관리자" | "CSV" | "주문" | "배치";
type PointTypeFilter = "전체" | PointType;
type PurposeFilter = "전체" | PointCampaignPurpose;

type PointLog = {
  id: string;
  date: string;
  member: string;
  email: string;
  userId: string;
  campaign: string;
  campaignCode: string;
  pointType: PointType;
  type: Exclude<PointLogType, "전체">;
  method: Exclude<PointMethod, "전체">;
  amount: string;
  balance: string;
  expiresAt: string;
  orderNo: string;
  admin: string;
  reason: string;
};

const tabs: { id: PointTab; label: string; description: string }[] = [
  { id: "dashboard", label: "대시보드", description: "오늘 포인트 흐름" },
  { id: "policy", label: "포인트 정책", description: "사용·소멸 공통 정책" },
  { id: "campaigns", label: "포인트 캠페인", description: "지급·사용·잔여·소멸 관리" },
  { id: "manual", label: "수동 지급/차감", description: "CS·오지급 예외 처리" },
  { id: "logs", label: "포인트 로그", description: "전체 변동 이력" },
];

const adjustmentModes: AdjustmentMode[] = ["개별 지급", "CSV 지급", "개별 차감", "CSV 차감", "SET"];
const pointTypeOptions: PointTypeFilter[] = ["전체", ...pointTypes];
const purposeOptions: PurposeFilter[] = ["전체", ...campaignPurposes];
const logTypeOptions: PointLogType[] = ["전체", "지급", "차감", "SET", "사용", "소멸"];
const methodOptions: PointMethod[] = ["전체", "캠페인", "관리자", "CSV", "주문", "배치"];

const selectedMembers = [
  { member: "지윤 김", email: "jiyoon.kim@example.com", pointType: "일반 포인트", current: "4,850P", amount: "5,000P", after: "9,850P", status: "검증 완료" },
  { member: "민서 박", email: "minseo.park@example.com", pointType: "일반 포인트", current: "300P", amount: "5,000P", after: "5,300P", status: "검증 완료" },
];

const csvPreview = [
  { row: 2, member: "SM-1024", email: "jiyoon.kim@example.com", pointType: "일반 포인트", amount: "3,000P", status: "성공", reason: "-" },
  { row: 3, member: "SM-1021", email: "sora.choi@example.com", pointType: "기간제 포인트", amount: "2,000P", status: "성공", reason: "-" },
  { row: 4, member: "SM-9999", email: "unknown@example.com", pointType: "일반 포인트", amount: "1,000P", status: "실패", reason: "회원을 찾을 수 없습니다." },
];

const pointLogs: PointLog[] = [
  { id: "PL-1048", date: "2026-06-04 10:24", member: "지윤 김", email: "jiyoon.kim@example.com", userId: "SM-1024", campaign: "CS 예외 처리", campaignCode: "-", pointType: "일반 포인트", type: "지급", method: "관리자", amount: "+5,000P", balance: "9,850P", expiresAt: "2027-06-04", orderNo: "-", admin: "관리자 김민수", reason: "CS 보상" },
  { id: "PL-1047", date: "2026-06-04 09:18", member: "민서 박", email: "minseo.park@example.com", userId: "SM-1023", campaign: "환급 이벤트 포인트", campaignCode: "POINT-REFUND-202606", pointType: "기간제 포인트", type: "지급", method: "캠페인", amount: "+3,000P", balance: "3,300P", expiresAt: "2026-07-31", orderNo: "-", admin: "campaign", reason: "환급 이벤트" },
  { id: "PL-1046", date: "2026-06-03 17:42", member: "Noah Park", email: "noah.park@example.com", userId: "SM-1022", campaign: "6월 복귀 회원 리워드", campaignCode: "POINT-RETURN-202606", pointType: "기간제 포인트", type: "차감", method: "관리자", amount: "-1,000P", balance: "2,300P", expiresAt: "2026-06-30", orderNo: "-", admin: "관리자 박서연", reason: "오지급 정정" },
  { id: "PL-1045", date: "2026-06-03 14:05", member: "Sora Choi", email: "sora.choi@example.com", userId: "SM-1021", campaign: "테스트 데이터 정리", campaignCode: "-", pointType: "일반 포인트", type: "SET", method: "관리자", amount: "0P로 조정", balance: "0P", expiresAt: "-", orderNo: "-", admin: "관리자 김민수", reason: "테스트 데이터 정리" },
  { id: "PL-1044", date: "2026-06-02 12:31", member: "Daniel Wu", email: "daniel.wu@example.com", userId: "SM-1020", campaign: "주문 사용", campaignCode: "-", pointType: "기간제 포인트", type: "사용", method: "주문", amount: "-2,500P", balance: "7,100P", expiresAt: "2026-06-30", orderNo: "ORD-20260602-014", admin: "주문 시스템", reason: "주문 사용 · 기간제 우선 차감" },
  { id: "PL-1043", date: "2026-06-01 00:00", member: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", campaign: "리뷰 작성 감사 포인트", campaignCode: "POINT-REVIEW-THANKS-202605", pointType: "일반 포인트", type: "소멸", method: "배치", amount: "-1,200P", balance: "0P", expiresAt: "2026-06-01", orderNo: "-", admin: "batch", reason: "유효기간 만료" },
];

const policyRows = [
  ["최대 사용 가능 비율", "주문금액의 20%", "전체 사용 가능 포인트 기준으로 한도 계산"],
  ["최소 사용 가능 포인트", "1,000P", "회원이 주문에서 사용할 수 있는 최소 단위"],
  ["일반 포인트 유효기간 기본값", "지급일 기준 12개월", "캠페인 생성 시 정책 기본값으로 선택 가능"],
  ["소멸 알림 기준", "D-30, D-7, D-1", "알림 발송 최소 포인트 500P"],
  ["차감 우선순위", "기간제 포인트 → 일반 포인트", "기간제 포인트를 먼저 사용"],
];

function statusVariant(status: string) {
  if (["진행중", "성공", "검증 완료", "지급", "발송 완료"].includes(status)) return "success";
  if (["예정", "SET", "정책 기본", "미발송"].includes(status) || status.startsWith("D-")) return "warning";
  if (["실패", "차감", "소멸", "종료"].includes(status)) return "rose";
  return "slate";
}

function FilterInput({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm font-semibold text-slate-700">
      {label}
      {children}
    </label>
  );
}

export default function PointsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<PointTab>("campaigns");
  const [adjustmentMode, setAdjustmentMode] = useState<AdjustmentMode>("개별 지급");
  const [memberQuery, setMemberQuery] = useState("");
  const [campaignQuery, setCampaignQuery] = useState("");
  const [pointTypeFilter, setPointTypeFilter] = useState<PointTypeFilter>("전체");
  const [purposeFilter, setPurposeFilter] = useState<PurposeFilter>("전체");
  const [typeFilter, setTypeFilter] = useState<PointLogType>("전체");
  const [methodFilter, setMethodFilter] = useState<PointMethod>("전체");
  const [orderQuery, setOrderQuery] = useState("");
  const [adminQuery, setAdminQuery] = useState("");

  const filteredCampaigns = useMemo(() => {
    const query = campaignQuery.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesQuery = !query || `${campaign.name} ${campaign.code}`.toLowerCase().includes(query);
      const matchesPurpose = purposeFilter === "전체" || campaign.purpose === purposeFilter;
      const matchesType = pointTypeFilter === "전체" || campaign.pointType === pointTypeFilter;

      return matchesQuery && matchesPurpose && matchesType;
    });
  }, [campaignQuery, pointTypeFilter, purposeFilter]);

  const filteredLogs = useMemo(() => {
    const normalizedMember = memberQuery.trim().toLowerCase();
    const normalizedCampaign = campaignQuery.trim().toLowerCase();
    const normalizedOrder = orderQuery.trim().toLowerCase();
    const normalizedAdmin = adminQuery.trim().toLowerCase();

    return pointLogs.filter((log) => {
      const matchesMember = !normalizedMember || `${log.member} ${log.email} ${log.userId}`.toLowerCase().includes(normalizedMember);
      const matchesCampaign = !normalizedCampaign || `${log.campaign} ${log.campaignCode}`.toLowerCase().includes(normalizedCampaign);
      const matchesPointType = pointTypeFilter === "전체" || log.pointType === pointTypeFilter;
      const matchesType = typeFilter === "전체" || log.type === typeFilter;
      const matchesMethod = methodFilter === "전체" || log.method === methodFilter;
      const matchesOrder = !normalizedOrder || log.orderNo.toLowerCase().includes(normalizedOrder);
      const matchesAdmin = !normalizedAdmin || log.admin.toLowerCase().includes(normalizedAdmin);

      return matchesMember && matchesCampaign && matchesPointType && matchesType && matchesMethod && matchesOrder && matchesAdmin;
    });
  }, [adminQuery, campaignQuery, memberQuery, methodFilter, orderQuery, pointTypeFilter, typeFilter]);

  const isCsvMode = adjustmentMode.includes("CSV");
  const isSetMode = adjustmentMode === "SET";
  const operationLabel = adjustmentMode.replace("개별 ", "").replace("CSV ", "");

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 관리"
        description="포인트 지급 캠페인, 수동 예외 처리, 사용·차감·소멸 로그를 운영 흐름 중심으로 관리합니다."
        action={<Button variant="secondary">포인트 로그 다운로드</Button>}
      />

      <div className="space-y-6">
        <Card>
          <CardContent className="grid gap-3 p-3 md:grid-cols-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-all",
                  activeTab === tab.id
                    ? "border-indigo-200 bg-primary text-white shadow-glow"
                    : "border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50",
                )}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                <p className="text-sm font-black">{tab.label}</p>
                <p className={cn("mt-1 text-xs", activeTab === tab.id ? "text-indigo-100" : "text-slate-500")}>{tab.description}</p>
              </button>
            ))}
          </CardContent>
        </Card>

        {activeTab === "dashboard" && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="오늘 지급 포인트" value="128K P" change="캠페인·수동 지급 합산" tone="emerald" />
            <StatCard label="오늘 사용 포인트" value="84K P" change="주문 사용 완료" tone="indigo" />
            <StatCard label="오늘 차감 포인트" value="12K P" change="관리자 차감·SET 감소" tone="amber" />
            <StatCard label="오늘 소멸 포인트" value="32K P" change="배치 소멸 완료" tone="rose" />
          </div>
        )}

        {activeTab === "policy" && (
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>포인트 정책</CardTitle>
                  <CardDescription>신규가입 지급 포인트는 캠페인에서 관리하고, 정책 화면에는 공통 사용·소멸 기준만 표시합니다.</CardDescription>
                </div>
                <Button onClick={() => router.push("/points/policy/edit")} type="button">정책 수정</Button>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                {policyRows.map(([label, value, helper]) => (
                  <div key={label} className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-bold text-slate-500">{label}</p>
                    <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{helper}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />포인트 사용 정책 설명</CardTitle>
                <CardDescription>일반/기간제 포인트를 합산한 전체 사용 가능 포인트 기준으로 한도를 계산합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm font-semibold leading-7 text-slate-700">
                <p className="rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900">
                  포인트 사용 한도는 일반/기간제 포인트별로 따로 계산하지 않고, 회원의 전체 사용 가능 포인트를 기준으로 계산합니다.
                </p>
                <div className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="font-black text-slate-950">차감 순서</p>
                  <ol className="mt-2 list-decimal space-y-1 pl-5">
                    <li>기간제 포인트</li>
                    <li>일반 포인트</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>포인트 캠페인 필터</CardTitle>
                <CardDescription>포인트 지급 캠페인의 지급, 사용, 잔여, 소멸 현황을 목적과 포인트 유형별로 조회합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-4">
                <FilterInput label="캠페인명/코드">
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="캠페인명 또는 코드" value={campaignQuery} onChange={(event) => setCampaignQuery(event.target.value)} />
                  </div>
                </FilterInput>
                <FilterInput label="캠페인 목적"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={purposeFilter} onChange={(event) => setPurposeFilter(event.target.value as PurposeFilter)}>{purposeOptions.map((option) => <option key={option}>{option}</option>)}</select></FilterInput>
                <FilterInput label="포인트 유형"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={pointTypeFilter} onChange={(event) => setPointTypeFilter(event.target.value as PointTypeFilter)}>{pointTypeOptions.map((option) => <option key={option}>{option}</option>)}</select></FilterInput>
                <FilterInput label="지급 기간"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-01 ~ 2026-07-31" /></FilterInput>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>포인트 캠페인</CardTitle>
                  <CardDescription>포인트 지급 캠페인의 지급, 사용, 잔여, 소멸 현황을 관리합니다.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ExportButton
                    filename="point-campaigns.csv"
                    label="캠페인 목록 엑셀 다운로드"
                    rows={filteredCampaigns.map((campaign) => ({
                      캠페인ID: campaign.id,
                      캠페인명: campaign.name,
                      캠페인코드: campaign.code,
                      목적: campaign.purpose,
                      상태: campaign.status,
                      포인트유형: campaign.pointType,
                      지급시작일: campaign.startDate,
                      지급종료일: campaign.endDate,
                      지급대상수: campaign.targetCount,
                      지급완료수: campaign.issuedCount,
                      지급실패수: campaign.failedCount,
                      총지급포인트: campaign.amount,
                      사용포인트: campaign.usedPoints,
                      잔여포인트: campaign.remainingPoints,
                      만료일또는유효기간: campaign.expires,
                      지급기간: campaign.period,
                    }))}
                  />
                  <Button onClick={() => router.push("/points/campaigns/create")} type="button">포인트 캠페인 생성</Button>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="whitespace-nowrap">캠페인명</TableHead><TableHead className="whitespace-nowrap">목적</TableHead><TableHead className="whitespace-nowrap">포인트 유형</TableHead><TableHead className="whitespace-nowrap">상태</TableHead><TableHead className="whitespace-nowrap">대상자</TableHead><TableHead className="whitespace-nowrap">완료</TableHead><TableHead className="whitespace-nowrap">실패</TableHead><TableHead className="whitespace-nowrap">총 지급 포인트</TableHead><TableHead className="whitespace-nowrap">사용 포인트</TableHead><TableHead className="whitespace-nowrap">잔여 포인트</TableHead><TableHead className="whitespace-nowrap">만료일/유효기간</TableHead><TableHead className="whitespace-nowrap">지급 기간</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="cursor-pointer transition-colors hover:bg-indigo-50/70" onClick={() => router.push(`/points/campaigns/${campaign.id}`)}>
                        <TableCell className="whitespace-nowrap font-semibold text-primary">{campaign.name}<p className="font-mono text-xs font-normal text-slate-500">{campaign.code}</p></TableCell>
                        <TableCell className="whitespace-nowrap"><Badge variant="slate">{campaign.purpose}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap">{campaign.pointType}</TableCell>
                        <TableCell className="whitespace-nowrap"><Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap">{formatNumber(campaign.targetCount)}명</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-emerald-700">{formatNumber(campaign.issuedCount)}명</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-rose-600">{formatNumber(campaign.failedCount)}명</TableCell>
                        <TableCell className="whitespace-nowrap font-black">{formatPoints(campaign.amount)}</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-indigo-700">{formatPoints(campaign.usedPoints)}</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold text-slate-800">{formatPoints(campaign.remainingPoints)}</TableCell>
                        <TableCell className="whitespace-nowrap">{campaign.expires}</TableCell>
                        <TableCell className="whitespace-nowrap">{campaign.period}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "manual" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>수동 지급/차감</CardTitle>
                <CardDescription>CS 보상, 오지급 정정, 테스트 데이터 정리 등 캠페인이 아닌 예외 업무를 처리합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-5">
                {adjustmentModes.map((mode) => (
                  <button key={mode} className={cn("rounded-2xl border p-4 text-sm font-black transition-all", adjustmentMode === mode ? "border-indigo-200 bg-primary text-white shadow-glow" : "border-slate-100 bg-white hover:bg-indigo-50")} onClick={() => setAdjustmentMode(mode)} type="button">
                    {mode}
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isCsvMode ? <FileSpreadsheet className="h-5 w-5 text-primary" /> : isSetMode ? <ShieldAlert className="h-5 w-5 text-primary" /> : operationLabel === "지급" ? <PlusCircle className="h-5 w-5 text-primary" /> : <MinusCircle className="h-5 w-5 text-primary" />}
                    {adjustmentMode} 입력
                  </CardTitle>
                  <CardDescription>모든 수동 처리에는 사유가 필수이며, SET은 실행 전 확인이 필요한 위험 작업입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCsvMode ? (
                    <div className="rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/60 p-6 text-center">
                      <FileSpreadsheet className="mx-auto h-10 w-10 text-primary" />
                      <p className="mt-3 text-sm font-black">CSV 파일 업로드</p>
                      <p className="mt-1 text-xs text-slate-500">member_id, email, point_type, amount 컬럼을 사용하는 수동 처리 템플릿입니다.</p>
                      <Button className="mt-4" variant="secondary">CSV 템플릿 다운로드</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FilterInput label="회원 검색">
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="회원명, 이메일, User ID" />
                        </div>
                      </FilterInput>
                      <Button variant="secondary" className="w-full">회원 추가</Button>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FilterInput label="포인트 유형"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="일반 포인트">{pointTypes.map((type) => <option key={type}>{type}</option>)}</select></FilterInput>
                    <FilterInput label={isSetMode ? "SET 목표 잔액" : "포인트"}><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={isSetMode ? "0" : "5000"} /></FilterInput>
                  </div>

                  {isSetMode && (
                    <div className="space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
                      <div className="flex items-center gap-2 font-black text-rose-900"><AlertTriangle className="h-5 w-5" />SET은 잔액을 직접 변경하는 위험 작업입니다. 실행 전 확인이 필요합니다.</div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div><p className="text-xs font-bold text-rose-700">현재 잔액</p><p className="mt-1 text-2xl font-black text-slate-950">4,850P</p></div>
                        <div><p className="text-xs font-bold text-rose-700">변경 후 잔액</p><p className="mt-1 text-2xl font-black text-slate-950">0P</p></div>
                        <div><p className="text-xs font-bold text-rose-700">변경 포인트</p><p className="mt-1 text-2xl font-black text-rose-600">-4,850P</p></div>
                      </div>
                      <label className="flex items-start gap-2 text-sm font-bold text-rose-900"><input className="mt-1" type="checkbox" />위험 작업임을 확인했으며 실행 전 최종 확인 모달을 표시합니다.</label>
                    </div>
                  )}

                  <FilterInput label="처리 사유"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="CS 보상"><option>CS 보상</option><option>오지급 정정</option><option>테스트 데이터 정리</option><option>기타</option></select></FilterInput>
                  <FilterInput label="상세 사유"><textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" defaultValue={`${adjustmentMode} 처리를 위한 필수 운영자 입력 사유입니다.`} /></FilterInput>
                  <Button className="w-full">검증 후 {operationLabel} 실행 전 확인</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isCsvMode ? "CSV 검증 미리보기" : "대상 회원 미리보기"}</CardTitle>
                  <CardDescription>성공/실패와 처리 후 잔액을 실행 전 확인합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-x-auto">
                  {isCsvMode && <div className="grid gap-3 md:grid-cols-3"><div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">성공</p><p className="text-2xl font-black">2건</p></div><div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-bold text-rose-700">실패</p><p className="text-2xl font-black">1건</p></div><div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">예상 처리</p><p className="text-2xl font-black">5,000P</p></div></div>}
                  <Table>
                    <TableHeader>{isCsvMode ? <TableRow><TableHead>행</TableHead><TableHead>회원</TableHead><TableHead>포인트 유형</TableHead><TableHead>포인트</TableHead><TableHead>상태</TableHead><TableHead>실패 사유</TableHead></TableRow> : <TableRow><TableHead>회원</TableHead><TableHead>포인트 유형</TableHead><TableHead>현재</TableHead><TableHead>{operationLabel}</TableHead><TableHead>처리 후</TableHead><TableHead>상태</TableHead></TableRow>}</TableHeader>
                    <TableBody>
                      {isCsvMode ? csvPreview.map((row) => <TableRow key={row.row}><TableCell>{row.row}</TableCell><TableCell className="font-semibold">{row.member}<p className="text-xs font-normal text-slate-500">{row.email}</p></TableCell><TableCell>{row.pointType}</TableCell><TableCell>{row.amount}</TableCell><TableCell><Badge variant={statusVariant(row.status)}>{row.status}</Badge></TableCell><TableCell>{row.reason}</TableCell></TableRow>) : selectedMembers.map((row) => <TableRow key={row.email}><TableCell className="font-semibold">{row.member}<p className="text-xs font-normal text-slate-500">{row.email}</p></TableCell><TableCell>{row.pointType}</TableCell><TableCell>{row.current}</TableCell><TableCell>{isSetMode ? "0P" : row.amount}</TableCell><TableCell>{isSetMode ? "0P" : row.after}</TableCell><TableCell><Badge variant="success">{row.status}</Badge></TableCell></TableRow>)}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>포인트 로그 필터</CardTitle>
                <CardDescription>회원, 캠페인, 포인트 유형, 처리 유형, 처리 방식, 기간, 주문번호, 관리자를 기준으로 조회합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-4">
                <FilterInput label="회원명/이메일/User ID"><div className="relative mt-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="회원명, 이메일, User ID" value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} /></div></FilterInput>
                <FilterInput label="캠페인명/코드"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" placeholder="캠페인명 또는 코드" value={campaignQuery} onChange={(event) => setCampaignQuery(event.target.value)} /></FilterInput>
                <FilterInput label="포인트 유형"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={pointTypeFilter} onChange={(event) => setPointTypeFilter(event.target.value as PointTypeFilter)}>{pointTypeOptions.map((option) => <option key={option}>{option}</option>)}</select></FilterInput>
                <FilterInput label="처리 유형"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as PointLogType)}>{logTypeOptions.map((option) => <option key={option}>{option}</option>)}</select></FilterInput>
                <FilterInput label="처리 방식"><select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={methodFilter} onChange={(event) => setMethodFilter(event.target.value as PointMethod)}>{methodOptions.map((option) => <option key={option}>{option}</option>)}</select></FilterInput>
                <FilterInput label="기간"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-01 ~ 2026-06-04" /></FilterInput>
                <FilterInput label="주문번호"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" placeholder="ORD-" value={orderQuery} onChange={(event) => setOrderQuery(event.target.value)} /></FilterInput>
                <FilterInput label="관리자"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" placeholder="관리자명 또는 시스템" value={adminQuery} onChange={(event) => setAdminQuery(event.target.value)} /></FilterInput>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>포인트 로그</CardTitle>
                  <CardDescription>총 {filteredLogs.length}건의 포인트 변동 이력이 표시됩니다.</CardDescription>
                </div>
                <ExportButton filename="point-logs.csv" label="로그 엑셀 다운로드" rows={filteredLogs.map((log) => ({ 일시: log.date, 회원: log.member, 캠페인: log.campaign, 포인트유형: log.pointType, 처리유형: log.type, 처리방식: log.method, 변동포인트: log.amount, 잔액: log.balance, 만료일: log.expiresAt, 사유: log.reason }))} />
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>일시</TableHead><TableHead>회원</TableHead><TableHead>캠페인</TableHead><TableHead>포인트 유형</TableHead><TableHead>처리 유형</TableHead><TableHead>처리 방식</TableHead><TableHead>변동 포인트</TableHead><TableHead>잔액</TableHead><TableHead>만료일</TableHead><TableHead>사유</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="whitespace-nowrap">{log.date}</TableCell>
                        <TableCell className="whitespace-nowrap font-semibold">{log.member}<p className="text-xs font-normal text-slate-500">{log.email} · {log.userId}</p></TableCell>
                        <TableCell className="whitespace-nowrap">{log.campaign}<p className="font-mono text-xs text-slate-500">{log.campaignCode}</p></TableCell>
                        <TableCell className="whitespace-nowrap">{log.pointType}</TableCell>
                        <TableCell className="whitespace-nowrap"><Badge variant={statusVariant(log.type)}>{log.type}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap">{log.method}</TableCell>
                        <TableCell className={cn("whitespace-nowrap font-black", log.amount.startsWith("+") ? "text-emerald-600" : log.amount.startsWith("-") ? "text-rose-600" : "text-slate-700")}>{log.amount}</TableCell>
                        <TableCell className="whitespace-nowrap">{log.balance}</TableCell>
                        <TableCell className="whitespace-nowrap">{log.expiresAt}</TableCell>
                        <TableCell className="whitespace-nowrap">{log.reason}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}

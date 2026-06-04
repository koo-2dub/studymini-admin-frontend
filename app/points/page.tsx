"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CalendarDays, Coins, FileSpreadsheet, MinusCircle, PlusCircle, Search, Settings, SlidersHorizontal } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ExportButton } from "./export-button";
import { campaigns, expiringPoints, formatNumber, formatPoints, type PointWallet } from "./data";

type PointTab = "dashboard" | "policy" | "limited" | "adjust" | "logs";
type AdjustmentMode = "개별 지급" | "CSV 지급" | "개별 차감" | "CSV 차감" | "SET";
type PointLogType = "전체" | "지급" | "차감" | "SET" | "적립" | "사용" | "소멸";
type WalletFilter = "전체" | PointWallet;

type PointLog = {
  id: string;
  member: string;
  email: string;
  wallet: Exclude<WalletFilter, "전체">;
  type: Exclude<PointLogType, "전체">;
  method: "관리자" | "CSV" | "주문" | "시스템";
  amount: string;
  balance: string;
  reason: string;
  admin: string;
  date: string;
};

const tabs: { id: PointTab; label: string; description: string }[] = [
  { id: "dashboard", label: "대시보드", description: "포인트 운영 현황" },
  { id: "policy", label: "포인트 정책", description: "기본/소멸 정책" },
  { id: "limited", label: "기간제한 포인트", description: "캠페인 관리" },
  { id: "adjust", label: "지급/차감", description: "개별·CSV·SET" },
  { id: "logs", label: "포인트 로그", description: "변동 이력 조회" },
];

const adjustmentModes: AdjustmentMode[] = ["개별 지급", "CSV 지급", "개별 차감", "CSV 차감", "SET"];
const walletOptions: WalletFilter[] = ["전체", "일반 포인트", "이벤트 포인트", "기간제 포인트"];
const logTypeOptions: PointLogType[] = ["전체", "지급", "차감", "SET", "적립", "사용", "소멸"];

const selectedMembers = [
  { member: "지윤 김", email: "jiyoon.kim@example.com", wallet: "일반 포인트", current: "4,850P", amount: "5,000P", after: "9,850P", status: "검증 완료" },
  { member: "민서 박", email: "minseo.park@example.com", wallet: "일반 포인트", current: "300P", amount: "5,000P", after: "5,300P", status: "검증 완료" },
];

const csvPreview = [
  { row: 2, member: "SM-1024", email: "jiyoon.kim@example.com", wallet: "일반 포인트", amount: "3,000P", status: "성공", reason: "-" },
  { row: 3, member: "SM-1021", email: "sora.choi@example.com", wallet: "이벤트 포인트", amount: "2,000P", status: "성공", reason: "-" },
  { row: 4, member: "SM-9999", email: "unknown@example.com", wallet: "일반 포인트", amount: "1,000P", status: "실패", reason: "회원을 찾을 수 없습니다." },
];

const pointLogs: PointLog[] = [
  { id: "PL-1048", member: "지윤 김", email: "jiyoon.kim@example.com", wallet: "일반 포인트", type: "지급", method: "관리자", amount: "+5,000P", balance: "9,850P", reason: "CS 보상", admin: "Admin Kim", date: "2026-06-04 10:24" },
  { id: "PL-1047", member: "민서 박", email: "minseo.park@example.com", wallet: "일반 포인트", type: "지급", method: "CSV", amount: "+3,000P", balance: "3,300P", reason: "이벤트 지급", admin: "Admin Lee", date: "2026-06-04 09:18" },
  { id: "PL-1046", member: "Noah Park", email: "noah.park@example.com", wallet: "기간제 포인트", type: "차감", method: "관리자", amount: "-1,000P", balance: "2,300P", reason: "오지급 정정", admin: "Admin Park", date: "2026-06-03 17:42" },
  { id: "PL-1045", member: "Sora Choi", email: "sora.choi@example.com", wallet: "이벤트 포인트", type: "SET", method: "관리자", amount: "0P로 조정", balance: "0P", reason: "테스트 데이터 정리", admin: "Admin Kim", date: "2026-06-03 14:05" },
  { id: "PL-1044", member: "Daniel Wu", email: "daniel.wu@example.com", wallet: "일반 포인트", type: "사용", method: "주문", amount: "-2,500P", balance: "7,100P", reason: "주문 사용", admin: "System", date: "2026-06-02 12:31" },
  { id: "PL-1043", member: "Mina Lee", email: "mina.lee@example.com", wallet: "기간제 포인트", type: "소멸", method: "시스템", amount: "-1,200P", balance: "0P", reason: "유효기간 만료", admin: "System", date: "2026-06-01 00:00" },
];

function statusVariant(status: string) {
  if (["진행중", "성공", "검증 완료", "지급"].includes(status)) return "success";
  if (["예정", "SET", "월말"].includes(status) || status.startsWith("D-")) return "warning";
  if (["실패", "차감", "소멸"].includes(status)) return "rose";
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
  const [activeTab, setActiveTab] = useState<PointTab>("dashboard");
  const [adjustmentMode, setAdjustmentMode] = useState<AdjustmentMode>("개별 지급");
  const [memberQuery, setMemberQuery] = useState("");
  const [walletFilter, setWalletFilter] = useState<WalletFilter>("전체");
  const [typeFilter, setTypeFilter] = useState<PointLogType>("전체");

  const filteredLogs = useMemo(() => {
    const normalizedQuery = memberQuery.trim().toLowerCase();

    return pointLogs.filter((log) => {
      const matchesMember = !normalizedQuery || `${log.member} ${log.email}`.toLowerCase().includes(normalizedQuery);
      const matchesWallet = walletFilter === "전체" || log.wallet === walletFilter;
      const matchesType = typeFilter === "전체" || log.type === typeFilter;

      return matchesMember && matchesWallet && matchesType;
    });
  }, [memberQuery, typeFilter, walletFilter]);

  const isCsvMode = adjustmentMode.includes("CSV");
  const isSetMode = adjustmentMode === "SET";
  const operationLabel = adjustmentMode.replace("개별 ", "").replace("CSV ", "");

  return (
    <>
      <PageHeader
        eyebrow="Rewards"
        title="포인트 관리"
        description="Mock UI 단계에 맞춰 대시보드, 정책, 기간제한 포인트, 지급/차감, 로그를 한 화면에서 운영 흐름대로 확인합니다."
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
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="총 보유 포인트" value="18.4M P" change="전체 회원 잔여 합계" tone="indigo" />
              <StatCard label="오늘 지급 포인트" value="128K P" change="관리자·CSV 지급" tone="emerald" />
              <StatCard label="오늘 차감 포인트" value="42K P" change="사용·관리자 차감" tone="amber" />
              <StatCard label="이번 달 지급" value="3.2M P" change="관리자·CSV 포함" tone="emerald" />
              <StatCard label="이번 달 차감" value="820K P" change="사용·관리자 차감" tone="amber" />
              <StatCard label="30일 내 소멸" value="1.1M P" change="대상 342명" tone="rose" />
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" />소멸 예정 포인트</CardTitle>
                  <CardDescription>이번 PR에서는 상세 화면 없이 대시보드 테이블에서 예정 현황만 확인합니다.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>회원</TableHead><TableHead>월렛</TableHead><TableHead>소멸 예정</TableHead><TableHead>소멸일</TableHead><TableHead>상태</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {expiringPoints.map((item) => (
                        <TableRow key={`${item.member}-${item.expireDate}`}>
                          <TableCell className="font-semibold">{item.member}</TableCell>
                          <TableCell>{item.wallet}</TableCell>
                          <TableCell>{item.points}</TableCell>
                          <TableCell>{item.expireDate}</TableCell>
                          <TableCell><Badge variant={statusVariant(item.status)}>{item.status}</Badge></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-primary" />운영 바로가기</CardTitle>
                  <CardDescription>Mock 관리자 수준의 주요 업무 진입점입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "개별 회원에게 포인트 지급", target: "adjust" as PointTab, mode: "개별 지급" as AdjustmentMode },
                    { title: "CSV로 포인트 지급", target: "adjust" as PointTab, mode: "CSV 지급" as AdjustmentMode },
                    { title: "기간제 캠페인 확인", target: "limited" as PointTab },
                    { title: "포인트 로그 조회", target: "logs" as PointTab },
                  ].map((action) => (
                    <button
                      key={action.title}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left text-sm font-bold hover:border-indigo-100 hover:bg-indigo-50"
                      onClick={() => {
                        setActiveTab(action.target);
                        if (action.mode) setAdjustmentMode(action.mode);
                      }}
                      type="button"
                    >
                      {action.title}
                      <span className="text-primary">이동</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "policy" && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" />기본 정책</CardTitle>
                <CardDescription>포인트 적립, 사용, 월렛 기준을 Mock 설정 카드로 제공합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["포인트 기능", "사용"],
                  ["기본 월렛", "일반 포인트"],
                  ["최소 사용 포인트", "1,000P"],
                  ["최대 사용 포인트", "주문 금액의 50%"],
                  ["사용 가능 상품", "전체 강의/패키지"],
                  ["사용 단위", "100P"],
                  ["관리자 지급 사유 필수 여부", "필수"],
                  ["관리자 차감 사유 필수 여부", "필수"],
                  ["관리자 사유", "지급/차감/SET 모두 필수"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <span className="text-sm font-semibold text-slate-600">{label}</span>
                    <span className="text-sm font-black text-slate-950">{value}</span>
                  </div>
                ))}
                <Button className="w-full">기본 정책 저장</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-primary" />소멸 정책</CardTitle>
                <CardDescription>알림 발송/대상 상세는 제외하고 소멸 기준만 MVP로 노출합니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  ["소멸 기능", "사용"],
                  ["일반 포인트 유효기간", "적립 후 12개월"],
                  ["기간제 포인트 기준", "캠페인 종료일"],
                  ["소멸 처리 시각", "매일 00:00"],
                  ["우선 차감", "소멸 임박 포인트 우선"],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
                    <span className="text-sm font-semibold text-slate-600">{label}</span>
                    <span className="text-sm font-black text-slate-950">{value}</span>
                  </div>
                ))}
                <Button className="w-full">소멸 정책 저장</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "limited" && (
          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>기간제한 포인트 캠페인</CardTitle>
                <CardDescription>캠페인 row를 클릭하면 지급/사용/소멸 예정 회원 상세로 이동합니다.</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <ExportButton
                  filename="point-campaigns.csv"
                  label="캠페인 목록 엑셀 다운로드"
                  rows={campaigns.map((campaign) => ({
                    캠페인ID: campaign.id,
                    캠페인명: campaign.name,
                    상태: campaign.status,
                    월렛: campaign.wallet,
                    지급시작일: campaign.startDate,
                    지급종료일: campaign.endDate,
                    지급대상수: campaign.targetCount,
                    지급완료수: campaign.issuedCount,
                    총지급포인트: campaign.amount,
                    만료일: campaign.expires,
                  }))}
                />
                <Button>캠페인 생성</Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>캠페인명</TableHead><TableHead>상태</TableHead><TableHead>월렛</TableHead><TableHead>지급 기간</TableHead><TableHead>지급 대상</TableHead><TableHead>지급 완료</TableHead><TableHead>지급 총액</TableHead><TableHead>만료일</TableHead></TableRow></TableHeader>
                <TableBody>
                  {campaigns.map((campaign) => (
                    <TableRow
                      key={campaign.id}
                      className="cursor-pointer transition-colors hover:bg-indigo-50/70"
                      onClick={() => router.push(`/points/campaigns/${campaign.id}`)}
                    >
                      <TableCell className="font-semibold text-primary">{campaign.name}</TableCell>
                      <TableCell><Badge variant={statusVariant(campaign.status)}>{campaign.status}</Badge></TableCell>
                      <TableCell>{campaign.wallet}</TableCell>
                      <TableCell>{campaign.period}</TableCell>
                      <TableCell>{formatNumber(campaign.targetCount)}명</TableCell>
                      <TableCell>{formatNumber(campaign.issuedCount)}명</TableCell>
                      <TableCell>{formatPoints(campaign.amount)}</TableCell>
                      <TableCell>{campaign.expires}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === "adjust" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>포인트 지급/차감</CardTitle>
                <CardDescription>개별 지급, CSV 지급, 개별 차감, CSV 차감, SET을 하나의 업무 화면에서 전환합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-5">
                {adjustmentModes.map((mode) => (
                  <button
                    key={mode}
                    className={cn(
                      "rounded-2xl border p-4 text-sm font-black transition-all",
                      adjustmentMode === mode ? "border-indigo-200 bg-primary text-white shadow-glow" : "border-slate-100 bg-white hover:bg-indigo-50",
                    )}
                    onClick={() => setAdjustmentMode(mode)}
                    type="button"
                  >
                    {mode}
                  </button>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isCsvMode ? <FileSpreadsheet className="h-5 w-5 text-primary" /> : isSetMode ? <Coins className="h-5 w-5 text-primary" /> : operationLabel === "지급" ? <PlusCircle className="h-5 w-5 text-primary" /> : <MinusCircle className="h-5 w-5 text-primary" />}
                    {adjustmentMode} 입력
                  </CardTitle>
                  <CardDescription>관리자 사유는 모든 처리 유형에서 필수로 표시합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isCsvMode ? (
                    <div className="rounded-3xl border-2 border-dashed border-indigo-100 bg-indigo-50/60 p-6 text-center">
                      <FileSpreadsheet className="mx-auto h-10 w-10 text-primary" />
                      <p className="mt-3 text-sm font-black">CSV 파일 업로드</p>
                      <p className="mt-1 text-xs text-slate-500">member_id, email, wallet, amount 컬럼을 사용하는 MVP 템플릿입니다.</p>
                      <Button className="mt-4" variant="secondary">CSV 템플릿 다운로드</Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FilterInput label="회원 검색">
                        <div className="relative mt-1">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="회원명, 이메일, 회원 ID" />
                        </div>
                      </FilterInput>
                      <Button variant="secondary" className="w-full">회원 추가</Button>
                      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-sm font-black text-slate-900">선택된 회원 목록</p>
                        <div className="mt-3 space-y-2">
                          {selectedMembers.map((member) => (
                            <div key={member.email} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                              <span className="font-semibold text-slate-800">{member.member}</span>
                              <span className="text-xs text-slate-500">{member.current}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FilterInput label="월렛">
                      <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="일반 포인트">
                        <option>일반 포인트</option><option>이벤트 포인트</option><option>기간제 포인트</option>
                      </select>
                    </FilterInput>
                    <FilterInput label={isSetMode ? "SET 목표 잔액" : "포인트"}>
                      <input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={isSetMode ? "0" : "5000"} />
                    </FilterInput>
                  </div>

                  {isSetMode && (
                    <div className="grid gap-3 rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-bold text-amber-700">현재 잔액</p>
                        <p className="mt-1 text-2xl font-black text-slate-950">4,850P</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-700">변경 후 잔액</p>
                        <p className="mt-1 text-2xl font-black text-slate-950">0P</p>
                      </div>
                    </div>
                  )}

                  <FilterInput label="관리자 사유">
                    <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="CS 보상">
                      <option>CS 보상</option><option>이벤트 지급</option><option>오지급 정정</option><option>테스트 데이터 정리</option><option>기타</option>
                    </select>
                  </FilterInput>
                  <FilterInput label="상세 사유">
                    <textarea className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary" defaultValue={`${adjustmentMode} 처리를 위한 운영자 입력 사유입니다.`} />
                  </FilterInput>
                  <Button className="w-full">검증 후 {operationLabel} 실행</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{isCsvMode ? "CSV 검증 미리보기" : "대상 회원 미리보기"}</CardTitle>
                  <CardDescription>고급 검증은 제외하고 성공/실패와 실패 사유를 단순 표시합니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 overflow-x-auto">
                  {isCsvMode && (
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="rounded-2xl bg-emerald-50 p-4"><p className="text-xs font-bold text-emerald-700">성공</p><p className="text-2xl font-black">2건</p></div>
                      <div className="rounded-2xl bg-rose-50 p-4"><p className="text-xs font-bold text-rose-700">실패</p><p className="text-2xl font-black">1건</p></div>
                      <div className="rounded-2xl bg-indigo-50 p-4"><p className="text-xs font-bold text-indigo-700">예상 처리</p><p className="text-2xl font-black">5,000P</p></div>
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      {isCsvMode ? <TableRow><TableHead>행</TableHead><TableHead>회원</TableHead><TableHead>월렛</TableHead><TableHead>포인트</TableHead><TableHead>상태</TableHead><TableHead>실패 사유</TableHead></TableRow> : <TableRow><TableHead>회원</TableHead><TableHead>월렛</TableHead><TableHead>현재</TableHead><TableHead>{operationLabel}</TableHead><TableHead>처리 후</TableHead><TableHead>상태</TableHead></TableRow>}
                    </TableHeader>
                    <TableBody>
                      {isCsvMode ? csvPreview.map((row) => (
                        <TableRow key={row.row}>
                          <TableCell>{row.row}</TableCell><TableCell className="font-semibold">{row.member}<p className="text-xs font-normal text-slate-500">{row.email}</p></TableCell><TableCell>{row.wallet}</TableCell><TableCell>{row.amount}</TableCell><TableCell><Badge variant={statusVariant(row.status)}>{row.status}</Badge></TableCell><TableCell>{row.reason}</TableCell>
                        </TableRow>
                      )) : selectedMembers.map((row) => (
                        <TableRow key={row.email}>
                          <TableCell className="font-semibold">{row.member}<p className="text-xs font-normal text-slate-500">{row.email}</p></TableCell><TableCell>{row.wallet}</TableCell><TableCell>{row.current}</TableCell><TableCell>{isSetMode ? "0P" : row.amount}</TableCell><TableCell>{isSetMode ? "0P" : row.after}</TableCell><TableCell><Badge variant="success">{row.status}</Badge></TableCell>
                        </TableRow>
                      ))}
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
                <CardDescription>회원, 기간, 월렛, 처리 유형 기준으로 Mock 로그를 조회합니다.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 lg:grid-cols-5">
                <FilterInput label="회원">
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="회원명 또는 이메일" value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} />
                  </div>
                </FilterInput>
                <FilterInput label="시작일"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-01" type="date" /></FilterInput>
                <FilterInput label="종료일"><input className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-04" type="date" /></FilterInput>
                <FilterInput label="월렛">
                  <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={walletFilter} onChange={(event) => setWalletFilter(event.target.value as WalletFilter)}>
                    {walletOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </FilterInput>
                <FilterInput label="처리 유형">
                  <select className="mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" value={typeFilter} onChange={(event) => setTypeFilter(event.target.value as PointLogType)}>
                    {logTypeOptions.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </FilterInput>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>포인트 로그</CardTitle>
                <CardDescription>총 {filteredLogs.length}건의 포인트 변동 이력이 표시됩니다.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead>일시</TableHead><TableHead>회원</TableHead><TableHead>월렛</TableHead><TableHead>유형</TableHead><TableHead>방식</TableHead><TableHead>처리 관리자</TableHead><TableHead>변동</TableHead><TableHead>잔액</TableHead><TableHead>관리자 사유</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.date}</TableCell>
                        <TableCell className="font-semibold">{log.member}<p className="text-xs font-normal text-slate-500">{log.email}</p></TableCell>
                        <TableCell>{log.wallet}</TableCell>
                        <TableCell><Badge variant={statusVariant(log.type)}>{log.type}</Badge></TableCell>
                        <TableCell>{log.method}</TableCell>
                        <TableCell>{log.admin}</TableCell>
                        <TableCell className={cn("font-black", log.amount.startsWith("+") ? "text-emerald-600" : log.amount.startsWith("-") ? "text-rose-600" : "text-slate-700")}>{log.amount}</TableCell>
                        <TableCell>{log.balance}</TableCell>
                        <TableCell>{log.reason}</TableCell>
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

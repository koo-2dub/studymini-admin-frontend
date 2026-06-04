"use client";

import Link from "next/link";
import { Check, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { couponSearchTargets, formatCurrency, type CouponIssueType, type CouponSearchTarget, type CouponTargetType } from "../data";

const targetTypes: CouponTargetType[] = ["전체 상품", "특정 언어", "특정 코스", "특정 패키지"];
const issueTypes: CouponIssueType[] = ["자동 발급", "쿠폰 코드 배포", "특정 회원 지급"];

const mockMembers = [
  { id: "member-1001", name: "김민준", email: "minjun.kim@example.com", userId: "U-1001", status: "정상" },
  { id: "member-1002", name: "이지은", email: "jieun.lee@example.com", userId: "U-1002", status: "정상" },
  { id: "member-2001", name: "최유진", email: "yujin.choi@example.com", userId: "U-2001", status: "VIP" },
  { id: "member-3001", name: "강도윤", email: "doyun.kang@example.com", userId: "U-3001", status: "CS 보상 대상" },
];

function targetTypeDescription(type: CouponTargetType) {
  if (type === "전체 상품") return "모든 상품에 쿠폰을 적용합니다.";
  if (type === "특정 언어") return "검색으로 선택한 언어의 상품에만 적용합니다.";
  if (type === "특정 코스") return "검색으로 선택한 코스에만 적용합니다.";
  return "검색으로 선택한 패키지에만 적용합니다.";
}

export default function CreateCouponPage() {
  const [discountType, setDiscountType] = useState<"정액 할인" | "정률 할인">("정액 할인");
  const [targetType, setTargetType] = useState<CouponTargetType>("특정 코스");
  const [targetQuery, setTargetQuery] = useState("영어");
  const [selectedTargets, setSelectedTargets] = useState<CouponSearchTarget[]>([couponSearchTargets[3]]);
  const [issueType, setIssueType] = useState<CouponIssueType>("특정 회원 지급");
  const [memberQuery, setMemberQuery] = useState("김");
  const [selectedMembers, setSelectedMembers] = useState([mockMembers[0], mockMembers[2]]);

  const filteredTargets = useMemo(() => {
    if (targetType === "전체 상품") return [];
    const normalizedQuery = targetQuery.trim().toLowerCase();

    return couponSearchTargets.filter((target) => {
      const matchesType = target.type === targetType;
      const matchesQuery = !normalizedQuery || `${target.title} ${target.meta} ${target.id}`.toLowerCase().includes(normalizedQuery);
      return matchesType && matchesQuery;
    });
  }, [targetQuery, targetType]);

  const filteredMembers = useMemo(() => {
    const normalizedQuery = memberQuery.trim().toLowerCase();
    if (!normalizedQuery) return mockMembers;
    return mockMembers.filter((member) => `${member.name} ${member.email} ${member.userId}`.toLowerCase().includes(normalizedQuery));
  }, [memberQuery]);

  const toggleTarget = (target: CouponSearchTarget) => {
    setSelectedTargets((current) => current.some((item) => item.id === target.id) ? current.filter((item) => item.id !== target.id) : [...current, target]);
  };

  const toggleMember = (member: (typeof mockMembers)[number]) => {
    setSelectedMembers((current) => current.some((item) => item.id === member.id) ? current.filter((item) => item.id !== member.id) : [...current, member]);
  };

  return (
    <>
      <PageHeader
        eyebrow="Promotions"
        title="쿠폰 생성"
        description="Stepper 없이 한 페이지에서 쿠폰 기본 정보, 할인, 적용 대상, 조건, 발급 방식을 구성합니다."
        action={<Button asChild variant="secondary"><Link href="/coupons">목록으로</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>운영자가 목록과 상세에서 식별할 쿠폰명과 설명을 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              쿠폰명
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="신규 프로모션 쿠폰" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              설명
              <textarea className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary" defaultValue="쿠폰 운영 목적, 배포 채널, CS 참고 사항을 입력하세요." />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>할인 설정</CardTitle>
            <CardDescription>정액 할인과 정률 할인을 선택하고 필요한 할인 값을 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {["정액 할인", "정률 할인"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`rounded-2xl border p-4 text-left transition ${discountType === type ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  onClick={() => setDiscountType(type as typeof discountType)}
                >
                  <span className="font-bold text-slate-900">{type}</span>
                  <span className="mt-1 block text-sm text-slate-500">{type === "정액 할인" ? "결제금액에서 고정 금액을 할인합니다." : "결제금액의 일정 비율을 할인합니다."}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-1 text-sm font-semibold text-slate-700">
                할인 금액
                <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="10000" disabled={discountType !== "정액 할인"} />
              </label>
              <label className="space-y-1 text-sm font-semibold text-slate-700">
                할인율
                <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="15" disabled={discountType !== "정률 할인"} />
              </label>
              <label className="space-y-1 text-sm font-semibold text-slate-700">
                최대 할인 금액
                <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="20000" disabled={discountType !== "정률 할인"} />
              </label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>적용 대상</CardTitle>
            <CardDescription>전체 상품 또는 검색으로 선택한 언어/코스/패키지를 적용 대상으로 지정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-4">
              {targetTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`rounded-2xl border p-4 text-left transition ${targetType === type ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                  onClick={() => {
                    setTargetType(type);
                    setSelectedTargets(type === "전체 상품" ? [] : selectedTargets.filter((target) => target.type === type));
                  }}
                >
                  <span className="font-bold text-slate-900">{type}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{targetTypeDescription(type)}</span>
                </button>
              ))}
            </div>

            {targetType === "전체 상품" ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">전체 상품에 적용됩니다. 고가 상품에도 적용될 수 있으므로 할인 조건을 확인하세요.</div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  {targetType} 검색
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="이름 또는 ID를 입력하세요" value={targetQuery} onChange={(event) => setTargetQuery(event.target.value)} />
                  </div>
                </label>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                  <Table className="min-w-[720px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap">유형</TableHead>
                        <TableHead className="whitespace-nowrap">이름</TableHead>
                        <TableHead className="whitespace-nowrap">ID</TableHead>
                        <TableHead className="whitespace-nowrap">정보</TableHead>
                        <TableHead className="whitespace-nowrap">선택</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTargets.map((target) => {
                        const isSelected = selectedTargets.some((item) => item.id === target.id);
                        return (
                          <TableRow key={target.id}>
                            <TableCell className="whitespace-nowrap"><Badge variant="slate">{target.type}</Badge></TableCell>
                            <TableCell className="whitespace-nowrap font-semibold text-slate-900">{target.title}</TableCell>
                            <TableCell className="whitespace-nowrap font-mono text-xs text-slate-500">{target.id}</TableCell>
                            <TableCell className="whitespace-nowrap text-sm text-slate-600">{target.meta}</TableCell>
                            <TableCell className="whitespace-nowrap"><Button type="button" variant={isSelected ? "default" : "outline"} size="sm" onClick={() => toggleTarget(target)}>{isSelected && <Check className="h-3 w-3" />}{isSelected ? "선택됨" : "선택"}</Button></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedTargets.map((target) => <Badge key={target.id} variant="default">{target.title}</Badge>)}
                  {selectedTargets.length === 0 && <span className="text-sm text-slate-500">선택된 대상이 없습니다.</span>}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용 조건</CardTitle>
            <CardDescription>결제금액, 회원당/전체 사용 횟수, 쿠폰 사용 가능 기간을 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              최소 결제금액
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="30000" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              회원당 사용 횟수
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="1" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              전체 사용 횟수
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="1000" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              사용 가능 시작일
              <input type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-10T00:00" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              사용 가능 종료일
              <input type="datetime-local" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-30T23:59" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>발급 방식</CardTitle>
            <CardDescription>자동 발급, 쿠폰 코드 배포, 특정 회원 지급 중 하나를 선택합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              {issueTypes.map((type) => (
                <button key={type} type="button" className={`rounded-2xl border p-4 text-left transition ${issueType === type ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "border-slate-200 bg-white hover:bg-slate-50"}`} onClick={() => setIssueType(type)}>
                  <span className="font-bold text-slate-900">{type}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{type === "자동 발급" ? "회원가입 등 이벤트 발생 시 지급합니다." : type === "쿠폰 코드 배포" ? "마케팅 쿠폰 코드를 입력해 사용합니다." : "운영자가 회원을 검색하거나 CSV로 지급합니다."}</span>
                </button>
              ))}
            </div>
            {issueType === "쿠폰 코드 배포" && (
              <label className="block space-y-1 text-sm font-semibold text-slate-700">
                쿠폰 코드
                <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm uppercase outline-none focus:border-primary" defaultValue="PROMO2026" />
              </label>
            )}
            {issueType === "특정 회원 지급" && (
              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                  <label className="space-y-1 text-sm font-semibold text-slate-700">
                    회원 검색
                    <div className="relative mt-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary" placeholder="이름, 이메일, User ID 검색" value={memberQuery} onChange={(event) => setMemberQuery(event.target.value)} />
                    </div>
                  </label>
                  <div className="mt-4 space-y-2">
                    {filteredMembers.map((member) => {
                      const isSelected = selectedMembers.some((item) => item.id === member.id);
                      return (
                        <button key={member.id} type="button" className={`flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm ${isSelected ? "border-primary bg-white" : "border-slate-200 bg-white/80"}`} onClick={() => toggleMember(member)}>
                          <span><span className="block font-bold text-slate-900">{member.name} · {member.userId}</span><span className="block text-xs text-slate-500">{member.email}</span></span>
                          <Badge variant={isSelected ? "default" : "slate"}>{isSelected ? "선택됨" : member.status}</Badge>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-slate-400" />
                  <p className="mt-3 font-bold text-slate-900">CSV 업로드</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">User ID 또는 이메일이 포함된 CSV 파일을 업로드하는 Mock UI입니다. 실제 업로드 처리는 이번 PR 범위에 포함하지 않습니다.</p>
                  <Button type="button" variant="outline" className="mt-4">CSV 파일 선택</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>검토 요약</CardTitle>
            <CardDescription>저장 전 주요 설정을 한 번에 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">할인</p><p className="mt-2 font-semibold text-slate-800">{discountType === "정액 할인" ? formatCurrency(10000) : "15% · 최대 20,000원"}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">적용 대상</p><p className="mt-2 font-semibold text-slate-800">{targetType === "전체 상품" ? "전체 상품" : `${targetType} ${selectedTargets.length}개`}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">발급 방식</p><p className="mt-2 font-semibold text-slate-800">{issueType}{issueType === "특정 회원 지급" ? ` · ${selectedMembers.length}명` : ""}</p></div>
            <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold uppercase text-slate-400">사용 조건</p><p className="mt-2 font-semibold text-slate-800">30,000원 이상 · 회원당 1회</p></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline"><Link href="/coupons">취소</Link></Button>
          <Button type="button">저장</Button>
        </div>
      </div>
    </>
  );
}

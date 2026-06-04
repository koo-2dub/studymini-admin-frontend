"use client";

import Link from "next/link";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { searchableAccessContents, type AccessCodeContent, type AccessCodeType } from "../data";

function contentLabel(content: AccessCodeContent) {
  return `${content.type}: ${content.title}`;
}

export default function CreateAccessCodePage() {
  const [codeType, setCodeType] = useState<AccessCodeType>("개인별 코드");
  const [searchQuery, setSearchQuery] = useState("비즈니스");
  const [selectedContents, setSelectedContents] = useState<AccessCodeContent[]>([
    searchableAccessContents[0],
    searchableAccessContents[2],
  ]);

  const filteredContents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return searchableAccessContents;

    return searchableAccessContents.filter((content) =>
      `${content.type} ${content.title} ${content.id}`.toLowerCase().includes(normalizedQuery),
    );
  }, [searchQuery]);

  const toggleContent = (content: AccessCodeContent) => {
    setSelectedContents((current) => {
      const alreadySelected = current.some((item) => item.id === content.id);

      if (alreadySelected) {
        return current.filter((item) => item.id !== content.id);
      }

      return [...current, content];
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="수강코드 생성"
        description="기업/기관 담당자에게 전달할 B2B 수강코드를 저장 전 mock UI로 구성합니다."
        action={<Button asChild variant="secondary"><Link href="/access/codes">목록으로</Link></Button>}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>수강코드명과 담당자에게 공유할 운영 메모를 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              수강코드명
              <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="신규 B2B 수강코드" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700 md:col-span-2">
              설명/메모
              <textarea
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-primary"
                defaultValue="기업/기관 담당자명, 전달 방식, 회수 정책 등 운영 메모를 입력하세요."
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>대상 코스/패키지 검색 및 선택</CardTitle>
            <CardDescription>수강코드 입력 시 권한을 부여할 코스 또는 패키지를 선택합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <label className="space-y-1 text-sm font-semibold text-slate-700">
                대상 코스/패키지 검색
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-primary"
                    placeholder="코스명 또는 패키지명을 입력하세요"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </label>
              <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
                <Table className="min-w-[720px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">유형</TableHead>
                      <TableHead className="whitespace-nowrap">콘텐츠명</TableHead>
                      <TableHead className="whitespace-nowrap">콘텐츠 ID</TableHead>
                      <TableHead className="whitespace-nowrap">권장 권한 기간</TableHead>
                      <TableHead className="whitespace-nowrap">선택</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContents.map((content) => {
                      const isSelected = selectedContents.some((item) => item.id === content.id);

                      return (
                        <TableRow key={content.id}>
                          <TableCell><Badge variant={content.type === "패키지" ? "default" : "slate"}>{content.type}</Badge></TableCell>
                          <TableCell className="font-semibold text-slate-900">{content.title}</TableCell>
                          <TableCell className="font-mono text-xs text-slate-500">{content.id}</TableCell>
                          <TableCell className="whitespace-nowrap text-sm text-slate-600">{content.duration}</TableCell>
                          <TableCell>
                            <Button type="button" variant={isSelected ? "secondary" : "outline"} size="sm" onClick={() => toggleContent(content)}>
                              {isSelected ? <Check className="h-4 w-4" /> : null}{isSelected ? "선택됨" : "선택"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-primary">선택된 대상 콘텐츠</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedContents.map((content) => <Badge key={content.id} variant="default">{contentLabel(content)}</Badge>)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>코드 유형 및 발급 기준</CardTitle>
            <CardDescription>공용 코드와 개인별 코드에 따라 필요한 입력 항목이 다르게 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {(["개인별 코드", "공용 코드"] as AccessCodeType[]).map((type) => (
                <label key={type} className="flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input type="radio" name="codeType" className="mt-1" checked={codeType === type} onChange={() => setCodeType(type)} />
                  <span>
                    <span className="block text-base font-bold text-slate-900">{type}</span>
                    <span className="mt-1 block text-xs leading-5 text-slate-500">
                      {type === "개인별 코드" ? "회원별로 다른 코드를 발급하고 발급 수량만큼 코드 목록을 생성합니다." : "하나의 공용 코드를 여러 명이 입력하며 사용 가능 인원으로 총량을 제한합니다."}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            {codeType === "개인별 코드" ? (
              <label className="block space-y-1 text-sm font-semibold text-slate-700 md:max-w-sm">
                발급 수량
                <input type="number" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={120} />
                <span className="block text-xs font-medium text-slate-500">입력한 수량만큼 서로 다른 개인별 코드가 생성되는 mock 설정입니다.</span>
              </label>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  공용 코드
                  <input className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 font-mono text-sm outline-none focus:border-primary" defaultValue="WELCOME-2026" />
                </label>
                <label className="space-y-1 text-sm font-semibold text-slate-700">
                  사용 가능 인원
                  <input type="number" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={80} />
                </label>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>입력 가능 기간 및 권한 기간</CardTitle>
            <CardDescription>사용자가 프로필에서 코드를 입력할 수 있는 기간과 권한 부여 기간을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              입력 가능 시작일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-04" />
            </label>
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              입력 가능 종료일
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-07-31" />
            </label>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-bold text-slate-700">권한 시작 기준</p>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="accessStart" defaultChecked /> 입력 즉시 시작</label>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="accessStart" /> 지정일 시작</label>
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-06-10" />
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm font-bold text-slate-700">권한 기간</p>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="accessPeriod" defaultChecked /> N일</label>
              <input type="number" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue={180} />
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="radio" name="accessPeriod" /> 고정 종료일</label>
              <input type="date" className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary" defaultValue="2026-12-31" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>사용 제한</CardTitle>
            <CardDescription>중복 입력과 전체 사용 수량 제한을 설정합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
              <input type="checkbox" defaultChecked /> 1인 1회
            </label>
            <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
              <input type="checkbox" defaultChecked /> 전체 사용 수량 제한
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button asChild variant="outline"><Link href="/access/codes">취소</Link></Button>
          <Button type="button">저장</Button>
        </div>
      </div>
    </>
  );
}

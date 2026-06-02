"use client";

import { ArrowLeft, Calculator, KeyRound, Save, Search, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  calculateDiscountAmount,
  calculateDiscountRate,
  formatWon,
  getSalesStatusTone,
  lmsCourses,
} from "../_data/catalog";
import type { LmsPackage, LmsVisibility, PackageBuyerPolicy, SalesStatus } from "../_data/types";

type PackageFormState = {
  name: string;
  displayName: string;
  internalName: string;
  description: string;
  selectedCourseIds: string[];
  salePrice: number;
  salesStatus: SalesStatus;
  visibility: LmsVisibility;
  saleStartsAt: string;
  saleEndsAt: string;
  hasSalesHistory: boolean;
  existingBuyerCourseGrantPolicy: PackageBuyerPolicy;
  adminMemo: string;
};

const salesStatusOptions: SalesStatus[] = ["판매중", "판매중지", "예약", "종료"];
const visibilityOptions: LmsVisibility[] = ["공개", "비공개"];
const buyerPolicyOptions: PackageBuyerPolicy[] = ["신규 구매자만", "기존 구매자 포함", "선택 필요"];

function createInitialForm(lmsPackage?: LmsPackage): PackageFormState {
  return {
    name: lmsPackage?.name ?? "",
    displayName: lmsPackage?.displayName ?? "",
    internalName: lmsPackage?.internalName ?? "",
    description: lmsPackage?.description ?? "",
    selectedCourseIds: lmsPackage?.courseIds ?? [],
    salePrice: lmsPackage?.salePrice ?? 0,
    salesStatus: lmsPackage?.salesStatus ?? "판매중지",
    visibility: lmsPackage?.visibility ?? "비공개",
    saleStartsAt: lmsPackage?.saleStartsAt ?? "",
    saleEndsAt: lmsPackage?.saleEndsAt ?? "",
    hasSalesHistory: lmsPackage?.hasSalesHistory ?? false,
    existingBuyerCourseGrantPolicy: lmsPackage?.existingBuyerCourseGrantPolicy ?? "신규 구매자만",
    adminMemo: lmsPackage?.adminMemo ?? "",
  };
}

export function PackageFormPage({ mode, lmsPackage }: { mode: "create" | "edit"; lmsPackage?: LmsPackage }) {
  const [form, setForm] = useState(() => createInitialForm(lmsPackage));
  const [courseQuery, setCourseQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("전체");

  const selectedCourses = useMemo(
    () => form.selectedCourseIds.map((courseId) => lmsCourses.find((course) => course.id === courseId)).filter((course): course is NonNullable<typeof course> => Boolean(course)),
    [form.selectedCourseIds],
  );
  const languageOptions = useMemo(() => ["전체", ...Array.from(new Set(lmsCourses.map((course) => course.language)))], []);
  const regularPrice = selectedCourses.reduce((sum, course) => sum + course.price, 0);
  const discountAmount = calculateDiscountAmount(regularPrice, form.salePrice);
  const discountRate = calculateDiscountRate(regularPrice, form.salePrice);
  const classCount = selectedCourses.reduce((sum, course) => sum + course.classCount, 0);
  const lessonCount = selectedCourses.reduce((sum, course) => sum + course.lessonCount, 0);
  const languageScope = new Set(selectedCourses.map((course) => course.language)).size > 1 ? "복수 언어" : "단일 언어";

  const availableCourses = useMemo(() => {
    const keyword = courseQuery.trim().toLowerCase();

    return lmsCourses.filter((course) => {
      const matchesKeyword = keyword
        ? [course.id, course.language, course.name, course.displayName].join(" ").toLowerCase().includes(keyword)
        : true;
      const matchesLanguage = languageFilter === "전체" ? true : course.language === languageFilter;

      return matchesKeyword && matchesLanguage;
    });
  }, [courseQuery, languageFilter]);

  const updateForm = <K extends keyof PackageFormState>(key: K, value: PackageFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleCourse = (courseId: string) => {
    setForm((current) => {
      const selected = current.selectedCourseIds.includes(courseId);

      return {
        ...current,
        selectedCourseIds: selected
          ? current.selectedCourseIds.filter((selectedCourseId) => selectedCourseId !== courseId)
          : [...current.selectedCourseIds, courseId],
      };
    });
  };

  const validationMessages = [
    !form.name ? "패키지명을 입력해야 저장할 수 있습니다." : "",
    form.selectedCourseIds.length === 0 ? "최소 1개 이상의 코스를 선택해야 합니다." : "",
    form.salePrice <= 0 ? "패키지 판매가를 입력해야 합니다." : "",
    form.salePrice > regularPrice && regularPrice > 0 ? "패키지 판매가가 코스 정가 합계보다 높습니다." : "",
    form.hasSalesHistory ? "판매 이력이 있는 패키지는 코스 제거 시 기본 금지 또는 매우 강한 경고가 필요합니다." : "",
  ].filter(Boolean);

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title={mode === "create" ? "패키지 생성" : "패키지 수정"}
        description="단일 코스 패키지와 복수 언어 패키지를 모두 허용하며, 선택한 코스 기준으로 가격과 권한을 미리 계산합니다."
        action={
          <Link
            href={lmsPackage ? `/lms/packages/${lmsPackage.id}` : "/lms/packages"}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            돌아가기
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
              <CardDescription>패키지명, 노출명, 판매상태와 공개상태를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>패키지명</FieldLabel>
                  <FormInput value={form.name} onChange={(event) => updateForm("name", event.target.value)} placeholder="예: 베이직 + 문법" />
                </label>
                <label>
                  <FieldLabel>사용자 노출명</FieldLabel>
                  <FormInput value={form.displayName} onChange={(event) => updateForm("displayName", event.target.value)} placeholder="예: 일본어 베이직 + 문법 패키지" />
                </label>
                <label>
                  <FieldLabel>내부 관리명</FieldLabel>
                  <FormInput value={form.internalName} onChange={(event) => updateForm("internalName", event.target.value)} placeholder="운영팀 관리용 이름" />
                </label>
                <label>
                  <FieldLabel>패키지 판매가</FieldLabel>
                  <FormInput type="number" value={String(form.salePrice)} onChange={(event) => updateForm("salePrice", Number(event.target.value))} />
                </label>
                <label>
                  <FieldLabel>판매상태</FieldLabel>
                  <FormSelect value={form.salesStatus} onChange={(event) => updateForm("salesStatus", event.target.value as SalesStatus)}>
                    {salesStatusOptions.map((status) => <option key={status}>{status}</option>)}
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>공개상태</FieldLabel>
                  <FormSelect value={form.visibility} onChange={(event) => updateForm("visibility", event.target.value as LmsVisibility)}>
                    {visibilityOptions.map((visibility) => <option key={visibility}>{visibility}</option>)}
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>판매 시작일</FieldLabel>
                  <FormInput type="date" value={form.saleStartsAt} onChange={(event) => updateForm("saleStartsAt", event.target.value)} />
                </label>
                <label>
                  <FieldLabel>판매 종료일</FieldLabel>
                  <FormInput type="date" value={form.saleEndsAt} onChange={(event) => updateForm("saleEndsAt", event.target.value)} />
                </label>
              </div>
              <label className="block">
                <FieldLabel>설명</FieldLabel>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="패키지 설명을 입력하세요."
                />
              </label>
              <label className="block">
                <FieldLabel>관리자 메모</FieldLabel>
                <textarea
                  className="mt-2 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                  value={form.adminMemo}
                  onChange={(event) => updateForm("adminMemo", event.target.value)}
                  placeholder="내부 운영 메모"
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>코스 선택</CardTitle>
              <CardDescription>코스 1개짜리 패키지와 서로 다른 언어의 코스를 포함한 패키지를 모두 허용합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_180px]">
                <label className="text-sm font-bold text-slate-600">
                  코스 검색
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      placeholder="언어, 코스명, 코스 ID"
                      value={courseQuery}
                      onChange={(event) => setCourseQuery(event.target.value)}
                    />
                  </div>
                </label>
                <label>
                  <FieldLabel>언어</FieldLabel>
                  <FormSelect value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
                    {languageOptions.map((language) => <option key={language}>{language}</option>)}
                  </FormSelect>
                </label>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                  <p className="mb-3 font-black text-slate-900">선택 가능한 코스</p>
                  <div className="space-y-3">
                    {availableCourses.map((course) => {
                      const selected = form.selectedCourseIds.includes(course.id);

                      return (
                        <button
                          key={course.id}
                          type="button"
                          onClick={() => toggleCourse(course.id)}
                          className={`w-full rounded-2xl border p-4 text-left transition-all ${selected ? "border-indigo-300 bg-indigo-50" : "border-white bg-white hover:border-indigo-200"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-black text-slate-950">{course.displayName}</p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">{formatWon(course.price)} · 수업 {course.classCount}개 · 레슨 {course.lessonCount}개</p>
                            </div>
                            <Badge variant={selected ? "success" : "slate"}>{selected ? "선택됨" : course.language}</Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-4">
                  <p className="mb-3 font-black text-slate-900">패키지 포함 코스</p>
                  <div className="space-y-3">
                    {selectedCourses.map((course, index) => (
                      <div key={course.id} className="rounded-2xl bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">#{index + 1} · {course.language}</p>
                            <p className="mt-1 font-black text-slate-950">{course.displayName}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">{formatWon(course.price)} · 수업 {course.classCount}개 · 레슨 {course.lessonCount}개</p>
                          </div>
                          <Button type="button" variant="outline" size="sm" onClick={() => toggleCourse(course.id)}>제거</Button>
                        </div>
                      </div>
                    ))}
                    {selectedCourses.length === 0 && <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-500">선택된 코스가 없습니다.</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>판매 이력 정책</CardTitle>
              <CardDescription>판매 이력이 있는 패키지는 코스 제거를 강하게 제한하고, 코스 추가 시 기존 구매자 권한 부여 정책을 선택합니다.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <label>
                <FieldLabel>판매 이력</FieldLabel>
                <FormSelect value={form.hasSalesHistory ? "있음" : "없음"} onChange={(event) => updateForm("hasSalesHistory", event.target.value === "있음")}>
                  <option>없음</option>
                  <option>있음</option>
                </FormSelect>
              </label>
              <label>
                <FieldLabel>신규 코스 추가 시 기존 구매자 권한</FieldLabel>
                <FormSelect value={form.existingBuyerCourseGrantPolicy} onChange={(event) => updateForm("existingBuyerCourseGrantPolicy", event.target.value as PackageBuyerPolicy)}>
                  {buyerPolicyOptions.map((policy) => <option key={policy}>{policy}</option>)}
                </FormSelect>
              </label>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-indigo-500" />
                <CardTitle>계산 미리보기</CardTitle>
              </div>
              <CardDescription>선택한 코스 기준으로 자동 계산됩니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow label="언어 구성" value={selectedCourses.length ? languageScope : "-"} />
              <SummaryRow label="코스 수" value={`${selectedCourses.length}개`} />
              <SummaryRow label="수업 / 레슨" value={`${classCount}개 / ${lessonCount}개`} />
              <SummaryRow label="코스 정가 합계" value={formatWon(regularPrice)} />
              <SummaryRow label="패키지 판매가" value={formatWon(form.salePrice)} strong />
              <SummaryRow label="할인 금액" value={formatWon(discountAmount)} />
              <SummaryRow label="할인율" value={`${discountRate.toFixed(1)}%`} />
              <div className="h-px bg-slate-100" />
              <div className="space-y-2">
                <Badge variant={getSalesStatusTone(form.salesStatus)}>{form.salesStatus}</Badge>
                <Badge variant={form.visibility === "공개" ? "success" : "slate"}>{form.visibility}</Badge>
              </div>
              <Button type="button" className="w-full" onClick={() => alert("Mock 화면입니다. 저장 API 연결은 다음 단계에서 진행합니다.")}> 
                <Save className="h-4 w-4" />
                {mode === "create" ? "패키지 생성" : "패키지 수정"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-500" />
                <CardTitle>권한 미리보기</CardTitle>
              </div>
              <CardDescription>구매 또는 그룹 부여 시 생성될 코스 권한입니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedCourses.map((course) => (
                <div key={course.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="font-black text-slate-950">{course.language} / {course.name}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-600">수업 {course.classCount}개 · 레슨 {course.lessonCount}개 접근 권한</p>
                </div>
              ))}
              {selectedCourses.length === 0 && <p className="text-sm font-semibold text-slate-500">코스를 선택하면 권한 미리보기가 표시됩니다.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-500" />
                <CardTitle>검증 메시지</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm font-semibold text-slate-600">
                {validationMessages.map((message) => <li key={message}>• {message}</li>)}
                {validationMessages.length === 0 && <li className="text-emerald-700">• 저장 가능한 상태입니다.</li>}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>선택 코스 테이블</CardTitle>
          <CardDescription>패키지에 포함될 코스의 언어, 가격, 수업/레슨 수, 포함 패키지 수를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>언어</TableHead>
                <TableHead>코스명</TableHead>
                <TableHead>가격</TableHead>
                <TableHead>판매상태</TableHead>
                <TableHead>수업 수</TableHead>
                <TableHead>레슨 수</TableHead>
                <TableHead>포함 패키지 수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.language}</TableCell>
                  <TableCell className="font-bold text-slate-900">{course.displayName}</TableCell>
                  <TableCell>{formatWon(course.price)}</TableCell>
                  <TableCell><Badge variant={getSalesStatusTone(course.salesStatus)}>{course.salesStatus}</Badge></TableCell>
                  <TableCell>{course.classCount}개</TableCell>
                  <TableCell>{course.lessonCount}개</TableCell>
                  <TableCell>{course.packageCount}개</TableCell>
                </TableRow>
              ))}
              {selectedCourses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center font-semibold text-slate-500">선택된 코스가 없습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-slate-600">{children}</span>;
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" {...props} />;
}

function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" {...props} />;
}

function SummaryRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className={strong ? "text-lg font-black text-slate-950" : "font-bold text-slate-800"}>{value}</p>
    </div>
  );
}

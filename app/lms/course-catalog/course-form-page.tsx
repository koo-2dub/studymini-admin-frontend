"use client";

import { ArrowLeft, BookOpenCheck, KeyRound, PlusCircle, Save, Search, ShieldAlert, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { courseClasses } from "../courses/data";
import { formatWon, getSalesStatusTone } from "../_data/catalog";
import type { LmsCourse, LmsVisibility, SalesStatus } from "../_data/types";
import {
  courseCatalogFormLanguageOptions,
  courseCatalogFormSalesStatusOptions,
  courseCatalogFormVisibilityOptions,
  createInitialCourseCatalogForm,
  getCourseCatalogFormSaveHref,
  getCourseIncludedClassesByIds,
  type CourseCatalogFormState,
} from "./data";

export function CourseFormPage({ mode, course }: { mode: "create" | "edit"; course?: LmsCourse }) {
  const router = useRouter();
  const [form, setForm] = useState(() => createInitialCourseCatalogForm(course));
  const [classQuery, setClassQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState(course?.language ?? "전체");
  const [saveMessage, setSaveMessage] = useState("");
  const [draftCourseId] = useState(() => `CRS-DRAFT-${Date.now()}`);

  const selectedClasses = useMemo(() => getCourseIncludedClassesByIds(form.selectedClassIds), [form.selectedClassIds]);
  const selectedLessonCount = selectedClasses.reduce((sum, courseClass) => sum + courseClass.lessons.length, 0);
  const selectedLanguageCount = new Set(selectedClasses.map((courseClass) => courseClass.language)).size;
  const classLanguageOptions = useMemo(
    () => ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.language)))],
    [],
  );

  const availableClasses = useMemo(() => {
    const keyword = classQuery.trim().toLowerCase();

    return courseClasses.filter((courseClass) => {
      const matchesKeyword = keyword
        ? [courseClass.id, courseClass.language, courseClass.course, courseClass.className]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;
      const matchesLanguage = languageFilter === "전체" ? true : courseClass.language === languageFilter;

      return matchesKeyword && matchesLanguage;
    });
  }, [classQuery, languageFilter]);

  const updateForm = <K extends keyof CourseCatalogFormState>(key: K, value: CourseCatalogFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const addClass = (classId: string) => {
    setForm((current) => {
      if (current.selectedClassIds.includes(classId)) return current;

      return { ...current, selectedClassIds: [...current.selectedClassIds, classId] };
    });
  };

  const removeClass = (classId: string) => {
    setForm((current) => ({
      ...current,
      selectedClassIds: current.selectedClassIds.filter((selectedClassId) => selectedClassId !== classId),
    }));
  };

  const toggleClass = (classId: string) => {
    if (form.selectedClassIds.includes(classId)) {
      removeClass(classId);
      return;
    }

    addClass(classId);
  };

  const courseId = course?.id ?? draftCourseId;
  const saveHref = getCourseCatalogFormSaveHref(courseId, form);
  const validationMessages = [
    !form.name.trim() ? "코스명을 입력해야 저장할 수 있습니다." : "",
    !form.description.trim() ? "설명을 입력해야 운영자가 코스 내용을 확인할 수 있습니다." : "",
    form.digitalIsSelling && form.digitalPrice <= 0 ? "디지털 판매 ON 상태에서는 가격을 0원보다 크게 입력해야 합니다." : "",
    form.paperDigitalIsSelling && form.paperDigitalPrice <= 0 ? "페이퍼 + 디지털 판매 ON 상태에서는 가격을 0원보다 크게 입력해야 합니다." : "",
    form.paperDigitalPrice < form.digitalPrice ? "페이퍼 + 디지털 가격이 디지털 가격보다 낮습니다." : "",
    !form.digitalIsSelling && !form.paperDigitalIsSelling ? "두 옵션 중 최소 하나는 판매 ON이어야 합니다." : "",
    form.selectedClassIds.length === 0 ? "최소 1개 이상의 포함 수업을 선택해야 합니다." : "",
    selectedLanguageCount > 1 ? "하나의 코스에 여러 언어 수업이 포함되어 있습니다. 언어 선택값을 다시 확인하세요." : "",
    selectedClasses.some((courseClass) => courseClass.language !== form.language)
      ? "선택한 포함 수업의 언어가 코스 언어와 다릅니다."
      : "",
  ].filter(Boolean);

  const handleSave = () => {
    setSaveMessage("저장되었습니다. 코스 상세 화면으로 이동합니다.");
    router.push(saveHref);
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title={mode === "create" ? "코스 생성" : "코스 수정"}
        description="코스 기본 정보와 판매/공개 상태를 설정하고, 구매 시 권한이 열리는 포함 수업을 추가하거나 제거합니다."
        action={
          <Link
            href={course ? `/lms/course-catalog/${course.id}` : "/lms/course-catalog"}
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
              <CardDescription>언어, 코스명, 설명, 옵션별 가격/판매 여부와 공개상태를 설정합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <FieldLabel>언어</FieldLabel>
                  <FormSelect value={form.language} onChange={(event) => updateForm("language", event.target.value)}>
                    {courseCatalogFormLanguageOptions.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>코스명</FieldLabel>
                  <FormInput
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    placeholder="예: 일본어 베이직"
                  />
                </label>
                <label>
                  <FieldLabel>디지털 가격</FieldLabel>
                  <FormInput
                    type="number"
                    value={String(form.digitalPrice)}
                    onChange={(event) => updateForm("digitalPrice", Number(event.target.value))}
                  />
                </label>
                <label>
                  <FieldLabel>페이퍼 + 디지털 가격</FieldLabel>
                  <FormInput
                    type="number"
                    value={String(form.paperDigitalPrice)}
                    onChange={(event) => updateForm("paperDigitalPrice", Number(event.target.value))}
                  />
                  <span className="mt-2 inline-flex"><Badge variant="warning">배송 필요</Badge></span>
                </label>
                <label>
                  <FieldLabel>디지털 판매 여부</FieldLabel>
                  <FormSelect
                    value={form.digitalIsSelling ? "ON" : "OFF"}
                    onChange={(event) => updateForm("digitalIsSelling", event.target.value === "ON")}
                  >
                    <option>ON</option>
                    <option>OFF</option>
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>페이퍼 + 디지털 판매 여부</FieldLabel>
                  <FormSelect
                    value={form.paperDigitalIsSelling ? "ON" : "OFF"}
                    onChange={(event) => updateForm("paperDigitalIsSelling", event.target.value === "ON")}
                  >
                    <option>ON</option>
                    <option>OFF</option>
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>판매상태</FieldLabel>
                  <FormSelect
                    value={form.salesStatus}
                    onChange={(event) => updateForm("salesStatus", event.target.value as SalesStatus)}
                  >
                    {courseCatalogFormSalesStatusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </FormSelect>
                </label>
                <label>
                  <FieldLabel>공개상태</FieldLabel>
                  <FormSelect
                    value={form.visibility}
                    onChange={(event) => updateForm("visibility", event.target.value as LmsVisibility)}
                  >
                    {courseCatalogFormVisibilityOptions.map((visibility) => (
                      <option key={visibility}>{visibility}</option>
                    ))}
                  </FormSelect>
                </label>
              </div>
              <label className="block">
                <FieldLabel>설명</FieldLabel>
                <textarea
                  className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none"
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="코스 설명을 입력하세요."
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>포함 수업 관리</CardTitle>
              <CardDescription>
                현재 포함 수업을 먼저 확인한 뒤, 선택 가능한 수업에서 추가하거나 현재 포함 수업 목록에서 제거합니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">현재 포함 수업</p>
                    <p className="mt-1 text-lg font-black text-slate-950">
                      {selectedClasses.length}개 수업 · {selectedLessonCount}개 레슨
                    </p>
                  </div>
                  <Badge variant={selectedClasses.length ? "success" : "slate"}>
                    {selectedClasses.length ? "수업 선택됨" : "수업 없음"}
                  </Badge>
                </div>
                <div className="mt-4 space-y-3">
                  {selectedClasses.map((courseClass, index) => (
                    <div key={courseClass.id} className="rounded-2xl bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                            #{index + 1} · {courseClass.language} · {courseClass.course}
                          </p>
                          <p className="mt-1 font-black text-slate-950">{courseClass.className}</p>
                          <p className="mt-1 text-xs font-semibold text-slate-500">
                            레슨 {courseClass.lessons.length}개 · {courseClass.visibility} · {courseClass.updatedAt}
                          </p>
                        </div>
                        <Button type="button" variant="outline" size="sm" onClick={() => removeClass(courseClass.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          제거
                        </Button>
                      </div>
                    </div>
                  ))}
                  {selectedClasses.length === 0 && (
                    <p className="rounded-2xl bg-white p-4 text-sm font-semibold text-slate-500">
                      현재 포함된 수업이 없습니다. 아래 목록에서 + 수업 추가를 선택하세요.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(220px,1fr)_180px]">
                <label className="text-sm font-bold text-slate-600">
                  수업 검색
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      placeholder="언어, 코스, 수업명, 수업 ID"
                      value={classQuery}
                      onChange={(event) => setClassQuery(event.target.value)}
                    />
                  </div>
                </label>
                <label>
                  <FieldLabel>수업 언어</FieldLabel>
                  <FormSelect value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)}>
                    {classLanguageOptions.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </FormSelect>
                </label>
              </div>

              <div className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4">
                <p className="mb-3 font-black text-slate-900">선택 가능한 수업</p>
                <div className="grid gap-3 lg:grid-cols-2">
                  {availableClasses.map((courseClass) => {
                    const selected = form.selectedClassIds.includes(courseClass.id);

                    return (
                      <button
                        key={courseClass.id}
                        type="button"
                        onClick={() => toggleClass(courseClass.id)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selected ? "border-indigo-300 bg-indigo-50" : "border-white bg-white hover:border-indigo-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {courseClass.language} · {courseClass.course}
                            </p>
                            <p className="mt-1 font-black text-slate-950">{courseClass.className}</p>
                            <p className="mt-1 text-xs font-semibold text-slate-500">
                              레슨 {courseClass.lessons.length}개 · {courseClass.visibility}
                            </p>
                          </div>
                          <Badge variant={selected ? "success" : "slate"}>
                            {selected ? "추가됨" : "+ 수업 추가"}
                          </Badge>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpenCheck className="h-5 w-5 text-indigo-500" />
                <CardTitle>저장 요약</CardTitle>
              </div>
              <CardDescription>저장 후 코스 상세 화면으로 이동합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SummaryRow label="언어" value={form.language} />
              <SummaryRow label="코스명" value={form.name || "-"} strong />
              <SummaryRow label="디지털 가격" value={formatWon(form.digitalPrice)} />
              <SummaryRow label="페이퍼+디지털 가격" value={formatWon(form.paperDigitalPrice)} />
              <div className="flex flex-wrap gap-2">
                <Badge variant={form.digitalIsSelling ? "success" : "slate"}>디지털 {form.digitalIsSelling ? "판매 ON" : "판매 OFF"}</Badge>
                <Badge variant={form.paperDigitalIsSelling ? "success" : "slate"}>페이퍼+디지털 {form.paperDigitalIsSelling ? "판매 ON" : "판매 OFF"}</Badge>
                <Badge variant="warning">페이퍼+디지털 배송 필요</Badge>
              </div>
              <SummaryRow label="수업 / 레슨" value={`${selectedClasses.length}개 / ${selectedLessonCount}개`} />
              <div className="h-px bg-slate-100" />
              <div className="flex flex-wrap gap-2">
                <Badge variant={getSalesStatusTone(form.salesStatus)}>{form.salesStatus}</Badge>
                <Badge variant={form.visibility === "공개" ? "success" : "slate"}>{form.visibility}</Badge>
              </div>
              {saveMessage ? <p className="rounded-2xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{saveMessage}</p> : null}
              <Button type="button" className="w-full" onClick={handleSave} disabled={validationMessages.length > 0}>
                <Save className="h-4 w-4" />
                {mode === "create" ? "코스 생성" : "코스 수정"}
              </Button>
              <p className="text-xs font-semibold leading-5 text-slate-500">
                Mock 화면에서는 저장값을 URL에 담아 상세 화면 미리보기로 이동합니다. 실제 API 연결 시 이 버튼은 저장 API 성공 후 상세로 이동합니다.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-500" />
                <CardTitle>권한 미리보기</CardTitle>
              </div>
              <CardDescription>선택된 포함 수업 기준으로 권한 범위를 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {selectedClasses.map((courseClass) => (
                <div key={courseClass.id} className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-4">
                  <p className="font-black text-slate-950">{courseClass.className}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {courseClass.language} / {courseClass.course} · 레슨 {courseClass.lessons.length}개 접근 권한
                  </p>
                </div>
              ))}
              {selectedClasses.length === 0 && (
                <p className="text-sm font-semibold text-slate-500">수업을 선택하면 권한 미리보기가 표시됩니다.</p>
              )}
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
                {validationMessages.map((message) => (
                  <li key={message}>• {message}</li>
                ))}
                {validationMessages.length === 0 && <li className="text-emerald-700">• 저장 가능한 상태입니다.</li>}
              </ul>
            </CardContent>
          </Card>
        </aside>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>현재 포함 수업 테이블</CardTitle>
          <CardDescription>코스 저장 시 포함될 수업의 언어, 코스, 레슨 수와 공개상태를 표로 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>순서</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>상위 코스</TableHead>
                <TableHead>수업명</TableHead>
                <TableHead>레슨 수</TableHead>
                <TableHead>공개상태</TableHead>
                <TableHead>관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedClasses.map((courseClass, index) => (
                <TableRow key={courseClass.id}>
                  <TableCell>#{index + 1}</TableCell>
                  <TableCell>{courseClass.language}</TableCell>
                  <TableCell>{courseClass.course}</TableCell>
                  <TableCell className="font-bold text-slate-900">{courseClass.className}</TableCell>
                  <TableCell>{courseClass.lessons.length}개</TableCell>
                  <TableCell>
                    <Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button type="button" variant="outline" size="sm" onClick={() => removeClass(courseClass.id)}>
                      제거
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {selectedClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center font-semibold text-slate-500">
                    현재 포함 수업이 없습니다.
                  </TableCell>
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
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className={`text-right text-sm ${strong ? "font-black text-slate-950" : "font-semibold text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

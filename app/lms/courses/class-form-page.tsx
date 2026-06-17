"use client";

import { ArrowDown, ArrowLeft, ArrowUp, BookOpen, FileText, Plus, Save, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { hasLessonAudio, hasLessonQuiz, hasLessonVideo, lessonFormLanguageOptions, lessons, type Lesson } from "../lessons/data";
import type { ClassQuizStatus } from "./data";

type SectionDraft = { id: string; sectionName: string; lessonIds: string[] };

const initialForm = {
  language: lessonFormLanguageOptions[0] ?? "일본어",
  className: "",
  description: "",
  classQuizStatus: "미사용" as ClassQuizStatus,
};

const initialLessonFilters = { query: "", language: "전체" };
const createSection = (index: number): SectionDraft => ({ id: `draft-section-${Date.now()}-${index}`, sectionName: "", lessonIds: [] });

function MediaBadge({ active, label }: { active: boolean; label: string }) {
  return <Badge variant={active ? "success" : "slate"}>{active ? `${label} 포함` : `${label} 없음`}</Badge>;
}

function LessonMediaCells({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <TableCell>{lesson.blockIds.length}개</TableCell>
      <TableCell><MediaBadge active={hasLessonVideo(lesson)} label="영상" /></TableCell>
      <TableCell><MediaBadge active={hasLessonAudio(lesson)} label="오디오" /></TableCell>
      <TableCell><MediaBadge active={hasLessonQuiz(lesson)} label="퀴즈 링크" /></TableCell>
    </>
  );
}

function moveItem<T>(items: T[], index: number, direction: "up" | "down") {
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export function ClassFormPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [lessonFilters, setLessonFilters] = useState(initialLessonFilters);
  const [sections, setSections] = useState<SectionDraft[]>([{ id: "draft-section-1", sectionName: "", lessonIds: [] }]);
  const [activeSectionId, setActiveSectionId] = useState("draft-section-1");
  const [saveMessage, setSaveMessage] = useState("");

  const selectedLessonCount = sections.reduce((sum, section) => sum + section.lessonIds.length, 0);
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  const validationMessages = useMemo(
    () => [
      !form.language.trim() ? "언어를 선택해야 저장할 수 있습니다." : "",
      !form.className.trim() ? "수업명을 입력해야 저장할 수 있습니다." : "",
      sections.length === 0 ? "섹션을 1개 이상 추가해야 합니다." : "",
      sections.some((section) => !section.sectionName.trim()) ? "모든 섹션명을 입력해야 합니다." : "",
      selectedLessonCount === 0 ? "섹션 안에 레슨을 1개 이상 추가해야 수업을 저장할 수 있습니다." : "",
    ].filter(Boolean),
    [form.className, form.language, sections, selectedLessonCount],
  );

  const filteredLessons = useMemo(() => {
    const keyword = lessonFilters.query.trim().toLowerCase();
    return lessons.filter((lesson) => {
      const matchesKeyword = keyword ? lesson.lessonName.toLowerCase().includes(keyword) : true;
      const matchesLanguage = lessonFilters.language === "전체" ? true : lesson.language === lessonFilters.language;
      return matchesKeyword && matchesLanguage;
    });
  }, [lessonFilters]);

  const updateForm = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const updateLessonFilter = (key: keyof typeof lessonFilters, value: string) => setLessonFilters((current) => ({ ...current, [key]: value }));
  const updateSection = (sectionId: string, value: string) => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, sectionName: value } : section));
  const addSection = () => {
    const next = createSection(sections.length + 1);
    setSections((current) => [...current, next]);
    setActiveSectionId(next.id);
  };
  const removeSection = (sectionId: string) => setSections((current) => {
    const next = current.filter((section) => section.id !== sectionId);
    if (activeSectionId === sectionId) setActiveSectionId(next[0]?.id ?? "");
    return next;
  });
  const moveSection = (sectionId: string, direction: "up" | "down") => setSections((current) => moveItem(current, current.findIndex((section) => section.id === sectionId), direction));
  const addLesson = (lessonId: string) => {
    if (!activeSection) return;
    setSections((current) => current.map((section) => section.id === activeSection.id && !section.lessonIds.includes(lessonId) ? { ...section, lessonIds: [...section.lessonIds, lessonId] } : section));
  };
  const removeLesson = (sectionId: string, lessonId: string) => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, lessonIds: section.lessonIds.filter((id) => id !== lessonId) } : section));
  const moveLesson = (sectionId: string, lessonId: string, direction: "up" | "down") => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, lessonIds: moveItem(section.lessonIds, section.lessonIds.indexOf(lessonId), direction) } : section));

  const handleSave = () => {
    if (validationMessages.length) {
      setSaveMessage("필수값, 섹션명, 섹션 내 레슨을 확인한 뒤 저장할 수 있습니다.");
      return;
    }
    setSaveMessage("수업 생성 입력값이 저장되었습니다. Mock 화면이므로 목록 데이터는 서버 저장 후 반영됩니다.");
    router.push("/lms/courses");
  };

  return (
    <>
      <PageHeader eyebrow="LMS management" title="수업 생성" description="수업 기본 정보를 입력하고, 수업 안에서 섹션을 만든 뒤 각 섹션에 레슨을 추가합니다." action={<Link href="/lms/courses" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"><ArrowLeft className="h-4 w-4" />목록으로</Link>} />
      <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><FileText className="h-5 w-5 text-indigo-500" /><CardTitle>기본 정보</CardTitle></div><CardDescription>수업명, 언어, 설명/메모와 수업 퀴즈 사용 여부를 설정합니다.</CardDescription></CardHeader>
          <CardContent className="space-y-5">
            <label className="block text-sm font-bold text-slate-600">수업명<input className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="예: 독일어 1단계" value={form.className} onChange={(event) => updateForm("className", event.target.value)} /></label>
            <label className="block text-sm font-bold text-slate-600">언어<select className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" value={form.language} onChange={(event) => updateForm("language", event.target.value)}>{lessonFormLanguageOptions.map((language) => <option key={language}>{language}</option>)}</select></label>
            <label className="block text-sm font-bold text-slate-600">설명/메모<textarea className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="관리자가 확인할 수업 설명 또는 내부 메모를 입력하세요." value={form.description} onChange={(event) => updateForm("description", event.target.value)} /></label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-600">수업 퀴즈 사용 여부</p><div className="mt-3 flex gap-2">{(["미사용", "사용"] as ClassQuizStatus[]).map((status) => <Button key={status} type="button" variant={form.classQuizStatus === status ? "default" : "outline"} onClick={() => updateForm("classQuizStatus", status)}>{status}</Button>)}</div><p className="mt-2 text-xs text-slate-500">레슨 안의 Quizlet 링크 블록과 별개의 수업 단위 퀴즈 설정입니다.</p></div>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500" /><CardTitle>섹션 구성</CardTitle></div><Button type="button" onClick={addSection}><Plus className="h-4 w-4" />섹션 추가</Button></div><CardDescription>섹션은 독립 메뉴가 아니라 수업 안에서 생성/관리되는 하위 구성 단위입니다.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
              {sections.map((section, sectionIndex) => {
                const sectionLessons = section.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter((lesson): lesson is Lesson => Boolean(lesson));
                return <div key={section.id} className={`rounded-3xl border p-4 ${activeSectionId === section.id ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200 bg-white"}`}>
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center"><button type="button" className="text-left text-sm font-black text-indigo-700" onClick={() => setActiveSectionId(section.id)}>섹션 {sectionIndex + 1}</button><input className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" placeholder="섹션명 예: 1~5일차" value={section.sectionName} onChange={(event) => updateSection(section.id, event.target.value)} /><div className="flex gap-1"><Button type="button" size="sm" variant="outline" disabled={sectionIndex === 0} onClick={() => moveSection(section.id, "up")}><ArrowUp className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" disabled={sectionIndex === sections.length - 1} onClick={() => moveSection(section.id, "down")}><ArrowDown className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" onClick={() => removeSection(section.id)}><Trash2 className="h-3.5 w-3.5" />삭제</Button></div></div>
                  <div className="mt-3 space-y-2">{sectionLessons.map((lesson, lessonIndex) => <div key={lesson.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm"><span className="font-bold text-slate-900">{lessonIndex + 1}. {lesson.lessonName}</span><span className="text-slate-500">{lesson.language}</span><Button type="button" size="sm" variant="outline" disabled={lessonIndex === 0} onClick={() => moveLesson(section.id, lesson.id, "up")}><ArrowUp className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" disabled={lessonIndex === sectionLessons.length - 1} onClick={() => moveLesson(section.id, lesson.id, "down")}><ArrowDown className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" onClick={() => removeLesson(section.id, lesson.id)}><Trash2 className="h-3.5 w-3.5" />제거</Button></div>)}{sectionLessons.length === 0 ? <p className="rounded-2xl bg-white px-3 py-4 text-sm font-semibold text-slate-500">이 섹션에 추가된 레슨이 없습니다. 아래 레슨 검색에서 이 섹션을 선택하고 추가하세요.</p> : null}</div>
                </div>;
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><div className="flex items-center gap-2"><Search className="h-5 w-5 text-indigo-500" /><CardTitle>레슨 검색/추가</CardTitle></div><CardDescription>추가 대상 섹션: <strong>{activeSection?.sectionName || "섹션명 미입력"}</strong></CardDescription></CardHeader>
            <CardContent><div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.6fr)]"><label className="text-sm font-bold text-slate-600">레슨명 검색<div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2"><Search className="h-4 w-4 text-slate-400" /><input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="레슨명을 입력하세요" value={lessonFilters.query} onChange={(event) => updateLessonFilter("query", event.target.value)} /></div></label><label className="text-sm font-bold text-slate-600">언어 필터<select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={lessonFilters.language} onChange={(event) => updateLessonFilter("language", event.target.value)}><option>전체</option>{lessonFormLanguageOptions.map((language) => <option key={language}>{language}</option>)}</select></label></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>레슨명</TableHead><TableHead>언어</TableHead><TableHead>블록 수</TableHead><TableHead>영상 블록 포함 여부</TableHead><TableHead>오디오 블록 포함 여부</TableHead><TableHead>퀴즈 링크 블록 포함 여부</TableHead><TableHead>선택</TableHead></TableRow></TableHeader><TableBody>{filteredLessons.map((lesson) => { const isSelected = activeSection?.lessonIds.includes(lesson.id) ?? false; return <TableRow key={lesson.id}><TableCell className="min-w-36 font-bold text-slate-900">{lesson.lessonName}</TableCell><TableCell>{lesson.language}</TableCell><LessonMediaCells lesson={lesson} /><TableCell><Button type="button" size="sm" variant={isSelected ? "outline" : "default"} disabled={isSelected || !activeSection} onClick={() => addLesson(lesson.id)}><Plus className="h-3.5 w-3.5" />{isSelected ? "추가됨" : "추가"}</Button></TableCell></TableRow>; })}</TableBody></Table></div></CardContent>
          </Card>
        </div>
      </div>
      <Card className="mt-6"><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold text-slate-900">저장 전 확인</p><p className="mt-1 text-sm text-slate-500">수업 기본 정보, 섹션명, 섹션 내 레슨 구성이 필요합니다.</p>{validationMessages.length > 0 ? <ul className="mt-3 list-disc pl-5 text-sm font-semibold text-rose-600">{validationMessages.map((message) => <li key={message}>{message}</li>)}</ul> : null}{saveMessage ? <p className="mt-3 text-sm font-semibold text-indigo-600">{saveMessage}</p> : null}</div><Button type="button" size="lg" onClick={handleSave}><Save className="h-4 w-4" />수업 저장</Button></CardContent></Card>
    </>
  );
}

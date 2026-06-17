"use client";

import { ArrowDown, ArrowLeft, ArrowUp, BookOpen, CalendarDays, GraduationCap, Languages, ListChecks, Pencil, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { hasLessonAudio, hasLessonQuiz, hasLessonVideo, lessonFormLanguageOptions, lessons, type Lesson } from "../../lessons/data";
import { courseClasses, type ClassQuizStatus } from "../data";

type EditableSection = { id: string; sectionName: string; lessonIds: string[] };

function InfoCard({ icon: Icon, label, value }: { icon: typeof Languages; label: string; value: string }) {
  return <Card><CardContent className="flex h-full items-start gap-3 p-5"><div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><Icon className="h-5 w-5" /></div><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p></div></CardContent></Card>;
}

function MediaBadge({ active, label }: { active: boolean; label: string }) {
  return <Badge variant={active ? "success" : "slate"}>{active ? `${label} 포함` : `${label} 없음`}</Badge>;
}

function moveItem<T>(items: T[], index: number, direction: "up" | "down") {
  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
  return next;
}

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseClass = courseClasses.find((item) => item.id === params.courseId) ?? courseClasses[0];
  const [classQuizStatus, setClassQuizStatus] = useState<ClassQuizStatus>(courseClass.classQuizStatus);
  const [sections, setSections] = useState<EditableSection[]>(courseClass.sections.map((section) => ({ id: section.id, sectionName: section.sectionName, lessonIds: section.lessons.map((lesson) => lesson.id) })));
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("전체");
  const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id ?? "");
  const selectedLessonCount = sections.reduce((sum, section) => sum + section.lessonIds.length, 0);
  const activeSection = sections.find((section) => section.id === activeSectionId) ?? sections[0];

  const filteredLessons = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return lessons.filter((lesson) => (keyword ? lesson.lessonName.toLowerCase().includes(keyword) : true) && (language === "전체" ? true : lesson.language === language));
  }, [language, query]);

  const addSection = () => {
    const next = { id: `${courseClass.id}-NEW-${Date.now()}`, sectionName: "새 섹션", lessonIds: [] };
    setSections((current) => [...current, next]);
    setActiveSectionId(next.id);
  };
  const updateSectionName = (sectionId: string, sectionName: string) => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, sectionName } : section));
  const removeSection = (sectionId: string) => setSections((current) => {
    const next = current.filter((section) => section.id !== sectionId);
    if (activeSectionId === sectionId) setActiveSectionId(next[0]?.id ?? "");
    return next;
  });
  const moveSection = (sectionId: string, direction: "up" | "down") => setSections((current) => moveItem(current, current.findIndex((section) => section.id === sectionId), direction));
  const addLesson = (lessonId: string) => activeSection && setSections((current) => current.map((section) => section.id === activeSection.id && !section.lessonIds.includes(lessonId) ? { ...section, lessonIds: [...section.lessonIds, lessonId] } : section));
  const removeLesson = (sectionId: string, lessonId: string) => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, lessonIds: section.lessonIds.filter((id) => id !== lessonId) } : section));
  const moveLesson = (sectionId: string, lessonId: string, direction: "up" | "down") => setSections((current) => current.map((section) => section.id === sectionId ? { ...section, lessonIds: moveItem(section.lessonIds, section.lessonIds.indexOf(lessonId), direction) } : section));

  return (
    <>
      <PageHeader eyebrow="LMS management" title="수업 상세/수정" description="수업 안에서 섹션과 섹션별 레슨 구성을 확인하고 수정합니다." action={<div className="flex flex-wrap gap-2"><Link href="/lms/courses" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"><ArrowLeft className="h-4 w-4" />목록으로</Link><Button type="button"><Pencil className="h-4 w-4" />Mock 수정 저장</Button></div>} />
      <section className="mb-6 grid gap-4 md:grid-cols-5"><InfoCard icon={Languages} label="언어" value={courseClass.language} /><InfoCard icon={ListChecks} label="섹션 수" value={`${sections.length}개`} /><InfoCard icon={BookOpen} label="포함 레슨 수" value={`${selectedLessonCount}개`} /><InfoCard icon={GraduationCap} label="수업 퀴즈" value={classQuizStatus} /><InfoCard icon={CalendarDays} label="수정일" value={courseClass.updatedAt} /></section>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card><CardHeader><CardTitle>수업 정보</CardTitle><CardDescription>코스 정보 없이 수업 단위 정보만 표시합니다.</CardDescription></CardHeader><CardContent className="space-y-5"><div><p className="text-sm font-bold text-slate-500">수업명</p><p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{courseClass.className}</p></div><div><p className="text-sm font-bold text-slate-500">설명/메모</p><p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">{courseClass.description}</p></div><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-600">수업 퀴즈 사용 여부</p><div className="mt-3 flex gap-2">{(["미사용", "사용"] as ClassQuizStatus[]).map((status) => <Button key={status} type="button" variant={classQuizStatus === status ? "default" : "outline"} onClick={() => setClassQuizStatus(status)}>{status}</Button>)}</div></div></CardContent></Card>
        <Card><CardHeader><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-indigo-500" /><CardTitle>섹션</CardTitle></div><Button type="button" onClick={addSection}><Plus className="h-4 w-4" />섹션 추가</Button></div><CardDescription>섹션명 수정, 추가, 삭제, 순서 변경과 섹션 내 레슨 조정이 가능합니다.</CardDescription></CardHeader><CardContent className="space-y-4">{sections.map((section, sectionIndex) => { const sectionLessons = section.lessonIds.map((id) => lessons.find((lesson) => lesson.id === id)).filter((lesson): lesson is Lesson => Boolean(lesson)); return <div key={section.id} className={`rounded-3xl border p-4 ${activeSectionId === section.id ? "border-indigo-200 bg-indigo-50/50" : "border-slate-200 bg-white"}`}><div className="flex flex-col gap-3 xl:flex-row xl:items-center"><button type="button" onClick={() => setActiveSectionId(section.id)} className="text-left font-black text-indigo-700">{sectionIndex + 1}.</button><input className="h-10 flex-1 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={section.sectionName} onChange={(event) => updateSectionName(section.id, event.target.value)} /><div className="flex gap-1"><Button type="button" size="sm" variant="outline" disabled={sectionIndex === 0} onClick={() => moveSection(section.id, "up")}><ArrowUp className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" disabled={sectionIndex === sections.length - 1} onClick={() => moveSection(section.id, "down")}><ArrowDown className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" onClick={() => removeSection(section.id)}><Trash2 className="h-3.5 w-3.5" />삭제</Button></div></div><ul className="mt-3 space-y-2">{sectionLessons.map((lesson, lessonIndex) => <li key={lesson.id} className="flex flex-wrap items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm shadow-sm"><span className="font-bold text-slate-900">{lessonIndex + 1}. {lesson.lessonName}</span><span className="text-slate-500">{lesson.language}</span><Button type="button" size="sm" variant="outline" disabled={lessonIndex === 0} onClick={() => moveLesson(section.id, lesson.id, "up")}><ArrowUp className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" disabled={lessonIndex === sectionLessons.length - 1} onClick={() => moveLesson(section.id, lesson.id, "down")}><ArrowDown className="h-3.5 w-3.5" /></Button><Button type="button" size="sm" variant="outline" onClick={() => removeLesson(section.id, lesson.id)}><Trash2 className="h-3.5 w-3.5" />제거</Button><Link href={`/lms/lessons/${lesson.id}`} className="text-xs font-bold text-indigo-600 underline">상세</Link></li>)}</ul></div>; })}</CardContent></Card>
      </div>
      <Card className="mt-6"><CardHeader><div className="flex items-center gap-2"><Search className="h-5 w-5 text-indigo-500" /><CardTitle>섹션 내 레슨 추가</CardTitle></div><CardDescription>추가 대상 섹션: <strong>{activeSection?.sectionName}</strong></CardDescription></CardHeader><CardContent><div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.6fr)]"><label className="text-sm font-bold text-slate-600">레슨명 검색<input className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={query} onChange={(event) => setQuery(event.target.value)} /></label><label className="text-sm font-bold text-slate-600">언어 필터<select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={language} onChange={(event) => setLanguage(event.target.value)}><option>전체</option>{lessonFormLanguageOptions.map((item) => <option key={item}>{item}</option>)}</select></label></div><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>레슨명</TableHead><TableHead>언어</TableHead><TableHead>블록 수</TableHead><TableHead>영상</TableHead><TableHead>오디오</TableHead><TableHead>퀴즈 링크</TableHead><TableHead>추가</TableHead></TableRow></TableHeader><TableBody>{filteredLessons.map((lesson) => { const selected = activeSection?.lessonIds.includes(lesson.id); return <TableRow key={lesson.id}><TableCell className="font-bold text-slate-900">{lesson.lessonName}</TableCell><TableCell>{lesson.language}</TableCell><TableCell>{lesson.blockIds.length}개</TableCell><TableCell><MediaBadge active={hasLessonVideo(lesson)} label="영상" /></TableCell><TableCell><MediaBadge active={hasLessonAudio(lesson)} label="오디오" /></TableCell><TableCell><MediaBadge active={hasLessonQuiz(lesson)} label="퀴즈 링크" /></TableCell><TableCell><Button type="button" size="sm" variant={selected ? "outline" : "default"} disabled={selected || !activeSection} onClick={() => addLesson(lesson.id)}><Plus className="h-3.5 w-3.5" />{selected ? "추가됨" : "추가"}</Button></TableCell></TableRow>; })}</TableBody></Table></div></CardContent></Card>
    </>
  );
}

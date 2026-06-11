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

const initialForm = {
  language: lessonFormLanguageOptions[0] ?? "일본어",
  className: "",
  description: "",
};

const initialLessonFilters = {
  query: "",
  language: "전체",
};

function MediaBadge({ active, label }: { active: boolean; label: string }) {
  return <Badge variant={active ? "success" : "slate"}>{active ? `${label} 등록` : `${label} 없음`}</Badge>;
}

function LessonMediaCells({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <TableCell><MediaBadge active={hasLessonVideo(lesson)} label="영상" /></TableCell>
      <TableCell><MediaBadge active={hasLessonAudio(lesson)} label="오디오" /></TableCell>
      <TableCell><MediaBadge active={hasLessonQuiz(lesson)} label="퀴즈" /></TableCell>
    </>
  );
}

export function ClassFormPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [lessonFilters, setLessonFilters] = useState(initialLessonFilters);
  const [selectedLessonIds, setSelectedLessonIds] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState("");

  const selectedLessons = useMemo(
    () => selectedLessonIds
      .map((lessonId) => lessons.find((lesson) => lesson.id === lessonId))
      .filter((lesson): lesson is Lesson => Boolean(lesson)),
    [selectedLessonIds],
  );

  const validationMessages = useMemo(
    () => [
      !form.language.trim() ? "언어를 선택해야 저장할 수 있습니다." : "",
      !form.className.trim() ? "수업명을 입력해야 저장할 수 있습니다." : "",
      selectedLessonIds.length === 0 ? "레슨을 1개 이상 선택해야 수업을 저장할 수 있습니다." : "",
    ].filter(Boolean),
    [form.className, form.language, selectedLessonIds.length],
  );

  const filteredLessons = useMemo(() => {
    const keyword = lessonFilters.query.trim().toLowerCase();

    return lessons.filter((lesson) => {
      const matchesKeyword = keyword ? lesson.lessonName.toLowerCase().includes(keyword) : true;
      const matchesLanguage = lessonFilters.language === "전체" ? true : lesson.language === lessonFilters.language;

      return matchesKeyword && matchesLanguage;
    });
  }, [lessonFilters]);

  const updateForm = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateLessonFilter = (key: keyof typeof lessonFilters, value: string) => {
    setLessonFilters((current) => ({ ...current, [key]: value }));
  };

  const addLesson = (lessonId: string) => {
    setSaveMessage("");
    setSelectedLessonIds((current) => current.includes(lessonId) ? current : [...current, lessonId]);
  };

  const removeLesson = (lessonId: string) => {
    setSaveMessage("");
    setSelectedLessonIds((current) => current.filter((selectedLessonId) => selectedLessonId !== lessonId));
  };

  const moveLesson = (lessonId: string, direction: "up" | "down") => {
    setSaveMessage("");
    setSelectedLessonIds((current) => {
      const currentIndex = current.indexOf(lessonId);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
      return next;
    });
  };

  const handleSave = () => {
    if (validationMessages.length) {
      setSaveMessage("필수값을 입력하고 레슨을 1개 이상 선택한 뒤 저장할 수 있습니다.");
      return;
    }

    setSaveMessage("수업 생성 입력값이 저장되었습니다. Mock 화면이므로 목록 데이터는 서버 저장 후 반영됩니다.");
    router.push("/lms/courses");
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="수업 생성"
        description="수업명과 언어를 입력하고, 수업에 포함할 레슨을 1개 이상 선택합니다."
        action={
          <Link
            href="/lms/courses"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <CardTitle>기본 정보</CardTitle>
            </div>
            <CardDescription>언어, 수업명, 설명/메모만 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="block text-sm font-bold text-slate-600">
              언어
              <select
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                value={form.language}
                onChange={(event) => updateForm("language", event.target.value)}
              >
                {lessonFormLanguageOptions.map((language) => (
                  <option key={language}>{language}</option>
                ))}
              </select>
            </label>
            <label className="block text-sm font-bold text-slate-600">
              수업명
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="예: 일본어 1단계 / 영어 리스닝 1단계"
                value={form.className}
                onChange={(event) => updateForm("className", event.target.value)}
              />
            </label>
            <label className="block text-sm font-bold text-slate-600">
              설명/메모
              <textarea
                className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="관리자가 확인할 수업 설명 또는 내부 메모를 입력하세요."
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
              />
            </label>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-500" />
                <CardTitle>레슨 검색</CardTitle>
              </div>
              <CardDescription>레슨명과 언어로 검색한 뒤 수업에 추가합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1.4fr)_minmax(140px,0.6fr)]">
                <label className="text-sm font-bold text-slate-600">
                  레슨명 검색
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                      className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                      placeholder="레슨명을 입력하세요"
                      value={lessonFilters.query}
                      onChange={(event) => updateLessonFilter("query", event.target.value)}
                    />
                  </div>
                </label>
                <label className="text-sm font-bold text-slate-600">
                  언어 필터
                  <select
                    className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none"
                    value={lessonFilters.language}
                    onChange={(event) => updateLessonFilter("language", event.target.value)}
                  >
                    <option>전체</option>
                    {lessonFormLanguageOptions.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>레슨명</TableHead>
                      <TableHead>언어</TableHead>
                      <TableHead>영상 등록 여부</TableHead>
                      <TableHead>오디오 등록 여부</TableHead>
                      <TableHead>퀴즈 링크 등록 여부</TableHead>
                      <TableHead>선택</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLessons.map((lesson) => {
                      const isSelected = selectedLessonIds.includes(lesson.id);

                      return (
                        <TableRow key={lesson.id}>
                          <TableCell className="min-w-36 font-bold text-slate-900">{lesson.lessonName}</TableCell>
                          <TableCell>{lesson.language}</TableCell>
                          <LessonMediaCells lesson={lesson} />
                          <TableCell>
                            <Button type="button" size="sm" variant={isSelected ? "outline" : "default"} disabled={isSelected} onClick={() => addLesson(lesson.id)}>
                              <Plus className="h-3.5 w-3.5" />
                              {isSelected ? "선택됨" : "추가"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredLessons.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="py-10 text-center font-semibold text-slate-500">
                          검색 조건에 맞는 레슨이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                <CardTitle>선택한 레슨 목록</CardTitle>
              </div>
              <CardDescription>수업에 포함할 레슨 순서를 조정하거나 제거합니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>순서</TableHead>
                    <TableHead>레슨명</TableHead>
                    <TableHead>언어</TableHead>
                    <TableHead>영상 등록 여부</TableHead>
                    <TableHead>오디오 등록 여부</TableHead>
                    <TableHead>퀴즈 링크 등록 여부</TableHead>
                    <TableHead>순서 변경</TableHead>
                    <TableHead>제거</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedLessons.map((lesson, index) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-semibold text-slate-900">{index + 1}</TableCell>
                      <TableCell className="min-w-36 font-bold text-slate-900">{lesson.lessonName}</TableCell>
                      <TableCell>{lesson.language}</TableCell>
                      <LessonMediaCells lesson={lesson} />
                      <TableCell>
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="outline" disabled={index === 0} onClick={() => moveLesson(lesson.id, "up")} aria-label="위로 이동">
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" size="sm" variant="outline" disabled={index === selectedLessons.length - 1} onClick={() => moveLesson(lesson.id, "down")} aria-label="아래로 이동">
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button type="button" size="sm" variant="outline" onClick={() => removeLesson(lesson.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          제거
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedLessons.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center font-semibold text-slate-500">
                        아직 선택한 레슨이 없습니다. 레슨을 1개 이상 추가해야 저장할 수 있습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-900">저장 전 확인</p>
            <p className="mt-1 text-sm text-slate-500">언어, 수업명, 선택한 레슨 1개 이상이 모두 필요합니다.</p>
            {validationMessages.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 text-sm font-semibold text-rose-600">
                {validationMessages.map((message) => <li key={message}>{message}</li>)}
              </ul>
            ) : null}
            {saveMessage ? <p className="mt-3 text-sm font-semibold text-indigo-600">{saveMessage}</p> : null}
          </div>
          <Button type="button" size="lg" onClick={handleSave}>
            <Save className="h-4 w-4" />
            수업 저장
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

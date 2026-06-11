"use client";

import { ArrowLeft, FileText, Headphones, Link2, MonitorPlay, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { lessonFormLanguageOptions } from "./data";

type LessonFormState = {
  lessonName: string;
  language: string;
  description: string;
  videoUrl: string;
  audioUrl: string;
  quizUrl: string;
};

const initialForm: LessonFormState = {
  lessonName: "",
  language: lessonFormLanguageOptions[0] ?? "일본어",
  description: "",
  videoUrl: "",
  audioUrl: "",
  quizUrl: "",
};

export function LessonFormPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saveMessage, setSaveMessage] = useState("");

  const validationMessages = useMemo(
    () => [
      !form.lessonName.trim() ? "레슨명을 입력해야 저장할 수 있습니다." : "",
      !form.language.trim() ? "언어를 선택해야 저장할 수 있습니다." : "",
    ].filter(Boolean),
    [form.language, form.lessonName],
  );

  const updateForm = <K extends keyof LessonFormState>(key: K, value: LessonFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    if (validationMessages.length) {
      setSaveMessage("필수값을 입력한 뒤 저장할 수 있습니다.");
      return;
    }

    setSaveMessage("레슨 생성 입력값이 저장되었습니다. Mock 화면이므로 목록 데이터는 서버 저장 후 반영됩니다.");
    router.push("/lms/lessons");
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="레슨 생성"
        description="레슨은 수업/코스/패키지보다 먼저 만들어지는 독립 콘텐츠 단위입니다. 생성 시에는 레슨 자체 정보와 미디어 링크만 입력합니다."
        action={
          <Link
            href="/lms/lessons"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <CardTitle>기본 정보</CardTitle>
            </div>
            <CardDescription>상태, 코스, 수업, 패키지, 판매, 권한 설정은 이 화면에서 선택하지 않습니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <label className="block text-sm font-bold text-slate-600">
              레슨명
              <input
                className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="예: 1일차 / 공항에서 듣기"
                value={form.lessonName}
                onChange={(event) => updateForm("lessonName", event.target.value)}
              />
            </label>
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
              설명/메모
              <textarea
                className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                placeholder="관리자가 확인할 레슨 설명 또는 내부 메모를 입력하세요."
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
                <MonitorPlay className="h-5 w-5 text-indigo-500" />
                <CardTitle>영상 섹션</CardTitle>
              </div>
              <CardDescription>영상 URL 입력 시 상세 화면에서 video player로 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-bold text-slate-600">
                영상 URL
                <input
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="https://.../lesson-video.mp4"
                  value={form.videoUrl}
                  onChange={(event) => updateForm("videoUrl", event.target.value)}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-emerald-500" />
                <CardTitle>오디오 섹션</CardTitle>
              </div>
              <CardDescription>오디오 URL 입력 시 상세 화면에서 audio player로 표시합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-bold text-slate-600">
                오디오 URL
                <input
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="https://.../lesson-audio.mp3"
                  value={form.audioUrl}
                  onChange={(event) => updateForm("audioUrl", event.target.value)}
                />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-amber-500" />
                <CardTitle>퀴즈 섹션</CardTitle>
              </div>
              <CardDescription>퀴즈는 렌더링하지 않고 상세 화면에서 링크로만 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <label className="block text-sm font-bold text-slate-600">
                퀴즈 링크
                <input
                  className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  placeholder="https://.../quiz"
                  value={form.quizUrl}
                  onChange={(event) => updateForm("quizUrl", event.target.value)}
                />
              </label>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-900">저장 전 확인</p>
            <p className="mt-1 text-sm text-slate-500">
              이 화면에는 상태/공개 여부, 코스 선택, 수업 선택, 패키지 선택, 판매/권한 설정이 없습니다.
            </p>
            {validationMessages.length > 0 ? (
              <ul className="mt-3 list-disc pl-5 text-sm font-semibold text-rose-600">
                {validationMessages.map((message) => <li key={message}>{message}</li>)}
              </ul>
            ) : null}
            {saveMessage ? <p className="mt-3 text-sm font-semibold text-indigo-600">{saveMessage}</p> : null}
          </div>
          <Button type="button" size="lg" onClick={handleSave}>
            <Save className="h-4 w-4" />
            레슨 저장
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

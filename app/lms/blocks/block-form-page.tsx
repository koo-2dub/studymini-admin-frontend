"use client";

import { ArrowLeft, FileText, Save } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { blockFormLanguageOptions, blockTypeOptions, type BlockType } from "./data";

const initialForm = {
  blockName: "",
  language: blockFormLanguageOptions[0] ?? "일본어",
  type: "영상" as BlockType,
  mediaUrl: "",
  description: "",
};

function getMediaLabel(type: BlockType) {
  if (type === "영상") return "영상 URL";
  if (type === "오디오") return "오디오 URL";
  return "퀴즈 링크";
}

export function BlockFormPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [saveMessage, setSaveMessage] = useState("");

  const validationMessages = useMemo(() => [
    !form.blockName.trim() ? "블록명을 입력해야 저장할 수 있습니다." : "",
    !form.language.trim() ? "언어를 선택해야 저장할 수 있습니다." : "",
    !form.mediaUrl.trim() ? `${getMediaLabel(form.type)}을 입력해야 저장할 수 있습니다.` : "",
    form.mediaUrl.trim() && !/^https?:\/\//.test(form.mediaUrl.trim()) ? "URL은 http:// 또는 https://로 시작해야 합니다." : "",
  ].filter(Boolean), [form.blockName, form.language, form.mediaUrl, form.type]);

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSave = () => {
    if (validationMessages.length) {
      setSaveMessage("필수값을 입력한 뒤 저장할 수 있습니다.");
      return;
    }

    setSaveMessage("블록 생성 입력값이 저장되었습니다. Mock 화면이므로 목록 데이터는 서버 저장 후 반영됩니다.");
    router.push("/lms/blocks");
  };

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="블록 생성"
        description="레슨에서 조합할 영상·오디오·퀴즈 링크 블록을 먼저 등록합니다."
        action={
          <Link href="/lms/blocks" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <CardTitle>기본 정보</CardTitle>
          </div>
          <CardDescription>블록 유형에 따라 레슨 상세에서 video player, audio player 또는 링크 버튼으로 표시됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 lg:grid-cols-2">
          <label className="block text-sm font-bold text-slate-600">
            블록명
            <input className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="예: 본강의 영상 / 오늘의 회화 오디오" value={form.blockName} onChange={(event) => updateForm("blockName", event.target.value)} />
          </label>
          <label className="block text-sm font-bold text-slate-600">
            언어
            <select className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" value={form.language} onChange={(event) => updateForm("language", event.target.value)}>
              {blockFormLanguageOptions.map((language) => <option key={language}>{language}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-600">
            블록 유형
            <select className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" value={form.type} onChange={(event) => updateForm("type", event.target.value as BlockType)}>
              {blockTypeOptions.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="block text-sm font-bold text-slate-600">
            {getMediaLabel(form.type)}
            <input className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="https://..." value={form.mediaUrl} onChange={(event) => updateForm("mediaUrl", event.target.value)} />
          </label>
          <label className="block text-sm font-bold text-slate-600 lg:col-span-2">
            설명/메모
            <textarea className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="관리자가 확인할 블록 설명 또는 내부 메모를 입력하세요." value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
          </label>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-bold text-slate-900">저장 전 확인</p>
            <p className="mt-1 text-sm text-slate-500">블록명, 언어, 유형, URL이 모두 필요합니다.</p>
            {validationMessages.length > 0 ? <ul className="mt-3 list-disc pl-5 text-sm font-semibold text-rose-600">{validationMessages.map((message) => <li key={message}>{message}</li>)}</ul> : null}
            {saveMessage ? <p className="mt-3 text-sm font-semibold text-indigo-600">{saveMessage}</p> : null}
          </div>
          <Button type="button" size="lg" onClick={handleSave}>
            <Save className="h-4 w-4" />
            블록 저장
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

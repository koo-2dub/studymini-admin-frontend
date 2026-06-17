"use client";

import { ArrowDown, ArrowLeft, ArrowUp, FileText, Layers3, Plus, Save, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { blockLanguageOptions, blocks, type BlockType, type ContentBlock } from "../blocks/data";
import { lessonFormLanguageOptions } from "./data";

type LessonFormState = {
  lessonName: string;
  language: string;
  description: string;
};

const initialForm: LessonFormState = {
  lessonName: "",
  language: lessonFormLanguageOptions[0] ?? "일본어",
  description: "",
};

const initialBlockFilters = {
  query: "",
  language: "전체",
  type: "전체",
};

function BlockTypeBadge({ type }: { type: BlockType }) {
  const variant = type === "영상" ? "default" : type === "오디오" ? "success" : "warning";
  return <Badge variant={variant}>{type}</Badge>;
}

function MediaUrlBadge({ block }: { block: ContentBlock }) {
  return <Badge variant={block.mediaUrl.trim() ? "success" : "slate"}>{block.mediaUrl.trim() ? "URL 있음" : "URL 없음"}</Badge>;
}

export function LessonFormPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [blockFilters, setBlockFilters] = useState(initialBlockFilters);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState("");

  const selectedBlocks = useMemo(
    () => selectedBlockIds.map((blockId) => blocks.find((block) => block.id === blockId)).filter((block): block is ContentBlock => Boolean(block)),
    [selectedBlockIds],
  );

  const validationMessages = useMemo(
    () => [
      !form.lessonName.trim() ? "레슨명을 입력해야 저장할 수 있습니다." : "",
      !form.language.trim() ? "언어를 선택해야 저장할 수 있습니다." : "",
      selectedBlockIds.length === 0 ? "블록을 1개 이상 선택해야 레슨을 저장할 수 있습니다." : "",
    ].filter(Boolean),
    [form.language, form.lessonName, selectedBlockIds.length],
  );

  const filteredBlocks = useMemo(() => {
    const keyword = blockFilters.query.trim().toLowerCase();

    return blocks.filter((block) => {
      const matchesKeyword = keyword
        ? [block.blockName, block.language, block.type, block.mediaUrl, block.description].some((value) => value.toLowerCase().includes(keyword))
        : true;
      const matchesLanguage = blockFilters.language === "전체" ? true : block.language === blockFilters.language;
      const matchesType = blockFilters.type === "전체" ? true : block.type === blockFilters.type;

      return matchesKeyword && matchesLanguage && matchesType;
    });
  }, [blockFilters]);

  const updateForm = <K extends keyof LessonFormState>(key: K, value: LessonFormState[K]) => setForm((current) => ({ ...current, [key]: value }));
  const updateBlockFilter = (key: keyof typeof blockFilters, value: string) => setBlockFilters((current) => ({ ...current, [key]: value }));

  const addBlock = (blockId: string) => {
    setSaveMessage("");
    setSelectedBlockIds((current) => current.includes(blockId) ? current : [...current, blockId]);
  };

  const removeBlock = (blockId: string) => {
    setSaveMessage("");
    setSelectedBlockIds((current) => current.filter((selectedBlockId) => selectedBlockId !== blockId));
  };

  const moveBlock = (blockId: string, direction: "up" | "down") => {
    setSaveMessage("");
    setSelectedBlockIds((current) => {
      const currentIndex = current.indexOf(blockId);
      const nextIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (currentIndex < 0 || nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[currentIndex], next[nextIndex]] = [next[nextIndex], next[currentIndex]];
      return next;
    });
  };

  const handleSave = () => {
    if (validationMessages.length) {
      setSaveMessage("필수값을 입력하고 블록을 1개 이상 선택한 뒤 저장할 수 있습니다.");
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
        description="레슨은 등록된 블록을 검색해 순서대로 조합하는 독립 콘텐츠 단위입니다. 영상·오디오·퀴즈 링크는 블록 관리에서 먼저 등록합니다."
        action={
          <Link href="/lms/lessons" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
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
              <input className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="예: 1일차 / 공항에서 듣기" value={form.lessonName} onChange={(event) => updateForm("lessonName", event.target.value)} />
            </label>
            <label className="block text-sm font-bold text-slate-600">
              언어
              <select className="mt-2 h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" value={form.language} onChange={(event) => updateForm("language", event.target.value)}>
                {lessonFormLanguageOptions.map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
            <label className="block text-sm font-bold text-slate-600">
              설명/메모
              <textarea className="mt-2 min-h-36 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100" placeholder="관리자가 확인할 레슨 설명 또는 내부 메모를 입력하세요." value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
            </label>
            <Button asChild variant="outline" className="w-full">
              <Link href="/lms/blocks/create">
                <Plus className="h-4 w-4" />
                새 블록 먼저 등록하기
              </Link>
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-500" />
                <CardTitle>블록 검색</CardTitle>
              </div>
              <CardDescription>등록된 블록을 검색한 뒤 레슨에 추가합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-5 grid gap-4 lg:grid-cols-[minmax(220px,1.2fr)_minmax(130px,0.5fr)_minmax(130px,0.5fr)]">
                <label className="text-sm font-bold text-slate-600">
                  블록 검색
                  <div className="mt-2 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" placeholder="블록명, URL, 설명" value={blockFilters.query} onChange={(event) => updateBlockFilter("query", event.target.value)} />
                  </div>
                </label>
                <label className="text-sm font-bold text-slate-600">
                  언어
                  <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={blockFilters.language} onChange={(event) => updateBlockFilter("language", event.target.value)}>
                    {blockLanguageOptions.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
                <label className="text-sm font-bold text-slate-600">
                  유형
                  <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" value={blockFilters.type} onChange={(event) => updateBlockFilter("type", event.target.value)}>
                    <option>전체</option>
                    <option>영상</option>
                    <option>오디오</option>
                    <option>퀴즈 링크</option>
                  </select>
                </label>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>블록명</TableHead>
                      <TableHead>블록 유형</TableHead>
                      <TableHead>언어</TableHead>
                      <TableHead>미디어 URL 여부</TableHead>
                      <TableHead>추가</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlocks.map((block) => {
                      const isSelected = selectedBlockIds.includes(block.id);

                      return (
                        <TableRow key={block.id}>
                          <TableCell className="min-w-44 font-bold text-slate-900">{block.blockName}</TableCell>
                          <TableCell><BlockTypeBadge type={block.type} /></TableCell>
                          <TableCell>{block.language}</TableCell>
                          <TableCell><MediaUrlBadge block={block} /></TableCell>
                          <TableCell>
                            <Button type="button" size="sm" variant={isSelected ? "outline" : "default"} disabled={isSelected} onClick={() => addBlock(block.id)}>
                              <Plus className="h-3.5 w-3.5" />
                              {isSelected ? "선택됨" : "추가"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredBlocks.length === 0 && <TableRow><TableCell colSpan={5} className="py-10 text-center font-semibold text-slate-500">검색 조건에 맞는 블록이 없습니다.</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers3 className="h-5 w-5 text-indigo-500" />
                <CardTitle>선택한 블록 목록</CardTitle>
              </div>
              <CardDescription>레슨에 포함할 블록 순서를 조정하거나 제거합니다.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>순서</TableHead>
                    <TableHead>블록명</TableHead>
                    <TableHead>블록 유형</TableHead>
                    <TableHead>미리보기</TableHead>
                    <TableHead>순서 변경</TableHead>
                    <TableHead>제거</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBlocks.map((block, index) => (
                    <TableRow key={block.id}>
                      <TableCell className="font-semibold text-slate-900">{index + 1}</TableCell>
                      <TableCell className="min-w-44 font-bold text-slate-900">{block.blockName}</TableCell>
                      <TableCell><BlockTypeBadge type={block.type} /></TableCell>
                      <TableCell className="max-w-xs truncate font-mono text-xs text-slate-600">{block.mediaUrl}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button type="button" size="sm" variant="outline" disabled={index === 0} onClick={() => moveBlock(block.id, "up")} aria-label="위로 이동"><ArrowUp className="h-3.5 w-3.5" /></Button>
                          <Button type="button" size="sm" variant="outline" disabled={index === selectedBlocks.length - 1} onClick={() => moveBlock(block.id, "down")} aria-label="아래로 이동"><ArrowDown className="h-3.5 w-3.5" /></Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button type="button" size="sm" variant="outline" onClick={() => removeBlock(block.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          제거
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {selectedBlocks.length === 0 && <TableRow><TableCell colSpan={6} className="py-10 text-center font-semibold text-slate-500">아직 선택한 블록이 없습니다. 블록을 1개 이상 추가해야 저장할 수 있습니다.</TableCell></TableRow>}
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
            <p className="mt-1 text-sm text-slate-500">언어, 레슨명, 선택한 블록 1개 이상이 모두 필요합니다.</p>
            {validationMessages.length > 0 ? <ul className="mt-3 list-disc pl-5 text-sm font-semibold text-rose-600">{validationMessages.map((message) => <li key={message}>{message}</li>)}</ul> : null}
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

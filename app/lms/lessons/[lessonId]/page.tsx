import { ArrowLeft, CalendarDays, FileText, Languages, Layers3, Network } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { BlockPreview } from "../../blocks/block-preview";
import type { BlockType } from "../../blocks/data";
import {
  getLessonBlockCount,
  getLessonBlocks,
  getLessonLinkedClassCount,
  getLessonLinkedCourseCount,
  lessons,
} from "../data";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: typeof Languages; label: string; value: string; note?: string }) {
  return (
    <Card>
      <CardContent className="flex h-full items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
          {note ? <p className="mt-1 text-xs font-semibold text-slate-500">{note}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function BlockTypeBadge({ type }: { type: BlockType }) {
  const variant = type === "영상" ? "default" : type === "오디오" ? "success" : "warning";
  return <Badge variant={variant}>{type}</Badge>;
}

export default async function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) notFound();

  const linkedClassCount = getLessonLinkedClassCount(lesson);
  const linkedCourseCount = getLessonLinkedCourseCount(lesson);
  const lessonBlocks = getLessonBlocks(lesson);

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="레슨 상세"
        description="레슨에 선택된 블록을 순서대로 확인합니다. 영상·오디오·퀴즈 링크는 블록 유형에 맞게 렌더링됩니다."
        action={
          <Link href="/lms/lessons" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80">
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-5">
        <SummaryCard icon={Languages} label="언어" value={lesson.language} />
        <SummaryCard icon={Layers3} label="블록 수" value={`${getLessonBlockCount(lesson)}개`} note="선택 순서대로 렌더링" />
        <SummaryCard icon={Network} label="연결된 수업 수" value={`${linkedClassCount}개`} note="수업 구성 단계에서 연결" />
        <SummaryCard icon={Network} label="연결된 코스 수" value={`${linkedCourseCount}개`} note="코스 구성 결과 기준" />
        <SummaryCard icon={CalendarDays} label="수정일" value={lesson.updatedAt} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>레슨 기본 정보</CardTitle>
            <CardDescription>레슨은 코스나 수업 선택 없이 먼저 생성되는 독립 콘텐츠 단위입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">레슨명</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{lesson.lessonName}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">설명/메모</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">{lesson.description}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">레슨 ID</p>
              <p className="mt-2 font-mono text-sm font-semibold text-slate-700">{lesson.id}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-indigo-500" />
              <CardTitle>선택된 블록</CardTitle>
            </div>
            <CardDescription>레슨을 구성하는 블록을 선택된 순서대로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {lessonBlocks.map((block, index) => (
              <article key={`${block.id}-${index}`} className="rounded-3xl border border-slate-200 p-4">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Block {index + 1}</p>
                    <h3 className="mt-1 text-lg font-black text-slate-950">{block.blockName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{block.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <BlockTypeBadge type={block.type} />
                    <Badge variant="slate">{block.language}</Badge>
                  </div>
                </div>
                <BlockPreview block={block} />
              </article>
            ))}
            {lessonBlocks.length === 0 ? <div className="flex min-h-40 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">선택된 블록이 없습니다.</div> : null}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            <CardTitle>연결 요약</CardTitle>
          </div>
          <CardDescription>코스명/수업명을 필수 정보처럼 강조하지 않고 연결 규모만 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <span className="font-bold text-slate-600">연결된 수업 수</span>
              <Badge className="ml-3" variant={linkedClassCount > 0 ? "success" : "slate"}>{linkedClassCount}개</Badge>
            </div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <span className="font-bold text-slate-600">연결된 코스 수</span>
              <Badge className="ml-3" variant={linkedCourseCount > 0 ? "success" : "slate"}>{linkedCourseCount}개</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

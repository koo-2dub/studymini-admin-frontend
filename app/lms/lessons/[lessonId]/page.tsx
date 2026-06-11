import { ArrowLeft, ExternalLink, FileText, Headphones, Languages, Link2, MonitorPlay, Network } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  getLessonLinkedClassCount,
  getLessonLinkedCourseCount,
  hasLessonAudio,
  hasLessonQuiz,
  hasLessonVideo,
  lessons,
} from "../data";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

function SummaryCard({ icon: Icon, label, value, note }: { icon: typeof Languages; label: string; value: string; note?: string }) {
  return (
    <Card>
      <CardContent className="flex h-full items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
          {note ? <p className="mt-1 text-xs font-semibold text-slate-500">{note}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyMediaMessage({ children }: { children: string }) {
  return (
    <div className="flex min-h-32 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
      {children}
    </div>
  );
}

export default async function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) notFound();

  const linkedClassCount = getLessonLinkedClassCount(lesson);
  const linkedCourseCount = getLessonLinkedCourseCount(lesson);

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="레슨 상세"
        description="레슨의 핵심 콘텐츠인 영상, 오디오, 퀴즈 링크를 먼저 확인하고, 하단에서 기본 정보와 연결 요약을 확인합니다."
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

      <section className="mb-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MonitorPlay className="h-5 w-5 text-indigo-500" />
              <CardTitle>영상 player</CardTitle>
            </div>
            <CardDescription>영상 URL이 등록되어 있으면 실제 재생 가능한 player로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {hasLessonVideo(lesson) ? (
              <video className="aspect-video w-full rounded-3xl bg-slate-950" src={lesson.videoUrl} controls>
                영상 player를 지원하지 않는 브라우저입니다.
              </video>
            ) : (
              <EmptyMediaMessage>등록된 영상이 없습니다.</EmptyMediaMessage>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Headphones className="h-5 w-5 text-emerald-500" />
                <CardTitle>오디오 player</CardTitle>
              </div>
              <CardDescription>오디오 URL이 있으면 controls가 포함된 player로 확인합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {hasLessonAudio(lesson) ? (
                <audio className="w-full" src={lesson.audioUrl} controls>
                  오디오 player를 지원하지 않는 브라우저입니다.
                </audio>
              ) : (
                <EmptyMediaMessage>등록된 오디오가 없습니다.</EmptyMediaMessage>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-amber-500" />
                <CardTitle>퀴즈 링크</CardTitle>
              </div>
              <CardDescription>퀴즈는 상세 화면에서 렌더링하지 않고 링크로만 제공합니다.</CardDescription>
            </CardHeader>
            <CardContent>
              {hasLessonQuiz(lesson) ? (
                <div className="rounded-3xl bg-amber-50 p-5">
                  <p className="break-all text-sm font-semibold text-amber-900">{lesson.quizUrl}</p>
                  <Link
                    href={lesson.quizUrl!}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-amber-600"
                  >
                    새 창 열기
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <EmptyMediaMessage>등록된 퀴즈 링크가 없습니다.</EmptyMediaMessage>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <SummaryCard icon={Languages} label="언어" value={lesson.language} />
        <SummaryCard icon={Network} label="연결된 수업 수" value={`${linkedClassCount}개`} note="수업 구성 단계에서 연결" />
        <SummaryCard icon={Network} label="연결된 코스 수" value={`${linkedCourseCount}개`} note="코스 구성 결과 기준" />
        <SummaryCard icon={FileText} label="수정일" value={lesson.updatedAt} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
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
            <CardTitle>연결 요약</CardTitle>
            <CardDescription>코스명/수업명을 필수 정보처럼 강조하지 않고 연결 규모만 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="font-bold text-slate-600">연결된 수업 수</span>
                <Badge variant={linkedClassCount > 0 ? "success" : "slate"}>{linkedClassCount}개</Badge>
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-600">연결된 코스 수</span>
                <Badge variant={linkedCourseCount > 0 ? "success" : "slate"}>{linkedCourseCount}개</Badge>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              {linkedClassCount > 0
                ? "이 레슨은 이후 수업 구성 단계에서 연결된 이력이 있습니다."
                : "이 레슨은 아직 어떤 수업에도 연결되지 않았습니다."}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

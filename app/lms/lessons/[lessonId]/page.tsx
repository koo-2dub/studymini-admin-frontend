import { ArrowLeft, BookOpen, GraduationCap, Languages, Layers3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { lessons, type LessonContentType } from "../data";

export function generateStaticParams() {
  return lessons.map((lesson) => ({ lessonId: lesson.id }));
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Languages; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ContentTypeBadge({ type }: { type: LessonContentType }) {
  const variant = type === "영상" ? "default" : type === "오디오" ? "success" : "warning";

  return <Badge variant={variant}>{type}</Badge>;
}

export default async function LessonDetailPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = lessons.find((item) => item.id === lessonId);

  if (!lesson) notFound();

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="레슨 상세"
        description="레슨의 기본 정보와 영상, 오디오, 퀴즈 콘텐츠 구성을 확인합니다."
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
      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <InfoCard icon={Languages} label="언어" value={lesson.language} />
        <InfoCard icon={Layers3} label="코스" value={lesson.course} />
        <InfoCard icon={GraduationCap} label="수업명" value={lesson.className} />
        <Card>
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">공개 여부</p>
              <div className="mt-2">
                <Badge variant={lesson.visibility === "공개" ? "success" : "slate"}>{lesson.visibility}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">수정일</p>
              <p className="mt-2 font-bold text-slate-900">{lesson.updatedAt}</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>레슨 정보</CardTitle>
            <CardDescription>언어 → 코스 → 수업(단계) → 레슨 구조로 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">레슨명</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{lesson.lessonName}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">레슨 구조</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
                {lesson.language} → {lesson.course} → {lesson.className} → {lesson.lessonName}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <CardTitle>학습 콘텐츠 목록</CardTitle>
            </div>
            <CardDescription>콘텐츠 타입을 영상, 오디오, 퀴즈로 구분해서 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {lesson.contents
              .slice()
              .sort((first, second) => first.order - second.order)
              .map((content) => (
                <div key={content.id} className="rounded-2xl bg-slate-50 p-4 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900">{content.title}</p>
                      <p className="mt-1 text-slate-500">{content.id}</p>
                    </div>
                    <ContentTypeBadge type={content.type} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                    <span className="font-bold text-slate-600">순서 {content.order}</span>
                    <span className="font-semibold text-slate-900">
                      {content.type === "퀴즈" ? `${content.itemCount ?? 0}문항` : content.duration}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

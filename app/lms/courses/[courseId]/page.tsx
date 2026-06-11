import { ArrowLeft, BookOpen, CalendarDays, GraduationCap, Languages, ListChecks, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { courseClasses } from "../data";

export function generateStaticParams() {
  return courseClasses.map((courseClass) => ({ courseId: courseClass.id }));
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Languages; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex h-full items-start gap-3 p-5">
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

function MediaBadge({ active, label }: { active: boolean; label: string }) {
  return <Badge variant={active ? "success" : "slate"}>{active ? `${label} 등록` : `${label} 없음`}</Badge>;
}

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const courseClass = courseClasses.find((item) => item.id === courseId);

  if (!courseClass) notFound();

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="수업 상세"
        description="수업의 기본 정보와 포함된 레슨 구성을 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lms/courses"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60"
              title="수업 수정 기능은 준비 중입니다."
            >
              <Pencil className="h-4 w-4" />
              수업 수정
            </button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <InfoCard icon={GraduationCap} label="수업명" value={courseClass.className} />
        <InfoCard icon={Languages} label="언어" value={courseClass.language} />
        <InfoCard icon={ListChecks} label="포함된 레슨 수" value={`${courseClass.lessons.length}개`} />
        <InfoCard icon={CalendarDays} label="수정일" value={courseClass.updatedAt} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <CardTitle>수업 정보</CardTitle>
            <CardDescription>수업명, 언어, 포함된 레슨 수만 중심으로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">수업명</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{courseClass.className}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">설명/메모</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
                {courseClass.description ?? `${courseClass.className} 수업은 ${courseClass.lessons.length}개의 레슨으로 구성되어 있습니다.`}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <CardTitle>포함된 레슨 목록</CardTitle>
            </div>
            <CardDescription>레슨 순서와 영상/오디오/퀴즈 링크 등록 여부를 확인합니다.</CardDescription>
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
                  <TableHead>레슨 상세 보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseClass.lessons.map((lesson, index) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-semibold text-slate-900">{index + 1}</TableCell>
                    <TableCell className="min-w-32 font-bold text-slate-900">{lesson.lessonName}</TableCell>
                    <TableCell>{lesson.language}</TableCell>
                    <TableCell><MediaBadge active={lesson.hasVideo} label="영상" /></TableCell>
                    <TableCell><MediaBadge active={lesson.hasAudio} label="오디오" /></TableCell>
                    <TableCell><MediaBadge active={lesson.hasQuiz} label="퀴즈" /></TableCell>
                    <TableCell>
                      <Link
                        href={`/lms/lessons/${lesson.id}`}
                        className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        상세 보기
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

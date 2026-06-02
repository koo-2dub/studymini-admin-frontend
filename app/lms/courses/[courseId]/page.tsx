import { ArrowLeft, BookOpen, GraduationCap, Languages, Layers3, Pencil } from "lucide-react";
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
        <InfoCard icon={Languages} label="언어" value={courseClass.language} />
        <InfoCard icon={Layers3} label="코스" value={courseClass.course} />
        <InfoCard icon={GraduationCap} label="수업명" value={courseClass.className} />
        <Card>
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">공개 여부</p>
              <div className="mt-2">
                <Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">수정일</p>
              <p className="mt-2 font-bold text-slate-900">{courseClass.updatedAt}</p>
            </div>
          </CardContent>
        </Card>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>수업 정보</CardTitle>
            <CardDescription>언어 → 코스 → 수업(단계) → 레슨 구조로 표시됩니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">수업명</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{courseClass.className}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">수업 구조</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">
                {courseClass.language} → {courseClass.course} → {courseClass.className} → {courseClass.lessons.length}개 레슨
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
            <CardDescription>레슨명, 공개 여부, 콘텐츠 수, 수정일을 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>레슨명</TableHead>
                  <TableHead>공개 여부</TableHead>
                  <TableHead>콘텐츠 수</TableHead>
                  <TableHead>수정일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseClass.lessons.map((lesson) => (
                  <TableRow key={lesson.id} className="cursor-pointer hover:bg-slate-50">
                    <TableCell className="min-w-32 p-0 font-bold text-slate-900">
                      <Link href={`/lms/lessons/${lesson.id}`} className="block px-4 py-3">
                        {lesson.lessonName}
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link href={`/lms/lessons/${lesson.id}`} className="block px-4 py-3">
                        <Badge variant={lesson.visibility === "공개" ? "success" : "slate"}>{lesson.visibility}</Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="p-0 font-semibold text-slate-900">
                      <Link href={`/lms/lessons/${lesson.id}`} className="block px-4 py-3">
                        {lesson.contentCount}개
                      </Link>
                    </TableCell>
                    <TableCell className="p-0">
                      <Link href={`/lms/lessons/${lesson.id}`} className="block px-4 py-3">
                        {lesson.updatedAt}
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

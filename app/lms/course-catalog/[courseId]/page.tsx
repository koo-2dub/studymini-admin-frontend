import { ArrowLeft, BookOpen, Boxes, Coins, KeyRound, Layers3, Link2, PackageCheck, Pencil, ScrollText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formatWon, getSalesStatusTone, lmsCourses } from "../../_data/catalog";
import { getCourseCatalogDetail, getCourseCatalogDraftDetail, type CourseCatalogDraftDetailInput } from "../data";

export function generateStaticParams() {
  return lmsCourses.map((course) => ({ courseId: course.id }));
}

function InfoCard({ icon: Icon, label, value, detail }: { icon: typeof Boxes; label: string; value: string; detail?: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
          {detail ? <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}

function DetailItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className={`mt-2 font-semibold text-slate-900 ${mono ? "font-mono text-sm" : ""}`}>{value}</p>
    </div>
  );
}

function toParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getDraftFromSearchParams(searchParams: Record<string, string | string[] | undefined>): CourseCatalogDraftDetailInput | undefined {
  if (toParamValue(searchParams.source) !== "course-form") return undefined;

  const name = toParamValue(searchParams.name) ?? "신규 코스";
  const language = toParamValue(searchParams.language) ?? "일본어";
  const description = toParamValue(searchParams.description) ?? "코스 생성/수정 화면에서 저장한 상세 미리보기입니다.";
  const price = Number(toParamValue(searchParams.price) ?? 0);
  const salesStatus = (toParamValue(searchParams.salesStatus) ?? "판매중지") as CourseCatalogDraftDetailInput["salesStatus"];
  const visibility = (toParamValue(searchParams.visibility) ?? "비공개") as CourseCatalogDraftDetailInput["visibility"];
  const selectedClassIds = (toParamValue(searchParams.classIds) ?? "").split(",").filter(Boolean);

  return {
    language,
    name,
    description,
    price,
    salesStatus,
    visibility,
    selectedClassIds,
    updatedAt: "2026-06-02",
  };
}

export default async function CourseCatalogDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ courseId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { courseId } = await params;
  const resolvedSearchParams = await searchParams;
  const draft = getDraftFromSearchParams(resolvedSearchParams);
  const course = draft ? getCourseCatalogDraftDetail(courseId, draft) : getCourseCatalogDetail(courseId);

  if (!course) notFound();

  const editHref = lmsCourses.some((item) => item.id === course.id)
    ? `/lms/course-catalog/${course.id}/edit`
    : "/lms/course-catalog/create";

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title="코스 상세"
        description="판매 단위 코스의 기본 정보, 포함 수업/레슨, 패키지 연결 관계와 권한 범위를 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href={editHref}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:bg-primary/90"
            >
              <Pencil className="h-4 w-4" />
              코스 수정
            </Link>
            <Link
              href="/lms/course-catalog"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Link>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={Boxes} label="포함 수업 수" value={`${course.classCount}개`} detail="코스 구매 시 열리는 수업" />
        <InfoCard icon={BookOpen} label="포함 레슨 수" value={`${course.lessonCount}개`} detail="학습 권한 부여 대상" />
        <InfoCard icon={PackageCheck} label="포함 패키지 수" value={`${course.packageCount}개`} detail="이 코스를 포함한 패키지" />
        <InfoCard icon={Coins} label="코스 가격" value={formatWon(course.price)} detail="단일 코스 판매가" />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>{course.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-sm font-bold text-slate-500">코스명</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{course.displayName}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="코스 ID" value={course.id} mono />
              <DetailItem label="언어" value={course.language} />
              <DetailItem label="가격" value={formatWon(course.price)} />
              <DetailItem label="수정일" value={course.updatedAt} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">판매상태</p>
                <div className="mt-2">
                  <Badge variant={getSalesStatusTone(course.salesStatus)}>{course.salesStatus}</Badge>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">공개상태</p>
                <div className="mt-2">
                  <Badge variant={course.visibility === "공개" ? "success" : "slate"}>{course.visibility}</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-indigo-500" />
              <CardTitle>권한 미리보기</CardTitle>
            </div>
            <CardDescription>이 코스를 구매하면 열리는 수업/레슨 요약입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-3xl bg-indigo-50 p-5">
              <p className="text-sm font-bold text-indigo-700">{course.language} → {course.name}</p>
              <ul className="mt-4 space-y-3 text-sm font-semibold leading-6 text-slate-700">
                {course.permissionSummary.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers3 className="h-5 w-5 text-indigo-500" />
              <CardTitle>포함 수업</CardTitle>
            </div>
            <CardDescription>수업명, 단계, 레슨 수, 공개상태를 확인하고 수업 상세로 이동합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>수업명</TableHead>
                  <TableHead>단계</TableHead>
                  <TableHead>레슨 수</TableHead>
                  <TableHead>공개상태</TableHead>
                  <TableHead>수업 상세 이동</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.classes.map((courseClass) => (
                  <TableRow key={courseClass.id} className="hover:bg-slate-50">
                    <TableCell className="min-w-40 font-bold text-slate-900">{courseClass.className}</TableCell>
                    <TableCell>{courseClass.step}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{courseClass.lessons.length}개</TableCell>
                    <TableCell>
                      <Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/lms/courses/${courseClass.id}`} className="font-bold text-primary hover:underline">
                        상세 보기
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {course.classes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center font-semibold text-slate-500">
                      연결된 수업 상세 데이터가 없습니다. 요약 수업 수는 {course.classCount}개입니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-indigo-500" />
              <CardTitle>포함 패키지</CardTitle>
            </div>
            <CardDescription>이 코스가 포함된 패키지 판매 단위를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>패키지명</TableHead>
                  <TableHead>판매가</TableHead>
                  <TableHead>판매상태</TableHead>
                  <TableHead>패키지 상세 이동</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {course.packages.map((lmsPackage) => (
                  <TableRow key={lmsPackage.id} className="hover:bg-slate-50">
                    <TableCell className="min-w-48 font-bold text-slate-900">{lmsPackage.displayName}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{formatWon(lmsPackage.salePrice)}</TableCell>
                    <TableCell>
                      <Badge variant={getSalesStatusTone(lmsPackage.salesStatus)}>{lmsPackage.salesStatus}</Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/lms/packages/${lmsPackage.id}`} className="font-bold text-primary hover:underline">
                        상세 보기
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {course.packages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center font-semibold text-slate-500">
                      이 코스를 포함한 패키지가 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-indigo-500" />
            <CardTitle>처리 로그</CardTitle>
          </div>
          <CardDescription>코스 판매 단위와 패키지 연결 관계 확인 이력입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {course.logs.map((log, index) => (
              <li key={log} className="flex gap-3 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-indigo-600 ring-1 ring-indigo-100">
                  {index + 1}
                </span>
                {log}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}

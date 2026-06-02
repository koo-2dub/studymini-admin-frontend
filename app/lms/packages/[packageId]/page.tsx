import { ArrowLeft, CalendarDays, Coins, Edit, KeyRound, Languages, PackageCheck, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { formatWon, getDigitalOption, getPackageById, getPaperDigitalOption, getSalesStatusTone, packageSummaries } from "../../_data/catalog";

export function generateStaticParams() {
  return packageSummaries.map((lmsPackage) => ({ packageId: lmsPackage.id }));
}

function InfoCard({ icon: Icon, label, value, detail }: { icon: typeof Languages; label: string; value: string; detail?: string }) {
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

export default async function PackageDetailPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const lmsPackage = getPackageById(packageId);

  if (!lmsPackage) notFound();

  const digitalOption = getDigitalOption(lmsPackage.productOptions);
  const paperDigitalOption = getPaperDigitalOption(lmsPackage.productOptions);
  const digitalSummary = getDigitalOption(lmsPackage.optionSummaries);
  const paperDigitalSummary = getPaperDigitalOption(lmsPackage.optionSummaries);

  return (
    <>
      <PageHeader
        eyebrow="LMS commerce"
        title="패키지 상세"
        description="패키지의 포함 코스, 가격/할인, 판매 이력 정책과 실제 코스 권한 미리보기를 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lms/packages"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Link>
            <Link
              href={`/lms/packages/${lmsPackage.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Edit className="h-4 w-4" />
              패키지 수정
            </Link>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard icon={Languages} label="언어 구성" value={lmsPackage.languageScope} detail={lmsPackage.languages.join(", ")} />
        <InfoCard icon={PackageCheck} label="포함 코스" value={`${lmsPackage.courses.length}개`} detail={`${lmsPackage.classCount}개 수업 · ${lmsPackage.lessonCount}개 레슨`} />
        <InfoCard icon={Coins} label="디지털 가격" value={formatWon(digitalOption.price)} detail={`${digitalSummary.discountRate.toFixed(1)}% 할인`} />
        <InfoCard icon={CalendarDays} label="판매 기간" value={lmsPackage.saleStartsAt ?? "미설정"} detail={lmsPackage.saleEndsAt ? `${lmsPackage.saleEndsAt} 종료` : "종료일 없음"} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{lmsPackage.displayName}</CardTitle>
            <CardDescription>{lmsPackage.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <DetailItem label="패키지 ID" value={lmsPackage.id} mono />
              <DetailItem label="내부 관리명" value={lmsPackage.internalName} />
              <DetailItem label="판매상태" value={lmsPackage.salesStatus} badgeVariant={getSalesStatusTone(lmsPackage.salesStatus)} />
              <DetailItem label="공개상태" value={lmsPackage.visibility} badgeVariant={lmsPackage.visibility === "공개" ? "success" : "slate"} />
              <DetailItem label="생성일" value={lmsPackage.createdAt} />
              <DetailItem label="수정일" value={lmsPackage.updatedAt} />
            </div>
            <div className="rounded-3xl border border-amber-100 bg-amber-50 p-5">
              <div className="flex items-start gap-3">
                <ShieldAlert className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-black text-amber-900">판매 이력 정책</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-amber-800">
                    {lmsPackage.hasSalesHistory
                      ? "판매 이력이 있는 패키지입니다. 코스 추가는 가능하지만 기존 구매자에게도 신규 코스 권한을 부여할지 선택해야 하며, 코스 제거는 기본 금지 또는 매우 강한 경고가 필요합니다."
                      : "판매 이력이 없어 코스 추가와 제거가 모두 가능합니다."}
                  </p>
                  <p className="mt-2 text-sm text-amber-800">기존 구매자 신규 코스 권한: {lmsPackage.existingBuyerCourseGrantPolicy}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">관리자 메모</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-4 leading-7 text-slate-700">{lmsPackage.adminMemo}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>상품 옵션 / 주문 요약</CardTitle>
            <CardDescription>디지털과 페이퍼 + 디지털은 운영자가 직접 입력한 별도 판매 옵션입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {lmsPackage.optionSummaries.map((option) => (
              <div key={option.type} className="rounded-3xl border border-slate-100 bg-slate-50/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-black text-slate-950">{option.label}</p>
                    <p className="mt-2 text-2xl font-black text-indigo-700">{formatWon(option.price)}</p>
                    <p className="mt-2 text-sm font-semibold text-slate-500">
                      정가 {formatWon(option.regularPrice)} · 할인 {formatWon(option.discountAmount)} · {option.discountRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={option.isSelling ? "success" : "slate"}>{option.isSelling ? "판매 ON" : "판매 OFF"}</Badge>
                    <Badge variant={option.requiresShipping ? "warning" : "slate"}>
                      {option.requiresShipping ? "배송 필요" : "배송 필요 없음"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-px bg-slate-100" />
            <PriceRow label="주문 수" value={`${lmsPackage.orderCount}건`} />
            <PriceRow label="결제 완료" value={`${lmsPackage.paidOrderCount}건`} />
            <PriceRow label="환불" value={`${lmsPackage.refundCount}건`} />
            <PriceRow label="매출" value={formatWon(lmsPackage.revenue)} strong />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>포함 코스</CardTitle>
          <CardDescription>패키지는 코스를 포함하며, 코스는 반드시 특정 언어에 소속됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1040px]">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">순서</TableHead>
                <TableHead className="whitespace-nowrap">언어</TableHead>
                <TableHead className="min-w-56">코스명</TableHead>
                <TableHead className="whitespace-nowrap">디지털 가격</TableHead>
                <TableHead className="whitespace-nowrap">페이퍼+디지털 가격</TableHead>
                <TableHead className="whitespace-nowrap">수업 수</TableHead>
                <TableHead className="whitespace-nowrap">레슨 수</TableHead>
                <TableHead className="whitespace-nowrap">포함 패키지</TableHead>
                <TableHead className="whitespace-nowrap">상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lmsPackage.courses.map((course, index) => (
                <TableRow key={course.id}>
                  <TableCell className="whitespace-nowrap font-mono font-bold">{index + 1}</TableCell>
                  <TableCell className="whitespace-nowrap">{course.language}</TableCell>
                  <TableCell className="min-w-56 max-w-72 font-bold text-slate-900">
                    <span className="line-clamp-2 leading-5">{course.displayName}</span>
                    <p className="mt-1 font-mono text-xs text-slate-500">{course.id}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{formatWon(getDigitalOption(course.productOptions).price)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="space-y-1">
                      <p>{formatWon(getPaperDigitalOption(course.productOptions).price)}</p>
                      <Badge variant="warning">배송 필요</Badge>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{course.classCount}개</TableCell>
                  <TableCell className="whitespace-nowrap">{course.lessonCount}개</TableCell>
                  <TableCell className="whitespace-nowrap">{course.packageCount}개</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="space-y-1">
                      <Badge variant={getSalesStatusTone(course.salesStatus)}>{course.salesStatus}</Badge>
                      <div><Badge variant={course.visibility === "공개" ? "success" : "slate"}>{course.visibility}</Badge></div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-indigo-500" />
            <CardTitle>권한 미리보기</CardTitle>
          </div>
          <CardDescription>패키지 구매 또는 그룹 부여 시 최종적으로 생성되는 코스 접근 권한입니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {lmsPackage.courses.map((course) => (
              <div key={course.id} className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">Course entitlement</p>
                <h3 className="mt-2 text-lg font-black text-slate-950">{course.language} / {course.name}</h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  {course.classCount}개 수업과 {course.lessonCount}개 레슨 접근 권한이 생성됩니다.
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function DetailItem({ label, value, mono = false, badgeVariant }: { label: string; value: string; mono?: boolean; badgeVariant?: "default" | "success" | "warning" | "rose" | "slate" }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-500">{label}</p>
      {badgeVariant ? (
        <div className="mt-2"><Badge variant={badgeVariant}>{value}</Badge></div>
      ) : (
        <p className={`mt-2 font-bold text-slate-900 ${mono ? "font-mono" : ""}`}>{value}</p>
      )}
    </div>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className={strong ? "text-lg font-black text-slate-950" : "font-bold text-slate-800"}>{value}</p>
    </div>
  );
}

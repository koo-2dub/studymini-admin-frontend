import { courseClasses, type CourseClass } from "../courses/data";
import {
  lmsCourses,
  lmsPackages,
  packageCourses,
  salesStatusOptions,
  packageVisibilityOptions,
} from "../_data/catalog";
import type { LmsCourse, LmsPackage, LmsVisibility, SalesStatus } from "../_data/types";

export type PackageIncludedFilter = "전체" | "포함" | "미포함";

export type CourseIncludedClass = CourseClass & {
  step: string;
};

export type CourseIncludedPackage = Pick<LmsPackage, "id" | "displayName" | "salePrice" | "salesStatus">;

export type CourseCatalogDetail = LmsCourse & {
  classes: CourseIncludedClass[];
  packages: CourseIncludedPackage[];
  permissionSummary: string[];
  logs: string[];
};

const courseClassAlias = new Map([
  ["CRS-JP-BASIC", "일본어|베이직"],
  ["CRS-EN-LISTENING", "영어|리스닝 스타터"],
  ["CRS-ES-BASIC", "스페인어|베이직"],
]);

function getCourseClassKey(course: LmsCourse) {
  return courseClassAlias.get(course.id) ?? `${course.language}|${course.name}`;
}

function getStep(className: string) {
  return className.replace(/^.+?\s/, "");
}

export function getCourseIncludedClasses(course: LmsCourse): CourseIncludedClass[] {
  const classKey = getCourseClassKey(course);

  return courseClasses
    .filter((courseClass) => `${courseClass.language}|${courseClass.course}` === classKey)
    .map((courseClass) => ({ ...courseClass, step: getStep(courseClass.className) }));
}

export function getCourseIncludedPackages(courseId: string): CourseIncludedPackage[] {
  const packageIds = packageCourses
    .filter((relation) => relation.courseId === courseId)
    .map((relation) => relation.packageId);

  return lmsPackages
    .filter((lmsPackage) => packageIds.includes(lmsPackage.id))
    .map((lmsPackage) => ({
      id: lmsPackage.id,
      displayName: lmsPackage.displayName,
      salePrice: lmsPackage.salePrice,
      salesStatus: lmsPackage.salesStatus,
    }));
}

export function getCourseCatalogDetail(courseId: string): CourseCatalogDetail | undefined {
  const course = lmsCourses.find((item) => item.id === courseId);

  if (!course) return undefined;

  const classes = getCourseIncludedClasses(course);
  const packages = getCourseIncludedPackages(course.id);
  const visibleClassCount = classes.length || course.classCount;
  const visibleLessonCount = classes.reduce((sum, courseClass) => sum + courseClass.lessons.length, 0) || course.lessonCount;

  return {
    ...course,
    classes,
    packages,
    permissionSummary: [
      `${course.displayName} 구매 시 ${visibleClassCount}개 수업 권한이 열립니다.`,
      `${visibleLessonCount}개 레슨 학습 권한이 코스 단위로 부여됩니다.`,
      packages.length
        ? `${packages.length}개 패키지에 포함되어 패키지 구매자에게도 동일 권한이 부여됩니다.`
        : "현재 패키지에 포함되지 않은 단일 코스 판매 단위입니다.",
    ],
    logs: [
      `${course.updatedAt} · 코스 기본 정보가 업데이트되었습니다.`,
      packages.length
        ? `${packages[0].displayName} 연결 관계가 확인되었습니다.`
        : "연결된 패키지가 없어 단독 판매 상태로 확인되었습니다.",
      `${visibleClassCount}개 수업 · ${visibleLessonCount}개 레슨 권한 미리보기를 갱신했습니다.`,
    ],
  };
}

export const courseCatalogLanguageOptions = ["전체", ...Array.from(new Set(lmsCourses.map((course) => course.language)))];
export const courseCatalogSalesStatusOptions = salesStatusOptions;
export const courseCatalogVisibilityOptions: Array<"전체" | LmsVisibility> = [...packageVisibilityOptions];
export const packageIncludedOptions: PackageIncludedFilter[] = ["전체", "포함", "미포함"];

export type CourseCatalogFilterState = {
  query: string;
  language: string;
  salesStatus: "전체" | SalesStatus;
  visibility: "전체" | LmsVisibility;
  packageIncluded: PackageIncludedFilter;
};

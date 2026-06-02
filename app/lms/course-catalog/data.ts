import { courseClasses, type CourseClass } from "../courses/data";
import {
  lmsLanguages,
  lmsCourses,
  lmsPackages,
  packageCourses,
  salesStatusOptions,
  packageVisibilityOptions,
  createProductOptions,
} from "../_data/catalog";
import type { LmsCourse, LmsPackage, LmsVisibility, SalesStatus } from "../_data/types";

export type PackageIncludedFilter = "전체" | "포함" | "미포함";

export type CourseIncludedClass = CourseClass & {
  step: string;
};

export type CourseIncludedPackage = Pick<LmsPackage, "id" | "displayName" | "productOptions" | "salesStatus">;

export type CourseCatalogDetail = LmsCourse & {
  classes: CourseIncludedClass[];
  packages: CourseIncludedPackage[];
  permissionSummary: string[];
  logs: string[];
};

export type CourseCatalogFormState = {
  language: string;
  name: string;
  description: string;
  digitalPrice: number;
  paperDigitalPrice: number;
  digitalIsSelling: boolean;
  paperDigitalIsSelling: boolean;
  salesStatus: SalesStatus;
  visibility: LmsVisibility;
  selectedClassIds: string[];
};

export type CourseCatalogDraftDetailInput = CourseCatalogFormState & {
  updatedAt: string;
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

export function getCourseIncludedClassesByIds(classIds: string[]): CourseIncludedClass[] {
  return classIds
    .map((classId) => courseClasses.find((courseClass) => courseClass.id === classId))
    .filter((courseClass): courseClass is CourseClass => Boolean(courseClass))
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
      productOptions: lmsPackage.productOptions,
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

export function getCourseCatalogDraftDetail(
  courseId: string,
  draft: CourseCatalogDraftDetailInput,
): CourseCatalogDetail {
  const baseCourse = lmsCourses.find((item) => item.id === courseId);
  const classes = getCourseIncludedClassesByIds(draft.selectedClassIds);
  const packages = baseCourse ? getCourseIncludedPackages(baseCourse.id) : [];
  const lessonCount = classes.reduce((sum, courseClass) => sum + courseClass.lessons.length, 0);
  const classCount = classes.length;
  const languageId = lmsLanguages.find((language) => language.name === draft.language)?.id ?? `LANG-${draft.language}`;

  return {
    id: baseCourse?.id ?? courseId,
    languageId,
    language: draft.language,
    name: draft.name,
    displayName: draft.name,
    description: draft.description,
    productOptions: createProductOptions(
      draft.digitalPrice,
      draft.paperDigitalPrice,
      draft.digitalIsSelling,
      draft.paperDigitalIsSelling,
    ),
    salesStatus: draft.salesStatus,
    visibility: draft.visibility,
    classCount,
    lessonCount,
    packageCount: packages.length,
    updatedAt: draft.updatedAt,
    classes,
    packages,
    permissionSummary: [
      `${draft.name} 저장안 기준으로 ${classCount}개 수업 권한이 열립니다.`,
      `${lessonCount}개 레슨 학습 권한이 선택된 수업 기준으로 부여됩니다.`,
      packages.length
        ? `${packages.length}개 패키지 연결 관계는 기존 코스 기준으로 유지됩니다.`
        : "저장 후 상세 이동 미리보기이며, 패키지 연결은 별도 패키지 관리에서 설정합니다.",
    ],
    logs: [
      `${draft.updatedAt} · 코스 생성/수정 화면에서 저장한 내용으로 상세 미리보기를 갱신했습니다.`,
      `${classCount}개 수업 추가/제거 선택값을 반영했습니다.`,
      "Mock 화면이므로 새로고침 시 서버 저장 데이터로 돌아갈 수 있습니다.",
    ],
  };
}

export function createInitialCourseCatalogForm(course?: LmsCourse): CourseCatalogFormState {
  const includedClasses = course ? getCourseIncludedClasses(course) : [];

  return {
    language: course?.language ?? lmsLanguages[0]?.name ?? "일본어",
    name: course?.displayName ?? "",
    description: course?.description ?? "",
    digitalPrice: course?.productOptions.find((option) => option.type === "digital")?.price ?? 0,
    paperDigitalPrice: course?.productOptions.find((option) => option.type === "paper_digital")?.price ?? 0,
    digitalIsSelling: course?.productOptions.find((option) => option.type === "digital")?.isSelling ?? true,
    paperDigitalIsSelling: course?.productOptions.find((option) => option.type === "paper_digital")?.isSelling ?? true,
    salesStatus: course?.salesStatus ?? "판매중지",
    visibility: course?.visibility ?? "비공개",
    selectedClassIds: includedClasses.map((courseClass) => courseClass.id),
  };
}

export function getCourseCatalogFormSaveHref(courseId: string, form: CourseCatalogFormState) {
  const params = new URLSearchParams({
    source: "course-form",
    language: form.language,
    name: form.name,
    description: form.description,
    digitalPrice: String(form.digitalPrice),
    paperDigitalPrice: String(form.paperDigitalPrice),
    digitalIsSelling: String(form.digitalIsSelling),
    paperDigitalIsSelling: String(form.paperDigitalIsSelling),
    salesStatus: form.salesStatus,
    visibility: form.visibility,
    classIds: form.selectedClassIds.join(","),
  });

  return `/lms/course-catalog/${courseId}?${params.toString()}`;
}

export const courseCatalogLanguageOptions = ["전체", ...Array.from(new Set(lmsCourses.map((course) => course.language)))];
export const courseCatalogSalesStatusOptions = salesStatusOptions;
export const courseCatalogVisibilityOptions: Array<"전체" | LmsVisibility> = [...packageVisibilityOptions];
export const packageIncludedOptions: PackageIncludedFilter[] = ["전체", "포함", "미포함"];
export const courseCatalogFormLanguageOptions = lmsLanguages.map((language) => language.name);
export const courseCatalogFormSalesStatusOptions: SalesStatus[] = ["판매중", "판매중지", "예약", "종료"];
export const courseCatalogFormVisibilityOptions: LmsVisibility[] = ["공개", "비공개"];

export type CourseCatalogFilterState = {
  query: string;
  language: string;
  salesStatus: "전체" | SalesStatus;
  visibility: "전체" | LmsVisibility;
  packageIncluded: PackageIncludedFilter;
};

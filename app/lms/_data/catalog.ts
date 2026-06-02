import { lessons } from "../lessons/data";

import type { LmsCourse, LmsLanguage, LmsPackage, PackageCourse, PackageSummary, SalesStatus } from "./types";

export const lmsLanguages: LmsLanguage[] = [
  { id: "LANG-JP", name: "일본어" },
  { id: "LANG-EN", name: "영어" },
  { id: "LANG-ES", name: "스페인어" },
];

const courseBase = [
  {
    id: "CRS-JP-BASIC",
    language: "일본어",
    name: "베이직",
    displayName: "일본어 베이직",
    description: "일본어 입문자를 위한 문자, 발음, 기본 표현 중심 코스입니다.",
    price: 50000,
    salesStatus: "판매중" as SalesStatus,
    visibility: "공개" as const,
    updatedAt: "2026-05-31",
  },
  {
    id: "CRS-JP-GRAMMAR",
    language: "일본어",
    name: "문법",
    displayName: "일본어 문법",
    description: "기초 문형부터 활용까지 단계적으로 학습하는 문법 코스입니다.",
    price: 30000,
    salesStatus: "판매중" as SalesStatus,
    visibility: "공개" as const,
    updatedAt: "2026-05-29",
    fallbackClassCount: 2,
    fallbackLessonCount: 36,
  },
  {
    id: "CRS-JP-NATIVE",
    language: "일본어",
    name: "네이티브",
    displayName: "일본어 네이티브",
    description: "실제 회화 뉘앙스와 자연스러운 표현을 다루는 심화 코스입니다.",
    price: 45000,
    salesStatus: "예약" as SalesStatus,
    visibility: "비공개" as const,
    updatedAt: "2026-05-22",
    fallbackClassCount: 3,
    fallbackLessonCount: 48,
  },
  {
    id: "CRS-EN-BASIC",
    language: "영어",
    name: "베이직",
    displayName: "영어 베이직",
    description: "영어 기초 문장과 필수 회화 패턴을 익히는 입문 코스입니다.",
    price: 55000,
    salesStatus: "판매중" as SalesStatus,
    visibility: "공개" as const,
    updatedAt: "2026-05-28",
    fallbackClassCount: 3,
    fallbackLessonCount: 42,
  },
  {
    id: "CRS-EN-LISTENING",
    language: "영어",
    name: "리스닝",
    displayName: "영어 리스닝",
    description: "짧은 대화부터 실전 듣기까지 구성된 리스닝 집중 코스입니다.",
    price: 40000,
    salesStatus: "판매중" as SalesStatus,
    visibility: "공개" as const,
    updatedAt: "2026-05-27",
  },
  {
    id: "CRS-EN-PATTERN",
    language: "영어",
    name: "패턴",
    displayName: "영어 패턴",
    description: "자주 쓰는 문장 패턴을 반복 학습하는 실전 코스입니다.",
    price: 35000,
    salesStatus: "판매중지" as SalesStatus,
    visibility: "비공개" as const,
    updatedAt: "2026-05-20",
    fallbackClassCount: 2,
    fallbackLessonCount: 30,
  },
  {
    id: "CRS-ES-BASIC",
    language: "스페인어",
    name: "베이직",
    displayName: "스페인어 베이직",
    description: "스페인어 첫 학습자를 위한 기본 발음과 회화 코스입니다.",
    price: 52000,
    salesStatus: "판매중" as SalesStatus,
    visibility: "공개" as const,
    updatedAt: "2026-05-24",
  },
];

const courseNameAlias = new Map([
  ["일본어|베이직", "CRS-JP-BASIC"],
  ["영어|리스닝 스타터", "CRS-EN-LISTENING"],
  ["스페인어|베이직", "CRS-ES-BASIC"],
]);

function getLanguageId(language: string) {
  return lmsLanguages.find((item) => item.name === language)?.id ?? `LANG-${language}`;
}

function getCurriculumCounts(courseId: string, fallbackClassCount = 0, fallbackLessonCount = 0) {
  const classNames = new Set<string>();
  let lessonCount = 0;

  lessons.forEach((lesson) => {
    const lessonCourseId = courseNameAlias.get(`${lesson.language}|${lesson.course}`);

    if (lessonCourseId !== courseId) return;

    classNames.add(lesson.className);
    lessonCount += 1;
  });

  return {
    classCount: classNames.size || fallbackClassCount,
    lessonCount: lessonCount || fallbackLessonCount,
  };
}

const packageCourseSeed: PackageCourse[] = [
  { packageId: "PKG-JP-BASIC-GRAMMAR", courseId: "CRS-JP-BASIC", sortOrder: 1, addedAt: "2026-05-10" },
  { packageId: "PKG-JP-BASIC-GRAMMAR", courseId: "CRS-JP-GRAMMAR", sortOrder: 2, addedAt: "2026-05-10" },
  { packageId: "PKG-JP-EN-STARTER", courseId: "CRS-JP-BASIC", sortOrder: 1, addedAt: "2026-05-18" },
  { packageId: "PKG-JP-EN-STARTER", courseId: "CRS-EN-LISTENING", sortOrder: 2, addedAt: "2026-05-18" },
  { packageId: "PKG-EN-LISTENING-PROMO", courseId: "CRS-EN-LISTENING", sortOrder: 1, addedAt: "2026-05-22" },
  { packageId: "PKG-JP-GRAMMAR-EN-PATTERN", courseId: "CRS-JP-GRAMMAR", sortOrder: 1, addedAt: "2026-05-25" },
  { packageId: "PKG-JP-GRAMMAR-EN-PATTERN", courseId: "CRS-EN-PATTERN", sortOrder: 2, addedAt: "2026-05-25" },
];

export const packageCourses = packageCourseSeed;

export const lmsCourses: LmsCourse[] = courseBase.map((course) => {
  const counts = getCurriculumCounts(course.id, course.fallbackClassCount, course.fallbackLessonCount);
  const packageCount = packageCourseSeed.filter((relation) => relation.courseId === course.id).length;

  return {
    id: course.id,
    languageId: getLanguageId(course.language),
    language: course.language,
    name: course.name,
    displayName: course.displayName,
    description: course.description,
    price: course.price,
    salesStatus: course.salesStatus,
    visibility: course.visibility,
    classCount: counts.classCount,
    lessonCount: counts.lessonCount,
    packageCount,
    updatedAt: course.updatedAt,
  };
});

export const lmsPackages: LmsPackage[] = [
  {
    id: "PKG-JP-BASIC-GRAMMAR",
    name: "베이직 + 문법",
    displayName: "일본어 베이직 + 문법 패키지",
    description: "일본어 입문과 핵심 문법을 함께 학습하는 대표 패키지입니다.",
    internalName: "JP 기본 문법 번들 2026",
    courseIds: ["CRS-JP-BASIC", "CRS-JP-GRAMMAR"],
    salePrice: 70000,
    currency: "KRW",
    salesStatus: "판매중",
    visibility: "공개",
    saleStartsAt: "2026-05-15",
    orderCount: 128,
    paidOrderCount: 119,
    refundCount: 4,
    revenue: 8330000,
    hasSalesHistory: true,
    existingBuyerCourseGrantPolicy: "선택 필요",
    adminMemo: "기존 구매 이력이 있어 코스 제거는 기본 금지로 운영합니다.",
    createdAt: "2026-05-10",
    updatedAt: "2026-05-31",
  },
  {
    id: "PKG-JP-EN-STARTER",
    name: "일본어 베이직 + 영어 리스닝",
    displayName: "일본어 베이직 + 영어 리스닝 스타터 패키지",
    description: "서로 다른 언어의 입문/리스닝 코스를 함께 제공하는 복수 언어 패키지입니다.",
    internalName: "멀티랭귀지 스타터 프로모션",
    courseIds: ["CRS-JP-BASIC", "CRS-EN-LISTENING"],
    salePrice: 82000,
    currency: "KRW",
    salesStatus: "예약",
    visibility: "공개",
    saleStartsAt: "2026-06-10",
    saleEndsAt: "2026-07-10",
    orderCount: 0,
    paidOrderCount: 0,
    refundCount: 0,
    revenue: 0,
    hasSalesHistory: false,
    existingBuyerCourseGrantPolicy: "신규 구매자만",
    adminMemo: "복수 언어 패키지 운영 검증용 예약 상품입니다.",
    createdAt: "2026-05-18",
    updatedAt: "2026-05-30",
  },
  {
    id: "PKG-EN-LISTENING-PROMO",
    name: "영어 리스닝 패키지",
    displayName: "영어 리스닝 단일 코스 프로모션 패키지",
    description: "단일 코스를 이벤트 가격으로 제공하는 프로모션 패키지입니다.",
    internalName: "EN 리스닝 단일 패키지",
    courseIds: ["CRS-EN-LISTENING"],
    salePrice: 35000,
    currency: "KRW",
    salesStatus: "판매중",
    visibility: "공개",
    saleStartsAt: "2026-05-22",
    saleEndsAt: "2026-06-30",
    orderCount: 42,
    paidOrderCount: 39,
    refundCount: 1,
    revenue: 1365000,
    hasSalesHistory: true,
    existingBuyerCourseGrantPolicy: "기존 구매자 포함",
    adminMemo: "단일 코스 패키지를 허용하는 이벤트 상품입니다.",
    createdAt: "2026-05-22",
    updatedAt: "2026-05-29",
  },
  {
    id: "PKG-JP-GRAMMAR-EN-PATTERN",
    name: "일본어 문법 + 영어 패턴",
    displayName: "일본어 문법 + 영어 패턴 패키지",
    description: "일본어 문법과 영어 패턴 코스를 함께 구성한 복수 언어 실험 패키지입니다.",
    internalName: "JP 문법 EN 패턴 크로스셀",
    courseIds: ["CRS-JP-GRAMMAR", "CRS-EN-PATTERN"],
    salePrice: 59000,
    currency: "KRW",
    salesStatus: "판매중지",
    visibility: "비공개",
    orderCount: 0,
    paidOrderCount: 0,
    refundCount: 0,
    revenue: 0,
    hasSalesHistory: false,
    existingBuyerCourseGrantPolicy: "신규 구매자만",
    adminMemo: "코스 구성과 가격 검수 후 공개 예정입니다.",
    createdAt: "2026-05-25",
    updatedAt: "2026-05-28",
  },
];

export const salesStatusOptions: Array<"전체" | SalesStatus> = ["전체", "판매중", "판매중지", "예약", "종료"];
export const packageVisibilityOptions = ["전체", "공개", "비공개"] as const;
export const languageScopeOptions = ["전체", "단일 언어", "복수 언어"] as const;

export function formatWon(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

export function calculateDiscountAmount(regularPrice: number, salePrice: number) {
  return Math.max(regularPrice - salePrice, 0);
}

export function calculateDiscountRate(regularPrice: number, salePrice: number) {
  if (regularPrice <= 0) return 0;

  return Math.round((calculateDiscountAmount(regularPrice, salePrice) / regularPrice) * 1000) / 10;
}

export function getPackageCourses(packageId: string) {
  return packageCourseSeed
    .filter((relation) => relation.packageId === packageId)
    .sort((first, second) => first.sortOrder - second.sortOrder)
    .map((relation) => lmsCourses.find((course) => course.id === relation.courseId))
    .filter((course): course is LmsCourse => Boolean(course));
}

export function summarizePackage(lmsPackage: LmsPackage): PackageSummary {
  const courses = getPackageCourses(lmsPackage.id);
  const languages = Array.from(new Set(courses.map((course) => course.language)));
  const regularPrice = courses.reduce((sum, course) => sum + course.price, 0);
  const classCount = courses.reduce((sum, course) => sum + course.classCount, 0);
  const lessonCount = courses.reduce((sum, course) => sum + course.lessonCount, 0);

  return {
    ...lmsPackage,
    courses,
    languageScope: languages.length > 1 ? "복수 언어" : "단일 언어",
    languages,
    regularPrice,
    discountAmount: calculateDiscountAmount(regularPrice, lmsPackage.salePrice),
    discountRate: calculateDiscountRate(regularPrice, lmsPackage.salePrice),
    classCount,
    lessonCount,
  };
}

export const packageSummaries = lmsPackages.map(summarizePackage);

export function getPackageById(packageId: string) {
  const lmsPackage = lmsPackages.find((item) => item.id === packageId);

  return lmsPackage ? summarizePackage(lmsPackage) : undefined;
}

export function getSalesStatusTone(status: SalesStatus) {
  if (status === "판매중") return "success";
  if (status === "예약") return "warning";
  if (status === "판매중지") return "rose";
  return "slate";
}

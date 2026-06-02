export type LmsVisibility = "공개" | "비공개";
export type SalesStatus = "판매중" | "판매중지" | "예약" | "종료";
export type LanguageScope = "단일 언어" | "복수 언어";
export type PackageBuyerPolicy = "신규 구매자만" | "기존 구매자 포함" | "선택 필요";
export type ProductOptionType = "digital" | "paper_digital";

export type ProductOption = {
  type: ProductOptionType;
  label: "디지털" | "페이퍼 + 디지털";
  price: number;
  requiresShipping: boolean;
  isSelling: boolean;
};

export type ProductOptionPriceSummary = ProductOption & {
  regularPrice: number;
  discountAmount: number;
  discountRate: number;
};

export type LmsLanguage = {
  id: string;
  name: string;
};

export type LmsCourse = {
  id: string;
  languageId: string;
  language: string;
  name: string;
  displayName: string;
  description: string;
  productOptions: ProductOption[];
  salesStatus: SalesStatus;
  visibility: LmsVisibility;
  classCount: number;
  lessonCount: number;
  packageCount: number;
  updatedAt: string;
};

export type PackageCourse = {
  packageId: string;
  courseId: string;
  sortOrder: number;
  addedAt: string;
};

export type LmsPackage = {
  id: string;
  name: string;
  displayName: string;
  description: string;
  internalName: string;
  courseIds: string[];
  productOptions: ProductOption[];
  currency: "KRW";
  salesStatus: SalesStatus;
  visibility: LmsVisibility;
  saleStartsAt?: string;
  saleEndsAt?: string;
  orderCount: number;
  paidOrderCount: number;
  refundCount: number;
  revenue: number;
  hasSalesHistory: boolean;
  existingBuyerCourseGrantPolicy: PackageBuyerPolicy;
  adminMemo: string;
  createdAt: string;
  updatedAt: string;
};

export type PackageSummary = LmsPackage & {
  courses: LmsCourse[];
  languageScope: LanguageScope;
  languages: string[];
  optionSummaries: ProductOptionPriceSummary[];
  classCount: number;
  lessonCount: number;
};

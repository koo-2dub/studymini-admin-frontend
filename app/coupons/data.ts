export type CouponStatus = "진행중" | "예정" | "종료" | "비활성" | "한도소진";
export type CouponDiscountType = "정액 할인" | "정률 할인";
export type CouponIssueType = "자동 발급" | "쿠폰 코드 배포" | "특정 회원 지급";
export type CouponTargetType = "전체 상품" | "특정 언어" | "특정 코스" | "특정 패키지";

export type CouponSearchTarget = {
  id: string;
  type: Exclude<CouponTargetType, "전체 상품">;
  title: string;
  meta: string;
};

export type CouponUsedMember = {
  id: string;
  name: string;
  email: string;
  userId: string;
  orderNo: string;
  discountAmount: number;
  usedAt: string;
};

export type CouponCampaign = {
  id: string;
  name: string;
  description: string;
  status: CouponStatus;
  issueType: CouponIssueType;
  discountType: CouponDiscountType;
  discountAmount?: number;
  discountRate?: number;
  maxDiscountAmount?: number;
  targetType: CouponTargetType;
  targets: CouponSearchTarget[];
  startDate: string;
  endDate: string;
  issuedCount: number;
  usedCount: number;
  totalUsageLimit?: number;
  minPaymentAmount?: number;
  memberUsageLimit: number;
  couponCode?: string;
  createdAt: string;
  usedMembers: CouponUsedMember[];
};

export const couponSearchTargets: CouponSearchTarget[] = [
  { id: "lang-en", type: "특정 언어", title: "영어", meta: "활성 코스 34개 · 패키지 8개" },
  { id: "lang-jp", type: "특정 언어", title: "일본어", meta: "활성 코스 18개 · 패키지 5개" },
  { id: "lang-cn", type: "특정 언어", title: "중국어", meta: "활성 코스 12개 · 패키지 3개" },
  { id: "course-en-basic", type: "특정 코스", title: "영어 회화 베이직", meta: "영어 · 89,000원 · 판매중" },
  { id: "course-jp-starter", type: "특정 코스", title: "일본어 스타터", meta: "일본어 · 79,000원 · 판매중" },
  { id: "course-cn-hsk", type: "특정 코스", title: "중국어 HSK 3급 집중반", meta: "중국어 · 129,000원 · 판매중" },
  { id: "package-global", type: "특정 패키지", title: "글로벌 비즈니스 패키지", meta: "코스 6개 포함 · 299,000원" },
  { id: "package-newbie", type: "특정 패키지", title: "신규회원 입문 패키지", meta: "코스 4개 포함 · 159,000원" },
  { id: "package-jp-master", type: "특정 패키지", title: "일본어 마스터 패키지", meta: "코스 5개 포함 · 249,000원" },
];

export const couponCampaigns: CouponCampaign[] = [
  {
    id: "welcome-2026",
    name: "2026 신규회원 웰컴 쿠폰",
    description: "회원가입 완료 시 자동 발급되는 신규회원 첫 결제 할인 쿠폰입니다.",
    status: "진행중",
    issueType: "자동 발급",
    discountType: "정액 할인",
    discountAmount: 5000,
    targetType: "전체 상품",
    targets: [],
    startDate: "2026-06-01 00:00",
    endDate: "2026-12-31 23:59",
    issuedCount: 1240,
    usedCount: 386,
    totalUsageLimit: 5000,
    minPaymentAmount: 30000,
    memberUsageLimit: 1,
    createdAt: "2026-05-28",
    usedMembers: [
      { id: "used-1", name: "김민준", email: "minjun.kim@example.com", userId: "U-1001", orderNo: "ORD-20260602-0018", discountAmount: 5000, usedAt: "2026-06-02 09:18" },
      { id: "used-2", name: "이지은", email: "jieun.lee@example.com", userId: "U-1002", orderNo: "ORD-20260603-0042", discountAmount: 5000, usedAt: "2026-06-03 11:42" },
      { id: "used-3", name: "박서준", email: "seojun.park@example.com", userId: "U-1003", orderNo: "ORD-20260604-0006", discountAmount: 5000, usedAt: "2026-06-04 08:06" },
    ],
  },
  {
    id: "summer-code-15",
    name: "여름 프로모션 15% 코드",
    description: "마케팅 랜딩 페이지와 뉴스레터에서 배포하는 공용 쿠폰 코드입니다.",
    status: "진행중",
    issueType: "쿠폰 코드 배포",
    discountType: "정률 할인",
    discountRate: 15,
    maxDiscountAmount: 20000,
    targetType: "특정 패키지",
    targets: [couponSearchTargets[6], couponSearchTargets[7]],
    startDate: "2026-06-10 00:00",
    endDate: "2026-07-15 23:59",
    issuedCount: 800,
    usedCount: 512,
    totalUsageLimit: 800,
    minPaymentAmount: 70000,
    memberUsageLimit: 1,
    couponCode: "SUMMER15",
    createdAt: "2026-06-01",
    usedMembers: [
      { id: "used-4", name: "최유진", email: "yujin.choi@example.com", userId: "U-2001", orderNo: "ORD-20260610-0121", discountAmount: 20000, usedAt: "2026-06-10 14:23" },
      { id: "used-5", name: "정하린", email: "harin.jung@example.com", userId: "U-2002", orderNo: "ORD-20260611-0034", discountAmount: 17850, usedAt: "2026-06-11 16:07" },
    ],
  },
  {
    id: "vip-cs-reward",
    name: "VIP/CS 보상 쿠폰",
    description: "CS 보상 및 VIP 회원 케어를 위해 운영자가 특정 회원에게 지급하는 쿠폰입니다.",
    status: "예정",
    issueType: "특정 회원 지급",
    discountType: "정액 할인",
    discountAmount: 30000,
    targetType: "특정 코스",
    targets: [couponSearchTargets[3], couponSearchTargets[4], couponSearchTargets[5]],
    startDate: "2026-07-01 00:00",
    endDate: "2026-08-31 23:59",
    issuedCount: 120,
    usedCount: 0,
    totalUsageLimit: 120,
    minPaymentAmount: 100000,
    memberUsageLimit: 1,
    createdAt: "2026-06-03",
    usedMembers: [],
  },
  {
    id: "jp-spring-close",
    name: "일본어 봄 시즌 마감 쿠폰",
    description: "일본어 코스 시즌 종료 전환 프로모션입니다.",
    status: "종료",
    issueType: "쿠폰 코드 배포",
    discountType: "정률 할인",
    discountRate: 20,
    maxDiscountAmount: 15000,
    targetType: "특정 언어",
    targets: [couponSearchTargets[1]],
    startDate: "2026-03-01 00:00",
    endDate: "2026-04-30 23:59",
    issuedCount: 350,
    usedCount: 284,
    totalUsageLimit: 350,
    minPaymentAmount: 50000,
    memberUsageLimit: 1,
    couponCode: "JP-SPRING20",
    createdAt: "2026-02-20",
    usedMembers: [
      { id: "used-6", name: "강도윤", email: "doyun.kang@example.com", userId: "U-3001", orderNo: "ORD-20260312-0188", discountAmount: 15000, usedAt: "2026-03-12 10:45" },
    ],
  },
  {
    id: "cn-launch-limit",
    name: "중국어 런칭 한정 쿠폰",
    description: "중국어 신규 코스 오픈 기념 한정 수량 쿠폰입니다.",
    status: "한도소진",
    issueType: "쿠폰 코드 배포",
    discountType: "정액 할인",
    discountAmount: 10000,
    targetType: "특정 언어",
    targets: [couponSearchTargets[2]],
    startDate: "2026-05-01 00:00",
    endDate: "2026-06-30 23:59",
    issuedCount: 200,
    usedCount: 200,
    totalUsageLimit: 200,
    minPaymentAmount: 60000,
    memberUsageLimit: 1,
    couponCode: "CN-LAUNCH",
    createdAt: "2026-04-25",
    usedMembers: [
      { id: "used-7", name: "문서연", email: "seoyeon.moon@example.com", userId: "U-4001", orderNo: "ORD-20260518-0208", discountAmount: 10000, usedAt: "2026-05-18 20:08" },
      { id: "used-8", name: "오지후", email: "jihuu.oh@example.com", userId: "U-4002", orderNo: "ORD-20260519-0017", discountAmount: 10000, usedAt: "2026-05-19 09:17" },
    ],
  },
  {
    id: "ops-disabled-test",
    name: "운영 테스트 비활성 쿠폰",
    description: "테스트 완료 후 운영자가 비활성화한 내부 확인용 쿠폰입니다.",
    status: "비활성",
    issueType: "자동 발급",
    discountType: "정률 할인",
    discountRate: 5,
    maxDiscountAmount: 5000,
    targetType: "전체 상품",
    targets: [],
    startDate: "2026-06-01 00:00",
    endDate: "2026-06-30 23:59",
    issuedCount: 40,
    usedCount: 3,
    totalUsageLimit: 100,
    minPaymentAmount: 30000,
    memberUsageLimit: 1,
    createdAt: "2026-05-30",
    usedMembers: [
      { id: "used-9", name: "한수아", email: "sua.han@example.com", userId: "U-5001", orderNo: "ORD-20260601-0031", discountAmount: 2500, usedAt: "2026-06-01 12:31" },
    ],
  },
];

export function getCouponById(id: string) {
  return couponCampaigns.find((coupon) => coupon.id === id) ?? couponCampaigns[0];
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function formatCurrency(value: number) {
  return `${formatNumber(value)}원`;
}

export function usageRate(usedCount: number, issuedCount: number) {
  if (issuedCount === 0) return 0;
  return Math.round((usedCount / issuedCount) * 100);
}

export function discountLabel(coupon: Pick<CouponCampaign, "discountType" | "discountAmount" | "discountRate" | "maxDiscountAmount">) {
  if (coupon.discountType === "정액 할인") return `${formatCurrency(coupon.discountAmount ?? 0)}`;
  return `${coupon.discountRate ?? 0}%${coupon.maxDiscountAmount ? ` · 최대 ${formatCurrency(coupon.maxDiscountAmount)}` : ""}`;
}

export function targetLabel(coupon: Pick<CouponCampaign, "targetType" | "targets">) {
  if (coupon.targetType === "전체 상품") return "전체 상품";
  if (coupon.targets.length === 0) return coupon.targetType;
  if (coupon.targets.length === 1) return `${coupon.targetType} · ${coupon.targets[0].title}`;
  return `${coupon.targetType} · ${coupon.targets[0].title} 외 ${coupon.targets.length - 1}개`;
}

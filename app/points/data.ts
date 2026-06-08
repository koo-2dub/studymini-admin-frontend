export type PointCampaignStatus = "진행중" | "예정" | "종료";
export type PointType = "일반 포인트" | "기간제 포인트";
export type PointCampaignPurpose = "신규가입" | "이벤트" | "리뷰" | "복귀회원" | "환급 이벤트" | "기타";

export type ExpiringPoint = {
  member: string;
  campaign: string;
  pointType: PointType;
  points: string;
  expireDate: string;
  notification: "발송 완료" | "미발송";
  status: string;
};

export type PointCampaign = {
  id: string;
  name: string;
  code: string;
  description: string;
  purpose: PointCampaignPurpose;
  status: PointCampaignStatus;
  pointType: PointType;
  period: string;
  startDate: string;
  endDate: string;
  usageStartDate: string;
  usageEndDate: string;
  targetCount: number;
  issuedCount: number;
  failedCount: number;
  amount: number;
  usedPoints: number;
  remainingPoints: number;
  expiringPoints: number;
  expiredPoints: number;
  expires: string;
  expirationRule: string;
  policy: string;
  adminMemo: string;
  notificationEnabled: boolean;
  createdAt: string;
};

export type ExpiringCampaignMember = {
  name: string;
  email: string;
  userId: string;
  issuedPoints: number;
  usedPoints: number;
  remainingPoints: number;
  currentPoints: number;
  expiringPoints: number;
  expiresAt: string;
  lastUsedAt: string;
  notificationSent: boolean;
};

export type ExpiredCampaignMember = {
  name: string;
  email: string;
  userId: string;
  expiredPoints: number;
  expiredAt: string;
  reason: string;
};

export type FailedCampaignMember = {
  name: string;
  email: string;
  userId: string;
  reason: string;
  processedAt: string;
};

export type ExpirationSnapshot = {
  expired: number;
  within7Days: number;
  within30Days: number;
  within60Days: number;
};

export const pointTypes: PointType[] = ["일반 포인트", "기간제 포인트"];
export const campaignPurposes: PointCampaignPurpose[] = ["신규가입", "이벤트", "리뷰", "복귀회원", "환급 이벤트", "기타"];

export const expiringPoints: ExpiringPoint[] = [
  { member: "지윤 김", campaign: "6월 복귀 회원 리워드", pointType: "기간제 포인트", points: "12,000P", expireDate: "2026-06-10", notification: "발송 완료", status: "D-6" },
  { member: "민서 박", campaign: "환급 이벤트 리워드", pointType: "기간제 포인트", points: "4,500P", expireDate: "2026-06-18", notification: "미발송", status: "D-14" },
  { member: "Noah Park", campaign: "신규가입 기본 포인트", pointType: "일반 포인트", points: "2,300P", expireDate: "2027-06-01", notification: "발송 완료", status: "정책 기본" },
];

export const campaigns: PointCampaign[] = [
  {
    id: "return-june-2026",
    name: "6월 복귀 회원 리워드",
    code: "POINT-RETURN-202606",
    description: "최근 90일 미구매 복귀 회원의 재구매 전환을 위한 기간제 포인트 캠페인",
    purpose: "복귀회원",
    status: "진행중",
    pointType: "기간제 포인트",
    period: "2026-06-01 ~ 2026-06-30",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    usageStartDate: "2026-06-01",
    usageEndDate: "2026-06-30",
    targetCount: 920,
    issuedCount: 842,
    failedCount: 78,
    amount: 4210000,
    usedPoints: 1268000,
    remainingPoints: 2942000,
    expiringPoints: 1104000,
    expiredPoints: 0,
    expires: "2026-06-30",
    expirationRule: "2026-06-30 23:59 일괄 만료",
    policy: "기간제 포인트 캠페인 만료일 정책",
    adminMemo: "6월 복귀 쿠폰과 중복 지급 가능, 소멸 7일 전 알림톡 발송 대상",
    notificationEnabled: true,
    createdAt: "2026-05-28 15:20",
  },
  {
    id: "signup-default-2026",
    name: "신규가입 기본 포인트",
    code: "POINT-SIGNUP-DEFAULT-2026",
    description: "신규가입 회원에게 정책 기본 유효기간을 적용해 지급하는 일반 포인트 캠페인",
    purpose: "신규가입",
    status: "진행중",
    pointType: "일반 포인트",
    period: "2026-01-01 ~ 2026-12-31",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    usageStartDate: "지급 즉시",
    usageEndDate: "지급일 기준 12개월",
    targetCount: 1840,
    issuedCount: 1840,
    failedCount: 4,
    amount: 3680000,
    usedPoints: 940000,
    remainingPoints: 2680000,
    expiringPoints: 420000,
    expiredPoints: 60000,
    expires: "정책 기본 12개월",
    expirationRule: "일반 포인트 정책 기본값 12개월 적용",
    policy: "일반 포인트 유효기간 기본 정책",
    adminMemo: "신규가입 포인트는 포인트 정책이 아닌 캠페인으로 운영",
    notificationEnabled: true,
    createdAt: "2025-12-20 10:00",
  },
  {
    id: "refund-event-2026-06",
    name: "환급 이벤트 포인트",
    code: "POINT-REFUND-202606",
    description: "환급 이벤트 참여 완료 회원에게 지급하는 기간제 포인트",
    purpose: "환급 이벤트",
    status: "예정",
    pointType: "기간제 포인트",
    period: "2026-06-15 ~ 2026-07-15",
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    usageStartDate: "2026-06-15",
    usageEndDate: "2026-07-31",
    targetCount: 480,
    issuedCount: 0,
    failedCount: 0,
    amount: 0,
    usedPoints: 0,
    remainingPoints: 0,
    expiringPoints: 0,
    expiredPoints: 0,
    expires: "2026-07-31",
    expirationRule: "2026-07-31 23:59 만료",
    policy: "환급 이벤트 기간제 포인트 정책",
    adminMemo: "캠페인 오픈 전 대상자 CSV 최종 검수 필요",
    notificationEnabled: true,
    createdAt: "2026-06-03 11:05",
  },
  {
    id: "review-thanks-2026-05",
    name: "리뷰 작성 감사 포인트",
    code: "POINT-REVIEW-THANKS-202605",
    description: "5월 리뷰 작성 완료 회원에게 지급한 감사 일반 포인트",
    purpose: "리뷰",
    status: "종료",
    pointType: "일반 포인트",
    period: "2026-05-01 ~ 2026-05-31",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    usageStartDate: "지급 즉시",
    usageEndDate: "지급일 기준 12개월",
    targetCount: 316,
    issuedCount: 316,
    failedCount: 12,
    amount: 948000,
    usedPoints: 382000,
    remainingPoints: 394000,
    expiringPoints: 214000,
    expiredPoints: 172000,
    expires: "정책 기본 12개월",
    expirationRule: "일반 포인트 정책 기본값 12개월 적용",
    policy: "리뷰 리워드 일반 포인트 정책",
    adminMemo: "리뷰 승인 취소 회원은 소멸 완료 목록에서 별도 확인",
    notificationEnabled: false,
    createdAt: "2026-04-25 09:30",
  },
];

export const campaignExpiringMembers: Record<string, ExpiringCampaignMember[]> = {
  "return-june-2026": [
    { name: "지윤 김", email: "jiyoon.kim@example.com", userId: "SM-1024", issuedPoints: 15000, usedPoints: 150, remainingPoints: 14850, currentPoints: 14850, expiringPoints: 12000, expiresAt: "2026-06-10", lastUsedAt: "2026-06-02", notificationSent: true },
    { name: "민서 박", email: "minseo.park@example.com", userId: "SM-1023", issuedPoints: 10000, usedPoints: 2200, remainingPoints: 7800, currentPoints: 7800, expiringPoints: 6500, expiresAt: "2026-06-14", lastUsedAt: "2026-05-29", notificationSent: false },
    { name: "Noah Park", email: "noah.park@example.com", userId: "SM-1022", issuedPoints: 8000, usedPoints: 2700, remainingPoints: 5300, currentPoints: 5300, expiringPoints: 2300, expiresAt: "2026-06-30", lastUsedAt: "2026-05-22", notificationSent: true },
    { name: "Sora Choi", email: "sora.choi@example.com", userId: "SM-1021", issuedPoints: 12000, usedPoints: 2600, remainingPoints: 9400, currentPoints: 9400, expiringPoints: 8400, expiresAt: "2026-06-30", lastUsedAt: "2026-06-01", notificationSent: false },
  ],
  "signup-default-2026": [
    { name: "Daniel Wu", email: "daniel.wu@example.com", userId: "SM-1020", issuedPoints: 2000, usedPoints: 400, remainingPoints: 1600, currentPoints: 1600, expiringPoints: 1600, expiresAt: "2027-06-01", lastUsedAt: "2026-06-03", notificationSent: false },
  ],
  "refund-event-2026-06": [
    { name: "하린 최", email: "harin.choi@example.com", userId: "SM-1017", issuedPoints: 0, usedPoints: 0, remainingPoints: 0, currentPoints: 0, expiringPoints: 0, expiresAt: "2026-07-31", lastUsedAt: "-", notificationSent: false },
  ],
  "review-thanks-2026-05": [
    { name: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", issuedPoints: 3000, usedPoints: 1800, remainingPoints: 1200, currentPoints: 1200, expiringPoints: 1200, expiresAt: "2027-05-01", lastUsedAt: "2026-05-19", notificationSent: true },
    { name: "Ethan Jung", email: "ethan.jung@example.com", userId: "SM-1018", issuedPoints: 5000, usedPoints: 200, remainingPoints: 4800, currentPoints: 4800, expiringPoints: 3000, expiresAt: "2027-05-01", lastUsedAt: "2026-05-28", notificationSent: true },
  ],
};

export const campaignExpiredMembers: Record<string, ExpiredCampaignMember[]> = {
  "return-june-2026": [],
  "signup-default-2026": [
    { name: "Avery Kim", email: "avery.kim@example.com", userId: "SM-1009", expiredPoints: 60000, expiredAt: "2026-06-01 00:00", reason: "일반 포인트 유효기간 만료" },
  ],
  "refund-event-2026-06": [],
  "review-thanks-2026-05": [
    { name: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", expiredPoints: 1200, expiredAt: "2026-06-01 00:00", reason: "유효기간 만료" },
    { name: "Ethan Jung", email: "ethan.jung@example.com", userId: "SM-1018", expiredPoints: 2800, expiredAt: "2026-06-01 00:00", reason: "유효기간 만료" },
  ],
};

export const campaignFailedMembers: Record<string, FailedCampaignMember[]> = {
  "return-june-2026": [
    { name: "하린 최", email: "harin.choi@example.com", userId: "SM-1021", reason: "휴면 회원", processedAt: "2026-06-01 09:05" },
    { name: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", reason: "중복 지급", processedAt: "2026-06-01 09:06" },
    { name: "Chris Han", email: "chris.han@example.com", userId: "SM-1017", reason: "포인트 유형 없음", processedAt: "2026-06-01 09:08" },
  ],
  "signup-default-2026": [
    { name: "Ian Moon", email: "ian.moon@example.com", userId: "SM-1015", reason: "중복 가입 검증", processedAt: "2026-06-01 10:15" },
  ],
  "refund-event-2026-06": [],
  "review-thanks-2026-05": [
    { name: "Yuna Seo", email: "yuna.seo@example.com", userId: "SM-1016", reason: "탈퇴 회원", processedAt: "2026-05-01 10:12" },
    { name: "Ian Moon", email: "ian.moon@example.com", userId: "SM-1015", reason: "지급 한도 초과", processedAt: "2026-05-01 10:15" },
  ],
};

export const expirationSnapshots: Record<string, ExpirationSnapshot> = {
  "return-june-2026": { expired: 0, within7Days: 284000, within30Days: 1104000, within60Days: 2942000 },
  "signup-default-2026": { expired: 60000, within7Days: 120000, within30Days: 420000, within60Days: 680000 },
  "refund-event-2026-06": { expired: 0, within7Days: 0, within30Days: 0, within60Days: 0 },
  "review-thanks-2026-05": { expired: 172000, within7Days: 214000, within30Days: 394000, within60Days: 394000 },
};

export function getCampaignById(campaignId: string) {
  return campaigns.find((campaign) => campaign.id === campaignId);
}

export function getCampaignExpiringMembers(campaignId: string) {
  return campaignExpiringMembers[campaignId] ?? [];
}

export function getCampaignExpiredMembers(campaignId: string) {
  return campaignExpiredMembers[campaignId] ?? [];
}

export function getCampaignFailedMembers(campaignId: string) {
  return campaignFailedMembers[campaignId] ?? [];
}

export function getExpirationSnapshot(campaignId: string) {
  return expirationSnapshots[campaignId] ?? { expired: 0, within7Days: 0, within30Days: 0, within60Days: 0 };
}

export function formatPoints(value: number) {
  return `${new Intl.NumberFormat("ko-KR").format(value)}P`;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function expirationRate(campaign: PointCampaign) {
  if (campaign.amount === 0) return 0;
  return Math.round((campaign.expiringPoints / campaign.amount) * 1000) / 10;
}

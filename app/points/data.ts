export type PointCampaignStatus = "진행중" | "예정" | "종료";
export type PointWallet = "일반 포인트" | "이벤트 포인트" | "기간제 포인트";

export type ExpiringPoint = {
  member: string;
  wallet: PointWallet;
  points: string;
  expireDate: string;
  status: string;
};

export type PointCampaign = {
  id: string;
  name: string;
  status: PointCampaignStatus;
  wallet: PointWallet;
  period: string;
  startDate: string;
  endDate: string;
  targetCount: number;
  issuedCount: number;
  amount: number;
  usedPoints: number;
  remainingPoints: number;
  expiringPoints: number;
  expiredPoints: number;
  expires: string;
  expirationRule: string;
  policy: string;
  createdAt: string;
};

export type ExpiringCampaignMember = {
  name: string;
  email: string;
  userId: string;
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

export type ExpirationSnapshot = {
  expired: number;
  within7Days: number;
  within30Days: number;
  within60Days: number;
};

export const expiringPoints: ExpiringPoint[] = [
  { member: "지윤 김", wallet: "기간제 포인트", points: "12,000P", expireDate: "2026-06-10", status: "D-6" },
  { member: "민서 박", wallet: "이벤트 포인트", points: "4,500P", expireDate: "2026-06-18", status: "D-14" },
  { member: "Noah Park", wallet: "일반 포인트", points: "2,300P", expireDate: "2026-06-30", status: "월말" },
];

export const campaigns: PointCampaign[] = [
  {
    id: "return-june-2026",
    name: "6월 복귀 회원 리워드",
    status: "진행중",
    wallet: "기간제 포인트",
    period: "2026-06-01 ~ 2026-06-30",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    targetCount: 920,
    issuedCount: 842,
    amount: 4210000,
    usedPoints: 1268000,
    remainingPoints: 2942000,
    expiringPoints: 1104000,
    expiredPoints: 0,
    expires: "2026-06-30",
    expirationRule: "캠페인 종료일 23:59 일괄 만료",
    policy: "복귀 회원 기간제 포인트 정책 v2",
    createdAt: "2026-05-28 15:20",
  },
  {
    id: "summer-earlybird-2026",
    name: "여름 집중반 얼리버드",
    status: "예정",
    wallet: "이벤트 포인트",
    period: "2026-06-15 ~ 2026-07-15",
    startDate: "2026-06-15",
    endDate: "2026-07-15",
    targetCount: 480,
    issuedCount: 0,
    amount: 0,
    usedPoints: 0,
    remainingPoints: 0,
    expiringPoints: 0,
    expiredPoints: 0,
    expires: "2026-07-31",
    expirationRule: "지급일 기준 45일 후 순차 만료",
    policy: "이벤트 포인트 얼리버드 정책",
    createdAt: "2026-06-03 11:05",
  },
  {
    id: "review-thanks-2026-05",
    name: "리뷰 작성 감사 포인트",
    status: "종료",
    wallet: "기간제 포인트",
    period: "2026-05-01 ~ 2026-05-31",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    targetCount: 316,
    issuedCount: 316,
    amount: 948000,
    usedPoints: 382000,
    remainingPoints: 394000,
    expiringPoints: 214000,
    expiredPoints: 172000,
    expires: "2026-06-15",
    expirationRule: "캠페인 만료일 00:00 시스템 소멸",
    policy: "리뷰 리워드 기간제 포인트 정책",
    createdAt: "2026-04-25 09:30",
  },
];

export const campaignExpiringMembers: Record<string, ExpiringCampaignMember[]> = {
  "return-june-2026": [
    { name: "지윤 김", email: "jiyoon.kim@example.com", userId: "SM-1024", currentPoints: 14850, expiringPoints: 12000, expiresAt: "2026-06-10", lastUsedAt: "2026-06-02", notificationSent: true },
    { name: "민서 박", email: "minseo.park@example.com", userId: "SM-1023", currentPoints: 7800, expiringPoints: 6500, expiresAt: "2026-06-14", lastUsedAt: "2026-05-29", notificationSent: false },
    { name: "Noah Park", email: "noah.park@example.com", userId: "SM-1022", currentPoints: 5300, expiringPoints: 2300, expiresAt: "2026-06-30", lastUsedAt: "2026-05-22", notificationSent: true },
    { name: "Sora Choi", email: "sora.choi@example.com", userId: "SM-1021", currentPoints: 9400, expiringPoints: 8400, expiresAt: "2026-06-30", lastUsedAt: "2026-06-01", notificationSent: false },
  ],
  "summer-earlybird-2026": [
    { name: "Daniel Wu", email: "daniel.wu@example.com", userId: "SM-1020", currentPoints: 0, expiringPoints: 0, expiresAt: "2026-07-31", lastUsedAt: "-", notificationSent: false },
  ],
  "review-thanks-2026-05": [
    { name: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", currentPoints: 1200, expiringPoints: 1200, expiresAt: "2026-06-15", lastUsedAt: "2026-05-19", notificationSent: true },
    { name: "Ethan Jung", email: "ethan.jung@example.com", userId: "SM-1018", currentPoints: 4800, expiringPoints: 3000, expiresAt: "2026-06-15", lastUsedAt: "2026-05-28", notificationSent: true },
  ],
};

export const campaignExpiredMembers: Record<string, ExpiredCampaignMember[]> = {
  "return-june-2026": [],
  "summer-earlybird-2026": [],
  "review-thanks-2026-05": [
    { name: "Mina Lee", email: "mina.lee@example.com", userId: "SM-1019", expiredPoints: 1200, expiredAt: "2026-06-01 00:00", reason: "유효기간 만료" },
    { name: "Ethan Jung", email: "ethan.jung@example.com", userId: "SM-1018", expiredPoints: 2800, expiredAt: "2026-06-01 00:00", reason: "유효기간 만료" },
  ],
};

export const expirationSnapshots: Record<string, ExpirationSnapshot> = {
  "return-june-2026": { expired: 0, within7Days: 284000, within30Days: 1104000, within60Days: 2942000 },
  "summer-earlybird-2026": { expired: 0, within7Days: 0, within30Days: 0, within60Days: 0 },
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

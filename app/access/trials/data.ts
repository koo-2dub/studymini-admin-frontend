export type TrialStatus = "예정" | "진행중" | "종료" | "중단";
export type TrialContentType = "코스" | "패키지" | "혼합";
export type TrialPermissionStatus = "정상" | "처리 예정" | "만료 실패" | "만료 완료";

export type TrialCampaign = {
  id: string;
  name: string;
  status: TrialStatus;
  participantCount: number;
  activeParticipantCount: number;
  contentType: TrialContentType;
  targetContents: string[];
  startsAt: string;
  endsAt: string;
  manager: string;
  createdAt: string;
  permissionStatus: TrialPermissionStatus;
  note: string;
};

export type TrialParticipant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  addedAt: string;
  addMethod: "회원 검색" | "CSV 업로드";
  permissionStatus: "예정" | "활성" | "만료" | "연장됨" | "실패";
  startsAt: string;
  endsAt: string;
  memo: string;
};

export type TrialTargetContent = {
  id: string;
  type: "코스" | "패키지";
  name: string;
  status: "공개" | "비공개" | "판매중지";
  category: string;
  addedAt: string;
};

export type TrialLog = {
  time: string;
  type: "생성" | "회원" | "권한" | "수정" | "오류";
  actor: string;
  message: string;
  result: "성공" | "실패";
};

export const trialCampaigns: TrialCampaign[] = [
  {
    id: "trial-2026-summer",
    name: "2026 여름 프리미엄 체험단",
    status: "진행중",
    participantCount: 128,
    activeParticipantCount: 126,
    contentType: "혼합",
    targetContents: ["스페인어 베이직", "영어 리스닝 스타터", "프리미엄 회화 패키지"],
    startsAt: "2026-06-01",
    endsAt: "2026-06-30",
    manager: "Admin Team",
    createdAt: "2026-05-24",
    permissionStatus: "정상",
    note: "마케팅팀 모집 리스트 기반 6월 체험단",
  },
  {
    id: "trial-b2b-june",
    name: "B2B 임직원 2주 체험",
    status: "예정",
    participantCount: 42,
    activeParticipantCount: 0,
    contentType: "패키지",
    targetContents: ["비즈니스 회화 집중 패키지"],
    startsAt: "2026-06-10",
    endsAt: "2026-06-24",
    manager: "Customer Success",
    createdAt: "2026-05-30",
    permissionStatus: "처리 예정",
    note: "파트너사 임직원 대상 파일럿",
  },
  {
    id: "trial-may-review",
    name: "5월 후기 작성 체험단",
    status: "종료",
    participantCount: 86,
    activeParticipantCount: 0,
    contentType: "코스",
    targetContents: ["일본어 문법 베이직"],
    startsAt: "2026-05-01",
    endsAt: "2026-05-21",
    manager: "Marketing Ops",
    createdAt: "2026-04-20",
    permissionStatus: "만료 완료",
    note: "후기 작성 리워드 연계 캠페인",
  },
  {
    id: "trial-expired-errors",
    name: "4월 신규회원 온보딩 체험",
    status: "종료",
    participantCount: 64,
    activeParticipantCount: 2,
    contentType: "코스",
    targetContents: ["중국어 올인원 맛보기"],
    startsAt: "2026-04-05",
    endsAt: "2026-04-19",
    manager: "Operations",
    createdAt: "2026-04-01",
    permissionStatus: "만료 실패",
    note: "권한 회수 실패 건 재처리 필요",
  },
];

export const trialParticipants: TrialParticipant[] = [
  {
    id: "SM-1024",
    name: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-****-1024",
    addedAt: "2026-05-28",
    addMethod: "회원 검색",
    permissionStatus: "활성",
    startsAt: "2026-06-01",
    endsAt: "2026-06-30",
    memo: "VIP 전환 후보",
  },
  {
    id: "SM-1023",
    name: "민서 박",
    email: "minseo.park@example.com",
    phone: "010-****-1023",
    addedAt: "2026-05-29",
    addMethod: "CSV 업로드",
    permissionStatus: "활성",
    startsAt: "2026-06-01",
    endsAt: "2026-06-30",
    memo: "무료 체험 온보딩 대상",
  },
  {
    id: "SM-1022",
    name: "서준 이",
    email: "seojoon.lee@example.com",
    phone: "010-****-1022",
    addedAt: "2026-06-02",
    addMethod: "회원 검색",
    permissionStatus: "연장됨",
    startsAt: "2026-06-02",
    endsAt: "2026-07-07",
    memo: "문의 응대 후 1주 연장",
  },
  {
    id: "SM-1019",
    name: "하린 최",
    email: "harin.choi@example.com",
    phone: "010-****-1019",
    addedAt: "2026-05-30",
    addMethod: "CSV 업로드",
    permissionStatus: "실패",
    startsAt: "2026-06-01",
    endsAt: "2026-06-30",
    memo: "권한 재처리 필요",
  },
];

export const trialTargetContents: TrialTargetContent[] = [
  { id: "COURSE-SPA-101", type: "코스", name: "스페인어 베이직", status: "공개", category: "스페인어", addedAt: "2026-05-24" },
  { id: "COURSE-ENG-201", type: "코스", name: "영어 리스닝 스타터", status: "공개", category: "영어", addedAt: "2026-05-24" },
  { id: "PKG-CONV-001", type: "패키지", name: "프리미엄 회화 패키지", status: "공개", category: "패키지", addedAt: "2026-05-24" },
];

export const trialLogs: TrialLog[] = [
  { time: "2026-06-04 09:10", type: "권한", actor: "System", message: "활성 회원 126명의 체험 권한 상태를 점검했습니다.", result: "성공" },
  { time: "2026-06-02 15:42", type: "회원", actor: "Admin Team", message: "서준 이 회원을 검색으로 추가하고 종료일을 2026-07-07로 설정했습니다.", result: "성공" },
  { time: "2026-06-01 00:05", type: "권한", actor: "System", message: "시작일 도래로 대상 콘텐츠 권한을 자동 부여했습니다.", result: "성공" },
  { time: "2026-05-24 11:30", type: "생성", actor: "Admin Team", message: "2026 여름 프리미엄 체험단을 생성했습니다.", result: "성공" },
];

export function getTrialCampaign(id: string) {
  return trialCampaigns.find((campaign) => campaign.id === id) ?? trialCampaigns[0];
}

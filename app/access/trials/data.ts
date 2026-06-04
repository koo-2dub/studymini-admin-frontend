export type TrialStatus = "진행중" | "예정" | "종료";
export type MemberStatus = "활성" | "휴면" | "탈퇴";
export type PermissionStatus = "권한 활성" | "만료 임박" | "권한 만료";
export type AddMethod = "검색 추가" | "CSV 업로드";
export type CsvValidationResult = "추가 가능" | "이미 추가됨" | "회원 없음" | "이메일 형식 오류" | "전화번호 불일치";

export type TrialContent = {
  id: string;
  type: "코스" | "패키지";
  title: string;
};

export type TrialMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  userId: string;
  memberStatus: MemberStatus;
  permissionStatus: PermissionStatus;
  startDate: string;
  endDate: string;
  addMethod: AddMethod;
  grantedContent: TrialContent[];
};

export type SearchableMember = Pick<TrialMember, "id" | "name" | "email" | "phone" | "userId" | "memberStatus">;

export type CsvPreviewMember = SearchableMember & {
  validationResult: CsvValidationResult;
  processStatus: "대기" | "추가 제외" | "추가 예정";
};

export type TrialCampaign = {
  id: string;
  name: string;
  status: TrialStatus;
  content: TrialContent[];
  startDate: string;
  endDate: string;
  memberCount: number;
  memo: string;
};

export const trialContents: TrialContent[] = [
  { id: "course-basic-en", type: "코스", title: "왕초보 영어 회화 30일" },
  { id: "course-biz-en", type: "코스", title: "비즈니스 영어 이메일" },
  { id: "package-en-starter", type: "패키지", title: "영어 스타터 패키지" },
  { id: "package-jp-travel", type: "패키지", title: "일본어 여행 회화 패키지" },
];

export const trialCampaigns: TrialCampaign[] = [
  {
    id: "trial-2026-summer",
    name: "2026 여름 영어 스타터 체험단",
    status: "진행중",
    content: [trialContents[0], trialContents[2]],
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    memberCount: 24,
    memo: "신규 가입자 대상 4주 체험 캠페인",
  },
  {
    id: "trial-biz-email",
    name: "비즈니스 영어 이메일 베타 체험단",
    status: "예정",
    content: [trialContents[1]],
    startDate: "2026-07-01",
    endDate: "2026-07-21",
    memberCount: 12,
    memo: "기업 제휴 리드 검증용 체험단",
  },
  {
    id: "trial-jp-travel",
    name: "일본어 여행 회화 체험단",
    status: "종료",
    content: [trialContents[3]],
    startDate: "2026-05-01",
    endDate: "2026-05-20",
    memberCount: 18,
    memo: "여행 시즌 콘텐츠 반응 확인",
  },
];

export const mockMembers: SearchableMember[] = [
  { id: "member-1001", name: "김민지", email: "minji.kim@example.com", phone: "010-1234-5678", userId: "U1001", memberStatus: "활성" },
  { id: "member-1002", name: "이준호", email: "junho.lee@example.com", phone: "010-2234-5678", userId: "U1002", memberStatus: "활성" },
  { id: "member-1003", name: "박서연", email: "seoyeon.park@example.com", phone: "010-3234-5678", userId: "U1003", memberStatus: "휴면" },
  { id: "member-1004", name: "최도윤", email: "doyun.choi@example.com", phone: "010-4234-5678", userId: "U1004", memberStatus: "활성" },
  { id: "member-1005", name: "정하린", email: "harin.jung@example.com", phone: "010-5234-5678", userId: "U1005", memberStatus: "활성" },
  { id: "member-1006", name: "오지훈", email: "jihoon.oh@example.com", phone: "010-6234-5678", userId: "U1006", memberStatus: "탈퇴" },
];

export const initialTrialMembers: TrialMember[] = [
  {
    ...mockMembers[0],
    permissionStatus: "권한 활성",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    addMethod: "검색 추가",
    grantedContent: [trialContents[0], trialContents[2]],
  },
  {
    ...mockMembers[1],
    permissionStatus: "만료 임박",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    addMethod: "CSV 업로드",
    grantedContent: [trialContents[0], trialContents[2]],
  },
  {
    ...mockMembers[2],
    permissionStatus: "권한 활성",
    startDate: "2026-06-03",
    endDate: "2026-06-30",
    addMethod: "CSV 업로드",
    grantedContent: [trialContents[0]],
  },
];

export const csvPreviewRows: CsvPreviewMember[] = [
  { ...mockMembers[3], validationResult: "추가 가능", processStatus: "추가 예정" },
  { ...mockMembers[0], validationResult: "이미 추가됨", processStatus: "추가 제외" },
  { id: "csv-missing", name: "한가온", email: "gaon.han@example.com", phone: "010-7777-1111", userId: "U7777", memberStatus: "활성", validationResult: "회원 없음", processStatus: "추가 제외" },
  { id: "csv-email-error", name: "문소율", email: "soyul.moon.example.com", phone: "010-8888-2222", userId: "U8888", memberStatus: "활성", validationResult: "이메일 형식 오류", processStatus: "추가 제외" },
  { ...mockMembers[4], phone: "010-0000-0000", validationResult: "전화번호 불일치", processStatus: "추가 제외" },
];

export function getTrialById(trialId: string) {
  return trialCampaigns.find((trial) => trial.id === trialId) ?? trialCampaigns[0];
}

export function buildTrialMember(member: SearchableMember, addMethod: AddMethod, grantedContent: TrialContent[]): TrialMember {
  return {
    ...member,
    permissionStatus: "권한 활성",
    startDate: "2026-06-04",
    endDate: "2026-07-04",
    addMethod,
    grantedContent,
  };
}

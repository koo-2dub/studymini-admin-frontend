export type AccessCodeStatus = "진행중" | "예정" | "종료" | "폐기";
export type AccessCodeType = "공용 코드" | "개인별 코드";
export type CodeItemStatus = "미사용" | "사용완료" | "만료" | "폐기";

export type AccessCodeContent = {
  id: string;
  type: "코스" | "패키지";
  title: string;
  duration: string;
};

export type AccessCodeMember = {
  id: string;
  name: string;
  email: string;
  userId: string;
  enteredCode: string;
  accessStartDate: string;
  accessEndDate: string;
  usedAt: string;
};

export type AccessCodeItem = {
  id: string;
  code: string;
  status: CodeItemStatus;
  assignee?: string;
  usedAt?: string;
  memo?: string;
};

export type AccessCodeLog = {
  id: string;
  actor: string;
  action: string;
  createdAt: string;
};

export type AccessCodeCampaign = {
  id: string;
  name: string;
  status: AccessCodeStatus;
  codeType: AccessCodeType;
  memo: string;
  organization: string;
  issuedCount: number;
  usedCount: number;
  availableStartDate: string;
  availableEndDate: string;
  accessPeriod: string;
  accessStartBasis: string;
  usageLimit: string;
  content: AccessCodeContent[];
  members: AccessCodeMember[];
  codes: AccessCodeItem[];
  operationMemo: string;
  logs: AccessCodeLog[];
};

export const searchableAccessContents: AccessCodeContent[] = [
  { id: "COURSE-EN-BIZ-01", type: "코스", title: "비즈니스 영어 프레젠테이션", duration: "90일" },
  { id: "COURSE-JP-BASIC-02", type: "코스", title: "일본어 기초 회화", duration: "120일" },
  { id: "PKG-GLOBAL-2026", type: "패키지", title: "글로벌 비즈니스 패키지", duration: "180일" },
  { id: "PKG-NEW-HIRE", type: "패키지", title: "신입 온보딩 어학 패키지", duration: "365일" },
];

export const accessCodeCampaigns: AccessCodeCampaign[] = [
  {
    id: "b2b-global-2026",
    name: "글로벌 제조사 2026 상반기 어학 지원",
    status: "진행중",
    codeType: "개인별 코드",
    memo: "HR 담당자에게 개인별 코드 CSV 전달 완료. 월별 사용률 리포트 필요.",
    organization: "Global Manufacturing Korea",
    issuedCount: 120,
    usedCount: 86,
    availableStartDate: "2026-06-01",
    availableEndDate: "2026-07-31",
    accessPeriod: "입력 즉시 시작 · 180일",
    accessStartBasis: "입력 즉시 시작",
    usageLimit: "1인 1회 / 전체 120회 제한",
    content: [searchableAccessContents[0], searchableAccessContents[2]],
    members: [
      {
        id: "member-1001",
        name: "김민준",
        email: "minjun.kim@example.com",
        userId: "U-1001",
        enteredCode: "GMK-26-0001",
        accessStartDate: "2026-06-02",
        accessEndDate: "2026-11-29",
        usedAt: "2026-06-02 09:18",
      },
      {
        id: "member-1002",
        name: "이지은",
        email: "jieun.lee@example.com",
        userId: "U-1002",
        enteredCode: "GMK-26-0002",
        accessStartDate: "2026-06-03",
        accessEndDate: "2026-11-30",
        usedAt: "2026-06-03 11:42",
      },
      {
        id: "member-1003",
        name: "박서준",
        email: "seojun.park@example.com",
        userId: "U-1003",
        enteredCode: "GMK-26-0003",
        accessStartDate: "2026-06-04",
        accessEndDate: "2026-12-01",
        usedAt: "2026-06-04 08:06",
      },
    ],
    codes: [
      { id: "code-0001", code: "GMK-26-0001", status: "사용완료", assignee: "김민준", usedAt: "2026-06-02 09:18" },
      { id: "code-0002", code: "GMK-26-0002", status: "사용완료", assignee: "이지은", usedAt: "2026-06-03 11:42" },
      { id: "code-0003", code: "GMK-26-0003", status: "사용완료", assignee: "박서준", usedAt: "2026-06-04 08:06" },
      { id: "code-0004", code: "GMK-26-0004", status: "미사용", memo: "미배포" },
      { id: "code-0005", code: "GMK-26-0005", status: "폐기", memo: "담당자 요청으로 폐기" },
    ],
    operationMemo: "공용 메신저 공유 금지 안내 완료. 퇴사자 발생 시 미사용 코드는 폐기 처리 예정.",
    logs: [
      { id: "log-1", actor: "admin@studymini.com", action: "수강코드 120개 생성", createdAt: "2026-05-28 15:21" },
      { id: "log-2", actor: "admin@studymini.com", action: "대상 콘텐츠에 글로벌 비즈니스 패키지 추가", createdAt: "2026-05-29 10:04" },
      { id: "log-3", actor: "system", action: "김민준 회원이 코드 입력", createdAt: "2026-06-02 09:18" },
    ],
  },
  {
    id: "public-newhire-q3",
    name: "신입사원 온보딩 공용 코드",
    status: "예정",
    codeType: "공용 코드",
    memo: "입사 첫 주 웰컴 메일에 공용 코드 포함 예정.",
    organization: "StudyMini Partners",
    issuedCount: 80,
    usedCount: 0,
    availableStartDate: "2026-07-01",
    availableEndDate: "2026-08-15",
    accessPeriod: "지정일 시작 2026-07-01 · 고정 종료일 2026-12-31",
    accessStartBasis: "지정일 시작",
    usageLimit: "1인 1회 / 전체 80명 제한",
    content: [searchableAccessContents[3]],
    members: [],
    codes: [
      { id: "code-public-1", code: "WELCOME-2026-Q3", status: "미사용", memo: "담당자 전달 전" },
      { id: "code-public-2", code: "WELCOME-2026-Q3-OLD", status: "만료", memo: "테스트 코드" },
    ],
    operationMemo: "공용 코드 노출 채널은 HR 메일로 제한. 종료 후 잔여 사용 가능 인원 회수 필요.",
    logs: [
      { id: "log-4", actor: "admin@studymini.com", action: "공용 코드 초안 생성", createdAt: "2026-06-01 13:12" },
      { id: "log-5", actor: "admin@studymini.com", action: "입력 가능 시작일을 2026-07-01로 변경", createdAt: "2026-06-02 16:30" },
    ],
  },
  {
    id: "jp-basic-agency",
    name: "공공기관 일본어 기초 지원",
    status: "종료",
    codeType: "개인별 코드",
    memo: "상반기 파일럿 운영 종료. 재계약 논의 중.",
    organization: "Public Language Agency",
    issuedCount: 50,
    usedCount: 47,
    availableStartDate: "2026-03-01",
    availableEndDate: "2026-04-30",
    accessPeriod: "입력 즉시 시작 · 120일",
    accessStartBasis: "입력 즉시 시작",
    usageLimit: "1인 1회 / 전체 50회 제한",
    content: [searchableAccessContents[1]],
    members: [
      {
        id: "member-2001",
        name: "최유진",
        email: "yujin.choi@example.com",
        userId: "U-2001",
        enteredCode: "PLA-JP-0007",
        accessStartDate: "2026-03-06",
        accessEndDate: "2026-07-04",
        usedAt: "2026-03-06 14:23",
      },
    ],
    codes: [
      { id: "code-jp-1", code: "PLA-JP-0007", status: "사용완료", assignee: "최유진", usedAt: "2026-03-06 14:23" },
      { id: "code-jp-2", code: "PLA-JP-0048", status: "만료", memo: "입력 가능 기간 종료" },
      { id: "code-jp-3", code: "PLA-JP-0049", status: "미사용", memo: "미사용 잔여 코드" },
    ],
    operationMemo: "최종 사용률 94%. 종료 리포트는 2026-05-03 담당자에게 공유 완료.",
    logs: [
      { id: "log-6", actor: "admin@studymini.com", action: "수강코드 50개 생성", createdAt: "2026-02-20 10:12" },
      { id: "log-7", actor: "system", action: "입력 가능 기간 종료로 미사용 코드 만료 처리", createdAt: "2026-05-01 00:00" },
    ],
  },
];

export function getAccessCodeCampaignById(id: string) {
  return accessCodeCampaigns.find((campaign) => campaign.id === id) ?? accessCodeCampaigns[0];
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function usageRate(usedCount: number, issuedCount: number) {
  if (issuedCount === 0) return 0;
  return Math.round((usedCount / issuedCount) * 100);
}

export type AccessCodeStatus = "진행중" | "예정" | "종료" | "폐기";
export type AccessCodeCategory = "B2B" | "체험단";
export type CodeItemStatus = "미사용" | "사용완료" | "만료" | "폐기";

export type AccessCodeContent = {
  id: string;
  type: "코스" | "패키지";
  title: string;
  duration: string;
};

export type AccessCodeItem = {
  id: string;
  code: string;
  status: CodeItemStatus;
  isUsed: boolean;
  memberName?: string;
  email?: string;
  userId?: string;
  accessStartDate?: string;
  accessEndDate?: string;
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
  category: AccessCodeCategory;
  status: AccessCodeStatus;
  memo: string;
  organization: string;
  issuedCount: number;
  usedCount: number;
  accessPeriod: string;
  accessStartBasis: string;
  content: AccessCodeContent[];
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
    category: "B2B",
    status: "진행중",
    memo: "HR 담당자에게 개인별 코드 CSV 전달 완료. 월별 사용률 리포트 필요.",
    organization: "Global Manufacturing Korea",
    issuedCount: 120,
    usedCount: 86,
    accessPeriod: "입력 즉시 시작 · 180일",
    accessStartBasis: "입력 즉시 시작",
    content: [searchableAccessContents[0], searchableAccessContents[2]],
    codes: [
      {
        id: "code-0001",
        code: "A7K9-P2LM-Q8XZ-3T6B",
        status: "사용완료",
        isUsed: true,
        memberName: "김민준",
        email: "minjun.kim@example.com",
        userId: "U-1001",
        accessStartDate: "2026-06-02",
        accessEndDate: "2026-11-29",
        usedAt: "2026-06-02 09:18",
      },
      {
        id: "code-0002",
        code: "B4Q8-N7RD-K2WT-9H5C",
        status: "사용완료",
        isUsed: true,
        memberName: "이지은",
        email: "jieun.lee@example.com",
        userId: "U-1002",
        accessStartDate: "2026-06-03",
        accessEndDate: "2026-11-30",
        usedAt: "2026-06-03 11:42",
      },
      {
        id: "code-0003",
        code: "C6MN-3XQ9-V8LA-1P2D",
        status: "사용완료",
        isUsed: true,
        memberName: "박서준",
        email: "seojun.park@example.com",
        userId: "U-1003",
        accessStartDate: "2026-06-04",
        accessEndDate: "2026-12-01",
        usedAt: "2026-06-04 08:06",
      },
      { id: "code-0004", code: "D1T5-R9KP-M4ZX-8N7Q", status: "미사용", isUsed: false, memo: "미배포" },
      { id: "code-0005", code: "E8L2-W6VC-Q3BN-5R9T", status: "폐기", isUsed: false, memo: "담당자 요청으로 폐기" },
    ],
    operationMemo: "코드는 담당자에게 CSV로 전달합니다. 모든 코드는 개인별 16자리 영문+숫자 조합이며 1인 1회 사용으로 고정됩니다.",
    logs: [
      { id: "log-1", actor: "admin@studymini.com", action: "B2B 수강코드 120개 생성", createdAt: "2026-05-28 15:21" },
      { id: "log-2", actor: "admin@studymini.com", action: "대상 콘텐츠에 글로벌 비즈니스 패키지 추가", createdAt: "2026-05-29 10:04" },
      { id: "log-3", actor: "system", action: "김민준 회원이 코드 입력", createdAt: "2026-06-02 09:18" },
    ],
  },
  {
    id: "trial-newhire-q3",
    name: "신입사원 온보딩 체험단 코드",
    category: "체험단",
    status: "예정",
    memo: "체험단 선정자에게 개인별 코드를 발송할 예정입니다.",
    organization: "StudyMini 체험단 운영팀",
    issuedCount: 80,
    usedCount: 0,
    accessPeriod: "지정일 시작 2026-07-01 · 고정 종료일 2026-12-31",
    accessStartBasis: "지정일 시작",
    content: [searchableAccessContents[3]],
    codes: [
      { id: "code-trial-1", code: "T3RA-7QMN-2KLP-9XZD", status: "미사용", isUsed: false, memo: "1차 선정자 발송 예정" },
      { id: "code-trial-2", code: "T8VB-1NQC-6WLM-4RKP", status: "미사용", isUsed: false, memo: "1차 선정자 발송 예정" },
      { id: "code-trial-3", code: "T5HX-9DRA-3PZC-7MQL", status: "미사용", isUsed: false, memo: "예비 선정자용" },
    ],
    operationMemo: "체험단 선정자는 별도 권한 부여 없이 개인별 수강코드를 입력해 권한을 시작합니다.",
    logs: [
      { id: "log-4", actor: "admin@studymini.com", action: "체험단 수강코드 80개 생성", createdAt: "2026-06-01 13:12" },
      { id: "log-5", actor: "admin@studymini.com", action: "권한 시작 기준을 지정일 시작으로 설정", createdAt: "2026-06-02 16:30" },
    ],
  },
  {
    id: "jp-basic-agency",
    name: "공공기관 일본어 기초 지원",
    category: "B2B",
    status: "종료",
    memo: "상반기 파일럿 운영 종료. 재계약 논의 중.",
    organization: "Public Language Agency",
    issuedCount: 50,
    usedCount: 47,
    accessPeriod: "입력 즉시 시작 · 120일",
    accessStartBasis: "입력 즉시 시작",
    content: [searchableAccessContents[1]],
    codes: [
      {
        id: "code-jp-1",
        code: "J7PL-4KQX-8NMC-2RVA",
        status: "사용완료",
        isUsed: true,
        memberName: "최유진",
        email: "yujin.choi@example.com",
        userId: "U-2001",
        accessStartDate: "2026-03-06",
        accessEndDate: "2026-07-04",
        usedAt: "2026-03-06 14:23",
      },
      { id: "code-jp-2", code: "J2BX-9VLM-1QNP-6KRD", status: "만료", isUsed: false, memo: "권한 정책 종료 후 미사용" },
      { id: "code-jp-3", code: "J9MC-5RTA-7ZQK-3WPL", status: "미사용", isUsed: false, memo: "미사용 잔여 코드" },
    ],
    operationMemo: "최종 사용률 94%. 종료 리포트는 2026-05-03 담당자에게 공유 완료.",
    logs: [
      { id: "log-6", actor: "admin@studymini.com", action: "B2B 수강코드 50개 생성", createdAt: "2026-02-20 10:12" },
      { id: "log-7", actor: "system", action: "권한 정책 종료로 미사용 코드 만료 처리", createdAt: "2026-05-01 00:00" },
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

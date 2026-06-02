import { courseClasses } from "../courses/data";

export type GroupType = "마케팅" | "B2B" | "내부 테스트" | "기타";
export type GroupStatus = "예정" | "진행중" | "종료";
export type GroupUserLearningStatus = "수강 예정" | "수강중" | "만료";

export type GroupClass = {
  id: string;
  className: string;
  language: string;
  course: string;
  visibility: "공개" | "비공개";
};

export type GroupUser = {
  id: string;
  name: string;
  userId: string;
  email: string;
  learningStatus: GroupUserLearningStatus;
  startedAt: string;
  endedAt: string;
};

export type CsvValidationRow = {
  row: number;
  name: string;
  userId: string;
  email: string;
  result: "정상" | "확인 필요";
  message: string;
};

export type GroupLog = {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  operator: string;
};

export type LmsGroup = {
  id: string;
  groupName: string;
  companyName: string;
  campaignName: string;
  type: GroupType;
  description: string;
  startedAt: string;
  endedAt: string;
  status: GroupStatus;
  autoExpire: boolean;
  classes: GroupClass[];
  users: GroupUser[];
  csvValidationRows: CsvValidationRow[];
  logs: GroupLog[];
};

function pickClasses(ids: string[]): GroupClass[] {
  return ids
    .map((id) => courseClasses.find((courseClass) => courseClass.id === id))
    .filter((courseClass): courseClass is NonNullable<typeof courseClass> => Boolean(courseClass))
    .map((courseClass) => ({
      id: courseClass.id,
      className: courseClass.className,
      language: courseClass.language,
      course: courseClass.course,
      visibility: courseClass.visibility,
    }));
}

export const lmsGroups: LmsGroup[] = [
  {
    id: "GRP-REVU-2026-06",
    groupName: "레뷰 일본어 베이직 6월 체험단",
    companyName: "레뷰코퍼레이션",
    campaignName: "일본어 베이직 14일 체험 캠페인",
    type: "마케팅",
    description: "마케팅 체험단에게 일본어 베이직 수업을 2주 동안 제공하는 기간제 그룹입니다.",
    startedAt: "2026-06-01",
    endedAt: "2026-06-14",
    status: "진행중",
    autoExpire: true,
    classes: pickClasses(["CLS-JP-BSC-01", "CLS-JP-BSC-02"]),
    users: [
      {
        id: "SM-1024",
        name: "지윤 김",
        userId: "SM-1024",
        email: "jiyoon.kim@example.com",
        learningStatus: "수강중",
        startedAt: "2026-06-01",
        endedAt: "2026-06-14",
      },
      {
        id: "SM-1018",
        name: "현우 윤",
        userId: "SM-1018",
        email: "hyunwoo.yoon@example.com",
        learningStatus: "수강중",
        startedAt: "2026-06-01",
        endedAt: "2026-06-14",
      },
      {
        id: "SM-1015",
        name: "예린 한",
        userId: "SM-1015",
        email: "yerin.han@example.com",
        learningStatus: "수강중",
        startedAt: "2026-06-02",
        endedAt: "2026-06-14",
      },
    ],
    csvValidationRows: [
      {
        row: 2,
        name: "지윤 김",
        userId: "SM-1024",
        email: "jiyoon.kim@example.com",
        result: "정상",
        message: "기존 회원 매칭 완료",
      },
      {
        row: 3,
        name: "현우 윤",
        userId: "SM-1018",
        email: "hyunwoo.yoon@example.com",
        result: "정상",
        message: "업로드 가능",
      },
      {
        row: 4,
        name: "민지 오",
        userId: "SM-0000",
        email: "minji.o@example.com",
        result: "확인 필요",
        message: "User ID가 존재하지 않습니다.",
      },
    ],
    logs: [
      {
        id: "LOG-001",
        type: "그룹 생성",
        message: "레뷰 일본어 베이직 6월 체험단 그룹이 생성되었습니다.",
        createdAt: "2026-05-29 10:12",
        operator: "Admin Team",
      },
      {
        id: "LOG-002",
        type: "수업 추가",
        message: "일본어 1단계, 일본어 2단계 수업이 추가되었습니다.",
        createdAt: "2026-05-29 10:18",
        operator: "Admin Team",
      },
      {
        id: "LOG-003",
        type: "유저 추가",
        message: "참여 유저 3명이 추가되었습니다.",
        createdAt: "2026-06-01 09:30",
        operator: "Admin Team",
      },
      {
        id: "LOG-004",
        type: "자동 만료 처리",
        message: "종료일 2026-06-14 이후 수업 접근 권한이 자동 회수되도록 예약되었습니다.",
        createdAt: "2026-06-01 09:35",
        operator: "System Mock",
      },
    ],
  },
  {
    id: "GRP-B2B-NOVA-2026-Q2",
    groupName: "노바테크 B2B 영어 리스닝 과정",
    companyName: "노바테크",
    campaignName: "2026 Q2 임직원 어학 지원",
    type: "B2B",
    description: "기업 임직원에게 영어 리스닝 스타터 수업을 분기 단위로 제공하는 B2B 그룹입니다.",
    startedAt: "2026-05-15",
    endedAt: "2026-08-31",
    status: "진행중",
    autoExpire: true,
    classes: pickClasses(["CLS-EN-LSN-01"]),
    users: [
      {
        id: "SM-1022",
        name: "서준 이",
        userId: "SM-1022",
        email: "seojoon.lee@example.com",
        learningStatus: "수강중",
        startedAt: "2026-05-15",
        endedAt: "2026-08-31",
      },
      {
        id: "SM-1017",
        name: "수아 임",
        userId: "SM-1017",
        email: "sua.lim@example.com",
        learningStatus: "수강중",
        startedAt: "2026-05-16",
        endedAt: "2026-08-31",
      },
    ],
    csvValidationRows: [
      {
        row: 2,
        name: "서준 이",
        userId: "SM-1022",
        email: "seojoon.lee@example.com",
        result: "정상",
        message: "B2B 그룹 참여자로 검증 완료",
      },
      {
        row: 3,
        name: "수아 임",
        userId: "SM-1017",
        email: "sua.lim@example.com",
        result: "정상",
        message: "업로드 가능",
      },
    ],
    logs: [
      {
        id: "LOG-101",
        type: "그룹 생성",
        message: "노바테크 B2B 영어 리스닝 과정 그룹이 생성되었습니다.",
        createdAt: "2026-05-10 14:05",
        operator: "Admin Team",
      },
      {
        id: "LOG-102",
        type: "수업 추가",
        message: "영어 리스닝 1단계 수업이 추가되었습니다.",
        createdAt: "2026-05-10 14:12",
        operator: "Admin Team",
      },
      {
        id: "LOG-103",
        type: "유저 추가",
        message: "CSV 업로드로 참여 유저 2명이 추가되었습니다.",
        createdAt: "2026-05-15 09:00",
        operator: "Admin Team",
      },
      {
        id: "LOG-104",
        type: "자동 만료 처리",
        message: "종료일 2026-08-31 이후 자동 만료가 켜져 있습니다.",
        createdAt: "2026-05-15 09:01",
        operator: "System Mock",
      },
    ],
  },
  {
    id: "GRP-INTERNAL-QA-2026-06",
    groupName: "내부 QA 다국어 수업 테스트",
    companyName: "StudyMini",
    campaignName: "6월 릴리즈 QA",
    type: "내부 테스트",
    description: "운영팀과 QA 담당자가 공개/비공개 수업 접근 흐름을 검증하기 위한 내부 테스트 그룹입니다.",
    startedAt: "2026-06-05",
    endedAt: "2026-06-21",
    status: "예정",
    autoExpire: true,
    classes: pickClasses(["CLS-ES-BSC-01", "CLS-EN-LSN-01"]),
    users: [
      {
        id: "SM-1016",
        name: "태오 문",
        userId: "SM-1016",
        email: "taeo.moon@example.com",
        learningStatus: "수강 예정",
        startedAt: "2026-06-05",
        endedAt: "2026-06-21",
      },
      {
        id: "SM-1014",
        name: "나은 백",
        userId: "SM-1014",
        email: "naeun.baek@example.com",
        learningStatus: "수강 예정",
        startedAt: "2026-06-05",
        endedAt: "2026-06-21",
      },
    ],
    csvValidationRows: [
      {
        row: 2,
        name: "태오 문",
        userId: "SM-1016",
        email: "taeo.moon@example.com",
        result: "정상",
        message: "내부 테스트 계정 확인 완료",
      },
      {
        row: 3,
        name: "나은 백",
        userId: "SM-1014",
        email: "naeun.baek@example.com",
        result: "정상",
        message: "업로드 가능",
      },
    ],
    logs: [
      {
        id: "LOG-201",
        type: "그룹 생성",
        message: "내부 QA 다국어 수업 테스트 그룹이 생성되었습니다.",
        createdAt: "2026-06-01 16:20",
        operator: "Admin Team",
      },
      {
        id: "LOG-202",
        type: "수업 추가",
        message: "스페인어 1단계, 영어 리스닝 1단계 수업이 추가되었습니다.",
        createdAt: "2026-06-01 16:25",
        operator: "Admin Team",
      },
      {
        id: "LOG-203",
        type: "유저 추가",
        message: "테스트 유저 2명이 추가되었습니다.",
        createdAt: "2026-06-01 16:35",
        operator: "Admin Team",
      },
      {
        id: "LOG-204",
        type: "자동 만료 처리",
        message: "종료일 2026-06-21 이후 권한 회수가 예약되었습니다.",
        createdAt: "2026-06-01 16:36",
        operator: "System Mock",
      },
    ],
  },
  {
    id: "GRP-PARTNER-SP-2026-05",
    groupName: "파트너 스페인어 단기 클래스",
    companyName: "브릿지러닝",
    campaignName: "파트너 공동 프로모션",
    type: "기타",
    description: "외부 파트너 프로모션 참여자에게 스페인어 베이직 수업을 단기 제공했던 종료 그룹입니다.",
    startedAt: "2026-05-01",
    endedAt: "2026-05-31",
    status: "종료",
    autoExpire: true,
    classes: pickClasses(["CLS-ES-BSC-01"]),
    users: [
      {
        id: "SM-1013",
        name: "로아 신",
        userId: "SM-1013",
        email: "roa.shin@example.com",
        learningStatus: "만료",
        startedAt: "2026-05-01",
        endedAt: "2026-05-31",
      },
      {
        id: "SM-1012",
        name: "준호 강",
        userId: "SM-1012",
        email: "junho.kang@example.com",
        learningStatus: "만료",
        startedAt: "2026-05-01",
        endedAt: "2026-05-31",
      },
    ],
    csvValidationRows: [
      {
        row: 2,
        name: "로아 신",
        userId: "SM-1013",
        email: "roa.shin@example.com",
        result: "정상",
        message: "종료 그룹 이력으로 보관 중",
      },
      {
        row: 3,
        name: "준호 강",
        userId: "SM-1012",
        email: "junho.kang@example.com",
        result: "정상",
        message: "만료 처리 완료",
      },
    ],
    logs: [
      {
        id: "LOG-301",
        type: "그룹 생성",
        message: "파트너 스페인어 단기 클래스 그룹이 생성되었습니다.",
        createdAt: "2026-04-25 11:10",
        operator: "Admin Team",
      },
      {
        id: "LOG-302",
        type: "유저 추가",
        message: "참여 유저 2명이 추가되었습니다.",
        createdAt: "2026-05-01 09:05",
        operator: "Admin Team",
      },
      {
        id: "LOG-303",
        type: "수업 추가",
        message: "스페인어 1단계 수업이 추가되었습니다.",
        createdAt: "2026-05-01 09:08",
        operator: "Admin Team",
      },
      {
        id: "LOG-304",
        type: "자동 만료 처리",
        message: "종료일 경과로 참여 유저 2명의 수업 접근 권한이 회수되었습니다.",
        createdAt: "2026-06-01 00:05",
        operator: "System Mock",
      },
    ],
  },
];

export const groupTypeOptions: Array<"전체" | GroupType> = ["전체", "마케팅", "B2B", "내부 테스트", "기타"];
export const groupStatusOptions: Array<"전체" | GroupStatus> = ["전체", "예정", "진행중", "종료"];

export function getEndingSoonGroups() {
  return lmsGroups.filter((group) => group.status === "진행중" && group.endedAt <= "2026-06-21");
}

export function getGroupStatusTone(status: GroupStatus) {
  if (status === "진행중") return "success";
  if (status === "예정") return "warning";
  return "slate";
}

export function getGroupTypeTone(type: GroupType) {
  if (type === "마케팅") return "default";
  if (type === "B2B") return "success";
  if (type === "내부 테스트") return "warning";
  return "slate";
}

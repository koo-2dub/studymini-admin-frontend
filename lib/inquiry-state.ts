export type InquiryStatus = "미답변" | "답변완료" | "보류";

export type InquiryProcessLog = {
  label: string;
  actor: string;
  date: string;
};

export type GeneralInquiry = {
  id: string;
  subject: string;
  requester: string;
  email: string;
  category: string;
  priority: string;
  createdAt: string;
  message: string;
  answer: string;
  status: InquiryStatus;
  manager: string;
  adminMemo: string;
  logs: InquiryProcessLog[];
};

export const currentAdminName = "김운영";

export const generalInquiries: GeneralInquiry[] = [
  {
    id: "INQ-304",
    subject: "영수증 발급 요청",
    requester: "Mina Lee",
    email: "mina.lee@example.com",
    category: "결제/영수증",
    priority: "Normal",
    createdAt: "2026-05-30 09:24",
    message: "회사 제출용으로 결제 영수증의 이름을 변경해서 다시 받을 수 있을까요?",
    answer: "",
    status: "미답변",
    manager: "-",
    adminMemo: "법인 제출용 서류 요청 가능성 있음.",
    logs: [],
  },
  {
    id: "INQ-305",
    subject: "녹화 강의 접근 불가",
    requester: "Avery Kim",
    email: "avery.kim@example.com",
    category: "수강/접근",
    priority: "High",
    createdAt: "2026-05-30 13:10",
    message: "어제까지 보이던 녹화 강의가 오늘부터 재생 목록에서 사라졌습니다. 확인 부탁드립니다.",
    answer: "수강 권한 동기화가 지연되어 발생한 문제로 확인했습니다. 현재 권한을 다시 반영했으며, 새로고침 후 녹화 강의를 확인해 주세요.",
    status: "답변완료",
    manager: currentAdminName,
    adminMemo: "권한 동기화 재시도 완료.",
    logs: [{ label: "답변 저장", actor: currentAdminName, date: "2026-05-30 13:42" }],
  },
  {
    id: "INQ-306",
    subject: "팀 좌석 취소 문의",
    requester: "Daniel Wu",
    email: "daniel.wu@example.com",
    category: "팀 플랜",
    priority: "Low",
    createdAt: "2026-05-31 16:05",
    message: "다음 달부터 팀 좌석 2개를 줄이고 싶습니다. 가능한 절차를 알려주세요.",
    answer: "",
    status: "보류",
    manager: currentAdminName,
    adminMemo: "다음 결제 주기와 환불 정책 확인 필요.",
    logs: [{ label: "보류 처리", actor: currentAdminName, date: "2026-05-31 16:28" }],
  },
];

export const inquiryStorageKey = "studymini.general-inquiries.v1";

export type InquiryStatus = "미답변" | "답변완료";

export type Inquiry = {
  id: string;
  subject: string;
  requester: string;
  email: string;
  status: InquiryStatus;
  assignee: string;
  inquiryDate: string;
  answeredAt: string;
  content: string;
  answer: string;
};

export const currentAdminName = "관리자 김민준";

export const inquiries: Inquiry[] = [
  {
    id: "INQ-304",
    subject: "영수증 발급 요청",
    requester: "Mina Lee",
    email: "mina.lee@example.com",
    status: "답변완료",
    assignee: "관리자 이서연",
    inquiryDate: "2026-06-01",
    answeredAt: "2026-06-01",
    content: "지난 결제 건에 대한 영수증을 회사 제출용으로 발급받고 싶습니다.\n결제자명도 함께 확인 부탁드립니다.",
    answer: "안녕하세요, Mina Lee님. 요청하신 결제 영수증을 이메일로 발송해드렸습니다. 추가로 필요한 정보가 있으시면 다시 문의해주세요.",
  },
  {
    id: "INQ-305",
    subject: "녹화 강의 접근이 안 됩니다",
    requester: "Avery Kim",
    email: "avery.kim@example.com",
    status: "미답변",
    assignee: "-",
    inquiryDate: "2026-06-01",
    answeredAt: "-",
    content: "결제 후 녹화 강의 목록에 들어가면 권한이 없다는 메시지가 보입니다.\n수강 기간은 남아 있는 것으로 확인됩니다.",
    answer: "",
  },
  {
    id: "INQ-306",
    subject: "팀 좌석 취소 문의",
    requester: "Daniel Wu",
    email: "daniel.wu@example.com",
    status: "미답변",
    assignee: "-",
    inquiryDate: "2026-05-29",
    answeredAt: "-",
    content: "팀 플랜 좌석 2개를 다음 결제일부터 취소하고 싶습니다.\n남은 기간 정산 방식도 안내 부탁드립니다.",
    answer: "",
  },
  {
    id: "INQ-307",
    subject: "회원가입 인증 메일 재발송",
    requester: "Noah Park",
    email: "noah.park@example.com",
    status: "답변완료",
    assignee: "관리자 박하린",
    inquiryDate: "2026-05-28",
    answeredAt: "2026-05-28",
    content: "회원가입 인증 메일이 도착하지 않아 로그인을 완료하지 못하고 있습니다. 인증 메일 재발송을 요청드립니다.",
    answer: "안녕하세요, Noah Park님. 인증 메일을 재발송했습니다. 스팸함도 함께 확인 부탁드립니다.",
  },
];

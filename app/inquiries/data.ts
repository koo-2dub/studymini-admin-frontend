export type InquiryStatus = "미답변" | "답변완료" | "보류";

export type InquiryAnswer = {
  answeredAt: string;
  author: string;
  content: string;
};

export type InquiryLog = {
  loggedAt: string;
  content: string;
};

export type Inquiry = {
  id: string;
  memberId: string;
  userName: string;
  email: string;
  title: string;
  content: string;
  status: InquiryStatus;
  assignee: string;
  createdAt: string;
  answeredAt: string;
  currentAdmin: string;
  attachments: string[];
  draftAnswer: string;
  answers: InquiryAnswer[];
  memo: string;
  logs: InquiryLog[];
};

export const inquiryAssignees = ["전체", "김운영", "이서포트", "박관리", "미배정"] as const;
export const inquiryStatuses = ["전체", "미답변", "답변완료", "보류"] as const;

export const generalInquiries: Inquiry[] = [
  {
    id: "INQ-304",
    memberId: "SM-1024",
    userName: "지윤 김",
    email: "jiyoon.kim@example.com",
    title: "결제 영수증의 사업자명 변경을 요청합니다",
    content:
      "지난주 결제한 비즈니스 회화 집중반 영수증에 개인 이름으로 표시되어 있습니다. 회사 비용 처리 때문에 사업자명과 사업자등록번호가 들어간 영수증으로 다시 발급받고 싶습니다. 필요한 정보가 있으면 안내 부탁드립니다.",
    status: "답변완료",
    assignee: "김운영",
    createdAt: "2026-05-29 09:18",
    answeredAt: "2026-05-29 11:42",
    currentAdmin: "김운영",
    attachments: ["사업자등록증.pdf", "기존_영수증.png"],
    draftAnswer: "요청하신 사업자 정보 기준으로 영수증 재발급을 완료했습니다. 마이페이지 결제 내역에서 확인하실 수 있습니다.",
    answers: [
      {
        answeredAt: "2026-05-29 11:42",
        author: "김운영",
        content: "요청하신 사업자명으로 영수증을 재발급했습니다. 결제 내역에서 새 영수증을 다운로드해 주세요.",
      },
    ],
    memo: "사업자등록증 확인 완료. 동일 요청 반복 가능성이 있어 결제 내역 안내 링크 포함.",
    logs: [
      { loggedAt: "2026-05-29 09:20", content: "김운영 관리자가 문의를 확인했습니다." },
      { loggedAt: "2026-05-29 11:42", content: "김운영 관리자가 답변을 저장하고 답변완료 처리했습니다." },
    ],
  },
  {
    id: "INQ-305",
    memberId: "SM-1023",
    userName: "민서 박",
    email: "minseo.park@example.com",
    title: "회원가입 인증 메일이 도착하지 않습니다",
    content:
      "회원가입 후 인증 메일을 여러 번 다시 요청했지만 받은편지함과 스팸함 어디에도 메일이 없습니다. 다른 이메일 주소로 변경해야 하는지, 아니면 인증 메일을 다시 발송해주실 수 있는지 확인 부탁드립니다.",
    status: "미답변",
    assignee: "미배정",
    createdAt: "2026-05-30 14:06",
    answeredAt: "-",
    currentAdmin: "이서포트",
    attachments: [],
    draftAnswer: "",
    answers: [],
    memo: "메일 발송 로그 확인 필요. 가입 직후 3회 재발송 요청 기록 있음.",
    logs: [
      { loggedAt: "2026-05-30 14:06", content: "신규 일반 문의가 접수되었습니다." },
      { loggedAt: "2026-05-30 14:15", content: "자동 분류: 계정/인증 문의로 태깅되었습니다." },
    ],
  },
  {
    id: "INQ-306",
    memberId: "SM-1021",
    userName: "하린 최",
    email: "harin.choi@example.com",
    title: "휴면 계정 해제 후 기존 수강 내역 확인 문의",
    content:
      "오랜만에 로그인하려고 하니 휴면 계정이라고 안내됩니다. 휴면 해제 후 예전에 들었던 일본어 문법 완성 강의 수강 기록과 결제 내역을 그대로 확인할 수 있는지 궁금합니다.",
    status: "보류",
    assignee: "박관리",
    createdAt: "2026-05-28 17:31",
    answeredAt: "-",
    currentAdmin: "박관리",
    attachments: ["휴면_안내_화면.png"],
    draftAnswer: "휴면 해제 절차를 안내드리기 전에 본인 확인이 필요합니다. 가입 휴대폰 번호 뒤 4자리를 회신해 주세요.",
    answers: [
      {
        answeredAt: "2026-05-28 18:02",
        author: "박관리",
        content: "휴면 해제 후에도 기존 수강 내역과 결제 내역은 유지됩니다. 다만 개인정보 보호를 위해 본인 확인을 먼저 진행하겠습니다.",
      },
    ],
    memo: "본인 확인 대기 중. 휴면 해제 링크는 본인 확인 후 발송.",
    logs: [
      { loggedAt: "2026-05-28 17:35", content: "박관리 관리자가 문의를 담당했습니다." },
      { loggedAt: "2026-05-28 18:02", content: "박관리 관리자가 1차 답변을 저장했습니다." },
      { loggedAt: "2026-05-29 10:00", content: "회원 회신 대기 상태로 보류 처리했습니다." },
    ],
  },
  {
    id: "INQ-307",
    memberId: "SM-1020",
    userName: "도윤 정",
    email: "doyoon.jung@example.com",
    title: "세금계산서 발행 가능 여부 문의",
    content:
      "중국어 올인원과 HSK 실전반을 회사 교육비로 처리하려고 합니다. 카드 결제 건도 세금계산서 발행이 가능한지, 불가능하다면 어떤 증빙을 제출하면 되는지 알려주세요.",
    status: "답변완료",
    assignee: "이서포트",
    createdAt: "2026-05-27 10:24",
    answeredAt: "2026-05-27 13:10",
    currentAdmin: "이서포트",
    attachments: [],
    draftAnswer: "카드 결제 건은 세금계산서 중복 발행이 어렵고, 카드 매출전표와 영수증을 증빙으로 제출하실 수 있습니다.",
    answers: [
      {
        answeredAt: "2026-05-27 13:10",
        author: "이서포트",
        content: "카드 결제 건은 세금계산서가 중복 발행되지 않습니다. 결제 내역의 카드 매출전표와 영수증을 증빙으로 사용해 주세요.",
      },
    ],
    memo: "고액 결제 회원. 환불/증빙 정책 문서 링크 함께 안내함.",
    logs: [
      { loggedAt: "2026-05-27 10:30", content: "이서포트 관리자가 문의를 확인했습니다." },
      { loggedAt: "2026-05-27 13:10", content: "이서포트 관리자가 답변완료 처리했습니다." },
    ],
  },
];

export function getInquiryById(id: string) {
  return generalInquiries.find((inquiry) => inquiry.id === id);
}

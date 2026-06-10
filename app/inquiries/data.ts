export type InquiryStatus = "미답변" | "답변완료";

export type InquiryAttachment = {
  id: string;
  name: string;
  type: "image" | "pdf" | "file";
  mimeType: string;
  size: string;
  uploadedAt: string;
  downloadUrl: string;
  thumbnailUrl?: string;
};

export type Inquiry = {
  id: string;
  subject: string;
  requester: string;
  memberId: string;
  email: string;
  phone: string;
  memberStatus: string;
  lastLogin: string;
  status: InquiryStatus;
  assignee: string;
  inquiryDate: string;
  answeredAt: string;
  content: string;
  answer: string;
  attachments: InquiryAttachment[];
  logs: { action: string; actor: string; at: string; note: string }[];
};

export const currentAdminName = "관리자 김민준";

export const inquiries: Inquiry[] = [
  {
    id: "INQ-304",
    subject: "영수증 발급 요청",
    requester: "유나 강",
    memberId: "SM-1019",
    email: "yuna.kang@example.com",
    phone: "010-3145-1019",
    memberStatus: "탈퇴",
    lastLogin: "2026-04-01",
    status: "답변완료",
    assignee: "관리자 이서연",
    inquiryDate: "2026-06-01",
    answeredAt: "2026-06-01",
    content:
      "지난 결제 건에 대한 영수증을 회사 제출용으로 발급받고 싶습니다.\n결제자명도 함께 확인 부탁드립니다.",
    answer:
      "안녕하세요, 유나 강님. 요청하신 결제 영수증을 이메일로 발송해드렸습니다. 추가로 필요한 정보가 있으시면 다시 문의해주세요.",
    attachments: [
      {
        id: "ATT-INQ-304-1",
        name: "영수증_요청정보.pdf",
        type: "pdf",
        mimeType: "application/pdf",
        size: "184KB",
        uploadedAt: "2026-06-01 09:12",
        downloadUrl: "/mock-files/inquiries/INQ-304/receipt-request.pdf",
      },
    ],
    logs: [
      { action: "답변 저장", actor: "관리자 이서연", at: "2026-06-01", note: "영수증 발급 안내 답변을 저장했습니다." },
      { action: "문의 접수", actor: "시스템", at: "2026-06-01", note: "일반 문의가 접수되었습니다." },
    ],
  },
  {
    id: "INQ-305",
    subject: "녹화 강의 접근이 안 됩니다",
    requester: "지윤 김",
    memberId: "SM-1024",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    memberStatus: "정상",
    lastLogin: "2026-05-29",
    status: "미답변",
    assignee: "-",
    inquiryDate: "2026-06-01",
    answeredAt: "-",
    content:
      "결제 후 녹화 강의 목록에 들어가면 권한이 없다는 메시지가 보입니다.\n수강 기간은 남아 있는 것으로 확인됩니다.",
    answer: "",
    attachments: [
      {
        id: "ATT-INQ-305-1",
        name: "강의_접근_오류화면.png",
        type: "image",
        mimeType: "image/png",
        size: "412KB",
        uploadedAt: "2026-06-01 10:24",
        downloadUrl: "/mock-files/inquiries/INQ-305/access-error.png",
        thumbnailUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='18' fill='%23eef2ff'/%3E%3Cpath d='M22 68l18-22 14 16 8-10 12 16H22z' fill='%236366f1'/%3E%3Ccircle cx='66' cy='30' r='8' fill='%23818cf8'/%3E%3C/svg%3E",
      },
      {
        id: "ATT-INQ-305-2",
        name: "브라우저_콘솔로그.txt",
        type: "file",
        mimeType: "text/plain",
        size: "16KB",
        uploadedAt: "2026-06-01 10:25",
        downloadUrl: "/mock-files/inquiries/INQ-305/console-log.txt",
      },
    ],
    logs: [{ action: "문의 접수", actor: "시스템", at: "2026-06-01", note: "일반 문의가 접수되었습니다." }],
  },
  {
    id: "INQ-306",
    subject: "팀 좌석 취소 문의",
    requester: "도윤 정",
    memberId: "SM-1020",
    email: "doyoon.jung@example.com",
    phone: "010-6610-1020",
    memberStatus: "정상",
    lastLogin: "2026-05-05",
    status: "미답변",
    assignee: "-",
    inquiryDate: "2026-05-29",
    answeredAt: "-",
    content:
      "팀 플랜 좌석 2개를 다음 결제일부터 취소하고 싶습니다.\n남은 기간 정산 방식도 안내 부탁드립니다.",
    answer: "",
    attachments: [],
    logs: [{ action: "문의 접수", actor: "시스템", at: "2026-05-29", note: "일반 문의가 접수되었습니다." }],
  },
  {
    id: "INQ-307",
    subject: "회원가입 인증 메일 재발송",
    requester: "민서 박",
    memberId: "SM-1023",
    email: "minseo.park@example.com",
    phone: "010-3488-1023",
    memberStatus: "정상",
    lastLogin: "2026-05-28",
    status: "답변완료",
    assignee: "관리자 박하린",
    inquiryDate: "2026-05-28",
    answeredAt: "2026-05-28",
    content: "회원가입 인증 메일이 도착하지 않아 로그인을 완료하지 못하고 있습니다. 인증 메일 재발송을 요청드립니다.",
    answer: "안녕하세요, 민서 박님. 인증 메일을 재발송했습니다. 스팸함도 함께 확인 부탁드립니다.",
    attachments: [
      {
        id: "ATT-INQ-307-1",
        name: "메일함_캡처.jpg",
        type: "image",
        mimeType: "image/jpeg",
        size: "268KB",
        uploadedAt: "2026-05-28 15:08",
        downloadUrl: "/mock-files/inquiries/INQ-307/mailbox.jpg",
        thumbnailUrl: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='18' fill='%23ecfeff'/%3E%3Cpath d='M20 66l16-18 12 12 10-14 18 20H20z' fill='%2306b6d4'/%3E%3Ccircle cx='65' cy='31' r='8' fill='%2322d3ee'/%3E%3C/svg%3E",
      },
    ],
    logs: [
      { action: "답변 저장", actor: "관리자 박하린", at: "2026-05-28", note: "인증 메일 재발송 안내 답변을 저장했습니다." },
      { action: "문의 접수", actor: "시스템", at: "2026-05-28", note: "일반 문의가 접수되었습니다." },
    ],
  },
];

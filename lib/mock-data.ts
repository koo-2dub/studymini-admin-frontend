import {
  BadgePercent,
  BellRing,
  BookOpenCheck,
  CircleDollarSign,
  Coins,
  CreditCard,
  HelpCircle,
  LineChart,
  Megaphone,
  ReceiptText,
  UsersRound,
  WalletCards,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/", icon: LineChart },
  { title: "Members", href: "/members", icon: UsersRound },
  { title: "Orders / Payments", href: "/orders", icon: CreditCard },
  {
    title: "문의 관리",
    href: "/inquiries",
    icon: HelpCircle,
    children: [
      { title: "일반 문의", href: "/inquiries/general" },
      { title: "학습 문의", href: "/inquiries/lesson" },
    ],
  },
  { title: "Coupons", href: "/coupons", icon: BadgePercent },
  { title: "Vouchers", href: "/vouchers", icon: WalletCards },
  { title: "Points", href: "/points", icon: Coins },
  { title: "Popup management", href: "/popups", icon: Megaphone },
  { title: "Sales analytics", href: "/analytics", icon: CircleDollarSign },
];

export const stats = [
  { label: "Monthly revenue", value: "$184,260", change: "+18.4%", tone: "indigo" },
  { label: "Active learners", value: "12,480", change: "+9.2%", tone: "emerald" },
  { label: "Open tickets", value: "38", change: "-12 today", tone: "amber" },
  { label: "Conversion rate", value: "7.8%", change: "+1.1 pts", tone: "rose" },
];

export type MemberStatus = "정상" | "휴면" | "탈퇴";
export type CustomerType = "구매회원" | "미구매회원";
export type LearningStatus = "수강중" | "수강 이력 있음" | "수강 이력 없음";

export type MemberOrder = {
  id: string;
  product: string;
  amount: number;
  status: string;
  date: string;
};

export type MemberRecord = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: MemberStatus;
  marketingConsent: boolean;
  joined: string;
  lastLogin: string;
  customerType: CustomerType;
  segment: CustomerType;
  orderCount: number;
  totalPayment: number;
  spend: string;
  plan: string;
  learningStatus: LearningStatus;
  courseStatus: LearningStatus;
  points: number;
  lessons: number;
  courses: string[];
  groups: string[];
  coupons: string[];
  vouchers: string[];
  inquiries: string[];
  lessonQuestions: string[];
  adminMemos: string[];
  orders: MemberOrder[];
};

const formatSpend = (value: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Math.round(value / 1000));

function member(data: Omit<MemberRecord, "segment" | "courseStatus" | "spend" | "plan">): MemberRecord {
  return {
    ...data,
    segment: data.customerType,
    courseStatus: data.learningStatus,
    spend: formatSpend(data.totalPayment),
    plan: data.courses[0] ?? "Free",
  };
}

export const members: MemberRecord[] = [
  member({
    id: "SM-1024",
    name: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    status: "정상",
    marketingConsent: true,
    joined: "2026-05-29",
    lastLogin: "2026-05-29",
    customerType: "구매회원",
    orderCount: 3,
    totalPayment: 428000,
    learningStatus: "수강중",
    points: 4850,
    lessons: 74,
    courses: ["스페인어 베이직", "비즈니스 회화 집중반"],
    groups: ["2026 상반기 집중 코호트"],
    coupons: ["WELCOME10 사용 완료"],
    vouchers: ["1:1 코칭 바우처 보유"],
    inquiries: ["영수증 발급 요청 - 처리 완료"],
    lessonQuestions: ["스페인어 베이직 12강 질문 - 답변 완료"],
    adminMemos: ["VIP 전환 후보.\n다음 갱신일 전 안내 필요."],
    orders: [
      { id: "ORD-4924", product: "비즈니스 회화 집중반", amount: 229000, status: "결제완료", date: "2026-05-29" },
      { id: "ORD-4881", product: "스페인어 베이직", amount: 149000, status: "결제완료", date: "2026-05-13" },
      { id: "ORD-4802", product: "1:1 코칭", amount: 50000, status: "결제완료", date: "2026-04-22" },
    ],
  }),
  member({
    id: "SM-1023",
    name: "민서 박",
    email: "minseo.park@example.com",
    phone: "010-3488-1023",
    status: "정상",
    marketingConsent: false,
    joined: "2026-05-27",
    lastLogin: "2026-05-28",
    customerType: "미구매회원",
    orderCount: 0,
    totalPayment: 0,
    learningStatus: "수강 이력 없음",
    points: 300,
    lessons: 0,
    courses: [],
    groups: [],
    coupons: ["WELCOME10 발급"],
    vouchers: [],
    inquiries: ["회원가입 인증 메일 문의 - 처리 완료"],
    lessonQuestions: [],
    adminMemos: ["무료 체험 온보딩 메일 발송 대상."],
    orders: [],
  }),
  member({
    id: "SM-1022",
    name: "서준 이",
    email: "seojoon.lee@example.com",
    phone: "010-9082-1022",
    status: "정상",
    marketingConsent: true,
    joined: "2026-05-21",
    lastLogin: "2026-05-24",
    customerType: "구매회원",
    orderCount: 1,
    totalPayment: 99000,
    learningStatus: "수강중",
    points: 1200,
    lessons: 18,
    courses: ["영어 리스닝 스타터"],
    groups: ["리스닝 5월반"],
    coupons: [],
    vouchers: ["모의고사 응시권 사용 완료"],
    inquiries: [],
    lessonQuestions: ["영어 리스닝 스타터 04강 질문 - 답변 대기"],
    adminMemos: ["학습 질문 응답 지연 알림 확인."],
    orders: [{ id: "ORD-4917", product: "영어 리스닝 스타터", amount: 99000, status: "결제완료", date: "2026-05-21" }],
  }),
  member({
    id: "SM-1021",
    name: "하린 최",
    email: "harin.choi@example.com",
    phone: "010-7752-1021",
    status: "휴면",
    marketingConsent: false,
    joined: "2026-04-19",
    lastLogin: "2026-02-13",
    customerType: "구매회원",
    orderCount: 2,
    totalPayment: 278000,
    learningStatus: "수강 이력 있음",
    points: 2130,
    lessons: 45,
    courses: ["일본어 문법 완성"],
    groups: [],
    coupons: ["WINBACK40 발급"],
    vouchers: [],
    inquiries: ["휴면 해제 문의 - 처리 중"],
    lessonQuestions: [],
    adminMemos: ["90일 이상 미접속.\n복귀 캠페인 대상."],
    orders: [
      { id: "ORD-4863", product: "일본어 문법 완성", amount: 179000, status: "결제완료", date: "2026-04-19" },
      { id: "ORD-4820", product: "첨삭권", amount: 99000, status: "결제완료", date: "2026-03-07" },
    ],
  }),
  member({
    id: "SM-1020",
    name: "도윤 정",
    email: "doyoon.jung@example.com",
    phone: "010-6610-1020",
    status: "정상",
    marketingConsent: true,
    joined: "2026-03-31",
    lastLogin: "2026-05-05",
    customerType: "구매회원",
    orderCount: 4,
    totalPayment: 734000,
    learningStatus: "수강중",
    points: 8930,
    lessons: 128,
    courses: ["중국어 올인원", "HSK 실전반"],
    groups: ["HSK 6월 목표반"],
    coupons: ["TEAMUP 사용 완료"],
    vouchers: ["그룹 특강 바우처 보유"],
    inquiries: ["세금계산서 요청 - 처리 완료"],
    lessonQuestions: ["HSK 실전반 08강 질문 - 답변 완료"],
    adminMemos: ["고액 결제 회원.\n환불 정책 안내 완료."],
    orders: [
      { id: "ORD-4875", product: "HSK 실전반", amount: 199000, status: "결제완료", date: "2026-04-28" },
      { id: "ORD-4799", product: "중국어 올인원", amount: 399000, status: "결제완료", date: "2026-03-31" },
      { id: "ORD-4760", product: "첨삭 패키지", amount: 136000, status: "결제완료", date: "2026-03-11" },
    ],
  }),
  member({
    id: "SM-1019",
    name: "유나 강",
    email: "yuna.kang@example.com",
    phone: "010-3145-1019",
    status: "탈퇴",
    marketingConsent: false,
    joined: "2026-03-12",
    lastLogin: "2026-04-01",
    customerType: "미구매회원",
    orderCount: 0,
    totalPayment: 0,
    learningStatus: "수강 이력 없음",
    points: 0,
    lessons: 0,
    courses: [],
    groups: [],
    coupons: [],
    vouchers: [],
    inquiries: ["탈퇴 요청 - 처리 완료"],
    lessonQuestions: [],
    adminMemos: ["개인정보 삭제 요청 완료."],
    orders: [],
  }),
  member({
    id: "SM-1018",
    name: "준호 임",
    email: "junho.lim@example.com",
    phone: "010-1209-1018",
    status: "정상",
    marketingConsent: true,
    joined: "2026-02-18",
    lastLogin: "2026-05-18",
    customerType: "구매회원",
    orderCount: 2,
    totalPayment: 328000,
    learningStatus: "수강중",
    points: 3420,
    lessons: 52,
    courses: ["프랑스어 회화"],
    groups: ["프랑스어 평일반"],
    coupons: ["SPRING26 사용 완료"],
    vouchers: [],
    inquiries: [],
    lessonQuestions: ["프랑스어 회화 03강 질문 - 답변 완료"],
    adminMemos: ["꾸준한 수강 패턴."],
    orders: [
      { id: "ORD-4752", product: "프랑스어 회화", amount: 229000, status: "결제완료", date: "2026-02-18" },
      { id: "ORD-4791", product: "발음 클리닉", amount: 99000, status: "결제완료", date: "2026-03-02" },
    ],
  }),
  member({
    id: "SM-1017",
    name: "수아 한",
    email: "sua.han@example.com",
    phone: "010-8033-1017",
    status: "휴면",
    marketingConsent: true,
    joined: "2026-01-09",
    lastLogin: "2026-01-20",
    customerType: "미구매회원",
    orderCount: 0,
    totalPayment: 0,
    learningStatus: "수강 이력 있음",
    points: 510,
    lessons: 7,
    courses: ["무료 일본어 입문"],
    groups: [],
    coupons: ["WINBACK40 발급"],
    vouchers: [],
    inquiries: [],
    lessonQuestions: [],
    adminMemos: ["마케팅 동의 회원.\n휴면 복귀 쿠폰 발송 가능."],
    orders: [],
  }),
];

export const memberTimeline = [
  "Completed Advanced Algebra checkpoint",
  "Redeemed 1,000 points for coaching voucher",
  "Submitted lesson question for Physics Lab 08",
  "Purchased Pro Annual renewal",
];

export type AdminOrder = {
  id: string;
  member: string;
  email: string;
  phone: string;
  userId: string;
  product: string;
  amount: string;
  status: string;
  date: string;
  paidAt?: string;
  paymentAmount: number;
  refundAmount: number;
  paymentStatus: "결제완료" | "결제대기" | "환불요청" | "결제실패";
  orderStatus: "주문완료" | "환불요청" | "결제필요" | "취소" | "처리중";
  shippingStatus: "배송전" | "배송대기" | "배송중" | "배송완료" | "-";
  couponUsed: boolean;
  pointsUsed: boolean;
};

export const orders: AdminOrder[] = [
  {
    id: "ORD-5028",
    member: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    userId: "SM-1024",
    product: "비즈니스 회화 집중반",
    amount: "₩215,000",
    status: "결제완료",
    date: "2026-05-29",
    paidAt: "2026-05-29 09:42",
    paymentAmount: 215000,
    refundAmount: 0,
    paymentStatus: "결제완료",
    orderStatus: "주문완료",
    shippingStatus: "배송대기",
    couponUsed: true,
    pointsUsed: true,
  },
  {
    id: "ORD-5027",
    member: "Monica Shin",
    email: "monica.shin@example.com",
    phone: "010-7730-1032",
    userId: "SM-1032",
    product: "교재 추가 배송",
    amount: "₩35,000",
    status: "환불요청",
    date: "2026-05-29",
    paidAt: "2026-05-29 08:10",
    paymentAmount: 35000,
    refundAmount: 35000,
    paymentStatus: "환불요청",
    orderStatus: "환불요청",
    shippingStatus: "-",
    couponUsed: false,
    pointsUsed: false,
  },
  {
    id: "ORD-5022",
    member: "Oscar Ha",
    email: "oscar.ha@example.com",
    phone: "010-4422-1031",
    userId: "SM-1031",
    product: "스페인어 베이직",
    amount: "₩149,000",
    status: "결제대기",
    date: "2026-05-28",
    paymentAmount: 149000,
    refundAmount: 0,
    paymentStatus: "결제대기",
    orderStatus: "결제필요",
    shippingStatus: "배송전",
    couponUsed: false,
    pointsUsed: true,
  },
  {
    id: "ORD-5019",
    member: "서준 이",
    email: "seojun.lee@example.com",
    phone: "010-9912-1022",
    userId: "SM-1022",
    product: "영어 리스닝 스타터",
    amount: "₩99,000",
    status: "결제완료",
    date: "2026-05-27",
    paidAt: "2026-05-27 14:33",
    paymentAmount: 99000,
    refundAmount: 0,
    paymentStatus: "결제완료",
    orderStatus: "주문완료",
    shippingStatus: "배송완료",
    couponUsed: true,
    pointsUsed: false,
  },
  {
    id: "ORD-5015",
    member: "민서 박",
    email: "minseo.park@example.com",
    phone: "010-1200-1023",
    userId: "SM-1023",
    product: "1:1 코칭",
    amount: "₩100,000",
    status: "결제실패",
    date: "2026-05-26",
    paymentAmount: 100000,
    refundAmount: 0,
    paymentStatus: "결제실패",
    orderStatus: "취소",
    shippingStatus: "-",
    couponUsed: false,
    pointsUsed: false,
  },
];

export const inquiries = [
  { id: "INQ-304", subject: "Invoice name change", requester: "Mina Lee", priority: "Normal", status: "Open" },
  { id: "INQ-305", subject: "Cannot access recorded lesson", requester: "Avery Kim", priority: "High", status: "In progress" },
  { id: "INQ-306", subject: "Cancel team seat", requester: "Daniel Wu", priority: "Low", status: "Waiting" },
];

export const lessonQuestions = [
  { id: "LQ-772", lesson: "Physics Lab 08", member: "Avery Kim", status: "Teacher assigned", age: "18m" },
  { id: "LQ-773", lesson: "Geometry Proofs", member: "Noah Park", status: "Needs answer", age: "42m" },
  { id: "LQ-774", lesson: "Essay Structure", member: "Mina Lee", status: "Answered", age: "2h" },
];

export const coupons = [
  { code: "SPRING26", discount: "25%", used: 421, expires: "2026-06-30", status: "Live" },
  { code: "TEAMUP", discount: "$150", used: 66, expires: "2026-07-15", status: "Live" },
  { code: "WINBACK", discount: "40%", used: 18, expires: "2026-05-31", status: "Ending" },
];

export const vouchers = [
  { code: "VCH-9082", owner: "Avery Kim", value: "1:1 coaching", status: "Issued" },
  { code: "VCH-9083", owner: "Noah Park", value: "Mock exam", status: "Redeemed" },
  { code: "VCH-9084", owner: "Mina Lee", value: "Team workshop", status: "Scheduled" },
];

export const pointsLedger = [
  { member: "Avery Kim", action: "Lesson streak bonus", points: "+250", date: "2026-05-27" },
  { member: "Mina Lee", action: "Voucher redemption", points: "-1,500", date: "2026-05-25" },
  { member: "Noah Park", action: "First quiz perfect score", points: "+500", date: "2026-05-24" },
];

export const popups = [
  { title: "Summer intensive launch", audience: "All visitors", impressions: "42.1k", status: "Active" },
  { title: "Team plan upgrade", audience: "Team admins", impressions: "8.4k", status: "Scheduled" },
  { title: "Maintenance notice", audience: "Logged-in users", impressions: "18.9k", status: "Draft" },
];

export const salesSeries = [
  { month: "Jan", revenue: 78, refunds: 8 },
  { month: "Feb", revenue: 94, refunds: 6 },
  { month: "Mar", revenue: 121, refunds: 9 },
  { month: "Apr", revenue: 138, refunds: 7 },
  { month: "May", revenue: 184, refunds: 5 },
];

export const alerts = [
  { icon: BellRing, title: "38 tickets need triage", detail: "5 high priority conversations are older than 2 hours." },
  { icon: ReceiptText, title: "Refund queue improved", detail: "Automated policy checks cleared 12 payment reviews." },
];
export type InquiryAnswer = {
  answeredAt: string;
  adminName: string;
  content: string;
};

export type GeneralInquiryStatus = "미답변" | "답변완료" | "보류";

export type GeneralInquiry = {
  inquiryId: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  memberStatus: string;
  status: GeneralInquiryStatus;
  assignee: string;
  createdAt: string;
  answeredAt: string;
  title: string;
  content: string;
  answerHistory: InquiryAnswer[];
  internalMemo: string;
  processLogs: string[];
  attachments: string[];
};

export type LessonInquiryPublicStatus = "승인 대기" | "승인됨" | "휴지통";
export type LessonInquiryAnswerStatus = "미답변" | "답변완료" | "보류";
export type LessonInquiryWorkflowStatus = "승인 대기" | "승인됨" | "답변 완료" | "보류" | "휴지통";

export type LessonInquiry = {
  inquiryId: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  memberStatus: string;
  workflowStatus: LessonInquiryWorkflowStatus;
  publicStatus: LessonInquiryPublicStatus;
  answerStatus: LessonInquiryAnswerStatus;
  assignee: string;
  createdAt: string;
  answeredAt: string;
  language: string;
  courseStage: string;
  lessonDay: string;
  lessonTitle: string;
  courseDisplay: string;
  question: string;
  content: string;
  answerHistory: InquiryAnswer[];
  internalMemo: string;
  processLogs: string[];
  attachments: string[];
  deletedAt?: string;
  deletedBy?: string;
};

export const generalInquiries: GeneralInquiry[] = [
  {
    inquiryId: "GINQ-20260601-001",
    userId: "SM-1024",
    userName: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    memberStatus: "정상",
    status: "미답변",
    assignee: "김운영",
    createdAt: "2026-06-01 09:18",
    answeredAt: "-",
    title: "결제 문의 - 카드 승인 문자가 두 번 왔어요",
    content: "비즈니스 회화 집중반 결제 후 카드 승인 알림이 두 번 도착했습니다. 실제로 중복 결제된 것인지 확인 부탁드립니다.",
    answerHistory: [],
    internalMemo: "주문 ORD-5028 결제 로그 확인 필요. PG 승인번호 2건 여부 체크.",
    processLogs: ["2026-06-01 09:18 문의 접수", "2026-06-01 09:25 김운영 담당자 배정"],
    attachments: ["card-alert.png"],
  },
  {
    inquiryId: "GINQ-20260531-014",
    userId: "SM-1023",
    userName: "민서 박",
    email: "minseo.park@example.com",
    phone: "010-3488-1023",
    memberStatus: "정상",
    status: "답변완료",
    assignee: "이서포트",
    createdAt: "2026-05-31 16:42",
    answeredAt: "2026-05-31 17:05",
    title: "계정 문의 - 이메일 인증 메일이 오지 않습니다",
    content: "회원가입 후 인증 메일을 여러 번 요청했지만 받은 편지함과 스팸함 모두에서 확인되지 않습니다.",
    answerHistory: [
      { answeredAt: "2026-05-31 17:05", adminName: "이서포트", content: "이메일 발송 로그를 확인했고 인증 메일을 재발송했습니다. 10분 내 수신되지 않으면 다른 이메일 주소로 변경을 도와드리겠습니다." },
    ],
    internalMemo: "메일 발송 성공. 도메인 수신 제한 가능성 안내함.",
    processLogs: ["2026-05-31 16:42 문의 접수", "2026-05-31 17:05 답변 완료 처리"],
    attachments: [],
  },
  {
    inquiryId: "GINQ-20260530-009",
    userId: "SM-1022",
    userName: "서준 이",
    email: "seojoon.lee@example.com",
    phone: "010-9082-1022",
    memberStatus: "정상",
    status: "보류",
    assignee: "박정산",
    createdAt: "2026-05-30 11:20",
    answeredAt: "-",
    title: "환불 문의 - 수강 시작 전 취소 가능 여부",
    content: "영어 리스닝 스타터를 구매했는데 아직 첫 강의를 듣지 않았습니다. 전액 환불이 가능한지 궁금합니다.",
    answerHistory: [],
    internalMemo: "환불 정책 예외 여부 확인 중. 결제일 2026-05-27.",
    processLogs: ["2026-05-30 11:20 문의 접수", "2026-05-30 11:45 정책 확인 보류"],
    attachments: [],
  },
  {
    inquiryId: "GINQ-20260529-021",
    userId: "SM-1020",
    userName: "도윤 정",
    email: "doyoon.jung@example.com",
    phone: "010-6610-1020",
    memberStatus: "정상",
    status: "답변완료",
    assignee: "김운영",
    createdAt: "2026-05-29 14:06",
    answeredAt: "2026-05-29 15:22",
    title: "포인트 문의 - 포인트 사용 내역 확인 요청",
    content: "지난 주문에서 포인트가 얼마나 사용되었는지 상세 내역을 알고 싶습니다.",
    answerHistory: [
      { answeredAt: "2026-05-29 15:22", adminName: "김운영", content: "ORD-4875 주문에서 8,000P가 사용되었습니다. 포인트 탭에서도 상세 내역을 확인하실 수 있습니다." },
    ],
    internalMemo: "포인트 사용 내역 정상.",
    processLogs: ["2026-05-29 14:06 문의 접수", "2026-05-29 15:22 답변 완료 처리"],
    attachments: [],
  },
  {
    inquiryId: "GINQ-20260528-006",
    userId: "SM-1018",
    userName: "태오 임",
    email: "taeo.lim@example.com",
    phone: "010-1209-1018",
    memberStatus: "정상",
    status: "미답변",
    assignee: "미배정",
    createdAt: "2026-05-28 10:12",
    answeredAt: "-",
    title: "배송 문의 - 교재 배송지 변경",
    content: "프랑스어 회화 교재 배송지를 회사 주소로 변경하고 싶습니다. 아직 배송 전이면 변경 부탁드립니다.",
    answerHistory: [],
    internalMemo: "배송 상태 확인 후 주소 변경 가능 여부 회신 필요.",
    processLogs: ["2026-05-28 10:12 문의 접수"],
    attachments: [],
  },
];

export const lessonInquiries: LessonInquiry[] = [
  {
    inquiryId: "LINQ-20260601-007",
    userId: "SM-1021",
    userName: "하린 최",
    email: "harin.choi@example.com",
    phone: "010-7752-1021",
    memberStatus: "휴면",
    workflowStatus: "승인 대기",
    publicStatus: "승인 대기",
    answerStatus: "미답변",
    assignee: "최튜터",
    createdAt: "2026-06-01 08:55",
    answeredAt: "-",
    language: "일본어",
    courseStage: "일본어 1단계",
    lessonDay: "日目 2",
    lessonTitle: "ありがとうございます",
    courseDisplay: "일본어 1단계 / 日目 2 - ありがとうございます",
    question: "ありがとうございます와 ありがとう의 차이가 궁금합니다.",
    content: "강의에서 정중한 표현으로 ありがとうございます를 배웠는데 친구에게 말할 때는 ありがとう만 써도 되는지, 수업 상황에서는 어떤 표현이 자연스러운지 궁금합니다.",
    answerHistory: [],
    internalMemo: "승인 후 답변 필요. 표현 비교 예시 포함 권장.",
    processLogs: ["2026-06-01 08:55 질문 등록", "2026-06-01 09:02 승인 검수 대기열 진입"],
    attachments: [],
  },
  {
    inquiryId: "LINQ-20260531-011",
    userId: "SM-1022",
    userName: "서준 이",
    email: "seojoon.lee@example.com",
    phone: "010-9082-1022",
    memberStatus: "정상",
    workflowStatus: "승인됨",
    publicStatus: "승인됨",
    answerStatus: "미답변",
    assignee: "박튜터",
    createdAt: "2026-05-31 20:12",
    answeredAt: "-",
    language: "영어",
    courseStage: "영어 미션 1단계",
    lessonDay: "Day 3",
    lessonTitle: "Nice to meet you",
    courseDisplay: "영어 미션 1단계 / Day 3 - Nice to meet you",
    question: "Nice to meet you와 Nice meeting you는 언제 다르게 쓰나요?",
    content: "처음 만났을 때와 헤어질 때 표현이 다르다고 들었습니다. 강의 예문에서는 하나만 나와서 실제 대화에서 어떻게 구분하는지 알고 싶어요.",
    answerHistory: [],
    internalMemo: "공개 승인 완료. 답변 대기.",
    processLogs: ["2026-05-31 20:12 질문 등록", "2026-05-31 20:40 박튜터 승인"],
    attachments: [],
  },
  {
    inquiryId: "LINQ-20260530-018",
    userId: "SM-1024",
    userName: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    memberStatus: "정상",
    workflowStatus: "답변 완료",
    publicStatus: "승인됨",
    answerStatus: "답변완료",
    assignee: "정튜터",
    createdAt: "2026-05-30 13:31",
    answeredAt: "2026-05-30 16:02",
    language: "스페인어",
    courseStage: "스페인어 2단계",
    lessonDay: "Día 5",
    lessonTitle: "¿Dónde está la estación?",
    courseDisplay: "스페인어 2단계 / Día 5 - ¿Dónde está la estación?",
    question: "está와 hay를 장소 설명에서 어떻게 구분하나요?",
    content: "역이 어디에 있는지 묻는 문장에서는 está를 쓰는데, 주변에 역이 있는지 말할 때는 hay를 쓰는 것 같아 헷갈립니다.",
    answerHistory: [
      { answeredAt: "2026-05-30 16:02", adminName: "정튜터", content: "특정한 대상의 위치를 말할 때는 está를, 존재 여부를 말할 때는 hay를 사용합니다. 예: La estación está cerca. / Hay una estación cerca." },
    ],
    internalMemo: "문법 카드 링크 추후 연결.",
    processLogs: ["2026-05-30 13:31 질문 등록", "2026-05-30 14:05 승인", "2026-05-30 16:02 답변 공개"],
    attachments: ["spanish-note.jpg"],
  },
  {
    inquiryId: "LINQ-20260529-004",
    userId: "SM-1018",
    userName: "태오 임",
    email: "taeo.lim@example.com",
    phone: "010-1209-1018",
    memberStatus: "정상",
    workflowStatus: "보류",
    publicStatus: "승인 대기",
    answerStatus: "보류",
    assignee: "이튜터",
    createdAt: "2026-05-29 18:04",
    answeredAt: "-",
    language: "프랑스어",
    courseStage: "프랑스어 회화",
    lessonDay: "Leçon 4",
    lessonTitle: "Je voudrais un café",
    courseDisplay: "프랑스어 회화 / Leçon 4 - Je voudrais un café",
    question: "voudrais 발음이 강의와 다르게 들립니다.",
    content: "제가 따라 하면 v 발음과 r 발음이 어색합니다. 발음 팁이나 입 모양 설명을 추가로 받을 수 있을까요?",
    answerHistory: [],
    internalMemo: "발음 파일 첨부 요청 여부 검토. 승인 전 보류.",
    processLogs: ["2026-05-29 18:04 질문 등록", "2026-05-29 18:22 보류 처리"],
    attachments: ["voice-recording.m4a"],
  },
  {
    inquiryId: "LINQ-20260527-009",
    userId: "SM-1020",
    userName: "도윤 정",
    email: "doyoon.jung@example.com",
    phone: "010-6610-1020",
    memberStatus: "정상",
    workflowStatus: "휴지통",
    publicStatus: "휴지통",
    answerStatus: "미답변",
    assignee: "김운영",
    createdAt: "2026-05-27 12:48",
    answeredAt: "-",
    language: "중국어",
    courseStage: "중국어 올인원",
    lessonDay: "8강",
    lessonTitle: "방향보어 정리",
    courseDisplay: "중국어 올인원 / 8강 - 방향보어 정리",
    question: "강의와 무관한 홍보성 문구가 포함된 질문",
    content: "외부 링크 홍보 문구가 포함되어 운영 정책에 따라 비공개 휴지통으로 이동한 질문입니다.",
    answerHistory: [],
    internalMemo: "스팸성 콘텐츠. 영구 삭제 후보.",
    processLogs: ["2026-05-27 12:48 질문 등록", "2026-05-27 13:02 김운영 휴지통 이동"],
    attachments: [],
    deletedAt: "2026-05-27 13:02",
    deletedBy: "김운영",
  },
];

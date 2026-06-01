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
  { title: "General inquiries", href: "/inquiries", icon: HelpCircle },
  { title: "Lesson questions", href: "/lesson-questions", icon: BookOpenCheck },
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

export const generalInquiries = [
  {
    id: "INQ-304",
    user: "미나 이",
    email: "mina.lee@example.com",
    title: "결제 영수증의 이름을 회사명으로 변경하고 싶습니다",
    preview: "이번 달 팀 결제분 영수증에 개인 이름이 표시되어 회계 제출이 어렵습니다. 회사명과 사업자 등록번호가 포함된 영수증으로 다시 발급 가능한지 확인 부탁드립니다.",
    body: "이번 달 팀 결제분 영수증에 개인 이름이 표시되어 회계 제출이 어렵습니다. 회사명과 사업자 등록번호가 포함된 영수증으로 다시 발급 가능한지 확인 부탁드립니다.",
    answerStatus: "처리 중",
    manager: "김운영",
    createdAt: "2026-05-31 09:24",
    answeredAt: "2026-05-31 10:12",
    answers: [
      { id: "ANS-304-1", author: "김운영", createdAt: "2026-05-31 10:12", content: "사업자 정보를 확인했습니다. 재발급 가능 여부를 결제 대행사에 확인한 뒤 안내드리겠습니다." },
    ],
  },
  {
    id: "INQ-305",
    user: "에이버리 김",
    email: "avery.kim@example.com",
    title: "녹화 강의 접근이 되지 않습니다",
    preview: "스페인어 베이직 12강 녹화본을 클릭하면 권한이 없다는 안내가 표시됩니다. 모바일과 데스크톱 모두 동일한 증상입니다.",
    body: "스페인어 베이직 12강 녹화본을 클릭하면 권한이 없다는 안내가 표시됩니다. 모바일과 데스크톱 모두 동일한 증상입니다.",
    answerStatus: "답변 대기",
    manager: "미배정",
    createdAt: "2026-05-31 11:40",
    answeredAt: "-",
    answers: [],
  },
  {
    id: "INQ-306",
    user: "다니엘 우",
    email: "daniel.wu@example.com",
    title: "팀 좌석 1개를 다음 갱신일부터 취소하고 싶습니다",
    preview: "현재 5개 좌석 중 사용하지 않는 1개 좌석을 다음 결제일부터 제외하고 싶습니다. 남은 기간 환불이 필요한지도 알려주세요.",
    body: "현재 5개 좌석 중 사용하지 않는 1개 좌석을 다음 결제일부터 제외하고 싶습니다. 남은 기간 환불이 필요한지도 알려주세요.",
    answerStatus: "답변 완료",
    manager: "박관리",
    createdAt: "2026-05-30 16:05",
    answeredAt: "2026-05-30 17:18",
    answers: [
      { id: "ANS-306-1", author: "박관리", createdAt: "2026-05-30 17:18", content: "다음 갱신일부터 4개 좌석으로 변경되도록 예약했습니다. 남은 기간은 기존 좌석을 계속 이용할 수 있습니다." },
    ],
  },
];

export const inquiries = generalInquiries.map((inquiry) => ({
  id: inquiry.id,
  subject: inquiry.title,
  requester: inquiry.user,
  priority: inquiry.answerStatus === "답변 대기" ? "High" : "Normal",
  status: inquiry.answerStatus,
}));

export const lessonQuestions = [
  {
    id: "LQ-772",
    user: "에이버리 김",
    language: "스페인어",
    lessonInfo: "스페인어 베이직 · 12강 과거시제 활용과 예외 동사 정리",
    questionPreview: "과거시제에서 불규칙 동사가 문장 중간에 올 때 강세 위치가 바뀌는지 궁금합니다. 예문 3번과 5번의 발음 차이도 함께 설명 부탁드립니다.",
    questionBody: "과거시제에서 불규칙 동사가 문장 중간에 올 때 강세 위치가 바뀌는지 궁금합니다. 예문 3번과 5번의 발음 차이도 함께 설명 부탁드립니다.",
    publicStatus: "승인됨",
    answerStatus: "답변 대기",
    lifecycleStatus: "승인됨",
    manager: "김운영",
    createdAt: "2026-05-31 08:18",
    deletedAt: "-",
    deletedBy: "-",
    answers: [
      { id: "LQA-772-1", author: "김운영", createdAt: "2026-05-31 09:00", content: "질문을 확인했습니다. 담당 선생님에게 전달했고 답변을 준비 중입니다." },
    ],
  },
  {
    id: "LQ-773",
    user: "노아 박",
    language: "영어",
    lessonInfo: "영어 리스닝 스타터 · 04강 connected speech 집중 연습",
    questionPreview: "shadowing 연습에서 would you와 could you가 너무 빠르게 이어질 때 구분하는 팁이 있을까요? 반복 청취해도 놓치는 구간이 있습니다.",
    questionBody: "shadowing 연습에서 would you와 could you가 너무 빠르게 이어질 때 구분하는 팁이 있을까요? 반복 청취해도 놓치는 구간이 있습니다.",
    publicStatus: "승인 대기",
    answerStatus: "작성 불가",
    lifecycleStatus: "승인 대기",
    manager: "미배정",
    createdAt: "2026-05-31 12:42",
    deletedAt: "-",
    deletedBy: "-",
    answers: [],
  },
  {
    id: "LQ-774",
    user: "미나 이",
    language: "중국어",
    lessonInfo: "HSK 실전반 · 08강 독해 지문 핵심어 찾기",
    questionPreview: "긴 지문에서 접속사 뒤 문장이 정답 근거가 되는 경우와 함정인 경우를 어떻게 구분하면 좋을지 예시와 함께 알고 싶습니다.",
    questionBody: "긴 지문에서 접속사 뒤 문장이 정답 근거가 되는 경우와 함정인 경우를 어떻게 구분하면 좋을지 예시와 함께 알고 싶습니다.",
    publicStatus: "승인됨",
    answerStatus: "답변 완료",
    lifecycleStatus: "답변 완료",
    manager: "박관리",
    createdAt: "2026-05-30 15:10",
    deletedAt: "-",
    deletedBy: "-",
    answers: [
      { id: "LQA-774-1", author: "박관리", createdAt: "2026-05-30 16:25", content: "접속사 자체보다 앞뒤 문장의 주장 전환 여부를 먼저 확인하세요. 특히 그러나/따라서 뒤의 문장은 출제 포인트가 되는 경우가 많습니다." },
    ],
  },
  {
    id: "LQ-775",
    user: "준호 임",
    language: "프랑스어",
    lessonInfo: "프랑스어 회화 · 03강 카페 주문 표현과 정중한 요청",
    questionPreview: "질문이 중복 등록되어 휴지통으로 이동된 항목입니다. 복구하면 일반 학습 문의 목록에서 다시 확인할 수 있습니다.",
    questionBody: "질문이 중복 등록되어 휴지통으로 이동된 항목입니다. 복구하면 일반 학습 문의 목록에서 다시 확인할 수 있습니다.",
    publicStatus: "보류",
    answerStatus: "작성 불가",
    lifecycleStatus: "휴지통",
    manager: "최운영",
    createdAt: "2026-05-29 13:22",
    deletedAt: "2026-05-31 14:05",
    deletedBy: "최운영",
    answers: [],
  },
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

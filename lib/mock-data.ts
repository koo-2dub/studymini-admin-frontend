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

export const inquiries = [
  {
    id: "INQ-304",
    subject: "Invoice name change request after company reimbursement review",
    requester: "지윤 김",
    priority: "Normal",
    category: "Billing",
    status: "Open",
    createdAt: "2026-05-29 10:12",
    content: "회사 비용 처리 때문에 결제 영수증의 수신자명을 변경하고 싶습니다. 기존 영수증은 개인명으로 발급되어 있어 회계팀에서 반려되었습니다. 주문번호 ORD-4924의 영수증을 회사명으로 다시 발급할 수 있는지 확인 부탁드립니다. 필요한 사업자 정보는 답변을 주시면 바로 전달하겠습니다.",
    user: { id: "SM-1024", name: "지윤 김", email: "jiyoon.kim@example.com", phone: "010-4821-1024", customerType: "구매회원" },
    answerHistory: [
      { admin: "Admin Yuna", answeredAt: "2026-05-29 11:05", message: "영수증 재발급 가능 여부를 결제 기록과 함께 확인 중입니다." },
    ],
  },
  {
    id: "INQ-305",
    subject: "Cannot access recorded lesson on mobile browser",
    requester: "Avery Kim",
    priority: "High",
    category: "Technical",
    status: "In progress",
    createdAt: "2026-05-28 16:40",
    content: "모바일 브라우저에서 녹화 강의 재생 버튼이 회색으로 비활성화됩니다. 데스크톱에서는 정상 재생되지만 출퇴근 시간에 모바일로 수강해야 해서 빠른 확인이 필요합니다. 캐시 삭제와 재로그인은 이미 시도했습니다.",
    user: { id: "SM-1022", name: "Avery Kim", email: "avery.kim@example.com", phone: "010-9912-1022", customerType: "구매회원" },
    answerHistory: [
      { admin: "Admin Joon", answeredAt: "2026-05-28 17:20", message: "모바일 재생 권한과 기기 정보를 확인했습니다. 플레이어 로그를 추가로 점검하겠습니다." },
    ],
  },
  {
    id: "INQ-306",
    subject: "Cancel team seat before next renewal date",
    requester: "Daniel Wu",
    priority: "Low",
    category: "Account",
    status: "Waiting",
    createdAt: "2026-05-27 09:18",
    content: "팀 플랜에서 사용하지 않는 좌석 1개를 다음 갱신 전에 제거하고 싶습니다. 현재 좌석별 학습 이력은 유지되어야 하며, 다음 청구서부터 변경된 좌석 수가 반영되면 됩니다.",
    user: { id: "SM-1021", name: "Daniel Wu", email: "daniel.wu@example.com", phone: "010-7810-1021", customerType: "구매회원" },
    answerHistory: [
      { admin: "Admin Mina", answeredAt: "2026-05-27 10:02", message: "팀 관리자 권한 확인을 요청드렸습니다. 확인 후 좌석 조정 절차를 안내하겠습니다." },
    ],
  },
];

export const lessonQuestions = [
  {
    id: "LQ-772",
    member: "지윤 김",
    status: "Teacher assigned",
    createdAt: "2026-05-29 14:26",
    question: "스페인어 베이직 12강에서 직접목적격 대명사를 동사 앞에 두는 경우와 동사 뒤에 붙이는 경우가 모두 나오는데, 두 문장이 모두 가능한 상황의 뉘앙스 차이가 궁금합니다. 예문 3번의 lo quiero comprar와 quiero comprarlo가 시험 답안에서 같은 점수로 인정되는지도 알려주세요.",
    user: { id: "SM-1024", name: "지윤 김", email: "jiyoon.kim@example.com", phone: "010-4821-1024" },
    lesson: { id: "LES-SP-012", title: "스페인어 베이직 12강 · 직접목적격 대명사 활용", course: "스페인어 베이직", teacher: "Teacher Elena", href: "/lesson-questions/LQ-772#lesson" },
    answerHistory: [
      { admin: "Teacher Elena", answeredAt: "2026-05-29 15:10", message: "두 형태 모두 문법적으로 가능합니다. 조동사 구조에서는 대명사를 앞에 두거나 부정사 뒤에 붙일 수 있으며 의미 차이는 거의 없습니다." },
    ],
  },
  {
    id: "LQ-773",
    member: "민서 박",
    status: "Needs answer",
    createdAt: "2026-05-28 18:44",
    question: "영어 리스닝 스타터 04강 dictation 문제에서 will have been과 would have been의 발음이 너무 비슷하게 들립니다. 실제 대화 속에서 둘을 구분할 때 강세나 앞뒤 문맥 중 무엇을 우선으로 봐야 하나요?",
    user: { id: "SM-1023", name: "민서 박", email: "minseo.park@example.com", phone: "010-3488-1023" },
    lesson: { id: "LES-EN-004", title: "영어 리스닝 스타터 04강 · 조동사 완료형 듣기", course: "영어 리스닝 스타터", teacher: "Teacher Olivia", href: "/lesson-questions/LQ-773#lesson" },
    answerHistory: [],
  },
  {
    id: "LQ-774",
    member: "Avery Kim",
    status: "Answered",
    createdAt: "2026-05-27 11:08",
    question: "Essay Structure 강의의 thesis statement 예시에서 although로 시작하는 양보절을 먼저 쓰는 방식이 소개됐습니다. 실제 IELTS writing task 2에서도 이런 구조를 첫 문장에 사용해도 자연스러운지, 아니면 두 번째 문장에 배치하는 편이 안전한지 궁금합니다.",
    user: { id: "SM-1022", name: "Avery Kim", email: "avery.kim@example.com", phone: "010-9912-1022" },
    lesson: { id: "LES-WR-009", title: "Essay Structure · Thesis statement and concession", course: "Academic Writing", teacher: "Teacher Grace", href: "/lesson-questions/LQ-774#lesson" },
    answerHistory: [
      { admin: "Teacher Grace", answeredAt: "2026-05-27 13:30", message: "IELTS에서도 사용할 수 있습니다. 다만 첫 문장이 길어질 경우 핵심 입장이 흐려질 수 있으므로 두 번째 문장에 배치하는 방식을 추천합니다." },
    ],
  },
];

export const deletedLessonQuestions = [
  {
    id: "LQ-761",
    member: "서준 이",
    question: "HSK 실전반 08강 독해 지문 2번에서 접속사 위치를 잘못 이해한 것 같습니다. 해설 기준으로 다시 확인 부탁드립니다.",
    deletedAt: "2026-05-26 09:42",
    deletedBy: "Admin Joon",
  },
  {
    id: "LQ-758",
    member: "하린 최",
    question: "프랑스어 회화 03강 발음 질문을 중복으로 올렸습니다. 이전 문의에 답변이 달려 이 항목은 휴지통으로 이동했습니다.",
    deletedAt: "2026-05-24 17:15",
    deletedBy: "Admin Mina",
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

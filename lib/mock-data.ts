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

export const orders = [
  { id: "ORD-4821", member: "Avery Kim", product: "Pro Annual", amount: "$940", status: "Paid", date: "2026-05-26" },
  { id: "ORD-4817", member: "Mina Lee", product: "Team seats x 8", amount: "$2,880", status: "Paid", date: "2026-05-24" },
  { id: "ORD-4812", member: "Noah Park", product: "Starter Monthly", amount: "$29", status: "Refund review", date: "2026-05-23" },
  { id: "ORD-4803", member: "Ethan Choi", product: "Pro Monthly", amount: "$79", status: "Failed", date: "2026-05-21" },
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
export type AdminOrder = {
  id: string;
  createdAt: string;
  paidAt: string;
  completedAt: string;
  orderStatus: "주문완료" | "배송준비" | "배송중" | "배송완료" | "환불요청" | "환불완료";
  paymentStatus: "결제완료" | "결제대기" | "결제실패" | "부분환불" | "환불완료";
  shippingStatus: "배송없음" | "배송대기" | "배송중" | "배송완료";
  memberId: string;
  memberName: string;
  email: string;
  phone: string;
  address: string;
  productName: string;
  productId: string;
  sku: string;
  quantity: number;
  productAmount: number;
  refundAmount: number;
  paymentMethod: string;
  installmentMonths: number;
  interestFree: boolean;
  couponCode: string;
  couponAmount: number;
  usedPoints: number;
  shippingFee: number;
  finalAmount: number;
  earnedPoints: number;
  isNewMember: boolean;
  deliveryMemo: string;
  invoiceCompany: string;
  invoiceNumber: string;
  adminMemo: string;
  processLogs: string[];
};

export const adminOrders: AdminOrder[] = [
  {
    id: "ORD-4924",
    createdAt: "2026-05-29",
    paidAt: "2026-05-29",
    completedAt: "2026-05-29",
    orderStatus: "배송준비",
    paymentStatus: "결제완료",
    shippingStatus: "배송대기",
    memberId: "SM-1024",
    memberName: "지윤 김",
    email: "jiyoon.kim@example.com",
    phone: "010-4821-1024",
    address: "서울시 마포구 월드컵북로 12, 802호",
    productName: "비즈니스 회화 집중반",
    productId: "P-BIZ-2026",
    sku: "BIZ-SPK-12W",
    quantity: 1,
    productAmount: 249000,
    refundAmount: 0,
    paymentMethod: "신용카드",
    installmentMonths: 3,
    interestFree: true,
    couponCode: "WELCOME10",
    couponAmount: 20000,
    usedPoints: 0,
    shippingFee: 0,
    finalAmount: 229000,
    earnedPoints: 2290,
    isNewMember: false,
    deliveryMemo: "교재 발송 전 문자 안내",
    invoiceCompany: "CJ대한통운",
    invoiceNumber: "",
    adminMemo: "VIP 전환 후보. 영수증 요청 가능성 높음.",
    processLogs: ["2026-05-29 09:12 주문 생성", "2026-05-29 09:13 결제 승인", "2026-05-29 10:20 배송 준비 상태 변경"],
  },
  {
    id: "ORD-4917",
    createdAt: "2026-05-21",
    paidAt: "2026-05-21",
    completedAt: "2026-05-22",
    orderStatus: "주문완료",
    paymentStatus: "결제완료",
    shippingStatus: "배송없음",
    memberId: "SM-1022",
    memberName: "서준 이",
    email: "seojoon.lee@example.com",
    phone: "010-9082-1022",
    address: "디지털 콘텐츠 - 배송 없음",
    productName: "영어 리스닝 스타터",
    productId: "P-ENG-LISTEN",
    sku: "ENG-LSN-START",
    quantity: 1,
    productAmount: 119000,
    refundAmount: 0,
    paymentMethod: "카카오페이",
    installmentMonths: 0,
    interestFree: false,
    couponCode: "",
    couponAmount: 0,
    usedPoints: 20000,
    shippingFee: 0,
    finalAmount: 99000,
    earnedPoints: 990,
    isNewMember: true,
    deliveryMemo: "",
    invoiceCompany: "",
    invoiceNumber: "",
    adminMemo: "첫 결제 회원. 온보딩 메시지 발송 완료.",
    processLogs: ["2026-05-21 14:01 주문 생성", "2026-05-21 14:02 결제 승인", "2026-05-22 09:00 수강권 지급"],
  },
  {
    id: "ORD-4908",
    createdAt: "2026-05-18",
    paidAt: "2026-05-18",
    completedAt: "",
    orderStatus: "환불요청",
    paymentStatus: "부분환불",
    shippingStatus: "배송완료",
    memberId: "SM-1018",
    memberName: "준호 임",
    email: "junho.lim@example.com",
    phone: "010-1209-1018",
    address: "부산시 해운대구 센텀동로 45, 1103호",
    productName: "프랑스어 회화 + 교재",
    productId: "P-FR-CONV",
    sku: "FR-CONV-BOOK",
    quantity: 1,
    productAmount: 259000,
    refundAmount: 30000,
    paymentMethod: "신용카드",
    installmentMonths: 6,
    interestFree: true,
    couponCode: "SPRING26",
    couponAmount: 25000,
    usedPoints: 5000,
    shippingFee: 3000,
    finalAmount: 232000,
    earnedPoints: 2020,
    isNewMember: false,
    deliveryMemo: "부재 시 경비실 보관",
    invoiceCompany: "우체국택배",
    invoiceNumber: "6868123490012",
    adminMemo: "교재 일부 파손 클레임. 부분 환불 검토 중.",
    processLogs: ["2026-05-18 11:31 주문 생성", "2026-05-18 11:33 결제 승인", "2026-05-19 16:10 송장 등록", "2026-05-27 15:42 환불 요청 접수"],
  },
  {
    id: "ORD-4899",
    createdAt: "2026-05-17",
    paidAt: "",
    completedAt: "",
    orderStatus: "주문완료",
    paymentStatus: "결제대기",
    shippingStatus: "배송대기",
    memberId: "SM-1023",
    memberName: "민서 박",
    email: "minseo.park@example.com",
    phone: "010-3488-1023",
    address: "인천시 연수구 컨벤시아대로 77",
    productName: "스페인어 베이직 교재",
    productId: "P-SP-BASIC-BOOK",
    sku: "SP-BASIC-TEXT",
    quantity: 2,
    productAmount: 52000,
    refundAmount: 0,
    paymentMethod: "무통장입금",
    installmentMonths: 0,
    interestFree: false,
    couponCode: "",
    couponAmount: 0,
    usedPoints: 0,
    shippingFee: 3000,
    finalAmount: 55000,
    earnedPoints: 0,
    isNewMember: true,
    deliveryMemo: "입금 확인 후 출고",
    invoiceCompany: "",
    invoiceNumber: "",
    adminMemo: "입금 대기 알림 발송 필요.",
    processLogs: ["2026-05-17 19:23 주문 생성", "2026-05-18 09:00 입금 대기 알림 발송"],
  },
  {
    id: "ORD-4875",
    createdAt: "2026-04-28",
    paidAt: "2026-04-28",
    completedAt: "2026-04-29",
    orderStatus: "배송완료",
    paymentStatus: "결제완료",
    shippingStatus: "배송완료",
    memberId: "SM-1020",
    memberName: "도윤 정",
    email: "doyoon.jung@example.com",
    phone: "010-6610-1020",
    address: "대전시 유성구 대학로 99",
    productName: "HSK 실전반",
    productId: "P-HSK-REAL",
    sku: "CN-HSK-REAL",
    quantity: 1,
    productAmount: 229000,
    refundAmount: 0,
    paymentMethod: "네이버페이",
    installmentMonths: 0,
    interestFree: false,
    couponCode: "TEAMUP",
    couponAmount: 30000,
    usedPoints: 0,
    shippingFee: 0,
    finalAmount: 199000,
    earnedPoints: 1990,
    isNewMember: false,
    deliveryMemo: "",
    invoiceCompany: "",
    invoiceNumber: "",
    adminMemo: "고액 결제 회원. 환불 정책 안내 완료.",
    processLogs: ["2026-04-28 08:20 주문 생성", "2026-04-28 08:20 간편결제 승인", "2026-04-29 10:00 수강권 지급"],
  },
  {
    id: "ORD-4863",
    createdAt: "2026-04-19",
    paidAt: "2026-04-19",
    completedAt: "2026-04-20",
    orderStatus: "환불완료",
    paymentStatus: "환불완료",
    shippingStatus: "배송없음",
    memberId: "SM-1021",
    memberName: "하린 최",
    email: "harin.choi@example.com",
    phone: "010-7752-1021",
    address: "디지털 콘텐츠 - 배송 없음",
    productName: "일본어 문법 완성",
    productId: "P-JP-GRAMMAR",
    sku: "JP-GRM-FULL",
    quantity: 1,
    productAmount: 179000,
    refundAmount: 179000,
    paymentMethod: "신용카드",
    installmentMonths: 0,
    interestFree: false,
    couponCode: "WINBACK40",
    couponAmount: 0,
    usedPoints: 0,
    shippingFee: 0,
    finalAmount: 179000,
    earnedPoints: 0,
    isNewMember: false,
    deliveryMemo: "",
    invoiceCompany: "",
    invoiceNumber: "",
    adminMemo: "환불 완료 후 휴면 복귀 캠페인 제외.",
    processLogs: ["2026-04-19 12:22 주문 생성", "2026-04-19 12:23 결제 승인", "2026-04-21 17:15 환불 승인", "2026-04-22 10:30 환불 완료"],
  },
];

export const orderUploadPreview = [
  { row: 1, userId: "SM-1024", name: "지윤 김", email: "jiyoon.kim@example.com", productId: "P-BIZ-2026", quantity: 1, price: 229000, result: "정상" },
  { row: 2, userId: "SM-1099", name: "테스트 유저", email: "test@example.com", productId: "P-UNKNOWN", quantity: 1, price: 99000, result: "상품아이디 확인 필요" },
];

export const invoiceUploadPreview = [
  { row: 1, orderId: "ORD-4924", productName: "비즈니스 회화 집중반", carrier: "CJ대한통운", invoiceNo: "555512340001", orderStatus: "배송중", result: "정상" },
  { row: 2, orderId: "ORD-4899", productName: "스페인어 베이직 교재", carrier: "", invoiceNo: "", orderStatus: "배송대기", result: "배송회사/송장번호 누락" },
];

export const pdfDownloadLogs = [
  { orderId: "ORD-4924", paidAt: "2026-05-29", name: "지윤 김", memberId: "SM-1024", className: "비즈니스 회화 집중반", fileName: "business-speaking-week01.pdf", firstDownloadedAt: "2026-05-29 10:02", lastDownloadedAt: "2026-05-29 13:18", downloadCount: 3 },
  { orderId: "ORD-4917", paidAt: "2026-05-21", name: "서준 이", memberId: "SM-1022", className: "영어 리스닝 스타터", fileName: "listening-starter-unit04.pdf", firstDownloadedAt: "2026-05-22 09:30", lastDownloadedAt: "2026-05-27 21:04", downloadCount: 8 },
  { orderId: "ORD-4875", paidAt: "2026-04-28", name: "도윤 정", memberId: "SM-1020", className: "HSK 실전반", fileName: "hsk-real-mock-test-02.pdf", firstDownloadedAt: "2026-04-29 11:10", lastDownloadedAt: "2026-05-29 07:55", downloadCount: 12 },
];

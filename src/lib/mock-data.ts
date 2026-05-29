import {
  BarChart3,
  BookOpen,
  CircleDollarSign,
  Headphones,
  Home,
  Megaphone,
  ShieldCheck,
  ShoppingCart,
  TicketPercent,
  Users,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Members", href: "/members", icon: Users },
  { title: "Orders / Payments", href: "/orders", icon: ShoppingCart },
  { title: "CS Management", href: "/cs/general-inquiries", icon: Headphones },
  { title: "LMS Management", href: "/lms/courses", icon: BookOpen },
  { title: "Coupons / Vouchers / Points", href: "/rewards/coupons", icon: TicketPercent },
  { title: "Marketing / CRM", href: "/marketing/popups", icon: Megaphone },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Admin Roles / Permissions", href: "/admin-roles", icon: ShieldCheck },
];

export const dashboardStats = [
  { label: "오늘 매출", value: 12840000, change: "+18.2%", format: "currency" as const },
  { label: "오늘 주문", value: 86, change: "+9건", format: "number" as const },
  { label: "미답변 일반문의", value: 14, change: "SLA 2시간", format: "number" as const },
  { label: "미답변 학습질문", value: 21, change: "담당자 배정 필요", format: "number" as const },
  { label: "배송 대기", value: 37, change: "오후 출고", format: "number" as const },
  { label: "환불 요청", value: 6, change: "재무 확인", format: "number" as const },
];

export const members = [
  { id: "U-10421", name: "김민서", email: "minseo@example.com", phone: "010-3321-8844", wpId: "wp_9012", status: "active", joined: "2026-05-28", totalPaid: 968000, course: "스페인어 베이직" },
  { id: "U-10420", name: "박준호", email: "junho@example.com", phone: "010-2288-1204", wpId: "wp_8831", status: "dormant", joined: "2026-05-27", totalPaid: 420000, course: "프랑스어 올인원" },
  { id: "U-10419", name: "이서연", email: "seoyeon@example.com", phone: "010-4911-7772", wpId: "wp_8810", status: "active", joined: "2026-05-26", totalPaid: 1280000, course: "독일어 패키지" },
  { id: "U-10388", name: "최하늘", email: "haneul@example.com", phone: "010-8801-2203", wpId: "wp_8722", status: "withdrawn", joined: "2026-05-11", totalPaid: 0, course: "일본어 입문" },
];

export const orders = [
  { id: "O-20260529-086", user: "김민서", product: "스페인어 베이직 + 교재", amount: 348000, payment: "paid", fulfillment: "shipping_pending", created: "2026-05-29 10:22" },
  { id: "O-20260529-085", user: "이서연", product: "독일어 패키지", amount: 590000, payment: "paid", fulfillment: "completed", created: "2026-05-29 09:51" },
  { id: "O-20260529-084", user: "박준호", product: "프랑스어 올인원", amount: 420000, payment: "refund_requested", fulfillment: "hold", created: "2026-05-29 09:17" },
  { id: "O-20260528-211", user: "정다은", product: "영어 회화 집중반", amount: 250000, payment: "pending", fulfillment: "waiting", created: "2026-05-28 18:33" },
];

export const generalInquiries = [
  { id: "GI-9821", user: "김민서", email: "minseo@example.com", title: "쿠폰 적용이 안 됩니다", preview: "결제 페이지에서 신규회원 쿠폰이 보이지 않습니다.", created: "2026-05-29 09:44", status: "open", assignee: "한CS", answeredAt: "-", slack: "수신 완료" },
  { id: "GI-9820", user: "박준호", email: "junho@example.com", title: "환불 일정 문의", preview: "환불 요청 후 처리 예정일을 알고 싶습니다.", created: "2026-05-29 08:12", status: "pending", assignee: "이재무", answeredAt: "-", slack: "수신 완료" },
  { id: "GI-9818", user: "최하늘", email: "haneul@example.com", title: "계정 탈퇴 요청", preview: "개인정보 삭제 범위가 궁금합니다.", created: "2026-05-28 16:01", status: "answered", assignee: "한CS", answeredAt: "2026-05-28 17:04", slack: "수신 완료" },
];

export const lessonQuestions = [
  { id: "LQ-4420", language: "스페인어", course: "스페인어 베이직", lesson: "15강 ser/estar", user: "김민서", preview: "ser와 estar 사용 차이를 예문으로 더 알고 싶어요.", created: "2026-05-29 10:01", status: "open", assignee: "윤튜터" },
  { id: "LQ-4419", language: "독일어", course: "독일어 패키지", lesson: "8강 관사", user: "이서연", preview: "정관사 격변화 표 암기 팁이 있을까요?", created: "2026-05-29 08:50", status: "pending", assignee: "김콘텐츠" },
  { id: "LQ-4412", language: "프랑스어", course: "프랑스어 올인원", lesson: "3강 발음", user: "박준호", preview: "r 발음 피드백 부탁드립니다.", created: "2026-05-28 14:11", status: "answered", assignee: "윤튜터" },
];

export const courses = [
  { id: "C-SP-101", language: "스페인어", title: "스페인어 베이직", lessons: 48, groups: 5, status: "active", updated: "2026-05-27" },
  { id: "C-DE-201", language: "독일어", title: "독일어 패키지", lessons: 72, groups: 8, status: "active", updated: "2026-05-24" },
  { id: "C-FR-301", language: "프랑스어", title: "프랑스어 올인원", lessons: 64, groups: 7, status: "draft", updated: "2026-05-20" },
];

export const popups = [
  { id: "P-120", title: "여름 얼리버드 프로모션", page: "메인", period: "2026-06-01 ~ 2026-06-14", device: "PC/Mobile", status: "active", impressions: 48220, clicks: 1938, ctr: "4.02%" },
  { id: "P-119", title: "교재 배송 안내", page: "결제완료", period: "2026-05-20 ~ 2026-05-31", device: "Mobile", status: "paused", impressions: 12400, clicks: 312, ctr: "2.52%" },
  { id: "P-118", title: "신규 회원 쿠폰", page: "회원가입", period: "2026-05-01 ~ 2026-06-30", device: "PC", status: "active", impressions: 22010, clicks: 1402, ctr: "6.37%" },
];

export const coupons = [
  { id: "CP-778", name: "신규회원 10%", code: "WELCOME10", type: "정률", value: "10%", issued: 4200, used: 932, status: "active" },
  { id: "CP-777", name: "교재 무료배송", code: "BOOKSHIP", type: "배송", value: "무료", issued: 1200, used: 344, status: "active" },
  { id: "CP-760", name: "휴면복귀 3만원", code: "RETURN30K", type: "정액", value: "30,000원", issued: 800, used: 108, status: "ended" },
];

export const chartData = [
  { name: "월", revenue: 920, orders: 62, popups: 3.1 },
  { name: "화", revenue: 1120, orders: 74, popups: 3.8 },
  { name: "수", revenue: 980, orders: 69, popups: 4.4 },
  { name: "목", revenue: 1430, orders: 91, popups: 5.2 },
  { name: "금", revenue: 1284, orders: 86, popups: 4.8 },
];

export const roles = ["Super admin", "General admin", "Finance admin", "CS admin", "Content admin", "Marketing admin", "Learning Q&A admin"];
export const permissions = ["회원 조회", "주문/환불", "문의 답변", "LMS 편집", "쿠폰/포인트", "팝업/CRM", "분석 조회", "권한 관리"];

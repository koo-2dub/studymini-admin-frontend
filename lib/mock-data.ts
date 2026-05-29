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
  { title: "유저 관리", href: "/members", icon: UsersRound },
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

export type Member = {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  plan: string;
  status: MemberStatus;
  joined: string;
  recentLogin: string;
  marketingConsent: boolean;
  spend: string;
  orderCount: number;
  points: number;
  lessons: number;
  segment: string;
};

export const members: Member[] = [
  {
    id: "SM-1012",
    name: "서윤 김",
    nickname: "서윤쌤",
    email: "seoyun.kim@example.com",
    phone: "010-4821-7743",
    plan: "Pro Annual",
    status: "정상",
    joined: "2026-05-18",
    recentLogin: "2026-05-28 18:20",
    marketingConsent: true,
    spend: "₩1,280,000",
    orderCount: 12,
    points: 4850,
    lessons: 74,
    segment: "Power learner",
  },
  {
    id: "SM-1011",
    name: "민준 박",
    nickname: "민준",
    email: "minjun.park@example.com",
    phone: "010-2938-1174",
    plan: "Starter",
    status: "정상",
    joined: "2026-04-07",
    recentLogin: "2026-05-26 09:15",
    marketingConsent: false,
    spend: "₩89,000",
    orderCount: 2,
    points: 720,
    lessons: 14,
    segment: "New cohort",
  },
  {
    id: "SM-1010",
    name: "하린 이",
    nickname: "하린",
    email: "harin.lee@example.com",
    phone: "010-8891-3402",
    plan: "Team",
    status: "휴면",
    joined: "2026-02-21",
    recentLogin: "2026-02-24 21:45",
    marketingConsent: true,
    spend: "₩3,940,000",
    orderCount: 18,
    points: 8930,
    lessons: 128,
    segment: "Team admin",
  },
  {
    id: "SM-1009",
    name: "도윤 최",
    nickname: "도윤",
    email: "doyun.choi@example.com",
    phone: "010-7354-0029",
    plan: "Pro Monthly",
    status: "탈퇴",
    joined: "2025-12-18",
    recentLogin: "2026-01-03 13:05",
    marketingConsent: false,
    spend: "₩540,000",
    orderCount: 5,
    points: 0,
    lessons: 45,
    segment: "At risk",
  },
];

export const memberTimeline = [
  "Completed Advanced Algebra checkpoint",
  "Redeemed 1,000 points for coaching voucher",
  "Submitted lesson question for Physics Lab 08",
  "Purchased Pro Annual renewal",
];

export const orders = [
  { id: "ORD-4821", member: "서윤 김", product: "Pro Annual", amount: "₩940,000", status: "Paid", date: "2026-05-26" },
  { id: "ORD-4817", member: "하린 이", product: "Team seats x 8", amount: "₩2,880,000", status: "Paid", date: "2026-05-24" },
  { id: "ORD-4812", member: "민준 박", product: "Starter Monthly", amount: "₩29,000", status: "Refund review", date: "2026-05-23" },
  { id: "ORD-4803", member: "도윤 최", product: "Pro Monthly", amount: "₩79,000", status: "Failed", date: "2026-05-21" },
];

export const inquiries = [
  { id: "INQ-304", subject: "Invoice name change", requester: "하린 이", priority: "Normal", status: "Open" },
  { id: "INQ-305", subject: "Cannot access recorded lesson", requester: "서윤 김", priority: "High", status: "In progress" },
  { id: "INQ-306", subject: "Cancel team seat", requester: "Daniel Wu", priority: "Low", status: "Waiting" },
];

export const lessonQuestions = [
  { id: "LQ-772", lesson: "Physics Lab 08", member: "서윤 김", status: "Teacher assigned", age: "18m" },
  { id: "LQ-773", lesson: "Geometry Proofs", member: "민준 박", status: "Needs answer", age: "42m" },
  { id: "LQ-774", lesson: "Essay Structure", member: "하린 이", status: "Answered", age: "2h" },
];

export const coupons = [
  { code: "SPRING26", discount: "25%", used: 421, expires: "2026-06-30", status: "Live" },
  { code: "TEAMUP", discount: "₩150,000", used: 66, expires: "2026-07-15", status: "Live" },
  { code: "WINBACK", discount: "40%", used: 18, expires: "2026-05-31", status: "Ending" },
];

export const vouchers = [
  { code: "VCH-9082", owner: "서윤 김", value: "1:1 coaching", status: "Issued" },
  { code: "VCH-9083", owner: "민준 박", value: "Mock exam", status: "Redeemed" },
  { code: "VCH-9084", owner: "하린 이", value: "Team workshop", status: "Scheduled" },
];

export const pointsLedger = [
  { member: "서윤 김", action: "Lesson streak bonus", points: "+250", date: "2026-05-27" },
  { member: "하린 이", action: "Voucher redemption", points: "-1,500", date: "2026-05-25" },
  { member: "민준 박", action: "First quiz perfect score", points: "+500", date: "2026-05-24" },
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

import { notFound } from "next/navigation";
import { BookOpenCheck, CalendarDays, HelpCircle, Mail, Phone, ReceiptText, ShieldCheck } from "lucide-react";

import { CustomerBadge, MemberStatusBadge } from "@/components/dashboard/member-badges";
import { MemberTabs } from "@/components/dashboard/member-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { members } from "@/lib/mock-data";

export function generateStaticParams() {
  return members.map((member) => ({ id: member.id }));
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id);
  if (!member) notFound();

  const recentOrderDate = getRecentOrderDate(member);
  const recentInquiryDate = getRecentInquiryDate(member);
  const recentLearningDate = getRecentLearningDate(member);

  return (
    <>
      <PageHeader eyebrow="유저 관리" title="유저 관리" description={`${member.name}님의 기본 정보, 주문, 수강, 문의, 메모를 확인하고 처리합니다.`} />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="누적 결제금액" value={formatCurrency(member.totalPayment)} change={`${member.orderCount.toLocaleString()}건 주문`} tone="indigo" />
        <StatCard label="보유 포인트" value={`${member.points.toLocaleString()}P`} change="상세 탭에서 포인트 확인" tone="emerald" />
        <StatCard label="수강상태" value={member.learningStatus} change={`${member.lessons.toLocaleString()}개 레슨 완료`} tone="amber" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-black text-white">
                {member.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-black">{member.name}</h3>
                <p className="font-mono text-sm font-bold text-indigo-700">{member.id}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <MemberStatusBadge value={member.status} />
              <CustomerBadge value={member.customerType} />
              <Badge variant={member.marketingConsent ? "success" : "slate"}>마케팅 {member.marketingConsent ? "동의" : "미동의"}</Badge>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2 whitespace-nowrap"><Mail className="h-4 w-4 shrink-0" />{member.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" />{member.phone}</p>
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 shrink-0" />가입일 {member.joined} · 최근 로그인 {member.lastLogin}</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 shrink-0" />상태 변경과 운영 처리는 상세 탭에서 진행합니다.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <ProfileSignal icon={ReceiptText} label="최근 주문일" value={recentOrderDate} />
              <ProfileSignal icon={ReceiptText} label="누적 주문 수" value={`${member.orderCount.toLocaleString()}건`} />
              <ProfileSignal icon={HelpCircle} label="최근 문의일" value={recentInquiryDate} />
              <ProfileSignal icon={BookOpenCheck} label="최근 학습일" value={recentLearningDate} />
            </div>
          </CardContent>
        </Card>
        <MemberTabs member={member} />
      </section>
    </>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}


function ProfileSignal({ icon: Icon, label, value }: { icon: typeof ReceiptText; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-400"><Icon className="h-3.5 w-3.5" />{label}</p>
      <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
    </div>
  );
}

function getRecentOrderDate(member: (typeof members)[number]) {
  return member.orders[0]?.date ?? "주문 없음";
}

function getRecentInquiryDate(member: (typeof members)[number]) {
  if (member.inquiries.length > 0) return "2026-06-02";
  if (member.lessonQuestions.length > 0) return "2026-05-30";
  return "문의 없음";
}

function getRecentLearningDate(member: (typeof members)[number]) {
  if (member.lessons === 0) return "학습 없음";
  return member.lastLogin;
}

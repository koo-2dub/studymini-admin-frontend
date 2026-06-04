import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, Mail, MessageSquareText, Phone, ShieldCheck } from "lucide-react";

import { CustomerBadge, MemberStatusBadge } from "@/components/dashboard/member-badges";
import { MemberTabs } from "@/components/dashboard/member-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { memberAdminMemoHighlights, memberRecentActivities, members } from "@/lib/mock-data";

export function generateStaticParams() {
  return members.map((member) => ({ id: member.id }));
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id);
  if (!member) notFound();

  const recentActivities = memberRecentActivities[member.id] ?? buildFallbackActivities(member);
  const memoHighlights = memberAdminMemoHighlights[member.id] ?? buildFallbackMemos(member.adminMemos);

  return (
    <>
      <PageHeader eyebrow="유저 관리" title="유저 관리" description={`${member.name}님의 기본 정보, 주문, 수강, 문의, 메모를 확인하고 처리합니다.`} />

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-black text-white">
                  {member.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-2xl font-black text-slate-950">{member.name}</h3>
                  <p className="mt-1 font-mono text-sm font-bold text-indigo-700">{member.id}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <MemberStatusBadge value={member.status} />
                <CustomerBadge value={member.customerType} />
                <Badge variant={member.marketingConsent ? "success" : "slate"}>마케팅 {member.marketingConsent ? "동의" : "미동의"}</Badge>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <ProfileInfo icon={<ShieldCheck className="h-4 w-4" />} label="이름" value={member.name} />
              <ProfileInfo icon={<ShieldCheck className="h-4 w-4" />} label="User ID" value={member.id} mono />
              <ProfileInfo icon={<Mail className="h-4 w-4" />} label="이메일" value={member.email} />
              <ProfileInfo icon={<Phone className="h-4 w-4" />} label="전화번호" value={member.phone} />
              <ProfileInfo icon={<CalendarDays className="h-4 w-4" />} label="가입일" value={member.joined} />
              <ProfileInfo icon={<Clock3 className="h-4 w-4" />} label="최근 로그인" value={member.lastLogin} />
              <ProfileInfo icon={<ShieldCheck className="h-4 w-4" />} label="회원상태" value={member.status} />
              <ProfileInfo icon={<ShieldCheck className="h-4 w-4" />} label="구매회원 여부" value={member.customerType === "구매회원" ? "구매회원" : "미구매회원"} />
              <ProfileInfo icon={<MessageSquareText className="h-4 w-4" />} label="마케팅 수신 여부" value={member.marketingConsent ? "동의" : "미동의"} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50">
          <CardHeader>
            <CardTitle className="text-base">최근 관리자 메모</CardTitle>
            <CardDescription>상단에서 바로 확인하는 최근 3건</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {memoHighlights.slice(0, 3).map((memo) => (
              <div key={`${memo.date}-${memo.content}`} className="rounded-2xl bg-white/85 p-4 shadow-sm">
                <p className="whitespace-nowrap text-xs font-black text-indigo-600">{memo.date}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-700">{memo.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="my-6 grid gap-4 md:grid-cols-3">
        <StatCard label="누적 결제금액" value={formatCurrency(member.totalPayment)} change={`${member.orderCount.toLocaleString()}건 주문`} tone="indigo" />
        <StatCard label="보유 포인트" value={`${member.points.toLocaleString()}P`} change="포인트 탭에서 상세 내역 확인" tone="emerald" />
        <StatCard label="수강상태" value={member.learningStatus} change={`${member.lessons.toLocaleString()}개 레슨 완료`} tone="amber" />
      </section>

      <section className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 활동</CardTitle>
            <CardDescription>최근 주문, 로그인, 포인트, 문의를 한 번에 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {recentActivities.map((activity) => (
              <div key={activity.label} className="rounded-3xl border bg-white p-5 shadow-sm">
                <p className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-muted-foreground">{activity.label}</p>
                <p className="mt-2 truncate font-black text-slate-900">{activity.value}</p>
                <p className="mt-1 truncate text-xs font-bold text-muted-foreground">{activity.helper}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <MemberTabs member={member} />
    </>
  );
}

type DetailMember = (typeof members)[number];

function ProfileInfo({ icon, label, value, mono = false }: { icon: ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-2xl border bg-slate-50/70 p-4">
      <p className="flex items-center gap-2 whitespace-nowrap text-xs font-black uppercase tracking-wider text-muted-foreground">{icon}{label}</p>
      <p className={mono ? "mt-2 truncate font-mono text-sm font-black text-indigo-700" : "mt-2 truncate text-sm font-black text-slate-800"}>{value}</p>
    </div>
  );
}

function buildFallbackActivities(member: DetailMember) {
  const latestOrder = member.orders[0];
  const latestInquiry = member.inquiries[0] ?? member.lessonQuestions[0] ?? "문의 없음";

  return [
    { label: "최근 주문", value: latestOrder ? latestOrder.product : "주문 없음", helper: latestOrder ? `${latestOrder.date} · ${formatCurrency(latestOrder.amount)}` : "구매 전환 대상" },
    { label: "최근 로그인", value: member.lastLogin, helper: member.status === "휴면" ? "휴면 회원" : "정상 활동" },
    { label: "최근 포인트 적립", value: `${member.points.toLocaleString()}P`, helper: "현재 보유 포인트" },
    { label: "최근 문의", value: latestInquiry, helper: latestInquiry === "문의 없음" ? "문의 이력 없음" : "최근 문의 이력" },
  ];
}

function buildFallbackMemos(adminMemos: string[]) {
  const fallbackDates = ["2026-06-01", "2026-05-20", "2026-05-01"];
  const memos = adminMemos.length ? adminMemos : ["관리자 메모가 없습니다."];

  return memos.slice(0, 3).map((content, index) => ({
    date: fallbackDates[index] ?? fallbackDates[fallbackDates.length - 1],
    content,
  }));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(value);
}

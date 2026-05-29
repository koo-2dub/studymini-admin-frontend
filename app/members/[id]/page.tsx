import { notFound } from "next/navigation";
import { CalendarDays, Mail, Phone, ShieldCheck } from "lucide-react";

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
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-black text-white">{member.name.charAt(0)}</div>
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

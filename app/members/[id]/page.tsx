import { notFound } from "next/navigation";
import { CalendarDays, Mail, Phone, ShieldCheck, Trophy } from "lucide-react";

import { MemberTabs } from "@/components/dashboard/member-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { memberTimeline, members } from "@/lib/mock-data";

export function generateStaticParams() {
  return members.map((member) => ({ id: member.id }));
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id);
  if (!member) notFound();

  return (
    <>
      <PageHeader eyebrow="유저 상세" title="유저 상세" description={`${member.name}(${member.id}) 유저의 계정, 결제, 학습, 문의 정보를 확인합니다.`} />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="누적 결제액" value={member.spend} change={member.plan} tone="indigo" />
        <StatCard label="보유 포인트" value={member.points.toLocaleString()} change="사용 가능 잔액" tone="emerald" />
        <StatCard label="완료 레슨" value={String(member.lessons)} change={member.segment} tone="amber" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-black text-white">{member.name.charAt(0)}</div>
              <div>
                <h3 className="text-xl font-black">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.id}</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <Badge variant={member.status === "정상" ? "success" : member.status === "탈퇴" ? "rose" : "slate"}>{member.status}</Badge>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4" />{member.email}</p>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Phone className="h-4 w-4" />{member.phone}</p>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Trophy className="h-4 w-4" />가입일자 {member.joined}</p>
              <p className="flex items-center gap-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4" />최근 로그인 {member.lastLogin}</p>
              <p className="flex items-center gap-2 text-sm text-slate-600"><ShieldCheck className="h-4 w-4" />마케팅 수신동의 {member.marketingConsent ? "동의" : "미동의"}</p>
            </div>
          </CardContent>
        </Card>
        <MemberTabs member={member} timeline={memberTimeline} />
      </section>
    </>
  );
}

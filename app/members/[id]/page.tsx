import { CalendarClock, Mail, Phone, ShieldCheck } from "lucide-react";
import { notFound } from "next/navigation";

import { MemberTabs } from "@/components/dashboard/member-tabs";
import { PageHeader } from "@/components/dashboard/page-header";
import { MarketingBadge, StatusBadge } from "@/components/dashboard/data-table";
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
      <PageHeader
        eyebrow="유저 상세"
        title={member.nickname}
        description={`${member.email} 계정의 기본 정보, 주문, 수강, 포인트, 쿠폰, 문의, 관리자 메모를 탭으로 확인합니다.`}
      />
      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-sky-400 text-2xl font-black text-white">{member.nickname.charAt(0)}</div>
              <div>
                <h3 className="text-xl font-black">{member.nickname}</h3>
                <p className="text-sm font-semibold text-muted-foreground">{member.id}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <StatusBadge value={member.status} />
              <MarketingBadge agreed={member.marketingConsent} />
              <Badge>{member.plan}</Badge>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" />{member.email}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" />{member.phone}</p>
              <p className="flex items-center gap-2"><CalendarClock className="h-4 w-4" />가입일 {member.joined}</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" />최근 로그인 {member.recentLogin}</p>
            </div>
          </CardContent>
        </Card>
        <MemberTabs member={member} timeline={memberTimeline} />
      </section>
    </>
  );
}

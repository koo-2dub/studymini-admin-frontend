import { notFound } from "next/navigation";
import { Mail, Trophy } from "lucide-react";

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
      <PageHeader eyebrow="Member detail" title={member.name} description={`A complete mock admin profile for ${member.email}, including account, commerce, learning, and support tabs.`} />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Lifetime spend" value={member.spend} change={member.plan} tone="indigo" />
        <StatCard label="Reward points" value={member.points.toLocaleString()} change="Available balance" tone="emerald" />
        <StatCard label="Lessons completed" value={String(member.lessons)} change={member.segment} tone="amber" />
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
              <Badge variant="success">{member.status}</Badge>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Mail className="h-4 w-4" />{member.email}</p>
              <p className="flex items-center gap-2 text-sm text-slate-600"><Trophy className="h-4 w-4" />Joined {member.joined}</p>
            </div>
          </CardContent>
        </Card>
        <MemberTabs member={member} timeline={memberTimeline} />
      </section>
    </>
  );
}

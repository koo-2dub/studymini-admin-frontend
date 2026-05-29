import { notFound } from "next/navigation";

import { MemberTabs } from "@/components/dashboard/member-tabs";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
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
      <section className="mb-6 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-panel backdrop-blur-xl">
        <p className="text-sm font-bold text-slate-500">유저 상세</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-950">{member.name}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">User ID: {member.id}</p>
          </div>
          <Badge variant={member.status === "Active" ? "success" : member.status === "Paused" ? "warning" : "slate"}>{member.status}</Badge>
        </div>
      </section>

      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="누적 주문수" value={`${member.orderCount}건`} change="전체 기간" tone="indigo" />
        <StatCard label="누적 결제금액" value={member.spend} change="전체 기간" tone="emerald" />
        <StatCard label="보유 포인트" value={member.points.toLocaleString()} change="사용 가능" tone="amber" />
        <StatCard label="진행중 강의 수" value={`${member.activeCourses}개`} change="현재 수강" tone="rose" />
      </section>

      <MemberTabs member={member} />
    </>
  );
}

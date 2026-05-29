import { AppShell } from "@/components/admin/app-shell";
import { DetailTabs, QuickLinks } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { members } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((item) => item.id === id) ?? members[0];
  return <AppShell><PageHeader title={`${member.name} 회원 상세`} description="프로필부터 주문, 수강, 포인트, 쿠폰, 문의 이력을 탭으로 확인합니다." primaryAction="관리 메모 저장" secondaryAction="회원 상태 변경" /><DetailTabs tabs={["Profile", "Orders", "Courses", "Groups", "Points", "Coupons", "General inquiries", "Lesson questions"]} /><Card><CardHeader><CardTitle>프로필 요약</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-4"><Info label="User ID" value={member.id} /><Info label="이메일" value={member.email} /><Info label="휴대폰" value={member.phone} /><Info label="누적 결제" value={formatCurrency(member.totalPaid)} /></CardContent></Card><div className="mt-6"><QuickLinks links={[{ href: "/orders", label: "주문 이력 보기" }, { href: "/cs/general-inquiries", label: "일반 문의 보기" }, { href: "/cs/lesson-questions", label: "학습 질문 보기" }]} /></div></AppShell>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-bold">{value}</p></div>; }

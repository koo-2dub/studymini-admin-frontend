import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessTrialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="체험단 관리"
        description="체험단 캠페인과 참여 회원의 수강 권한을 관리합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>체험단 관리</CardTitle>
          <CardDescription>체험단 캠페인과 참여 회원의 수강 권한을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-slate-500">기능 구현 전 placeholder 화면입니다.</p>
        </CardContent>
      </Card>
    </>
  );
}

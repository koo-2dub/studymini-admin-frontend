import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessHistoryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="권한 이력/만료 관리"
        description="회원별 수강 권한 이력과 만료 예정 권한을 조회합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>권한 이력/만료 관리</CardTitle>
          <CardDescription>회원별 수강 권한 이력과 만료 예정 권한을 조회합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-slate-500">기능 구현 전 placeholder 화면입니다.</p>
        </CardContent>
      </Card>
    </>
  );
}

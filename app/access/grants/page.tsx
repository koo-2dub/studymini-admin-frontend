import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessGrantsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="수강권 지급 관리"
        description="특정 회원에게 코스 또는 패키지 수강권을 직접 지급합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>수강권 지급 관리</CardTitle>
          <CardDescription>특정 회원에게 코스 또는 패키지 수강권을 직접 지급합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-slate-500">기능 구현 전 placeholder 화면입니다.</p>
        </CardContent>
      </Card>
    </>
  );
}

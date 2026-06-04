import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccessCodesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Access management"
        title="수강코드 관리"
        description="B2B 수강코드 생성, 배포, 사용 현황을 관리합니다."
      />
      <Card>
        <CardHeader>
          <CardTitle>수강코드 관리</CardTitle>
          <CardDescription>B2B 수강코드 생성, 배포, 사용 현황을 관리합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-slate-500">기능 구현 전 placeholder 화면입니다.</p>
        </CardContent>
      </Card>
    </>
  );
}

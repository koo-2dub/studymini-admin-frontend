import { CheckCircle2, Loader2, MessageSquareWarning, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WorkflowStates() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin text-orange-600" />로딩 상태</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <div className="h-3 w-2/3 rounded-full bg-slate-200" />
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-3 w-1/2 rounded-full bg-slate-100" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><PackageOpen className="h-4 w-4 text-orange-600" />Empty state</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">조건에 맞는 결과가 없을 때 필터 초기화와 새 항목 생성 버튼을 표시합니다.</CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquareWarning className="h-4 w-4 text-orange-600" />확인/토스트</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>중요 액션은 확인 다이얼로그를 거친 뒤 토스트 메시지로 결과를 안내합니다.</p>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 font-semibold text-emerald-700"><CheckCircle2 className="mr-1 inline h-4 w-4" />저장되었습니다.</div>
          <Button variant="outline" size="sm">확인 다이얼로그 열기</Button>
        </CardContent>
      </Card>
    </div>
  );
}

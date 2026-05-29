import Link from "next/link";
import { Calendar, Download, Eye, FileUp, Pencil, Plus, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function ActionBar({ actions }: { actions: string[] }) {
  return <div className="flex flex-wrap gap-2">{actions.map((action) => <Button key={action} variant={action.includes("삭제") ? "destructive" : "outline"} size="sm">{action}</Button>)}</div>;
}

export function DetailTabs({ tabs }: { tabs: string[] }) {
  return <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border bg-white p-2">{tabs.map((tab, i) => <Button key={tab} variant={i === 0 ? "default" : "ghost"} size="sm">{tab}</Button>)}</div>;
}

export function EditorPanel({ title = "답변 작성", memo = true }: { title?: string; memo?: boolean }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>현재는 목업 UI이며 저장 시 토스트/확인 다이얼로그 연결 예정입니다.</CardDescription></CardHeader><CardContent className="space-y-3"><textarea className="min-h-44 w-full rounded-2xl border p-4 text-sm outline-none focus:ring-2 focus:ring-orange-500" placeholder="관리자 답변을 입력하세요." /><ActionBar actions={["임시저장", "답변 발송", "미리보기"]} /></CardContent></Card>
      {memo ? <Card><CardHeader><CardTitle>내부 메모</CardTitle></CardHeader><CardContent><textarea className="min-h-44 w-full rounded-2xl border p-4 text-sm" placeholder="고객에게 노출되지 않는 메모" /></CardContent></Card> : null}
    </div>
  );
}

export function FormMockup({ fields, title }: { title: string; fields: string[] }) {
  return <Card><CardHeader><CardTitle>{title}</CardTitle><CardDescription>필수 운영 필드를 빠르게 입력하도록 구성한 목업 폼입니다.</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2">{fields.map((field) => <label key={field} className="space-y-2 text-sm font-semibold"><span>{field}</span><Input placeholder={`${field} 입력`} /></label>)}<div className="md:col-span-2"><ActionBar actions={["저장", "미리보기", "취소"]} /></div></CardContent></Card>;
}

export function UploadExportPanel() {
  return <Card><CardHeader><CardTitle>대량 처리 도구</CardTitle></CardHeader><CardContent className="grid gap-3 md:grid-cols-4"><Button variant="outline"><Download className="h-4 w-4" />주문 내보내기</Button><Button variant="outline"><FileUp className="h-4 w-4" />주문 업로드</Button><Button variant="outline"><FileUp className="h-4 w-4" />인보이스 업로드</Button><Button variant="outline"><Calendar className="h-4 w-4" />예약 작업</Button></CardContent></Card>;
}

export function PopupPreview() {
  return <Card className="overflow-hidden"><CardHeader><CardTitle>팝업 미리보기</CardTitle></CardHeader><CardContent><div className="mx-auto max-w-sm overflow-hidden rounded-3xl border bg-white shadow-soft"><div className="bg-gradient-to-br from-orange-400 to-orange-600 p-8 text-white"><p className="text-sm font-bold">Studymini Event</p><h3 className="mt-8 text-3xl font-black">여름 얼리버드 프로모션</h3><p className="mt-3 text-sm opacity-90">지금 등록하면 교재 배송 혜택과 포인트를 함께 드려요.</p></div><div className="space-y-2 p-4"><Button className="w-full">자세히 보기</Button><Button variant="ghost" className="w-full">오늘 하루 보지 않기</Button></div></div></CardContent></Card>;
}

export function QuickLinks({ links }: { links: { href: string; label: string }[] }) {
  return <div className="grid gap-3 md:grid-cols-3">{links.map((link) => <Link key={link.href} href={link.href} className="flex items-center justify-between rounded-2xl border bg-white p-4 font-bold shadow-sm transition hover:border-orange-300 hover:bg-orange-50"><span>{link.label}</span><Eye className="h-4 w-4 text-orange-600" /></Link>)}</div>;
}

export function GeneratorBox() {
  return <Card><CardHeader><CardTitle className="flex items-center gap-2"><Wand2 className="h-5 w-5 text-orange-600" />랜덤 쿠폰 코드 생성기</CardTitle></CardHeader><CardContent className="flex flex-col gap-3 md:flex-row"><Input defaultValue="SM-2026-X7K9" /><Button><Plus className="h-4 w-4" />코드 생성</Button><Button variant="outline"><Pencil className="h-4 w-4" />규칙 편집</Button></CardContent></Card>;
}

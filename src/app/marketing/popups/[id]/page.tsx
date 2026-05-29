import { AppShell } from "@/components/admin/app-shell";
import { FormMockup, PopupPreview } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
export default async function PopupEditPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell><PageHeader title={`${id} 팝업 편집`} description="CTA 버튼 + 오늘 하루 보지 않기 + 닫기 옵션을 포함한 팝업 편집 화면입니다." primaryAction="활성화" /><div className="grid gap-6 xl:grid-cols-[1fr_380px]"><FormMockup title="팝업 설정" fields={["제목", "노출 페이지", "노출 기간", "PC/Mobile", "이미지 업로드", "링크 URL", "Bitly URL", "버튼 옵션", "상태"]} /><PopupPreview /></div></AppShell>; }

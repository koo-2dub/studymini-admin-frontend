import { AppShell } from "@/components/admin/app-shell";
import { FormMockup, PopupPreview } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
export default function PopupCreatePage() { return <AppShell><PageHeader title="팝업 생성/수정" description="제목, 노출 페이지, 기간, 디바이스, 이미지, 링크, Bitly, 버튼 옵션, 상태를 설정합니다." /><div className="grid gap-6 xl:grid-cols-[1fr_380px]"><FormMockup title="팝업 필드" fields={["title", "display page dropdown", "display period", "PC/Mobile", "image upload UI", "link URL", "Bitly URL", "button option", "status"]} /><PopupPreview /></div></AppShell>; }

import { AppShell } from "@/components/admin/app-shell";
import { DetailTabs, FormMockup } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
export default async function LmsDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <AppShell><PageHeader title={`${id} LMS 상세`} description="코스/레슨/그룹 상세 정보와 연결된 학습 질문을 확인합니다." primaryAction="변경사항 저장" /><DetailTabs tabs={["기본 정보", "커리큘럼", "그룹", "학습 질문", "PDF 로그", "변경 이력"]} /><FormMockup title="LMS 상세 편집" fields={["언어", "제목", "설명", "공개 상태", "담당자", "연결 그룹"]} /></AppShell>; }

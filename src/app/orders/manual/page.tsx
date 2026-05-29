import { AppShell } from "@/components/admin/app-shell";
import { FormMockup } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
export default function ManualOrderPage() { return <AppShell><PageHeader title="수동 주문 생성" description="관리자가 수동 주문과 결제 링크를 생성하는 화면입니다." /><FormMockup title="수동 주문 정보" fields={["회원 검색", "상품", "할인/쿠폰", "결제금액", "결제 만료일", "관리 메모"]} /></AppShell>; }

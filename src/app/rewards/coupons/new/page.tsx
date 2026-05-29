import { AppShell } from "@/components/admin/app-shell";
import { FormMockup, GeneratorBox } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
export default function CouponFormPage() { return <AppShell><PageHeader title="쿠폰 생성/수정" description="랜덤 코드 생성과 쿠폰 혜택/기간/대상 설정을 제공합니다." /><div className="mb-6"><GeneratorBox /></div><FormMockup title="쿠폰 설정" fields={["쿠폰명", "코드", "혜택 유형", "혜택 값", "사용 기간", "대상 세그먼트", "발급 수량", "상태"]} /></AppShell>; }

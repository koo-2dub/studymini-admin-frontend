import { Badge } from "@/components/ui/badge";

const labelMap: Record<string, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
  active: { label: "활성", tone: "success" },
  dormant: { label: "휴면", tone: "warning" },
  withdrawn: { label: "탈퇴", tone: "danger" },
  paid: { label: "결제완료", tone: "success" },
  pending: { label: "대기", tone: "warning" },
  refund_requested: { label: "환불요청", tone: "danger" },
  open: { label: "미답변", tone: "danger" },
  answered: { label: "답변완료", tone: "success" },
  draft: { label: "초안", tone: "default" },
  paused: { label: "일시중지", tone: "warning" },
  ended: { label: "종료", tone: "default" },
  shipping_pending: { label: "배송대기", tone: "orange" },
  completed: { label: "완료", tone: "success" },
  hold: { label: "보류", tone: "warning" },
  waiting: { label: "대기", tone: "default" },
};

export function StatusBadge({ value }: { value: string }) {
  const status = labelMap[value] ?? { label: value, tone: "info" as const };
  return <Badge tone={status.tone}>{status.label}</Badge>;
}

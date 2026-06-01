import { Badge } from "@/components/ui/badge";
import type { GeneralInquiryStatus, LessonInquiryAnswerStatus, LessonInquiryPublicStatus, LessonInquiryWorkflowStatus } from "@/lib/mock-data";

export function AnswerStatusBadge({ value }: { value: GeneralInquiryStatus | LessonInquiryAnswerStatus }) {
  const variant = value === "답변완료" ? "success" : value === "보류" ? "slate" : "warning";
  return <Badge variant={variant}>{value}</Badge>;
}

export function PublicStatusBadge({ value }: { value: LessonInquiryPublicStatus }) {
  const variant = value === "승인됨" ? "success" : value === "휴지통" ? "slate" : "warning";
  return <Badge variant={variant}>{value}</Badge>;
}

export function WorkflowStatusBadge({ value }: { value: GeneralInquiryStatus | LessonInquiryWorkflowStatus }) {
  const variant = value === "답변완료" || value === "답변 완료" || value === "승인됨" ? "success" : value === "미답변" || value === "승인 대기" ? "warning" : "slate";
  return <Badge variant={variant}>{value}</Badge>;
}

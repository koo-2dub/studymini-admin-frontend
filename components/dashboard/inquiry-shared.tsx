"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { adminAssignees, type AdminAssignee, type InquiryAnswerStatus, type LessonVisibilityStatus } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const assigneeOptions = adminAssignees;

export function getNowLogTime() {
  return "2026-06-01 10:30";
}

export function answerStatusVariant(status: InquiryAnswerStatus) {
  if (status === "답변완료") return "success";
  if (status === "보류") return "warning";
  return "rose";
}

export function visibilityVariant(status: LessonVisibilityStatus) {
  if (status === "승인됨") return "success";
  if (status === "휴지통") return "slate";
  return "warning";
}

export function StatusPill({ value, type = "answer" }: { value: InquiryAnswerStatus | LessonVisibilityStatus; type?: "answer" | "visibility" }) {
  return <Badge variant={type === "answer" ? answerStatusVariant(value as InquiryAnswerStatus) : visibilityVariant(value as LessonVisibilityStatus)}>{value}</Badge>;
}

export function AssigneePill({ value }: { value: AdminAssignee }) {
  return <Badge variant={value === "미배정" ? "slate" : "default"}>{value}</Badge>;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15", props.className)} />;
}

export function FilterCard({ title, description, children, actions }: { title: string; description: string; children: ReactNode; actions: ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
        <div className="mt-5 flex flex-wrap gap-2">{actions}</div>
      </CardContent>
    </Card>
  );
}

export function BulkAssignModal({
  open,
  selectedCount,
  assignee,
  onAssigneeChange,
  onClose,
  onSave,
}: {
  open: boolean;
  selectedCount: number;
  assignee: AdminAssignee;
  onAssigneeChange: (value: AdminAssignee) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader>
          <CardTitle>담당자 일괄 배정</CardTitle>
          <CardDescription>선택한 {selectedCount}개 문의의 담당자를 한 번에 변경합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="space-y-2 text-sm font-bold text-slate-700">
            담당자
            <SelectInput value={assignee} onChange={(event) => onAssigneeChange(event.target.value as AdminAssignee)}>
              {assigneeOptions.map((option) => <option key={option}>{option}</option>)}
            </SelectInput>
          </label>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="button" onClick={onSave}>저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-panel">{message}</div>;
}

export function DetailShell({ onBack, title, description, children }: { onBack: () => void; title: string; description: string; children: ReactNode }) {
  return (
    <div className="space-y-5">
      <Button type="button" variant="outline" onClick={onBack}>목록으로</Button>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">{children}</CardContent>
      </Card>
    </div>
  );
}

export function UserDetailLink({ userId, userName }: { userId: string; userName: string }) {
  return (
    <Link
      href={`/members/${userId}`}
      onClick={(event) => event.stopPropagation()}
      className="font-bold text-primary underline-offset-4 hover:underline"
    >
      {userName}
    </Link>
  );
}

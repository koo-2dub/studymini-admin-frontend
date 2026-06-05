"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { currentAdminName, type Inquiry } from "../data";

type InquiryLog = Inquiry["logs"][number];

export function AnswerPanel({ inquiry }: { inquiry: Inquiry }) {
  const [answer, setAnswer] = useState(inquiry.answer);
  const [savedAnswer, setSavedAnswer] = useState(inquiry.answer);
  const [status, setStatus] = useState(inquiry.status);
  const [assignee, setAssignee] = useState(inquiry.assignee);
  const [answeredAt, setAnsweredAt] = useState(inquiry.answeredAt);
  const [logs, setLogs] = useState<InquiryLog[]>(inquiry.logs);

  const saveAnswer = () => {
    if (!answer.trim()) return;
    setSavedAnswer(answer.trim());
    setStatus("답변완료");
    setAssignee(currentAdminName);
    setAnsweredAt("2026-06-01");
    setLogs((previous) => [
      { action: "답변 저장", actor: currentAdminName, at: "2026-06-01", note: "일반 문의 답변을 저장했습니다. (mock)" },
      ...previous,
    ]);
  };

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>답변 작성</CardTitle>
          <CardDescription>일반 문의는 1회 답변 구조이며, 답변 저장 시 상태가 답변완료로 변경됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-bold text-slate-600">
            답변
            <textarea
              className="mt-2 min-h-56 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
            />
          </label>
          <div className="flex justify-end">
            <Button type="button" onClick={saveAnswer} disabled={!answer.trim()}>
              답변 저장
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>답변 상태</CardTitle>
          <CardDescription>저장된 답변과 담당자 정보를 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span className="font-bold text-slate-600">답변상태</span>
              <Badge variant={status === "답변완료" ? "success" : "warning"}>{status}</Badge>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span className="font-bold text-slate-600">담당자</span>
              <span className="font-semibold text-slate-900">{assignee}</span>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 p-4">
              <span className="font-bold text-slate-600">답변일</span>
              <span className="font-semibold text-slate-900">{answeredAt}</span>
            </div>
          </div>
          {savedAnswer ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-800">
              <div className="mb-2 flex items-center gap-2 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                저장된 답변
              </div>
              <p className="whitespace-pre-wrap leading-6">{savedAnswer}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 font-semibold text-amber-800">
              아직 저장된 답변이 없습니다.
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>처리 로그</CardTitle>
          <CardDescription>일반 문의 접수와 답변 처리 이력을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div key={`${log.action}-${log.at}-${index}`} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-xs font-semibold text-slate-500">{log.at}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">{log.actor}</p>
                <p className="mt-2 text-sm text-slate-700">{log.note}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

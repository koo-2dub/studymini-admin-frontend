"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { StatusBadge } from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  currentAdminName,
  generalInquiries,
  inquiryStorageKey,
  type GeneralInquiry,
  type InquiryProcessLog,
} from "@/lib/inquiry-state";

function getNowLabel() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function upsertStoredInquiry(nextInquiry: GeneralInquiry) {
  const stored = window.localStorage.getItem(inquiryStorageKey);
  let items = generalInquiries;

  if (stored) {
    try {
      const parsed = JSON.parse(stored) as GeneralInquiry[];
      items = generalInquiries.map((inquiry) => parsed.find((item) => item.id === inquiry.id) ?? inquiry);
    } catch {
      items = generalInquiries;
    }
  }

  window.localStorage.setItem(
    inquiryStorageKey,
    JSON.stringify(items.map((inquiry) => (inquiry.id === nextInquiry.id ? nextInquiry : inquiry))),
  );
}

function DetailItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50/80 p-4">
      <dt className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-sm font-semibold text-slate-900">{value}</dd>
    </div>
  );
}

export function InquiryDetailClient({ inquiry }: { inquiry: GeneralInquiry }) {
  const [currentInquiry, setCurrentInquiry] = useState(inquiry);
  const [answer, setAnswer] = useState(inquiry.answer);
  const [adminMemo, setAdminMemo] = useState(inquiry.adminMemo);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = window.localStorage.getItem(inquiryStorageKey);
    if (!stored) return;

    try {
      const storedInquiry = (JSON.parse(stored) as GeneralInquiry[]).find((item) => item.id === inquiry.id);
      if (storedInquiry) {
        setCurrentInquiry(storedInquiry);
        setAnswer(storedInquiry.answer);
        setAdminMemo(storedInquiry.adminMemo);
      }
    } catch {
      setCurrentInquiry(inquiry);
    }
  }, [inquiry]);

  const latestLog = useMemo(() => currentInquiry.logs.at(-1), [currentInquiry.logs]);

  const persistInquiry = (nextInquiry: GeneralInquiry, message: string) => {
    setCurrentInquiry(nextInquiry);
    upsertStoredInquiry(nextInquiry);
    setNotice(message);
  };

  const appendLog = (label: string): InquiryProcessLog[] => [
    ...currentInquiry.logs,
    { label, actor: currentAdminName, date: getNowLabel() },
  ];

  const handleSaveAnswer = () => {
    const nextInquiry: GeneralInquiry = {
      ...currentInquiry,
      answer,
      status: "답변완료",
      manager: currentAdminName,
      logs: appendLog("답변 저장"),
    };

    persistInquiry(nextInquiry, "답변을 저장하고 상태를 답변완료로 변경했습니다.");
  };

  const handleHold = () => {
    const nextInquiry: GeneralInquiry = {
      ...currentInquiry,
      status: "보류",
      manager: currentAdminName,
      logs: appendLog("보류 처리"),
    };

    persistInquiry(nextInquiry, "보류 처리했습니다.");
  };

  const handleSaveMemo = () => {
    const nextInquiry: GeneralInquiry = {
      ...currentInquiry,
      adminMemo,
    };

    persistInquiry(nextInquiry, "관리자 메모만 저장했습니다. 답변 상태는 변경하지 않았습니다.");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/inquiries">목록으로</Link>
        </Button>
        {notice && <p className="text-sm font-semibold text-primary">{notice}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>문의 정보</CardTitle>
          <CardDescription>담당자는 답변 저장 또는 보류 처리 후 현재 관리자명으로 배정됩니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-3 md:grid-cols-3">
            <DetailItem label="문의번호" value={currentInquiry.id} />
            <DetailItem label="상태" value={<StatusBadge value={currentInquiry.status} />} />
            <DetailItem label="담당자" value={currentInquiry.manager || "-"} />
            <DetailItem label="문의자" value={currentInquiry.requester} />
            <DetailItem label="이메일" value={currentInquiry.email} />
            <DetailItem label="접수일" value={currentInquiry.createdAt} />
            <DetailItem label="카테고리" value={currentInquiry.category} />
            <DetailItem label="우선순위" value={currentInquiry.priority} />
            <DetailItem label="최근 처리" value={latestLog ? `${latestLog.label} · ${latestLog.actor}` : "-"} />
          </dl>
          <div className="mt-5 rounded-2xl border border-slate-100 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">문의 내용</p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">{currentInquiry.message}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{currentInquiry.answer ? "답변 수정" : "답변 작성"}</CardTitle>
          <CardDescription>일반 문의 답변은 1개만 저장되며, 저장하면 자동으로 답변완료 상태가 됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700" htmlFor="answer">
            답변
          </label>
          <textarea
            id="answer"
            className="min-h-40 w-full rounded-2xl border border-input bg-white/80 p-4 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="회원에게 전달할 답변을 입력하세요."
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
          />
          <div className="flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-600">
              현재 관리자명 <span className="font-bold text-slate-900">{currentAdminName}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={handleSaveAnswer}>
                답변 저장
              </Button>
              <Button type="button" variant="outline" onClick={handleHold}>
                보류 처리
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>관리자 메모</CardTitle>
          <CardDescription>메모 저장은 답변 상태와 담당자를 변경하지 않습니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <textarea
            className="min-h-28 w-full rounded-2xl border border-input bg-white/80 p-4 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            value={adminMemo}
            onChange={(event) => setAdminMemo(event.target.value)}
          />
          <Button type="button" variant="secondary" onClick={handleSaveMemo}>
            메모 저장
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>처리 로그</CardTitle>
          <CardDescription>답변 저장과 보류 처리만 답변 처리 로그로 기록합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          {currentInquiry.logs.length ? (
            <ol className="space-y-3">
              {currentInquiry.logs.map((log, index) => (
                <li key={`${log.label}-${log.date}-${index}`} className="rounded-2xl border border-slate-100 bg-white p-4 text-sm">
                  <p className="font-semibold text-slate-900">{log.label}</p>
                  <p className="mt-1 text-muted-foreground">
                    {log.actor} · {log.date}
                  </p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="rounded-2xl bg-slate-50/80 p-4 text-sm text-muted-foreground">아직 처리 로그가 없습니다.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

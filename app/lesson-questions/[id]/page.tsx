"use client";

import { ArrowLeft, ExternalLink, Save, Trash2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { UserInfoCard } from "@/app/_components/user-info-card";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { members } from "@/lib/mock-data";

import { lessonQuestions } from "../data";

const currentAdminName = "관리자 한나";

const badgeVariant = (value: string): BadgeProps["variant"] => {
  if (value === "승인됨" || value === "답변완료") return "success";
  if (value === "승인 대기" || value === "미답변") return "warning";
  if (value === "휴지통") return "rose";
  return "slate";
};

function InfoItem({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2 font-bold text-slate-900">{value}</div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function LessonQuestionDetailPage() {
  const params = useParams<{ id: string }>();
  const question = lessonQuestions.find((item) => item.id === params.id);
  const [toast, setToast] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState(question?.visibilityStatus ?? "승인 대기");
  const [answerStatus, setAnswerStatus] = useState(question?.answerStatus ?? "미답변");
  const [answerBody, setAnswerBody] = useState(question?.answerBody ?? "");
  const [answeredBy, setAnsweredBy] = useState(question?.answeredBy ?? "-");
  const [answeredAt, setAnsweredAt] = useState(question?.answeredAt ?? "-");
  const [logs, setLogs] = useState(question?.logs ?? []);

  const canWriteAnswer = visibilityStatus === "승인됨";
  const isTrashed = visibilityStatus === "휴지통";
  const nowLabel = "2026-06-01 11:30";

  const actionGuide = useMemo(() => {
    if (visibilityStatus === "승인 대기") {
      return "승인 전 질문은 사용자에게 공개되지 않습니다.\n승인 후 답변 작성이 가능합니다.";
    }
    if (visibilityStatus === "휴지통") {
      return "휴지통 상태에서는 답변을 작성할 수 없습니다. 복구 후 다시 처리해 주세요.";
    }
    return answerStatus === "답변완료" ? "저장된 답변을 수정할 수 있습니다." : "승인된 질문입니다. 답변을 작성하고 저장할 수 있습니다.";
  }, [answerStatus, visibilityStatus]);

  if (!question) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>학습 문의를 찾을 수 없습니다</CardTitle>
          <CardDescription>목록에서 다시 학습 문의를 선택해 주세요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/lesson-questions" className="font-bold text-indigo-600 hover:underline">
            목록으로 돌아가기
          </Link>
        </CardContent>
      </Card>
    );
  }

  const member = members.find((item) => item.id === question.memberId);

  const addLog = (action: string, note: string) => {
    setLogs((previous) => [{ action, actor: currentAdminName, at: nowLabel, note }, ...previous]);
  };

  const approve = () => {
    setVisibilityStatus("승인됨");
    addLog("승인 처리", "승인 대기 질문을 공개 승인했습니다. (mock)");
    setToast("학습 질문이 승인되었습니다. 이제 답변 작성이 가능합니다. (mock)");
  };

  const moveToTrash = () => {
    setVisibilityStatus("휴지통");
    addLog("휴지통 이동", "학습 질문을 휴지통으로 이동했습니다. (mock)");
    setToast("학습 질문을 휴지통으로 이동했습니다. (mock)");
  };

  const restore = () => {
    setVisibilityStatus("승인됨");
    addLog("복구", "휴지통에서 일반 학습 질문 목록으로 복구했습니다. (mock)");
    setToast("학습 질문을 복구했습니다. (mock)");
  };

  const permanentlyDelete = () => {
    if (window.confirm("영구 삭제하면 복구할 수 없습니다. 계속 진행할까요?")) {
      addLog("영구 삭제", "영구 삭제 mock action을 기록했습니다.");
      setToast("영구 삭제 처리되었습니다. (mock)");
    }
  };

  const saveAnswer = () => {
    setAnswerStatus("답변완료");
    setAnsweredBy(currentAdminName);
    setAnsweredAt(nowLabel);
    addLog("답변 저장", "답변상태를 답변완료로 변경했습니다. (mock)");
    setToast("답변이 저장되었습니다. (mock)");
  };

  return (
    <div className="space-y-6">
      <Link href="/lesson-questions" className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:underline">
        <ArrowLeft className="h-4 w-4" />
        학습 질문 목록으로
      </Link>

      <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-glow">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-200"># 학습 질문</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">학습 질문 상세</h1>
            <p className="mt-4 max-w-3xl text-slate-300">질문자 정보, 질문 내용, 답변 및 처리 이력을 상세 화면에서 확인합니다.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={badgeVariant(visibilityStatus)}>{visibilityStatus}</Badge>
            <Badge variant={badgeVariant(answerStatus)}>{answerStatus}</Badge>
          </div>
        </div>
      </section>

      {toast && <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{toast}</div>}

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <UserInfoCard
            title="질문자 정보"
            description="학습 질문을 등록한 회원의 기본 정보와 회원 상세 링크입니다."
            user={{
              name: question.userName,
              memberId: question.memberId,
              email: question.email,
              phone: member?.phone ?? "-",
              memberStatus: member?.status ?? "-",
              lastLogin: member?.lastLogin ?? "-",
            }}
          />

          <Section title="질문 내용" description="학습 질문 제목, 강의 정보, 질문 본문입니다.">
            <div className="rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-bold text-slate-500">질문 제목</p>
              <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{question.questionPreview}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5">
              <p className="text-sm font-bold text-slate-500">강의 정보</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-lg font-black text-slate-950">{question.courseLevel} / {question.lessonDay} - {question.lectureTitle}</p>
                <a
                  href="https://studymini.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:underline"
                >
                  강의 바로가기
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
              <p className="whitespace-pre-wrap">{question.questionBody}</p>
            </div>
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-slate-500">첨부파일</p>
              {question.attachments.length > 0 ? (
                <ul className="space-y-2">
                  {question.attachments.map((file) => (
                    <li key={file.name} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                      {file.name} <span className="text-slate-400">{file.size}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-400">첨부파일이 없습니다.</div>
              )}
            </div>
          </Section>

          <Section title="답변 작성" description={actionGuide}>
            <textarea
              className="min-h-60 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
              disabled={!canWriteAnswer}
              value={answerBody}
              onChange={(event) => setAnswerBody(event.target.value)}
              placeholder={isTrashed ? "휴지통 상태에서는 답변을 작성할 수 없습니다." : "답변 내용을 입력하세요."}
            />
            <div className="mt-3 flex justify-end">
              <Button disabled={!canWriteAnswer || answerBody.trim().length === 0} onClick={saveAnswer}>
                <Save className="h-4 w-4" />
                답변 저장
              </Button>
            </div>
          </Section>

          <Section title="답변 상태">
            <div className="grid gap-4 md:grid-cols-3">
              <InfoItem label="답변상태" value={<Badge variant={badgeVariant(answerStatus)}>{answerStatus}</Badge>} />
              <InfoItem label="담당자/답변자" value={answeredBy} />
              <InfoItem label="답변일" value={answeredAt} />
            </div>
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-5 text-sm leading-7 text-slate-700">
              {answerBody || "저장된 답변 내용이 없습니다."}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <Section title="처리 액션" description="현재 상태에 맞는 승인/휴지통 처리를 진행합니다.">
            <div className="space-y-2">
              {visibilityStatus === "승인 대기" && (
                <>
                  <Button className="w-full" onClick={approve}>승인</Button>
                  <Button className="w-full" variant="outline" onClick={moveToTrash}>
                    <Trash2 className="h-4 w-4" />
                    휴지통 이동
                  </Button>
                </>
              )}
              {visibilityStatus === "승인됨" && (
                <Button className="w-full" variant="outline" onClick={moveToTrash}>
                  <Trash2 className="h-4 w-4" />
                  휴지통 이동
                </Button>
              )}
              {visibilityStatus === "휴지통" && (
                <>
                  <Button className="w-full" onClick={restore}>
                    <Undo2 className="h-4 w-4" />
                    복구
                  </Button>
                  <Button className="w-full" variant="outline" onClick={permanentlyDelete}>영구 삭제</Button>
                </>
              )}
            </div>
          </Section>

          <Section title="처리 로그">
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
          </Section>
        </aside>
      </div>
    </div>
  );
}

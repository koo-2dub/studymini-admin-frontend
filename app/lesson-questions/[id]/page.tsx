"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, Save, Trash2, Undo2 } from "lucide-react";

import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions, type LessonQuestionAnswerStatus, type LessonQuestionVisibility } from "../data";

const currentAdminName = "관리자 한나";

const badgeVariant = (value: string): BadgeProps["variant"] => {
  if (value === "승인됨" || value === "답변완료") return "success";
  if (value === "승인 대기" || value === "미답변") return "warning";
  if (value === "휴지통") return "rose";
  return "slate";
};

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <div className="mt-2 text-sm font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
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
  const [visibilityStatus, setVisibilityStatus] = useState<LessonQuestionVisibility>(question?.visibilityStatus ?? "승인 대기");
  const [answerStatus, setAnswerStatus] = useState<LessonQuestionAnswerStatus>(question?.answerStatus ?? "미답변");
  const [answerBody, setAnswerBody] = useState(question?.answerBody ?? "");
  const [answeredBy, setAnsweredBy] = useState(question?.answeredBy ?? "-");
  const [answeredAt, setAnsweredAt] = useState(question?.answeredAt ?? "-");
  const [logs, setLogs] = useState(question?.logs ?? []);

  const canWriteAnswer = visibilityStatus === "승인됨";
  const isTrashed = visibilityStatus === "휴지통";
  const nowLabel = "2026-06-01 11:30";

  const actionGuide = useMemo(() => {
    if (visibilityStatus === "승인 대기") {
      return "승인 전 질문은 사용자에게 공개되지 않습니다. 승인 후 답변 작성이 가능합니다.";
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
          <Button asChild variant="outline"><Link href="/lesson-questions">목록으로 돌아가기</Link></Button>
        </CardContent>
      </Card>
    );
  }

  const addLog = (action: string, note: string) => {
    setLogs((previous) => [{ action, actor: currentAdminName, at: nowLabel, note }, ...previous]);
  };

  const approve = () => {
    setVisibilityStatus("승인됨");
    addLog("승인 처리", "승인 대기 질문을 공개 승인했습니다. (mock)");
    setToast("학습 문의가 승인되었습니다. 이제 답변 작성이 가능합니다. (mock)");
  };

  const moveToTrash = () => {
    setVisibilityStatus("휴지통");
    addLog("휴지통 이동", "학습 문의를 휴지통으로 이동했습니다. (mock)");
    setToast("학습 문의를 휴지통으로 이동했습니다. (mock)");
  };

  const restore = () => {
    setVisibilityStatus("승인됨");
    addLog("복구", "휴지통에서 일반 학습 문의 목록으로 복구했습니다. (mock)");
    setToast("학습 문의를 복구했습니다. (mock)");
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/lesson-questions" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" /> 학습 문의 목록으로
          </Link>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">학습 문의 상세</h1>
          <p className="mt-2 text-sm text-slate-500">승인, 공개, 답변, 휴지통 처리를 상세 화면에서 진행합니다.</p>
        </div>
        <div className="flex gap-2">
          <Badge className="whitespace-nowrap" variant={badgeVariant(visibilityStatus)}>{visibilityStatus}</Badge>
          <Badge className="whitespace-nowrap" variant={badgeVariant(answerStatus)}>{answerStatus}</Badge>
        </div>
      </div>

      {toast && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{toast}</div>}

      <Section title="질문 정보">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem label="문의번호" value={question.id} />
          <InfoItem label="문의일" value={question.askedAt} />
          <InfoItem label="유저" value={<Link className="text-primary hover:underline" href={`/members/${question.memberId}`}>{question.userName}</Link>} />
          <InfoItem label="이메일" value={question.email} />
          <InfoItem label="언어" value={question.language} />
          <InfoItem label="공개상태" value={<Badge variant={badgeVariant(visibilityStatus)}>{visibilityStatus}</Badge>} />
          <InfoItem label="답변상태" value={<Badge variant={badgeVariant(answerStatus)}>{answerStatus}</Badge>} />
        </div>
      </Section>

      <Section title="강의 정보" description="목록에서는 링크를 제공하지 않고, 상세 화면에서만 강의 바로가기를 제공합니다.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoItem label="언어" value={question.language} />
          <InfoItem label="코스/단계" value={question.courseLevel} />
          <InfoItem label="레슨/일차" value={question.lessonDay} />
          <InfoItem label="강의명" value={question.lectureTitle} />
        </div>
        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">
          <p className="text-sm font-bold text-indigo-900">전체 표시</p>
          <p className="mt-1 text-lg font-black text-indigo-950">{question.courseLevel} / {question.lessonDay} - {question.lectureTitle}</p>
          <Button asChild className="mt-4">
            <a href="https://studymini.com" target="_blank" rel="noreferrer">
              강의 바로가기 <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </Section>

      <Section title="질문 내용">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 leading-7 text-slate-700">{question.questionBody}</div>
        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-700">첨부파일</p>
          {question.attachments.length > 0 ? (
            <ul className="mt-3 space-y-2">
              {question.attachments.map((file) => (
                <li key={file.name} className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                  <span className="font-semibold">{file.name}</span>
                  <span className="text-slate-500">{file.size}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-slate-500">첨부파일이 없습니다.</p>}
        </div>
      </Section>

      <Section title="승인/공개 처리" description={actionGuide}>
        <div className="flex flex-wrap gap-2">
          {visibilityStatus === "승인 대기" && (
            <>
              <Button onClick={approve}>승인</Button>
              <Button variant="outline" onClick={moveToTrash}><Trash2 className="h-4 w-4" /> 휴지통 이동</Button>
            </>
          )}
          {visibilityStatus === "승인됨" && <Button variant="outline" onClick={moveToTrash}><Trash2 className="h-4 w-4" /> 휴지통 이동</Button>}
          {visibilityStatus === "휴지통" && (
            <>
              <Button onClick={restore}><Undo2 className="h-4 w-4" /> 복구</Button>
              <Button variant="outline" onClick={permanentlyDelete}>영구 삭제</Button>
            </>
          )}
        </div>
      </Section>

      <Section title="답변 작성" description={canWriteAnswer ? "승인된 질문에 답변을 작성하거나 수정합니다." : "승인됨 상태에서만 답변 작성이 활성화됩니다."}>
        <textarea
          className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-6 outline-none focus:border-primary disabled:bg-slate-100 disabled:text-slate-400"
          value={answerBody}
          disabled={!canWriteAnswer}
          onChange={(event) => setAnswerBody(event.target.value)}
          placeholder={isTrashed ? "휴지통 상태에서는 답변을 작성할 수 없습니다." : "답변 내용을 입력하세요."}
        />
        <div className="mt-3 flex justify-end">
          <Button disabled={!canWriteAnswer || answerBody.trim().length === 0} onClick={saveAnswer}>
            <Save className="h-4 w-4" /> 답변 저장
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
    </div>
  );
}

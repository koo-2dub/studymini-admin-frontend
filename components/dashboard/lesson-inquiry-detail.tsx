"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText } from "lucide-react";

import { AnswerStatusBadge, PublicStatusBadge, WorkflowStatusBadge } from "@/components/dashboard/inquiry-badges";
import { TextArea } from "@/components/dashboard/inquiry-shared";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LessonInquiry } from "@/lib/mock-data";

export function LessonInquiryDetail({ inquiry }: { inquiry: LessonInquiry }) {
  const canAnswer = inquiry.publicStatus === "승인됨" && inquiry.workflowStatus !== "휴지통";
  const isTrash = inquiry.workflowStatus === "휴지통";
  const confirmPermanentDelete = () => {
    if (window.confirm(`${inquiry.inquiryId} 학습 문의를 영구 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      window.alert("목업 화면입니다. 실제 영구 삭제 API 연동 전입니다.");
    }
  };

  return (
    <>
      <PageHeader eyebrow="문의 관리" title="학습 문의 상세" description={`${inquiry.inquiryId} · ${inquiry.createdAt} 접수된 학습 질문을 승인·답변·삭제 처리합니다.`} action={<Button asChild variant="secondary"><Link href="/inquiries/lesson"><ArrowLeft className="h-4 w-4" />목록으로</Link></Button>} />
      <section className="mb-6 space-y-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3"><span className="font-mono text-sm font-black text-slate-700">{inquiry.inquiryId}</span><WorkflowStatusBadge value={inquiry.workflowStatus} /><PublicStatusBadge value={inquiry.publicStatus} /><AnswerStatusBadge value={inquiry.answerStatus} /><span className="text-sm font-semibold text-slate-500">문의일 {inquiry.createdAt}</span></div>
        <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">승인 전 질문은 사용자에게 공개되지 않습니다. 승인 후 질문과 관리자 답변이 공개됩니다.</p>
        <ActionButtons inquiry={inquiry} onPermanentDelete={confirmPermanentDelete} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card><CardHeader><CardTitle>유저 정보</CardTitle><CardDescription>학습 질문 작성자 정보</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><Info label="닉네임/이름" value={inquiry.userName} /><Info label="User ID" value={inquiry.userId} /><Info label="이메일" value={inquiry.email} /><Info label="전화번호" value={inquiry.phone} /><Info label="회원상태" value={inquiry.memberStatus} /><Button asChild className="mt-3"><Link href={`/members/${inquiry.userId}`}>유저 상세 보기</Link></Button></CardContent></Card>
        <Card><CardHeader><CardTitle>강의 정보</CardTitle><CardDescription>질문이 등록된 강의 컨텍스트</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><Info label="언어" value={inquiry.language} /><Info label="코스/단계" value={inquiry.courseStage} /><Info label="레슨/일차" value={inquiry.lessonDay} /><Info label="강의명" value={inquiry.lessonTitle} /><div className="rounded-2xl bg-indigo-50 p-4 font-bold text-indigo-800">{inquiry.courseDisplay}</div><Button asChild variant="outline"><a href="https://studymini.com" target="_blank" rel="noreferrer">강의 바로가기<ExternalLink className="h-4 w-4" /></a></Button></CardContent></Card>
        <Card><CardHeader><CardTitle>질문 내용</CardTitle><CardDescription>강의 하단에서 등록된 질문</CardDescription></CardHeader><CardContent className="space-y-4"><Info label="질문일" value={inquiry.createdAt} /><div><p className="mb-2 text-xs font-bold text-slate-500">질문 본문</p><p className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{inquiry.content}</p></div><Attachment files={inquiry.attachments} /></CardContent></Card>
        <Card><CardHeader><CardTitle>답변 작성</CardTitle><CardDescription>{canAnswer ? "승인된 질문에 답변을 작성하거나 수정합니다." : "승인 전 또는 휴지통 질문에는 답변을 작성할 수 없습니다."}</CardDescription></CardHeader><CardContent className="space-y-4"><TextArea disabled={!canAnswer} defaultValue={inquiry.answerHistory[0]?.content ?? ""} placeholder={canAnswer ? "답변 내용을 입력하세요." : "승인된 질문만 답변 작성이 가능합니다."} /><Info label="답변 담당자" value={inquiry.assignee} /><div className="flex gap-2"><Button disabled={!canAnswer}>{inquiry.answerStatus === "답변완료" ? "답변 수정" : "답변 저장"}</Button><Button variant="outline" disabled={!canAnswer}>답변 완료 처리</Button></div></CardContent></Card>
        <Card><CardHeader><CardTitle>답변 이력</CardTitle></CardHeader><CardContent className="space-y-3">{inquiry.answerHistory.length ? inquiry.answerHistory.map((answer) => <div key={answer.answeredAt} className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-500">{answer.answeredAt} · {answer.adminName}</p><p className="mt-2 text-sm leading-7">{answer.content}</p></div>) : <p className="text-sm text-slate-500">등록된 답변 이력이 없습니다.</p>}</CardContent></Card>
        <Card className="xl:col-span-2"><CardHeader><CardTitle>관리자 메모</CardTitle><CardDescription>내부 메모와 처리 로그</CardDescription></CardHeader><CardContent className="grid gap-4 md:grid-cols-2"><div className="rounded-2xl bg-slate-50 p-4 text-sm leading-7">{inquiry.internalMemo}</div><div className="space-y-2">{inquiry.processLogs.map((log) => <p key={log} className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-100">{log}</p>)}</div></CardContent></Card>
      </section>
    </>
  );
}

function ActionButtons({ inquiry, onPermanentDelete }: { inquiry: LessonInquiry; onPermanentDelete: () => void }) {
  const alertMock = (label: string) => window.alert(`${label} 처리 목업입니다. 실제 API 연동 전입니다.`);
  if (inquiry.workflowStatus === "승인 대기") return <div className="flex flex-wrap gap-2"><Button onClick={() => alertMock("승인")}>승인</Button><Button variant="outline" onClick={() => alertMock("보류")}>보류</Button><Button variant="outline" onClick={() => alertMock("휴지통 이동")}>휴지통으로 이동</Button></div>;
  if (inquiry.workflowStatus === "승인됨") return <div className="flex flex-wrap gap-2"><Button onClick={() => alertMock("답변 작성")}>답변 작성</Button><Button variant="outline" onClick={() => alertMock("보류")}>보류</Button><Button variant="outline" onClick={() => alertMock("휴지통 이동")}>휴지통으로 이동</Button></div>;
  if (inquiry.workflowStatus === "답변 완료") return <div className="flex flex-wrap gap-2"><Button onClick={() => alertMock("답변 수정")}>답변 수정</Button><Button variant="outline" onClick={() => alertMock("휴지통 이동")}>휴지통으로 이동</Button></div>;
  if (inquiry.workflowStatus === "휴지통") return <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => alertMock("복구")}>복구</Button><Button variant="outline" onClick={onPermanentDelete}>영구 삭제</Button></div>;
  return <div className="flex flex-wrap gap-2"><Button onClick={() => alertMock("승인")}>승인</Button><Button variant="outline" onClick={() => alertMock("휴지통 이동")}>휴지통으로 이동</Button></div>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4"><span className="text-slate-500">{label}</span><span className="font-bold text-slate-800">{value}</span></div>; }
function Attachment({ files }: { files: string[] }) { return <div><p className="mb-2 text-xs font-bold text-slate-500">첨부파일</p><div className="rounded-2xl border border-dashed border-slate-200 p-4">{files.length ? files.map((file) => <Badge key={file} variant="slate" className="mr-2"><FileText className="mr-1 h-3 w-3" />{file}</Badge>) : <span className="text-sm text-slate-400">첨부파일 없음</span>}</div></div>; }

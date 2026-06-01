"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminAssignee, InquiryAnswerStatus, LessonQuestion, LessonVisibilityStatus } from "@/lib/mock-data";
import {
  AssigneePill,
  BulkAssignModal,
  DetailShell,
  Field,
  FilterCard,
  SelectInput,
  StatusPill,
  TextInput,
  Toast,
  UserDetailLink,
  assigneeOptions,
  getNowLogTime,
} from "@/components/dashboard/inquiry-shared";

type LanguageFilter = "전체" | LessonQuestion["language"];
type Filters = { search: string; language: LanguageFilter; course: string; visibility: "전체" | LessonVisibilityStatus; answerStatus: "전체" | InquiryAnswerStatus; assignee: "전체" | AdminAssignee; startDate: string; endDate: string };
const defaultFilters: Filters = { search: "", language: "전체", course: "전체", visibility: "전체", answerStatus: "전체", assignee: "전체", startDate: "", endDate: "" };
const languages: LanguageFilter[] = ["전체", "영어", "일본어", "중국어", "스페인어", "프랑스어", "독일어", "이탈리아어"];
const courseOptions = ["전체", "일본어 1단계", "영어 미션 1단계", "스페인어 2단계", "프랑스어 회화", "중국어 올인원", "독일어 입문", "이탈리아어 여행회화"];

function shortLesson(question: LessonQuestion) {
  return `${question.course} / ${question.day}`;
}
function fullLesson(question: LessonQuestion) {
  return `${question.course} / ${question.day} - ${question.lessonTitle}`;
}

export function LessonQuestionsDashboard({ initialQuestions }: { initialQuestions: LessonQuestion[] }) {
  const [items, setItems] = useState(initialQuestions);
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkAssignee, setBulkAssignee] = useState<AdminAssignee>("박튜터");
  const [toast, setToast] = useState("");

  const selectedQuestion = items.find((item) => item.id === selectedId) ?? null;
  const filteredItems = useMemo(() => items.filter((item) => {
    const keyword = appliedFilters.search.trim().toLowerCase();
    const inquiryDay = item.inquiryDate.slice(0, 10);
    const matchesKeyword = !keyword || [item.userName, item.email, item.question, item.course, item.lessonTitle].some((value) => value.toLowerCase().includes(keyword));
    return matchesKeyword
      && (appliedFilters.language === "전체" || item.language === appliedFilters.language)
      && (appliedFilters.course === "전체" || item.course === appliedFilters.course)
      && (appliedFilters.visibility === "전체" || item.visibilityStatus === appliedFilters.visibility)
      && (appliedFilters.answerStatus === "전체" || item.answerStatus === appliedFilters.answerStatus)
      && (appliedFilters.assignee === "전체" || item.assignee === appliedFilters.assignee)
      && (!appliedFilters.startDate || inquiryDay >= appliedFilters.startDate)
      && (!appliedFilters.endDate || inquiryDay <= appliedFilters.endDate);
  }), [items, appliedFilters]);

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2200); };
  const updateQuestion = (id: string, updater: (item: LessonQuestion) => LessonQuestion) => setItems((current) => current.map((item) => item.id === id ? updater(item) : item));
  const saveAssignee = (id: string, nextAssignee: AdminAssignee) => {
    updateQuestion(id, (item) => ({ ...item, assignee: nextAssignee, logs: [`${getNowLogTime()} 담당자 변경: ${item.assignee} → ${nextAssignee}`, ...item.logs] }));
    showToast("담당자가 저장되었습니다.");
  };
  const saveBulkAssignee = () => {
    setItems((current) => current.map((item) => checkedIds.includes(item.id) ? { ...item, assignee: bulkAssignee, logs: [`${getNowLogTime()} 담당자 변경: ${item.assignee} → ${bulkAssignee}`, ...item.logs] } : item));
    setBulkOpen(false); setCheckedIds([]); showToast("담당자 일괄 배정이 완료되었습니다.");
  };

  if (selectedQuestion) {
    return <LessonQuestionDetail question={selectedQuestion} onBack={() => setSelectedId(null)} onDelete={(id) => { setItems((current) => current.filter((item) => item.id !== id)); setSelectedId(null); }} onSaveAssignee={saveAssignee} onUpdate={updateQuestion} showToast={showToast} toast={toast} />;
  }

  return (
    <div className="space-y-5">
      <FilterCard title="학습 문의 필터" description="언어, 강의, 공개/답변 상태와 담당자 기준으로 학습 문의를 정리합니다." actions={<><Button type="button" onClick={() => setAppliedFilters(filters)}>필터 적용</Button><Button type="button" variant="outline" onClick={() => { setFilters(defaultFilters); setAppliedFilters(defaultFilters); }}>초기화</Button></>}>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 text-sm font-bold text-slate-700 xl:col-span-2">검색
            <TextInput placeholder="유저명, 이메일, 질문 내용, 강의명" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">언어
            <SelectInput value={filters.language} onChange={(event) => setFilters({ ...filters, language: event.target.value as LanguageFilter })}>{languages.map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">강의
            <SelectInput value={filters.course} onChange={(event) => setFilters({ ...filters, course: event.target.value })}>{courseOptions.map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">공개상태
            <SelectInput value={filters.visibility} onChange={(event) => setFilters({ ...filters, visibility: event.target.value as Filters["visibility"] })}>{(["전체", "승인 대기", "승인됨", "휴지통"] as const).map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">답변상태
            <SelectInput value={filters.answerStatus} onChange={(event) => setFilters({ ...filters, answerStatus: event.target.value as Filters["answerStatus"] })}>{(["전체", "미답변", "답변완료", "보류"] as const).map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">담당자
            <SelectInput value={filters.assignee} onChange={(event) => setFilters({ ...filters, assignee: event.target.value as Filters["assignee"] })}><option>전체</option>{assigneeOptions.map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">문의일 시작
            <TextInput type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">문의일 종료
            <TextInput type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} />
          </label>
        </div>
      </FilterCard>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0"><div><CardTitle>학습 문의 목록</CardTitle><CardDescription>강의 정보는 짧게 표시하고 상세에서 전체 제목을 확인합니다.</CardDescription></div><Button type="button" variant="outline" disabled={checkedIds.length === 0} onClick={() => setBulkOpen(true)}>담당자 일괄 배정</Button></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead className="w-12">선택</TableHead><TableHead>유저</TableHead><TableHead>언어</TableHead><TableHead>강의 정보</TableHead><TableHead>질문 미리보기</TableHead><TableHead>공개상태</TableHead><TableHead>답변상태</TableHead><TableHead>담당자</TableHead><TableHead>문의일</TableHead></TableRow></TableHeader>
            <TableBody>{filteredItems.map((item) => {
              const checked = checkedIds.includes(item.id);
              return <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedId(item.id)}>
                <TableCell onClick={(event) => event.stopPropagation()}><button type="button" aria-label="문의 선택" onClick={() => setCheckedIds((ids) => checked ? ids.filter((id) => id !== item.id) : [...ids, item.id])} className="text-primary">{checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}</button></TableCell>
                <TableCell><UserDetailLink userId={item.userId} userName={item.userName} /></TableCell>
                <TableCell>{item.language}</TableCell>
                <TableCell><a href="https://studymini.com" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="font-bold text-primary underline-offset-4 hover:underline">{shortLesson(item)}</a></TableCell>
                <TableCell className="max-w-xs truncate text-slate-600">{item.question}</TableCell>
                <TableCell><StatusPill value={item.visibilityStatus} type="visibility" /></TableCell>
                <TableCell><StatusPill value={item.answerStatus} /></TableCell>
                <TableCell><AssigneePill value={item.assignee} /></TableCell>
                <TableCell className="whitespace-nowrap">{item.inquiryDate}</TableCell>
              </TableRow>;
            })}</TableBody>
          </Table>
        </CardContent>
      </Card>
      <BulkAssignModal open={bulkOpen} selectedCount={checkedIds.length} assignee={bulkAssignee} onAssigneeChange={setBulkAssignee} onClose={() => setBulkOpen(false)} onSave={saveBulkAssignee} />
      <Toast message={toast} />
    </div>
  );
}

function LessonQuestionDetail({ question, onBack, onDelete, onSaveAssignee, onUpdate, showToast, toast }: { question: LessonQuestion; onBack: () => void; onDelete: (id: string) => void; onSaveAssignee: (id: string, assignee: AdminAssignee) => void; onUpdate: (id: string, updater: (item: LessonQuestion) => LessonQuestion) => void; showToast: (message: string) => void; toast: string }) {
  const [assignee, setAssignee] = useState<AdminAssignee>(question.assignee);
  const [answer, setAnswer] = useState(question.answer);
  const canAnswer = question.visibilityStatus === "승인됨";
  const isTrash = question.visibilityStatus === "휴지통";

  return (
    <DetailShell onBack={onBack} title="학습 문의 상세" description="문의번호와 User ID는 상세 화면에서만 확인합니다.">
      <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-4"><Field label="문의번호">{question.id}</Field><Field label="User ID">{question.userId}</Field><Field label="유저"><UserDetailLink userId={question.userId} userName={question.userName} /></Field><Field label="이메일">{question.email}</Field><Field label="강의 정보"><a href="https://studymini.com" target="_blank" rel="noreferrer" className="text-primary underline-offset-4 hover:underline">{fullLesson(question)}</a></Field><Field label="공개상태"><StatusPill value={question.visibilityStatus} type="visibility" /></Field><Field label="답변상태"><StatusPill value={question.answerStatus} /></Field><Field label="담당자"><AssigneePill value={question.assignee} /></Field></div>
      <section className="space-y-3"><h3 className="text-base font-black text-slate-900">질문 내용</h3><p className="rounded-2xl border border-slate-100 bg-white p-5 leading-7 text-slate-700">{question.question}</p></section>
      <Card className="bg-white">
        <CardHeader><CardTitle>공개 상태 처리</CardTitle><CardDescription>승인된 학습 문의만 답변 작성이 가능합니다.</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {question.visibilityStatus === "승인 대기" && <Button type="button" onClick={() => { onUpdate(question.id, (item) => ({ ...item, visibilityStatus: "승인됨", logs: [`${getNowLogTime()} 승인됨`, ...item.logs] })); showToast("승인되어 답변 작성이 가능합니다."); }}>승인</Button>}
          {!isTrash && <Button type="button" variant="outline" onClick={() => { onUpdate(question.id, (item) => ({ ...item, visibilityStatus: "휴지통", logs: [`${getNowLogTime()} 휴지통 이동`, ...item.logs] })); showToast("휴지통으로 이동했습니다."); }}>휴지통 이동</Button>}
          {isTrash && <><Button type="button" onClick={() => { onUpdate(question.id, (item) => ({ ...item, visibilityStatus: "승인 대기", logs: [`${getNowLogTime()} 휴지통에서 복구`, ...item.logs] })); showToast("복구되었습니다."); }}>복구</Button><Button type="button" variant="outline" onClick={() => { if (window.confirm("이 학습 문의를 영구 삭제하시겠습니까?")) { onDelete(question.id); showToast("영구 삭제되었습니다."); } }}>영구 삭제</Button></>}
        </CardContent>
      </Card>
      <Card className="w-full bg-indigo-50/55">
        <CardHeader><CardTitle>답변 작성</CardTitle><CardDescription>{canAnswer ? "긴 답변 작성에 맞춘 넓은 영역입니다. 답변 담당자와 저장/완료 처리를 함께 진행합니다." : "승인 대기 또는 휴지통 상태에서는 답변 작성이 비활성화됩니다. 승인 후 답변 작성이 가능합니다."}</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end"><label className="space-y-2 text-sm font-bold text-slate-700">답변 담당자<SelectInput value={assignee} onChange={(event) => setAssignee(event.target.value as AdminAssignee)} disabled={!canAnswer}>{assigneeOptions.map((option) => <option key={option}>{option}</option>)}</SelectInput></label><Button type="button" variant="outline" disabled={!canAnswer} onClick={() => onSaveAssignee(question.id, assignee)}>담당자 저장</Button><Button type="button" disabled={!canAnswer} onClick={() => { onUpdate(question.id, (item) => ({ ...item, answerStatus: "답변완료", answerDate: getNowLogTime(), answer, logs: [`${getNowLogTime()} 답변 완료 처리`, ...item.logs] })); showToast("답변 완료 처리되었습니다."); }}>답변 완료 처리</Button></div>
          {!canAnswer && <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-700">승인 후 답변 작성 영역이 활성화됩니다.</div>}
          <textarea value={answer} disabled={!canAnswer} onChange={(event) => setAnswer(event.target.value)} className="min-h-[180px] w-full min-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-slate-100 disabled:text-slate-400" placeholder="튜터 답변을 입력하세요." />
          <div className="flex justify-end"><Button type="button" variant="secondary" disabled={!canAnswer} onClick={() => { onUpdate(question.id, (item) => ({ ...item, answer, logs: [`${getNowLogTime()} 답변 임시 저장`, ...item.logs] })); showToast("답변이 저장되었습니다."); }}>저장</Button></div>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>담당자 지정</CardTitle><CardDescription>일반 문의와 동일한 방식으로 현재 담당자를 변경합니다.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end"><Field label="현재 담당자"><AssigneePill value={question.assignee} /></Field><label className="space-y-2 text-sm font-bold text-slate-700">담당자 변경<SelectInput value={assignee} onChange={(event) => setAssignee(event.target.value as AdminAssignee)}>{assigneeOptions.map((option) => <option key={option}>{option}</option>)}</SelectInput></label><Button type="button" onClick={() => onSaveAssignee(question.id, assignee)}>담당자 저장</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>처리 로그</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-slate-600">{question.logs.map((log, index) => <li key={`${log}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">{log}</li>)}</ul></CardContent></Card>
      <Toast message={toast} />
    </DetailShell>
  );
}

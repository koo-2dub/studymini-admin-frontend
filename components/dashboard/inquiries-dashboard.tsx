"use client";

import { useMemo, useState } from "react";
import { CheckSquare, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminAssignee, GeneralInquiry, InquiryAnswerStatus } from "@/lib/mock-data";
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

type Filters = {
  search: string;
  startDate: string;
  endDate: string;
  answerStatus: "전체" | InquiryAnswerStatus;
  assignee: "전체" | AdminAssignee;
};

const defaultFilters: Filters = { search: "", startDate: "", endDate: "", answerStatus: "전체", assignee: "전체" };

export function InquiriesDashboard({ initialInquiries }: { initialInquiries: GeneralInquiry[] }) {
  const [items, setItems] = useState(initialInquiries);
  const [filters, setFilters] = useState(defaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkAssignee, setBulkAssignee] = useState<AdminAssignee>("김운영");
  const [toast, setToast] = useState("");

  const selectedInquiry = items.find((item) => item.id === selectedId) ?? null;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const keyword = appliedFilters.search.trim().toLowerCase();
      const inquiryDay = item.inquiryDate.slice(0, 10);
      const matchesKeyword = !keyword || [item.userName, item.email, item.title, item.content].some((value) => value.toLowerCase().includes(keyword));
      const matchesStart = !appliedFilters.startDate || inquiryDay >= appliedFilters.startDate;
      const matchesEnd = !appliedFilters.endDate || inquiryDay <= appliedFilters.endDate;
      const matchesStatus = appliedFilters.answerStatus === "전체" || item.answerStatus === appliedFilters.answerStatus;
      const matchesAssignee = appliedFilters.assignee === "전체" || item.assignee === appliedFilters.assignee;
      return matchesKeyword && matchesStart && matchesEnd && matchesStatus && matchesAssignee;
    });
  }, [items, appliedFilters]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  const updateInquiry = (id: string, updater: (item: GeneralInquiry) => GeneralInquiry) => {
    setItems((current) => current.map((item) => (item.id === id ? updater(item) : item)));
  };

  const saveAssignee = (id: string, nextAssignee: AdminAssignee) => {
    updateInquiry(id, (item) => ({ ...item, assignee: nextAssignee, logs: [`${getNowLogTime()} 담당자 변경: ${item.assignee} → ${nextAssignee}`, ...item.logs] }));
    showToast("담당자가 저장되었습니다.");
  };

  const saveBulkAssignee = () => {
    setItems((current) => current.map((item) => checkedIds.includes(item.id) ? { ...item, assignee: bulkAssignee, logs: [`${getNowLogTime()} 담당자 변경: ${item.assignee} → ${bulkAssignee}`, ...item.logs] } : item));
    setBulkOpen(false);
    setCheckedIds([]);
    showToast("담당자 일괄 배정이 완료되었습니다.");
  };

  if (selectedInquiry) {
    return <GeneralInquiryDetail inquiry={selectedInquiry} onBack={() => setSelectedId(null)} onSaveAssignee={saveAssignee} onUpdate={updateInquiry} showToast={showToast} toast={toast} />;
  }

  return (
    <div className="space-y-5">
      <FilterCard
        title="일반 문의 필터"
        description="유저명, 이메일, 제목, 내용과 담당자/답변상태 기준으로 운영 큐를 좁혀봅니다."
        actions={
          <>
            <Button type="button" onClick={() => setAppliedFilters(filters)}>필터 적용</Button>
            <Button type="button" variant="outline" onClick={() => { setFilters(defaultFilters); setAppliedFilters(defaultFilters); }}>초기화</Button>
          </>
        }
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2 text-sm font-bold text-slate-700 xl:col-span-2">검색
            <TextInput placeholder="유저명, 이메일, 제목, 내용" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">문의일 시작
            <TextInput type="date" value={filters.startDate} onChange={(event) => setFilters({ ...filters, startDate: event.target.value })} />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">문의일 종료
            <TextInput type="date" value={filters.endDate} onChange={(event) => setFilters({ ...filters, endDate: event.target.value })} />
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">답변상태
            <SelectInput value={filters.answerStatus} onChange={(event) => setFilters({ ...filters, answerStatus: event.target.value as Filters["answerStatus"] })}>
              {(["전체", "미답변", "답변완료", "보류"] as const).map((option) => <option key={option}>{option}</option>)}
            </SelectInput>
          </label>
          <label className="space-y-2 text-sm font-bold text-slate-700">담당자
            <SelectInput value={filters.assignee} onChange={(event) => setFilters({ ...filters, assignee: event.target.value as Filters["assignee"] })}>
              <option>전체</option>{assigneeOptions.map((option) => <option key={option}>{option}</option>)}
            </SelectInput>
          </label>
        </div>
      </FilterCard>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <div>
            <CardTitle>일반 문의 목록</CardTitle>
            <CardDescription>목록에서는 운영 판단에 필요한 정보만 표시하고 식별자는 상세에서 확인합니다.</CardDescription>
          </div>
          <Button type="button" variant="outline" disabled={checkedIds.length === 0} onClick={() => setBulkOpen(true)}>담당자 일괄 배정</Button>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">선택</TableHead><TableHead>유저</TableHead><TableHead>이메일</TableHead><TableHead>제목</TableHead><TableHead>내용 미리보기</TableHead><TableHead>답변상태</TableHead><TableHead>담당자</TableHead><TableHead>문의일</TableHead><TableHead>답변일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const checked = checkedIds.includes(item.id);
                return (
                  <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelectedId(item.id)}>
                    <TableCell onClick={(event) => event.stopPropagation()}>
                      <button type="button" aria-label="문의 선택" onClick={() => setCheckedIds((ids) => checked ? ids.filter((id) => id !== item.id) : [...ids, item.id])} className="text-primary">{checked ? <CheckSquare className="h-5 w-5" /> : <Square className="h-5 w-5" />}</button>
                    </TableCell>
                    <TableCell><UserDetailLink userId={item.userId} userName={item.userName} /></TableCell>
                    <TableCell className="text-slate-600">{item.email}</TableCell>
                    <TableCell className="font-bold text-slate-900">{item.title}</TableCell>
                    <TableCell className="max-w-xs truncate text-slate-600">{item.content}</TableCell>
                    <TableCell><StatusPill value={item.answerStatus} /></TableCell>
                    <TableCell><AssigneePill value={item.assignee} /></TableCell>
                    <TableCell className="whitespace-nowrap">{item.inquiryDate}</TableCell>
                    <TableCell className="whitespace-nowrap">{item.answerDate}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <BulkAssignModal open={bulkOpen} selectedCount={checkedIds.length} assignee={bulkAssignee} onAssigneeChange={setBulkAssignee} onClose={() => setBulkOpen(false)} onSave={saveBulkAssignee} />
      <Toast message={toast} />
    </div>
  );
}

function GeneralInquiryDetail({ inquiry, onBack, onSaveAssignee, onUpdate, showToast, toast }: { inquiry: GeneralInquiry; onBack: () => void; onSaveAssignee: (id: string, assignee: AdminAssignee) => void; onUpdate: (id: string, updater: (item: GeneralInquiry) => GeneralInquiry) => void; showToast: (message: string) => void; toast: string }) {
  const [assignee, setAssignee] = useState<AdminAssignee>(inquiry.assignee);
  const [answer, setAnswer] = useState(inquiry.answer);

  return (
    <DetailShell onBack={onBack} title={inquiry.title} description="문의번호와 User ID는 상세 화면에서만 확인합니다.">
      <div className="grid gap-4 rounded-2xl bg-slate-50 p-5 md:grid-cols-4">
        <Field label="문의번호">{inquiry.id}</Field><Field label="User ID">{inquiry.userId}</Field><Field label="유저"><UserDetailLink userId={inquiry.userId} userName={inquiry.userName} /></Field><Field label="이메일">{inquiry.email}</Field>
        <Field label="답변상태"><StatusPill value={inquiry.answerStatus} /></Field><Field label="담당자"><AssigneePill value={inquiry.assignee} /></Field><Field label="문의일">{inquiry.inquiryDate}</Field><Field label="답변일">{inquiry.answerDate}</Field>
      </div>
      <section className="space-y-3">
        <h3 className="text-base font-black text-slate-900">문의 내용</h3>
        <p className="rounded-2xl border border-slate-100 bg-white p-5 leading-7 text-slate-700">{inquiry.content}</p>
      </section>
      <Card className="w-full bg-indigo-50/55">
        <CardHeader>
          <CardTitle>답변 작성</CardTitle>
          <CardDescription>긴 답변 작성에 맞춘 넓은 영역입니다. 답변 담당자와 저장/완료 처리를 함께 진행합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <label className="space-y-2 text-sm font-bold text-slate-700">답변 담당자
              <SelectInput value={assignee} onChange={(event) => setAssignee(event.target.value as AdminAssignee)}>
                {assigneeOptions.map((option) => <option key={option}>{option}</option>)}
              </SelectInput>
            </label>
            <Button type="button" variant="outline" onClick={() => { onSaveAssignee(inquiry.id, assignee); }}>담당자 저장</Button>
            <Button type="button" onClick={() => { onUpdate(inquiry.id, (item) => ({ ...item, answerStatus: "답변완료", answerDate: getNowLogTime(), answer, logs: [`${getNowLogTime()} 답변 완료 처리`, ...item.logs] })); showToast("답변 완료 처리되었습니다."); }}>답변 완료 처리</Button>
          </div>
          <textarea value={answer} onChange={(event) => setAnswer(event.target.value)} className="min-h-[180px] w-full min-w-[260px] rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-7 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" placeholder="관리자 답변을 입력하세요." />
          <div className="flex justify-end">
            <Button type="button" variant="secondary" onClick={() => { onUpdate(inquiry.id, (item) => ({ ...item, answer, logs: [`${getNowLogTime()} 답변 임시 저장`, ...item.logs] })); showToast("답변이 저장되었습니다."); }}>저장</Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>담당자 지정</CardTitle><CardDescription>담당자 변경은 즉시 mock state에 반영되고 처리 로그에 기록됩니다.</CardDescription></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <Field label="현재 담당자"><AssigneePill value={inquiry.assignee} /></Field>
          <label className="space-y-2 text-sm font-bold text-slate-700">담당자 변경
            <SelectInput value={assignee} onChange={(event) => setAssignee(event.target.value as AdminAssignee)}>{assigneeOptions.map((option) => <option key={option}>{option}</option>)}</SelectInput>
          </label>
          <Button type="button" onClick={() => onSaveAssignee(inquiry.id, assignee)}>담당자 저장</Button>
        </CardContent>
      </Card>
      <Card><CardHeader><CardTitle>처리 로그</CardTitle></CardHeader><CardContent><ul className="space-y-2 text-sm text-slate-600">{inquiry.logs.map((log, index) => <li key={`${log}-${index}`} className="rounded-xl bg-slate-50 px-4 py-3">{log}</li>)}</ul></CardContent></Card>
      <Toast message={toast} />
    </DetailShell>
  );
}

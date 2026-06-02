"use client";

import { ArrowLeft, CalendarClock, CheckCircle2, FileText, Plus, Save, ShieldCheck, UsersRound } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import {
  getGroupStatusTone,
  getGroupTypeTone,
  groupStatusOptions,
  groupTypeOptions,
  type GroupStatus,
  type GroupType,
  type LmsGroup,
} from "./data";
import { courseClasses } from "../courses/data";

const emptyForm = {
  groupName: "",
  type: "마케팅" as GroupType,
  companyName: "",
  campaignName: "",
  description: "",
  startedAt: "2026-06-10",
  endedAt: "2026-06-30",
  status: "예정" as GroupStatus,
  autoExpire: true,
  selectedClassIds: [courseClasses[0]?.id ?? ""].filter(Boolean),
  participantRows: [
    {
      id: "SM-1024",
      name: "지윤 김",
      email: "jiyoon.kim@example.com",
      startedAt: "2026-06-10",
      endedAt: "2026-06-30",
    },
  ],
};

type GroupFormState = typeof emptyForm;

type GroupFormPageProps = {
  mode: "create" | "edit";
  group?: LmsGroup;
};

function toFormState(group?: LmsGroup): GroupFormState {
  if (!group) return emptyForm;

  return {
    groupName: group.groupName,
    type: group.type,
    companyName: group.companyName,
    campaignName: group.campaignName,
    description: group.description,
    startedAt: group.startedAt,
    endedAt: group.endedAt,
    status: group.status,
    autoExpire: group.autoExpire,
    selectedClassIds: group.classes.map((courseClass) => courseClass.id),
    participantRows: group.users.map((user) => ({
      id: user.userId,
      name: user.name,
      email: user.email,
      startedAt: user.startedAt,
      endedAt: user.endedAt,
    })),
  };
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-bold text-slate-600">{children}</span>;
}

function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" {...props} />;
}

function FormSelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="mt-2 h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none" {...props} />;
}

function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="mt-2 min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none" {...props} />;
}

export function GroupFormPage({ mode, group }: GroupFormPageProps) {
  const [form, setForm] = useState<GroupFormState>(() => toFormState(group));

  const selectedClasses = useMemo(
    () => courseClasses.filter((courseClass) => form.selectedClassIds.includes(courseClass.id)),
    [form.selectedClassIds],
  );

  const updateForm = <K extends keyof GroupFormState>(key: K, value: GroupFormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const toggleClass = (classId: string) => {
    setForm((current) => ({
      ...current,
      selectedClassIds: current.selectedClassIds.includes(classId)
        ? current.selectedClassIds.filter((id) => id !== classId)
        : [...current.selectedClassIds, classId],
    }));
  };

  const title = mode === "create" ? "그룹 생성" : "그룹 수정";
  const description =
    mode === "create"
      ? "기간제 수강 권한을 제공할 새 그룹을 mock form으로 구성합니다."
      : "기존 그룹의 기본 정보, 제공 수업, 참여 유저 설정을 mock form으로 수정합니다.";

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title={title}
        description={description}
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href={mode === "edit" && group ? `/lms/groups/${group.id}` : "/lms/groups"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              {mode === "edit" ? "상세로" : "목록으로"}
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60"
              title="저장 기능은 mock 상태입니다."
            >
              <Save className="h-4 w-4" />
              {mode === "create" ? "그룹 생성" : "수정 저장"}
            </button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><FileText className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">그룹 유형</p>
              <div className="mt-2"><Badge variant={getGroupTypeTone(form.type)}>{form.type}</Badge></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><CalendarClock className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">운영 기간</p>
              <p className="mt-1 font-bold text-slate-900">{form.startedAt} ~ {form.endedAt}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><UsersRound className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">참여 유저</p>
              <p className="mt-1 font-bold text-slate-900">{form.participantRows.length}명</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-start gap-3 p-5">
            <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">자동 만료</p>
              <div className="mt-2"><Badge variant={form.autoExpire ? "success" : "slate"}>{form.autoExpire ? "ON" : "OFF"}</Badge></div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>그룹명, 유형, 회사/캠페인명과 기간제 권한 설정을 입력합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label>
                <FieldLabel>그룹명</FieldLabel>
                <FormInput
                  placeholder="예: 레뷰 일본어 베이직 6월 체험단"
                  value={form.groupName}
                  onChange={(event) => updateForm("groupName", event.target.value)}
                />
              </label>
              <label>
                <FieldLabel>그룹 유형</FieldLabel>
                <FormSelect value={form.type} onChange={(event) => updateForm("type", event.target.value as GroupType)}>
                  {groupTypeOptions.filter((option) => option !== "전체").map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </FormSelect>
              </label>
              <label>
                <FieldLabel>회사명</FieldLabel>
                <FormInput
                  placeholder="예: 레뷰코퍼레이션"
                  value={form.companyName}
                  onChange={(event) => updateForm("companyName", event.target.value)}
                />
              </label>
              <label>
                <FieldLabel>캠페인명</FieldLabel>
                <FormInput
                  placeholder="예: 일본어 베이직 14일 체험 캠페인"
                  value={form.campaignName}
                  onChange={(event) => updateForm("campaignName", event.target.value)}
                />
              </label>
              <label>
                <FieldLabel>시작일</FieldLabel>
                <FormInput type="date" value={form.startedAt} onChange={(event) => updateForm("startedAt", event.target.value)} />
              </label>
              <label>
                <FieldLabel>종료일</FieldLabel>
                <FormInput type="date" value={form.endedAt} onChange={(event) => updateForm("endedAt", event.target.value)} />
              </label>
              <label>
                <FieldLabel>상태</FieldLabel>
                <FormSelect value={form.status} onChange={(event) => updateForm("status", event.target.value as GroupStatus)}>
                  {groupStatusOptions.filter((option) => option !== "전체").map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </FormSelect>
              </label>
              <div>
                <FieldLabel>자동 만료 여부</FieldLabel>
                <button
                  type="button"
                  className="mt-2 flex h-10 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                  onClick={() => updateForm("autoExpire", !form.autoExpire)}
                >
                  <span>종료일 이후 수업 접근 권한 자동 회수</span>
                  <Badge variant={form.autoExpire ? "success" : "slate"}>{form.autoExpire ? "ON" : "OFF"}</Badge>
                </button>
              </div>
            </div>
            <label className="block">
              <FieldLabel>설명</FieldLabel>
              <FormTextarea
                placeholder="그룹 목적과 제공 범위를 입력하세요."
                value={form.description}
                onChange={(event) => updateForm("description", event.target.value)}
              />
            </label>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-800">
              자동 만료 기본값은 ON입니다. 종료일이 지나면 참여 유저는 해당 그룹의 수업 접근 권한을 잃습니다.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>제공 수업 설정</CardTitle>
                <CardDescription>그룹에 제공할 수업을 선택합니다. 실제 저장은 backend 연동 전 mock 상태입니다.</CardDescription>
              </div>
              <Button type="button" disabled className="cursor-not-allowed opacity-60">
                <Plus className="mr-2 h-4 w-4" />
                수업 검색 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-2">
              {courseClasses.map((courseClass) => (
                <label key={courseClass.id} className="flex cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
                  <span>
                    <span className="block font-bold text-slate-900">{courseClass.className}</span>
                    <span className="mt-1 block text-xs text-slate-500">{courseClass.language} · {courseClass.course}</span>
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-indigo-600"
                    checked={form.selectedClassIds.includes(courseClass.id)}
                    onChange={() => toggleClass(courseClass.id)}
                  />
                </label>
              ))}
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>수업명</TableHead>
                    <TableHead>언어</TableHead>
                    <TableHead>코스</TableHead>
                    <TableHead>공개상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedClasses.map((courseClass) => (
                    <TableRow key={courseClass.id}>
                      <TableCell className="min-w-40 font-bold text-slate-900">{courseClass.className}</TableCell>
                      <TableCell>{courseClass.language}</TableCell>
                      <TableCell>{courseClass.course}</TableCell>
                      <TableCell><Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge></TableCell>
                    </TableRow>
                  ))}
                  {selectedClasses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-10 text-center font-semibold text-slate-500">
                        선택된 수업이 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>참여 유저 설정</CardTitle>
                <CardDescription>생성/수정 화면에서 표시할 참여 유저 mock 목록입니다.</CardDescription>
              </div>
              <Button type="button" disabled className="cursor-not-allowed opacity-60">
                <Plus className="mr-2 h-4 w-4" />
                유저 검색 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>검증</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {form.participantRows.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="min-w-28 font-bold text-slate-900">{user.name}</TableCell>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.startedAt}</TableCell>
                    <TableCell>{user.endedAt}</TableCell>
                    <TableCell><Badge variant="success">정상</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-500" />
              <CardTitle>저장 전 확인</CardTitle>
            </div>
            <CardDescription>실제 저장 API 연동 전 mock 확인 영역입니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">선택 수업</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{selectedClasses.length}개</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">참여 유저</p>
                <p className="mt-2 text-3xl font-black text-slate-950">{form.participantRows.length}명</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm font-bold text-slate-500">상태</p>
                <div className="mt-3"><Badge variant={getGroupStatusTone(form.status)}>{form.status}</Badge></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

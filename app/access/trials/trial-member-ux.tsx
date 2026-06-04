"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Search, Upload, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { buildTrialMember, csvPreviewRows, mockMembers, trialContents, type CsvPreviewMember, type SearchableMember, type TrialContent, type TrialMember } from "./data";

type MemberManagerProps = {
  title?: string;
  description?: string;
  initialMembers?: TrialMember[];
  grantedContent: TrialContent[];
  mode?: "preview" | "detail";
};

function statusVariant(value: string) {
  if (value.includes("활성") || value.includes("추가 가능") || value.includes("추가 예정")) return "success";
  if (value.includes("임박") || value.includes("휴면")) return "warning";
  if (value.includes("오류") || value.includes("없음") || value.includes("불일치") || value.includes("만료") || value.includes("탈퇴")) return "rose";
  return "slate";
}

function contentText(contents: TrialContent[]) {
  return contents.map((content) => `${content.type}: ${content.title}`).join(" / ");
}

export function TrialMemberManager({
  title = "참여 회원",
  description = "회원 검색 추가 또는 CSV 업로드로 체험단 참여 회원을 관리합니다.",
  initialMembers = [],
  grantedContent,
  mode = "detail",
}: MemberManagerProps) {
  const [members, setMembers] = useState<TrialMember[]>(initialMembers);
  const [activePanel, setActivePanel] = useState<"search" | "csv" | null>(null);

  const addedIds = useMemo(() => new Set(members.map((member) => member.id)), [members]);

  const addMembers = (selectedMembers: SearchableMember[], addMethod: "검색 추가" | "CSV 업로드") => {
    const nextMembers = selectedMembers
      .filter((member) => !addedIds.has(member.id))
      .map((member) => buildTrialMember(member, addMethod, grantedContent));

    setMembers((current) => [...current, ...nextMembers]);
    setActivePanel(null);
  };

  return (
    <Card>
      <CardHeader className="gap-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        <div className="space-y-2">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={() => setActivePanel(activePanel === "search" ? null : "search")}>
            <Search className="h-4 w-4" /> 회원 추가
          </Button>
          <Button type="button" variant="secondary" onClick={() => setActivePanel(activePanel === "csv" ? null : "csv")}>
            <Upload className="h-4 w-4" /> CSV 업로드
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {activePanel === "search" ? <MemberSearchPanel addedIds={addedIds} onAdd={(selected) => addMembers(selected, "검색 추가")} onClose={() => setActivePanel(null)} /> : null}
        {activePanel === "csv" ? <CsvUploadPanel addedIds={addedIds} onAdd={(selected) => addMembers(selected, "CSV 업로드")} onClose={() => setActivePanel(null)} /> : null}
        <MemberTable members={members} mode={mode} />
      </CardContent>
    </Card>
  );
}

export function TrialCreateParticipationSection() {
  const [searchQuery, setSearchQuery] = useState("영어");
  const [selectedContents, setSelectedContents] = useState<TrialContent[]>([trialContents[0], trialContents[2]]);

  const filteredContents = trialContents.filter((content) => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return `${content.type} ${content.title} ${content.id}`.toLowerCase().includes(normalizedQuery);
  });

  const toggleContent = (content: TrialContent) => {
    setSelectedContents((current) => {
      const alreadySelected = current.some((item) => item.id === content.id);

      if (alreadySelected) {
        return current.filter((item) => item.id !== content.id);
      }

      return [...current, content];
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>대상 코스/패키지</CardTitle>
          <CardDescription>코스 또는 패키지를 검색한 뒤 체험단 대상 콘텐츠로 선택합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <label className="space-y-1 text-sm font-semibold text-slate-700">
              대상 코스/패키지 검색
              <input
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
                placeholder="코스명 또는 패키지명을 입력하세요"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
            </label>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
              <Table className="min-w-[720px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">유형</TableHead>
                    <TableHead className="whitespace-nowrap">콘텐츠명</TableHead>
                    <TableHead className="whitespace-nowrap">콘텐츠 ID</TableHead>
                    <TableHead className="whitespace-nowrap">선택</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContents.map((content) => {
                    const isSelected = selectedContents.some((item) => item.id === content.id);

                    return (
                      <TableRow key={content.id}>
                        <TableCell className="whitespace-nowrap"><Badge variant="slate">{content.type}</Badge></TableCell>
                        <TableCell className="min-w-[260px] font-semibold text-slate-800">{content.title}</TableCell>
                        <TableCell className="whitespace-nowrap text-slate-500">{content.id}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <Button type="button" size="sm" variant={isSelected ? "secondary" : "outline"} onClick={() => toggleContent(content)}>
                            {isSelected ? "선택 해제" : "선택"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredContents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-sm font-medium text-slate-500">
                        검색 결과가 없습니다. 다른 코스명 또는 패키지명을 입력해주세요.
                      </TableCell>
                    </TableRow>
                  ) : null}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4">
            <h4 className="font-bold text-slate-900">선택된 대상 콘텐츠</h4>
            {selectedContents.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedContents.map((content) => (
                  <Badge key={content.id} variant="default" className="whitespace-nowrap">
                    {content.type}: {content.title}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm font-medium text-slate-500">아직 선택된 대상 콘텐츠가 없습니다.</p>
            )}
          </div>
        </CardContent>
      </Card>

      <TrialMemberManager
        title="참여 회원"
        description="생성 화면에서도 회원 검색 추가와 CSV 업로드로 참여 회원을 미리 추가할 수 있습니다."
        grantedContent={selectedContents}
        mode="preview"
      />
    </>
  );
}

function MemberSearchPanel({
  addedIds,
  onAdd,
  onClose,
}: {
  addedIds: Set<string>;
  onAdd: (members: SearchableMember[]) => void;
  onClose: () => void;
}) {
  const [filters, setFilters] = useState({ name: "", email: "", phone: "", userId: "" });
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredMembers = mockMembers.filter((member) => {
    return (
      member.name.includes(filters.name) &&
      member.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      member.phone.includes(filters.phone) &&
      member.userId.toLowerCase().includes(filters.userId.toLowerCase())
    );
  });

  const selectedMembers = mockMembers.filter((member) => selectedIds.includes(member.id) && !addedIds.has(member.id));

  const toggleMember = (member: SearchableMember) => {
    if (addedIds.has(member.id)) return;
    setSelectedIds((current) => (current.includes(member.id) ? current.filter((id) => id !== member.id) : [...current, member.id]));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-900">회원 검색 추가</h4>
          <p className="text-sm text-slate-500">이름, 이메일, 전화번호, User ID로 회원을 검색한 뒤 선택 회원을 추가합니다.</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /> 닫기</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {[
          ["name", "이름"],
          ["email", "이메일"],
          ["phone", "전화번호"],
          ["userId", "User ID"],
        ].map(([key, label]) => (
          <label key={key} className="space-y-1 text-sm font-semibold text-slate-700">
            {label}
            <input
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-primary"
              value={filters[key as keyof typeof filters]}
              onChange={(event) => setFilters((current) => ({ ...current, [key]: event.target.value }))}
              placeholder={`${label} 검색`}
            />
          </label>
        ))}
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">선택</TableHead>
              <TableHead className="whitespace-nowrap">이름</TableHead>
              <TableHead className="whitespace-nowrap">이메일</TableHead>
              <TableHead className="whitespace-nowrap">전화번호</TableHead>
              <TableHead className="whitespace-nowrap">User ID</TableHead>
              <TableHead className="whitespace-nowrap">회원 상태</TableHead>
              <TableHead className="whitespace-nowrap">이미 추가됨 여부</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const isAdded = addedIds.has(member.id);
              const isSelected = selectedIds.includes(member.id);
              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <Button type="button" size="sm" variant={isSelected ? "secondary" : "outline"} disabled={isAdded} onClick={() => toggleMember(member)}>
                      {isSelected ? "선택 해제" : "선택"}
                    </Button>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold">{member.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{member.email}</TableCell>
                  <TableCell className="whitespace-nowrap">{member.phone}</TableCell>
                  <TableCell className="whitespace-nowrap">{member.userId}</TableCell>
                  <TableCell><Badge variant={statusVariant(member.memberStatus)}>{member.memberStatus}</Badge></TableCell>
                  <TableCell><Badge variant={isAdded ? "slate" : "success"}>{isAdded ? "이미 추가됨" : "추가 가능"}</Badge></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>취소</Button>
        <Button type="button" disabled={selectedMembers.length === 0} onClick={() => onAdd(selectedMembers)}>
          <Check className="h-4 w-4" /> 선택 회원 추가 ({selectedMembers.length})
        </Button>
      </div>
    </div>
  );
}

function CsvUploadPanel({
  addedIds,
  onAdd,
  onClose,
}: {
  addedIds: Set<string>;
  onAdd: (members: SearchableMember[]) => void;
  onClose: () => void;
}) {
  const previewRows: CsvPreviewMember[] = csvPreviewRows.map((row) =>
    addedIds.has(row.id) ? { ...row, validationResult: "이미 추가됨", processStatus: "추가 제외" } : row,
  );
  const validRows = previewRows.filter((row) => row.validationResult === "추가 가능" && !addedIds.has(row.id));

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-900">CSV 업로드</h4>
          <p className="text-sm text-slate-500">CSV 컬럼 예시: email, phone, name, userId. 업로드 후 mock 검증 결과를 미리 확인합니다.</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /> 닫기</Button>
      </div>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
        <Upload className="mx-auto h-8 w-8 text-slate-400" />
        <p className="mt-2 font-semibold text-slate-800">CSV 파일을 여기에 드래그하거나 업로드 버튼을 눌러주세요.</p>
        <p className="mt-1 text-sm text-slate-500">실제 파일 처리는 연결하지 않고 mock preview를 표시합니다.</p>
      </div>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-100 bg-white">
        <Table className="min-w-[1040px]">
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">이름</TableHead>
              <TableHead className="whitespace-nowrap">이메일</TableHead>
              <TableHead className="whitespace-nowrap">전화번호</TableHead>
              <TableHead className="whitespace-nowrap">User ID</TableHead>
              <TableHead className="whitespace-nowrap">검증 결과</TableHead>
              <TableHead className="whitespace-nowrap">처리 상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {previewRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="whitespace-nowrap font-semibold">{row.name}</TableCell>
                <TableCell className="whitespace-nowrap">{row.email}</TableCell>
                <TableCell className="whitespace-nowrap">{row.phone}</TableCell>
                <TableCell className="whitespace-nowrap">{row.userId}</TableCell>
                <TableCell><Badge variant={statusVariant(row.validationResult)}>{row.validationResult}</Badge></TableCell>
                <TableCell><Badge variant={statusVariant(row.processStatus)}>{row.processStatus}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>전체 취소</Button>
        <Button type="button" disabled={validRows.length === 0} onClick={() => onAdd(validRows)}>
          유효한 회원만 추가 ({validRows.length})
        </Button>
      </div>
    </div>
  );
}

function MemberTable({
  members,
  mode,
}: {
  members: TrialMember[];
  mode: "preview" | "detail";
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm font-medium text-slate-500">
        아직 추가된 참여 회원이 없습니다. 회원 검색 추가 또는 CSV 업로드로 미리 추가해보세요.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100">
      <Table className="min-w-[980px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">이름</TableHead>
            <TableHead className="whitespace-nowrap">이메일</TableHead>
            <TableHead className="whitespace-nowrap">User ID</TableHead>
            <TableHead className="whitespace-nowrap">현재 부여된 콘텐츠</TableHead>
            <TableHead className="whitespace-nowrap">시작일</TableHead>
            <TableHead className="whitespace-nowrap">종료일</TableHead>
            <TableHead className="whitespace-nowrap">추가 방식</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="whitespace-nowrap font-semibold">{member.name}</TableCell>
              <TableCell className="whitespace-nowrap">{member.email}</TableCell>
              <TableCell className="whitespace-nowrap">
                <Link href={`/members/${member.userId}`} className="font-semibold text-primary underline-offset-4 hover:underline">
                  {member.userId}
                </Link>
              </TableCell>
              <TableCell className="min-w-[260px] text-sm text-slate-600">{contentText(member.grantedContent)}</TableCell>
              <TableCell className="whitespace-nowrap">{member.startDate}</TableCell>
              <TableCell className="whitespace-nowrap">{member.endDate}</TableCell>
              <TableCell className="whitespace-nowrap"><Badge variant="slate">{member.addMethod}</Badge></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {mode === "preview" ? (
        <p className="border-t border-slate-100 px-4 py-3 text-xs font-medium text-slate-500">
          저장 전 preview 목록입니다. User ID 링크는 mock 유저 상세 경로로 이동합니다.
        </p>
      ) : null}
    </div>
  );
}

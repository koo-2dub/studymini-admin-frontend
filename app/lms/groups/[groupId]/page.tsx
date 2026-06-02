import { ArrowLeft, CalendarClock, Clock, FileDown, FileUp, Pencil, Plus, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getGroupStatusTone, getGroupTypeTone, lmsGroups, type LmsGroup } from "../data";

export function generateStaticParams() {
  return lmsGroups.map((group) => ({ groupId: group.id }));
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof CalendarClock; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getExpirationSummary(group: LmsGroup) {
  return {
    endingSoonUsers: group.users.filter((user) => user.learningStatus !== "만료" && user.endedAt <= "2026-06-21").length,
    expiredUsers: group.users.filter((user) => user.learningStatus === "만료").length,
  };
}

export default async function GroupDetailPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const group = lmsGroups.find((item) => item.id === groupId);

  if (!group) notFound();

  const expirationSummary = getExpirationSummary(group);

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="그룹 상세"
        description="기간제 그룹의 기본 정보, 제공 수업, 참여 유저와 만료 상태를 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/lms/groups"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Link>
            <button
              type="button"
              disabled
              className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60"
              title="그룹 수정 기능은 준비 중입니다."
            >
              <Pencil className="h-4 w-4" />
              그룹 수정
            </button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <InfoCard icon={UserRound} label="그룹명" value={group.groupName} />
        <Card>
          <CardContent className="flex h-full items-center justify-between gap-3 p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">유형</p>
              <div className="mt-2">
                <Badge variant={getGroupTypeTone(group.type)}>{group.type}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">상태</p>
              <div className="mt-2">
                <Badge variant={getGroupStatusTone(group.status)}>{group.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <InfoCard icon={CalendarClock} label="운영 기간" value={`${group.startedAt} ~ ${group.endedAt}`} />
        <InfoCard icon={ShieldCheck} label="자동 만료" value={group.autoExpire ? "ON" : "OFF"} />
      </section>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>그룹의 기간제 수강 권한과 자동 만료 설정을 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-bold text-slate-500">그룹명</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{group.groupName}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">그룹 유형</p>
                <div className="mt-2"><Badge variant={getGroupTypeTone(group.type)}>{group.type}</Badge></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">시작일</p>
                <p className="mt-2 font-bold text-slate-900">{group.startedAt}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">종료일</p>
                <p className="mt-2 font-bold text-slate-900">{group.endedAt}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">상태</p>
                <div className="mt-2"><Badge variant={getGroupStatusTone(group.status)}>{group.status}</Badge></div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">자동 만료 여부</p>
                <div className="mt-2"><Badge variant={group.autoExpire ? "success" : "slate"}>{group.autoExpire ? "ON" : "OFF"}</Badge></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">설명</p>
              <p className="mt-2 rounded-2xl bg-slate-50 p-5 leading-7 text-slate-700">{group.description}</p>
            </div>
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 text-sm font-semibold leading-6 text-amber-800">
              종료일이 지나면 참여 유저는 해당 그룹의 수업 접근 권한을 잃습니다.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>제공 수업</CardTitle>
                <CardDescription>그룹 참여자에게 기간제로 제공되는 수업 목록입니다.</CardDescription>
              </div>
              <Button type="button" disabled className="cursor-not-allowed opacity-60">
                <Plus className="mr-2 h-4 w-4" />
                수업 추가
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>수업명</TableHead>
                  <TableHead>언어</TableHead>
                  <TableHead>코스</TableHead>
                  <TableHead>공개상태</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.classes.map((courseClass) => (
                  <TableRow key={courseClass.id}>
                    <TableCell className="min-w-40 font-bold text-slate-900">{courseClass.className}</TableCell>
                    <TableCell>{courseClass.language}</TableCell>
                    <TableCell>{courseClass.course}</TableCell>
                    <TableCell><Badge variant={courseClass.visibility === "공개" ? "success" : "slate"}>{courseClass.visibility}</Badge></TableCell>
                    <TableCell>
                      <Button type="button" variant="outline" disabled className="cursor-not-allowed opacity-60">제거</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>참여 유저</CardTitle>
                <CardDescription>User ID 또는 이름을 클릭하면 기존 유저 상세 화면으로 이동합니다.</CardDescription>
              </div>
              <Button type="button" disabled className="cursor-not-allowed opacity-60">
                <Plus className="mr-2 h-4 w-4" />
                유저 추가
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
                  <TableHead>수강 상태</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>유저 상세 보기</TableHead>
                  <TableHead>관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="min-w-28 p-0 font-bold text-slate-900">
                      <Link href={`/members/${user.id}`} className="block px-4 py-3">{user.name}</Link>
                    </TableCell>
                    <TableCell className="p-0 font-semibold text-primary">
                      <Link href={`/members/${user.id}`} className="block px-4 py-3">{user.userId}</Link>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.learningStatus === "만료" ? "slate" : user.learningStatus === "수강중" ? "success" : "warning"}>
                        {user.learningStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.startedAt}</TableCell>
                    <TableCell>{user.endedAt}</TableCell>
                    <TableCell>
                      <Link href={`/members/${user.id}`} className="font-bold text-primary hover:underline">상세 보기</Link>
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="outline" disabled className="cursor-not-allowed opacity-60">제거</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileUp className="h-5 w-5 text-indigo-500" />
              <CardTitle>CSV 유저 업로드</CardTitle>
            </div>
            <CardDescription>CSV 업로드와 사전 검증 결과를 mock 상태로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <FileUp className="mx-auto h-10 w-10 text-slate-400" />
              <p className="mt-3 text-lg font-black text-slate-900">CSV 파일을 업로드하세요</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">mock 영역입니다. 실제 업로드는 아직 연결되지 않았습니다.</p>
              <Button type="button" variant="outline" disabled className="mt-4 cursor-not-allowed opacity-60">파일 선택</Button>
            </div>
            <Button type="button" variant="outline" disabled className="cursor-not-allowed opacity-60">
              <FileDown className="mr-2 h-4 w-4" />
              샘플 CSV 다운로드
            </Button>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>행</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>검증 결과</TableHead>
                    <TableHead>메시지</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.csvValidationRows.map((row) => (
                    <TableRow key={`${row.row}-${row.userId}`}>
                      <TableCell>{row.row}</TableCell>
                      <TableCell className="font-bold text-slate-900">{row.name}</TableCell>
                      <TableCell>{row.userId}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell><Badge variant={row.result === "정상" ? "success" : "warning"}>{row.result}</Badge></TableCell>
                      <TableCell>{row.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-500" />
              <CardTitle>만료 관리</CardTitle>
            </div>
            <CardDescription>종료 예정 및 만료된 유저와 자동 만료 상태를 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">종료 예정 유저</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{expirationSummary.endingSoonUsers}명</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">만료된 유저</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{expirationSummary.expiredUsers}명</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">자동 만료 ON/OFF 상태</p>
              <div className="mt-3"><Badge variant={group.autoExpire ? "success" : "slate"}>{group.autoExpire ? "ON" : "OFF"}</Badge></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>처리 로그</CardTitle>
            <CardDescription>그룹 생성, 유저 추가, 수업 추가, 자동 만료 처리 이력을 mock log로 표시합니다.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>일시</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>내용</TableHead>
                  <TableHead>처리자</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group.logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="min-w-36 font-semibold text-slate-700">{log.createdAt}</TableCell>
                    <TableCell><Badge variant={log.type === "자동 만료 처리" ? "warning" : "default"}>{log.type}</Badge></TableCell>
                    <TableCell className="min-w-72 text-slate-700">{log.message}</TableCell>
                    <TableCell>{log.operator}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

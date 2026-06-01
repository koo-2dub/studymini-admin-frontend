import { Send, UserRoundCheck } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generalInquiries } from "@/lib/mock-data";

const statusVariants: Record<string, "success" | "warning" | "slate"> = {
  "답변 완료": "success",
  "처리 중": "warning",
  "답변 대기": "slate",
};

export default function InquiriesPage() {
  const selectedInquiry = generalInquiries[0];
  const latestAnswer = selectedInquiry.answers.at(-1);
  const currentWriter = latestAnswer?.author ?? "김운영";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Support desk"
        title="General inquiries"
        description="Triage member questions, billing issues, and platform support requests."
      />

      <Card>
        <CardHeader>
          <CardTitle>Inquiry queue</CardTitle>
          <CardDescription>일반 문의 목록입니다. 제목과 내용은 2줄까지만 표시하고 좁은 화면에서는 가로 스크롤됩니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1180px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[56px]">선택</TableHead>
                <TableHead className="w-[120px]">유저</TableHead>
                <TableHead className="w-[220px]">이메일</TableHead>
                <TableHead className="w-[190px]">제목</TableHead>
                <TableHead className="w-[260px]">내용 미리보기</TableHead>
                <TableHead className="w-[120px]">답변상태</TableHead>
                <TableHead className="w-[110px]">담당자</TableHead>
                <TableHead className="w-[110px]">문의일</TableHead>
                <TableHead className="w-[110px]">답변일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generalInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <input type="checkbox" aria-label={`${inquiry.id} 선택`} className="h-4 w-4 rounded border-slate-300" />
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold text-slate-900">{inquiry.user}</TableCell>
                  <TableCell className="whitespace-nowrap text-slate-600">{inquiry.email}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2 font-semibold leading-5 text-slate-900">{inquiry.title}</span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 leading-5 text-slate-600">{inquiry.preview}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="min-w-[86px] justify-center whitespace-nowrap" variant={statusVariants[inquiry.answerStatus]}>
                      {inquiry.answerStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-slate-700">{inquiry.manager}</TableCell>
                  <TableCell>
                    <span className="line-clamp-2 leading-5 text-slate-600">{inquiry.createdAt}</span>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-2 leading-5 text-slate-600">{inquiry.answeredAt}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{selectedInquiry.title}</CardTitle>
          <CardDescription>
            {selectedInquiry.user} · {selectedInquiry.email} · 담당자: {selectedInquiry.manager}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="space-y-4">
            <div className="rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {selectedInquiry.body}
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900">답변 이력</h3>
              {selectedInquiry.answers.map((answer) => (
                <div key={answer.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <UserRoundCheck className="h-4 w-4" />
                    <span className="font-semibold text-slate-700">작성자: {answer.author}</span>
                    <span>{answer.createdAt}</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{answer.content}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900">답변 작성</h3>
                <p className="text-sm text-slate-500">작성자: {currentWriter}</p>
              </div>
              <Badge className="whitespace-nowrap" variant="warning">처리자 표시</Badge>
            </div>
            <textarea
              className="min-h-[180px] w-full rounded-2xl border border-white bg-white/90 p-4 text-sm leading-6 outline-none ring-indigo-200 transition focus:ring-2"
              defaultValue="확인해주셔서 감사합니다. 요청하신 내용은 처리 후 다시 안내드리겠습니다."
              aria-label="일반 문의 답변"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm"><Send className="h-4 w-4" />답변 저장</Button>
              <Button size="sm" variant="outline">답변 완료 처리</Button>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}

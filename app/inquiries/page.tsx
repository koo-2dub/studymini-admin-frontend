import { Clock3, Mail, MessageSquareText, StickyNote } from "lucide-react";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inquiries } from "@/lib/mock-data";

const inquiry = inquiries[0];

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
      {label}
      <select className="h-10 rounded-xl border border-border bg-white/80 px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" defaultValue={value}>
        <option>{value}</option>
      </select>
    </label>
  );
}

export default function InquiriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="General inquiries"
        description="Triage member questions, billing issues, and platform support requests."
      />

      <section className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Advanced filters</CardTitle>
            <CardDescription>PR24 filter set is preserved for multi-condition support desk searching.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-[1.4fr_repeat(4,1fr)]">
              <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Search
                <input
                  className="h-10 rounded-xl border border-border bg-white/80 px-3 text-sm font-semibold normal-case tracking-normal text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  defaultValue="invoice, access, cancellation"
                />
              </label>
              <FilterSelect label="Channel" value="All channels" />
              <FilterSelect label="Owner" value="Unassigned + mine" />
              <FilterSelect label="SLA" value="Due within 24h" />
              <FilterSelect label="Received" value="Last 30 days" />
            </div>
            <div className="flex flex-wrap gap-2">
              {inquiry.tags.map((tag) => <Badge key={tag} variant="default">{tag}</Badge>)}
              <Badge variant="warning">Needs Korean reply</Badge>
              <Badge variant="slate">Has member history</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry queue</CardTitle>
              <CardDescription>PR23 queue layout with full triage context, not a simplified table.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {inquiries.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">{item.id}</p>
                      <h3 className="mt-1 font-bold text-slate-950">{item.subject}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.preview}</p>
                    </div>
                    <Badge variant={item.status === "Answered" ? "success" : item.priority === "High" ? "warning" : "slate"}>{item.status}</Badge>
                  </div>
                  <div className="mt-4 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-2">
                    <span>Requester: {item.requester}</span>
                    <span>Priority: {item.priority}</span>
                    <span>Assignee: {item.assignee}</span>
                    <span>Last activity: {item.lastActivity}</span>
                  </div>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{inquiry.subject}</CardTitle>
                  <CardDescription>{inquiry.id} · {inquiry.requester} · {inquiry.email}</CardDescription>
                </div>
                <Badge variant="warning">{inquiry.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><Mail className="size-4" /> 문의 내용 전체</div>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{inquiry.body}</p>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900"><MessageSquareText className="size-4" /> 답변 작성</div>
                <textarea
                  className="min-h-40 w-full rounded-2xl border border-border bg-white/90 p-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  defaultValue={inquiry.draftAnswer}
                />
                <div className="flex flex-wrap gap-2">
                  <Button>답변 저장</Button>
                  <Button variant="secondary">답변 완료 처리</Button>
                </div>
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-900"><Clock3 className="size-4" /> 답변 이력</div>
                <div className="space-y-3">
                  {inquiry.answerHistory.map((answer) => (
                    <div key={answer.at} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                      <div className="flex flex-wrap justify-between gap-2 text-xs font-bold text-muted-foreground">
                        <span>{answer.author}</span>
                        <span>{answer.at}</span>
                      </div>
                      <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-700">{answer.message}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <div className="flex items-center gap-2 text-sm font-bold text-amber-900"><StickyNote className="size-4" /> 관리자 메모</div>
                <textarea className="mt-3 min-h-24 w-full rounded-xl border border-amber-200 bg-white/80 p-3 text-sm leading-6 outline-none" defaultValue={inquiry.adminMemo} />
              </section>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

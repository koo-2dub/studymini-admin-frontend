import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { StatusBadge } from "@/components/dashboard/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { inquiries } from "@/lib/mock-data";

export function generateStaticParams() {
  return inquiries.map((inquiry) => ({ id: inquiry.id }));
}

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = inquiries.find((item) => item.id === id);
  if (!inquiry) notFound();

  return (
    <>
      <PageHeader eyebrow="Support desk" title={inquiry.subject} description={`${inquiry.id} · General inquiry detail and response workspace.`} />
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inquiry content</CardTitle>
              <CardDescription>Full member message and ticket metadata.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-sm text-slate-600">
              <div className="flex flex-wrap gap-2">
                <StatusBadge value={inquiry.status} />
                <Badge variant="warning">{inquiry.priority} priority</Badge>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</p>
                <p className="mt-1 text-base font-semibold text-slate-950">{inquiry.subject}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</p>
                <p className="mt-2 rounded-2xl bg-slate-50 p-4 leading-7">
                  I need help with this request as soon as possible. Please review my account history, confirm the next steps, and let me know if any additional information is required from my side.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer editor</CardTitle>
              <CardDescription>Draft and send the admin response.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea className="min-h-40 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none ring-indigo-100 transition focus:ring-4" defaultValue="Hello, thank you for contacting StudyMini support. We reviewed your request and will help you complete the next step." />
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline">Save draft</Button>
                <Button>Send answer</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User info</CardTitle>
              <CardDescription>Requester profile for this inquiry.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p><span className="font-semibold text-slate-950">Name:</span> {inquiry.requester}</p>
              <p><span className="font-semibold text-slate-950">Ticket:</span> {inquiry.id}</p>
              <p><span className="font-semibold text-slate-950">Contact:</span> {inquiry.requester.toLowerCase().replaceAll(" ", ".")}@example.com</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Answer history</CardTitle>
              <CardDescription>Previous admin activity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <p className="rounded-2xl bg-slate-50 p-4">Support note created and ticket priority reviewed.</p>
              <p className="rounded-2xl bg-slate-50 p-4">Initial assignment added to the support queue.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin memo</CardTitle>
              <CardDescription>Internal memo for support operators.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none ring-indigo-100 transition focus:ring-4" defaultValue="Check payment and lesson access records before closing." />
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline">Close ticket</Button>
                <Button>Update memo</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

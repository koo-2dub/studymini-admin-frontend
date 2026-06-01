import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { inquiries } from "@/lib/mock-data";

const twoLineClass = "min-w-0 overflow-hidden break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]";

export default function InquiriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Support desk"
        title="General inquiries"
        description="Triage member questions, billing issues, and platform support requests."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Use the existing inquiry filters to narrow the queue.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {[
            "Status: All",
            "Priority: All",
            "Category: All",
            "Date: Last 30 days",
          ].map((filter) => (
            <Button key={filter} variant="outline" className="justify-start bg-white/80">
              {filter}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Inquiry queue</CardTitle>
          <CardDescription>Click a row to open the full general inquiry detail page.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[920px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Ticket</TableHead>
                <TableHead className="w-56">Subject</TableHead>
                <TableHead className="w-[22rem]">Content preview</TableHead>
                <TableHead className="w-40">Requester</TableHead>
                <TableHead className="w-28">Priority</TableHead>
                <TableHead className="w-32">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries.map((inquiry) => {
                const href = `/inquiries/${inquiry.id}`;

                return (
                  <TableRow key={inquiry.id} className="cursor-pointer">
                    <TableCell><Link href={href} className="block font-semibold text-primary">{inquiry.id}</Link></TableCell>
                    <TableCell><Link href={href} className={`${twoLineClass} font-medium text-slate-900`}>{inquiry.subject}</Link></TableCell>
                    <TableCell><Link href={href} className={`${twoLineClass} text-muted-foreground`}>{inquiry.content}</Link></TableCell>
                    <TableCell><Link href={href} className="block text-slate-700">{inquiry.requester}</Link></TableCell>
                    <TableCell><Link href={href} className="block">{inquiry.priority}</Link></TableCell>
                    <TableCell><Link href={href} className="block"><StatusBadge value={inquiry.status} /></Link></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

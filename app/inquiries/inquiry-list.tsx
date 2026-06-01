"use client";

import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/dashboard/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { inquiries } from "@/lib/mock-data";

type Inquiry = (typeof inquiries)[number];

export function InquiryList({ data }: { data: Inquiry[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inquiry queue</CardTitle>
        <CardDescription>Mock general support tickets grouped by urgency.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="cursor-pointer"
                tabIndex={0}
                onClick={() => router.push(`/inquiries/${inquiry.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/inquiries/${inquiry.id}`);
                  }
                }}
              >
                <TableCell className="font-semibold text-indigo-700">{inquiry.id}</TableCell>
                <TableCell>{inquiry.subject}</TableCell>
                <TableCell>{inquiry.requester}</TableCell>
                <TableCell>{inquiry.priority}</TableCell>
                <TableCell><StatusBadge value={inquiry.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/dashboard/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { lessonQuestions } from "@/lib/mock-data";

type LessonQuestion = (typeof lessonQuestions)[number];

export function LessonQuestionList({ data }: { data: LessonQuestion[] }) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question queue</CardTitle>
        <CardDescription>Mock content help requests from students.</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Lesson</TableHead>
              <TableHead>Member</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((question) => (
              <TableRow
                key={question.id}
                className="cursor-pointer"
                tabIndex={0}
                onClick={() => router.push(`/lesson-questions/${question.id}`)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    router.push(`/lesson-questions/${question.id}`);
                  }
                }}
              >
                <TableCell className="font-semibold text-indigo-700">{question.id}</TableCell>
                <TableCell>{question.lesson}</TableCell>
                <TableCell>{question.member}</TableCell>
                <TableCell>{question.age}</TableCell>
                <TableCell><StatusBadge value={question.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

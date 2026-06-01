import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/data-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { lessonQuestions } from "@/lib/mock-data";

const twoLineClass = "min-w-0 overflow-hidden break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]";

export default function LessonQuestionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Academic support"
        title="Lesson questions"
        description="Route learner lesson questions to teachers and monitor response freshness."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Use the existing lesson question filters to narrow the queue.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-4">
            {[
              "Status: All",
              "Course: All",
              "Teacher: All",
              "Date: Last 30 days",
            ].map((filter) => (
              <Button key={filter} variant="outline" className="justify-start bg-white/80">
                {filter}
              </Button>
            ))}
          </CardContent>
        </Card>
        <Button asChild variant="secondary" className="self-start"><Link href="/lesson-questions/trash">Trash list</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Question queue</CardTitle>
          <CardDescription>Click a row to open the full lesson question detail page.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[980px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-48">Member</TableHead>
                <TableHead className="w-72">Lesson information</TableHead>
                <TableHead className="w-[26rem]">Question preview</TableHead>
                <TableHead className="w-36">Inquiry date</TableHead>
                <TableHead className="w-40">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessonQuestions.map((question) => {
                const href = `/lesson-questions/${question.id}`;

                return (
                  <TableRow key={question.id} className="cursor-pointer">
                    <TableCell>
                      <Link href={`/members/${question.user.id}`} className="block font-semibold text-primary">{question.member}</Link>
                    </TableCell>
                    <TableCell><Link href={href} className={`${twoLineClass} text-slate-800`}>{question.lesson.title}</Link></TableCell>
                    <TableCell><Link href={href} className={`${twoLineClass} text-muted-foreground`}>{question.question}</Link></TableCell>
                    <TableCell><Link href={href} className={`${twoLineClass} text-slate-700`}>{question.createdAt}</Link></TableCell>
                    <TableCell><Link href={href} className="block"><StatusBadge value={question.status} /></Link></TableCell>
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

import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deletedLessonQuestions } from "@/lib/mock-data";

const twoLineClass = "min-w-0 overflow-hidden break-words [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]";

export default function LessonQuestionTrashPage() {
  return (
    <>
      <PageHeader
        eyebrow="Lesson question trash"
        title="Trash list"
        description="Review deleted lesson questions, restore them, or permanently delete records."
      />

      <div className="mb-6">
        <Button asChild variant="outline"><Link href="/lesson-questions">Back to lesson questions</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deleted questions</CardTitle>
          <CardDescription>Permanent deletion cannot be restored.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[920px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Question</TableHead>
                <TableHead className="w-44">Member</TableHead>
                <TableHead className="w-[24rem]">Deleted question preview</TableHead>
                <TableHead className="w-40">Deleted at</TableHead>
                <TableHead className="w-44">Deleted by</TableHead>
                <TableHead className="w-52">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedLessonQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-semibold text-slate-900">{question.id}</TableCell>
                  <TableCell>{question.member}</TableCell>
                  <TableCell><div className={`${twoLineClass} text-muted-foreground`}>{question.question}</div></TableCell>
                  <TableCell>{question.deletedAt}</TableCell>
                  <TableCell>{question.deletedBy}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="secondary">Restore</Button>
                      <Button size="sm" variant="outline">Delete permanently</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

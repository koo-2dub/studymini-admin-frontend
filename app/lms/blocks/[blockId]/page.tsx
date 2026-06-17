import { ArrowLeft, CalendarDays, FileText, Languages, Link2, Network, Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { getBlockUsedLessonCount, lessons } from "../../lessons/data";
import { BlockPreview } from "../block-preview";
import { blocks, type BlockType } from "../data";

export function generateStaticParams() {
  return blocks.map((block) => ({ blockId: block.id }));
}

function InfoCard({ icon: Icon, label, value }: { icon: typeof Languages; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex h-full items-start gap-3 p-5">
        <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
          <p className="mt-1 font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BlockTypeBadge({ type }: { type: BlockType }) {
  const variant = type === "영상" ? "default" : type === "오디오" ? "success" : "warning";
  return <Badge variant={variant}>{type}</Badge>;
}

export default async function BlockDetailPage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = await params;
  const block = blocks.find((item) => item.id === blockId);

  if (!block) notFound();

  const usedLessons = lessons.filter((lesson) => lesson.blockIds.includes(block.id));

  return (
    <>
      <PageHeader
        eyebrow="LMS management"
        title="블록 상세"
        description="블록 유형에 따라 실제 재생 또는 링크 이동을 확인합니다."
        action={
          <div className="flex flex-wrap gap-2">
            <Link href="/lms/blocks" className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition-all hover:bg-secondary/80">
              <ArrowLeft className="h-4 w-4" />
              목록으로
            </Link>
            <button type="button" disabled className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground opacity-60" title="블록 수정 기능은 후속 PR에서 구현 예정입니다.">
              <Pencil className="h-4 w-4" />
              블록 수정
            </button>
          </div>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <InfoCard icon={Languages} label="언어" value={block.language} />
        <InfoCard icon={Link2} label="블록 유형" value={block.type} />
        <InfoCard icon={Network} label="사용 중인 레슨 수" value={`${getBlockUsedLessonCount(block.id)}개`} />
        <InfoCard icon={CalendarDays} label="수정일" value={block.updatedAt} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              <CardTitle>{block.blockName}</CardTitle>
            </div>
            <CardDescription>{block.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <BlockTypeBadge type={block.type} />
              <Badge variant="slate">{block.language}</Badge>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">미디어 URL 또는 링크</p>
              <p className="mt-2 break-all rounded-2xl bg-slate-50 p-4 font-mono text-sm text-slate-700">{block.mediaUrl}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>미리보기</CardTitle>
            <CardDescription>영상은 video player, 오디오는 audio player, 퀴즈 링크는 바로가기 버튼으로 확인합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <BlockPreview block={block} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>사용 중인 레슨</CardTitle>
          <CardDescription>이 블록을 선택한 레슨 목록입니다.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>레슨명</TableHead>
                <TableHead>언어</TableHead>
                <TableHead>수정일</TableHead>
                <TableHead>상세</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usedLessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell className="font-bold text-slate-900">{lesson.lessonName}</TableCell>
                  <TableCell>{lesson.language}</TableCell>
                  <TableCell>{lesson.updatedAt}</TableCell>
                  <TableCell><Link href={`/lms/lessons/${lesson.id}`} className="font-bold text-primary hover:underline">레슨 상세</Link></TableCell>
                </TableRow>
              ))}
              {usedLessons.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center font-semibold text-slate-500">아직 이 블록을 사용하는 레슨이 없습니다.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}

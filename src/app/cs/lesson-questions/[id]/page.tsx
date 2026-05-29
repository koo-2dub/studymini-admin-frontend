import Link from "next/link";
import { AppShell } from "@/components/admin/app-shell";
import { EditorPanel } from "@/components/admin/feature-panels";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { lessonQuestions } from "@/lib/mock-data";
export default async function LessonQuestionDetailPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; const item = lessonQuestions.find((q) => q.id === id) ?? lessonQuestions[0]; return <AppShell><PageHeader title={`${item.id} 학습 질문 상세`} description="언어, 코스, 레슨 정보를 LMS 상세로 연결하고 답변 이력을 표시합니다." primaryAction="학습 답변 발송" /><Card className="mb-6"><CardHeader><CardTitle>{item.course} · {item.lesson}</CardTitle></CardHeader><CardContent className="grid gap-4 md:grid-cols-5"><Info label="사용자" value={item.user} /><Info label="언어" value={item.language} /><Info label="코스" value={item.course} /><Info label="레슨" value={item.lesson} /><Info label="상태" value={<StatusBadge value={item.status} />} /><div className="md:col-span-5 rounded-2xl bg-slate-50 p-4 text-sm">{item.preview}</div><Button asChild variant="outline"><Link href="/lms/courses/C-SP-101">코스 상세로 이동</Link></Button></CardContent></Card><EditorPanel title="학습 답변 작성" /><Card className="mt-6"><CardHeader><CardTitle>답변 히스토리</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{item.assignee} 튜터/관리자 답변 기록이 표시됩니다.</CardContent></Card></AppShell>; }
function Info({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs text-muted-foreground">{label}</p><div className="mt-1 font-bold">{value}</div></div>; }

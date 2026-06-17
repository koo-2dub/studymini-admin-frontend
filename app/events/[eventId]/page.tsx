import Link from "next/link";

import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EventForm } from "../event-form";
import { getEventById } from "../data";

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const event = getEventById(eventId);

  if (!event) {
    return (
      <>
        <PageHeader eyebrow="Marketing" title="이벤트를 찾을 수 없습니다" description="요청한 이벤트 ID와 일치하는 mock data가 없습니다." />
        <Card>
          <CardHeader>
            <CardTitle>존재하지 않는 이벤트</CardTitle>
            <CardDescription>이벤트 목록에서 다시 상세 화면으로 이동해주세요.</CardDescription>
          </CardHeader>
          <CardContent><Button asChild><Link href="/events">이벤트 목록으로</Link></Button></CardContent>
        </Card>
      </>
    );
  }

  return <EventForm mode="edit" event={event} />;
}

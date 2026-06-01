import { notFound } from "next/navigation";

import { LessonInquiryDetail } from "@/components/dashboard/lesson-inquiry-detail";
import { lessonInquiries } from "@/lib/mock-data";

export function generateStaticParams() {
  return lessonInquiries.map((item) => ({ id: item.inquiryId }));
}

export default async function LessonInquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = lessonInquiries.find((item) => item.inquiryId === id);
  if (!inquiry) notFound();

  return <LessonInquiryDetail inquiry={inquiry} />;
}

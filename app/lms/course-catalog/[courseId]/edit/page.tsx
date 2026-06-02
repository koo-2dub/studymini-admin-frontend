import { notFound } from "next/navigation";

import { lmsCourses } from "../../../_data/catalog";
import { CourseFormPage } from "../../course-form-page";

export function generateStaticParams() {
  return lmsCourses.map((course) => ({ courseId: course.id }));
}

export default async function EditCourseCatalogPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const course = lmsCourses.find((item) => item.id === courseId);

  if (!course) notFound();

  return <CourseFormPage mode="edit" course={course} />;
}

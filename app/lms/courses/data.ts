import { lessons as lmsLessons, type Lesson } from "../lessons/data";

export type CourseVisibility = "공개" | "비공개";

export type CourseLesson = {
  id: string;
  lessonName: string;
  visibility: CourseVisibility;
  contentCount: number;
  updatedAt: string;
};

export type CourseClass = {
  id: string;
  language: string;
  course: string;
  className: string;
  visibility: CourseVisibility;
  updatedAt: string;
  lessons: CourseLesson[];
};

function toCourseClassId(lesson: Lesson) {
  return lesson.id.replace(/^LSN-/, "CLS-").replace(/-\d{2}$/, "");
}

function toCourseLesson(lesson: Lesson): CourseLesson {
  return {
    id: lesson.id,
    lessonName: lesson.lessonName,
    visibility: lesson.visibility,
    contentCount: lesson.contents.length,
    updatedAt: lesson.updatedAt,
  };
}

const classKeys = Array.from(
  new Set(lmsLessons.map((lesson) => `${lesson.language}|${lesson.course}|${lesson.className}`)),
);

export const courseClasses: CourseClass[] = classKeys.map((classKey) => {
  const [language, course, className] = classKey.split("|");
  const classLessons = lmsLessons.filter(
    (lesson) => lesson.language === language && lesson.course === course && lesson.className === className,
  );
  const hasPrivateLesson = classLessons.some((lesson) => lesson.visibility === "비공개");
  const latestUpdatedAt = classLessons
    .map((lesson) => lesson.updatedAt)
    .sort((first, second) => second.localeCompare(first))[0];

  return {
    id: toCourseClassId(classLessons[0]),
    language,
    course,
    className,
    visibility: hasPrivateLesson ? "비공개" : "공개",
    updatedAt: latestUpdatedAt,
    lessons: classLessons.map(toCourseLesson),
  };
});

export const courseVisibilityOptions: Array<"전체" | CourseVisibility> = ["전체", "공개", "비공개"];

export const courseFilterOptions = {
  languages: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.language)))],
  courses: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.course)))],
};

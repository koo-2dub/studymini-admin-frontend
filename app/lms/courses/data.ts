import {
  getLessonLinkedClasses,
  hasLessonAudio,
  hasLessonQuiz,
  hasLessonVideo,
  lessons as lmsLessons,
  type Lesson,
  type LessonLinkedClass,
} from "../lessons/data";

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

function getLessonMediaCount(lesson: Lesson) {
  return [hasLessonVideo(lesson), hasLessonAudio(lesson), hasLessonQuiz(lesson)].filter(Boolean).length;
}

function toCourseLesson(lesson: Lesson): CourseLesson {
  return {
    id: lesson.id,
    lessonName: lesson.lessonName,
    visibility: lesson.visibility ?? "공개",
    contentCount: getLessonMediaCount(lesson),
    updatedAt: lesson.updatedAt,
  };
}

const linkedClassRecords = lmsLessons.flatMap((lesson) =>
  getLessonLinkedClasses(lesson).map((linkedClass) => ({ lesson, linkedClass })),
);

const classKeys = Array.from(new Set(linkedClassRecords.map(({ linkedClass }) => linkedClass.id)));

export const courseClasses: CourseClass[] = classKeys.map((classId) => {
  const classRecords = linkedClassRecords.filter(({ linkedClass }) => linkedClass.id === classId);
  const classLessons = classRecords.map(({ lesson }) => lesson);
  const representativeClass: LessonLinkedClass = classRecords[0].linkedClass;
  const hasPrivateLesson = classLessons.some((lesson) => lesson.visibility === "비공개");
  const latestUpdatedAt = classLessons
    .map((lesson) => lesson.updatedAt)
    .sort((first, second) => second.localeCompare(first))[0];

  return {
    id: representativeClass.id,
    language: representativeClass.language,
    course: representativeClass.courseName,
    className: representativeClass.className,
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

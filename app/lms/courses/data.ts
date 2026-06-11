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
  language: string;
  hasVideo: boolean;
  hasAudio: boolean;
  hasQuiz: boolean;
  /** 기존 코스/그룹 mock 화면 호환용 내부 공개 상태입니다. 수업 관리 핵심 정보로는 노출하지 않습니다. */
  visibility: CourseVisibility;
  /** 기존 코스/그룹 mock 화면 호환용 내부 콘텐츠 집계값입니다. */
  contentCount: number;
  updatedAt: string;
};

export type CourseClass = {
  id: string;
  language: string;
  className: string;
  description?: string;
  /** 기존 코스/그룹 mock 집계 호환용 내부 연결값입니다. 수업 목록/상세 핵심 정보로는 노출하지 않습니다. */
  course: string;
  /** 기존 코스/그룹 mock 화면 호환용 내부 공개 상태입니다. 수업 목록/상세 핵심 정보로는 노출하지 않습니다. */
  visibility: CourseVisibility;
  /** 코스 관리 화면에서 기존 연결 관계를 계산하기 위한 내부 참조값입니다. */
  linkedCourseIds: string[];
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
    language: lesson.language,
    hasVideo: hasLessonVideo(lesson),
    hasAudio: hasLessonAudio(lesson),
    hasQuiz: hasLessonQuiz(lesson),
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
  const linkedCourseIds = Array.from(new Set(classRecords.map(({ linkedClass }) => linkedClass.courseId).filter(Boolean)));
  const latestUpdatedAt = classLessons
    .map((lesson) => lesson.updatedAt)
    .sort((first, second) => second.localeCompare(first))[0];

  return {
    id: representativeClass.id,
    language: representativeClass.language,
    className: representativeClass.className,
    description: `${representativeClass.className} 수업은 ${classLessons.length}개의 레슨으로 구성되어 있습니다.`,
    course: representativeClass.courseName,
    visibility: hasPrivateLesson ? "비공개" : "공개",
    linkedCourseIds,
    updatedAt: latestUpdatedAt,
    lessons: classLessons.map(toCourseLesson),
  };
});

export const courseFilterOptions = {
  languages: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.language)))],
};

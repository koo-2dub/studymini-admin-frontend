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
export type ClassQuizStatus = "사용" | "미사용";

export type CourseLesson = {
  id: string;
  lessonName: string;
  language: string;
  blockCount: number;
  hasVideo: boolean;
  hasAudio: boolean;
  hasQuiz: boolean;
  /** 기존 코스/그룹 mock 화면 호환용 내부 공개 상태입니다. 수업 관리 핵심 정보로는 노출하지 않습니다. */
  visibility: CourseVisibility;
  /** 기존 코스/그룹 mock 화면 호환용 내부 콘텐츠 집계값입니다. */
  contentCount: number;
  updatedAt: string;
};

export type CourseSection = {
  id: string;
  sectionName: string;
  lessons: CourseLesson[];
};

export type CourseClass = {
  id: string;
  language: string;
  className: string;
  description?: string;
  classQuizStatus: ClassQuizStatus;
  /** 기존 코스/그룹 mock 집계 호환용 내부 연결값입니다. 수업 목록/상세 핵심 정보로는 노출하지 않습니다. */
  course: string;
  /** 기존 코스/그룹 mock 화면 호환용 내부 공개 상태입니다. 수업 목록/상세 핵심 정보로는 노출하지 않습니다. */
  visibility: CourseVisibility;
  /** 코스 관리 화면에서 기존 연결 관계를 계산하기 위한 내부 참조값입니다. */
  linkedCourseIds: string[];
  updatedAt: string;
  sections: CourseSection[];
  /** 기존 화면/집계 호환용 평탄화 목록입니다. 신규 수업 UI는 sections를 기준으로 표시합니다. */
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
    blockCount: lesson.blockIds.length,
    hasVideo: hasLessonVideo(lesson),
    hasAudio: hasLessonAudio(lesson),
    hasQuiz: hasLessonQuiz(lesson),
    visibility: lesson.visibility ?? "공개",
    contentCount: getLessonMediaCount(lesson),
    updatedAt: lesson.updatedAt,
  };
}

function buildSections(classId: string, classLessons: Lesson[]) {
  const courseLessons = classLessons.map(toCourseLesson);

  if (courseLessons.length <= 2) {
    return [
      {
        id: `${classId}-SEC-01`,
        sectionName: "기본 학습",
        lessons: courseLessons,
      },
    ];
  }

  const midpoint = Math.ceil(courseLessons.length / 2);

  return [
    {
      id: `${classId}-SEC-01`,
      sectionName: "1~5일차",
      lessons: courseLessons.slice(0, midpoint),
    },
    {
      id: `${classId}-SEC-02`,
      sectionName: "6~10일차",
      lessons: courseLessons.slice(midpoint),
    },
  ].filter((section) => section.lessons.length > 0);
}

const linkedClassRecords = lmsLessons.flatMap((lesson) =>
  getLessonLinkedClasses(lesson).map((linkedClass) => ({ lesson, linkedClass })),
);

const classKeys = Array.from(new Set(linkedClassRecords.map(({ linkedClass }) => linkedClass.id)));

export const courseClasses: CourseClass[] = classKeys.map((classId, index) => {
  const classRecords = linkedClassRecords.filter(({ linkedClass }) => linkedClass.id === classId);
  const classLessons = classRecords.map(({ lesson }) => lesson);
  const representativeClass: LessonLinkedClass = classRecords[0].linkedClass;
  const hasPrivateLesson = classLessons.some((lesson) => lesson.visibility === "비공개");
  const linkedCourseIds = Array.from(new Set(classRecords.map(({ linkedClass }) => linkedClass.courseId).filter(Boolean)));
  const latestUpdatedAt = classLessons
    .map((lesson) => lesson.updatedAt)
    .sort((first, second) => second.localeCompare(first))[0];
  const sections = buildSections(representativeClass.id, classLessons);
  const lessons = sections.flatMap((section) => section.lessons);

  return {
    id: representativeClass.id,
    language: representativeClass.language,
    className: representativeClass.className,
    description: `${representativeClass.className} 수업은 섹션 ${sections.length}개와 레슨 ${lessons.length}개로 구성되어 있습니다.`,
    classQuizStatus: index % 2 === 0 ? "미사용" : "사용",
    course: representativeClass.courseName,
    visibility: hasPrivateLesson ? "비공개" : "공개",
    linkedCourseIds,
    updatedAt: latestUpdatedAt,
    sections,
    lessons,
  };
});

export const courseFilterOptions = {
  languages: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.language)))],
};

export type CourseVisibility = "공개" | "비공개";

export type CourseLesson = {
  id: string;
  lessonName: string;
  visibility: CourseVisibility;
  contentCount: number;
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

function createLessons(prefix: string, count: number, privateLessonNumbers: number[] = []): CourseLesson[] {
  return Array.from({ length: count }, (_, index) => {
    const lessonNumber = index + 1;
    const isPrivate = privateLessonNumbers.includes(lessonNumber);

    return {
      id: `${prefix}-${String(lessonNumber).padStart(2, "0")}`,
      lessonName: `${lessonNumber}일차`,
      visibility: isPrivate ? "비공개" : "공개",
      contentCount: isPrivate ? 2 : 3 + (lessonNumber % 2),
    };
  });
}

export const courseClasses: CourseClass[] = [
  {
    id: "CLS-JP-BSC-01",
    language: "일본어",
    course: "베이직",
    className: "일본어 1단계",
    visibility: "공개",
    updatedAt: "2026-05-31",
    lessons: createLessons("L-JP-BSC-01", 30, [29, 30]),
  },
  {
    id: "CLS-JP-BSC-02",
    language: "일본어",
    course: "베이직",
    className: "일본어 2단계",
    visibility: "공개",
    updatedAt: "2026-05-27",
    lessons: createLessons("L-JP-BSC-02", 28, [27, 28]),
  },
  {
    id: "CLS-JP-GRM-01",
    language: "일본어",
    course: "문법 완성",
    className: "일본어 문법 1단계",
    visibility: "비공개",
    updatedAt: "2026-05-23",
    lessons: createLessons("L-JP-GRM-01", 24, [1, 2, 23, 24]),
  },
  {
    id: "CLS-EN-LSN-01",
    language: "영어",
    course: "리스닝 스타터",
    className: "영어 리스닝 1단계",
    visibility: "공개",
    updatedAt: "2026-05-25",
    lessons: createLessons("L-EN-LSN-01", 26, [26]),
  },
  {
    id: "CLS-EN-LSN-02",
    language: "영어",
    course: "리스닝 스타터",
    className: "영어 리스닝 2단계",
    visibility: "비공개",
    updatedAt: "2026-05-22",
    lessons: createLessons("L-EN-LSN-02", 22, [1, 21, 22]),
  },
  {
    id: "CLS-ES-BSC-01",
    language: "스페인어",
    course: "베이직",
    className: "스페인어 1단계",
    visibility: "공개",
    updatedAt: "2026-05-20",
    lessons: createLessons("L-ES-BSC-01", 30, [30]),
  },
  {
    id: "CLS-ES-BSC-02",
    language: "스페인어",
    course: "베이직",
    className: "스페인어 2단계",
    visibility: "공개",
    updatedAt: "2026-05-18",
    lessons: createLessons("L-ES-BSC-02", 28, [27, 28]),
  },
];

export const courseVisibilityOptions: Array<"전체" | CourseVisibility> = ["전체", "공개", "비공개"];

export const courseFilterOptions = {
  languages: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.language)))],
  courses: ["전체", ...Array.from(new Set(courseClasses.map((courseClass) => courseClass.course)))],
};

export type LessonVisibility = "공개" | "비공개";

export type LessonLinkedClass = {
  id: string;
  language: string;
  courseId: string;
  courseName: string;
  className: string;
};

export type Lesson = {
  id: string;
  language: string;
  lessonName: string;
  description: string;
  /** 기존 코스/패키지 mock 집계 호환용 내부 연결값입니다. 레슨 생성/목록/상세 핵심 정보로는 노출하지 않습니다. */
  course: string;
  /** 기존 코스/패키지 mock 집계 호환용 내부 연결값입니다. 레슨 생성/목록/상세 핵심 정보로는 노출하지 않습니다. */
  className: string;
  videoUrl?: string;
  audioUrl?: string;
  quizUrl?: string;
  updatedAt: string;
  /** 기존 수업/코스 화면 호환을 위한 내부 공개 상태입니다. 레슨 생성/목록 UI에서는 노출하지 않습니다. */
  visibility?: LessonVisibility;
  /** 레슨은 독립 생성되며, 연결 정보는 이후 수업 구성 단계에서 생길 수 있습니다. */
  linkedClasses?: LessonLinkedClass[];
};

export const lessons: Lesson[] = [
  {
    id: "LSN-JP-BSC-01-01",
    language: "일본어",
    lessonName: "1일차",
    description: "히라가나와 기본 인사를 익히는 입문 레슨입니다.",
    course: "베이직",
    className: "일본어 1단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    quizUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-01-01",
    visibility: "공개",
    updatedAt: "2026-05-31",
    linkedClasses: [
      {
        id: "CLS-JP-BSC-01",
        language: "일본어",
        courseId: "CRS-JP-BASIC",
        courseName: "베이직",
        className: "일본어 1단계",
      },
    ],
  },
  {
    id: "LSN-JP-BSC-01-02",
    language: "일본어",
    lessonName: "2일차",
    description: "자기소개 표현을 듣고 말하는 연습 레슨입니다.",
    course: "베이직",
    className: "일본어 1단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    quizUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-01-02",
    visibility: "공개",
    updatedAt: "2026-05-30",
    linkedClasses: [
      {
        id: "CLS-JP-BSC-01",
        language: "일본어",
        courseId: "CRS-JP-BASIC",
        courseName: "베이직",
        className: "일본어 1단계",
      },
    ],
  },
  {
    id: "LSN-JP-BSC-01-03",
    language: "일본어",
    lessonName: "3일차",
    description: "숫자와 시간 표현을 학습하는 레슨입니다. 퀴즈 링크는 아직 등록되지 않았습니다.",
    course: "베이직",
    className: "일본어 1단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    visibility: "비공개",
    updatedAt: "2026-05-28",
    linkedClasses: [
      {
        id: "CLS-JP-BSC-01",
        language: "일본어",
        courseId: "CRS-JP-BASIC",
        courseName: "베이직",
        className: "일본어 1단계",
      },
    ],
  },
  {
    id: "LSN-JP-BSC-02-01",
    language: "일본어",
    lessonName: "동사의 기본형",
    description: "일본어 2단계에서 동사의 기본형과 활용을 확인하는 레슨입니다.",
    course: "베이직",
    className: "일본어 2단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    quizUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-02-01",
    visibility: "공개",
    updatedAt: "2026-05-27",
    linkedClasses: [
      {
        id: "CLS-JP-BSC-02",
        language: "일본어",
        courseId: "CRS-JP-BASIC",
        courseName: "베이직",
        className: "일본어 2단계",
      },
    ],
  },
  {
    id: "LSN-EN-LSN-01-01",
    language: "영어",
    lessonName: "오리엔테이션",
    description: "영어 리스닝 학습법과 핵심 문장 쉐도잉을 안내하는 레슨입니다.",
    course: "리스닝 스타터",
    className: "영어 리스닝 1단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    quizUrl: "https://studymini.example.com/quizzes/LSN-EN-LSN-01-01",
    visibility: "공개",
    updatedAt: "2026-05-25",
    linkedClasses: [
      {
        id: "CLS-EN-LSN-01",
        language: "영어",
        courseId: "CRS-EN-LISTENING",
        courseName: "리스닝 스타터",
        className: "영어 리스닝 1단계",
      },
    ],
  },
  {
    id: "LSN-EN-LSN-01-02",
    language: "영어",
    lessonName: "공항에서 듣기",
    description: "공항 안내 방송과 탑승 안내 표현을 듣는 레슨입니다.",
    course: "리스닝 스타터",
    className: "영어 리스닝 1단계",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    quizUrl: "https://studymini.example.com/quizzes/LSN-EN-LSN-01-02",
    visibility: "비공개",
    updatedAt: "2026-05-22",
    linkedClasses: [
      {
        id: "CLS-EN-LSN-01",
        language: "영어",
        courseId: "CRS-EN-LISTENING",
        courseName: "리스닝 스타터",
        className: "영어 리스닝 1단계",
      },
    ],
  },
  {
    id: "LSN-ES-BSC-01-01",
    language: "스페인어",
    lessonName: "1일차",
    description: "스페인어 알파벳과 발음을 확인하는 첫 레슨입니다.",
    course: "베이직",
    className: "스페인어 1단계",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    audioUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    quizUrl: "https://studymini.example.com/quizzes/LSN-ES-BSC-01-01",
    visibility: "공개",
    updatedAt: "2026-05-20",
    linkedClasses: [
      {
        id: "CLS-ES-BSC-01",
        language: "스페인어",
        courseId: "CRS-ES-BASIC",
        courseName: "베이직",
        className: "스페인어 1단계",
      },
    ],
  },
  {
    id: "LSN-ES-BSC-01-02",
    language: "스페인어",
    lessonName: "2일차",
    description: "인사와 안부 묻기 표현을 학습하는 독립 레슨입니다. 아직 수업에 연결되지 않았습니다.",
    course: "",
    className: "",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    updatedAt: "2026-05-18",
    visibility: "공개",
    linkedClasses: [],
  },
];

export const lessonLanguageOptions = ["전체", ...Array.from(new Set(lessons.map((lesson) => lesson.language)))];
export const lessonFormLanguageOptions = lessonLanguageOptions.filter((language) => language !== "전체");

export function getLessonLinkedClasses(lesson: Lesson) {
  return lesson.linkedClasses ?? [];
}

export function getLessonLinkedClassCount(lesson: Lesson) {
  return getLessonLinkedClasses(lesson).length;
}

export function getLessonLinkedCourseCount(lesson: Lesson) {
  return new Set(getLessonLinkedClasses(lesson).map((linkedClass) => linkedClass.courseId)).size;
}

export function hasLessonVideo(lesson: Lesson) {
  return Boolean(lesson.videoUrl?.trim());
}

export function hasLessonAudio(lesson: Lesson) {
  return Boolean(lesson.audioUrl?.trim());
}

export function hasLessonQuiz(lesson: Lesson) {
  return Boolean(lesson.quizUrl?.trim());
}

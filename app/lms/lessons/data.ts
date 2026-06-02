export type LessonVisibility = "공개" | "비공개";
export type LessonContentType = "영상" | "오디오" | "퀴즈";

export type LessonContent = {
  id: string;
  type: LessonContentType;
  title: string;
  duration?: string;
  itemCount?: number;
  order: number;
};

export type Lesson = {
  id: string;
  language: string;
  course: string;
  className: string;
  lessonName: string;
  visibility: LessonVisibility;
  updatedAt: string;
  contents: LessonContent[];
};

export const lessons: Lesson[] = [
  {
    id: "LSN-JP-BSC-01-01",
    language: "일본어",
    course: "베이직",
    className: "일본어 1단계",
    lessonName: "1일차",
    visibility: "공개",
    updatedAt: "2026-05-31",
    contents: [
      { id: "CNT-JP-001-V01", type: "영상", title: "히라가나와 기본 인사", duration: "12:30", order: 1 },
      { id: "CNT-JP-001-A01", type: "오디오", title: "기본 인사 따라 말하기", duration: "06:10", order: 2 },
      { id: "CNT-JP-001-Q01", type: "퀴즈", title: "1일차 확인 퀴즈", itemCount: 8, order: 3 },
    ],
  },
  {
    id: "LSN-JP-BSC-01-02",
    language: "일본어",
    course: "베이직",
    className: "일본어 1단계",
    lessonName: "2일차",
    visibility: "공개",
    updatedAt: "2026-05-30",
    contents: [
      { id: "CNT-JP-002-V01", type: "영상", title: "자기소개 표현", duration: "14:05", order: 1 },
      { id: "CNT-JP-002-A01", type: "오디오", title: "이름과 출신 말하기", duration: "07:20", order: 2 },
      { id: "CNT-JP-002-Q01", type: "퀴즈", title: "자기소개 문장 배열", itemCount: 10, order: 3 },
    ],
  },
  {
    id: "LSN-JP-BSC-01-03",
    language: "일본어",
    course: "베이직",
    className: "일본어 1단계",
    lessonName: "3일차",
    visibility: "비공개",
    updatedAt: "2026-05-28",
    contents: [
      { id: "CNT-JP-003-V01", type: "영상", title: "숫자와 시간 표현", duration: "15:40", order: 1 },
      { id: "CNT-JP-003-A01", type: "오디오", title: "숫자 듣고 말하기", duration: "08:35", order: 2 },
      { id: "CNT-JP-003-Q01", type: "퀴즈", title: "시간 표현 퀴즈", itemCount: 12, order: 3 },
    ],
  },
  {
    id: "LSN-JP-BSC-02-01",
    language: "일본어",
    course: "베이직",
    className: "일본어 2단계",
    lessonName: "1일차",
    visibility: "공개",
    updatedAt: "2026-05-27",
    contents: [
      { id: "CNT-JP-201-V01", type: "영상", title: "동사의 기본형", duration: "16:25", order: 1 },
      { id: "CNT-JP-201-A01", type: "오디오", title: "동사 활용 듣기", duration: "09:10", order: 2 },
      { id: "CNT-JP-201-Q01", type: "퀴즈", title: "동사 활용 점검", itemCount: 10, order: 3 },
    ],
  },
  {
    id: "LSN-EN-LSN-01-01",
    language: "영어",
    course: "리스닝 스타터",
    className: "영어 리스닝 1단계",
    lessonName: "오리엔테이션",
    visibility: "공개",
    updatedAt: "2026-05-25",
    contents: [
      { id: "CNT-EN-001-V01", type: "영상", title: "리스닝 학습법", duration: "10:15", order: 1 },
      { id: "CNT-EN-001-A01", type: "오디오", title: "짧은 대화 듣기", duration: "05:55", order: 2 },
      { id: "CNT-EN-001-A02", type: "오디오", title: "핵심 문장 쉐도잉", duration: "04:45", order: 3 },
      { id: "CNT-EN-001-Q01", type: "퀴즈", title: "핵심 표현 확인", itemCount: 6, order: 4 },
    ],
  },
  {
    id: "LSN-EN-LSN-01-02",
    language: "영어",
    course: "리스닝 스타터",
    className: "영어 리스닝 1단계",
    lessonName: "공항에서 듣기",
    visibility: "비공개",
    updatedAt: "2026-05-22",
    contents: [
      { id: "CNT-EN-002-V01", type: "영상", title: "공항 안내 방송 패턴", duration: "13:05", order: 1 },
      { id: "CNT-EN-002-A01", type: "오디오", title: "탑승 안내 듣기", duration: "06:40", order: 2 },
      { id: "CNT-EN-002-Q01", type: "퀴즈", title: "공항 표현 매칭", itemCount: 9, order: 3 },
    ],
  },
  {
    id: "LSN-ES-BSC-01-01",
    language: "스페인어",
    course: "베이직",
    className: "스페인어 1단계",
    lessonName: "1일차",
    visibility: "공개",
    updatedAt: "2026-05-20",
    contents: [
      { id: "CNT-ES-001-V01", type: "영상", title: "알파벳과 발음", duration: "11:50", order: 1 },
      { id: "CNT-ES-001-A01", type: "오디오", title: "모음 발음 연습", duration: "05:25", order: 2 },
      { id: "CNT-ES-001-Q01", type: "퀴즈", title: "알파벳 확인 퀴즈", itemCount: 8, order: 3 },
    ],
  },
  {
    id: "LSN-ES-BSC-01-02",
    language: "스페인어",
    course: "베이직",
    className: "스페인어 1단계",
    lessonName: "2일차",
    visibility: "공개",
    updatedAt: "2026-05-18",
    contents: [
      { id: "CNT-ES-002-V01", type: "영상", title: "인사와 안부 묻기", duration: "12:10", order: 1 },
      { id: "CNT-ES-002-A01", type: "오디오", title: "인사 표현 듣기", duration: "06:15", order: 2 },
      { id: "CNT-ES-002-Q01", type: "퀴즈", title: "상황별 인사 선택", itemCount: 10, order: 3 },
    ],
  },
];

export const visibilityOptions: Array<"전체" | LessonVisibility> = ["전체", "공개", "비공개"];

export const lessonFilterOptions = {
  languages: ["전체", ...Array.from(new Set(lessons.map((lesson) => lesson.language)))],
  courses: ["전체", ...Array.from(new Set(lessons.map((lesson) => lesson.course)))],
  classes: ["전체", ...Array.from(new Set(lessons.map((lesson) => lesson.className)))],
};

export function getLessonContentCount(lesson: Lesson, type: LessonContentType) {
  return lesson.contents.filter((content) => content.type === type).length;
}

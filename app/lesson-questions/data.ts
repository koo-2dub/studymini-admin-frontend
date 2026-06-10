export type LessonQuestionVisibility = "승인 대기" | "승인됨" | "비밀" | "휴지통";
export type LessonQuestionAnswerStatus = "미답변" | "답변완료";

export type LessonQuestionRecord = {
  id: string;
  memberId: string;
  userName: string;
  email: string;
  language: "영어" | "일본어" | "중국어" | "스페인어" | "프랑스어" | "독일어" | "이탈리아어";
  courseLevel: string;
  lessonDay: string;
  lectureTitle: string;
  questionPreview: string;
  questionBody: string;
  visibilityStatus: LessonQuestionVisibility;
  answerStatus: LessonQuestionAnswerStatus;
  askedAt: string;
  deletedAt?: string;
  deletedBy?: string;
  answeredBy?: string;
  answeredAt?: string;
  answerBody?: string;
  attachments: { name: string; size: string }[];
  logs: { action: string; actor: string; at: string; note: string }[];
};

export const lessonQuestionCourses = [
  "일본어 1단계",
  "영어 미션 1단계",
  "스페인어 2단계",
  "중국어 3단계",
  "프랑스어 회화",
  "독일어 입문",
  "이탈리아어 여행 회화",
];

export const lessonQuestions: LessonQuestionRecord[] = [
  {
    id: "LQ-772",
    memberId: "SM-1024",
    userName: "지윤 김",
    email: "jiyoon.kim@example.com",
    language: "스페인어",
    courseLevel: "스페인어 2단계",
    lessonDay: "Día 12",
    lectureTitle: "pretérito perfecto와 indefinido 구분",
    questionPreview: "과거 완료와 단순 과거를 회화에서 언제 다르게 써야 하는지 예문 기준이 헷갈립니다.",
    questionBody:
      "강의에서는 pretérito perfecto가 현재와 연결된 경험을 말할 때 자주 쓰인다고 설명해 주셨는데, 실제 예문에서 ayer가 붙으면 indefinido를 쓴다고 해서 헷갈립니다.\n제가 작성한 문장 ‘He estudiado español ayer’는 왜 어색한지, 자연스럽게 고치려면 어떤 시제를 써야 하는지 알고 싶습니다.",
    visibilityStatus: "승인됨",
    answerStatus: "답변완료",
    askedAt: "2026-06-01 09:18",
    answeredBy: "관리자 한나",
    answeredAt: "2026-06-01 10:04",
    answerBody:
      "ayer처럼 과거의 특정 시점을 명확히 닫아 주는 표현이 있으면 indefinido를 쓰는 것이 자연스럽습니다.\n따라서 ‘Estudié español ayer’가 맞고, 오늘까지 이어지는 경험을 말할 때는 ‘He estudiado español esta semana’처럼 쓰면 됩니다.",
    attachments: [{ name: "시제_연습문장.png", size: "312KB" }],
    logs: [
      { action: "승인 처리", actor: "관리자 한나", at: "2026-06-01 09:35", note: "학습 질문으로 공개 승인" },
      { action: "답변 저장", actor: "관리자 한나", at: "2026-06-01 10:04", note: "답변상태를 답변완료로 변경" },
    ],
  },
  {
    id: "LQ-773",
    memberId: "SM-1022",
    userName: "서준 이",
    email: "seojoon.lee@example.com",
    language: "영어",
    courseLevel: "영어 미션 1단계",
    lessonDay: "Day 4",
    lectureTitle: "현재완료로 경험 말하기",
    questionPreview: "Have you ever와 Did you ever의 차이가 정확히 무엇인지 알고 싶습니다.",
    questionBody:
      "미션 문장에서 ‘Have you ever been to Canada?’를 배웠는데, 영화에서는 ‘Did you ever go there?’도 들었습니다.\n두 표현 모두 경험을 묻는 것처럼 들리는데 어떤 상황에서 현재완료를 써야 하는지 설명 부탁드립니다.",
    visibilityStatus: "승인됨",
    answerStatus: "미답변",
    askedAt: "2026-06-01 08:42",
    attachments: [],
    logs: [{ action: "승인 처리", actor: "관리자 민준", at: "2026-06-01 08:55", note: "공개 가능한 학습 질문으로 승인" }],
  },
  {
    id: "LQ-774",
    memberId: "SM-1017",
    userName: "수아 한",
    email: "sua.han@example.com",
    language: "일본어",
    courseLevel: "일본어 1단계",
    lessonDay: "日目 2",
    lectureTitle: "ありがとうございます",
    questionPreview: "ありがとうございます와 ありがとうございました를 어떤 기준으로 구분하나요?",
    questionBody:
      "감사를 표현할 때 현재형과 과거형이 모두 쓰이는 것 같은데, 수업이 끝난 뒤 선생님께 말할 때는 어떤 표현이 자연스러운지 궁금합니다.\n예문을 함께 알려주세요.",
    visibilityStatus: "승인 대기",
    answerStatus: "미답변",
    askedAt: "2026-05-31 21:16",
    attachments: [{ name: "일본어_필기.pdf", size: "88KB" }],
    logs: [{ action: "질문 접수", actor: "시스템", at: "2026-05-31 21:16", note: "승인 대기 상태로 등록" }],
  },
  {
    id: "LQ-775",
    memberId: "SM-1020",
    userName: "도윤 정",
    email: "doyoon.jung@example.com",
    language: "중국어",
    courseLevel: "중국어 3단계",
    lessonDay: "Day 8",
    lectureTitle: "把자문으로 문장 강조하기",
    questionPreview: "把자문에서 목적어가 길어질 때 어순을 어떻게 잡아야 하는지 궁금합니다.",
    questionBody:
      "‘我把昨天买的书放在桌子上了’ 같은 문장에서 목적어가 길어지면 문장이 너무 복잡해 보입니다.\n실제 회화에서도 이렇게 말하는지, 짧게 나누는 방법이 있는지 알고 싶습니다.",
    visibilityStatus: "비밀",
    answerStatus: "답변완료",
    askedAt: "2026-05-30 14:03",
    answeredBy: "관리자 민준",
    answeredAt: "2026-05-30 16:20",
    answerBody:
      "목적어가 길어도 把 뒤에 한 덩어리로 놓을 수 있습니다.\n다만 회화에서는 ‘我昨天买了一本书。把它放在桌子上了。’처럼 앞 문장에서 대상을 먼저 소개하고 다음 문장에서 它로 받으면 더 자연스럽습니다.",
    attachments: [],
    logs: [
      { action: "비밀 처리", actor: "관리자 민준", at: "2026-05-30 16:25", note: "답변 후 작성자와 관리자만 볼 수 있도록 비밀 처리" },
      { action: "답변 저장", actor: "관리자 민준", at: "2026-05-30 16:20", note: "문장 분리 예시 추가" },
      { action: "질문 접수", actor: "시스템", at: "2026-05-30 14:03", note: "승인 대기 상태로 등록" },
    ],
  },
  {
    id: "LQ-776",
    memberId: "SM-1018",
    userName: "준호 임",
    email: "junho.lim@example.com",
    language: "프랑스어",
    courseLevel: "프랑스어 회화",
    lessonDay: "Leçon 3",
    lectureTitle: "카페에서 주문하기",
    questionPreview: "Je voudrais와 Je veux를 카페 주문에서 모두 써도 되는지 궁금합니다.",
    questionBody:
      "카페에서 주문할 때 Je voudrais un café가 정중하다고 배웠습니다.\n친구끼리 가벼운 상황에서는 Je veux un café라고 해도 무례하지 않은지, 다른 추천 표현이 있는지 알고 싶습니다.",
    visibilityStatus: "승인 대기",
    answerStatus: "미답변",
    askedAt: "2026-05-28 11:28",
    attachments: [],
    logs: [{ action: "질문 접수", actor: "시스템", at: "2026-05-28 11:28", note: "승인 검토 필요" }],
  },
  {
    id: "LQ-777",
    memberId: "SM-1021",
    userName: "하린 최",
    email: "harin.choi@example.com",
    language: "독일어",
    courseLevel: "독일어 입문",
    lessonDay: "Tag 5",
    lectureTitle: "동사 위치와 평서문",
    questionPreview: "동사가 항상 두 번째 자리에 온다는 규칙이 부사구가 앞에 올 때도 적용되는지 궁금합니다.",
    questionBody:
      "Heute lerne ich Deutsch에서 Heute가 앞에 오면 주어와 동사의 위치가 바뀌는 이유가 궁금합니다.\nIch lerne heute Deutsch와 의미 차이가 큰지도 알려주세요.",
    visibilityStatus: "휴지통",
    answerStatus: "미답변",
    askedAt: "2026-05-24 18:44",
    deletedAt: "2026-05-25 09:12",
    deletedBy: "관리자 소라",
    attachments: [],
    logs: [
      { action: "승인 처리", actor: "관리자 소라", at: "2026-05-24 19:00", note: "임시 승인" },
      { action: "휴지통 이동", actor: "관리자 소라", at: "2026-05-25 09:12", note: "중복 등록으로 휴지통 이동" },
    ],
  },
  {
    id: "LQ-778",
    memberId: "SM-1023",
    userName: "민서 박",
    email: "minseo.park@example.com",
    language: "이탈리아어",
    courseLevel: "이탈리아어 여행 회화",
    lessonDay: "Giorno 2",
    lectureTitle: "호텔 체크인 표현",
    questionPreview: "Vorrei fare il check-in 문장에서 vorrei 대신 voglio를 쓰면 너무 직접적인가요?",
    questionBody:
      "호텔 체크인 상황에서 정중한 표현을 연습하고 있습니다.\nVorrei fare il check-in이 자연스럽다고 배웠는데, voglio fare il check-in과 비교해서 어떤 뉘앙스 차이가 있는지 알려주세요.",
    visibilityStatus: "휴지통",
    answerStatus: "답변완료",
    askedAt: "2026-05-20 10:05",
    deletedAt: "2026-05-22 13:40",
    deletedBy: "관리자 한나",
    answeredBy: "관리자 한나",
    answeredAt: "2026-05-20 12:30",
    answerBody: "voglio는 요구처럼 들릴 수 있어 서비스 상황에서는 vorrei 또는 potrei를 권장합니다.",
    attachments: [{ name: "호텔_체크인_녹음.mp3", size: "1.4MB" }],
    logs: [
      { action: "승인 처리", actor: "관리자 한나", at: "2026-05-20 10:25", note: "공개 승인" },
      { action: "답변 저장", actor: "관리자 한나", at: "2026-05-20 12:30", note: "답변 완료" },
      { action: "휴지통 이동", actor: "관리자 한나", at: "2026-05-22 13:40", note: "작성자 요청으로 숨김" },
    ],
  },
];

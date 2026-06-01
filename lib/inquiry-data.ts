export type AnswerStatus = "답변대기" | "답변중" | "답변완료";
export type VisibilityStatus = "공개" | "비공개";

export type GeneralInquiry = {
  id: string;
  title: string;
  requester: string;
  userId: string;
  email: string;
  inquiryDate: string;
  answerStatus: AnswerStatus;
  manager: string;
  content: string;
  answer: string;
};

export type LearningInquiry = {
  id: string;
  title: string;
  requester: string;
  userId: string;
  language: string;
  course: string;
  lesson: string;
  visibility: VisibilityStatus;
  inquiryDate: string;
  answerStatus: AnswerStatus;
  manager: string;
  content: string;
  answer: string;
};

export const generalInquiries: GeneralInquiry[] = [
  {
    id: "INQ-304",
    title: "결제 영수증 이름 변경 요청",
    requester: "Mina Lee",
    userId: "SM-1021",
    email: "mina.lee@example.com",
    inquiryDate: "2026-05-28",
    answerStatus: "답변대기",
    manager: "김민지",
    content: "회사 제출용 영수증의 수강자명을 사업자명으로 변경할 수 있는지 문의합니다.",
    answer: "",
  },
  {
    id: "INQ-305",
    title: "녹화 강의 접속 오류",
    requester: "Avery Kim",
    userId: "SM-1024",
    email: "avery.kim@example.com",
    inquiryDate: "2026-05-27",
    answerStatus: "답변중",
    manager: "박서준",
    content: "어제부터 비즈니스 회화 집중반 녹화 강의가 재생되지 않습니다.",
    answer: "기기와 브라우저 정보를 확인 중입니다.",
  },
  {
    id: "INQ-306",
    title: "팀 좌석 취소 문의",
    requester: "Daniel Wu",
    userId: "SM-1027",
    email: "daniel.wu@example.com",
    inquiryDate: "2026-05-24",
    answerStatus: "답변완료",
    manager: "이하늘",
    content: "다음 달부터 팀 좌석 2개를 취소하고 싶습니다.",
    answer: "좌석 조정 방법과 환불 기준을 안내했습니다.",
  },
];

export const learningInquiries: LearningInquiry[] = [
  {
    id: "LQ-772",
    title: "Physics Lab 08 실험 결과 질문",
    requester: "Avery Kim",
    userId: "SM-1024",
    language: "영어",
    course: "Physics Lab 08",
    lesson: "실험 결과 정리",
    visibility: "공개",
    inquiryDate: "2026-05-29",
    answerStatus: "답변중",
    manager: "박서준",
    content: "그래프의 기울기를 해석하는 부분에서 단위 변환이 헷갈립니다.",
    answer: "담당 선생님에게 배정되어 답변 작성 중입니다.",
  },
  {
    id: "LQ-773",
    title: "Geometry Proofs 증명 순서",
    requester: "Noah Park",
    userId: "SM-1028",
    language: "영어",
    course: "Geometry Proofs",
    lesson: "삼각형 합동 증명",
    visibility: "비공개",
    inquiryDate: "2026-05-28",
    answerStatus: "답변대기",
    manager: "미배정",
    content: "SSS 조건을 먼저 써야 하는지 결론 직전에 써야 하는지 알고 싶습니다.",
    answer: "",
  },
  {
    id: "LQ-774",
    title: "Essay Structure 본문 전개 방식",
    requester: "Mina Lee",
    userId: "SM-1021",
    language: "영어",
    course: "Essay Structure",
    lesson: "Body paragraph 구성",
    visibility: "공개",
    inquiryDate: "2026-05-26",
    answerStatus: "답변완료",
    manager: "김민지",
    content: "두 번째 문단에서 예시를 몇 개까지 넣는 것이 적절한가요?",
    answer: "핵심 예시 1개와 보조 설명 1개로 구성하도록 안내했습니다.",
  },
  {
    id: "LQ-775",
    title: "스페인어 베이직 발음 확인",
    requester: "지윤 김",
    userId: "SM-1026",
    language: "스페인어",
    course: "스페인어 베이직",
    lesson: "모음 발음",
    visibility: "공개",
    inquiryDate: "2026-05-25",
    answerStatus: "답변완료",
    manager: "이하늘",
    content: "녹음 과제에서 e와 i 발음 구분이 잘 되었는지 확인 부탁드립니다.",
    answer: "피드백 음성과 연습 방법을 전달했습니다.",
  },
];

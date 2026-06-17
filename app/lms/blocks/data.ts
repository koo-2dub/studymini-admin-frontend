export type BlockType = "영상" | "오디오" | "퀴즈 링크";

export type ContentBlock = {
  id: string;
  blockName: string;
  language: string;
  type: BlockType;
  mediaUrl: string;
  description: string;
  updatedAt: string;
};

export const blockTypeOptions: BlockType[] = ["영상", "오디오", "퀴즈 링크"];

export const blocks: ContentBlock[] = [
  {
    id: "BLK-JP-BSC-01-VIDEO",
    blockName: "히라가나 입문 영상",
    language: "일본어",
    type: "영상",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description: "히라가나와 기본 인사를 설명하는 본강의 영상입니다.",
    updatedAt: "2026-05-31",
  },
  {
    id: "BLK-JP-BSC-01-AUDIO",
    blockName: "기본 인사 듣기 오디오",
    language: "일본어",
    type: "오디오",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    description: "기본 인사 표현을 반복 청취하는 오디오입니다.",
    updatedAt: "2026-05-31",
  },
  {
    id: "BLK-JP-BSC-01-QUIZ",
    blockName: "1일차 Quizlet 링크",
    language: "일본어",
    type: "퀴즈 링크",
    mediaUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-01-01",
    description: "1일차 어휘 복습용 Quizlet 링크입니다.",
    updatedAt: "2026-05-31",
  },
  {
    id: "BLK-JP-BSC-02-QUIZ",
    blockName: "2일차 Quizlet 링크",
    language: "일본어",
    type: "퀴즈 링크",
    mediaUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-01-02",
    description: "자기소개 표현 복습 링크입니다.",
    updatedAt: "2026-05-30",
  },
  {
    id: "BLK-JP-BSC-VERB-VIDEO",
    blockName: "동사 기본형 강의 영상",
    language: "일본어",
    type: "영상",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description: "동사의 기본형과 활용을 설명하는 영상입니다.",
    updatedAt: "2026-05-27",
  },
  {
    id: "BLK-JP-BSC-VERB-QUIZ",
    blockName: "동사 기본형 퀴즈 링크",
    language: "일본어",
    type: "퀴즈 링크",
    mediaUrl: "https://studymini.example.com/quizzes/LSN-JP-BSC-02-01",
    description: "동사 기본형 확인 퀴즈 링크입니다.",
    updatedAt: "2026-05-27",
  },
  {
    id: "BLK-EN-LSN-ORIENTATION-VIDEO",
    blockName: "리스닝 학습법 오리엔테이션 영상",
    language: "영어",
    type: "영상",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description: "영어 리스닝 학습법을 안내하는 영상입니다.",
    updatedAt: "2026-05-25",
  },
  {
    id: "BLK-EN-LSN-AIRPORT-AUDIO",
    blockName: "공항 안내 방송 오디오",
    language: "영어",
    type: "오디오",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3",
    description: "공항 안내 방송과 탑승 안내 표현을 듣는 오디오입니다.",
    updatedAt: "2026-05-22",
  },
  {
    id: "BLK-EN-LSN-AIRPORT-QUIZ",
    blockName: "공항 표현 퀴즈 링크",
    language: "영어",
    type: "퀴즈 링크",
    mediaUrl: "https://studymini.example.com/quizzes/LSN-EN-LSN-01-02",
    description: "공항 표현 복습용 퀴즈 링크입니다.",
    updatedAt: "2026-05-22",
  },
  {
    id: "BLK-ES-BSC-ALPHABET-VIDEO",
    blockName: "스페인어 알파벳 영상",
    language: "스페인어",
    type: "영상",
    mediaUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    description: "스페인어 알파벳과 발음을 확인하는 영상입니다.",
    updatedAt: "2026-05-20",
  },
];

export const blockLanguageOptions = ["전체", ...Array.from(new Set(blocks.map((block) => block.language)))];
export const blockFormLanguageOptions = blockLanguageOptions.filter((language) => language !== "전체");

export function getBlockById(blockId: string) {
  return blocks.find((block) => block.id === blockId);
}

export function getBlocksByIds(blockIds: string[]) {
  return blockIds.map(getBlockById).filter((block): block is ContentBlock => Boolean(block));
}

export function hasBlockMediaUrl(block: ContentBlock) {
  return Boolean(block.mediaUrl.trim());
}

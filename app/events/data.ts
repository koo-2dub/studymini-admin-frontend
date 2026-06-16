export type EventStatus = "노출" | "비노출";

export type EventDetailImages = {
  desktop1920: string;
  desktop1280: string;
  tablet768: string;
  mobile375: string;
};

export type EventFloatingBar = {
  topText: string;
  highlightText: string;
  buttonText: string;
  buttonUrl: string;
};

export type EventRecord = {
  id: string;
  title: string;
  cardTitle: string;
  cardBottomText: string;
  thumbnailImage: string;
  detailImages: EventDetailImages;
  floatingBar: EventFloatingBar;
  status: EventStatus;
  startDate: string;
  endDate: string;
  updatedAt: string;
};

export const eventStatusOptions: EventStatus[] = ["노출", "비노출"];

export const eventDetailImageFields: Array<{ key: keyof EventDetailImages; label: string; guide: string }> = [
  { key: "desktop1920", label: "1920 이미지", guide: "Desktop 1920px 이상 상세 통이미지" },
  { key: "desktop1280", label: "1280 이미지", guide: "Desktop 1280px 상세 통이미지" },
  { key: "tablet768", label: "768 이미지", guide: "Tablet 768px 상세 통이미지" },
  { key: "mobile375", label: "375 이미지", guide: "Mobile 375px 상세 통이미지" },
];

const image = (text: string, width = 1200, height = 720) =>
  `https://placehold.co/${width}x${height}/e0e7ff/3730a3?text=${encodeURIComponent(text)}`;

export const events: EventRecord[] = [
  {
    id: "event-summer-2026",
    title: "여름 집중 학습 챌린지",
    cardTitle: "7월까지 완성하는 언어 루틴",
    cardBottomText: "선착순 혜택과 전용 학습 자료를 함께 제공합니다.",
    thumbnailImage: image("Summer Challenge", 800, 520),
    detailImages: {
      desktop1920: image("Summer Detail 1920", 1920, 1400),
      desktop1280: image("Summer Detail 1280", 1280, 1200),
      tablet768: image("Summer Detail 768", 768, 1100),
      mobile375: image("Summer Detail 375", 375, 980),
    },
    floatingBar: {
      topText: "07:03:55후 신청 마감",
      highlightText: "남은 수량, 단 4개!",
      buttonText: "바로 신청하기",
      buttonUrl: "https://studymini.example.com/checkout/summer-challenge",
    },
    status: "노출",
    startDate: "2026-06-10",
    endDate: "2026-07-31",
    updatedAt: "2026-06-14 18:20",
  },
  {
    id: "event-first-purchase",
    title: "첫 구매 웰컴 이벤트",
    cardTitle: "처음 시작하는 회원을 위한 특별 혜택",
    cardBottomText: "첫 결제 회원에게 추가 포인트와 쿠폰을 지급합니다.",
    thumbnailImage: image("Welcome Event", 800, 520),
    detailImages: {
      desktop1920: image("Welcome Detail 1920", 1920, 1400),
      desktop1280: image("Welcome Detail 1280", 1280, 1200),
      tablet768: image("Welcome Detail 768", 768, 1100),
      mobile375: image("Welcome Detail 375", 375, 980),
    },
    floatingBar: {
      topText: "신규 회원 전용 혜택 진행 중",
      highlightText: "첫 구매 쿠폰 20% 지급",
      buttonText: "혜택 받고 시작하기",
      buttonUrl: "https://studymini.example.com/events/welcome",
    },
    status: "노출",
    startDate: "2026-06-01",
    endDate: "2026-06-30",
    updatedAt: "2026-06-12 09:40",
  },
  {
    id: "event-review-reward",
    title: "수강 후기 리워드 이벤트",
    cardTitle: "후기를 남기면 포인트를 드려요",
    cardBottomText: "우수 후기는 메인 페이지와 SNS에 소개됩니다.",
    thumbnailImage: image("Review Reward", 800, 520),
    detailImages: {
      desktop1920: image("Review Detail 1920", 1920, 1400),
      desktop1280: image("Review Detail 1280", 1280, 1200),
      tablet768: "",
      mobile375: image("Review Detail 375", 375, 980),
    },
    floatingBar: {
      topText: "매주 금요일 리워드 지급",
      highlightText: "후기 작성 시 3,000P",
      buttonText: "후기 작성하기",
      buttonUrl: "https://studymini.example.com/reviews/new",
    },
    status: "비노출",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    updatedAt: "2026-06-02 15:05",
  },
];

export function getEventById(eventId: string) {
  return events.find((event) => event.id === eventId);
}

export function eventStatusVariant(status: EventStatus) {
  return status === "노출" ? "success" : "slate";
}

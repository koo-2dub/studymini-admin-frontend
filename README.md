# Studymini Admin Frontend

Next.js 15, TypeScript, Tailwind CSS, App Router 기반의 Studymini 관리자 대시보드 프론트엔드입니다. 현재 단계에서는 모든 데이터가 `src/lib/mock-data.ts`의 목업 데이터로 제공되며 MySQL 또는 실제 API에 직접 연결하지 않습니다.

## 포함 범위

- 대시보드 KPI, 최근 회원/주문, 팝업 클릭률 요약
- 회원 목록/상세 탭 UI
- 주문/결제 목록, 상세, 수동 주문, 결제 링크/업로드/내보내기 UI
- 일반 문의와 학습 질문 분리 관리 및 답변 편집 UI
- LMS 언어/코스/레슨/그룹/PDF 로그와 학습 질문 연결 흐름
- 쿠폰/바우처/포인트 관리, 랜덤 쿠폰 코드 생성 UI
- 팝업 관리, 이메일/알림톡/SMS 설정, 발송 로그
- 매출/상품/쿠폰/팝업/응답시간 목업 분석 차트
- 관리자 역할/권한 매트릭스

## 개발 명령어

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

> 이 프로젝트는 Vercel 배포를 전제로 한 표준 Next.js 앱 구조를 사용합니다.

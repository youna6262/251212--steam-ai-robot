# 지구를 지키는 AI 용사들

초등학교 5-6학년 실과 교과 연계 로봇 교육 프로젝트 웹앱

## 프로젝트 개요

레고 스파이크 프라임으로 만들 환경보호 로봇을 미리 디자인하고, AI 윤리에 대해 배우는 교육용 웹앱입니다.

## 주요 기능

### 1차시: 환경문제와 AI 로봇 탐색
- 환경보호 미션 선택 (물 배달, 쓰레기 청소, 환경 감시)
- 미션별 환경 문제 통계 표시
- 카드 뒤집기 인터랙션

### 2차시: 나만의 로봇 디자인
- 드래그앤드롭 로봇 조립 디자이너
- Konva.js 기반 캔버스
- 레고 스파이크 프라임 부품 정보 표시
- 미션별 추천 부품

### 3차시: 로봇 전개도 만들기
- 전개도 자동 생성
- PDF/이미지 저장
- 인쇄 기능

### 4차시: AI 용사의 윤리적 선택
- 모럴머신 스타일 시나리오
- 가치 성향 분석
- AI 윤리 유형 분류
- 성찰 및 토론 유도

## 기술 스택

- React + Vite
- Tailwind CSS
- React Router
- Konva.js (로봇 디자인)
- html2canvas (이미지 저장)
- jsPDF (PDF 생성)

## 설치 및 실행

### 필수 패키지 설치

```bash
npm install react react-dom react-router-dom
npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react
npm install konva react-konva html2canvas jspdf
```

### 개발 서버 실행

```bash
npm run dev
```

### 프로덕션 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 폴더에 생성됩니다.

### 빌드 미리보기

```bash
npm run preview
```

## 배포

### 정적 호스팅 (Vercel, Netlify 등)

1. GitHub에 프로젝트 푸시
2. Vercel 또는 Netlify에 연결
3. 빌드 명령어: `npm run build`
4. 출력 디렉토리: `dist`

### 로컬 서버 배포

```bash
npm run build
# dist 폴더를 웹 서버에 업로드
```

## 주요 기능 설명

### 진행 상황 저장
- 모든 학습 진행 상황이 localStorage에 자동 저장됩니다
- "이어서 하기" 기능으로 언제든지 이전 작업을 계속할 수 있습니다

### 학습 포트폴리오
- 모든 학습 활동을 한눈에 볼 수 있습니다
- PDF로 저장하여 제출할 수 있습니다

### 선생님 모드
- 비밀번호: `teacher`
- 학급 전체 통계 확인
- 학생별 진행 상황 확인

### 접근성 기능
- 큰 글씨 모드
- 고대비 모드
- 키보드 네비게이션 지원

## 폴더 구조

```
src/
├── components/
│   ├── common/        # 공통 컴포넌트
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── AccessibilityPanel.jsx
│   │   └── HelpModal.jsx
├── pages/            # 페이지 컴포넌트
│   ├── HomePage.jsx
│   ├── MissionPage.jsx
│   ├── DesignerPage.jsx
│   ├── BlueprintPage.jsx
│   ├── EthicsPage.jsx
│   ├── PortfolioPage.jsx
│   └── TeacherPage.jsx
├── data/             # 데이터 파일
│   ├── missions.js
│   ├── robotParts.js
│   └── ethicsScenarios.js
└── utils/            # 유틸리티
    ├── progressManager.js
    └── accessibility.js
```

## 실과 교과 연계

- **5학년**: 로봇의 구조와 기능 이해
- **6학년**: 로봇 프로그래밍과 윤리적 사용

## 레고 스파이크 프라임 연계

각 부품에 레고 스파이크 프라임 부품명이 표시되며, 실제 제작 시 참고할 수 있습니다.

## 라이선스

교육용 프로젝트

## 문의

프로젝트 관련 문의사항이 있으시면 이슈를 등록해주세요.











export const missions = [
  {
    id: 'water',
    title: '물 배달 용사',
    icon: '💧',
    description: '물이 부족한 나라에 깨끗한 물을 전달해요',
    problem: '전 세계 22억 명이 깨끗한 물을 마시지 못해요',
    robotType: '운반형',
    color: '#3B82F6'
  },
  {
    id: 'garbage',
    title: '쓰레기 청소 용사',
    icon: '🗑️',
    description: '바다와 땅의 쓰레기를 치워요',
    problem: '매년 800만 톤의 플라스틱이 바다로 흘러가요',
    robotType: '수거형',
    color: '#10B981'
  },
  {
    id: 'monitor',
    title: '환경 감시 용사',
    icon: '🔍',
    description: '대기오염과 수질오염을 감시해요',
    problem: '대기오염으로 매년 700만 명이 사망해요',
    robotType: '감지형',
    color: '#F59E0B'
  }
];

// 미션 ID → 실제 라벨/아이콘
export const MISSION_LABEL = {
  "1차시": "🔍 AI 살펴보기",
  "2차시": "⚙️ 로봇을 움직여요",
  "4차시": "🌱 환경을 지키는 AI",
};

// AI 윤리 유형 → 라벨/아이콘
export const TYPE_LABEL = {
  "균형잡이": "⚖️ 균형잡이",
  "환경지킴이": "🌱 환경지킴이",
  "사람지킴이": "🤝 사람지킴이",
};

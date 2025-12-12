// SVG 부품들을 단순하고 귀여운 스타일로 생성
const createSVG = (path, color = '#4CAF50') => {
  return `<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <rect width="80" height="80" fill="${color}" rx="8" opacity="0.2"/>
    ${path}
  </svg>`;
};

export const robotParts = {
  body: [
    {
      id: 'body1',
      name: '기본 몸체',
      svg: createSVG('<rect x="20" y="20" width="40" height="40" rx="5" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>', '#4CAF50'),
      category: 'body',
      spikePrime: '기본 허브 블록',
      description: '로봇의 중심이 되는 몸체예요'
    },
    {
      id: 'body2',
      name: '탱크 몸체',
      svg: createSVG('<rect x="15" y="25" width="50" height="30" rx="8" fill="#2196F3" stroke="#1565C0" stroke-width="2"/><rect x="20" y="30" width="15" height="20" fill="#1976D2"/><rect x="45" y="30" width="15" height="20" fill="#1976D2"/>', '#2196F3'),
      category: 'body',
      spikePrime: '확장 허브 블록',
      description: '물이나 물건을 담을 수 있는 큰 몸체예요'
    },
    {
      id: 'body3',
      name: '드론 몸체',
      svg: createSVG('<circle cx="40" cy="40" r="20" fill="#FF9800" stroke="#E65100" stroke-width="2"/><circle cx="40" cy="40" r="12" fill="#FF6F00"/>', '#FF9800'),
      category: 'body',
      spikePrime: '경량 허브 블록',
      description: '가볍고 작은 몸체예요'
    }
  ],
  head: [
    {
      id: 'head1',
      name: '센서 헤드',
      svg: createSVG('<rect x="30" y="25" width="20" height="25" rx="3" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/><circle cx="35" cy="35" r="3" fill="#2E7D32"/><circle cx="45" cy="35" r="3" fill="#2E7D32"/><rect x="37" y="42" width="6" height="2" rx="1" fill="#2E7D32"/>', '#4CAF50'),
      category: 'head',
      spikePrime: '거리 센서 + 컬러 센서',
      description: '주변을 감지하는 센서가 달린 머리예요'
    },
    {
      id: 'head2',
      name: '카메라 헤드',
      svg: createSVG('<rect x="28" y="20" width="24" height="30" rx="4" fill="#2196F3" stroke="#1565C0" stroke-width="2"/><circle cx="40" cy="32" r="8" fill="#1565C0"/><circle cx="40" cy="32" r="4" fill="#0D47A1"/>', '#2196F3'),
      category: 'head',
      spikePrime: '카메라 모듈',
      description: '사진과 영상을 찍을 수 있는 머리예요'
    },
    {
      id: 'head3',
      name: '안테나 헤드',
      svg: createSVG('<rect x="32" y="30" width="16" height="20" rx="2" fill="#FF9800" stroke="#E65100" stroke-width="2"/><line x1="40" y1="20" x2="40" y2="30" stroke="#E65100" stroke-width="3" stroke-linecap="round"/><circle cx="40" cy="18" r="3" fill="#E65100"/>', '#FF9800'),
      category: 'head',
      spikePrime: '무선 통신 모듈',
      description: '신호를 주고받는 안테나가 달린 머리예요'
    }
  ],
  arms: [
    {
      id: 'arm1',
      name: '집게 팔',
      svg: createSVG('<rect x="25" y="20" width="30" height="8" rx="4" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/><path d="M 25 28 L 30 40 L 25 45" fill="#2E7D32" stroke="#1B5E20" stroke-width="2"/><path d="M 55 28 L 50 40 L 55 45" fill="#2E7D32" stroke="#1B5E20" stroke-width="2"/>', '#4CAF50'),
      category: 'arms',
      spikePrime: '중형 모터 + 집게 부품',
      description: '물건을 집을 수 있는 집게 팔이에요'
    },
    {
      id: 'arm2',
      name: '물통 팔',
      svg: createSVG('<rect x="20" y="25" width="40" height="10" rx="5" fill="#2196F3" stroke="#1565C0" stroke-width="2"/><rect x="25" y="35" width="30" height="20" rx="3" fill="#1976D2" stroke="#0D47A1" stroke-width="2"/><line x1="30" y1="40" x2="30" y2="50" stroke="#0D47A1" stroke-width="1"/>', '#2196F3'),
      category: 'arms',
      spikePrime: '대형 모터 + 물통 부품',
      description: '물을 담아 나를 수 있는 팔이에요'
    },
    {
      id: 'arm3',
      name: '청소 팔',
      svg: createSVG('<rect x="25" y="20" width="30" height="8" rx="4" fill="#FF9800" stroke="#E65100" stroke-width="2"/><rect x="28" y="28" width="24" height="25" rx="2" fill="#F57C00" stroke="#E65100" stroke-width="2"/><line x1="32" y1="35" x2="32" y2="48" stroke="#E65100" stroke-width="2"/><line x1="48" y1="35" x2="48" y2="48" stroke="#E65100" stroke-width="2"/>', '#FF9800'),
      category: 'arms',
      spikePrime: '중형 모터 + 브러시 부품',
      description: '쓰레기를 쓸어모을 수 있는 팔이에요'
    }
  ],
  legs: [
    {
      id: 'leg1',
      name: '바퀴',
      svg: createSVG('<circle cx="40" cy="40" r="18" fill="#4CAF50" stroke="#2E7D32" stroke-width="3"/><circle cx="40" cy="40" r="10" fill="#1B5E20"/><line x1="40" y1="22" x2="40" y2="58" stroke="#2E7D32" stroke-width="2"/><line x1="22" y1="40" x2="58" y2="40" stroke="#2E7D32" stroke-width="2"/>', '#4CAF50'),
      category: 'legs',
      spikePrime: '바퀴 부품 (2개)',
      description: '빠르게 이동할 수 있는 바퀴예요'
    },
    {
      id: 'leg2',
      name: '무한궤도',
      svg: createSVG('<rect x="15" y="30" width="50" height="20" rx="10" fill="#2196F3" stroke="#1565C0" stroke-width="2"/><circle cx="25" cy="40" r="8" fill="#0D47A1"/><circle cx="55" cy="40" r="8" fill="#0D47A1"/><rect x="20" y="35" width="40" height="10" fill="#1976D2"/>', '#2196F3'),
      category: 'legs',
      spikePrime: '무한궤도 부품',
      description: '어려운 지형도 갈 수 있는 무한궤도예요'
    },
    {
      id: 'leg3',
      name: '다리',
      svg: createSVG('<rect x="35" y="25" width="10" height="30" rx="5" fill="#FF9800" stroke="#E65100" stroke-width="2"/><rect x="20" y="50" width="15" height="8" rx="4" fill="#F57C00"/><rect x="45" y="50" width="15" height="8" rx="4" fill="#F57C00"/>', '#FF9800'),
      category: 'legs',
      spikePrime: '다리 부품 (2개)',
      description: '계단도 오를 수 있는 다리예요'
    },
    {
      id: 'leg4',
      name: '프로펠러',
      svg: createSVG('<circle cx="40" cy="40" r="15" fill="#4CAF50" stroke="#2E7D32" stroke-width="2" opacity="0.3"/><line x1="40" y1="25" x2="40" y2="55" stroke="#2E7D32" stroke-width="3"/><line x1="25" y1="40" x2="55" y2="40" stroke="#2E7D32" stroke-width="3"/><line x1="30" y1="30" x2="50" y2="50" stroke="#2E7D32" stroke-width="2"/><line x1="50" y1="30" x2="30" y2="50" stroke="#2E7D32" stroke-width="2"/>', '#4CAF50'),
      category: 'legs',
      spikePrime: '프로펠러 부품 (4개)',
      description: '하늘을 날 수 있는 프로펠러예요'
    }
  ],
  accessories: [
    {
      id: 'acc1',
      name: '물탱크',
      svg: createSVG('<rect x="25" y="20" width="30" height="40" rx="5" fill="#2196F3" stroke="#1565C0" stroke-width="2"/><line x1="30" y1="30" x2="30" y2="50" stroke="#0D47A1" stroke-width="2" stroke-dasharray="2,2"/><circle cx="40" cy="25" r="3" fill="#1565C0"/>', '#2196F3'),
      category: 'accessories',
      spikePrime: '물탱크 부품',
      description: '물을 저장하는 물탱크예요'
    },
    {
      id: 'acc2',
      name: '쓰레기통',
      svg: createSVG('<rect x="28" y="25" width="24" height="35" rx="3" fill="#10B981" stroke="#059669" stroke-width="2"/><rect x="25" y="22" width="30" height="5" rx="2" fill="#047857"/><line x1="32" y1="35" x2="32" y2="55" stroke="#047857" stroke-width="1"/>', '#10B981'),
      category: 'accessories',
      spikePrime: '쓰레기통 부품',
      description: '쓰레기를 담는 통이에요'
    },
    {
      id: 'acc3',
      name: '태양광 패널',
      svg: createSVG('<rect x="20" y="30" width="40" height="20" rx="2" fill="#F59E0B" stroke="#D97706" stroke-width="2"/><line x1="25" y1="35" x2="25" y2="45" stroke="#D97706" stroke-width="1"/><line x1="30" y1="35" x2="30" y2="45" stroke="#D97706" stroke-width="1"/><line x1="35" y1="35" x2="35" y2="45" stroke="#D97706" stroke-width="1"/><line x1="40" y1="35" x2="40" y2="45" stroke="#D97706" stroke-width="1"/><line x1="45" y1="35" x2="45" y2="45" stroke="#D97706" stroke-width="1"/><line x1="50" y1="35" x2="50" y2="45" stroke="#D97706" stroke-width="1"/>', '#F59E0B'),
      category: 'accessories',
      spikePrime: '태양광 패널 부품',
      description: '태양 에너지를 모으는 패널이에요'
    },
    {
      id: 'acc4',
      name: '센서',
      svg: createSVG('<circle cx="40" cy="40" r="18" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/><circle cx="40" cy="40" r="12" fill="#1B5E20" opacity="0.5"/><circle cx="40" cy="40" r="6" fill="#2E7D32"/>', '#4CAF50'),
      category: 'accessories',
      spikePrime: '다양한 센서 모듈',
      description: '환경을 감지하는 센서예요'
    }
  ]
};

// 미션별 추천 부품
export const recommendedParts = {
  water: ['acc1', 'leg1', 'arm2'], // 물탱크, 바퀴, 물통 팔
  garbage: ['acc2', 'arm1', 'leg2'], // 쓰레기통, 집게 팔, 무한궤도
  monitor: ['acc4', 'head2', 'leg4'] // 센서, 카메라 헤드, 프로펠러
};

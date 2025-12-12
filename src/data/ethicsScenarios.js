export const scenarios = [
  {
    id: 1,
    mission: 'water',
    title: '물 배달 중 긴급 상황!',
    situation: '물 배달 로봇이 마을 A와 마을 B 사이에서 고장났어요. 배터리가 한 마을에만 갈 수 있을 만큼 남았어요.',
    image: 'scenario1.svg',
    optionA: {
      title: '마을 A로 가기',
      description: '사람이 많은 마을 (100명)',
      detail: '물이 조금 덜 급해요',
      icon: '🏘️',
      values: ['다수', '효율성']
    },
    optionB: {
      title: '마을 B로 가기', 
      description: '사람이 적은 마을 (10명)',
      detail: '물이 매우 급해요 (아픈 사람들)',
      icon: '🏥',
      values: ['긴급성', '약자보호']
    },
    reflection: '더 많은 사람 vs 더 급한 사람, 어떤 기준이 맞을까요?'
  },
  {
    id: 2,
    mission: 'garbage',
    title: '쓰레기 수거 딜레마!',
    situation: '청소 로봇이 공원에서 쓰레기를 줍고 있어요. 갑자기 강아지 한 마리가 쓰레기 더미 위에서 놀고 있어요.',
    image: 'scenario2.svg',
    optionA: {
      title: '청소 계속하기',
      description: '강아지를 조심스럽게 피해서 청소',
      detail: '시간이 오래 걸리고, 일부 쓰레기를 못 치울 수 있어요',
      icon: '🐕',
      values: ['동물보호', '신중함']
    },
    optionB: {
      title: '청소 멈추기',
      description: '강아지가 떠날 때까지 대기',
      detail: '다른 구역 청소를 못 할 수 있어요',
      icon: '⏸️',
      values: ['안전', '기다림']
    },
    reflection: 'AI는 동물도 보호해야 할까요?'
  },
  {
    id: 3,
    mission: 'garbage',
    title: '재활용 분류 문제!',
    situation: '로봇이 쓰레기를 분류하고 있어요. 어떤 물건은 재활용인지 일반쓰레기인지 확실하지 않아요.',
    image: 'scenario3.svg',
    optionA: {
      title: '재활용으로 분류',
      description: '혹시 재활용되면 좋으니까',
      detail: '잘못 분류하면 재활용 전체가 오염될 수 있어요',
      icon: '♻️',
      values: ['환경보호', '낙관']
    },
    optionB: {
      title: '일반쓰레기로 분류',
      description: '확실하지 않으면 안전하게',
      detail: '재활용 가능한 자원을 버리게 될 수 있어요',
      icon: '🗑️',
      values: ['안전', '신중함']
    },
    reflection: 'AI가 확실하지 않을 때는 어떻게 해야 할까요?'
  },
  {
    id: 4,
    mission: 'monitor',
    title: '오염 발견! 알릴까 말까?',
    situation: '환경 감시 로봇이 작은 공장에서 불법으로 오염물질을 버리는 것을 발견했어요. 이 공장은 마을 사람들이 일하는 곳이에요.',
    image: 'scenario4.svg',
    optionA: {
      title: '바로 신고하기',
      description: '환경을 지키려면 규칙을 지켜야 해요',
      detail: '공장이 문을 닫으면 마을 사람들이 일자리를 잃어요',
      icon: '📢',
      values: ['정의', '환경보호']
    },
    optionB: {
      title: '경고만 하기',
      description: '먼저 공장에 고칠 기회를 줘요',
      detail: '그 사이에 환경 오염이 계속될 수 있어요',
      icon: '⚠️',
      values: ['기회', '균형']
    },
    reflection: '환경 보호와 사람들의 생활 중 뭐가 더 중요할까요?'
  },
  {
    id: 5,
    mission: 'water',
    title: '개인정보 vs 효율!',
    situation: '물 배달 로봇이 더 효율적으로 배달하려면 각 집의 물 사용량 정보가 필요해요.',
    image: 'scenario5.svg',
    optionA: {
      title: '정보 수집하기',
      description: '물 사용량을 기록해서 효율적으로 배달',
      detail: '사람들의 생활 패턴이 로봇에게 알려져요',
      icon: '📊',
      values: ['효율성', '최적화']
    },
    optionB: {
      title: '정보 수집 안 하기',
      description: '모든 집에 똑같이 배달',
      detail: '물이 낭비될 수 있지만 프라이버시는 지켜져요',
      icon: '🔒',
      values: ['프라이버시', '평등']
    },
    reflection: 'AI가 우리 정보를 알면 편리하지만, 어디까지 알아도 될까요?'
  },
  {
    id: 6,
    mission: 'all',
    title: '로봇의 실수!',
    situation: 'AI 로봇이 실수로 어떤 사람의 물건을 망가뜨렸어요. 누가 책임져야 할까요?',
    image: 'scenario6.svg',
    optionA: {
      title: '로봇 제작자 책임',
      description: '로봇을 만든 회사가 책임져야 해요',
      detail: '회사가 로봇을 다시 만들기 어려울 수 있어요',
      icon: '🏭',
      values: ['제작자책임', '품질']
    },
    optionB: {
      title: '로봇 사용자 책임',
      description: '로봇을 사용한 사람이 책임져야 해요',
      detail: '사용자는 로봇 내부를 모르는데 책임지기 어려워요',
      icon: '👤',
      values: ['사용자책임', '관리']
    },
    reflection: 'AI가 실수하면 누구 책임일까요? 🤔'
  }
];

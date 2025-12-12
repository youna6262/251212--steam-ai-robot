import { useState } from 'react';

export default function HelpModal({ page }) {
  const [isOpen, setIsOpen] = useState(false);

  const helpContent = {
    mission: {
      title: '미션 선택 도움말',
      content: (
        <div className="space-y-4">
          <p>1차시에서는 환경보호 미션을 선택해요.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>💧 물 배달 용사: 물이 부족한 지역에 물을 전달해요</li>
            <li>🗑️ 쓰레기 청소 용사: 바다와 땅의 쓰레기를 치워요</li>
            <li>🔍 환경 감시 용사: 대기오염과 수질오염을 감시해요</li>
          </ul>
          <p>미션을 선택하면 다음 단계로 진행할 수 있어요!</p>
        </div>
      )
    },
    designer: {
      title: '로봇 디자이너 도움말',
      content: (
        <div className="space-y-4">
          <p>2차시에서는 선택한 미션에 맞는 로봇을 디자인해요.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>좌측에서 부품을 선택하고 캔버스로 드래그하세요</li>
            <li>부품을 클릭하면 회전하거나 삭제할 수 있어요</li>
            <li>우측에서 로봇 이름과 색상을 설정할 수 있어요</li>
            <li>각 부품에 마우스를 올리면 레고 스파이크 프라임 부품명이 표시돼요</li>
          </ul>
        </div>
      )
    },
    blueprint: {
      title: '전개도 만들기 도움말',
      content: (
        <div className="space-y-4">
          <p>3차시에서는 디자인한 로봇의 전개도를 만들어요.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>전개도를 인쇄해서 실제로 오려 붙일 수 있어요</li>
            <li>PDF나 이미지로 저장할 수 있어요</li>
            <li>조립 설명서를 따라 만들 수 있어요</li>
          </ul>
        </div>
      )
    },
    ethics: {
      title: 'AI 윤리 도움말',
      content: (
        <div className="space-y-4">
          <p>4차시에서는 AI 로봇의 윤리적 선택에 대해 생각해봐요.</p>
          <ul className="list-disc list-inside space-y-2">
            <li>정답은 없어요! 여러분의 생각이 중요해요</li>
            <li>각 선택에는 장단점이 있어요</li>
            <li>친구들과 토론해보면 더 많은 것을 배울 수 있어요</li>
            <li>결과에서 여러분의 가치 성향을 확인할 수 있어요</li>
          </ul>
        </div>
      )
    }
  };

  const content = helpContent[page] || { title: '도움말', content: <p>도움말 내용이 없어요.</p> };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 bg-primary-blue text-white rounded-full shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center text-xl"
        aria-label="도움말"
      >
        ?
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-eco-dark">{content.title}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="text-gray-700">{content.content}</div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-primary-green text-white rounded-xl hover:bg-eco-dark transition-colors"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}











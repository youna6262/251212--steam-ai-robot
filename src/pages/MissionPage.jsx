import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { missions } from '../data/missions';
import { progressManager } from '../utils/progressManager';
import HelpModal from '../components/common/HelpModal';

export default function MissionPage() {
  const [flippedCards, setFlippedCards] = useState({});
  const [selectedMission, setSelectedMission] = useState(null);
  const navigate = useNavigate();

  // localStorage에서 선택된 미션 불러오기
  useEffect(() => {
    const savedMission = progressManager.getMission();
    if (savedMission) {
      setSelectedMission(savedMission);
    }
  }, []);

  const handleCardClick = (missionId) => {
    setFlippedCards(prev => ({
      ...prev,
      [missionId]: !prev[missionId]
    }));
  };

  const handleSelectMission = (mission) => {
    setSelectedMission(mission);
    // progressManager를 통해 저장
    progressManager.saveMission(mission);
  };

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-eco-dark mb-4">🎯 미션 선택</h1>
        <p className="text-xl text-gray-600">
          어떤 환경보호 미션을 수행할 로봇을 만들까요?
        </p>
      </div>

      {/* 미션 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {missions.map((mission) => {
          const isFlipped = flippedCards[mission.id];
          const isSelected = selectedMission?.id === mission.id;

          return (
            <div
              key={mission.id}
              className="relative h-96 perspective-1000 hover:scale-105 transition-transform duration-300"
            >
              {/* 카드 컨테이너 */}
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
                onClick={() => handleCardClick(mission.id)}
              >
                {/* 카드 앞면 */}
                <div
                  className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundColor: mission.color,
                    transform: 'rotateY(0deg)'
                  }}
                >
                  <div className="text-7xl mb-4">{mission.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-3 text-center">
                    {mission.title}
                  </h3>
                  <p className="text-white text-center text-lg opacity-90">
                    {mission.description}
                  </p>
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-green-500 text-xl">✓</span>
                    </div>
                  )}
                  <div className="mt-4 text-white text-sm opacity-75">
                    클릭하여 자세히 보기
                  </div>
                </div>

                {/* 카드 뒷면 */}
                <div
                  className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl p-6 flex flex-col"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{mission.icon}</div>
                      <span
                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                        style={{ backgroundColor: mission.color }}
                      >
                        {mission.robotType}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-eco-dark mb-3">
                      {mission.title}
                    </h3>
                    <div className="mb-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                      <p className="text-sm font-semibold text-red-700 mb-1">
                        ⚠️ 환경 문제
                      </p>
                      <p className="text-gray-700 text-sm">{mission.problem}</p>
                    </div>
                    <p className="text-gray-600 mb-4">{mission.description}</p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectMission(mission);
                    }}
                    className="w-full"
                    style={{ backgroundColor: mission.color }}
                  >
                    {isSelected ? '✓ 선택됨' : '이 미션 선택하기'}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 선택된 미션 안내 */}
      {selectedMission && (
        <div className="max-w-2xl mx-auto card bg-gradient-to-r from-primary-green to-primary-blue text-white mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{selectedMission.icon}</div>
            <div>
              <h3 className="text-2xl font-bold mb-1">
                선택한 미션: {selectedMission.title}
              </h3>
              <p className="opacity-90">{selectedMission.description}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/designer')}
            className="bg-white text-eco-dark hover:bg-gray-100 font-bold border-2 border-white"
          >
            로봇 디자인하러 가기 →
          </Button>
        </div>
      )}

      {/* 하단 안내 문구 */}
      <div className="text-center mt-12 p-6 bg-emerald-100 rounded-2xl max-w-3xl mx-auto">
        <div className="text-4xl mb-3">🧱</div>
        <p className="text-lg font-semibold text-eco-dark mb-2">
          레고 스파이크 프라임으로 이런 로봇을 만들 거예요!
        </p>
        <p className="text-gray-600">
          선택한 미션에 맞는 로봇을 디자인하고, 실제로 레고 블록으로 만들어보세요.
        </p>
      </div>
      <HelpModal page="mission" />
    </div>
  );
}

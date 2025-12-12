import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { scenarios } from '../data/ethicsScenarios';
import { progressManager } from '../utils/progressManager';
import { submitToGoogleForm } from '../utils/googleForm';
import html2canvas from 'html2canvas';
import HelpModal from '../components/common/HelpModal';

export default function EthicsPage() {
  const navigate = useNavigate();
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showReflection, setShowReflection] = useState(false);
  const [reflectionText, setReflectionText] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [userName, setUserName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [ethicsPledge, setEthicsPledge] = useState('');
  const resultRef = useRef(null);

  // localStorage에서 이름과 번호 불러오기
  useEffect(() => {
    const savedName = progressManager.getUserName();
    const savedNumber = progressManager.getStudentNumber();
    if (savedName) setUserName(savedName);
    if (savedNumber) setStudentNumber(savedNumber);
  }, []);

  const currentScenario = scenarios[currentScenarioIndex];
  const isLastScenario = currentScenarioIndex === scenarios.length - 1;
  const allScenariosCompleted = Object.keys(selectedOptions).length === scenarios.length;

  // 가치 카운팅
  const calculateValues = () => {
    const valueCounts = {};
    Object.values(selectedOptions).forEach(option => {
      if (option && option.values) {
        option.values.forEach(value => {
          valueCounts[value] = (valueCounts[value] || 0) + 1;
        });
      }
    });
    return valueCounts;
  };

  // 레이더 차트 데이터 계산
  const calculateRadarData = () => {
    const valueCounts = calculateValues();
    return {
      efficiency: (valueCounts['효율성'] || 0) + (valueCounts['최적화'] || 0),
      caution: (valueCounts['신중함'] || 0) + (valueCounts['안전'] || 0),
      majority: (valueCounts['다수'] || 0),
      minority: (valueCounts['약자보호'] || 0) + (valueCounts['긴급성'] || 0),
      environment: (valueCounts['환경보호'] || 0) + (valueCounts['정의'] || 0),
      people: (valueCounts['기회'] || 0) + (valueCounts['균형'] || 0),
      rules: (valueCounts['정의'] || 0) + (valueCounts['제작자책임'] || 0),
      flexibility: (valueCounts['기회'] || 0) + (valueCounts['유연성'] || 0)
    };
  };

  // 유형 분류
  const getUserType = () => {
    const radar = calculateRadarData();
    const total = Object.values(radar).reduce((a, b) => a + b, 0);
    const avg = total / Object.keys(radar).length;
    
    const variance = Object.values(radar).reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / Object.keys(radar).length;
    
    if (variance < 2) {
      return {
        type: '균형잡이',
        description: '모든 가치를 고르게 생각하는 당신! 다양한 관점을 이해하고 균형잡힌 결정을 내려요.',
        emoji: '⚖️'
      };
    } else if (radar.environment > radar.people) {
      return {
        type: '환경지킴이',
        description: '환경 보호를 가장 중요하게 생각하는 당신! 지구를 지키는 것이 우선이에요.',
        emoji: '🌍'
      };
    } else if (radar.people > radar.environment) {
      return {
        type: '사람지킴이',
        description: '사람들의 안전과 행복을 최우선으로 생각하는 당신! 약자와 소수를 보호해요.',
        emoji: '🤝'
      };
    } else {
      return {
        type: '규칙지킴이',
        description: '원칙과 규칙을 중요하게 생각하는 당신! 정의롭고 공정한 세상을 만들어요.',
        emoji: '📜'
      };
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentScenario.id]: option
    });
    setShowReflection(true);
  };

  const handleNext = () => {
    if (isLastScenario) {
      setShowResult(true);
    } else {
      setCurrentScenarioIndex(currentScenarioIndex + 1);
      setShowReflection(false);
    }
  };

  const handleSaveResult = async () => {
    if (!resultRef.current) return;
    
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#f0f9f4',
        scale: 2
      });
      const link = document.createElement('a');
      link.download = '나의-AI-용사-프로필.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  // 결과 저장
  useEffect(() => {
    if (showResult) {
      const userType = getUserType();
      const result = {
        selectedOptions,
        userType,
        pledge: ethicsPledge,
        userName: userName || progressManager.getUserName(),
        completedAt: new Date().toISOString()
      };
      progressManager.saveEthicsResult(result);
      if (userName) {
        progressManager.saveUserName(userName);
      }
    }
  }, [showResult, selectedOptions, ethicsPledge, userName]);

  // Google Form 제출 함수
  const handleSubmitToGoogleForm = async () => {
    const userType = getUserType();
    const mission = progressManager.getMission();
    const progress = progressManager.getProgress();
    
    // localStorage에서 직접 가져오기 (studentName 또는 userName 둘 다 지원)
    const name = localStorage.getItem("studentName") || localStorage.getItem("userName") || userName || '';
    const number = localStorage.getItem("studentNumber") || studentNumber || '';
    
    if (!name || !number) {
      alert('이름과 학생 번호를 입력해주세요.');
      return;
    }
    
    // 미션 형식: "1차시" 또는 missionId
    const missionValue = mission ? (mission.id || mission.title) : '미션 미선택';
    
    // 결과 형식: "환경지킴이 유형" 형식으로
    const resultValue = userType.type ? `${userType.type} 유형` : '미완료';
    
    await submitToGoogleForm({
      name: name,
      number: number,
      mission: missionValue,
      score: progress.progress || 0,
      result: resultValue
    });

    alert("제출 완료! 구글 시트에서 확인할 수 있어요.");
  };

  // 결과 화면
  if (showResult) {
    const userType = getUserType();
    const radar = calculateRadarData();
    const maxValue = Math.max(...Object.values(radar), 1);

    return (
      <div className="min-h-screen bg-emerald-100 py-12">
        <div className="container mx-auto px-4">
          <div ref={resultRef} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            {/* 나의 AI 용사 프로필 */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">{userType.emoji}</div>
              <h1 className="text-4xl font-bold text-eco-dark mb-2">
                {userName ? `${userName}님은` : '당신은'} {userType.type}형 AI 프로그래머!
              </h1>
              <p className="text-lg text-gray-600">{userType.description}</p>
            </div>

            {/* 가치 성향 분석 차트 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-eco-dark mb-4 text-center">
                📊 나의 가치 성향 분석
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">⚡</div>
                  <p className="text-sm font-semibold mb-1">효율성</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-blue h-2 rounded-full"
                      style={{ width: `${(radar.efficiency / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.efficiency}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">🛡️</div>
                  <p className="text-sm font-semibold mb-1">신중함</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-green h-2 rounded-full"
                      style={{ width: `${(radar.caution / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.caution}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">👥</div>
                  <p className="text-sm font-semibold mb-1">다수</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-orange h-2 rounded-full"
                      style={{ width: `${(radar.majority / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.majority}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">🤲</div>
                  <p className="text-sm font-semibold mb-1">소수보호</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${(radar.minority / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.minority}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">🌱</div>
                  <p className="text-sm font-semibold mb-1">환경</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(radar.environment / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.environment}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
                  <p className="text-sm font-semibold mb-1">사람</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: `${(radar.people / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.people}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">📋</div>
                  <p className="text-sm font-semibold mb-1">규칙</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${(radar.rules / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.rules}</p>
                </div>
                <div className="text-center p-4 bg-emerald-100 rounded-xl">
                  <div className="text-2xl mb-2">🔄</div>
                  <p className="text-sm font-semibold mb-1">유연성</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(radar.flexibility / maxValue) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{radar.flexibility}</p>
                </div>
              </div>
            </div>

            {/* 성찰 메시지 */}
            <div className="mb-8 p-6 bg-gradient-to-r from-primary-blue to-primary-green rounded-xl text-white">
              <h3 className="text-xl font-bold mb-2">💭 성찰 메시지</h3>
              <p className="leading-relaxed">
                AI를 만들 때는 정답이 하나가 아니에요. 여러분이 선택한 가치들이 모여서 
                여러분만의 AI 윤리를 만들어요. 친구들과 서로 다른 선택을 비교해보고 
                토론해보면 더 많은 것을 배울 수 있어요!
              </p>
            </div>

            {/* AI 윤리 배움 정리 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-eco-dark mb-4 text-center">
                📚 오늘 배운 AI 윤리
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-bold text-eco-dark mb-2">AI는 프로그래머의 가치관을 담아요</h3>
                  <p className="text-sm text-gray-600">
                    로봇이 선택하는 것은 만든 사람의 생각이 반영돼요
                  </p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-3">⚖️</div>
                  <h3 className="font-bold text-eco-dark mb-2">정답이 없는 문제도 있어요</h3>
                  <p className="text-sm text-gray-600">
                    모든 선택에는 장단점이 있어요. 완벽한 답은 없어요
                  </p>
                </div>
                <div className="card text-center">
                  <div className="text-4xl mb-3">🤝</div>
                  <h3 className="font-bold text-eco-dark mb-2">함께 토론하고 결정해요</h3>
                  <p className="text-sm text-gray-600">
                    다양한 의견을 듣고 함께 결정하는 것이 중요해요
                  </p>
                </div>
              </div>
            </div>

            {/* AI 윤리 서약서 */}
            <div className="mb-8 p-6 bg-emerald-100 rounded-xl">
              <h3 className="text-xl font-bold text-eco-dark mb-4 text-center">
                ✍️ AI 윤리 서약서
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  나는 AI를 만들 때
                </label>
                <input
                  type="text"
                  value={ethicsPledge}
                  onChange={(e) => setEthicsPledge(e.target.value)}
                  placeholder="예: 환경 보호를"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none text-center text-lg"
                />
                <p className="text-center text-gray-600 mt-2">
                  를 가장 중요하게 생각하겠습니다.
                </p>
              </div>
              {ethicsPledge && (
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-primary-green">
                  <p className="text-center font-semibold text-eco-dark">
                    "나는 AI를 만들 때 <span className="text-primary-green">{ethicsPledge}</span>을(를) 
                    가장 중요하게 생각하겠습니다."
                  </p>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    - {userName || 'AI 용사'} 서명
                  </p>
                </div>
              )}
            </div>

            {/* 공유하기 버튼 */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" onClick={handleSaveResult}>
                📸 결과 이미지 저장
              </Button>
              <Button variant="secondary" onClick={handleSubmitToGoogleForm}>
                📤 구글 폼 제출
              </Button>
              <Button variant="secondary" onClick={() => window.print()}>
                🖨️ 인쇄하기
              </Button>
              <Button variant="orange" onClick={() => {
                setShowResult(false);
                setCurrentScenarioIndex(0);
                setSelectedOptions({});
                setShowReflection(false);
                setReflectionText({});
              }}>
                🔄 다시 하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 시나리오 화면
  const selectedOption = selectedOptions[currentScenario.id];

  return (
    <div className="min-h-screen bg-emerald-100 py-12">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-eco-dark mb-4">
            ⚖️ AI 용사의 윤리적 선택
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            여러분이 만든 AI 용사 로봇이 미션을 수행하다가 어려운 상황에 놓였어요!
          </p>
          <p className="text-lg text-gray-500">
            로봇은 어떤 선택을 해야 할까요? 여러분이 로봇의 프로그래머가 되어 결정해주세요.
          </p>
          {(!userName || !studentNumber) && currentScenarioIndex === 0 && (
            <div className="mt-4 max-w-md mx-auto space-y-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => {
                  setUserName(e.target.value);
                  if (e.target.value) {
                    progressManager.saveUserName(e.target.value);
                  }
                }}
                placeholder="이름을 입력하세요 (선택사항)"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none text-center"
              />
              <input
                type="text"
                value={studentNumber}
                onChange={(e) => {
                  setStudentNumber(e.target.value);
                  if (e.target.value) {
                    progressManager.saveStudentNumber(e.target.value);
                  }
                }}
                placeholder="학생 번호를 입력하세요 (선택사항)"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none text-center"
              />
            </div>
          )}
          <div className="mt-4 inline-block px-4 py-2 bg-white rounded-full shadow-md">
            <span className="text-sm font-semibold text-eco-dark">
              시나리오 {currentScenarioIndex + 1} / {scenarios.length}
            </span>
          </div>
        </div>

        {/* 시나리오 카드 */}
        <div className="max-w-4xl mx-auto">
          <div className="card mb-6">
            {/* 상황 설명 */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-eco-dark mb-4 text-center">
                {currentScenario.title}
              </h2>
              <div className="bg-emerald-100 p-6 rounded-xl mb-6">
                <p className="text-lg text-gray-700 leading-relaxed text-center">
                  {currentScenario.situation}
                </p>
              </div>
            </div>

            {/* 선택 버튼 */}
            {!showReflection && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 옵션 A */}
                <button
                  onClick={() => handleOptionSelect(currentScenario.optionA)}
                  className="p-6 bg-white border-4 border-primary-blue rounded-2xl hover:border-primary-green hover:shadow-xl transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{currentScenario.optionA.icon}</div>
                    <div className="px-4 py-2 bg-primary-blue text-white rounded-full font-bold">
                      A
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-eco-dark mb-2">
                    {currentScenario.optionA.title}
                  </h3>
                  <p className="text-gray-700 mb-2 font-semibold">
                    {currentScenario.optionA.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentScenario.optionA.detail}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentScenario.optionA.values.map((value, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </button>

                {/* 옵션 B */}
                <button
                  onClick={() => handleOptionSelect(currentScenario.optionB)}
                  className="p-6 bg-white border-4 border-primary-orange rounded-2xl hover:border-primary-green hover:shadow-xl transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-5xl">{currentScenario.optionB.icon}</div>
                    <div className="px-4 py-2 bg-primary-orange text-white rounded-full font-bold">
                      B
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-eco-dark mb-2">
                    {currentScenario.optionB.title}
                  </h3>
                  <p className="text-gray-700 mb-2 font-semibold">
                    {currentScenario.optionB.description}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentScenario.optionB.detail}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {currentScenario.optionB.values.map((value, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </button>
              </div>
            )}

            {/* 선택 후 화면 */}
            {showReflection && selectedOption && (
              <div className="mt-6 space-y-6">
                <div className="p-6 bg-gradient-to-r from-primary-green to-primary-blue rounded-xl text-white">
                  <h3 className="text-2xl font-bold mb-3 text-center">
                    ✅ {selectedOption.title}을(를) 선택했어요!
                  </h3>
                  <div className="text-center mb-4">
                    <div className="text-5xl mb-2">{selectedOption.icon}</div>
                    <p className="text-lg opacity-90">{selectedOption.description}</p>
                  </div>
                </div>

                {/* 가치 분석 */}
                <div className="p-6 bg-emerald-100 rounded-xl">
                  <h4 className="text-lg font-bold text-eco-dark mb-3">
                    💎 이런 가치를 중요하게 생각했어요
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOption.values.map((value, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-primary-green text-white rounded-full font-semibold"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 성찰 질문 */}
                <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-xl">
                  <h4 className="text-lg font-bold text-eco-dark mb-3">
                    🤔 생각해보기
                  </h4>
                  <p className="text-gray-700 mb-4 text-lg">
                    {currentScenario.reflection}
                  </p>
                  <textarea
                    value={reflectionText[currentScenario.id] || ''}
                    onChange={(e) => setReflectionText({
                      ...reflectionText,
                      [currentScenario.id]: e.target.value
                    })}
                    placeholder="왜 이렇게 생각했는지 적어보세요... (선택사항)"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none resize-none"
                    rows={3}
                  />
                </div>

                {/* 다음 버튼 */}
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={handleNext}
                    className="text-lg px-8 py-4"
                  >
                    {isLastScenario ? '결과 보기 🎉' : '다음 상황으로 →'}
                  </Button>
                </div>
              </div>
            )}

            {/* 안내 문구 */}
            {!showReflection && (
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
                <p className="text-sm text-gray-600">
                  💡 <strong>알아두세요:</strong> 정답은 없어요! 여러분의 생각이 중요해요.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <HelpModal page="ethics" />
    </div>
  );
}

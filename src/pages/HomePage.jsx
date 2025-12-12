import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/common/Button';
import { progressManager } from '../utils/progressManager';

export default function HomePage() {
  const [hasProgress, setHasProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressData = progressManager.getProgress();
    setProgress(progressData.progress);
    setHasProgress(progressData.progress > 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-eco-dark mb-4">
            🌍 지구를 지키는 AI 용사들
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            환경을 지키는 나만의 로봇을 만들어보자!
          </p>
          
          {/* 에코봇 마스코트 영역 */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-48 h-48 bg-gradient-to-br from-primary-green to-primary-blue rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                <span className="text-8xl">🤖</span>
              </div>
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-lg font-bold text-eco-dark">에코봇</span>
              </div>
            </div>
          </div>

          {/* 진행 상황 표시 */}
          {hasProgress && (
            <div className="mb-6 max-w-md mx-auto">
              <div className="card bg-gradient-to-r from-primary-green to-primary-blue text-white">
                <p className="text-lg font-semibold mb-2">이어서 학습하기</p>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-3 mb-2">
                  <div
                    className="bg-white h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm">진행률: {progress}%</p>
                <div className="mt-4 flex justify-center space-x-2">
                  {progressManager.getMission() && (
                    <Link to="/mission">
                      <Button variant="secondary" className="text-sm py-2 px-4 bg-white text-eco-dark hover:bg-gray-100 font-bold">
                        미션
                      </Button>
                    </Link>
                  )}
                  {progressManager.getRobotDesign() && (
                    <Link to="/designer">
                      <Button variant="secondary" className="text-sm py-2 px-4 bg-white text-eco-dark hover:bg-gray-100 font-bold">
                        디자인
                      </Button>
                    </Link>
                  )}
                  {progressManager.getEthicsResult() && (
                    <Link to="/ethics">
                      <Button variant="secondary" className="text-sm py-2 px-4 bg-white text-eco-dark hover:bg-gray-100 font-bold">
                        AI윤리
                      </Button>
                    </Link>
                  )}
                  <Link to="/portfolio">
                    <Button variant="secondary" className="text-sm py-2 px-4 bg-white text-eco-dark hover:bg-gray-100 font-bold">
                      포트폴리오
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* 미션 시작하기 버튼 */}
          <Link to="/mission">
            <Button variant="primary" className="text-xl px-10 py-5">
              {hasProgress ? '새로 시작하기 🚀' : '미션 시작하기 🚀'}
            </Button>
          </Link>
        </div>

        {/* 소개 카드 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* 물 부족 해결 로봇 */}
          <div className="card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 text-center">💧</div>
            <h3 className="text-2xl font-bold text-eco-dark mb-3 text-center">
              물 부족 해결 로봇
            </h3>
            <p className="text-gray-600 text-center">
              물이 부족한 지역에 깨끗한 물을 안전하게 전달하는 로봇이에요.
              먼 곳까지 물을 운반하여 많은 사람들을 도와줄 수 있어요.
            </p>
          </div>

          {/* 쓰레기 수거 로봇 */}
          <div className="card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 text-center">🗑️</div>
            <h3 className="text-2xl font-bold text-eco-dark mb-3 text-center">
              쓰레기 수거 로봇
            </h3>
            <p className="text-gray-600 text-center">
              바다와 땅에 버려진 쓰레기를 찾아서 수거하는 로봇이에요.
              환경을 깨끗하게 만들어 지구를 보호할 수 있어요.
            </p>
          </div>

          {/* 환경 감시 로봇 */}
          <div className="card hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="text-6xl mb-4 text-center">🌱</div>
            <h3 className="text-2xl font-bold text-eco-dark mb-3 text-center">
              환경 감시 로봇
            </h3>
            <p className="text-gray-600 text-center">
              대기오염과 수질오염을 실시간으로 감시하는 로봇이에요.
              환경 문제를 미리 발견하여 예방할 수 있어요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

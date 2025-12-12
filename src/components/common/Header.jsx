import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { progressManager } from '../../utils/progressManager';

export default function Header() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const progressData = progressManager.getProgress();
      setProgress(progressData.progress);
    };
    updateProgress();
    // 주기적으로 업데이트
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* 상단: 로고와 진행률 */}
        <div className="flex items-center justify-between mb-2">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-green rounded-full flex items-center justify-center">
              <span className="text-xl md:text-2xl">🤖</span>
            </div>
            <h1 className="text-lg md:text-2xl font-bold text-eco-dark">
              지구를 지키는 AI 용사들
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/portfolio" className="text-sm md:text-base px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors">
              📚 포트폴리오
            </Link>
            <Link to="/teacher" className="text-sm md:text-base px-3 py-1 rounded-lg hover:bg-emerald-100 transition-colors">
              👨‍🏫 선생님
            </Link>
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs md:text-sm text-gray-600 mb-1">
            <span>학습 진행률</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 md:h-3">
            <div
              className="bg-gradient-to-r from-primary-green to-primary-blue h-2 md:h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 네비게이션 탭 */}
        <nav className="flex flex-wrap gap-2 md:gap-4">
          <Link
            to="/mission"
            className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
              isActive('/mission')
                ? 'bg-primary-green text-white font-semibold'
                : 'hover:bg-emerald-100 text-gray-700'
            }`}
          >
            🎯 1차시: 미션
          </Link>
          <Link
            to="/designer"
            className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
              isActive('/designer')
                ? 'bg-primary-green text-white font-semibold'
                : 'hover:bg-emerald-100 text-gray-700'
            }`}
          >
            🎨 2차시: 디자인
          </Link>
          <Link
            to="/blueprint"
            className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
              isActive('/blueprint')
                ? 'bg-primary-green text-white font-semibold'
                : 'hover:bg-emerald-100 text-gray-700'
            }`}
          >
            📐 3차시: 전개도
          </Link>
          <Link
            to="/ethics"
            className={`px-3 md:px-4 py-2 rounded-xl transition-colors text-sm md:text-base ${
              isActive('/ethics')
                ? 'bg-primary-green text-white font-semibold'
                : 'hover:bg-emerald-100 text-gray-700'
            }`}
          >
            ⚖️ 4차시: AI윤리
          </Link>
        </nav>
      </div>
    </header>
  );
}

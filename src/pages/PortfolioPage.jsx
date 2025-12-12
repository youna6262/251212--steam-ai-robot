import { useEffect, useState, useRef } from 'react';
import { progressManager } from '../utils/progressManager';
import { missions } from '../data/missions';
import Button from '../components/common/Button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState(null);
  const portfolioRef = useRef(null);

  useEffect(() => {
    const data = progressManager.getPortfolioData();
    setPortfolioData(data);
  }, []);

  const handleSavePDF = async () => {
    if (!portfolioRef.current) return;

    try {
      const canvas = await html2canvas(portfolioRef.current, {
        backgroundColor: '#f0f9f4',
        scale: 2
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('나의-학습-포트폴리오.pdf');
    } catch (error) {
      console.error('PDF 저장 실패:', error);
      alert('PDF 저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-eco-dark mb-4">📚 학습 포트폴리오</h1>
          <p className="text-xl text-gray-600">아직 활동 기록이 없어요. 미션을 시작해보세요!</p>
        </div>
      </div>
    );
  }

  const { userName, mission, robotDesign, ethicsResult, progress } = portfolioData;
  const missionData = mission ? missions.find(m => m.id === mission.id) : null;

  return (
    <div className="min-h-screen bg-emerald-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-eco-dark mb-2">📚 학습 포트폴리오</h1>
          <p className="text-lg text-gray-600">{userName || '학생'}님의 학습 기록</p>
        </div>

        <div ref={portfolioRef} className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* 헤더 */}
          <div className="text-center border-b-2 border-eco-light pb-6">
            <h2 className="text-3xl font-bold text-eco-dark mb-2">
              지구를 지키는 AI 용사들
            </h2>
            <p className="text-gray-600">학습 포트폴리오</p>
            <p className="text-sm text-gray-500 mt-2">
              작성일: {new Date().toLocaleDateString('ko-KR')}
            </p>
          </div>

          {/* 나의 미션 */}
          {mission && (
            <div className="card">
              <h3 className="text-2xl font-bold text-eco-dark mb-4">🎯 나의 미션</h3>
              {missionData && (
                <div className="p-6 rounded-xl" style={{ backgroundColor: `${missionData.color}20` }}>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-5xl">{missionData.icon}</span>
                    <div>
                      <h4 className="text-xl font-bold text-eco-dark">{missionData.title}</h4>
                      <p className="text-gray-600">{missionData.description}</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>환경 문제:</strong> {missionData.problem}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 나의 로봇 */}
          {robotDesign && (
            <div className="card">
              <h3 className="text-2xl font-bold text-eco-dark mb-4">🤖 나의 로봇</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-eco-dark mb-2">
                    로봇 이름: {robotDesign.name || '이름 없음'}
                  </h4>
                  {robotDesign.description && (
                    <p className="text-gray-700 bg-emerald-100 p-4 rounded-lg">
                      {robotDesign.description}
                    </p>
                  )}
                </div>
                <div className="bg-gray-100 p-8 rounded-xl text-center">
                  <p className="text-gray-500">로봇 디자인 이미지</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {robotDesign.parts?.length || 0}개의 부품으로 구성됨
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 나의 AI 윤리 성향 */}
          {ethicsResult && (
            <div className="card">
              <h3 className="text-2xl font-bold text-eco-dark mb-4">⚖️ 나의 AI 윤리 성향</h3>
              <div className="space-y-4">
                {ethicsResult.userType && (
                  <div className="p-6 bg-gradient-to-r from-primary-green to-primary-blue rounded-xl text-white text-center">
                    <div className="text-5xl mb-2">{ethicsResult.userType.emoji}</div>
                    <h4 className="text-2xl font-bold mb-2">{ethicsResult.userType.type}형</h4>
                    <p>{ethicsResult.userType.description}</p>
                  </div>
                )}
                {ethicsResult.pledge && (
                  <div className="p-4 bg-emerald-100 rounded-lg">
                    <p className="text-gray-700">
                      <strong>AI 윤리 서약:</strong> {ethicsResult.pledge}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 전체 활동 타임라인 */}
          <div className="card">
            <h3 className="text-2xl font-bold text-eco-dark mb-4">📅 활동 타임라인</h3>
            <div className="space-y-4">
              {mission && (
                <div className="flex items-start space-x-4 p-4 bg-emerald-100 rounded-lg">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-eco-dark">1차시: 미션 선택 완료</p>
                    <p className="text-sm text-gray-600">{mission.title} 선택</p>
                  </div>
                </div>
              )}
              {robotDesign && (
                <div className="flex items-start space-x-4 p-4 bg-emerald-100 rounded-lg">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-eco-dark">2차시: 로봇 디자인 완료</p>
                    <p className="text-sm text-gray-600">{robotDesign.name} 디자인 완료</p>
                  </div>
                </div>
              )}
              {robotDesign && (
                <div className="flex items-start space-x-4 p-4 bg-emerald-100 rounded-lg">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-eco-dark">3차시: 전개도 만들기 완료</p>
                    <p className="text-sm text-gray-600">전개도 생성 완료</p>
                  </div>
                </div>
              )}
              {ethicsResult && (
                <div className="flex items-start space-x-4 p-4 bg-emerald-100 rounded-lg">
                  <div className="text-2xl">✅</div>
                  <div>
                    <p className="font-semibold text-eco-dark">4차시: AI 윤리 학습 완료</p>
                    <p className="text-sm text-gray-600">{ethicsResult.userType?.type}형으로 분류됨</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 진행률 */}
          <div className="card">
            <h3 className="text-2xl font-bold text-eco-dark mb-4">📊 전체 진행률</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>학습 진행률</span>
                <span className="font-semibold">{progress.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-primary-green to-primary-blue h-4 rounded-full transition-all"
                  style={{ width: `${progress.progress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 저장 버튼 */}
        <div className="mt-8 text-center">
          <Button variant="primary" onClick={handleSavePDF} className="mr-4">
            📄 PDF로 저장
          </Button>
          <Button variant="secondary" onClick={() => window.print()}>
            🖨️ 인쇄하기
          </Button>
        </div>
      </div>
    </div>
  );
}











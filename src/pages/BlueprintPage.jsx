import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import Button from '../components/common/Button';
import HelpModal from '../components/common/HelpModal';
import { progressManager } from '../utils/progressManager';
import { missions } from '../data/missions';

export default function BlueprintPage() {
  const navigate = useNavigate();
  const blueprintRef = useRef(null);
  const [style, setStyle] = useState('color');
  const [size, setSize] = useState(100);
  const [studentName, setStudentName] = useState('');
  const [robotDesign, setRobotDesign] = useState(null);
  const [selectedMission, setSelectedMission] = useState(null);

  useEffect(() => {
    // 저장된 데이터 불러오기
    const savedDesign = progressManager.getRobotDesign();
    const savedMission = progressManager.getMission();
    const savedName = progressManager.getUserName();

    if (savedDesign) {
      setRobotDesign(savedDesign);
    }
    if (savedMission) {
      setSelectedMission(savedMission);
    }
    if (savedName) {
      setStudentName(savedName);
    }
  }, []);

  const mission = selectedMission ? missions.find(m => m.id === selectedMission.id) : null;
  
  // 안전한 기본값 설정
  const safeRobotDesign = {
    name: robotDesign?.name || '나만의 로봇',
    color: robotDesign?.color || '#22c55e',
    description: robotDesign?.description || '',
    parts: robotDesign?.parts || []
  };

  const getMainColor = () => {
    if (style === 'coloring') return '#ffffff';
    if (style === 'bw') return '#999999';
    return safeRobotDesign.color;
  };

  const getSecondaryColor = () => {
    if (style === 'coloring') return '#ffffff';
    if (style === 'bw') return '#bbbbbb';
    return safeRobotDesign.color;
  };

  // 배경색에 따라 텍스트 색상 결정 (밝은 배경에는 어두운 텍스트, 어두운 배경에는 밝은 텍스트)
  const getTextColor = (backgroundColor) => {
    if (style === 'coloring') return '#333333'; // 색칠용은 항상 어두운 텍스트
    if (style === 'bw') return '#ffffff'; // 흑백은 어두운 배경에 밝은 텍스트
    
    // 배경색이 흰색이면 어두운 텍스트
    if (backgroundColor === '#ffffff') {
      return '#333333';
    }
    
    // 배경색의 밝기 계산 (간단한 휴리스틱)
    const hex = backgroundColor.replace('#', '');
    if (hex.length !== 6) return '#333333'; // 잘못된 색상 코드는 기본값
    
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    
    // 밝기가 128보다 크면 어두운 텍스트, 작으면 밝은 텍스트
    return brightness > 128 ? '#333333' : '#ffffff';
  };

  const downloadImage = async () => {
    if (!blueprintRef.current) {
      alert('전개도를 먼저 디자인해주세요!');
      return;
    }
    
    try {
      const canvas = await html2canvas(blueprintRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        logging: false
      });
      const link = document.createElement('a');
      link.download = `${safeRobotDesign.name || 'AI로봇'}_전개도.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('이미지 저장 실패:', error);
      alert('이미지 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setStudentName(name);
    if (name) {
      progressManager.saveUserName(name);
    }
  };

  const handleNavigateToEthics = () => {
    navigate('/ethics');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">📐 로봇 전개도</h1>
          <p className="text-gray-600">디자인한 로봇을 종이로 만들어보세요!</p>
        </div>

        {!robotDesign ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📐</div>
            <p className="text-lg text-gray-600 mb-4">
              먼저 로봇을 디자인해주세요!
            </p>
            <Button variant="primary" onClick={() => navigate('/designer')}>
              로봇 디자인하러 가기 →
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* 옵션 패널 */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-lg p-4">
                <h3 className="text-lg font-bold text-gray-700 mb-3">⚙️ 설정</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">만든 사람</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={handleNameChange}
                      placeholder="이름을 입력하세요"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-emerald-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">전개도 스타일</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'color', name: '컬러', icon: '🎨' },
                        { id: 'bw', name: '흑백', icon: '⬜' },
                        { id: 'coloring', name: '색칠용', icon: '✏️' }
                      ].map(s => (
                        <button
                          key={s.id}
                          onClick={() => setStyle(s.id)}
                          className={`py-2 rounded-xl text-sm transition-all ${
                            style === s.id
                              ? 'bg-emerald-500 text-white'
                              : 'bg-gray-100 hover:bg-emerald-100'
                          }`}
                        >
                          {s.icon} {s.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 mb-2 block">크기: {size}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* 조립 설명서 */}
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4">
                <h3 className="text-lg font-bold text-blue-800 mb-3">📋 조립 방법</h3>
                <ol className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                    <span>전개도를 두꺼운 종이에 인쇄해요 ✂️</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                    <span>실선을 따라 오려요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                    <span>점선을 따라 접어요</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">4</span>
                    <span>탭에 풀을 발라 붙여요 🎉</span>
                  </li>
                </ol>
              </div>

              {/* 버튼 */}
              <div className="space-y-2">
                <button
                  onClick={downloadImage}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  📥 이미지로 저장
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-full py-3 bg-gray-700 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors"
                >
                  🖨️ 인쇄하기
                </button>
                <button
                  onClick={handleNavigateToEthics}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  ⚖️ AI 윤리 배우기 →
                </button>
              </div>
            </div>

            {/* 전개도 미리보기 */}
            <div className="lg:col-span-2">
              <div 
                ref={blueprintRef}
                className="bg-white rounded-2xl shadow-lg p-6 origin-top-left"
                style={{ transform: `scale(${size / 100})` }}
              >
                {/* 제목 */}
                <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    🤖 {safeRobotDesign.name} 전개도
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    {mission?.title || '환경 보호'} 미션
                  </p>
                </div>

                {/* 전개도 SVG */}
                <div className="flex justify-center">
                  <svg 
                    viewBox="0 0 400 500" 
                    className="w-full max-w-md"
                    style={{ maxHeight: '500px' }}
                  >
                    {/* 배경 그리드 */}
                    <defs>
                      <pattern id="blueprintGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eeeeee" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="500" fill="url(#blueprintGrid)"/>
                    
                    {/* 상단면 */}
                    <g transform="translate(100, 10)">
                      <rect 
                        x="0" y="0" width="100" height="60" 
                        fill={getSecondaryColor()} 
                        stroke="#333333" 
                        strokeWidth="2"
                        opacity="0.9"
                      />
                      <text x="50" y="35" textAnchor="middle" fontSize="12" fill={getTextColor(getSecondaryColor())}>
                        상단
                      </text>
                      {/* 접기 탭 - 왼쪽 */}
                      <polygon 
                        points="0,0 -15,-10 -15,10" 
                        fill={style === 'coloring' ? '#ffffff' : '#cccccc'} 
                        stroke="#333333" 
                        strokeDasharray="3"
                      />
                      {/* 접기 탭 - 오른쪽 */}
                      <polygon 
                        points="100,0 115,-10 115,10" 
                        fill={style === 'coloring' ? '#ffffff' : '#cccccc'} 
                        stroke="#333333" 
                        strokeDasharray="3"
                      />
                    </g>
                    
                    {/* 본체 전개 */}
                    <g transform="translate(0, 80)">
                      {/* 왼쪽 측면 */}
                      <rect 
                        x="0" y="0" width="100" height="100" 
                        fill={getSecondaryColor()} 
                        stroke="#333333" 
                        strokeWidth="2" 
                        opacity="0.85"
                      />
                      <text x="50" y="55" textAnchor="middle" fontSize="12" fill={getTextColor(getSecondaryColor())}>
                        좌측
                      </text>
                      
                      {/* 정면 */}
                      <rect 
                        x="100" y="0" width="100" height="100" 
                        fill={getMainColor()} 
                        stroke="#333333" 
                        strokeWidth="2"
                      />
                      {/* 눈 */}
                      <circle cx="130" cy="40" r="12" fill="#ffffff" stroke="#333333"/>
                      <circle cx="170" cy="40" r="12" fill="#ffffff" stroke="#333333"/>
                      <circle cx="130" cy="40" r="5" fill="#333333"/>
                      <circle cx="170" cy="40" r="5" fill="#333333"/>
                      {/* 입 */}
                      <rect x="125" y="65" width="50" height="8" rx="4" fill="#ffffff" stroke="#333333"/>
                      <text x="150" y="95" textAnchor="middle" fontSize="10" fill={getTextColor(getMainColor())}>
                        정면
                      </text>
                      
                      {/* 오른쪽 측면 */}
                      <rect 
                        x="200" y="0" width="100" height="100" 
                        fill={getSecondaryColor()} 
                        stroke="#333333" 
                        strokeWidth="2" 
                        opacity="0.85"
                      />
                      <text x="250" y="55" textAnchor="middle" fontSize="12" fill={getTextColor(getSecondaryColor())}>
                        우측
                      </text>
                      
                      {/* 후면 */}
                      <rect 
                        x="300" y="0" width="100" height="100" 
                        fill={getSecondaryColor()} 
                        stroke="#333333" 
                        strokeWidth="2" 
                        opacity="0.8"
                      />
                      <text x="350" y="55" textAnchor="middle" fontSize="12" fill={getTextColor(getSecondaryColor())}>
                        후면
                      </text>
                      {/* 후면 접기 탭 */}
                      <polygon 
                        points="400,0 415,10 415,90 400,100" 
                        fill={style === 'coloring' ? '#ffffff' : '#cccccc'} 
                        stroke="#333333" 
                        strokeDasharray="3"
                      />
                    </g>
                    
                    {/* 하단면 */}
                    <g transform="translate(100, 190)">
                      <rect 
                        x="0" y="0" width="100" height="60" 
                        fill={getSecondaryColor()} 
                        stroke="#333333" 
                        strokeWidth="2" 
                        opacity="0.8"
                      />
                      <text x="50" y="35" textAnchor="middle" fontSize="12" fill={getTextColor(getSecondaryColor())}>
                        하단
                      </text>
                    </g>
                    
                    {/* 팔 */}
                    <g transform="translate(30, 280)">
                      <text x="60" y="0" fontSize="14" fill="#666666">팔 (2개 필요)</text>
                      {/* 팔 1 */}
                      <rect 
                        x="0" y="10" width="40" height="80" rx="5"
                        fill={style === 'coloring' ? '#ffffff' : (style === 'bw' ? '#999999' : '#f97316')} 
                        stroke="#333333" 
                        strokeWidth="2"
                      />
                      <circle cx="20" cy="85" r="15" fill={style === 'coloring' ? '#ffffff' : '#666666'} stroke="#333333"/>
                      <rect x="40" y="20" width="15" height="25" fill={style === 'coloring' ? '#ffffff' : '#cccccc'} stroke="#333333" strokeDasharray="3"/>
                      
                      {/* 팔 2 */}
                      <rect 
                        x="80" y="10" width="40" height="80" rx="5"
                        fill={style === 'coloring' ? '#ffffff' : (style === 'bw' ? '#999999' : '#f97316')} 
                        stroke="#333333" 
                        strokeWidth="2"
                      />
                      <circle cx="100" cy="85" r="15" fill={style === 'coloring' ? '#ffffff' : '#666666'} stroke="#333333"/>
                      <rect x="120" y="20" width="15" height="25" fill={style === 'coloring' ? '#ffffff' : '#cccccc'} stroke="#333333" strokeDasharray="3"/>
                    </g>
                    
                    {/* 바퀴 */}
                    <g transform="translate(200, 280)">
                      <text x="80" y="0" fontSize="14" fill="#666666">바퀴 (4개 필요)</text>
                      {[0, 55, 110, 165].map((xPos, index) => (
                        <g key={`wheel-${index}`} transform={`translate(${xPos}, 10)`}>
                          <circle 
                            cx="20" cy="35" r="30" 
                            fill={style === 'coloring' ? '#ffffff' : (style === 'bw' ? '#666666' : '#333333')} 
                            stroke="#333333" 
                            strokeWidth="2"
                          />
                          <circle cx="20" cy="35" r="18" fill={style === 'coloring' ? '#ffffff' : '#888888'}/>
                          <circle cx="20" cy="35" r="6" fill={style === 'coloring' ? '#ffffff' : '#aaaaaa'}/>
                        </g>
                      ))}
                    </g>
                    
                    {/* 점선 가이드 */}
                    <line x1="100" y1="80" x2="100" y2="180" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                    <line x1="200" y1="80" x2="200" y2="180" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                    <line x1="300" y1="80" x2="300" y2="180" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                    <line x1="100" y1="70" x2="200" y2="70" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                    <line x1="100" y1="180" x2="200" y2="180" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                    
                    {/* 범례 */}
                    <g transform="translate(20, 420)">
                      <line x1="0" y1="0" x2="30" y2="0" stroke="#333333" strokeWidth="2"/>
                      <text x="40" y="5" fontSize="10" fill="#666666">자르는 선</text>
                      
                      <line x1="100" y1="0" x2="130" y2="0" stroke="#999999" strokeDasharray="5" strokeWidth="1"/>
                      <text x="140" y="5" fontSize="10" fill="#666666">접는 선</text>
                      
                      <rect x="220" y="-8" width="20" height="16" fill="#cccccc" stroke="#333333" strokeDasharray="3"/>
                      <text x="250" y="5" fontSize="10" fill="#666666">풀칠 탭</text>
                    </g>
                  </svg>
                </div>

                {/* 로봇 정보 카드 */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-300">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">로봇 이름:</span>
                      <span className="ml-2 font-medium">{safeRobotDesign.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">만든 사람:</span>
                      <span className="ml-2 font-medium">{studentName || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">미션:</span>
                      <span className="ml-2 font-medium">{mission?.title || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">제작일:</span>
                      <span className="ml-2 font-medium">{new Date().toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  {safeRobotDesign.description && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                      <span className="text-gray-500 text-sm">로봇 기능: </span>
                      <span className="text-sm">{safeRobotDesign.description}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <HelpModal page="blueprint" />
    </div>
  );
}

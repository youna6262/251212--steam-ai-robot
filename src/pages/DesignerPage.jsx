import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Group, Circle, Text } from 'react-konva';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { robotParts, recommendedParts } from '../data/robotParts';
import { missions } from '../data/missions';
import { progressManager } from '../utils/progressManager';
import HelpModal from '../components/common/HelpModal';

const CANVAS_SIZE = 600;
const GRID_SIZE = 20;

export default function DesignerPage() {
  const navigate = useNavigate();
  const [selectedMission, setSelectedMission] = useState(null);
  const [robotName, setRobotName] = useState('나만의 로봇');
  const [robotColor, setRobotColor] = useState('#4CAF50');
  const [robotDescription, setRobotDescription] = useState('');
  const [canvasParts, setCanvasParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [history, setHistory] = useState([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedPart, setDraggedPart] = useState(null);
  const stageRef = useRef(null);

  const colorPresets = ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'];

  // localStorage에서 선택된 미션 불러오기
  useEffect(() => {
    const savedMission = progressManager.getMission();
    if (savedMission) {
      setSelectedMission(savedMission);
    }
    // 저장된 디자인 불러오기
    const savedDesign = progressManager.getRobotDesign();
    if (savedDesign && savedDesign.parts) {
      setCanvasParts(savedDesign.parts);
      setRobotName(savedDesign.name || '나만의 로봇');
      setRobotColor(savedDesign.color || '#4CAF50');
      setRobotDescription(savedDesign.description || '');
    }
  }, []);

  // 히스토리 관리
  const saveToHistory = (parts) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...parts]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCanvasParts([...history[newIndex]]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCanvasParts([...history[newIndex]]);
    }
  };

  // 부품을 캔버스에 추가
  const handlePartDragStart = (part) => {
    setDraggedPart(part);
  };

  const handlePartDrop = (e) => {
    if (!draggedPart) return;

    const stage = stageRef.current;
    const pointerPos = stage.getPointerPosition();
    
    // 그리드에 맞추기
    const x = Math.round(pointerPos.x / GRID_SIZE) * GRID_SIZE;
    const y = Math.round(pointerPos.y / GRID_SIZE) * GRID_SIZE;

    const newPart = {
      id: `${draggedPart.id}-${Date.now()}`,
      ...draggedPart,
      x: Math.max(0, Math.min(x, CANVAS_SIZE - 80)),
      y: Math.max(0, Math.min(y, CANVAS_SIZE - 80)),
      rotation: 0,
      scaleX: 1,
      scaleY: 1
    };

    const newParts = [...canvasParts, newPart];
    setCanvasParts(newParts);
    saveToHistory(newParts);
    setDraggedPart(null);
  };

  // 캔버스 내 부품 드래그
  const handlePartDrag = (e, partId) => {
    const part = canvasParts.find(p => p.id === partId);
    if (!part) return;

    const x = Math.round(e.target.x() / GRID_SIZE) * GRID_SIZE;
    const y = Math.round(e.target.y() / GRID_SIZE) * GRID_SIZE;

    const updatedParts = canvasParts.map(p =>
      p.id === partId
        ? { ...p, x: Math.max(0, Math.min(x, CANVAS_SIZE - 80)), y: Math.max(0, Math.min(y, CANVAS_SIZE - 80)) }
        : p
    );
    setCanvasParts(updatedParts);
  };

  // 부품 회전
  const handleRotate = (partId) => {
    const updatedParts = canvasParts.map(p =>
      p.id === partId ? { ...p, rotation: (p.rotation || 0) + 90 } : p
    );
    setCanvasParts(updatedParts);
    saveToHistory(updatedParts);
  };

  // 부품 삭제
  const handleDelete = (partId) => {
    const updatedParts = canvasParts.filter(p => p.id !== partId);
    setCanvasParts(updatedParts);
    saveToHistory(updatedParts);
    setSelectedPart(null);
  };

  // 초기화
  const handleReset = () => {
    if (confirm('정말 초기화하시겠어요? 모든 작업이 사라집니다.')) {
      setCanvasParts([]);
      setHistory([[]]);
      setHistoryIndex(0);
      setSelectedPart(null);
    }
  };

  // 저장
  const handleSave = () => {
    const robotData = {
      name: robotName,
      mission: selectedMission,
      color: robotColor,
      description: robotDescription,
      parts: canvasParts,
      createdAt: new Date().toISOString()
    };
    progressManager.saveRobotDesign(robotData);
    alert('로봇 디자인이 저장되었어요!');
  };

  // 전개도 만들기
  const handleCreateBlueprint = () => {
    if (canvasParts.length === 0) {
      alert('먼저 로봇을 디자인해주세요!');
      return;
    }
    navigate('/blueprint');
  };

  // 추천 부품 가져오기
  const getRecommendedParts = () => {
    if (!selectedMission) return [];
    const recommendedIds = recommendedParts[selectedMission.id] || [];
    const allParts = Object.values(robotParts).flat();
    return recommendedIds.map(id => allParts.find(p => p.id === id)).filter(Boolean);
  };

  // 그리드 배경 렌더링
  const renderGrid = () => {
    const lines = [];
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SIZE) {
      lines.push(
        <Rect
          key={`v-${i}`}
          x={i}
          y={0}
          width={1}
          height={CANVAS_SIZE}
          fill="#E0E0E0"
        />
      );
      lines.push(
        <Rect
          key={`h-${i}`}
          x={0}
          y={i}
          width={CANVAS_SIZE}
          height={1}
          fill="#E0E0E0"
        />
      );
    }
    return lines;
  };

  return (
    <div className="min-h-screen bg-emerald-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-eco-dark mb-2">🎨 로봇 디자이너</h1>
          <p className="text-lg text-gray-600">드래그하여 로봇을 조립해보세요!</p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* 좌측: 부품 팔레트 */}
          <div className="col-span-12 lg:col-span-3">
            <div className="card sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
              <h2 className="text-xl font-bold text-eco-dark mb-4">부품 팔레트</h2>
              
              {/* 추천 부품 */}
              {selectedMission && (
                <div className="mb-6 p-3 bg-emerald-100 rounded-xl">
                  <p className="text-sm font-semibold text-eco-dark mb-2">
                    {selectedMission.icon} {selectedMission.title} 추천 부품
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getRecommendedParts().map(part => (
                      <div
                        key={part.id}
                        className="w-16 h-16 bg-white rounded-lg p-2 border-2 border-primary-green cursor-move hover:scale-110 transition-transform"
                        draggable
                        onDragStart={() => handlePartDragStart(part)}
                        title={`${part.name} - ${part.spikePrime}`}
                      >
                        <div dangerouslySetInnerHTML={{ __html: part.svg }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 부품 카테고리 */}
              {Object.entries(robotParts).map(([category, parts]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {category === 'arms' ? '팔' : category === 'legs' ? '다리' : category === 'accessories' ? '액세서리' : category === 'body' ? '몸체' : '머리'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {parts.map(part => (
                      <div
                        key={part.id}
                        className="bg-white rounded-lg p-2 border-2 border-gray-200 hover:border-primary-green cursor-move hover:scale-105 transition-all group relative"
                        draggable
                        onDragStart={() => handlePartDragStart(part)}
                        title={`${part.name} - ${part.spikePrime}`}
                      >
                        <div className="flex justify-center mb-1">
                          <div dangerouslySetInnerHTML={{ __html: part.svg }} />
                        </div>
                        <p className="text-xs text-center text-gray-700 font-medium">
                          {part.name}
                        </p>
                        {/* 툴팁 */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                          <div className="bg-gray-800 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                            {part.spikePrime}로 만들 수 있어요
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 중앙: 캔버스 */}
          <div className="col-span-12 lg:col-span-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-eco-dark">디자인 캔버스</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={undo}
                    disabled={historyIndex === 0}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↶ 실행 취소
                  </button>
                  <button
                    onClick={redo}
                    disabled={historyIndex === history.length - 1}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ↷ 다시 실행
                  </button>
                </div>
              </div>
              
              <div
                className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white"
                onDrop={handlePartDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <Stage
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  ref={stageRef}
                >
                  <Layer>
                    {/* 그리드 배경 */}
                    {renderGrid()}
                    
                    {/* 캔버스 부품들 */}
                    {canvasParts.map(part => {
                      const isSelected = selectedPart === part.id;
                      return (
                        <Group
                          key={part.id}
                          x={part.x}
                          y={part.y}
                          rotation={part.rotation || 0}
                          scaleX={part.scaleX || 1}
                          scaleY={part.scaleY || 1}
                          draggable
                          onDragMove={(e) => handlePartDrag(e, part.id)}
                          onClick={() => setSelectedPart(part.id)}
                          onTap={() => setSelectedPart(part.id)}
                        >
                          {/* 배경 */}
                          <Rect
                            x={0}
                            y={0}
                            width={80}
                            height={80}
                            fill={robotColor}
                            opacity={0.2}
                            cornerRadius={8}
                          />
                          {/* 테두리 */}
                          <Rect
                            x={0}
                            y={0}
                            width={80}
                            height={80}
                            stroke={isSelected ? '#F44336' : '#666'}
                            strokeWidth={isSelected ? 3 : 2}
                            cornerRadius={8}
                            dash={isSelected ? [5, 5] : []}
                          />
                          {/* 부품 아이콘 영역 */}
                          <Rect
                            x={10}
                            y={10}
                            width={60}
                            height={50}
                            fill="white"
                            opacity={0.8}
                            cornerRadius={4}
                          />
                          {/* 부품 이름 */}
                          <Text
                            x={5}
                            y={65}
                            text={part.name}
                            fontSize={11}
                            fill="#333"
                            fontStyle="bold"
                            width={70}
                            align="center"
                          />
                          {/* 선택 표시 */}
                          {isSelected && (
                            <Group x={75} y={5}>
                              <Circle
                                x={0}
                                y={0}
                                radius={8}
                                fill="#F44336"
                              />
                              <Text
                                x={0}
                                y={0}
                                text="✓"
                                fontSize={12}
                                fill="white"
                                align="center"
                                verticalAlign="middle"
                                width={16}
                                height={16}
                              />
                            </Group>
                          )}
                        </Group>
                      );
                    })}
                  </Layer>
                </Stage>
              </div>

              {/* 선택된 부품 컨트롤 */}
              {selectedPart && (
                <div className="mt-4 p-4 bg-emerald-100 rounded-lg flex justify-center space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => handleRotate(selectedPart)}
                    className="text-sm py-2 px-4"
                  >
                    🔄 90° 회전
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleDelete(selectedPart)}
                    className="text-sm py-2 px-4 bg-red-500 hover:bg-red-600"
                  >
                    🗑️ 삭제
                  </Button>
                </div>
              )}

              {/* 하단 버튼 */}
              <div className="mt-4 flex justify-center space-x-4">
                <Button variant="secondary" onClick={handleReset}>
                  초기화
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  저장하기
                </Button>
                <Button variant="orange" onClick={handleCreateBlueprint}>
                  전개도 만들기
                </Button>
              </div>
            </div>
          </div>

          {/* 우측: 속성 패널 */}
          <div className="col-span-12 lg:col-span-3">
            <div className="card sticky top-4">
              <h2 className="text-xl font-bold text-eco-dark mb-4">로봇 속성</h2>
              
              {/* 선택한 미션 */}
              {selectedMission && (
                <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: `${selectedMission.color}20` }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{selectedMission.icon}</span>
                    <h3 className="font-semibold text-eco-dark">{selectedMission.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{selectedMission.description}</p>
                </div>
              )}

              {/* 로봇 이름 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  로봇 이름
                </label>
                <input
                  type="text"
                  value={robotName}
                  onChange={(e) => setRobotName(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none"
                  placeholder="로봇 이름을 입력하세요"
                />
              </div>

              {/* 로봇 색상 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  로봇 색상
                </label>
                <div className="flex space-x-2">
                  {colorPresets.map(color => (
                    <button
                      key={color}
                      onClick={() => setRobotColor(color)}
                      className={`w-10 h-10 rounded-full border-4 transition-all ${
                        robotColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={robotColor}
                  onChange={(e) => setRobotColor(e.target.value)}
                  className="w-full mt-2 h-10 rounded-xl cursor-pointer"
                />
              </div>

              {/* 기능 설명 */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  기능 설명
                </label>
                <textarea
                  value={robotDescription}
                  onChange={(e) => setRobotDescription(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary-green focus:outline-none resize-none"
                  rows={6}
                  placeholder="이 로봇이 할 수 있는 일을 설명해주세요..."
                />
              </div>

              {/* 부품 개수 표시 */}
              <div className="mt-6 p-4 bg-emerald-100 rounded-xl">
                <p className="text-sm text-gray-600">
                  현재 <span className="font-bold text-eco-dark">{canvasParts.length}개</span>의 부품이 배치되었어요
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HelpModal page="designer" />
    </div>
  );
}

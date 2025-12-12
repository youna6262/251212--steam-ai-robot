import { useState, useEffect } from 'react';
import { accessibilityManager } from '../../utils/accessibility';

export default function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    accessibilityManager.init();
    setLargeText(localStorage.getItem('largeText') === 'true');
    setHighContrast(localStorage.getItem('highContrast') === 'true');
  }, []);

  const handleLargeText = () => {
    accessibilityManager.toggleLargeText();
    setLargeText(!largeText);
  };

  const handleHighContrast = () => {
    accessibilityManager.toggleHighContrast();
    setHighContrast(!highContrast);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 bg-primary-green text-white rounded-full shadow-lg hover:bg-eco-dark transition-all flex items-center justify-center text-2xl"
        aria-label="접근성 설정"
      >
        ♿
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 bg-white rounded-xl shadow-2xl p-4 w-64">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-eco-dark">접근성 설정</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={largeText}
                onChange={handleLargeText}
                className="w-5 h-5"
              />
              <span className="text-sm">큰 글씨 모드</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={highContrast}
                onChange={handleHighContrast}
                className="w-5 h-5"
              />
              <span className="text-sm">고대비 모드</span>
            </label>
          </div>
        </div>
      )}
    </>
  );
}











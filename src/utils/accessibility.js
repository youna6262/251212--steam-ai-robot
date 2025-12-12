// 접근성 관리 유틸리티

export const accessibilityManager = {
  // 큰 글씨 모드
  toggleLargeText() {
    const isLarge = localStorage.getItem('largeText') === 'true';
    const newValue = !isLarge;
    localStorage.setItem('largeText', newValue.toString());
    this.applyLargeText(newValue);
  },

  applyLargeText(enabled) {
    if (enabled) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  },

  // 고대비 모드
  toggleHighContrast() {
    const isHighContrast = localStorage.getItem('highContrast') === 'true';
    const newValue = !isHighContrast;
    localStorage.setItem('highContrast', newValue.toString());
    this.applyHighContrast(newValue);
  },

  applyHighContrast(enabled) {
    if (enabled) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  },

  // 초기화
  init() {
    const largeText = localStorage.getItem('largeText') === 'true';
    const highContrast = localStorage.getItem('highContrast') === 'true';
    this.applyLargeText(largeText);
    this.applyHighContrast(highContrast);
  }
};











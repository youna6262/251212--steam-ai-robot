// 진행 상황 관리 유틸리티

const STORAGE_KEYS = {
  MISSION: 'selectedMission',
  ROBOT_DESIGN: 'robotDesign',
  ETHICS_RESULT: 'ethicsResult',
  USER_NAME: 'userName',
  STUDENT_NUMBER: 'studentNumber',
  PROGRESS: 'learningProgress'
};

export const progressManager = {
  // 미션 저장
  saveMission(mission) {
    localStorage.setItem(STORAGE_KEYS.MISSION, JSON.stringify(mission));
    this.updateProgress();
  },

  // 미션 불러오기
  getMission() {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSION);
    return saved ? JSON.parse(saved) : null;
  },

  // 로봇 디자인 저장
  saveRobotDesign(design) {
    localStorage.setItem(STORAGE_KEYS.ROBOT_DESIGN, JSON.stringify(design));
    this.updateProgress();
  },

  // 로봇 디자인 불러오기
  getRobotDesign() {
    const saved = localStorage.getItem(STORAGE_KEYS.ROBOT_DESIGN);
    return saved ? JSON.parse(saved) : null;
  },

  // 윤리 결과 저장
  saveEthicsResult(result) {
    localStorage.setItem(STORAGE_KEYS.ETHICS_RESULT, JSON.stringify(result));
    this.updateProgress();
  },

  // 윤리 결과 불러오기
  getEthicsResult() {
    const saved = localStorage.getItem(STORAGE_KEYS.ETHICS_RESULT);
    return saved ? JSON.parse(saved) : null;
  },

  // 사용자 이름 저장
  saveUserName(name) {
    localStorage.setItem(STORAGE_KEYS.USER_NAME, name);
  },

  // 사용자 이름 불러오기
  getUserName() {
    return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '';
  },

  // 학생 번호 저장
  saveStudentNumber(number) {
    localStorage.setItem(STORAGE_KEYS.STUDENT_NUMBER, number);
  },

  // 학생 번호 불러오기
  getStudentNumber() {
    return localStorage.getItem(STORAGE_KEYS.STUDENT_NUMBER) || '';
  },

  // 진행률 계산
  calculateProgress() {
    const hasMission = !!this.getMission();
    const hasDesign = !!this.getRobotDesign();
    const hasEthics = !!this.getEthicsResult();
    
    let progress = 0;
    if (hasMission) progress += 25;
    if (hasDesign) progress += 25;
    if (hasEthics) progress += 25;
    // 전개도는 디자인이 있으면 자동 완료로 간주
    if (hasDesign) progress += 25;

    return progress;
  },

  // 진행 상황 업데이트
  updateProgress() {
    const progress = this.calculateProgress();
    const progressData = {
      mission: !!this.getMission(),
      design: !!this.getRobotDesign(),
      ethics: !!this.getEthicsResult(),
      progress: progress,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressData));
    return progressData;
  },

  // 전체 진행 상황 가져오기
  getProgress() {
    const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (saved) {
      return JSON.parse(saved);
    }
    return this.updateProgress();
  },

  // 모든 데이터 초기화
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },

  // 포트폴리오 데이터 가져오기
  getPortfolioData() {
    return {
      userName: this.getUserName(),
      mission: this.getMission(),
      robotDesign: this.getRobotDesign(),
      ethicsResult: this.getEthicsResult(),
      progress: this.getProgress(),
      createdAt: new Date().toISOString()
    };
  }
};







// 빌드 환경에 따른 설정
export const isDebugBuild = __DEV__;

// 디버그 빌드에서만 실행할 로직
export const debugLog = (...args) => {
  if (__DEV__) {
    console.log('[DEBUG]', ...args);
  }
};

// API 엔드포인트 설정
export const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:8000'  // 에뮬레이터에서 로컬 서버 접근
  : 'https://api.yoursummarizer.com';  // 프로덕션 서버

// 디버그 모드 전용 기능 활성화
export const DEBUG_FEATURES = {
  showDebugMenu: __DEV__,
  enableConsoleLog: __DEV__,
  showPerformanceOverlay: __DEV__,
  mockData: __DEV__,
};
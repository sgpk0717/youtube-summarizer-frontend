/**
 * API 설정 파일
 * Tailscale VPN을 통한 Windows 백엔드 서버 연결 설정
 */

import { Platform } from 'react-native';

// Tailscale 설정
export const TAILSCALE_IP = '100.118.223.116';
export const API_PORT = 8000;

/**
 * API Base URL 결정 로직
 *
 * 1. 개발 환경 (__DEV__):
 *    - Android 에뮬레이터: http://10.0.2.2:8000
 *    - iOS 시뮬레이터: http://localhost:8000
 *
 * 2. 프로덕션 환경 (실기기):
 *    - Tailscale IP 사용: http://100.118.223.116:8000
 */
export const getApiBaseUrl = (): string => {
  // 개발 환경
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android 에뮬레이터는 10.0.2.2로 호스트 머신 접근
      return `http://10.0.2.2:${API_PORT}`;
    } else {
      // iOS 시뮬레이터는 localhost 사용
      return `http://localhost:${API_PORT}`;
    }
  }

  // 프로덕션 환경 (실기기)
  // Tailscale VPN을 통해 Windows PC 접근
  return `http://${TAILSCALE_IP}:${API_PORT}`;
};

// OAuth2 관련 설정
export const OAUTH2_CONFIG = {
  checkInterval: 30000, // 30초마다 OAuth2 상태 확인
  setupCommand: 'yt-dlp --username oauth2 --password ""',
  setupUrl: 'https://www.google.com/device',
};

// API 타임아웃 설정
export const API_TIMEOUT = {
  default: 60000,        // 기본 60초
  summarize: 120000,     // 요약은 120초 (멤버십 영상은 시간이 걸릴 수 있음)
  oauth: 5000,          // OAuth 상태 확인은 5초
};

// 에러 메시지
export const ERROR_MESSAGES = {
  OAUTH_NOT_AUTHENTICATED: 'OAuth2 인증이 필요합니다. Windows PC에서 인증을 완료하세요.',
  MEMBERSHIP_REQUIRED: '이 영상은 채널 멤버십 가입이 필요합니다.',
  BOT_DETECTED: '봇 감지로 인한 접근 차단. 재인증이 필요합니다.',
  VIDEO_UNAVAILABLE: '영상을 사용할 수 없습니다.',
  NETWORK_ERROR: '네트워크 오류가 발생했습니다. Tailscale 연결을 확인하세요.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};
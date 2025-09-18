/**
 * API 설정 파일
 * Tailscale VPN을 통한 Windows 백엔드 서버 연결 설정
 */

import { Platform } from 'react-native';

// Tailscale 설정
// 개발 서버 (Mac)
export const TAILSCALE_IP_DEV = '100.84.43.116';
// 운영 서버 (Windows)
export const TAILSCALE_IP_PROD = '100.118.223.116';
export const API_PORT = 8000;

/**
 * API Base URL 결정 로직
 *
 * 1. 개발 환경 (__DEV__):
 *    - Mac Tailscale IP 사용: http://100.84.43.116:8000
 *
 * 2. 프로덕션 환경 (실기기 릴리즈 빌드):
 *    - Windows Tailscale IP 사용: http://100.118.223.116:8000
 */
export const getApiBaseUrl = (): string => {
  // 임시: 릴리즈 빌드에서도 Mac 개발 서버 사용 (디버깅용)
  return `http://${TAILSCALE_IP_DEV}:${API_PORT}`;

  /* 원래 로직 (나중에 복원)
  // 개발 환경: Mac 개발 서버
  if (__DEV__) {
    return `http://${TAILSCALE_IP_DEV}:${API_PORT}`;
  }

  // 프로덕션 환경: Windows 운영 서버
  return `http://${TAILSCALE_IP_PROD}:${API_PORT}`;
  */
};

// OAuth2 관련 설정
export const OAUTH2_CONFIG = {
  checkInterval: 30000, // 30초마다 OAuth2 상태 확인
  setupCommand: 'yt-dlp --username oauth2 --password ""',
  setupUrl: 'https://www.google.com/device',
};

// API 타임아웃 설정
export const API_TIMEOUT = {
  default: 180000,       // 기본 180초 (3분) - 멀티에이전트 처리 고려
  summarize: 300000,     // 요약은 300초 (5분) - 멀티에이전트는 시간이 더 걸림
  oauth: 10000,          // OAuth 상태 확인은 10초
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
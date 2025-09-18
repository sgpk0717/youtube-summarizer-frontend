import axios from 'axios';
import { Summary, ApiResponse } from '../types';
import { MultiAgentResponse } from '../types/multiagent';
import { getApiBaseUrl, API_TIMEOUT } from '../config/api.config';
import { logger } from './logger';

// API 인스턴스 생성
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT.default,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API 초기화 로그
logger.info('🌐 API 서비스 초기화', {
  baseURL: getApiBaseUrl(),
  timeout: API_TIMEOUT.default,
});

// Axios 요청 인터셉터
api.interceptors.request.use(
  (config) => {
    logger.logApiRequest(
      config.method?.toUpperCase() || 'UNKNOWN',
      config.url || '',
      {
        headers: config.headers,
        data: config.data,
        params: config.params,
      }
    );
    return config;
  },
  (error) => {
    logger.error('🚫 API 요청 인터셉터 에러', error);
    return Promise.reject(error);
  }
);

// Axios 응답 인터셉터
api.interceptors.response.use(
  (response) => {
    logger.logApiResponse(
      response.config.method?.toUpperCase() || 'UNKNOWN',
      response.config.url || '',
      response.status,
      {
        data: response.data,
        headers: response.headers,
      }
    );
    return response;
  },
  (error) => {
    if (error.response) {
      logger.logApiResponse(
        error.config?.method?.toUpperCase() || 'UNKNOWN',
        error.config?.url || '',
        error.response.status,
        {
          error: error.response.data,
          message: error.message,
        }
      );
    } else {
      logger.error('🔴 네트워크 오류', {
        message: error.message,
        code: error.code,
      });
    }
    return Promise.reject(error);
  }
);

/**
 * @deprecated OAuth2에서 쿠키 인증으로 변경됨
 * @ai-note 하위 호환성을 위해 유지, 추후 제거 예정
 */
export const checkOAuth2Status = async () => {
  logger.info('🔐 OAuth2 상태 확인 시작');
  try {
    const response = await api.get('/api/auth/oauth2/status');
    logger.info('✅ OAuth2 상태 확인 성공', response.data);
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error('❌ OAuth2 상태 확인 실패', {
      message: error.message,
      response: error.response?.data,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * @function checkCookieStatus
 * @intent 쿠키 기반 인증 상태 확인
 * @ai-note 멤버십 영상 접근 가능 여부 포함
 */
export const checkCookieStatus = async () => {
  logger.info('🍪 쿠키 상태 확인 시작');
  try {
    const response = await api.get('/api/cookies/status');
    logger.info('✅ 쿠키 상태 확인 성공', {
      hasCookies: response.data.has_cookies,
      canAccessMembership: response.data.can_access_membership,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error('❌ 쿠키 상태 확인 실패', {
      message: error.message,
      response: error.response?.data,
    });
    return {
      success: false,
      error: error.message,
    };
  }
};

export const summarizeVideo = async (url: string): Promise<ApiResponse<Summary>> => {
  logger.logFunction('summarizeVideo', { url });
  try {
    const response = await api.post<Summary>('/api/summarize', { url });
    logger.logFunction('summarizeVideo', undefined, {
      title: response.data.title,
      channel: response.data.channel_title,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error('❌ 비디오 요약 실패', {
      url,
      error: error.response?.data || error.message,
    });
    return {
      success: false,
      error: error.response?.data?.detail || error.message || '요약 생성 중 오류가 발생했습니다.',
    };
  }
};

export const getSummaries = async (): Promise<ApiResponse<Summary[]>> => {
  logger.info('📂 요약 목록 가져오기 시작');
  try {
    const response = await api.get<Summary[]>('/api/summaries');
    logger.info('✅ 요약 목록 가져오기 성공', {
      count: response.data.length,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error('❌ 요약 목록 가져오기 실패', {
      error: error.response?.data || error.message,
    });
    return {
      success: false,
      error: error.response?.data?.detail || error.message || '요약 목록을 가져오는 중 오류가 발생했습니다.',
    };
  }
};

/**
 * @function analyzeVideoWithAgents
 * @intent 멀티에이전트 시스템으로 영상 분석
 * @ai-note 기존 summarizeVideo와 별개로 동작
 * @ai-constraints timeout이 120초로 설정됨 (멀티에이전트는 시간이 더 걸림)
 */
export const analyzeVideoWithAgents = async (
  url: string,
  nickname?: string
): Promise<ApiResponse<MultiAgentResponse>> => {
  logger.logFunction('analyzeVideoWithAgents', { url, nickname });
  try {
    const response = await api.post<MultiAgentResponse>(
      '/api/summarize',
      { url, nickname },
      { timeout: API_TIMEOUT.summarize || 120000 }
    );

    logger.logFunction('analyzeVideoWithAgents', undefined, {
      title: response.data.title,
      agentsCount: response.data.agents?.length,
      hasConclusion: !!response.data.conclusion,
    });

    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    logger.error('❌ 멀티에이전트 분석 실패', {
      url,
      nickname,
      status: error.response?.status,
      error: error.response?.data || error.message,
    });

    // @ai-note 에러 타입별 처리
    if (error.response?.status === 503) {
      logger.warn('⚠️ 멀티에이전트 서비스 비활성화');
      return {
        success: false,
        error: '멀티에이전트 서비스를 사용할 수 없습니다.',
      };
    }

    return {
      success: false,
      error: error.response?.data?.detail || '영상 분석 중 오류가 발생했습니다.',
    };
  }
};

/**
 * @function checkNickname
 * @intent 닉네임 중복 확인
 * @ai-note 대소문자 구분 없음
 */
export const checkNickname = async (nickname: string): Promise<{ available: boolean; message: string }> => {
  logger.info('🔍 닉네임 중복 확인', { nickname });
  try {
    const response = await api.get(`/api/auth/check/${nickname}`);
    logger.info('✅ 닉네임 확인 완료', {
      nickname,
      available: response.data.available,
    });
    return response.data;
  } catch (error: any) {
    logger.error('❌ 닉네임 확인 실패', {
      nickname,
      error: error.message,
    });
    return {
      available: false,
      message: '닉네임 확인 중 오류가 발생했습니다.',
    };
  }
};
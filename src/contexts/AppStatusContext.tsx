import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// 상태 타입 정의
export type ServerStatus = 'checking' | 'healthy' | 'unhealthy' | 'unknown';
export type StatusType = 'info' | 'loading' | 'error' | 'success';

// Context 타입
interface AppStatusContextType {
  // 서버 상태
  serverStatus: ServerStatus;
  setServerStatus: (status: ServerStatus) => void;

  // API 호출 상태
  isConnecting: boolean;
  setIsConnecting: (connecting: boolean) => void;

  // 현재 진행 중인 API
  currentApi: string | null;
  setCurrentApi: (api: string | null) => void;

  // 상태바 메시지
  statusMessage: string;
  setStatusMessage: (message: string) => void;

  // 상태바 타입
  statusType: StatusType;
  setStatusType: (type: StatusType) => void;

  // 상태바 표시 여부
  statusBarVisible: boolean;
  setStatusBarVisible: (visible: boolean) => void;

  // 마지막 에러
  lastError: string | null;
  setLastError: (error: string | null) => void;

  // 유틸 함수
  showStatus: (message: string, type: StatusType, duration?: number) => void;
  hideStatus: () => void;
}

// Context 생성
const AppStatusContext = createContext<AppStatusContextType | undefined>(undefined);

// Provider 컴포넌트
export const AppStatusProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serverStatus, setServerStatus] = useState<ServerStatus>('unknown');
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentApi, setCurrentApi] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState<StatusType>('info');
  const [statusBarVisible, setStatusBarVisible] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  // 상태바 표시 유틸 함수
  const showStatus = useCallback((message: string, type: StatusType, duration?: number) => {
    setStatusMessage(message);
    setStatusType(type);
    setStatusBarVisible(true);

    // duration이 지정된 경우 자동으로 숨김
    if (duration && duration > 0) {
      setTimeout(() => {
        setStatusBarVisible(false);
      }, duration);
    }
  }, []);

  // 상태바 숨기기
  const hideStatus = useCallback(() => {
    setStatusBarVisible(false);
  }, []);

  const value: AppStatusContextType = {
    serverStatus,
    setServerStatus,
    isConnecting,
    setIsConnecting,
    currentApi,
    setCurrentApi,
    statusMessage,
    setStatusMessage,
    statusType,
    setStatusType,
    statusBarVisible,
    setStatusBarVisible,
    lastError,
    setLastError,
    showStatus,
    hideStatus,
  };

  return (
    <AppStatusContext.Provider value={value}>
      {children}
    </AppStatusContext.Provider>
  );
};

// Hook
export const useAppStatus = () => {
  const context = useContext(AppStatusContext);
  if (context === undefined) {
    throw new Error('useAppStatus must be used within an AppStatusProvider');
  }
  return context;
};

// 상태별 메시지 상수
export const STATUS_MESSAGES = {
  CHECKING_SERVER: '서버 상태 확인 중...',
  SERVER_CONNECTED: '서버 연결 완료',
  SERVER_DISCONNECTED: '서버 연결 실패',
  RETRYING: '재시도 중...',
  LOADING: '로딩 중...',
  API_CALLING: 'API 호출 중...',
} as const;
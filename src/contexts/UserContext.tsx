/**
 * @architecture UserManagement
 * @purpose 닉네임 기반 사용자 관리 Context
 * @ai-context AsyncStorage를 통한 로컬 저장
 * @ai-constraints 기존 앱 로직에 영향 최소화
 * @dependencies ["react", "async-storage"]
 * @last-review 2024-09-18
 */

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkNickname } from '../services/api';

/**
 * @interface UserContextType
 * @intent 사용자 관리 Context 타입 정의
 */
interface UserContextType {
  nickname: string | null;
  isLoading: boolean;
  setNickname: (nickname: string) => Promise<void>;
  checkNicknameAvailability: (nickname: string) => Promise<boolean>;
  clearUser: () => Promise<void>;
}

// Context 생성
const UserContext = createContext<UserContextType | undefined>(undefined);

// 스토리지 키
const STORAGE_KEY = '@user_nickname';

/**
 * @component UserProvider
 * @intent 사용자 상태 관리 Provider
 * @ai-note 앱 시작 시 자동으로 닉네임 불러옴
 */
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nickname, setNicknameState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @function loadNickname
   * @intent 앱 시작 시 저장된 닉네임 불러오기
   * @ai-note 없으면 null 유지
   */
  useEffect(() => {
    const loadNickname = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setNicknameState(saved);
        }
      } catch (error) {
        console.error('Failed to load nickname:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNickname();
  }, []);

  /**
   * @function setNickname
   * @intent 닉네임 설정 및 저장
   * @ai-constraints 빈 문자열 허용 안함
   */
  const setNickname = async (newNickname: string) => {
    if (!newNickname.trim()) {
      throw new Error('닉네임은 필수입니다.');
    }

    try {
      await AsyncStorage.setItem(STORAGE_KEY, newNickname);
      setNicknameState(newNickname);
    } catch (error) {
      console.error('Failed to save nickname:', error);
      throw error;
    }
  };

  /**
   * @function checkNicknameAvailability
   * @intent 닉네임 중복 확인
   * @ai-note 백엔드 API 호출
   */
  const checkNicknameAvailability = async (nicknameToCheck: string): Promise<boolean> => {
    try {
      const result = await checkNickname(nicknameToCheck);
      return result.available;
    } catch (error) {
      console.error('Failed to check nickname:', error);
      return false;
    }
  };

  /**
   * @function clearUser
   * @intent 사용자 정보 초기화
   * @ai-note 로그아웃 시 사용
   */
  const clearUser = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setNicknameState(null);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        nickname,
        isLoading,
        setNickname,
        checkNicknameAvailability,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

/**
 * @function useUser
 * @intent UserContext 사용 훅
 * @ai-warning Provider 외부에서 사용 시 에러
 */
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
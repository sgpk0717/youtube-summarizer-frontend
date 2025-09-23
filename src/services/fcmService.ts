/**
 * FCM (Firebase Cloud Messaging) 서비스
 * 푸시 알림 권한 요청 및 토큰 관리
 */

import { Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

// Firebase messaging을 동적으로 import하여 없어도 앱이 실행되도록 함
let messaging: any = null;
try {
  messaging = require('@react-native-firebase/messaging').default;
} catch (error) {
  logger.warn('⚠️ Firebase Messaging 모듈 없음 - FCM 비활성화');
}

const FCM_TOKEN_KEY = '@fcm_token';

class FCMService {
  /**
   * FCM 사용 가능 여부 확인
   */
  isAvailable(): boolean {
    return messaging !== null;
  }

  /**
   * FCM 초기화 및 권한 요청
   */
  async initialize(): Promise<void> {
    try {
      // FCM이 없으면 건너뛰기
      if (!this.isAvailable()) {
        logger.info('🔕 FCM 비활성화 상태 - 초기화 건너뜀');
        return;
      }

      logger.info('🔔 FCM 서비스 초기화 시작');

      // 권한 요청
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        logger.warn('⚠️ FCM 권한 거부됨');
        return;
      }

      // 토큰 발급
      const token = await this.getToken();
      if (token) {
        logger.info('✅ FCM 토큰 발급 성공', { token: token.substring(0, 20) + '...' });
      }

      // 메시지 리스너 설정
      this.setupMessageListeners();

      logger.info('✅ FCM 서비스 초기화 완료');
    } catch (error) {
      logger.error('❌ FCM 초기화 실패', error);
    }
  }

  /**
   * 알림 권한 요청
   */
  async requestPermission(): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        return false;
      }

      logger.info('📱 FCM 권한 요청 시작');

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        logger.info('✅ FCM 권한 획득 성공');
      } else {
        logger.warn('❌ FCM 권한 거부됨');
      }

      return enabled;
    } catch (error) {
      logger.error('❌ FCM 권한 요청 실패', error);
      return false;
    }
  }

  /**
   * 현재 권한 상태 확인
   */
  async checkPermission(): Promise<boolean> {
    try {
      if (!this.isAvailable()) {
        return false;
      }

      const authStatus = await messaging().hasPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    } catch (error) {
      logger.error('❌ FCM 권한 확인 실패', error);
      return false;
    }
  }

  /**
   * FCM 토큰 발급
   */
  async getToken(): Promise<string | null> {
    try {
      if (!this.isAvailable()) {
        return null;
      }

      // 캐시된 토큰 확인
      const cachedToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      if (cachedToken) {
        logger.debug('📱 캐시된 FCM 토큰 사용');
        return cachedToken;
      }

      // 새 토큰 발급
      const token = await messaging().getToken();
      if (token) {
        // 토큰 저장
        await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
        logger.info('✅ 새 FCM 토큰 발급 및 저장');
        return token;
      }

      return null;
    } catch (error) {
      logger.error('❌ FCM 토큰 발급 실패', error);
      return null;
    }
  }

  /**
   * FCM 토큰 갱신
   */
  async refreshToken(): Promise<string | null> {
    try {
      if (!this.isAvailable()) {
        return null;
      }

      logger.info('🔄 FCM 토큰 갱신 시작');

      // 기존 토큰 삭제
      await AsyncStorage.removeItem(FCM_TOKEN_KEY);

      // 새 토큰 발급
      await messaging().deleteToken();
      const newToken = await messaging().getToken();

      if (newToken) {
        await AsyncStorage.setItem(FCM_TOKEN_KEY, newToken);
        logger.info('✅ FCM 토큰 갱신 성공');
        return newToken;
      }

      return null;
    } catch (error) {
      logger.error('❌ FCM 토큰 갱신 실패', error);
      return null;
    }
  }

  /**
   * 메시지 리스너 설정
   */
  private setupMessageListeners(): void {
    if (!this.isAvailable()) {
      return;
    }

    // 포그라운드 메시지 수신
    messaging().onMessage(async remoteMessage => {
      logger.info('📬 포그라운드 푸시 알림 수신', {
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
      });

      // 포그라운드에서는 직접 Alert 표시
      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || '알림',
          remoteMessage.notification.body || '',
          [{ text: '확인' }]
        );
      }
    });

    // 백그라운드 메시지 핸들러는 index.js에 설정
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      logger.info('📬 백그라운드 푸시 알림 처리', {
        title: remoteMessage.notification?.title,
        data: remoteMessage.data,
      });
    });

    // 알림 클릭 처리
    messaging().onNotificationOpenedApp(remoteMessage => {
      logger.info('📱 알림 클릭으로 앱 오픈', {
        data: remoteMessage.data,
      });
      // 필요시 특정 화면으로 네비게이션
    });

    // 앱이 종료된 상태에서 알림 클릭으로 실행
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          logger.info('🚀 알림으로 앱 최초 실행', {
            data: remoteMessage.data,
          });
        }
      });

    logger.info('✅ FCM 메시지 리스너 설정 완료');
  }

  /**
   * 분석 요청 전 권한 확인 및 요청
   */
  async ensurePermissionForAnalysis(): Promise<boolean> {
    try {
      const hasPermission = await this.checkPermission();

      if (!hasPermission) {
        logger.info('📱 분석 전 FCM 권한 요청');

        // 권한 요청 안내
        return new Promise((resolve) => {
          Alert.alert(
            '알림 권한 필요',
            '분석이 완료되면 푸시 알림으로 알려드립니다. 알림을 받으시겠습니까?',
            [
              {
                text: '거부',
                onPress: () => {
                  logger.info('❌ 사용자가 알림 권한 거부');
                  resolve(false);
                },
                style: 'cancel',
              },
              {
                text: '허용',
                onPress: async () => {
                  const granted = await this.requestPermission();
                  logger.info(`📱 알림 권한 요청 결과: ${granted}`);
                  resolve(granted);
                },
              },
            ]
          );
        });
      }

      return true;
    } catch (error) {
      logger.error('❌ 권한 확인 실패', error);
      return false;
    }
  }
}

export default new FCMService();
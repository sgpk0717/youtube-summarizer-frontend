/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

// 백그라운드 메시지 핸들러 설정 - 앱이 백그라운드이거나 종료된 상태에서 FCM 처리
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('[백그라운드] FCM 메시지 수신:', remoteMessage);

  // 여기서는 알림을 자동으로 표시됩니다
  // notification 페이로드가 있으면 OS가 자동으로 알림을 표시합니다

  // 추가 데이터 처리가 필요한 경우 여기에 로직 추가
  if (remoteMessage.data) {
    console.log('[백그라운드] 데이터:', remoteMessage.data);
  }
});

AppRegistry.registerComponent(appName, () => App);

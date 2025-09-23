import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { API_BASE_URL, debugLog, DEBUG_FEATURES } from '../utils/buildConfig';

const DebugExample = () => {
  const handlePress = () => {
    // 디버그 빌드에서만 로그 출력
    debugLog('Button pressed!', { timestamp: Date.now() });

    // 조건부 로직
    if (__DEV__) {
      // 디버그 빌드 전용 코드
      console.log('개발 모드에서만 실행되는 코드');
      alert('디버그 모드입니다!');
    } else {
      // 릴리즈 빌드 전용 코드
      // 실제 API 호출 등
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        현재 모드: {__DEV__ ? '개발(Debug)' : '프로덕션(Release)'}
      </Text>

      <Text style={styles.info}>
        API URL: {API_BASE_URL}
      </Text>

      <Button title="테스트 버튼" onPress={handlePress} />

      {/* 디버그 빌드에서만 표시되는 UI */}
      {__DEV__ && (
        <View style={styles.debugPanel}>
          <Text style={styles.debugTitle}>🔧 디버그 패널</Text>
          <Text>이 패널은 개발 버전에서만 보입니다</Text>
          {DEBUG_FEATURES.showDebugMenu && (
            <Button
              title="개발자 도구 열기"
              onPress={() => console.log('Dev tools')}
            />
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  debugPanel: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#fff3cd',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default DebugExample;
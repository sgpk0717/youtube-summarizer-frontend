import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, ActivityIndicator } from 'react-native';
import { useAppStatus, StatusType } from '../contexts/AppStatusContext';

// StatusBar 컴포넌트 (앱 전체 상태바, RN의 StatusBar와는 다름)
export const AppStatusBar: React.FC = () => {
  const {
    statusMessage,
    statusType,
    statusBarVisible,
    isConnecting,
  } = useAppStatus();

  // 애니메이션 값
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-30)).current;

  // 표시/숨기기 애니메이션
  useEffect(() => {
    if (statusBarVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -30,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [statusBarVisible, fadeAnim, slideAnim]);

  // 상태별 스타일
  const getStatusStyle = () => {
    switch (statusType) {
      case 'loading':
        return 'bg-purple-600/80';
      case 'success':
        return 'bg-green-600/80';
      case 'error':
        return 'bg-red-600/80';
      case 'info':
      default:
        return 'bg-gray-800/80';
    }
  };

  // 상태별 아이콘 (간단한 텍스트/ActivityIndicator로 대체)
  const getStatusIcon = () => {
    switch (statusType) {
      case 'loading':
        return (
          <ActivityIndicator size="small" color="#FFFFFF" />
        );
      case 'success':
        return <Text style={{ color: '#FFFFFF', fontSize: 12 }}>✓</Text>;
      case 'error':
        return <Text style={{ color: '#FFFFFF', fontSize: 12 }}>!</Text>;
      case 'info':
      default:
        return <Text style={{ color: '#FFFFFF', fontSize: 12 }}>i</Text>;
    }
  };

  // 표시하지 않을 때는 null 반환
  if (!statusBarVisible && fadeAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      className={`${getStatusStyle()} px-3 py-1`}
    >
      <View className="flex-row items-center justify-center">
        <View className="mr-2">
          {getStatusIcon()}
        </View>
        <Text className="text-white text-[10px] font-medium">
          {statusMessage || 'Ready'}
        </Text>
        {/* 연결 중 표시 */}
        {isConnecting && statusType === 'loading' && (
          <View className="ml-2 flex-row items-center">
            <View className="w-1 h-1 bg-white rounded-full mx-0.5 opacity-30" />
            <View className="w-1 h-1 bg-white rounded-full mx-0.5 opacity-60" />
            <View className="w-1 h-1 bg-white rounded-full mx-0.5" />
          </View>
        )}
      </View>
    </Animated.View>
  );
};
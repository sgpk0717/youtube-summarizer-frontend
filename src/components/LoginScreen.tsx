/**
 * @component LoginScreen
 * @purpose 닉네임 입력 전용 화면 (모달에서 전체 화면으로 변경)
 * @ai-context 깔끔한 디자인, 기존 스타일 재활용
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../styles/colors';
import { theme } from '../styles/theme';
import { useUser } from '../contexts/UserContext';
import { logger } from '../services/logger';

interface LoginScreenProps {
  onLoginComplete: () => void;
}

/**
 * @component LoginScreen
 * @intent 첫 실행 시 닉네임 입력 받는 전체 화면
 * @ai-note 중복 확인 후 저장, 완료 시 콜백 호출
 */
const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginComplete }) => {
  logger.debug('👤 LoginScreen 렌더링');

  const [inputNickname, setInputNickname] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const { setNickname, checkNicknameAvailability } = useUser();

  const handleNicknameChange = (text: string) => {
    logger.debug('✍️ 닉네임 입력 변경', {
      oldValue: inputNickname,
      newValue: text,
      length: text.length
    });
    setInputNickname(text);
  };

  /**
   * @function handleSubmit
   * @intent 닉네임 검증 및 저장
   * @ai-note 중복 확인 → 저장 → 로그인 완료 콜백
   */
  const handleSubmit = async () => {
    const trimmed = inputNickname.trim();
    logger.info('🚀 닉네임 설정 시작', { inputNickname, trimmed });

    if (!trimmed) {
      logger.warn('⚠️ 빈 닉네임 입력');
      Alert.alert('알림', '닉네임을 입력해주세요.');
      return;
    }

    if (trimmed.length < 2 || trimmed.length > 20) {
      logger.warn('⚠️ 닉네임 길이 오류', { length: trimmed.length });
      Alert.alert('알림', '닉네임은 2-20자로 입력해주세요.');
      return;
    }

    setIsChecking(true);
    logger.info('🔍 닉네임 유효성 검사 시작', { nickname: trimmed });

    try {
      // 중복 확인 (개발 중이므로 임시로 건너뛰기)
      // const isAvailable = await checkNicknameAvailability(trimmed);

      // if (!isAvailable) {
      //   logger.warn('⚠️ 닉네임 중복', { nickname: trimmed });
      //   Alert.alert('알림', '이미 사용 중인 닉네임입니다.');
      //   setIsChecking(false);
      //   return;
      // }

      // 저장
      logger.info('💾 닉네임 저장 중', { nickname: trimmed });
      await setNickname(trimmed);
      logger.info('✅ 닉네임 설정 완료', { nickname: trimmed });

      // 로그인 완료 콜백 호출
      onLoginComplete();
    } catch (error) {
      logger.error('❌ 닉네임 설정 실패', { error: String(error), nickname: trimmed });
      Alert.alert('오류', '닉네임 설정 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
      logger.debug('🏁 닉네임 설정 프로세스 종료');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.content}>
          {/* 로고 섹션 */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>YT</Text>
            </View>
            <Text style={styles.appTitle}>유튜브 요약</Text>
            <Text style={styles.subtitle}>
              YouTube 영상을 AI로 요약해드려요
            </Text>
          </View>

          {/* 닉네임 입력 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.title}>👤 닉네임 설정</Text>

            <Text style={styles.description}>
              보고서를 저장하고 관리하기 위해{'\n'}
              닉네임을 입력해주세요.
            </Text>

            <TextInput
              style={styles.input}
              placeholder="닉네임 입력 (2-20자)"
              placeholderTextColor={Colors.textLight}
              value={inputNickname}
              onChangeText={handleNicknameChange}
              maxLength={20}
              autoFocus
              editable={!isChecking}
              onSubmitEditing={handleSubmit}
            />

            <TouchableOpacity
              style={[styles.button, isChecking && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isChecking}
            >
              {isChecking ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.buttonText}>시작하기</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* 하단 여백 */}
          <View style={styles.bottomSpace} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'space-between',
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#F2F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#191F28',
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#191F28',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: theme.spacing.lg,
    backgroundColor: Colors.white,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpace: {
    height: theme.spacing.xl,
  },
});

export default LoginScreen;
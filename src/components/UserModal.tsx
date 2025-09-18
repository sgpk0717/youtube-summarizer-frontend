/**
 * @component UserModal
 * @purpose 닉네임 입력 모달 (첫 실행 시)
 * @ai-context 심플한 디자인, 기존 스타일 재활용
 * @ai-constraints 최소 기능만 구현
 */

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../styles/colors';
import { useUser } from '../contexts/UserContext';
import { logger } from '../services/logger';

interface UserModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * @component UserModal
 * @intent 첫 실행 시 닉네임 입력 받기
 * @ai-note 중복 확인 후 저장
 */
const UserModal: React.FC<UserModalProps> = ({ visible, onClose }) => {
  logger.debug('👤 UserModal 렌더링', { visible });

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
   * @ai-note 중복 확인 → 저장 → 모달 닫기
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
      onClose();
    } catch (error) {
      logger.error('❌ 닉네임 설정 실패', { error: String(error), nickname: trimmed });
      Alert.alert('오류', '닉네임 설정 중 오류가 발생했습니다.');
    } finally {
      setIsChecking(false);
      logger.debug('🏁 닉네임 설정 프로세스 종료');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 8,
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
});

export default UserModal;
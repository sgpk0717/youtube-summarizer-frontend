import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../styles/colors';
import { theme } from '../styles/theme';
import { logger } from '../services/logger';

interface HeaderProps {
  nickname?: string;
  onUserPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({ nickname, onUserPress }) => {
  logger.debug('🎨 Header 컴포넌트 렌더링', { nickname, hasOnUserPress: !!onUserPress });

  const handleUserPress = () => {
    logger.info('👤 사용자 아바타 버튼 클릭', { nickname });
    if (onUserPress) {
      onUserPress();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>YT</Text>
        </View>
        <Text style={styles.title}>유튜브 요약</Text>
      </View>

      {nickname && (
        <TouchableOpacity
          style={styles.userButton}
          onPress={handleUserPress}
          activeOpacity={0.7}
        >
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {nickname.charAt(0).toUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F2F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#191F28',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191F28',
    letterSpacing: -0.5,
  },
  userButton: {
    padding: theme.spacing.xs,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4E5968',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Header;
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Colors } from '../styles/colors';
import { theme } from '../styles/theme';
import { logger } from '../services/logger';

interface URLInputViewProps {
  url: string;
  onChangeUrl: (text: string) => void;
  loading: boolean;
  onAnalyze: () => void;
}

const URLInputView: React.FC<URLInputViewProps> = ({
  url,
  onChangeUrl,
  loading,
  onAnalyze,
}) => {
  logger.debug('🔤 URLInputView 렌더링', { url, loading });

  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handleFocus = () => {
    logger.info('🎯 URL 입력 필드 포커스', { currentUrl: url });
    setIsFocused(true);
  };

  const handleBlur = () => {
    logger.info('👀 URL 입력 필드 블러', { finalUrl: url });
    setIsFocused(false);
  };

  const handleTextChange = (text: string) => {
    logger.debug('✍️ URL 텍스트 변경', {
      oldUrl: url,
      newUrl: text,
      length: text.length,
      isYouTubeUrl: text.includes('youtube.com') || text.includes('youtu.be')
    });
    onChangeUrl(text);
  };

  return (
    <View style={styles.container}>
      {/* 메인 카드 */}
      <View style={[styles.card, isFocused && styles.cardFocused]}>
        <Text style={styles.title}>YouTube 영상 분석</Text>
        <Text style={styles.subtitle}>영상 URL을 입력하면 AI가 요약해드려요</Text>

        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <TextInput
            style={styles.input}
            placeholder="https://youtube.com/watch?v=..."
            placeholderTextColor={theme.colors.neutral.gray400}
            value={url}
            onChangeText={handleTextChange}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            multiline={false}
            numberOfLines={1}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>

        {/* 분석하기 버튼 */}
        <TouchableOpacity
          style={[styles.analyzeButton, loading && styles.analyzeButtonDisabled]}
          onPress={onAnalyze}
          disabled={loading || !url.trim()}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.colors.neutral.white} />
          ) : (
            <Text style={styles.analyzeButtonText}>분석하기</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.card,
  },
  cardFocused: {
    ...theme.shadows.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray500,
    marginBottom: theme.spacing.lg,
  },
  inputContainer: {
    backgroundColor: theme.colors.neutral.gray100,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.neutral.white,
    ...theme.shadows.md,
  },
  input: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.black,
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  analyzeButtonDisabled: {
    backgroundColor: theme.colors.neutral.gray400,
    opacity: 0.6,
  },
  analyzeButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.white,
    letterSpacing: -0.2,
  },
  chartContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#191F28',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  chartContent: {
    alignItems: 'center',
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  barItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  bar: {
    width: '60%',
    borderRadius: 4,
    marginBottom: 6,
  },
  barLabel: {
    fontSize: 10,
    color: '#6B7684',
    letterSpacing: -0.2,
  },
  chartDescription: {
    fontSize: 12,
    color: '#8B95A1',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginTop: 8,
  },
});

export default URLInputView;
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Summary } from '../types';
import { Colors } from '../styles/colors';
import { theme } from '../styles/theme';
import { logger } from '../services/logger';

interface SummaryViewProps {
  summary: Summary;
  onBack?: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onBack }) => {
  logger.debug('📜 SummaryView 렌더링', {
    title: summary.title,
    channel: summary.channel,
    hasDetailedSummary: !!summary.detailed_summary,
    hasOneLine: !!(summary.one_line || summary.one_line_summary)
  });

  logger.info('📄 요약 내용 표시', {
    videoTitle: summary.title,
    summaryData: {
      oneLine: summary.one_line || summary.one_line_summary,
      detailedSummary: summary.detailed_summary
    }
  });

  // 마크다운 스타일 정의
  const markdownStyles = {
    body: {
      color: theme.colors.neutral.black,
      fontSize: 14,
      lineHeight: 24,
    },
    heading1: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: theme.colors.neutral.black,
      marginTop: 16,
      marginBottom: 12,
    },
    heading2: {
      fontSize: 18,
      fontWeight: 'bold' as const,
      color: theme.colors.neutral.black,
      marginTop: 14,
      marginBottom: 10,
    },
    heading3: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: theme.colors.neutral.black,
      marginTop: 12,
      marginBottom: 8,
    },
    paragraph: {
      marginBottom: 10,
      lineHeight: 22,
    },
    listItem: {
      marginBottom: 6,
    },
    bullet_list: {
      marginLeft: 10,
      marginBottom: 10,
    },
    ordered_list: {
      marginLeft: 10,
      marginBottom: 10,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: theme.colors.neutral.black,
    },
    em: {
      fontStyle: 'italic' as const,
    },
    blockquote: {
      backgroundColor: theme.colors.neutral.gray100,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.primary.main,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginVertical: 10,
    },
    code_inline: {
      backgroundColor: theme.colors.neutral.gray100,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
      fontSize: 13,
    },
    code_block: {
      backgroundColor: theme.colors.neutral.gray100,
      padding: 12,
      borderRadius: 8,
      fontFamily: 'monospace',
      fontSize: 13,
      marginVertical: 10,
    },
    hr: {
      backgroundColor: theme.colors.neutral.gray300,
      height: 1,
      marginVertical: 16,
    },
  };

  return (
    <View style={styles.container}>
      {/* 헤더 영역 - 백 버튼 포함 */}
      {onBack && (
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← 목록으로</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>요약 보기</Text>
          <View style={styles.headerSpacer} />
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 비디오 정보 */}
          <View style={styles.videoInfo}>
            <Text style={styles.title} numberOfLines={3}>
              {summary.title}
            </Text>
            <Text style={styles.channel}>
              {summary.channel || summary.channel_title}
            </Text>
            {summary.duration && (
              <Text style={styles.duration}>
                재생 시간: {summary.duration}
              </Text>
            )}
          </View>

          {/* 한 줄 요약 */}
          {(summary.one_line || summary.one_line_summary) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📌 한 줄 요약</Text>
              <View style={styles.card}>
                <Text style={styles.oneLineText}>
                  {summary.one_line || summary.one_line_summary}
                </Text>
              </View>
            </View>
          )}

          {/* 상세 요약 (마크다운) */}
          {(summary.detailed_summary || summary.summary) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 상세 요약</Text>
              <View style={styles.markdownContainer}>
                <Markdown style={markdownStyles}>
                  {summary.detailed_summary || summary.summary || ''}
                </Markdown>
              </View>
            </View>
          )}

          {/* 하단 여백 */}
          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.gray200,
    ...theme.shadows.sm,
  },
  backButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.black,
  },
  headerSpacer: {
    width: 80, // 백 버튼과 같은 너비로 균형 맞추기
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.md,
  },
  videoInfo: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.card,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.xs,
    lineHeight: 24,
  },
  channel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.neutral.gray600,
    marginBottom: theme.spacing.xs,
  },
  duration: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.neutral.gray500,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral.black,
    marginBottom: theme.spacing.sm,
  },
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  oneLineText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.neutral.black,
    lineHeight: 22,
  },
  markdownContainer: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
  },
  bottomSpace: {
    height: 100, // 바텀 탭과 겹치지 않도록 여백 추가
  },
});

export default SummaryView;
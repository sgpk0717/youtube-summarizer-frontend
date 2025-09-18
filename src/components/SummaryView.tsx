import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Summary } from '../types';
import { Colors } from '../styles/colors';
import { logger } from '../services/logger';

interface SummaryViewProps {
  summary: Summary;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary }) => {
  logger.debug('📜 SummaryView 렌더링', {
    title: summary.title,
    channel: summary.channel,
    keyPointsCount: summary.key_points?.length,
    hasDetailedSummary: !!summary.detailed_summary,
    hasOneLine: !!(summary.one_line || summary.one_line_summary)
  });

  logger.info('📄 요약 내용 표시', {
    videoTitle: summary.title,
    summaryData: {
      oneLine: summary.one_line || summary.one_line_summary,
      keyPoints: summary.key_points,
      detailedSummary: summary.detailed_summary
    }
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 비디오 정보 */}
        <View style={styles.videoInfo}>
          <Text style={styles.title} numberOfLines={2}>
            {summary.title}
          </Text>
          <Text style={styles.channel}>
            {summary.channel}
          </Text>
          {summary.duration && (
            <Text style={styles.duration}>
              재생 시간: {summary.duration}
            </Text>
          )}
        </View>

        {/* 한 줄 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📌 한 줄 요약</Text>
          <View style={styles.card}>
            <Text style={styles.sectionContent}>
              {summary.one_line || summary.one_line_summary}
            </Text>
          </View>
        </View>

        {/* 핵심 포인트 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 핵심 포인트</Text>
          <View style={styles.card}>
            {summary.key_points.map((point, index) => (
              <View key={index} style={styles.bulletItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 상세 요약 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 상세 요약</Text>
          <View style={styles.card}>
            <Text style={styles.sectionContent}>
              {summary.detailed_summary}
            </Text>
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={styles.bottomSpace} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  videoInfo: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  channel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  duration: {
    fontSize: 12,
    color: Colors.textLight,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionContent: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  bulletText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});

export default SummaryView;
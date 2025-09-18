/**
 * @component SummaryAgentView
 * @purpose 요약 에이전트 결과 표시
 * @ai-context 핵심 내용과 구조화된 요약 제공
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

interface SummaryAgentViewProps {
  data?: {
    executive_summary?: string;
    main_topics?: Array<{
      title: string;
      summary: string;
    }>;
    key_statistics?: {
      duration?: string;
      topics_covered?: number;
      complexity_level?: string;
    };
  };
}

const SummaryAgentView: React.FC<SummaryAgentViewProps> = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>요약 정보가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 핵심 요약 */}
        {data.executive_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 핵심 요약</Text>
            <View style={styles.card}>
              <Text style={styles.summaryText}>{data.executive_summary}</Text>
            </View>
          </View>
        )}

        {/* 주요 주제들 */}
        {data.main_topics && data.main_topics.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 주요 주제</Text>
            {data.main_topics.map((topic, index) => (
              <View key={index} style={styles.topicCard}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicSummary}>{topic.summary}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 통계 정보 */}
        {data.key_statistics && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 주요 통계</Text>
            <View style={styles.statsCard}>
              {data.key_statistics.duration && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>영상 길이</Text>
                  <Text style={styles.statValue}>{data.key_statistics.duration}</Text>
                </View>
              )}
              {data.key_statistics.topics_covered && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>다룬 주제</Text>
                  <Text style={styles.statValue}>{data.key_statistics.topics_covered}개</Text>
                </View>
              )}
              {data.key_statistics.complexity_level && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>난이도</Text>
                  <Text style={styles.statValue}>{data.key_statistics.complexity_level}</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textLight,
    fontSize: 14,
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
  summaryText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  topicCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  topicSummary: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default SummaryAgentView;
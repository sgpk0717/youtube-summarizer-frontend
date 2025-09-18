import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Summary } from '../types';
import { Colors } from '../styles/colors';
import { logger } from '../services/logger';

interface SummaryListProps {
  summaries: Summary[];
  onSelectSummary: (summary: Summary) => void;
}

const SummaryList: React.FC<SummaryListProps> = ({
  summaries,
  onSelectSummary,
}) => {
  logger.debug('📋 SummaryList 렌더링', {
    summariesCount: summaries.length,
    summariesData: summaries.map(s => ({
      id: s.id,
      title: s.title,
      channel: s.channel,
      created_at: s.created_at
    }))
  });

  const handleSummaryPress = (summary: Summary) => {
    logger.info('📄 요약 아이템 선택', {
      summaryId: summary.id,
      title: summary.title,
      channel: summary.channel
    });
    onSelectSummary(summary);
  };

  if (summaries.length === 0) {
    logger.info('📋 비어있는 요약 목록 표시');
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>저장된 요약이 없습니다</Text>
        <Text style={styles.emptyText}>
          YouTube 영상을 요약하면{'\n'}여기에 목록이 표시됩니다
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.header}>
          저장된 요약 ({summaries.length}개)
        </Text>
        
        {summaries.map((summary, index) => (
          <TouchableOpacity
            key={summary.id || index}
            style={styles.card}
            onPress={() => handleSummaryPress(summary)}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {summary.title}
              </Text>
              <Text style={styles.cardChannel} numberOfLines={1}>
                {summary.channel}
              </Text>
              <Text style={styles.cardSummary} numberOfLines={2}>
                {summary.one_line || summary.one_line_summary}
              </Text>
              {summary.created_at && (
                <Text style={styles.cardDate}>
                  {new Date(summary.created_at).toLocaleDateString('ko-KR')}
                </Text>
              )}
            </View>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
        
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
  header: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardChannel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 10,
    color: Colors.textLight,
  },
  cardArrow: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: Colors.textLight,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpace: {
    height: 20,
  },
});

export default SummaryList;
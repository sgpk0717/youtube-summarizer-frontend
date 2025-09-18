/**
 * @component InsightsAgentView
 * @purpose 인사이트 에이전트 결과 표시
 * @ai-context 핵심 통찰과 깊은 분석 제공
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

interface InsightsAgentViewProps {
  data?: {
    key_insights?: string[];
    hidden_gems?: Array<{
      insight: string;
      importance: 'high' | 'medium' | 'low';
    }>;
    connections?: string[];
    implications?: string;
  };
}

const InsightsAgentView: React.FC<InsightsAgentViewProps> = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>인사이트가 없습니다.</Text>
      </View>
    );
  }

  const getImportanceColor = (importance?: string) => {
    switch (importance) {
      case 'high':
        return Colors.error;
      case 'medium':
        return Colors.warning;
      case 'low':
        return Colors.success;
      default:
        return Colors.primary;
    }
  };

  const getImportanceLabel = (importance?: string) => {
    switch (importance) {
      case 'high':
        return '매우 중요';
      case 'medium':
        return '중요';
      case 'low':
        return '참고';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 핵심 인사이트 */}
        {data.key_insights && data.key_insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 핵심 인사이트</Text>
            {data.key_insights.map((insight, index) => (
              <View key={index} style={styles.insightCard}>
                <View style={styles.insightBullet}>
                  <Text style={styles.insightNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 숨겨진 보석들 */}
        {data.hidden_gems && data.hidden_gems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💎 숨겨진 보석</Text>
            {data.hidden_gems.map((gem, index) => (
              <View key={index} style={styles.gemCard}>
                <View style={styles.gemHeader}>
                  <View
                    style={[
                      styles.importanceBadge,
                      { backgroundColor: getImportanceColor(gem.importance) }
                    ]}
                  >
                    <Text style={styles.importanceText}>
                      {getImportanceLabel(gem.importance)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.gemText}>{gem.insight}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 연결점들 */}
        {data.connections && data.connections.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔗 연결점</Text>
            <View style={styles.card}>
              {data.connections.map((connection, index) => (
                <View key={index} style={styles.connectionItem}>
                  <Text style={styles.connectionDot}>•</Text>
                  <Text style={styles.connectionText}>{connection}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 시사점 */}
        {data.implications && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 시사점</Text>
            <View style={styles.implicationsCard}>
              <Text style={styles.implicationsText}>{data.implications}</Text>
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
  insightCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  insightBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightNumber: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  gemCard: {
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
  gemHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  importanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  importanceText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  gemText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  connectionItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  connectionDot: {
    color: Colors.primary,
    fontSize: 14,
    marginRight: 8,
    fontWeight: 'bold',
  },
  connectionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  implicationsCard: {
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  implicationsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

export default InsightsAgentView;
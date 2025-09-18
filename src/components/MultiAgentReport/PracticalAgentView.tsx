/**
 * @component PracticalAgentView
 * @purpose 실천 가이드 에이전트 결과 표시
 * @ai-context 실용적인 조언과 행동 지침 제공
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

interface PracticalAgentViewProps {
  data?: {
    action_items?: Array<{
      priority: 'high' | 'medium' | 'low';
      action: string;
      timeframe?: string;
    }>;
    practical_tips?: string[];
    resources?: Array<{
      type: string;
      description: string;
    }>;
    next_steps?: string;
  };
}

const PracticalAgentView: React.FC<PracticalAgentViewProps> = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>실천 가이드가 없습니다.</Text>
      </View>
    );
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
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

  const getPriorityLabel = (priority?: string) => {
    switch (priority) {
      case 'high':
        return '긴급';
      case 'medium':
        return '중요';
      case 'low':
        return '권장';
      default:
        return '';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 실행 항목 */}
        {data.action_items && data.action_items.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✅ 실행 항목</Text>
            {data.action_items.map((item, index) => (
              <View key={index} style={styles.actionCard}>
                <View style={styles.actionHeader}>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(item.priority) }
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {getPriorityLabel(item.priority)}
                    </Text>
                  </View>
                  {item.timeframe && (
                    <Text style={styles.timeframe}>⏰ {item.timeframe}</Text>
                  )}
                </View>
                <Text style={styles.actionText}>{item.action}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 실용적인 팁 */}
        {data.practical_tips && data.practical_tips.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 실용적인 팁</Text>
            <View style={styles.card}>
              {data.practical_tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipNumber}>{index + 1}.</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 추천 리소스 */}
        {data.resources && data.resources.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📚 추천 리소스</Text>
            {data.resources.map((resource, index) => (
              <View key={index} style={styles.resourceCard}>
                <Text style={styles.resourceType}>{resource.type}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 다음 단계 */}
        {data.next_steps && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🚀 다음 단계</Text>
            <View style={styles.nextStepsCard}>
              <Text style={styles.nextStepsText}>{data.next_steps}</Text>
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
  actionCard: {
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
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priorityText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  timeframe: {
    fontSize: 12,
    color: Colors.textLight,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  tipNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  resourceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.secondary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resourceType: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  resourceDescription: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  nextStepsCard: {
    backgroundColor: Colors.success + '10',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  nextStepsText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

export default PracticalAgentView;
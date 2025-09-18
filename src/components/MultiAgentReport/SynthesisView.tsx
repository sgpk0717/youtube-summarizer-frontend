/**
 * @component SynthesisView
 * @purpose 종합 보고서 표시
 * @ai-context 가장 중요한 탭, 기본 선택
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

interface SynthesisViewProps {
  data?: {
    final_report?: string;
    key_takeaways?: string[];
    recommendations?: string[];
  };
}

const SynthesisView: React.FC<SynthesisViewProps> = ({ data }) => {
  if (!data || !data.final_report) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>종합 보고서가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 최종 보고서 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 종합 분석 보고서</Text>
          <View style={styles.card}>
            <Text style={styles.reportText}>{data.final_report}</Text>
          </View>
        </View>

        {/* 핵심 요점 */}
        {data.key_takeaways && data.key_takeaways.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 핵심 요점</Text>
            <View style={styles.card}>
              {data.key_takeaways.map((takeaway, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{takeaway}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 추천 사항 */}
        {data.recommendations && data.recommendations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 추천 사항</Text>
            <View style={styles.card}>
              {data.recommendations.map((rec, index) => (
                <View key={index} style={styles.bulletItem}>
                  <Text style={styles.bulletNumber}>{index + 1}.</Text>
                  <Text style={styles.bulletText}>{rec}</Text>
                </View>
              ))}
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
  reportText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
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
  bulletNumber: {
    fontSize: 14,
    color: Colors.primary,
    marginRight: 8,
    fontWeight: '600',
  },
  bulletText: {
    fontSize: 14,
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: 20,
  },
});

export default SynthesisView;
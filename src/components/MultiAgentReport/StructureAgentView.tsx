/**
 * @component StructureAgentView
 * @purpose 구조 분석 에이전트 결과 표시
 * @ai-context 콘텐츠 구조와 흐름 분석
 */

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../../styles/colors';

interface StructureAgentViewProps {
  data?: {
    content_structure?: Array<{
      section: string;
      timeRange?: string;
      description: string;
    }>;
    flow_analysis?: string;
    presentation_style?: string;
  };
}

const StructureAgentView: React.FC<StructureAgentViewProps> = ({ data }) => {
  if (!data || !data.content_structure) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>구조 분석 정보가 없습니다.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* 콘텐츠 구조 */}
        {data.content_structure && data.content_structure.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏗️ 콘텐츠 구조</Text>
            {data.content_structure.map((item, index) => (
              <View key={index} style={styles.structureItem}>
                <View style={styles.structureHeader}>
                  <Text style={styles.structureSection}>{item.section}</Text>
                  {item.timeRange && (
                    <Text style={styles.structureTime}>{item.timeRange}</Text>
                  )}
                </View>
                <Text style={styles.structureDescription}>{item.description}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 흐름 분석 */}
        {data.flow_analysis && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌊 흐름 분석</Text>
            <View style={styles.card}>
              <Text style={styles.analysisText}>{data.flow_analysis}</Text>
            </View>
          </View>
        )}

        {/* 발표 스타일 */}
        {data.presentation_style && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎭 발표 스타일</Text>
            <View style={styles.card}>
              <Text style={styles.styleText}>{data.presentation_style}</Text>
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
  structureItem: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  structureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  structureSection: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  structureTime: {
    fontSize: 12,
    color: Colors.textLight,
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  structureDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  analysisText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  styleText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
});

export default StructureAgentView;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '../styles/colors';
import { theme } from '../styles/theme';
import { logger } from '../services/logger';

interface BottomTabsProps {
  activeTab: 'summarize' | 'list';
  onTabPress: (tab: 'summarize' | 'list') => void;
  onSummarize: () => void;
  loading: boolean;
}

const BottomTabs: React.FC<BottomTabsProps> = ({
  activeTab,
  onTabPress,
  onSummarize,
  loading,
}) => {
  logger.debug('📱 BottomTabs 렌더링', { activeTab, loading });

  const handleSummarizePress = () => {
    if (activeTab === 'summarize') {
      logger.info('🚀 요약하기 버튼 클릭', { activeTab });
      onSummarize();
    } else {
      logger.info('📱 요약 탭으로 전환', { from: activeTab, to: 'summarize' });
      onTabPress('summarize');
    }
  };

  const handleListPress = () => {
    logger.info('📋 목록 탭 클릭', { from: activeTab, to: 'list' });
    onTabPress('list');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'summarize' && styles.activeTab,
        ]}
        onPress={handleSummarizePress}
        disabled={loading}
      >
        {loading && activeTab === 'summarize' ? (
          <ActivityIndicator size="small" color="#191F28" />
        ) : (
          <Text style={[
            styles.tabText,
            activeTab === 'summarize' && styles.activeTabText
          ]}>
            요약하기
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'list' && styles.activeTab,
        ]}
        onPress={handleListPress}
        disabled={loading}
      >
        <Text style={[
          styles.tabText,
          activeTab === 'list' && styles.activeTabText
        ]}>
          목록보기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  activeTab: {
    // 현재 선택된 탭 스타일
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8B95A1',
    letterSpacing: -0.2,
  },
  activeTabText: {
    color: '#191F28',
    fontWeight: '600',
  },
});

export default BottomTabs;
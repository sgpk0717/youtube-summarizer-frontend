/**
 * @component AgentTabs
 * @purpose 멀티에이전트 결과 탭 네비게이션
 * @ai-context 가로 스크롤, 에이전트별 색상 코딩
 * @ai-constraints 실패한 에이전트는 비활성화
 */

import React, { useRef } from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../styles/colors';
import { AgentType, AGENT_CONFIGS } from '../../types/multiagent';

interface AgentTabsProps {
  activeTab: AgentType;
  onTabChange: (tab: AgentType) => void;
  availableAgents: string[];
}

/**
 * @component AgentTabs
 * @intent 에이전트 선택 탭
 * @ai-note 가로 스크롤 가능, 비활성 탭은 회색 처리
 */
const AgentTabs: React.FC<AgentTabsProps> = ({
  activeTab,
  onTabChange,
  availableAgents,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = (agentId: AgentType) => {
    onTabChange(agentId);
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {AGENT_CONFIGS.map((agent) => {
        const isAvailable = availableAgents.includes(agent.id);
        const isActive = activeTab === agent.id;

        return (
          <TouchableOpacity
            key={agent.id}
            onPress={() => handleTabPress(agent.id)}
            disabled={!isAvailable}
            style={[
              styles.tab,
              isActive && styles.activeTab,
              !isAvailable && styles.disabledTab,
            ]}
          >
            <Text style={styles.tabIcon}>{agent.icon}</Text>
            <Text
              style={[
                styles.tabLabel,
                isActive && styles.activeTabLabel,
                !isAvailable && styles.disabledTabLabel,
              ]}
            >
              {agent.label}
            </Text>
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: agent.color }]} />
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 4, // 인디케이터 공간 확보
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8, // 상하 패딩 줄임
  },
  tab: {
    marginRight: 20,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 60,
    position: 'relative', // 인디케이터 포지셔닝 위해
  },
  activeTab: {
    // 활성 탭 스타일
  },
  disabledTab: {
    opacity: 0.4,
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  disabledTabLabel: {
    color: Colors.textLight,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -12, // 탭 컨테이너 안에서 적절한 위치로 조정
    width: '80%',
    height: 3,
    borderRadius: 1.5,
  },
});

export default AgentTabs;
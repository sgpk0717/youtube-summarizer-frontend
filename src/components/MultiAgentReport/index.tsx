/**
 * @architecture MultiAgentReport
 * @purpose 멀티에이전트 분석 결과 메인 컨테이너
 * @ai-context 탭 전환과 에이전트별 뷰 관리
 * @ai-constraints 기존 SummaryView와 호환 가능한 구조
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../../styles/colors';
import { MultiAgentResponse, AgentType } from '../../types/multiagent';
import { logger } from '../../services/logger';
import AgentTabs from './AgentTabs';
import SynthesisView from './SynthesisView';
import SummaryAgentView from './SummaryAgentView';
import StructureAgentView from './StructureAgentView';
import InsightsAgentView from './InsightsAgentView';
import PracticalAgentView from './PracticalAgentView';

interface MultiAgentReportProps {
  data: MultiAgentResponse;
}

/**
 * @component MultiAgentReport
 * @intent 멀티에이전트 분석 결과 표시
 * @ai-note Phase별로 점진적 구현, 현재는 종합 보고서만
 * @todo-critical 나머지 에이전트 뷰 구현 필요
 */
const MultiAgentReport: React.FC<MultiAgentReportProps> = ({ data }) => {
  logger.debug('🤖 MultiAgentReport 렌더링', {
    title: data.title,
    channel: data.channel,
    hasAnalysisResult: !!data.analysis_result,
    processingStatus: data.processing_status
  });

  const [activeTab, setActiveTab] = useState<AgentType>('synthesis');

  const handleTabChange = (newTab: AgentType) => {
    logger.info('📱 에이전트 탭 전환', {
      from: activeTab,
      to: newTab,
      title: data.title
    });
    setActiveTab(newTab);
  };

  /**
   * @function availableAgents
   * @intent 성공한 에이전트 목록 계산
   * @ai-note processing_status에서 successful_agents 확인
   */
  const availableAgents = useMemo(() => {
    if (!data.processing_status?.successful_agents) {
      logger.debug('🔍 기본 에이전트 사용', { defaultAgents: ['synthesis'] });
      return ['synthesis']; // 기본값
    }
    logger.info('✅ 성공한 에이전트 목록', {
      successful_agents: data.processing_status.successful_agents,
      count: data.processing_status.successful_agents.length
    });
    return data.processing_status.successful_agents;
  }, [data.processing_status]);

  /**
   * @function renderAgentContent
   * @intent 선택된 에이전트 뷰 렌더링
   * @ai-note 모든 에이전트 뷰 구현 완료
   */
  const renderAgentContent = () => {
    logger.debug('📄 에이전트 콘텐츠 렌더링', {
      activeTab,
      hasAnalysisResult: !!data.analysis_result
    });

    switch (activeTab) {
      case 'synthesis':
        logger.debug('📁 종합 보고서 표시', {
          hasData: !!data.analysis_result?.report_synthesis
        });
        return <SynthesisView data={data.analysis_result?.report_synthesis} />;

      case 'summary':
        logger.debug('📄 요약 에이전트 표시', {
          hasData: !!data.analysis_result?.summary_agent
        });
        return <SummaryAgentView data={data.analysis_result?.summary_agent} />;

      case 'structure':
        logger.debug('🏠 구조 에이전트 표시', {
          hasData: !!data.analysis_result?.structure_agent
        });
        return <StructureAgentView data={data.analysis_result?.structure_agent} />;

      case 'insights':
        logger.debug('💡 인사이트 에이전트 표시', {
          hasData: !!data.analysis_result?.insights_agent
        });
        return <InsightsAgentView data={data.analysis_result?.insights_agent} />;

      case 'practical':
        logger.debug('🌠 실용 에이전트 표시', {
          hasData: !!data.analysis_result?.practical_agent
        });
        return <PracticalAgentView data={data.analysis_result?.practical_agent} />;

      default:
        logger.warn('⚠️ 알 수 없는 에이전트 탭', { activeTab });
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 비디오 정보 헤더 */}
      <View style={styles.videoInfo}>
        <Text style={styles.title} numberOfLines={2}>
          {data.title}
        </Text>
        <Text style={styles.channel}>{data.channel}</Text>
        {data.duration && (
          <Text style={styles.duration}>재생 시간: {data.duration}</Text>
        )}
      </View>

      {/* 에이전트 탭 */}
      <AgentTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        availableAgents={availableAgents}
      />

      {/* 에이전트 콘텐츠 */}
      <View style={styles.contentContainer}>{renderAgentContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  videoInfo: {
    backgroundColor: Colors.white,
    padding: 16,
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
  contentContainer: {
    flex: 1,
  },
});

export default MultiAgentReport;
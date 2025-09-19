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
    processingStatus: data.analysis_result?.processing_status,
    completedAgents: data.analysis_result?.processing_status?.completed_agents
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
   * @ai-note processing_status는 analysis_result 안에 있음
   * @ai-fixed 2024-01-20: completed_agents 배열을 프론트엔드 탭 ID로 매핑
   */
  const availableAgents = useMemo(() => {
    const processingStatus = data.analysis_result?.processing_status;

    if (!processingStatus?.completed_agents || processingStatus.completed_agents.length === 0) {
      logger.debug('🔍 기본 에이전트 사용', { defaultAgents: ['synthesis'] });
      return ['synthesis']; // 기본값
    }

    // 백엔드 에이전트 이름을 프론트엔드 탭 ID로 매핑
    const backendToFrontendMap: { [key: string]: string } = {
      'transcript_refiner': 'summary',
      'speaker_diarizer': 'summary',
      'topic_cohesion': 'insights',
      'structure_designer': 'structure',
      'report_synthesizer': 'synthesis'
    };

    // 중복 제거하여 고유한 탭 ID만 추출
    const mappedAgents = Array.from(new Set(
      processingStatus.completed_agents
        .map(agent => backendToFrontendMap[agent])
        .filter(Boolean)
    ));

    // 기본값을 포함하여 최소한 synthesis는 표시
    if (!mappedAgents.includes('synthesis')) {
      mappedAgents.push('synthesis');
    }

    logger.info('✅ 에이전트 매핑 완료', {
      backend_agents: processingStatus.completed_agents,
      frontend_tabs: mappedAgents,
      count: mappedAgents.length
    });

    return mappedAgents;
  }, [data.analysis_result]);

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
        // report_synthesis에서 final_report를 추출하여 전달
        return <SynthesisView data={{
          final_report: data.analysis_result?.report_synthesis?.final_report || data.final_report || '보고서를 생성 중입니다...'
        }} />;

      case 'summary':
        logger.debug('📄 요약 에이전트 표시', {
          hasData: !!data.analysis_result?.transcript_refinement
        });
        // transcript_refinement 데이터를 사용
        return <SummaryAgentView data={data.analysis_result?.transcript_refinement} />;

      case 'structure':
        logger.debug('🏠 구조 에이전트 표시', {
          hasData: !!data.analysis_result?.structure_design
        });
        // structure_design 데이터를 사용
        return <StructureAgentView data={data.analysis_result?.structure_design} />;

      case 'insights':
        logger.debug('💡 인사이트 에이전트 표시', {
          hasData: !!data.analysis_result?.topic_cohesion
        });
        // topic_cohesion 데이터를 사용
        return <InsightsAgentView data={data.analysis_result?.topic_cohesion} />;

      case 'practical':
        logger.debug('🌠 실용 에이전트 표시', {
          hasData: false // 백엔드에 practical 에이전트가 없음
        });
        // 백엔드에 해당 에이전트가 없으므로 빈 데이터 표시
        return <PracticalAgentView data={null} />;

      default:
        logger.warn('⚠️ 알 수 없는 에이전트 탭', { activeTab });
        return (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>데이터가 없습니다.</Text>
          </View>
        );
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default MultiAgentReport;
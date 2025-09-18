/**
 * @architecture MultiAgentSystem
 * @purpose 멀티에이전트 분석 시스템 타입 정의
 * @ai-context 백엔드 응답 구조와 정확히 일치해야 함
 * @ai-constraints 기존 Summary 타입과 별개로 관리
 * @dependencies 없음 (독립적 타입 정의)
 * @last-review 2024-09-18
 */

/**
 * @interface MultiAgentAnalysisResult
 * @intent 5개 AI 에이전트의 분석 결과 구조 정의
 * @ai-note 각 에이전트는 독립적으로 실패할 수 있음
 */
export interface MultiAgentAnalysisResult {
  // 요약 추출 에이전트
  summary_extraction?: {
    brief: string;
    key_points: string[];
    comprehensive: string;
    confidence_score?: number;
  };

  // 콘텐츠 구조 분석 에이전트
  content_structure?: {
    sections: Array<{
      title: string;
      start_time: string;
      end_time: string;
      description: string;
    }>;
    timeline: Array<{
      timestamp: string;
      event: string;
      importance: 'high' | 'medium' | 'low';
    }>;
    total_sections?: number;
  };

  // 핵심 인사이트 도출 에이전트
  key_insights?: {
    main_ideas: string[];
    supporting_points: { [key: string]: string[] };
    connections?: string[];
  };

  // 실천 가이드 에이전트
  practical_guide?: {
    actionable_items: Array<{
      item: string;
      priority: 'high' | 'medium' | 'low';
      tip?: string;
    }>;
    tips: string[];
    estimated_time?: string;
  };

  // 종합 보고서 에이전트
  report_synthesis?: {
    final_report: string;
    key_takeaways?: string[];
    recommendations?: string[];
  };
}

/**
 * @interface ProcessingStatus
 * @intent 멀티에이전트 처리 상태 추적
 * @ai-note 실시간 진행 상태 표시에 사용
 */
export interface ProcessingStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  successful_agents: string[];
  failed_agents: string[];
  current_agent?: string;
  current_progress?: number;
  total_processing_time: number;
  message?: string;
}

/**
 * @interface MultiAgentResponse
 * @intent 백엔드 /api/summarize 응답 전체 구조
 * @ai-warning 이 타입 변경 시 백엔드와 동기화 필수
 */
export interface MultiAgentResponse {
  // 비디오 기본 정보
  video_id: string;
  title: string;
  channel: string;
  duration: string;
  language: string;

  // 멀티에이전트 분석 결과
  analysis_result: MultiAgentAnalysisResult;

  // 처리 상태
  processing_status: ProcessingStatus;

  // 종합 보고서 (빠른 접근용)
  final_report?: string;

  // 메타 정보
  transcript_available: boolean;
  analysis_type: 'multi_agent';
  processing_time: number;

  // 저장용 필드
  id?: string;
  created_at?: string;
  user_nickname?: string;
}

/**
 * @type AgentType
 * @intent 에이전트 식별자 열거형
 * @ai-note 탭 네비게이션에서 사용
 */
export type AgentType =
  | 'synthesis'   // 종합 보고서
  | 'summary'     // 요약
  | 'structure'   // 구조
  | 'insights'    // 인사이트
  | 'practical';  // 실천

/**
 * @interface AgentConfig
 * @intent UI 표시용 에이전트 설정
 * @ai-note 아이콘은 이모지 사용
 */
export interface AgentConfig {
  id: AgentType;
  name: string;
  label: string;
  icon: string;
  color: string;
  description: string;
}

/**
 * @constant AGENT_CONFIGS
 * @intent 각 에이전트 UI 설정 정의
 * @ai-constraints 색상은 Colors.ts와 일치해야 함
 */
export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'synthesis',
    name: '종합 보고서',
    label: '종합',
    icon: '📊',
    color: '#2563eb', // primary
    description: '모든 분석을 종합한 최종 보고서'
  },
  {
    id: 'summary',
    name: '요약 추출',
    label: '요약',
    icon: '📝',
    color: '#10b981', // success
    description: '핵심 내용 요약'
  },
  {
    id: 'structure',
    name: '구조 분석',
    label: '구조',
    icon: '🏗️',
    color: '#f59e0b', // warning
    description: '콘텐츠 구조와 타임라인'
  },
  {
    id: 'insights',
    name: '인사이트',
    label: '인사이트',
    icon: '💡',
    color: '#8b5cf6', // purple
    description: '핵심 통찰과 아이디어'
  },
  {
    id: 'practical',
    name: '실천 가이드',
    label: '실천',
    icon: '✅',
    color: '#ef4444', // error
    description: '실행 가능한 액션 아이템'
  }
];
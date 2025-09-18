import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API & Types
import { summarizeVideo, getSummaries, analyzeVideoWithAgents } from './src/services/api';
import { Summary } from './src/types';
import { MultiAgentResponse } from './src/types/multiagent';

// Context
import { UserProvider, useUser } from './src/contexts/UserContext';

// Components
import Header from './src/components/Header';
import URLInputView from './src/components/URLInputView';
import SummaryView from './src/components/SummaryView';
import SummaryList from './src/components/SummaryList';
import BottomTabs from './src/components/BottomTabs';
import UserModal from './src/components/UserModal';
import MultiAgentReport from './src/components/MultiAgentReport';
// import SplashScreen from './src/components/SplashScreen'; // 임시 비활성화
import LogViewer from './src/components/LogViewer';

// Styles
import { Colors } from './src/styles/colors';
import { theme } from './src/styles/theme';

// Logger
import { logger } from './src/services/logger';

type ViewState = 'input' | 'summary' | 'list' | 'multiagent';

const STORAGE_KEY = '@youtube_summaries';


/**
 * @component AppContent
 * @intent 실제 앱 컨텐츠 (UserContext 사용을 위해 분리)
 * @ai-note UserProvider 내부에서 실행되어야 함
 */
function AppContent(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const [viewState, setViewState] = useState<ViewState>('input');
  const [activeTab, setActiveTab] = useState<'summarize' | 'list'>('summarize');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [multiAgentResult, setMultiAgentResult] = useState<MultiAgentResponse | null>(null);
  const [summaryHistory, setSummaryHistory] = useState<Summary[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [useMultiAgent] = useState(true); // 항상 멀티에이전트 사용

  // UserContext에서 닉네임 정보 가져오기
  const { nickname, isLoading: userLoading } = useUser();

  // 스플래시 화면 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      logger.info('⏰ 스플래시 타이머 완료, 메인 화면으로 전환');
      setShowSplash(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 앱 시작 시 저장된 요약 목록 불러오기 & 닉네임 체크
  useEffect(() => {
    logger.info('🚀 앱 컴포넌트 마운트', { userLoading, hasNickname: !!nickname });
    loadSummaryHistory();

    // @ai-note 닉네임이 없으면 모달 표시
    if (!userLoading && !nickname) {
      logger.info('📝 닉네임 없음, 모달 표시');
      setShowUserModal(true);
    }
  }, [userLoading, nickname]);

  // 저장된 요약 목록 불러오기
  const loadSummaryHistory = async () => {
    logger.info('📂 저장된 요약 목록 불러오기 시작');
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const summaries = JSON.parse(stored);
        logger.info('✅ 요약 목록 불러오기 성공', { count: summaries.length });
        setSummaryHistory(summaries);
      } else {
        logger.info('📋 저장된 요약 없음');
      }
    } catch (error) {
      logger.error('❌ 요약 목록 불러오기 실패', error);
    }
  };

  // 요약을 목록에 저장
  const saveSummaryToHistory = async (summary: Summary) => {
    logger.info('💾 요약 저장 시작', { title: summary.title });
    try {
      const newSummary = {
        ...summary,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };

      const updatedHistory = [newSummary, ...summaryHistory];
      setSummaryHistory(updatedHistory);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      logger.info('✅ 요약 저장 성공', { id: newSummary.id });
    } catch (error) {
      logger.error('❌ 요약 저장 실패', error);
    }
  };

  // YouTube URL 유효성 검사
  const isValidYouTubeUrl = (url: string): boolean => {
    logger.debug('🔍 YouTube URL 유효성 검사', { url });
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    const isValid = youtubeRegex.test(url);
    logger.debug(`✅ 유효성 검사 결과: ${isValid}`);
    return isValid;
  };

  // 요약하기 처리
  const handleSummarize = async () => {
    logger.info('🎬 요약하기 시작', { url, useMultiAgent, nickname });

    if (!url.trim()) {
      logger.warn('⚠️ URL 비어있음');
      Alert.alert('알림', 'YouTube URL을 입력해주세요.');
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      logger.warn('⚠️ 올바르지 않은 YouTube URL', { url });
      Alert.alert('오류', '올바른 YouTube URL을 입력해주세요.');
      return;
    }

    setLoading(true);
    setCurrentSummary(null);
    setMultiAgentResult(null);

    try {
      // 멀티에이전트 분석 사용 여부에 따라 다른 API 호출
      if (useMultiAgent && nickname) {
        logger.info('🤖 멀티에이전트 분석 시작');
        const result = await analyzeVideoWithAgents(url, nickname);

        if (result.success && result.data) {
          logger.info('✅ 멀티에이전트 분석 성공', { agents: result.data.agents?.length });
          setMultiAgentResult(result.data);
          setViewState('multiagent');
          // URL 초기화
          setUrl('');
        } else {
          logger.error('❌ 멀티에이전트 분석 실패', { error: result.error });
          Alert.alert('오류', result.error || '멀티에이전트 분석에 실패했습니다.');
        }
      } else {
        // 기존 단순 요약
        logger.info('📝 단순 요약 시작');
        const result = await summarizeVideo(url);

        if (result.success && result.data) {
          logger.info('✅ 요약 생성 성공', { title: result.data.title });
          setCurrentSummary(result.data);
          setViewState('summary');
          await saveSummaryToHistory(result.data);
          // URL 초기화
          setUrl('');
        } else {
          logger.error('❌ 요약 생성 실패', { error: result.error });
          Alert.alert('오류', result.error || '요약 생성에 실패했습니다.');
        }
      }
    } catch (error) {
      logger.error('❌ 예상치 못한 오류', error);
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      logger.info('🏁 요약 프로세스 종료');
    }
  };

  // 탭 전환 처리
  const handleTabPress = (tab: 'summarize' | 'list') => {
    logger.info('📱 탭 전환', { from: activeTab, to: tab });
    setActiveTab(tab);

    if (tab === 'summarize') {
      if (multiAgentResult) {
        setViewState('multiagent');
      } else if (currentSummary) {
        setViewState('summary');
      } else {
        setViewState('input');
      }
    } else {
      setViewState('list');
    }
  };

  // 목록에서 요약 선택
  const handleSelectSummary = (summary: Summary) => {
    logger.info('📄 요약 선택', { id: summary.id, title: summary.title });
    setCurrentSummary(summary);
    setViewState('summary');
    setActiveTab('summarize');
  };

  // 콘텐츠 렌더링
  const renderContent = () => {
    switch (viewState) {
      case 'input':
        return (
          <URLInputView
            url={url}
            onChangeUrl={setUrl}
            loading={loading}
          />
        );

      case 'summary':
        return currentSummary ? (
          <SummaryView summary={currentSummary} />
        ) : null;

      case 'multiagent':
        return multiAgentResult ? (
          <MultiAgentReport data={multiAgentResult} />
        ) : null;

      case 'list':
        return (
          <SummaryList
            summaries={summaryHistory}
            onSelectSummary={handleSelectSummary}
          />
        );

      default:
        return null;
    }
  };

  // 스플래시 스크린 표시
  if (showSplash) {
    // @ai-note 단순한 인라인 스플래시 - 컴포넌트 문제 완전 회피
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: '#000000'
        }}>
          유튜브 요약기
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header
          nickname={nickname || ''}
          onUserPress={() => setShowUserModal(true)}
        />

        <View style={styles.content}>
          {renderContent()}
        </View>

        <BottomTabs
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onSummarize={handleSummarize}
          loading={loading}
        />
      </KeyboardAvoidingView>

      {/* 닉네임 모달 */}
      <UserModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
      />

      {/* 로그 뷰어 */}
      <LogViewer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
});

/**
 * @component App
 * @intent UserProvider로 감싸진 최종 앱
 * @ai-note Context Provider는 최상위에서 한 번만 감싸기
 */
function App(): React.JSX.Element {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
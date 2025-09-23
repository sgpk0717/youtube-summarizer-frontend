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
import { summarizeVideo, getSummaries, analyzeVideoWithAgents, checkServerHealth } from './src/services/api';
import { Summary } from './src/types';
import { MultiAgentResponse } from './src/types/multiagent';

// Context
import { UserProvider, useUser } from './src/contexts/UserContext';
import { AppStatusProvider, useAppStatus, STATUS_MESSAGES } from './src/contexts/AppStatusContext';

// Components
import Header from './src/components/Header';
import URLInputView from './src/components/URLInputView';
import SummaryView from './src/components/SummaryView';
import SummaryList from './src/components/SummaryList';
import BottomTabs from './src/components/BottomTabs';
import UserModal from './src/components/UserModal';
import MultiAgentReport from './src/components/MultiAgentReport';
import LoginScreen from './src/components/LoginScreen';
// import SplashScreen from './src/components/SplashScreen'; // 임시 비활성화
import LogViewer from './src/components/LogViewer';
import { AppStatusBar } from './src/components/StatusBar';

// Styles
import { Colors } from './src/styles/colors';
import { theme } from './src/styles/theme';

// Logger
import { logger } from './src/services/logger';
// FCM Service
import fcmService from './src/services/fcmService';

type ViewState = 'input' | 'summary' | 'list' | 'multiagent';

const STORAGE_KEY = '@youtube_summaries';


/**
 * @component AppContent
 * @intent 실제 앱 컨텐츠 (UserContext 사용을 위해 분리)
 * @ai-note UserProvider 내부에서 실행되어야 함
 */
function AppContent(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true);
  const [serverReady, setServerReady] = useState(false);
  const [viewState, setViewState] = useState<ViewState>('input');
  const [activeTab, setActiveTab] = useState<'summarize' | 'list'>('summarize');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSummary, setCurrentSummary] = useState<Summary | null>(null);
  const [multiAgentResult, setMultiAgentResult] = useState<MultiAgentResponse | null>(null);
  const [summaryHistory, setSummaryHistory] = useState<Summary[]>([]);
  const [useMultiAgent] = useState(true); // 항상 멀티에이전트 사용

  // UserContext에서 닉네임 정보 가져오기
  const { nickname, isLoading: userLoading } = useUser();

  // AppStatusContext 사용
  const {
    showStatus,
    hideStatus,
    setServerStatus,
    setIsConnecting
  } = useAppStatus();

  // 서버 헬스체크 및 스플래시 화면
  useEffect(() => {
    const initializeApp = async () => {
      logger.info('🚀 앱 초기화 시작');

      // FCM 초기화 (백그라운드에서 처리)
      fcmService.initialize().catch(error => {
        logger.warn('⚠️ FCM 초기화 실패 (계속 진행)', error);
      });

      // 상태바에 연결 중 표시
      showStatus(STATUS_MESSAGES.CHECKING_SERVER, 'loading');
      setIsConnecting(true);
      setServerStatus('checking');

      let retries = 3;
      let connected = false;

      // 헬스체크 (재시도 3회)
      while (retries > 0 && !connected) {
        try {
          const result = await checkServerHealth();
          if (result.success && result.data?.status === 'healthy') {
            logger.info('✅ 서버 연결 성공', result.data);
            connected = true;
            setServerReady(true);
            setServerStatus('healthy');
            showStatus(STATUS_MESSAGES.SERVER_CONNECTED, 'success', 2000);
          } else {
            throw new Error(result.error || 'Server unhealthy');
          }
        } catch (error) {
          retries--;
          logger.warn(`⚠️ 서버 연결 실패, 재시도 남음: ${retries}`, error);

          if (retries > 0) {
            showStatus(`${STATUS_MESSAGES.RETRYING} (${3 - retries}/3)`, 'loading');
            await new Promise(resolve => setTimeout(resolve, 2000));
          } else {
            logger.error('❌ 서버 연결 완전 실패');
            setServerStatus('unhealthy');
            showStatus(STATUS_MESSAGES.SERVER_DISCONNECTED, 'error');
            Alert.alert(
              '연결 실패',
              'Tailscale 연결을 확인하고 앱을 재시작해주세요.',
              [{ text: '확인' }]
            );
          }
        }
      }

      setIsConnecting(false);

      // 서버 연결 성공 시에만 스플래시 종료
      if (connected) {
        setTimeout(() => {
          setShowSplash(false);
          hideStatus();
        }, 500);
      }
    };

    initializeApp();
  }, []);

  // 앱 시작 시 저장된 요약 목록 불러오기
  useEffect(() => {
    logger.info('🚀 앱 컴포넌트 마운트', { userLoading, hasNickname: !!nickname });
    loadSummaryHistory();
  }, [userLoading, nickname]);

  // 서버에서 요약 목록 불러오기 (닉네임별 필터링)
  const loadSummaryHistory = async () => {
    logger.info('📂 서버에서 요약 목록 불러오기 시작', { nickname });

    if (!nickname) {
      logger.info('📋 닉네임 없음, 목록 로드 건너뛰기');
      return;
    }

    try {
      const result = await getSummaries(nickname);
      if (result.success && result.data) {
        logger.info('✅ 서버 요약 목록 불러오기 성공', {
          nickname,
          count: result.data.length
        });
        setSummaryHistory(result.data);
      } else {
        logger.error('❌ 서버 요약 목록 불러오기 실패', {
          nickname,
          error: result.error
        });
        setSummaryHistory([]);
      }
    } catch (error) {
      logger.error('❌ 요약 목록 불러오기 예외', { nickname, error });
      setSummaryHistory([]);
    }
  };

  // 멀티에이전트 결과를 Summary로 변환
  const convertMultiAgentToSummary = (multiAgentResult: MultiAgentResponse, originalUrl: string): Summary => {
    // 종합 보고서에서 간단한 요약 추출 (첫 번째 문단 또는 처음 100자)
    const finalReport = multiAgentResult.final_report || '';
    const firstParagraph = finalReport.split('\n').find(line => line.trim().length > 20) || '';
    const briefSummary = firstParagraph.length > 100
      ? firstParagraph.substring(0, 100) + '...'
      : firstParagraph || '멀티에이전트 분석 완료';

    // 키 포인트 추출 (보고서에서 - 또는 * 로 시작하는 라인들 찾기)
    const keyPointsRegex = /^[\s]*[-*]\s*(.+)$/gm;
    const keyPointsMatches = finalReport.match(keyPointsRegex) || [];
    const keyPoints = keyPointsMatches
      .map(match => match.replace(/^[\s]*[-*]\s*/, '').trim())
      .filter(point => point.length > 0)
      .slice(0, 5); // 최대 5개

    if (keyPoints.length === 0) {
      keyPoints.push('멀티에이전트 시스템으로 분석 완료');
    }

    return {
      url: originalUrl,
      title: multiAgentResult.title,
      channel: multiAgentResult.channel,
      duration: multiAgentResult.duration,
      one_line: briefSummary,
      key_points: keyPoints,
      detailed_summary: finalReport || '멀티에이전트 분석으로 생성된 종합 보고서',
    };
  };

  // 요약을 서버에 저장 (서버에서 자동 저장되므로 로컬 처리만)
  const saveSummaryToHistory = async (summary: Summary) => {
    logger.info('💾 요약 히스토리 업데이트', { title: summary.title });
    try {
      // 서버에서 이미 저장되었으므로, 로컬 상태만 업데이트
      const newSummary = {
        ...summary,
        id: summary.id || Date.now().toString(),
        created_at: summary.created_at || new Date().toISOString(),
      };

      // 로컬 상태 업데이트 (중복 방지)
      const updatedHistory = [newSummary, ...summaryHistory.filter(s => s.url !== summary.url)];
      setSummaryHistory(updatedHistory);

      logger.info('✅ 로컬 히스토리 업데이트 성공', { id: newSummary.id });
    } catch (error) {
      logger.error('❌ 히스토리 업데이트 실패', error);
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

    // FCM 권한 요청 (옵셔널 - 실패해도 분석은 계속 진행)
    try {
      const hasPermission = await fcmService.ensurePermissionForAnalysis();
      logger.info('🔔 FCM 권한 상태', { hasPermission });
    } catch (fcmError) {
      logger.debug('🔕 FCM 권한 요청 실패 - 푸시 알림 없이 진행', fcmError);
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
          logger.info('✅ 멀티에이전트 분석 성공', { title: result.data.title });
          setMultiAgentResult(result.data);
          setViewState('multiagent');

          // 멀티에이전트 결과를 Summary로 변환해서 목록에 저장
          const convertedSummary = convertMultiAgentToSummary(result.data, url);
          await saveSummaryToHistory(convertedSummary);

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
  const handleTabPress = async (tab: 'summarize' | 'list') => {
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
      // 목록 탭으로 전환할 때 서버에서 최신 데이터 로드
      await loadSummaryHistory();
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
            onAnalyze={handleSummarize}
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

  // 스플래시 스크린 표시 (헬스체크 포함)
  if (showSplash) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
      }}>
        <AppStatusBar />
        <Text style={{
          fontSize: 24,
          fontWeight: '600',
          color: '#000000',
          marginBottom: 20
        }}>
          유튜브 요약기
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: 12,
            color: '#666666'
          }}>
            {serverReady ? '연결 완료' : '서버 연결 중...'}
          </Text>
        </View>
      </View>
    );
  }

  // 닉네임이 없으면 LoginScreen 표시
  if (!userLoading && !nickname) {
    logger.info('📝 닉네임 없음, LoginScreen 표시');
    return (
      <>
        <LoginScreen
          onLoginComplete={() => {
            logger.info('✅ 로그인 완료, 메인 화면으로 전환');
            // 닉네임이 설정되면 자동으로 메인 화면으로 넘어감
          }}
        />
        <LogViewer />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <AppStatusBar />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header
          nickname={nickname || ''}
        />

        <View style={styles.content}>
          {renderContent()}
        </View>

        <BottomTabs
          activeTab={activeTab}
          onTabPress={handleTabPress}
          onSummarize={() => {
            // 탭에서는 API 호출하지 않음, URLInputView의 분석하기 버튼에서만 호출
            logger.info('📱 요약하기 탭 클릭 - 탭 전환만 수행');
          }}
          loading={loading}
        />
      </KeyboardAvoidingView>


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
    <AppStatusProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AppStatusProvider>
  );
}

export default App;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { theme } from '../styles/theme';
import { logger, LogEntry, LogLevel } from '../services/logger';

const LogViewer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [searchText, setSearchText] = useState('');
  const [showButton, setShowButton] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // 로거 초기화
    logger.info('🚀 앱 시작', { timestamp: new Date().toISOString() });

    // 로그 리스너 등록
    const handleLogsUpdate = (updatedLogs: LogEntry[]) => {
      setLogs(updatedLogs);
      filterLogs(updatedLogs, selectedLevel, searchText);
    };

    logger.addListener(handleLogsUpdate);

    // 초기 로그 로드
    const initialLogs = logger.getLogs();
    setLogs(initialLogs);
    setFilteredLogs(initialLogs);

    return () => {
      logger.removeListener(handleLogsUpdate);
    };
  }, []);

  useEffect(() => {
    filterLogs(logs, selectedLevel, searchText);
  }, [selectedLevel, searchText, logs]);

  const filterLogs = (logsToFilter: LogEntry[], level: LogLevel | 'ALL', search: string) => {
    let filtered = logsToFilter;

    if (level !== 'ALL') {
      filtered = filtered.filter(log => log.level === level);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        (log.data && JSON.stringify(log.data).toLowerCase().includes(searchLower))
      );
    }

    setFilteredLogs(filtered);
  };

  const clearLogs = () => {
    Alert.alert(
      '로그 삭제',
      '모든 로그를 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            logger.clearLogs();
            logger.info('📋 로그 클리어됨');
          }
        }
      ]
    );
  };

  const exportLogs = () => {
    const logsJson = logger.exportLogs();
    logger.info('📤 로그 내보내기', { size: logsJson.length });
    Alert.alert('로그 내보내기', `로그 데이터 크기: ${logsJson.length} bytes`);
  };

  const getLogIcon = (level: LogLevel) => {
    switch(level) {
      case LogLevel.DEBUG: return '🔍';
      case LogLevel.INFO: return 'ℹ️';
      case LogLevel.WARN: return '⚠️';
      case LogLevel.ERROR: return '❌';
    }
  };

  const getLogColor = (level: LogLevel) => {
    switch(level) {
      case LogLevel.DEBUG: return '#6B7684';
      case LogLevel.INFO: return '#3182F6';
      case LogLevel.WARN: return '#FFC043';
      case LogLevel.ERROR: return '#FF5B5B';
    }
  };

  const stats = logger.getStats();

  return (
    <>
      {/* 플로팅 버튼 */}
      {showButton && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => setIsVisible(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingButtonText}>📋</Text>
        </TouchableOpacity>
      )}

      {/* 로그 뷰어 모달 */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setIsVisible(false)}
      >
        <SafeAreaView style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>로그 뷰어</Text>
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 통계 */}
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>총</Text>
              <Text style={styles.statValue}>{stats.total}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: getLogColor(LogLevel.DEBUG) }]}>디버그</Text>
              <Text style={styles.statValue}>{stats.debug}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: getLogColor(LogLevel.INFO) }]}>정보</Text>
              <Text style={styles.statValue}>{stats.info}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: getLogColor(LogLevel.WARN) }]}>경고</Text>
              <Text style={styles.statValue}>{stats.warn}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statLabel, { color: getLogColor(LogLevel.ERROR) }]}>에러</Text>
              <Text style={styles.statValue}>{stats.error}</Text>
            </View>
          </View>

          {/* 필터 */}
          <View style={styles.filters}>
            <TextInput
              style={styles.searchInput}
              placeholder="검색..."
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#8B95A1"
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.levelFilters}>
              <TouchableOpacity
                style={[styles.levelButton, selectedLevel === 'ALL' && styles.levelButtonActive]}
                onPress={() => setSelectedLevel('ALL')}
              >
                <Text style={[styles.levelButtonText, selectedLevel === 'ALL' && styles.levelButtonTextActive]}>
                  전체
                </Text>
              </TouchableOpacity>

              {Object.values(LogLevel).map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelButton,
                    selectedLevel === level && styles.levelButtonActive,
                    { borderColor: getLogColor(level) }
                  ]}
                  onPress={() => setSelectedLevel(level)}
                >
                  <Text style={[
                    styles.levelButtonText,
                    selectedLevel === level && styles.levelButtonTextActive
                  ]}>
                    {getLogIcon(level)} {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* 액션 버튼 */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={clearLogs}>
              <Text style={styles.actionButtonText}>🗑 클리어</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={exportLogs}>
              <Text style={styles.actionButtonText}>💾 내보내기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => scrollViewRef.current?.scrollToEnd()}
            >
              <Text style={styles.actionButtonText}>⬇ 맨 아래</Text>
            </TouchableOpacity>
          </View>

          {/* 로그 목록 */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.logList}
            contentContainerStyle={styles.logListContent}
          >
            {filteredLogs.map((log, index) => (
              <View key={index} style={[styles.logItem, { borderLeftColor: getLogColor(log.level) }]}>
                <View style={styles.logHeader}>
                  <Text style={styles.logTimestamp}>
                    {new Date(log.timestamp).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      fractionalSecondDigits: 3
                    })}
                  </Text>
                  <Text style={[styles.logLevel, { color: getLogColor(log.level) }]}>
                    {getLogIcon(log.level)} {log.level}
                  </Text>
                </View>

                <Text style={styles.logMessage}>{log.message}</Text>

                {log.location && (
                  <Text style={styles.logLocation}>📍 {log.location}</Text>
                )}

                {log.data && (
                  <View style={styles.logData}>
                    <Text style={styles.logDataLabel}>📊 DATA:</Text>
                    <Text style={styles.logDataContent}>
                      {typeof log.data === 'object'
                        ? JSON.stringify(log.data, null, 2)
                        : String(log.data)}
                    </Text>
                  </View>
                )}

                {log.stackTrace && (
                  <View style={styles.logStackTrace}>
                    <Text style={styles.logStackTraceLabel}>🔥 Stack Trace:</Text>
                    <Text style={styles.logStackTraceContent}>
                      {log.stackTrace}
                    </Text>
                  </View>
                )}
              </View>
            ))}

            {filteredLogs.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>로그가 없습니다</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#191F28',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#191F28',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6B7684',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EB',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7684',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#191F28',
  },
  filters: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EB',
  },
  searchInput: {
    backgroundColor: '#F7F8FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#191F28',
    marginBottom: 12,
  },
  levelFilters: {
    flexDirection: 'row',
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E8EB',
    marginRight: 8,
  },
  levelButtonActive: {
    backgroundColor: '#191F28',
    borderColor: '#191F28',
  },
  levelButtonText: {
    fontSize: 12,
    color: '#6B7684',
  },
  levelButtonTextActive: {
    color: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E8EB',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3182F6',
    fontWeight: '500',
  },
  logList: {
    flex: 1,
  },
  logListContent: {
    padding: 16,
  },
  logItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  logTimestamp: {
    fontSize: 11,
    color: '#8B95A1',
  },
  logLevel: {
    fontSize: 11,
    fontWeight: '600',
  },
  logMessage: {
    fontSize: 13,
    color: '#191F28',
    lineHeight: 18,
  },
  logLocation: {
    fontSize: 11,
    color: '#6B7684',
    marginTop: 4,
  },
  logData: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F7F8FA',
    borderRadius: 4,
  },
  logDataLabel: {
    fontSize: 11,
    color: '#6B7684',
    marginBottom: 4,
  },
  logDataContent: {
    fontSize: 11,
    color: '#191F28',
    fontFamily: 'monospace',
  },
  logStackTrace: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 4,
  },
  logStackTraceLabel: {
    fontSize: 11,
    color: '#FF5B5B',
    marginBottom: 4,
  },
  logStackTraceContent: {
    fontSize: 10,
    color: '#191F28',
    fontFamily: 'monospace',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8B95A1',
  },
});

export default LogViewer;
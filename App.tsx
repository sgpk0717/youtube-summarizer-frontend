import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { summarizeVideo } from './src/services/api';
import { Summary } from './src/types';

function App(): React.JSX.Element {
  const [url, setUrl] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [summary, setSummary] = React.useState<Summary | null>(null);

  const handleSummarize = async () => {
    if (!url.trim()) {
      Alert.alert('오류', 'YouTube URL을 입력해주세요.');
      return;
    }

    setLoading(true);
    setSummary(null);

    try {
      const result = await summarizeVideo(url);
      
      if (result.success && result.data) {
        setSummary(result.data);
      } else {
        Alert.alert('오류', result.error || '요약 생성에 실패했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>YouTube 요약기</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>YouTube URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://youtube.com/watch?v=..."
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSummarize}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>요약하기</Text>
              )}
            </TouchableOpacity>
          </View>

          {summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>{summary.title}</Text>
              <Text style={styles.channelText}>채널: {summary.channel}</Text>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>한 줄 요약</Text>
                <Text style={styles.sectionContent}>{summary.one_line_summary}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>핵심 포인트</Text>
                {summary.key_points.map((point, index) => (
                  <Text key={index} style={styles.bulletPoint}>• {point}</Text>
                ))}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>상세 요약</Text>
                <Text style={styles.sectionContent}>{summary.detailed_summary}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  channelText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  section: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
  },
  bulletPoint: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 4,
    paddingLeft: 8,
  },
});

export default App;

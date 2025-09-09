import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { youtubeService } from '../services/api';
import { Summary } from '../types';
// Icons removed due to compatibility issues

interface FormData {
  url: string;
}

const HomeScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      url: '',
    },
  });

  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url) || 'Please enter a valid YouTube URL';
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setSummary(null);

    const response = await youtubeService.summarize(data.url);

    if (response.success && response.data) {
      setSummary(response.data);
      reset();
    } else {
      Alert.alert(
        'Error',
        response.error || 'Failed to summarize video',
        [{ text: 'OK' }]
      );
    }

    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="px-4 py-6">
            {/* Header */}
            <View className="items-center mb-8">
              <Text className="text-2xl font-bold text-gray-900 mt-3">
                YouTube Summarizer
              </Text>
              <Text className="text-gray-600 text-center mt-2">
                Enter a YouTube URL to get an AI-powered summary
              </Text>
            </View>

            {/* URL Input Form */}
            <View className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <View className="flex-row items-center mb-4">
                <Text className="text-gray-700 font-medium ml-2">
                  YouTube URL
                </Text>
              </View>
              
              <Controller
                control={control}
                rules={{
                  required: 'URL is required',
                  validate: validateYouTubeUrl,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900"
                    placeholder="https://youtube.com/watch?v=..."
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!loading}
                  />
                )}
                name="url"
              />
              
              {errors.url && (
                <Text className="text-red-500 text-sm mt-2">
                  {errors.url.message}
                </Text>
              )}

              <TouchableOpacity
                className={`mt-4 rounded-lg py-3 ${
                  loading ? 'bg-gray-400' : 'bg-blue-600'
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white text-center font-semibold text-base">
                    Summarize Video
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Summary Result */}
            {summary && (
              <View className="bg-white rounded-xl p-6 shadow-sm">
                <Text className="text-xl font-bold text-gray-900 mb-2">
                  {summary.title}
                </Text>
                <Text className="text-gray-600 mb-4">
                  {summary.channel}
                </Text>

                {/* One Line Summary */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-semibold mb-2">
                    Quick Summary
                  </Text>
                  <Text className="text-gray-800 leading-relaxed">
                    {summary.one_line}
                  </Text>
                </View>

                {/* Key Points */}
                <View className="mb-6">
                  <Text className="text-gray-700 font-semibold mb-2">
                    Key Points
                  </Text>
                  {summary.key_points.map((point, index) => (
                    <View key={index} className="flex-row mb-2">
                      <Text className="text-gray-500 mr-2">•</Text>
                      <Text className="text-gray-800 flex-1">
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Detailed Summary */}
                <View>
                  <Text className="text-gray-700 font-semibold mb-2">
                    Detailed Summary
                  </Text>
                  <Text className="text-gray-800 leading-relaxed">
                    {summary.detailed_summary}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default HomeScreen;
import axios from 'axios';
import { Summary, ApiResponse } from '../types';

const API_BASE_URL = 'http://10.0.2.2:8000'; // Android 에뮬레이터

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const summarizeVideo = async (url: string): Promise<ApiResponse<Summary>> => {
  try {
    const response = await api.post<Summary>('/api/summarize', { url });
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.detail || error.message || '요약 생성 중 오류가 발생했습니다.',
    };
  }
};

export const getSummaries = async (): Promise<ApiResponse<Summary[]>> => {
  try {
    const response = await api.get<Summary[]>('/api/summaries');
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.detail || error.message || '요약 목록을 가져오는 중 오류가 발생했습니다.',
    };
  }
};
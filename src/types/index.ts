export interface Summary {
  id?: string;
  url: string;
  title: string;
  channel: string;
  duration?: string;
  one_line: string;
  key_points: string[];
  detailed_summary: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SummarizeRequest {
  url: string;
}
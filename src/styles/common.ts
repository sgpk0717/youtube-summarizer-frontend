import { StyleSheet } from 'react-native';
import { Colors } from './colors';

// 공통으로 사용되는 스타일 정의
export const CommonStyles = StyleSheet.create({
  // 컨테이너 스타일
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  // 카드 스타일
  card: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 버튼 스타일
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  buttonPrimary: {
    backgroundColor: Colors.primary,
  },
  
  buttonSecondary: {
    backgroundColor: Colors.gray200,
  },
  
  buttonDisabled: {
    backgroundColor: Colors.gray400,
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textOnPrimary,
  },
  
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  // 텍스트 스타일
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  
  body: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  
  caption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  
  // 입력 필드 스타일
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  
  inputFocused: {
    borderColor: Colors.primary,
  },
  
  // 구분선 스타일
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  
  // 섹션 스타일
  section: {
    marginBottom: 20,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  
  // 그림자 스타일
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // 중앙 정렬
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // 행 정렬
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  // 간격
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
});
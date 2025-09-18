/**
 * 앱 테마 정의
 * 토스 스타일 미니멀 디자인
 */

export const theme = {
  colors: {
    // Primary 토스 기본 색상
    primary: {
      main: '#191F28',  // 토스 블랙
      light: '#333D4B',
      dark: '#0A0E15',
    },

    // Secondary 색상
    secondary: {
      blue: '#3182F6',  // 토스 블루
      green: '#00D084', // 토스 그린
      yellow: '#FFC043', // 토스 옜로우
      red: '#FF5B5B',
    },

    // 중립 색상 (토스 그레이 스케일)
    neutral: {
      white: '#FFFFFF',
      background: '#F7F8FA',
      surface: '#FFFFFF',
      gray100: '#F7F8FA',
      gray200: '#F2F4F6',
      gray300: '#E5E8EB',
      gray400: '#D1D6DB',
      gray500: '#8B95A1',
      gray600: '#6B7684',
      gray700: '#4E5968',
      gray800: '#333D4B',
      black: '#191F28',
    },

    // 상태 색상
    status: {
      success: '#00D084',
      warning: '#FFC043',
      error: '#FF5B5B',
      info: '#3182F6',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 999,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 5,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 3,
    },
  },

  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 40,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

export type Theme = typeof theme;
import { MultiAgentResponse } from '../types/multiagent';

export const getDummyMultiAgentResponse = (url: string): MultiAgentResponse => {
  return {
    video_id: 'dummy_video_123',
    url: url,
    title: '[테스트] React Native 완벽 가이드 - 2024년 최신 버전',
    channel_title: '개발자 채널',
    duration: '25:30',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    published_at: new Date().toISOString(),
    view_count: 15420,
    subtitle_available: true,
    multi_agent: true,
    agents: [
      {
        name: '요약 전문가',
        role: '핵심 내용을 간결하게 정리합니다',
        avatar: '📝',
        analysis: `## 주요 내용 요약

### 1. React Native 기초
- React Native는 JavaScript를 사용하여 네이티브 모바일 앱을 개발할 수 있는 프레임워크
- iOS와 Android 동시 개발 가능
- 실제 네이티브 컴포넌트를 사용하여 성능 최적화

### 2. 2024년 주요 업데이트
- 새로운 아키텍처 도입으로 성능 30% 향상
- Hermes 엔진 개선으로 앱 시작 시간 단축
- TypeScript 지원 강화

### 3. 개발 환경 설정
- Node.js 18 이상 권장
- Android Studio 및 Xcode 필수
- React DevTools 활용 팁`,
        confidence: 0.95,
        processing_time: 2.3
      },
      {
        name: '기술 분석가',
        role: '기술적인 세부사항을 분석합니다',
        avatar: '🔧',
        analysis: `## 기술 스택 분석

### 사용된 기술
1. **프론트엔드**
   - React Native 0.73.0
   - TypeScript 5.0
   - Redux Toolkit

2. **네이티브 모듈**
   - React Native Firebase
   - AsyncStorage
   - Linear Gradient

3. **개발 도구**
   - Metro Bundler
   - Flipper 디버깅
   - ESLint & Prettier

### 코드 품질
- 컴포넌트 재사용성: 높음
- 타입 안정성: TypeScript 100% 적용
- 성능 최적화: useMemo, useCallback 적극 활용`,
        confidence: 0.92,
        processing_time: 3.1
      },
      {
        name: '학습 도우미',
        role: '학습에 도움이 되는 포인트를 제시합니다',
        avatar: '🎓',
        analysis: `## 학습 포인트

### 초보자가 주목해야 할 부분
1. **State 관리의 이해**
   - useState vs useReducer 사용 시기
   - Context API 활용법
   - 전역 상태 관리의 필요성

2. **네비게이션 구조**
   - Stack Navigator 기본 개념
   - Tab Navigation 구현
   - Deep Linking 설정

3. **스타일링 베스트 프랙티스**
   - StyleSheet vs Styled Components
   - 반응형 디자인 구현
   - 플랫폼별 스타일 분기

### 실습 추천 사항
- Todo 앱부터 시작하기
- API 연동 실습
- 푸시 알림 구현해보기`,
        confidence: 0.88,
        processing_time: 2.8
      }
    ],
    conclusion: {
      summary: `이 영상은 React Native 개발을 시작하는 개발자들에게 매우 유용한 가이드입니다.
2024년 최신 업데이트 사항과 함께 실무에서 바로 적용 가능한 팁들을 제공하고 있습니다.`,
      key_points: [
        'React Native의 새로운 아키텍처 이해가 중요',
        'TypeScript 도입으로 코드 품질 향상 가능',
        'Metro 번들러 설정 최적화로 개발 속도 개선'
      ],
      recommended_next_topics: [
        'React Native 성능 최적화 기법',
        'Native Module 작성 방법',
        'CI/CD 파이프라인 구축'
      ],
      overall_quality_score: 0.92
    },
    processing_time: 8.2,
    created_at: new Date().toISOString(),
    status: 'completed',
    error: null
  };
};

export const getDummySummaryResponse = (url: string) => {
  return {
    video_id: 'dummy_video_456',
    url: url,
    title: '[테스트] 간단 요약 테스트 영상',
    channel_title: '테스트 채널',
    duration: '10:00',
    thumbnail_url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    published_at: new Date().toISOString(),
    view_count: 5000,
    summary: `이것은 테스트 요약입니다.

주요 내용:
1. 첫 번째 포인트
2. 두 번째 포인트
3. 세 번째 포인트

결론: 디버그 모드에서 생성된 더미 데이터입니다.`,
    created_at: new Date().toISOString()
  };
};
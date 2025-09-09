# 🚀 React Native 앱 제로에서 실행까지 완전 자동화 가이드

## 📋 당신이 Claude에게 내려야 할 명령 (복사해서 사용)

### 🎯 한 방에 끝내는 마법의 명령어

```
YouTube Summarizer React Native 앱을 새로 세팅하고 에뮬레이터에서 실행해줘.

다음 프로세스를 정확히 따라:
1. React Native 0.73.0으로 프로젝트 생성 (New Architecture 문제 회피 필수)
2. 필요한 패키지 설치 (axios, react-hook-form, @react-native-async-storage/async-storage)
3. SVG 관련 패키지는 절대 설치 금지
4. minSdkVersion 24, compileSdkVersion 34로 설정
5. newArchEnabled=false, hermesEnabled=true 설정
6. YouTube Summarizer UI 구현 (App.tsx, api.ts, types/index.ts)
7. API_BASE_URL은 http://10.0.2.2:8000 사용
8. 빌드하고 에뮬레이터에 설치
9. Metro 서버 시작
10. 앱 실행 확인 후 스크린샷

중요: 
- 에러 발생시 로깅 추가해서 원인 파악
- 앱이 정상 실행될 때까지 "오류 확인 → 수정 → 빌드 → 실행" 반복
- 흰 화면이나 크래시 발생시 Metro 재시작 후 앱 리로드
```

---

## 🔧 문제 해결 프로세스 (자동화된 디버깅)

### 에러별 대응 명령어

#### 1️⃣ SSL 인증서 오류 발생시
```
SSL 문제가 발생했어. Gradle 빌드 캐시를 클리어하고 다시 빌드해줘:
cd android && ./gradlew clean && cd .. && npx react-native run-android
```

#### 2️⃣ Metro 번들러 연결 안 될 때
```
Metro 서버가 연결 안 돼. 다음 순서로 해결해줘:
1. 기존 Metro 프로세스 종료 (lsof -ti:8081 | xargs kill -9)
2. Metro 캐시 클리어 (npx react-native start --reset-cache &)
3. 앱 재시작 (adb shell am force-stop com.frontend && adb shell am start -n com.frontend/.MainActivity)
4. 스크린샷 찍어서 확인
```

#### 3️⃣ New Architecture 관련 크래시
```
New Architecture 문제로 크래시가 발생해. 다음 설정 확인하고 수정:
1. gradle.properties에서 newArchEnabled=false 확인
2. MainActivity.java에서 fabricEnabled를 false로 설정
3. 클린 빌드 실행 (cd android && ./gradlew clean && ./gradlew assembleDebug)
```

#### 4️⃣ 앱이 흰 화면만 보일 때
```
앱이 흰 화면이야. JavaScript 번들 로딩 문제 해결:
1. Metro 서버 상태 확인
2. 앱에서 Reload 실행 (adb shell input keyevent 82 후 R 키)
3. 안 되면 앱 완전 재시작
```

---

## 📱 단계별 상세 프로세스

### Step 1: 프로젝트 초기화
```bash
# React Native 0.73.0으로 프로젝트 생성
npx react-native@0.73.0 init frontend --version 0.73.0

# 프로젝트 디렉토리 이동
cd frontend
```

### Step 2: 필수 패키지 설치
```bash
# 핵심 패키지만 설치 (SVG 관련 제외)
npm install axios@^1.11.0 \
  react-hook-form@^7.62.0 \
  @react-native-async-storage/async-storage@^2.2.0
```

### Step 3: Android 설정 수정
```gradle
// android/build.gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 24  // 중요!
        compileSdkVersion = 34
        targetSdkVersion = 34
    }
}

// android/gradle.properties
newArchEnabled=false  // 필수!
hermesEnabled=true
```

### Step 4: 소스 코드 구현
```
src/
├── screens/
│   └── HomeScreen.tsx  # UI 컴포넌트
├── services/
│   └── api.ts          # API 통신 (10.0.2.2:8000)
└── types/
    └── index.ts        # TypeScript 타입
```

### Step 5: 빌드 및 실행
```bash
# Metro 서버 시작 (백그라운드)
npx react-native start &

# Android 앱 빌드 및 설치
npx react-native run-android

# 또는 수동 빌드
cd android && ./gradlew assembleDebug
adb install app/build/outputs/apk/debug/app-debug.apk
```

### Step 6: 실행 확인
```bash
# 앱 실행 상태 확인
adb shell dumpsys activity activities | grep com.frontend

# 스크린샷 캡처
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshot.png
```

---

## 🔍 디버깅 체크리스트

### ✅ 필수 확인 사항
- [ ] Node.js 18 이상 설치됨
- [ ] Android Emulator 실행 중 (Pixel 3a API 34)
- [ ] React Native 0.73.0 사용
- [ ] minSdkVersion 24 설정
- [ ] newArchEnabled=false 설정
- [ ] Metro 서버 포트 8081에서 실행 중
- [ ] API URL이 10.0.2.2:8000으로 설정

### 🚫 절대 하지 말 것
- ❌ React Native 0.81.x로 업그레이드
- ❌ react-native-svg 설치
- ❌ lucide-react-native 설치
- ❌ newArchEnabled=true 설정
- ❌ ndkVersion 설정

---

## 💡 프로 팁

### 빠른 재시작 명령어 조합
```bash
# 앱 완전 재시작 (Metro + App)
pkill -f "react-native" && \
npx react-native start --reset-cache & \
sleep 3 && \
adb shell am force-stop com.frontend && \
adb shell am start -n com.frontend/.MainActivity
```

### 로그 모니터링
```bash
# React Native 로그만 보기
adb logcat -s ReactNativeJS:V

# 크래시 로그 보기
adb logcat -s AndroidRuntime:E
```

### 빌드 캐시 완전 클리어
```bash
cd android && \
./gradlew clean && \
./gradlew cleanBuildCache && \
cd .. && \
npx react-native start --reset-cache
```

---

## 📊 예상 소요 시간

| 단계 | 예상 시간 | 비고 |
|------|----------|------|
| 프로젝트 생성 | 2-3분 | |
| 패키지 설치 | 1-2분 | |
| 설정 수정 | 2-3분 | |
| 소스 코드 구현 | 5-10분 | |
| 첫 빌드 | 3-5분 | Gradle 다운로드 포함 |
| 디버깅 | 5-30분 | 문제 발생 시 |
| **총 소요 시간** | **20-50분** | |

---

## 🎉 성공 기준

앱이 성공적으로 실행되면:
1. "YouTube 요약기" 제목이 보임
2. URL 입력 필드가 표시됨
3. 파란색 "요약하기" 버튼이 있음
4. 흰 화면이나 에러 없음
5. Metro 서버와 정상 연결됨

---

## 📝 마지막 체크포인트

```
앱 실행 완료 확인:
1. 스크린샷 찍어서 UI 확인
2. 에러 로그 없는지 확인 (adb logcat | grep -E "ERROR|FATAL")
3. Metro 서버 연결 상태 확인
4. 앱이 com.frontend/.MainActivity로 실행 중인지 확인

모든 체크 완료되면 "YouTube Summarizer 앱 실행 성공!" 메시지 출력
```

---

이 가이드를 Claude에게 주면 자동으로 앱을 세팅하고 실행할 수 있습니다.
문제 발생 시 에러별 대응 명령어를 사용하세요.
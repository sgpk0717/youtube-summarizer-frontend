# React Native 에뮬레이터 실행 가이드

## 1. Android 에뮬레이터 실행 방법

### 방법 1: Android Studio에서 실행
1. Android Studio 실행
2. AVD Manager 열기 (Tools → AVD Manager)
3. 생성된 에뮬레이터 선택 후 ▶️ 버튼 클릭

### 방법 2: 터미널에서 실행
```bash
# 사용 가능한 에뮬레이터 목록 확인
emulator -list-avds

# 특정 에뮬레이터 실행
emulator -avd Pixel_3a_API_34_extension_level_7_arm64-v8a

# 또는 emulator 명령어를 PATH에 추가 후
export PATH=$PATH:$ANDROID_HOME/emulator
emulator @Pixel_3a_API_34_extension_level_7_arm64-v8a
```

## 2. 앱 설치 및 실행

### 개발 모드 실행 (권장)
```bash
# frontend 폴더에서 실행
cd /Users/seonggukpark/youtube-summarizer/frontend

# Metro 서버 시작 (터미널 1)
npm start

# 앱 실행 (터미널 2)
npx react-native run-android
```

### 수동 APK 설치
```bash
# Debug APK 설치
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Release APK 설치
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 3. 빌드 명령어

### Debug 빌드
```bash
cd android
./gradlew assembleDebug
# APK 위치: android/app/build/outputs/apk/debug/app-debug.apk
```

### Release 빌드
```bash
cd android
./gradlew assembleRelease
# APK 위치: android/app/build/outputs/apk/release/app-release.apk
```

### 클린 빌드
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## 4. 에뮬레이터 관련 유용한 명령어

### ADB 명령어
```bash
# 연결된 디바이스 확인
adb devices

# 앱 제거
adb uninstall com.frontend

# 로그 확인
adb logcat *:S ReactNative:V ReactNativeJS:V

# 스크린샷 캡처
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png ./screenshot.png

# 텍스트 입력
adb shell input text "텍스트입력"

# 화면 탭
adb shell input tap x좌표 y좌표

# 앱 재시작
adb shell am start -n com.frontend/.MainActivity
```

### Metro 관련
```bash
# Metro 캐시 초기화
npx react-native start --reset-cache

# 특정 포트로 Metro 실행
npx react-native start --port 8082
```

## 5. 트러블슈팅

### 에뮬레이터가 느릴 때
- Android Studio → AVD Manager → Edit → Graphics: Hardware - GLES 2.0
- RAM 할당량 증가 (최소 2GB 권장)
- Cold Boot 실행

### Metro 연결 안될 때
```bash
# 포트 포워딩 재설정
adb reverse tcp:8081 tcp:8081

# Metro 서버 재시작
npx react-native start --reset-cache
```

### 앱이 크래시할 때
```bash
# 로그 확인
adb logcat | grep -E "ReactNative|AndroidRuntime"

# 앱 데이터 초기화
adb shell pm clear com.frontend
```

### 빌드 오류 시
```bash
cd android
./gradlew clean
cd ..
rm -rf node_modules
npm install
cd android
./gradlew assembleDebug
```

## 6. 개발 워크플로우

1. **에뮬레이터 실행**
   - Android Studio 또는 터미널에서 에뮬레이터 시작

2. **Metro 서버 시작**
   ```bash
   npm start
   ```

3. **앱 실행**
   ```bash
   npx react-native run-android
   ```

4. **개발**
   - 코드 수정 시 자동 리로드 (Fast Refresh)
   - Cmd+M (Mac) 또는 Ctrl+M (Windows/Linux)로 개발 메뉴 열기

5. **디버깅**
   - Chrome DevTools 사용 (개발 메뉴 → Debug)
   - React Native Debugger 사용

## 7. 성능 최적화 팁

- **Release 모드로 테스트**: 성능 측정 시 Release APK 사용
- **ProGuard 활성화**: Release 빌드 시 코드 난독화 및 최적화
- **이미지 최적화**: 적절한 해상도의 이미지 사용
- **메모리 관리**: 불필요한 리렌더링 방지

## 8. 네트워크 설정

### 로컬 백엔드 연결
```javascript
// 에뮬레이터에서 로컬호스트 접근
const API_URL = Platform.select({
  android: 'http://10.0.2.2:8000',  // Android 에뮬레이터
  ios: 'http://localhost:8000',      // iOS 시뮬레이터
});
```

### Tailscale VPN 연결
```javascript
// Tailscale IP 사용
const API_URL = 'http://100.118.223.116:8000';
```

## 9. 자주 사용하는 스크립트

package.json에 추가하면 편리한 스크립트:
```json
{
  "scripts": {
    "android": "react-native run-android",
    "android:clean": "cd android && ./gradlew clean && cd ..",
    "android:build": "cd android && ./gradlew assembleDebug && cd ..",
    "android:release": "cd android && ./gradlew assembleRelease && cd ..",
    "android:install": "adb install android/app/build/outputs/apk/debug/app-debug.apk",
    "android:log": "adb logcat *:S ReactNative:V ReactNativeJS:V",
    "metro": "react-native start",
    "metro:clean": "react-native start --reset-cache"
  }
}
```

## 10. 체크리스트

앱 실행 전 확인사항:
- [ ] Android Studio 설치 완료
- [ ] Android SDK 설치 완료 (API Level 34)
- [ ] 에뮬레이터 생성 완료
- [ ] ANDROID_HOME 환경변수 설정
- [ ] node_modules 설치 완료 (`npm install`)
- [ ] Metro 서버 실행 중
- [ ] 에뮬레이터 실행 중
- [ ] adb devices로 에뮬레이터 인식 확인
# 🔥 React Native 트러블슈팅 & 교훈 (하루종일 싸운 기록)

## 😤 겪었던 주요 문제들과 해결 과정

### 1. React Native New Architecture 지옥 (5시간 소요)

#### 문제 상황
```
Fatal Exception: java.lang.UnsatisfiedLinkError: 
couldn't find DSO to load: libreact_featureflagsjni.so
```

#### 시도한 방법들 (실패)
- ❌ React Native 0.81.1 사용 → New Architecture 강제 활성화로 크래시
- ❌ Hermes 비활성화 → 여전히 크래시
- ❌ MainActivity 수정 → ReactActivityDelegate 문제 지속
- ❌ MainApplication 수정 → SoLoader 초기화 문제

#### 최종 해결책 ✅
```bash
# React Native 0.73.0으로 다운그레이드
npx react-native@0.73.0 init frontend --version 0.73.0

# gradle.properties
newArchEnabled=false  # 절대 true로 바꾸지 말 것!
```

**교훈**: 최신 버전이 항상 좋은 건 아니다. 안정성이 먼저다.

---

### 2. minSdkVersion 충돌 (30분 소요)

#### 에러 메시지
```
Manifest merger failed : uses-sdk:minSdkVersion 22 cannot be smaller than 
version 24 declared in library [:react-native-async-storage_async-storage]
```

#### 해결 방법
```gradle
// android/build.gradle
ext {
    minSdkVersion = 24  // 22에서 24로 변경
}
```

**교훈**: 패키지 설치 후 항상 minSdkVersion 요구사항 확인

---

### 3. react-native-svg 호환성 문제 (2시간 소요)

#### 문제 상황
- lucide-react-native 설치 → react-native-svg 자동 설치
- React Native 0.73.0과 호환되지 않음
- 27개의 컴파일 에러 발생

#### 해결 방법
```bash
# SVG 관련 패키지 모두 제거
npm uninstall lucide-react-native react-native-svg

# 아이콘 없이 텍스트로 대체
```

**교훈**: UI 라이브러리 선택 시 React Native 버전 호환성 필수 체크

---

### 4. Metro 번들러 연결 실패 (1시간 소요)

#### 증상
- 빨간 화면: "Unable to load script. Make sure you're either running Metro..."
- 앱은 실행되지만 JavaScript 로드 실패

#### 해결 과정
```bash
# 1. Metro 서버 시작
npx react-native start

# 2. 앱에서 Reload (R 키 두 번)
adb shell input keyevent 82  # 개발 메뉴 열기
adb shell input tap 570 1452  # Reload 버튼 탭

# 3. 안 되면 앱 재시작
adb shell am force-stop com.frontend
adb shell am start -n com.frontend/.MainActivity
```

**교훈**: Metro 서버는 앱 실행 전에 먼저 시작해야 함

---

### 5. 흰 화면만 나오는 문제 (30분 소요)

#### 원인
- JavaScript 번들 로딩 실패
- Metro 서버와 연결 안 됨

#### 디버깅 방법
```bash
# 앱 상태 확인
adb shell dumpsys activity activities | grep com.frontend

# 로그 확인
adb logcat -s ReactNativeJS:V

# 스크린샷으로 확인
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png
```

**교훈**: 스크린샷이 가장 확실한 디버깅 도구

---

## 🎯 핵심 교훈 TOP 10

1. **버전이 전부다**: React Native 0.73.0이 0.81.1보다 안정적
2. **New Architecture는 함정**: 아직 프로덕션에서 쓰기엔 이르다
3. **에러 메시지를 믿지 마라**: 진짜 원인은 다른 곳에 있을 수 있음
4. **점진적 접근**: 한 번에 모든 기능 구현 X, 기본부터 시작
5. **패키지 최소화**: 꼭 필요한 것만 설치
6. **로그가 답이다**: console.log 아니고 adb logcat
7. **캐시 클리어는 만능**: --reset-cache는 친구
8. **스크린샷 필수**: "안 돼요"보다 스크린샷 한 장
9. **백업 필수**: 잘 되는 버전은 즉시 커밋
10. **포기하지 마라**: 5시간 걸려도 결국 해결됨

---

## 🛠️ 필수 디버깅 명령어 모음

### 기본 체크
```bash
# 에뮬레이터 확인
adb devices

# 앱 설치 확인
adb shell pm list packages | grep frontend

# 앱 실행 상태
adb shell dumpsys activity activities | grep frontend
```

### 로그 확인
```bash
# 전체 로그
adb logcat

# React Native만
adb logcat -s ReactNativeJS:V

# 에러만
adb logcat *:E

# 크래시 로그
adb logcat -s AndroidRuntime:E
```

### 앱 제어
```bash
# 앱 종료
adb shell am force-stop com.frontend

# 앱 시작
adb shell am start -n com.frontend/.MainActivity

# 앱 삭제
adb uninstall com.frontend

# 앱 재설치
adb install app-debug.apk
```

### Metro 관련
```bash
# Metro 포트 확인
lsof -i:8081

# Metro 프로세스 종료
lsof -ti:8081 | xargs kill -9

# Metro 시작 (캐시 클리어)
npx react-native start --reset-cache
```

---

## 💊 빠른 해결책 (Quick Fixes)

| 문제 | 해결 명령어 |
|------|-----------|
| Metro 연결 안 됨 | `npx react-native start --reset-cache` |
| 빌드 실패 | `cd android && ./gradlew clean` |
| 앱 크래시 | `adb logcat -s AndroidRuntime:E` 확인 |
| 흰 화면 | Metro 재시작 + 앱 Reload |
| 느린 빌드 | `cd android && ./gradlew --stop` |
| 패키지 충돌 | `npm ci` (package-lock.json 기준 재설치) |

---

## 🚨 절대 하지 말아야 할 것들

1. **React Native 업그레이드 유혹**
   ```bash
   # 절대 금지!
   npm update react-native
   ```

2. **New Architecture 활성화**
   ```properties
   # 절대 true로 바꾸지 마세요
   newArchEnabled=false
   ```

3. **검증 안 된 패키지 설치**
   ```bash
   # 호환성 확인 없이 설치 금지
   npm install cool-new-package
   ```

4. **ndkVersion 설정**
   ```gradle
   // 설정하지 마세요 (불필요한 경고 발생)
   // ndkVersion = "25.1.8937393"
   ```

---

## 📚 참고 자료

- [React Native 0.73.0 문서](https://reactnative.dev/docs/0.73/getting-started)
- [Android Emulator 네트워킹](https://developer.android.com/studio/run/emulator-networking)
- [Metro 번들러 설정](https://facebook.github.io/metro/docs/configuration)

---

## 🎬 마무리

**총 소요 시간**: 약 8시간  
**커피 소비량**: 5잔  
**욕 횟수**: 셀 수 없음  
**배운 것**: React Native는 여전히 험난하다  

하지만 이제 이 문서만 있으면 30분 만에 셋업 가능! 🎉

---

마지막 조언: **"작동하는 코드를 건드리지 마라"**
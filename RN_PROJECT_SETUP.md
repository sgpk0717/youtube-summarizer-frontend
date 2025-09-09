# React Native 프로젝트 설정 완전 가이드

## 📌 중요: 이 설정으로 안정적인 React Native 0.73.0 앱 실행 보장

### 🎯 핵심 버전 정보 (절대 변경 금지)
- **React Native**: 0.73.0 (New Architecture 문제 회피를 위한 안정 버전)
- **React**: 18.2.0
- **Node.js**: >=18
- **TypeScript**: 5.0.4

---

## 1. package.json (완전한 버전)

```json
{
  "name": "frontend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "android": "react-native run-android",
    "ios": "react-native run-ios",
    "lint": "eslint .",
    "start": "react-native start",
    "test": "jest"
  },
  "dependencies": {
    "@react-native-async-storage/async-storage": "^2.2.0",
    "axios": "^1.11.0",
    "react": "18.2.0",
    "react-hook-form": "^7.62.0",
    "react-native": "0.73.0"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@babel/preset-env": "^7.20.0",
    "@babel/runtime": "^7.20.0",
    "@react-native/babel-preset": "^0.73.18",
    "@react-native/eslint-config": "^0.73.1",
    "@react-native/metro-config": "^0.73.2",
    "@react-native/typescript-config": "^0.73.1",
    "@types/react": "^18.2.6",
    "@types/react-test-renderer": "^18.0.0",
    "babel-jest": "^29.6.3",
    "eslint": "^8.19.0",
    "jest": "^29.6.3",
    "prettier": "2.8.8",
    "react-test-renderer": "18.2.0",
    "typescript": "5.0.4"
  },
  "engines": {
    "node": ">=18"
  }
}
```

### ⚠️ 주의사항
- `react-native-svg`, `lucide-react-native` 등 SVG 관련 패키지는 설치하지 마세요 (0.73.0과 호환성 문제)
- `react-navigation`, `react-native-screens` 등도 필요시 버전 호환성 체크 필수

---

## 2. Android 설정 파일들

### 2.1 android/gradle.properties (필수 설정)

```properties
# 메모리 설정 (빌드 속도 향상)
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m

# AndroidX 사용 (필수)
android.useAndroidX=true
android.enableJetifier=true

# 아키텍처 설정
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# New Architecture 비활성화 (중요!)
newArchEnabled=false

# Hermes 엔진 사용
hermesEnabled=true
```

### 2.2 android/build.gradle

```gradle
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 24  // 중요: 24 이상 필수
        compileSdkVersion = 34
        targetSdkVersion = 34
        kotlinVersion = "1.8.0"
        // ndkVersion 제거 (설정하지 마세요)
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

apply plugin: "com.facebook.react.rootproject"
```

### 2.3 android/app/build.gradle (주요 부분)

```gradle
apply plugin: "com.android.application"
apply plugin: "org.jetbrains.kotlin.android"
apply plugin: "com.facebook.react"

android {
    namespace "com.frontend"
    compileSdkVersion rootProject.ext.compileSdkVersion
    
    defaultConfig {
        applicationId "com.frontend"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
    }
    
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}

dependencies {
    implementation("com.facebook.react:react-android")
    
    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}
```

---

## 3. TypeScript 설정

### tsconfig.json

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json"
}
```

---

## 4. Metro 설정

### metro.config.js

```javascript
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

---

## 5. 프로젝트 구조

```
frontend/
├── android/                 # Android 네이티브 코드
├── ios/                     # iOS 네이티브 코드 (사용 안 함)
├── node_modules/            # 의존성 패키지
├── src/                     # 소스 코드
│   ├── screens/            # 화면 컴포넌트
│   │   └── HomeScreen.tsx
│   ├── services/           # API 서비스
│   │   └── api.ts
│   └── types/              # TypeScript 타입 정의
│       └── index.ts
├── App.tsx                  # 메인 앱 컴포넌트
├── index.js                 # 엔트리 포인트
├── package.json            # 프로젝트 설정
├── tsconfig.json           # TypeScript 설정
└── metro.config.js         # Metro 번들러 설정
```

---

## 6. 중요한 Java 파일 설정

### MainActivity.java (간소화 버전 - 중요!)

```java
package com.frontend;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;

public class MainActivity extends ReactActivity {
    @Override
    protected String getMainComponentName() {
        return "frontend";
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new DefaultReactActivityDelegate(
            this,
            getMainComponentName(),
            false  // fabricEnabled = false (중요!)
        );
    }
}
```

### MainApplication.java (핵심 설정)

```java
package com.frontend;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost =
        new DefaultReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }

            @Override
            protected boolean isNewArchEnabled() {
                return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
            }

            @Override
            protected Boolean isHermesEnabled() {
                return BuildConfig.IS_HERMES_ENABLED;
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
        
        if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
            DefaultNewArchitectureEntryPoint.load();
        }
    }
}
```

---

## 7. 환경 요구사항

### 필수 설치 항목
- Node.js 18 이상
- Java 17 (Android Studio 포함)
- Android SDK 34
- Android Build Tools 34.0.0
- Android Emulator (Pixel 3a API 34 권장)

### 환경변수 설정 (macOS 기준)
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

---

## 8. 핵심 해결 포인트 정리

### ✅ 해결된 주요 문제들
1. **React Native New Architecture 호환성 문제**
   - 해결: React Native 0.73.0 사용 + newArchEnabled=false

2. **minSdkVersion 충돌**
   - 해결: minSdkVersion을 24로 설정

3. **react-native-svg 호환성 문제**
   - 해결: SVG 관련 패키지 제거

4. **Metro 번들러 연결 문제**
   - 해결: Metro 서버 실행 후 앱 리로드

### ⚠️ 절대 하지 말아야 할 것들
- React Native 0.81.x로 업그레이드 (New Architecture 문제 발생)
- ndkVersion 설정 (불필요한 경고 발생)
- react-native-svg 설치 (0.73.0과 호환성 문제)
- newArchEnabled=true 설정 (크래시 발생)

---

## 9. API 연결 설정

### Android 에뮬레이터에서 로컬 서버 접속
```javascript
const API_BASE_URL = 'http://10.0.2.2:8000'; // localhost 대신 10.0.2.2 사용
```

---

이 문서의 설정을 정확히 따르면 React Native 앱이 안정적으로 실행됩니다.
문제 발생 시 이 문서의 버전과 설정을 다시 확인하세요.
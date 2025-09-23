@echo off
set JAVA_HOME=C:\AndroidDev\jdk-17.0.13+11
set ANDROID_HOME=C:\AndroidDev\Android
set PATH=%JAVA_HOME%\bin;%ANDROID_HOME%\cmdline-tools\latest\bin;%ANDROID_HOME%\platform-tools;%PATH%

echo Building React Native Android app...
cd /d C:\youtube-summarizer\youtube-summarizer-frontend

echo Running React Native build...
call npx react-native build-android --mode=release

echo Build complete!
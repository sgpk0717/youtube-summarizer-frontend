package com.frontend

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.load
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.facebook.react.defaults.DefaultReactNativeHost
import com.facebook.react.flipper.ReactNativeFlipper
import com.facebook.soloader.SoLoader

class MainApplication : Application(), ReactApplication {

  override val reactNativeHost: ReactNativeHost =
      object : DefaultReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return PackageList(this).packages
        }

        override fun getJSMainModuleName(): String = "index"

        override fun getUseDeveloperSupport(): Boolean = BuildConfig.DEBUG

        override val isNewArchEnabled: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
        override val isHermesEnabled: Boolean = BuildConfig.IS_HERMES_ENABLED
      }

  override val reactHost: ReactHost
    get() = getDefaultReactHost(this.applicationContext, reactNativeHost)

  override fun onCreate() {
    super.onCreate()
    SoLoader.init(this, false)

    // Create notification channel for FCM
    createNotificationChannel()

    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      load()
    }
    ReactNativeFlipper.initializeFlipper(this, reactNativeHost.reactInstanceManager)
  }

  private fun createNotificationChannel() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val channelId = "default_notification_channel"
      val channelName = "YouTube Summarizer \uc54c\ub9bc"
      val channelDescription = "\uc720\ud29c\ube0c \uc694\uc57d \ubd84\uc11d \uc644\ub8cc \uc54c\ub9bc"
      val importance = NotificationManager.IMPORTANCE_HIGH

      val channel = NotificationChannel(channelId, channelName, importance).apply {
        description = channelDescription
        enableLights(true)
        enableVibration(true)
      }

      val notificationManager = getSystemService(NotificationManager::class.java)
      notificationManager?.createNotificationChannel(channel)
    }
  }
}

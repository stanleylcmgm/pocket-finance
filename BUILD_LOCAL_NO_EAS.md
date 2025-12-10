# Building Android Locally Without EAS (No Quota Limits!)

This guide shows you how to build your Android app **completely locally** without using EAS Build, so you don't consume your free account quota.

## ✅ Prerequisites

1. **Android Studio** installed (or at least Android SDK)
2. **ANDROID_HOME** environment variable set
3. **Java JDK 17 or 11** installed (⚠️ **Important:** Java 17 LTS recommended, Java 25+ is too new and won't work)
   - Android Studio usually includes Java 17
   - Or download from: https://adoptium.net/ (Temurin JDK 17 LTS)

## 🚀 Quick Start

### Option 1: Build Debug APK (Fastest - For Testing)

```bash
# Build debug APK (uses debug keystore, no signing needed)
npm run build:android:debug
```

**Windows Note:** The npm scripts use `gradlew.bat` automatically. If running manually, use:
```powershell
cd android
.\gradlew.bat assembleDebug
```

**Output:** `android/app/build/outputs/apk/debug/app-debug.apk`

**Install on device:**

**Option 1: Via ADB (USB connection)**
```powershell
# First, set ANDROID_HOME if not already set
$env:ANDROID_HOME = "C:\Users\Stanley Lam\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"

# Check if device is connected
adb devices

# Install APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or use the npm script (after setting ANDROID_HOME)
npm run install:android
```

**Option 2: Manual Install (No USB needed)**
1. Copy `android/app/build/outputs/apk/debug/app-debug.apk` to your phone (via email, cloud storage, USB file transfer, etc.)
2. On your Android phone:
   - Go to **Settings → Security**
   - Enable **"Install unknown apps"** or **"Install from unknown sources"** for your file manager/browser
3. Tap the APK file on your phone to install it

### Option 2: Build Release APK (For Distribution)

```bash
# Build release APK (requires signing keystore)
npm run build:android:release
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

**⚠️ Note:** Currently uses debug keystore. For production, you need a proper release keystore (see below).

### Option 3: Build Release AAB (For Play Store)

```bash
# Build Android App Bundle (required for Play Store)
npm run build:android:bundle
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

**This is what you upload to Google Play Console!**

---

## 📋 Detailed Steps

### Step 1: Verify Android SDK Setup

Check if Android SDK is configured:

```powershell
# Check ANDROID_HOME
echo $env:ANDROID_HOME

# Check adb
adb version

# Check Java
java -version
```

If not set up, see `BUILD_INSTRUCTIONS.md` for setup steps.

### Step 2: Prebuild Native Code (If Needed)

If you've made changes to `app.json` or added new native modules:

```bash
npx expo prebuild --clean
```

**Note:** This is usually only needed when:
- Adding new Expo plugins
- Changing app configuration
- First time setting up

### Step 3: Build the APK/AAB

Choose the build type you need:

#### Debug Build (Testing)
```bash
npm run build:android:debug
```

#### Release APK (Direct Install)
```bash
npm run build:android:release
```

#### Release AAB (Play Store)
```bash
npm run build:android:bundle
```

### Step 4: Find Your Build

- **Debug APK:** `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK:** `android/app/build/outputs/apk/release/app-release.apk`
- **Release AAB:** `android/app/build/outputs/bundle/release/app-release.aab`

---

## 🔐 Setting Up Release Signing (For Production)

Currently, your release builds use the debug keystore. For Play Store, you need a proper release keystore.

### Create Release Keystore

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias release -keyalg RSA -keysize 2048 -validity 10000
```

**Important:** Save the password and alias - you'll need them!

### Configure Signing in build.gradle

Update `android/app/build.gradle`:

```gradle
signingConfigs {
    debug {
        storeFile file('debug.keystore')
        storePassword 'android'
        keyAlias 'androiddebugkey'
        keyPassword 'android'
    }
    release {
        storeFile file('release.keystore')
        storePassword System.getenv("KEYSTORE_PASSWORD") ?: "your-password"
        keyAlias System.getenv("KEYSTORE_ALIAS") ?: "release"
        keyPassword System.getenv("KEYSTORE_KEY_PASSWORD") ?: "your-password"
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        // ... rest of config
    }
}
```

**Better:** Use environment variables or `gradle.properties` (don't commit passwords to git!)

### Using gradle.properties (Recommended)

Create/update `android/gradle.properties`:

```properties
KEYSTORE_PASSWORD=your-password-here
KEYSTORE_ALIAS=release
KEYSTORE_KEY_PASSWORD=your-password-here
```

Then update `build.gradle`:

```gradle
release {
    storeFile file('release.keystore')
    storePassword findProperty('KEYSTORE_PASSWORD')
    keyAlias findProperty('KEYSTORE_ALIAS')
    keyPassword findProperty('KEYSTORE_KEY_PASSWORD')
}
```

**⚠️ Security:** Add `gradle.properties` to `.gitignore` if it contains passwords!

---

## 🧹 Clean Build

If you encounter build issues:

```bash
npm run build:android:clean
npm run build:android:debug
```

---

## 📱 Installing on Device

### Method 1: Via ADB (USB)

1. Connect device via USB
2. Enable USB Debugging on device
3. Run:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Method 2: Manual Install

1. Copy APK to your phone (via USB, email, cloud, etc.)
2. Enable "Install from Unknown Sources":
   - Settings → Security → Enable "Install unknown apps" for your file manager/browser
3. Tap the APK file to install

---

## 🆚 Comparison: Local Build vs EAS Build

| Feature | Local Build | EAS Build |
|---------|-------------|-----------|
| **Quota Limits** | ✅ None | ❌ Free tier limited |
| **Build Speed** | ⚡ Fast (5-10 min) | 🐌 Slower (15-30 min) |
| **Setup Required** | ⚠️ Android SDK needed | ✅ None |
| **Internet Required** | ❌ No | ✅ Yes |
| **Cost** | ✅ Free | ⚠️ Free tier limited |
| **Signing** | ✅ Full control | ✅ Automatic |

---

## 🎯 Recommended Workflow

### For Development/Testing:
```bash
npm run build:android:debug
# Install and test on device
```

### For Play Store Submission:
```bash
npm run build:android:bundle
# Upload app-release.aab to Play Console
```

---

## 🐛 Troubleshooting

### "JAVA_HOME is not set" or "java command not found"

**Problem:** You set JAVA_HOME in Environment Variables, but the terminal doesn't see it.

**Solution 1: Restart Terminal/IDE (Recommended)**
- Close and reopen your terminal/PowerShell
- Close and reopen VS Code/Cursor
- This picks up new environment variables

**Solution 2: Set in Current Session (Temporary)**
```powershell
# Set JAVA_HOME for current session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"  # Adjust path to your Java installation
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verify
java -version
```

**Solution 3: Verify Java Installation**
```powershell
# Check if Java is installed
Get-ChildItem "C:\Program Files\Java\"

# Common locations:
# - C:\Program Files\Java\jdk-17
# - C:\Program Files\Android\Android Studio\jbr (comes with Android Studio)
```

### "Unsupported class file major version 69" or Java version error

**Problem:** Java version is too new (Java 25+) or too old.

**Solution:** Use Java 17 LTS (recommended) or Java 11
- Download Java 17 from: https://adoptium.net/
- Install and set JAVA_HOME to the Java 17 installation
- Restart terminal after installation

**Check your Java version:**
```powershell
java -version
# Should show: java version "17.x.x" or "11.x.x"
```

**Android Studio includes Java 17:**
- Location: `C:\Program Files\Android\Android Studio\jbr`
- Set JAVA_HOME to this path if you have Android Studio installed

### "gradlew: command not found"
- On Windows, use `.\gradlew.bat` (the npm scripts handle this automatically)
- Make sure you're in the `android` directory
- Try: `cd android && .\gradlew.bat --version` to verify Gradle works

### "ANDROID_HOME not set"
- Set environment variable (see `BUILD_INSTRUCTIONS.md`)
- **Important:** Restart terminal/IDE after setting environment variables
- Or set in current session: `$env:ANDROID_HOME = "C:\Users\YourName\AppData\Local\Android\Sdk"`

### "adb: command not found"

**Problem:** ADB (Android Debug Bridge) is not in your PATH.

**Solution 1: Set in Current Session**
```powershell
$env:ANDROID_HOME = "C:\Users\Stanley Lam\AppData\Local\Android\Sdk"
$env:PATH = "$env:ANDROID_HOME\platform-tools;$env:PATH"

# Verify
adb version
```

**Solution 2: Use Full Path**
```powershell
& "C:\Users\Stanley Lam\AppData\Local\Android\Sdk\platform-tools\adb.exe" devices
& "C:\Users\Stanley Lam\AppData\Local\Android\Sdk\platform-tools\adb.exe" install android/app/build/outputs/apk/debug/app-debug.apk
```

**Solution 3: Add to PATH Permanently**
- Add `C:\Users\Stanley Lam\AppData\Local\Android\Sdk\platform-tools` to your Windows PATH environment variable
- Restart terminal after adding

### Build fails with "SDK not found"
- Open Android Studio
- Go to Tools → SDK Manager
- Install required SDK platforms and build tools

### "Keystore file not found"
- Make sure keystore file is in `android/app/` directory
- Check file path in `build.gradle`

### Build is slow
- First build is always slow (downloads dependencies)
- Subsequent builds are faster
- Use `--no-daemon` flag if having issues: `gradlew --no-daemon assembleDebug`

### C++ Build Errors (NDK Version Conflict)

**Problem:** NDK 27 has compatibility issues with several native libraries that don't explicitly link the C++ standard library:
- **React Native 0.81.4 requires NDK 27** for C++20 support (`std::format`)
- **Several libraries have linking errors with NDK 27** (undefined symbols for operator new/delete, std::string, etc.)
- Affected libraries: `react-native-worklets`, `react-native-nitro-modules`, `react-native-screens`, `expo-modules-core`

**Error with NDK 27:**
```
ld.lld: error: undefined symbol: operator delete(void*)
ld.lld: error: undefined symbol: operator new(unsigned long)
ld.lld: error: undefined symbol: std::__ndk1::basic_string<char, ...>::~basic_string()
```

**Error with NDK 26:**
```
error: no member named 'format' in namespace 'std'
return std::format("{}%", dimension.value);
```

**Workaround: Add C++ Standard Library Linking**

The fix is to explicitly link the C++ standard library in each affected library's `CMakeLists.txt` file. Add `c++` and `c++abi` to the `target_link_libraries()` call:

**For `react-native-worklets`:**
Edit `node_modules/react-native-worklets/android/CMakeLists.txt`:
```cmake
target_link_libraries(worklets log ReactAndroid::reactnative ReactAndroid::jsi
                      fbjni::fbjni c++ c++abi)
```

**For `react-native-nitro-modules`:**
Edit `node_modules/react-native-nitro-modules/android/CMakeLists.txt`:
```cmake
target_link_libraries(
        NitroModules
        ${LOG_LIB}
        android
        fbjni::fbjni
        ReactAndroid::jsi
        c++      # <-- Add this
        c++abi   # <-- Add this
)
```

**For `react-native-screens`:**
Edit `node_modules/react-native-screens/android/src/main/jni/CMakeLists.txt`:
Add `c++` and `c++abi` to both branches of the `if(ReactAndroid_VERSION_MINOR GREATER_EQUAL 76)` statement.

**For `react-native-safe-area-context`:**
Edit `node_modules/react-native-safe-area-context/android/src/main/jni/CMakeLists.txt`:
Add `c++` and `c++abi` to both branches of the `if (REACTNATIVE_MERGED_SO)` statement.

**For `react-native-gesture-handler`:**
Edit `node_modules/react-native-gesture-handler/android/src/main/jni/CMakeLists.txt`:
Add `c++` and `c++abi` to the `target_link_libraries()` call.

**For `react-native-reanimated`, `react-native-iap`, and `expo-modules-core`:**
Apply the same fix - add `c++` and `c++abi` to their `target_link_libraries()` calls in their respective `CMakeLists.txt` files.

**For React Native Application Template:**
Edit `node_modules/react-native/ReactAndroid/cmake-utils/ReactNative-application.cmake`:
Add `c++` and `c++abi` to the main `target_link_libraries(${CMAKE_PROJECT_NAME} ...)` call around line 81-85.

**Note:** These changes will be lost when you run `npm install`. Consider using `patch-package` to persist the changes, or reapply them after each `npm install`.

**Alternative Solutions:**

1. **Wait for library updates** that properly link the C++ standard library
2. **Use patch-package** to create persistent patches (see [patch-package documentation](https://github.com/ds300/patch-package))
3. **Downgrade React Native** (not recommended) - Use an older version that doesn't require C++20

---

## 📚 Additional Resources

- [React Native Android Build Docs](https://reactnative.dev/docs/signed-apk-android)
- [Expo Local Build Guide](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://developer.android.com/studio/publish/app-signing)

---

## ✅ Summary

**Yes, you can build Android builds without EAS!** 

- ✅ No quota limits
- ✅ Build locally with Gradle
- ✅ Full control over build process
- ✅ Works for both APK and AAB

Just use:
- `npm run build:android:debug` for testing
- `npm run build:android:bundle` for Play Store


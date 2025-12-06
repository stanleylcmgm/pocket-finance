# Build Instructions for Android

## Option 1: EAS Build (Cloud Build - Recommended) ✅

This doesn't require Android SDK installation. Build in the cloud:

```bash
# Build development version
eas build --profile development --platform android

# Or build preview version
eas build --profile preview --platform android
```

After the build completes, you'll get a download link. Install the APK on your Android device to test.

## Option 2: Local Build with Android Studio

If you want to build locally, you need to install Android Studio:

### Step 1: Install Android Studio
1. Download from: https://developer.android.com/studio
2. Install Android Studio
3. Open Android Studio and complete the setup wizard
4. Install Android SDK through Android Studio:
   - Go to **Tools → SDK Manager**
   - Install **Android SDK Platform** (latest version)
   - Install **Android SDK Build-Tools**
   - Install **Android SDK Command-line Tools**

### Step 2: Set Environment Variables

After installing Android Studio, find your SDK location (usually):
- `C:\Users\YourName\AppData\Local\Android\Sdk`

Then set these environment variables in PowerShell (run as Administrator):

```powershell
# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\Stanley Lam\AppData\Local\Android\Sdk', 'User')

# Add to PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
$newPath = "$currentPath;C:\Users\Stanley Lam\AppData\Local\Android\Sdk\platform-tools;C:\Users\Stanley Lam\AppData\Local\Android\Sdk\tools"
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
```

**Important:** Replace `C:\Users\Stanley Lam\AppData\Local\Android\Sdk` with your actual SDK path if different.

### Step 3: Restart Terminal

Close and reopen your terminal/PowerShell window for changes to take effect.

### Step 4: Verify Setup

```bash
# Check ANDROID_HOME
echo $env:ANDROID_HOME

# Check adb
adb version
```

### Step 5: Build and Run

```bash
# Prebuild (already done)
npx expo prebuild --clean

# Run on Android
npx expo run:android
```

## Quick Test Without Building

If you just want to test the app quickly, you can use Expo Go (but AdMob won't work):

```bash
npx expo start
```

Then scan the QR code with Expo Go app on your phone.

**Note:** AdMob requires a custom development build, so you need to use EAS Build or local build, not Expo Go.


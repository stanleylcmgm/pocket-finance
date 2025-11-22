# Building Development APK to Test Real AdMob IDs

This guide will help you build a development APK that uses your real AdMob IDs for testing on your Android phone.

## ✅ Prerequisites

1. **Configuration is ready**: `useTestAds: false` in `utils/admob-config.js` ✅
2. **Real Ad Unit IDs configured**: Your production ad unit IDs are in the config ✅
3. **App IDs match**: AndroidManifest.xml and app.json have the correct App ID ✅

## 🚀 Option 1: EAS Build (Recommended - Cloud Build)

This is the easiest method - builds in the cloud, no Android SDK needed.

### Step 1: Login to EAS (if not already)

```bash
eas login
```

### Step 2: Build Development APK

```bash
# Build a development APK
eas build --profile development --platform android
```

**What this does:**
- Builds an APK with your real AdMob IDs
- Includes development client for hot reload
- Creates a downloadable APK file

### Step 3: Download and Install

1. After build completes, you'll get a download link
2. Download the APK to your phone
3. Enable "Install from Unknown Sources" on your Android phone:
   - Go to Settings → Security → Enable "Install unknown apps" for your browser/email app
4. Open the downloaded APK and install it

### Alternative: Build Preview APK (Standalone)

If you want a standalone APK (no development client):

```bash
eas build --profile preview --platform android
```

---

## 🔧 Option 2: Local Build (Requires Android Studio)

If you prefer to build locally on your computer:

### Step 1: Ensure Android SDK is Set Up

Check if you have Android SDK installed:
```powershell
echo $env:ANDROID_HOME
adb version
```

If not set up, follow the instructions in `BUILD_INSTRUCTIONS.md`.

### Step 2: Prebuild Native Code

```bash
npx expo prebuild --clean
```

### Step 3: Build Debug APK

```bash
cd android
.\gradlew assembleDebug
```

This creates an APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 4: Install on Your Phone

**Option A: Via USB (ADB)**
1. Connect your phone via USB
2. Enable USB Debugging on your phone
3. Run:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Option B: Manual Install**
1. Copy `app-debug.apk` to your phone
2. Enable "Install from Unknown Sources"
3. Open the APK file on your phone and install

---

## 📱 Testing Your Real AdMob IDs

### What to Expect

1. **First Launch**: 
   - AdMob may take a few seconds to initialize
   - You might see "no-fill" errors initially if ad units are new

2. **Ad Loading**:
   - New ad units can take **24-48 hours** to start serving ads
   - If you see "no-fill", it's normal for newly created ad units
   - Check AdMob console to see if requests are being recorded

3. **Verification**:
   - Open AdMob Console → Apps → Your App → Ad units
   - Check "Requests" - you should see ad requests coming in
   - Even if no ads show, requests being recorded means your IDs are correct

### Troubleshooting

**"No-fill" errors:**
- ✅ Normal for new ad units (wait 24-48 hours)
- ✅ Check AdMob console to verify requests are being recorded
- ✅ Make sure your app is approved in AdMob

**Ads not showing:**
- Check that `useTestAds: false` in config
- Verify App ID matches in AndroidManifest.xml and app.json
- Check AdMob console for any policy violations
- Ensure your device has internet connection

**Build errors:**
- Run `npx expo prebuild --clean` before building
- Clear cache: `npm start --clear`
- Check that all dependencies are installed: `npm install`

---

## 🔍 Verify Configuration

Before building, double-check these files have the correct IDs:

1. **`utils/admob-config.js`**:
   - ✅ `useTestAds: false`
   - ✅ Real Android Banner ID: `ca-app-pub-2240821992848494/3862032038`
   - ✅ Android App ID: `ca-app-pub-2240821992848494~7813719484`

2. **`android/app/src/main/AndroidManifest.xml`**:
   - ✅ App ID: `ca-app-pub-2240821992848494~7813719484`

3. **`app.json`**:
   - ✅ `androidAppId`: `ca-app-pub-2240821992848494~7813719484`

---

## 📊 Monitoring in AdMob

After installing the APK and using the app:

1. Go to [AdMob Console](https://apps.admob.com/)
2. Navigate to **Apps** → Your App → **Ad units**
3. Click on your Banner ad unit
4. Check the **Requests** metric - you should see requests coming in
5. Even if fill rate is 0%, seeing requests means your integration is working!

---

## ⚠️ Important Notes

1. **Development vs Production**: This builds a development APK. For Play Store release, use `eas build --profile production`

2. **Ad Serving**: New ad units may not serve ads immediately. This is normal and can take up to 48 hours.

3. **Test Devices**: You can add your device as a test device in AdMob to see test ads even with production IDs (useful for testing).

4. **Policy Compliance**: Make sure your app complies with AdMob policies before going to production.

---

## 🎯 Quick Start Command

**EAS Build (Recommended):**
```bash
eas build --profile development --platform android
```

**Local Build:**
```bash
npx expo prebuild --clean
cd android
.\gradlew assembleDebug
```

Then install `android/app/build/outputs/apk/debug/app-debug.apk` on your phone.


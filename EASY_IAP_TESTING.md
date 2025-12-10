# Easy Ways to Test IAP Fix

Here are the fastest and easiest ways to test your IAP fix without waiting for Google Play review.

## 🚀 Method 1: Development Build (Fastest - Recommended)

This is the **fastest way** to test - build a development/preview build and install directly on your device.

### Step 1: Build Development APK

```bash
# Build a preview APK (faster than production, no review needed)
eas build --profile preview --platform android
```

**Why this is better:**
- ✅ Builds in 10-15 minutes (vs 30-60 for production)
- ✅ No Google Play review needed
- ✅ Install directly on device
- ✅ IAP still works (as long as app is in Play Console)

### Step 2: Download and Install

1. **Download the APK** from the EAS build link
2. **Transfer to your Android device** (via USB, email, or cloud)
3. **Enable "Install from Unknown Sources"**:
   - Settings → Security → Enable "Install unknown apps" for your file manager/browser
4. **Install the APK** by tapping it
5. **Test IAP immediately!**

### Step 3: Test IAP

1. Open the app
2. Click "Remove Ads"
3. Test the purchase flow
4. Check console logs if needed

**Time to test: ~15-20 minutes** (build time + install)

---

## 🔧 Method 2: Local Build (If You Have Android Studio)

If you have Android Studio set up locally, this is even faster.

### Step 1: Prebuild Native Code

```bash
npx expo prebuild --clean
```

### Step 2: Build Debug APK

```bash
cd android
.\gradlew assembleDebug
```

This creates: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 3: Install on Device

```bash
# Connect device via USB
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Time to test: ~5-10 minutes** (if Android Studio is set up)

**⚠️ Note:** Debug builds use debug signing, so IAP might not work. Use this mainly for UI testing.

---

## 📱 Method 3: Development Client (Best for Iterative Testing)

If you're making multiple changes, use Expo Development Client.

### Step 1: Build Development Client

```bash
eas build --profile development --platform android
```

### Step 2: Install Development Client

1. Download and install the development client APK
2. This is a one-time setup

### Step 3: Run Your App

```bash
# Start Expo dev server
npx expo start --dev-client

# Scan QR code or press 'a' for Android
```

**Benefits:**
- ✅ See changes instantly (hot reload)
- ✅ No rebuild needed for JS changes
- ✅ Test IAP with real code
- ✅ Fast iteration

**Time to test: ~15 minutes** (one-time setup), then **instant** for code changes

---

## 🎯 Method 4: Test on Real Device via Play Store (Current Method)

This is what you're doing now, but here's how to make it faster:

### Optimize the Process

1. **Build preview instead of production**:
   ```bash
   eas build --profile preview --platform android
   ```
   - Faster builds
   - Still works for testing

2. **Upload to Internal Testing** (not Closed Testing):
   - Internal Testing has faster review (usually 10-30 minutes)
   - Closed Testing can take longer

3. **Use the same test account**:
   - Add yourself as a tester
   - Install directly from Play Store
   - No need to wait for others

**Time to test: ~30-60 minutes** (build + upload + review)

---

## ⚡ Quick Comparison

| Method | Build Time | Review Time | Total Time | Best For |
|--------|-----------|-------------|------------|----------|
| **Development Build** | 10-15 min | None | **15-20 min** | ✅ **Quick testing** |
| **Local Build** | 5-10 min | None | **5-10 min** | Fast local testing |
| **Dev Client** | 15 min (once) | None | **Instant** (after setup) | Iterative development |
| **Play Store** | 30-60 min | 30-60 min | **60-120 min** | Final verification |

---

## 🎯 Recommended Testing Workflow

### For Quick Testing (Recommended):

1. **First test**: Use **Development Build** (Method 1)
   - Build preview APK
   - Install directly
   - Test IAP
   - **Time: ~20 minutes**

2. **If it works**: Upload to Play Store for final verification
   - Build production AAB
   - Upload to Closed Testing
   - Verify with real testers

3. **If it doesn't work**: Use **Development Client** (Method 3)
   - Make code changes
   - Test instantly with hot reload
   - No rebuild needed for JS changes

---

## 📋 Prerequisites for All Methods

**IAP will only work if:**
- ✅ Your app is uploaded to Google Play Console (at least Internal Testing)
- ✅ The `remove_ads` product is created and **Active** in Play Console
- ✅ You're signed in with a test account (for License testing)
- ✅ The app is properly signed (EAS handles this)

**Note:** Even with direct APK installation, IAP requires the app to exist in Play Console because Google Play Billing needs to verify the app signature.

---

## 🔍 Testing Checklist

When testing, check:

- [ ] App opens without errors
- [ ] "Remove Ads" button appears
- [ ] Modal opens correctly
- [ ] Price shows correctly ($1.99 or from Play Console)
- [ ] "Buy Now" button works (no "undefined is not a function" error)
- [ ] Purchase flow starts
- [ ] Can complete test purchase
- [ ] Purchase is stored correctly
- [ ] Ads are removed after purchase
- [ ] "Restore Purchases" works

---

## 🐛 Debugging Tips

### Check Console Logs

If using development build or dev client, you can see logs:

```bash
# For development build
adb logcat | grep -i "purchase\|iap\|error"

# Or use React Native debugger
npx react-native log-android
```

### Check What's Happening

The code now logs:
- `"Attempting to purchase product: remove_ads"`
- `"IAP methods available: { hasRequestPurchase: true/false }"`
- Any errors with full details

### Common Issues

1. **"Store not connected"**
   - Make sure you're on a real device (not emulator without Play Services)
   - Check internet connection
   - Verify app is in Play Console

2. **"Product not found"**
   - Verify product ID matches exactly (case-sensitive)
   - Check product is **Active** in Play Console
   - Wait a few hours after creating product

3. **"undefined is not a function"**
   - Should be fixed now with direct method access
   - Check console logs for which method is undefined

---

## ✅ Recommended: Start with Development Build

**For your current situation, I recommend:**

1. Build a preview APK:
   ```bash
   eas build --profile preview --platform android
   ```

2. Install directly on your test device

3. Test the IAP fix immediately

4. If it works, then upload to Play Store for final verification

**This saves you 1-2 hours of waiting for Play Store review!**

---

## 🚀 Quick Start Command

```bash
# Build and test in ~20 minutes
eas build --profile preview --platform android
# Then download APK and install on device
```

That's it! Much faster than waiting for Play Store review.

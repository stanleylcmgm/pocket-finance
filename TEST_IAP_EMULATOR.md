# Testing In-App Purchases in Android Emulator

Yes, you can test IAP in an Android emulator! However, there are specific requirements that must be met.

## ✅ Requirements for Testing IAP in Emulator

### 1. **Google Play Services**
- Your emulator must have Google Play Services installed
- Use an emulator image that includes Google Play (not just Google APIs)
- In Android Studio AVD Manager, choose an image with the "Play Store" icon

### 2. **App Must Be Uploaded to Google Play Console**
- The app must be uploaded to at least **Internal Testing** track
- IAP won't work with just a local debug build - it needs to be in Play Console
- The app doesn't need to be published, just uploaded to a testing track

### 3. **Product Must Be Created and Active**
- Create the `remove_ads` product in Google Play Console
- Product must be **Active** (not just created)
- Go to: **Monetize** → **Products** → **In-app products**

### 4. **Test Accounts Setup**
- Add test accounts in Google Play Console
- Go to: **Settings** → **License testing**
- Add your Gmail account(s) that you'll use on the emulator
- Test purchases are free and auto-refunded after a few minutes

### 5. **Sign In on Emulator**
- Sign in to the emulator with a test account (the one you added to License testing)
- Open Google Play Store app on emulator
- Sign in with your test account

### 6. **App Signing**
- The app must be signed with a release key (or the key Google Play uses)
- If you upload via EAS Build or Google Play Console, this is handled automatically
- Debug builds signed with debug keys won't work for IAP

## 🚀 Step-by-Step Testing Process

### Step 1: Create Product in Google Play Console

1. Go to [Google Play Console](https://play.google.com/console/)
2. Select your app
3. Navigate to **Monetize** → **Products** → **In-app products**
4. Click **Create product**
5. Fill in:
   - **Product ID**: `remove_ads` (must match your code)
   - **Name**: "Remove Ads"
   - **Description**: "Remove all advertisements"
   - **Price**: Set your price (e.g., $1.99)
6. Click **Save** then **Activate**

### Step 2: Add Test Accounts

1. In Google Play Console, go to **Settings** → **License testing**
2. Under **License testers**, add your Gmail account(s)
3. Save changes
4. Wait a few minutes for changes to propagate

### Step 3: Upload App to Internal Testing

1. Build your app (using EAS Build or locally)
2. Upload to Google Play Console → **Testing** → **Internal testing**
3. Create a new release and upload your APK/AAB
4. The app doesn't need to be published, just uploaded

### Step 4: Set Up Emulator

1. **Create Emulator with Google Play**:
   - Open Android Studio → **Tools** → **Device Manager**
   - Click **Create Device**
   - Choose a device (e.g., Pixel 5)
   - **Important**: Select a system image that has the **Play Store** icon (not just Google APIs)
   - Finish setup

2. **Start Emulator**:
   - Start the emulator from Device Manager
   - Wait for it to fully boot

3. **Sign In to Google Play**:
   - Open **Play Store** app on emulator
   - Sign in with your test account (the one added to License testing)
   - Accept terms if prompted

### Step 5: Install Your App

**Option A: Install from Internal Testing**
1. On emulator, open Play Store
2. Search for your app (it should appear if you're a tester)
3. Install it

**Option B: Install APK Directly**
1. Download the APK from your Internal Testing release
2. Drag and drop APK onto emulator, or use:
   ```bash
   adb install path/to/your-app.apk
   ```

### Step 6: Test IAP

1. Open your app on the emulator
2. Click "Remove Ads" button
3. The purchase flow should work!
4. When prompted, use your test account
5. Purchase will be free and auto-refunded

## 🔍 Troubleshooting

### "Store not connected" Error

**Possible causes:**
- Emulator doesn't have Google Play Services
- App not uploaded to Play Console
- Not signed in to Google Play on emulator

**Solutions:**
- Use an emulator image with Play Store
- Upload app to Internal Testing track
- Sign in to Play Store on emulator

### "Product not found" Error

**Possible causes:**
- Product ID doesn't match (case-sensitive)
- Product not activated in Play Console
- Product not available yet (can take a few hours)

**Solutions:**
- Verify product ID in `utils/iap-config.js` matches Play Console exactly
- Ensure product is **Active** (not just created)
- Wait a few hours after creating product

### Purchase Flow Doesn't Start

**Possible causes:**
- App signed with wrong key
- Not using test account
- Network issues

**Solutions:**
- Use the APK from Play Console (properly signed)
- Ensure you're signed in with a test account
- Check internet connection on emulator

### "undefined is not a function" Error

**This should be fixed now!** If you still see this:
- Make sure you've rebuilt the app after the code changes
- Clear app data and reinstall
- Check console logs for more details

## 📱 Alternative: Test on Real Device

If emulator testing is too complex, you can test on a real Android device:

1. Build and upload to Internal Testing (same as above)
2. Join your app's Internal Testing track
3. Install from Play Store on your device
4. Test IAP - it will work the same way

## ✅ Quick Checklist

- [ ] Product created and **Active** in Play Console
- [ ] Test account added to License testing
- [ ] App uploaded to Internal Testing track
- [ ] Emulator has Google Play Services
- [ ] Signed in to Play Store on emulator with test account
- [ ] App installed on emulator
- [ ] Product ID in code matches Play Console exactly

## 🎯 Expected Behavior

When testing in emulator:
- ✅ Purchase flow should work normally
- ✅ Test purchases are **free** (no charge)
- ✅ Purchases are **auto-refunded** after a few minutes
- ✅ You can test multiple times
- ✅ "Restore Purchases" should work

## 📝 Notes

- **Test purchases are free** - You won't be charged
- **Auto-refunded** - Purchases are automatically refunded after a few minutes
- **Multiple tests** - You can test the same purchase multiple times
- **Real product required** - You can't use fake product IDs, must create real ones in Play Console
- **Time delay** - After creating a product, it may take a few hours to be available

## 🚨 Important

IAP testing in emulator requires:
1. Real product in Play Console (not fake/test IDs)
2. App uploaded to Play Console (at least Internal Testing)
3. Proper signing (handled by Play Console)
4. Test account setup

If you want to test without these requirements, you'd need to use a real device with a development build, but even then, the product must exist in Play Console.

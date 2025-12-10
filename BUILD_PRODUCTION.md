# Building Production AAB for Google Play Store

## Prerequisites

✅ You already have:
- App in Google Play Console
- Product `remove_ads` created and active
- All setup complete

## Step 1: Create or Use Existing Release Keystore

### Option A: If you already have a keystore from previous uploads
- Use your existing keystore file
- Update `android/gradle.properties` with your keystore details

### Option B: Create a new upload keystore (if you don't have one)

**Important:** If you're using Google Play App Signing (recommended), this will be your **upload key**. Google manages the app signing key.

```powershell
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

**You'll be prompted for:**
- Keystore password (save this!)
- Key password (can be same as keystore password)
- Your name, organization, etc.

**IMPORTANT:** Save these credentials securely! You'll need them for future updates.

## Step 2: Configure Keystore in gradle.properties

Edit `android/gradle.properties` and update these values:

```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_STORE_PASSWORD=your-actual-password
MYAPP_RELEASE_KEY_ALIAS=upload
MYAPP_RELEASE_KEY_PASSWORD=your-actual-password
```

**Security Note:** Consider using environment variables instead:
```properties
MYAPP_RELEASE_STORE_FILE=release.keystore
MYAPP_RELEASE_STORE_PASSWORD=${KEYSTORE_PASSWORD}
MYAPP_RELEASE_KEY_ALIAS=upload
MYAPP_RELEASE_KEY_PASSWORD=${KEYSTORE_PASSWORD}
```

Then set environment variables before building:
```powershell
$env:KEYSTORE_PASSWORD="your-password"
```

## Step 3: Update Version (if needed)

Check `app.json` and `android/app/build.gradle`:
- `version`: "1.0.1" (user-facing version)
- `versionCode`: 2 (must increment for each upload)

For a new update, increment `versionCode`:
```json
"versionCode": 3
```

And update version if needed:
```json
"version": "1.0.2"
```

## Step 4: Build Production AAB

```bash
npm run build:android:bundle
```

Or manually:
```bash
cd android
.\gradlew.bat bundleRelease
```

**Output:** `android/app/build/outputs/bundle/release/app-release.aab`

## Step 5: Verify the AAB

Before uploading, verify it's properly signed:

```powershell
# Check if AAB is signed (optional verification)
cd android/app/build/outputs/bundle/release
# The AAB should be signed and ready for upload
```

## Step 6: Upload to Google Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Select your app: **Pocket Finance**
3. Go to: **Production** (or **Internal testing** / **Closed testing** for testing)
4. Click **Create new release**
5. Upload: `android/app/build/outputs/bundle/release/app-release.aab`
6. Add release notes
7. Review and publish

## Troubleshooting

### "Keystore not found" Error
- Make sure `release.keystore` is in `android/app/` directory
- Check the path in `gradle.properties` is correct

### "Wrong password" Error
- Verify passwords in `gradle.properties` match your keystore
- Check for typos or extra spaces

### "Upload key mismatch" Error
- If you get this, you're using a different upload key than before
- You need to either:
  - Use the same upload key as before, OR
  - Reset the upload key in Google Play Console (Settings → App signing)

### Build Fails
- Clean build: `npm run build:android:clean`
- Then rebuild: `npm run build:android:bundle`

## Important Notes

1. **Keystore Security**: Never commit `release.keystore` or passwords to git!
2. **Backup**: Keep a secure backup of your keystore and passwords
3. **Version Code**: Must increment for each upload (can't reuse)
4. **Google Play App Signing**: If enabled, Google manages your app signing key - you only need the upload key
5. **Testing**: Test the AAB in Internal Testing before going to Production

## Quick Checklist

- [ ] Release keystore created/configured
- [ ] `gradle.properties` updated with keystore info
- [ ] Version code incremented (if needed)
- [ ] Version name updated (if needed)
- [ ] AAB built successfully
- [ ] AAB uploaded to Play Console
- [ ] Release notes added
- [ ] Ready to publish!


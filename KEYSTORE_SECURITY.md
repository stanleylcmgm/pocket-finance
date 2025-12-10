# ⚠️ IMPORTANT: Keystore Security

## Current Status

✅ Keystore created: `android/app/release.keystore`
✅ Default password set: `android123`

## ⚠️ SECURITY WARNING

**The current password `android123` is NOT secure for production!**

### Before Uploading to Google Play:

1. **Change to a Strong Password:**
   - Use a long, random password (at least 16 characters)
   - Include uppercase, lowercase, numbers, and symbols
   - Example: `MyApp2024!Secure#Key$Password`

2. **Update gradle.properties:**
   ```properties
   MYAPP_RELEASE_STORE_PASSWORD=your-strong-password-here
   MYAPP_RELEASE_KEY_PASSWORD=your-strong-password-here
   ```

3. **Recreate Keystore with New Password (if needed):**
   ```powershell
   cd android/app
   & "C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
   (This will prompt for a password - use your strong password)

## Backup Your Keystore

**CRITICAL:** Save a secure backup of:
- `android/app/release.keystore` file
- The keystore password
- The key alias (`upload`)
- The key password

**If you lose these, you CANNOT update your app on Google Play!**

## Storage Recommendations

- Store keystore in a secure location (encrypted drive, password manager)
- Never commit keystore to git
- Keep passwords in a secure password manager
- Consider using environment variables instead of gradle.properties for passwords

## Using Environment Variables (More Secure)

Instead of putting passwords in `gradle.properties`, use environment variables:

1. Set environment variables:
   ```powershell
   $env:KEYSTORE_PASSWORD="your-strong-password"
   $env:KEY_PASSWORD="your-strong-password"
   ```

2. Update `gradle.properties`:
   ```properties
   MYAPP_RELEASE_STORE_PASSWORD=${KEYSTORE_PASSWORD}
   MYAPP_RELEASE_KEY_PASSWORD=${KEY_PASSWORD}
   ```

3. Set these variables before each build (or add to your build script)

## For Now (Testing)

The current setup with `android123` is fine for:
- ✅ Local testing
- ✅ Building the AAB
- ✅ Testing the build process

But **change it before uploading to production!**


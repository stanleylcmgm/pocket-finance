# Publishing to Google Play Store - Step by Step Guide

This guide will walk you through publishing your Pocket Finance app to the Google Play Store using Expo and EAS Build.

## Prerequisites

1. **Google Play Console Account**
   - Create an account at https://play.google.com/console
   - Pay the one-time $25 registration fee
   - Complete your developer account setup

2. **EAS CLI Installed**
   ```bash
   npm install -g eas-cli
   ```

3. **Expo Account**
   - Sign up at https://expo.dev if you haven't already
   - Login: `eas login`

## Step 1: Update App Configuration

### 1.1 Update app.json with Play Store Requirements

Your `app.json` needs additional fields for Play Store. We'll add:
- `versionCode` (must increment with each release)
- `permissions` (if needed)
- `android.permissions` (if needed)
- `android.versionCode` (auto-incremented by EAS)

### 1.2 Prepare Store Listing Assets

You'll need:
- **App Icon**: 512x512px PNG (you have this)
- **Feature Graphic**: 1024x500px PNG (for Play Store listing)
- **Screenshots**: At least 2, up to 8
  - Phone: 16:9 or 9:16 aspect ratio, min 320px, max 3840px
  - Tablet (optional): 16:9 or 9:16 aspect ratio
- **App Description**: Short (80 chars) and full (4000 chars)
- **Privacy Policy URL**: Required for apps with ads/IAP

## Step 2: Configure Production Build

### 2.1 Update eas.json for Production

Your `eas.json` already has a production profile. We'll ensure it's configured correctly.

### 2.2 Generate Production Keystore

EAS can automatically manage your keystore, or you can provide your own. For first-time publishing, we'll let EAS handle it.

## Step 3: Build Production AAB (Android App Bundle)

Google Play Store requires an AAB (Android App Bundle), not an APK.

```bash
# Build production AAB for Play Store
eas build --platform android --profile production
```

This will:
- Build your app in the cloud
- Generate a signed AAB file
- Take approximately 15-30 minutes

**Note**: On first build, EAS will ask if you want to generate a new keystore. Answer **yes** and save the credentials securely!

## Step 4: Set Up Google Play Console

### 4.1 Create Your App

1. Go to https://play.google.com/console
2. Click **Create app**
3. Fill in:
   - **App name**: Pocket Finance
   - **Default language**: English (United States)
   - **App or game**: App
   - **Free or paid**: Free (or Paid if you're charging)
   - **Declarations**: Check all that apply (Ads, IAP, etc.)

### 4.2 Complete Store Listing

1. Go to **Store presence** → **Main store listing**

2. **Required Fields**:
   - **App name**: Pocket Finance
   - **Short description** (80 chars max): e.g., "Track expenses, manage assets, and analyze your finances"
   - **Full description** (4000 chars max): Detailed description of your app
   - **App icon**: Upload 512x512px PNG
   - **Feature graphic**: 1024x500px PNG
   - **Screenshots**: Upload at least 2 screenshots
   - **Privacy Policy**: URL to your privacy policy (REQUIRED for apps with ads/IAP)

3. **Optional but Recommended**:
   - **Category**: Finance
   - **Tags**: finance, expense tracker, budgeting, etc.
   - **Contact details**: Email, phone, website
   - **Graphic assets**: Promo graphics, TV banner, etc.

### 4.3 Set Up App Content

1. Go to **Policy** → **App content**
2. Complete:
   - **Privacy Policy**: Add URL (required for ads/IAP)
   - **Target audience**: Select appropriate age group
   - **Content ratings**: Complete questionnaire
   - **Data safety**: Declare data collection practices

### 4.4 Configure Pricing and Distribution

1. Go to **Monetization setup** → **Products** → **In-app products** (if using IAP)
2. Go to **Monetization setup** → **Monetize with ads** (if using AdMob)
3. Go to **Pricing and distribution**:
   - Select countries/regions
   - Set pricing (if paid app)
   - Accept content guidelines

## Step 5: Upload Your App

### 5.1 Create Internal Testing Track (Recommended First Step)

1. Go to **Testing** → **Internal testing**
2. Click **Create new release**
3. Upload your AAB file (downloaded from EAS build)
4. Add **Release name**: e.g., "1.0.0 - Initial Release"
5. Add **Release notes**: What's new in this version
6. Click **Save**
7. Click **Review release**
8. Click **Start rollout to Internal testing**

### 5.2 Add Testers

1. In **Internal testing**, go to **Testers** tab
2. Create a tester list or use email addresses
3. Share the testing link with testers

### 5.3 Test Your App

- Install the app from the testing link
- Test all features thoroughly
- Verify AdMob ads work correctly
- Test in-app purchases (if applicable)

## Step 6: Submit for Production Review

Once testing is complete:

1. Go to **Production** → **Releases**
2. Click **Create new release**
3. Upload the same AAB file
4. Add **Release name** and **Release notes**
5. Click **Review release**
6. Review all sections (store listing, content rating, etc.)
7. Click **Start rollout to Production**
8. Your app will be submitted for review

## Step 7: Review Process

- **Review time**: Usually 1-7 days (can be longer for first submission)
- **Status updates**: Check Play Console dashboard
- **Common issues**:
  - Missing privacy policy
  - Incorrect content rating
  - Policy violations
  - Technical issues

## Step 8: App Goes Live! 🎉

Once approved:
- Your app will be available on Google Play Store
- Users can download and install it
- You'll receive notifications about installs, reviews, etc.

## Important Notes

### Version Management

- **versionCode**: Must increment with each release (EAS handles this automatically)
- **versionName**: User-facing version (e.g., "1.0.0", "1.1.0")
- Update both in `app.json` before each new release

### Privacy Policy

Since your app uses AdMob, you **MUST** have a privacy policy that covers:
- Data collection (AdMob collects device info, location, etc.)
- Third-party services (Google AdMob)
- User rights
- Contact information

You can:
- Host it on your website
- Use a free service like GitHub Pages
- Use privacy policy generators

### Keystore Security

- EAS manages your keystore securely
- Save the keystore credentials if you ever need to migrate
- Never lose your keystore - you can't update your app without it!

### Updates

For future updates:
1. Update version in `app.json`
2. Build new AAB: `eas build --platform android --profile production`
3. Upload to Play Console
4. Submit for review

## Troubleshooting

### Build Fails
- Check EAS build logs
- Verify all dependencies are compatible
- Ensure app.json is valid

### Play Console Rejects App
- Check email for specific reasons
- Common: Missing privacy policy, incorrect permissions, policy violations

### Ads Not Working
- Verify AdMob app ID is correct
- Check AdMob account is active
- Ensure test ads are disabled in production

## Next Steps After Publishing

1. Monitor analytics in Play Console
2. Respond to user reviews
3. Track crashes and ANRs (Application Not Responding)
4. Plan updates based on feedback
5. Consider A/B testing for store listing

## Resources

- [Expo EAS Build Docs](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Play Store Policy](https://play.google.com/about/developer-content-policy/)
- [AdMob Policy](https://support.google.com/admob/answer/6128543)

---

**Ready to start?** Begin with Step 1 and work through each step methodically. Good luck with your app launch! 🚀


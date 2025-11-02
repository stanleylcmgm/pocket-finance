# Google AdMob Integration Setup Guide

This document explains how to set up Google AdMob for monetization in your Pocket Finance app.

## ✅ Current Status

AdMob has been integrated into your app with:
- Banner ads on all main screens (Home, Balance Sheet, Expenses Tracking, Asset Management, Reports)
- Test ad IDs configured (ready for testing)
- Interstitial ad component created (optional to use)

## 📋 Prerequisites

1. **Google AdMob Account**: You need a Google AdMob account
   - Sign up at: https://apps.admob.com/
   - Complete the account setup process

2. **App Registration in AdMob**:
   - Add your iOS app (if publishing to App Store)
   - Add your Android app (if publishing to Play Store)
   - Get your App IDs from AdMob dashboard

## 🔧 Configuration Steps

### Step 1: Get Your AdMob App IDs

1. Log in to [AdMob Console](https://apps.admob.com/)
2. Go to **Apps** → **Add App**
3. Register your app for iOS and/or Android
4. Copy the **App ID** for each platform:
   - iOS App ID: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`
   - Android App ID: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### Step 2: Create Ad Units

1. In AdMob Console, go to **Apps** → Select your app → **Ad units**
2. Create ad units for:
   - **Banner Ad**: Used on all screens
   - **Interstitial Ad** (optional): Full-screen ads between screens
3. Copy the **Ad Unit IDs**:
   - Banner: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`
   - Interstitial: `ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX`

### Step 3: Update Configuration Files

#### Update `App.js` (Optional - for manual initialization):
AdMob is already initialized in `App.js`. If you need to configure App IDs manually (for development builds), you can add them there. However, for production builds, you'll need to configure them in the native projects (AndroidManifest.xml and Info.plist).

#### Update `utils/admob-config.js`:

Replace the test IDs with your production Ad Unit IDs:

```javascript
export const ADMOB_CONFIG = {
  appId: {
    ios: 'YOUR_IOS_APP_ID_HERE',
    android: 'YOUR_ANDROID_APP_ID_HERE',
  },
  
  adUnitIds: {
    banner: {
      ios: 'YOUR_IOS_BANNER_AD_UNIT_ID',
      android: 'YOUR_ANDROID_BANNER_AD_UNIT_ID',
    },
    interstitial: {
      ios: 'YOUR_IOS_INTERSTITIAL_AD_UNIT_ID',
      android: 'YOUR_ANDROID_INTERSTITIAL_AD_UNIT_ID',
    },
  },
  
  // IMPORTANT: Set to false before publishing to production!
  useTestAds: false,
};
```

### Step 4: Rebuild Your App

After updating the configuration:

1. **For Development Build**:
   ```bash
   npm start
   # Then rebuild with: npx expo prebuild
   # Then: npx expo run:android or npx expo run:ios
   ```

2. **For Production Build**:
   - Make sure `useTestAds: false` in `admob-config.js`
   - Build your app with EAS Build or locally
   - Test thoroughly before releasing

## 📱 Where Ads Are Displayed

Banner ads are currently displayed at the bottom of:
- ✅ Home Screen
- ✅ Balance Sheet Screen
- ✅ Expenses Tracking Screen
- ✅ Asset Management Screen
- ✅ Reports & Analytics Screen

## 🎯 Ad Placement Strategy

### Current Implementation:
- **Banner Ads**: Bottom of each screen (non-intrusive)

### Optional Enhancements:
- **Interstitial Ads**: Show between screen transitions
  - Example: Show after viewing reports, before viewing balance sheet
  - Use the `useInterstitialAd()` hook from `components/ad-interstitial.js`

### Best Practices:
- Don't show ads too frequently (avoid user frustration)
- Test ads thoroughly before production
- Monitor ad performance in AdMob dashboard
- Consider offering an ad-free premium version

## 🧪 Testing

### Using Test Ads (Current Setup):
- Test ads are currently enabled (`useTestAds: true`)
- Test ad IDs are automatically used
- This is safe for development testing

### Before Production:
1. **Always test with test ads first**
2. Replace test IDs with production IDs
3. Set `useTestAds: false`
4. Test on real devices before releasing
5. Ensure your app complies with [AdMob Policies](https://support.google.com/admob/answer/6128543)

## 📊 Monetization Tips

1. **Optimize Ad Placement**: 
   - Bottom banners work well for finance apps
   - Consider native ad units that match your design

2. **User Experience**:
   - Don't interrupt user workflow unnecessarily
   - Consider rewarded ads for premium features

3. **Monitor Performance**:
   - Check AdMob dashboard regularly
   - Track eCPM (effective cost per mille)
   - A/B test different ad placements

4. **Compliance**:
   - Follow Google AdMob policies
   - Disclose ads in privacy policy
   - Handle GDPR/CCPA if applicable

## 🔗 Useful Links

- [AdMob Console](https://apps.admob.com/)
- [AdMob Documentation](https://developers.google.com/admob)
- [React Native Google Mobile Ads Docs](https://github.com/invertase/react-native-google-mobile-ads)
- [AdMob Policies](https://support.google.com/admob/answer/6128543)

## ⚠️ Important Notes

1. **Test Ads**: Currently using Google's test ad IDs - safe for development
2. **Production**: Replace all test IDs before publishing to stores
3. **Revenue**: You'll start earning after ads are served to real users
4. **Payment**: Google pays when you reach the payment threshold ($100)

## 🆘 Troubleshooting

### Ads not showing?
- Check if test ads are enabled
- Verify App IDs and Ad Unit IDs are correct
- Check console logs for errors
- Ensure app is properly built (not Expo Go for native modules)

### Build errors?
- Run `npx expo prebuild` to generate native code
- Clear cache: `npm start --clear`
- Rebuild native projects

---

**Need Help?** Refer to the [React Native Google Mobile Ads documentation](https://github.com/invertase/react-native-google-mobile-ads) or Google AdMob support.


// AdMob Configuration
// Replace these with your actual AdMob App IDs from https://apps.admob.com/
// For testing, you can use the test IDs provided below

export const ADMOB_CONFIG = {
  // Your AdMob App IDs
  // Get these from https://apps.admob.com/ → Apps → Your App
  appId: {
    ios: 'ca-app-pub-2240821992848494~5694597260', // iOS App ID - UPDATE THIS when you have it
    android: 'ca-app-pub-2240821992848494~5694597260', // Android App ID - YOUR APP ID
  },
  
  // Ad Unit IDs - IMPORTANT: These are different from App IDs!
  // Ad Unit IDs use "/" separator, not "~"
  // Get these from AdMob → Apps → Your App → Ad units → Create ad unit
  adUnitIds: {
    // Banner Ad IDs
    banner: {
      ios: 'ca-app-pub-3940256099942544/2934735716', // iOS Test Banner (replace with your real Banner Ad Unit ID)
      android: 'ca-app-pub-3940256099942544/6300978111', // Android Test Banner (replace with your real Banner Ad Unit ID)
    },
    // Interstitial Ad IDs
    interstitial: {
      ios: 'ca-app-pub-3940256099942544/4411468910', // iOS Test Interstitial
      android: 'ca-app-pub-3940256099942544/1033173712', // Android Test Interstitial
    },
    // Rewarded Ad IDs (optional)
    rewarded: {
      ios: 'ca-app-pub-3940256099942544/1712485313', // iOS Test Rewarded
      android: 'ca-app-pub-3940256099942544/5224354917', // Android Test Rewarded
    },
  },
  
  // Set to false when ready for production
  // Set to true to use test ads during development
  useTestAds: true,
};

// Helper function to get the correct ad unit ID based on platform
import { Platform } from 'react-native';

export const getAdUnitId = (adType = 'banner') => {
  if (ADMOB_CONFIG.useTestAds) {
    return Platform.OS === 'ios' 
      ? ADMOB_CONFIG.adUnitIds[adType].ios
      : ADMOB_CONFIG.adUnitIds[adType].android;
  }
  
  // In production, you would return your actual ad unit IDs
  // For now, using test IDs - replace these when you have production IDs
  return Platform.OS === 'ios' 
    ? ADMOB_CONFIG.adUnitIds[adType].ios
    : ADMOB_CONFIG.adUnitIds[adType].android;
};


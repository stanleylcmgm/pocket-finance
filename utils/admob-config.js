// AdMob Configuration
// Replace these with your actual AdMob App IDs from https://apps.admob.com/
// For testing, you can use the test IDs provided below

export const ADMOB_CONFIG = {
  // Your AdMob App IDs
  // Get these from https://apps.admob.com/ → Apps → Your App
  appId: {
    ios: 'ca-app-pub-2240821992848494~7813719484', // iOS App ID
    android: 'ca-app-pub-2240821992848494~7813719484', // Android App ID
  },
  
  // Google's Official Test Ad Unit IDs (always work for testing)
  // These are provided by Google and always return test ads
  testAdUnitIds: {
    banner: {
      ios: 'ca-app-pub-3940256099942544/2934735716', // iOS Test Banner
      android: 'ca-app-pub-3940256099942544/6300978111', // Android Test Banner
    },
    interstitial: {
      ios: 'ca-app-pub-3940256099942544/4411468910', // iOS Test Interstitial
      android: 'ca-app-pub-3940256099942544/1033173712', // Android Test Interstitial
    },
    rewarded: {
      ios: 'ca-app-pub-3940256099942544/1712485313', // iOS Test Rewarded
      android: 'ca-app-pub-3940256099942544/5224354917', // Android Test Rewarded
    },
  },
  
  // Your Production Ad Unit IDs - IMPORTANT: These are different from App IDs!
  // Ad Unit IDs use "/" separator, not "~"
  // Get these from AdMob → Apps → Your App → Ad units
  adUnitIds: {
    // Banner Ad IDs
    banner: {
      ios: 'ca-app-pub-2240821992848494/3862032038', // iOS Production Banner
      android: 'ca-app-pub-2240821992848494/3862032038', // Android Production Banner
    },
    // Interstitial Ad IDs
    interstitial: {
      ios: 'ca-app-pub-2240821992848494/5758176445', // iOS Production Interstitial (update when you create one)
      android: 'ca-app-pub-2240821992848494/3862032038', // Android Production Interstitial (update when you create one)
    },
    // Rewarded Ad IDs
    rewarded: {
      ios: 'ca-app-pub-2240821992848494/2544260098', // iOS Production Rewarded (same as Android for now)
      android: 'ca-app-pub-2240821992848494/2544260098', // Android Production Rewarded
    },
  },
  
  // Set to false when ready for production
  // Set to true to use Google's test ads during development
  useTestAds: false,
  
  // Set to false to completely disable all ads temporarily
  // This is useful for development or testing without ads
  adsEnabled: true,
};

// Helper function to get the correct ad unit ID based on platform
import { Platform } from 'react-native';

export const getAdUnitId = (adType = 'banner') => {
  // When useTestAds is true, use Google's official test ad IDs (always work)
  if (ADMOB_CONFIG.useTestAds) {
    return Platform.OS === 'ios' 
      ? ADMOB_CONFIG.testAdUnitIds[adType].ios
      : ADMOB_CONFIG.testAdUnitIds[adType].android;
  }
  
  // In production, use your actual ad unit IDs
  return Platform.OS === 'ios' 
    ? ADMOB_CONFIG.adUnitIds[adType].ios
    : ADMOB_CONFIG.adUnitIds[adType].android;
};


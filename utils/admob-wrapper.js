// AdMob wrapper that gracefully handles when the module is not available
// (e.g., when running in Expo Go which doesn't support native modules)

let mobileAds = null;
let BannerAd = null;
let BannerAdSize = null;
let InterstitialAd = null;
let RewardedAd = null;
let AdEventType = null;
let RewardedAdEventType = null;
let TestIds = null;

// Try to load AdMob - this will fail silently in Expo Go
const isAdMobAvailable = (() => {
  try {
    const adModule = require('react-native-google-mobile-ads');
    // The default export is a function that returns the mobileAds object
    mobileAds = adModule.default;
    BannerAd = adModule.BannerAd;
    BannerAdSize = adModule.BannerAdSize;
    InterstitialAd = adModule.InterstitialAd;
    RewardedAd = adModule.RewardedAd;
    AdEventType = adModule.AdEventType;
    RewardedAdEventType = adModule.RewardedAdEventType;
    TestIds = adModule.TestIds;
    
    // Verify that we got the expected exports
    if (mobileAds && typeof mobileAds === 'function') {
      return true;
    }
    return false;
  } catch (error) {
    // AdMob not available (expected in Expo Go)
    console.log('AdMob module not available:', error.message);
    return false;
  }
})();

export const adMobAvailable = isAdMobAvailable;
export { mobileAds, BannerAd, BannerAdSize, InterstitialAd, RewardedAd, AdEventType, RewardedAdEventType, TestIds };


// AdMob wrapper that gracefully handles when the module is not available
// (e.g., when running in Expo Go which doesn't support native modules)

let mobileAds = null;
let BannerAd = null;
let BannerAdSize = null;
let InterstitialAd = null;

// Try to load AdMob - this will fail silently in Expo Go
const isAdMobAvailable = (() => {
  try {
    const adModule = require('react-native-google-mobile-ads');
    mobileAds = adModule.default;
    BannerAd = adModule.BannerAd;
    BannerAdSize = adModule.BannerAdSize;
    InterstitialAd = adModule.InterstitialAd;
    return true;
  } catch (error) {
    // AdMob not available (expected in Expo Go)
    return false;
  }
})();

export const adMobAvailable = isAdMobAvailable;
export { mobileAds, BannerAd, BannerAdSize, InterstitialAd };


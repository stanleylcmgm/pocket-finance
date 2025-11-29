import React, { useEffect, useRef } from 'react';
import { InterstitialAd, AdEventType, adMobAvailable } from '../utils/admob-wrapper';
import { getAdUnitId } from '../utils/admob-config';

// Create a singleton instance to manage interstitial ads
let interstitialAd = null;

export const loadInterstitialAd = () => {
  if (!adMobAvailable || !InterstitialAd) {
    console.log('InterstitialAd not available');
    return null;
  }

  const adUnitId = getAdUnitId('interstitial');
  
  interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Load the ad
  interstitialAd.load();

  return interstitialAd;
};

export const showInterstitialAd = () => {
  if (!adMobAvailable || !InterstitialAd || !AdEventType) {
    console.log('InterstitialAd not available');
    return;
  }

  if (interstitialAd) {
    const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
      console.log('Interstitial ad loaded, showing...');
      interstitialAd.show();
      unsubscribeLoaded();
    });

    const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('Interstitial ad closed');
      // Reload the ad for next time
      interstitialAd.load();
      unsubscribeClosed();
    });

    const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error);
      unsubscribeError();
    });

    // If ad is already loaded, show it immediately
    if (interstitialAd.loaded) {
      interstitialAd.show();
      unsubscribeLoaded();
    } else {
      // Otherwise, wait for it to load
      interstitialAd.load();
    }

    // Cleanup after a timeout
    setTimeout(() => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    }, 30000); // 30 second timeout
  } else {
    // Load and show if not already loaded
    const ad = loadInterstitialAd();
    if (ad) {
      const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
        ad.show();
        unsubscribeLoaded();
      });
      ad.load();
    }
  }
};

// Hook to use interstitial ads in components
export const useInterstitialAd = () => {
  const adRef = useRef(null);

  useEffect(() => {
    // Load ad on mount only if AdMob is available
    if (adMobAvailable && InterstitialAd) {
      adRef.current = loadInterstitialAd();
    }

    return () => {
      // Cleanup if needed
      adRef.current = null;
    };
  }, []);

  const showAd = () => {
    if (!adMobAvailable || !InterstitialAd) {
      console.log('InterstitialAd not available');
      return;
    }

    if (adRef.current) {
      showInterstitialAd();
    } else {
      // Reload if ad is null
      adRef.current = loadInterstitialAd();
      setTimeout(() => showInterstitialAd(), 1000);
    }
  };

  return { showAd };
};


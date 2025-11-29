import { useEffect, useRef, useState } from 'react';
import { RewardedAd, adMobAvailable, AdEventType, RewardedAdEventType } from '../utils/admob-wrapper';
import { getAdUnitId } from '../utils/admob-config';

// Create a singleton instance to manage rewarded ads
let rewardedAd = null;
let isAdShowing = false; // Flag to prevent multiple simultaneous ad shows
let currentListeners = []; // Track current listeners to clean them up

export const loadRewardedAd = () => {
  if (!adMobAvailable || !RewardedAd) {
    console.log('RewardedAd not available');
    return null;
  }

  const adUnitId = getAdUnitId('rewarded');
  
  rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
    requestNonPersonalizedAdsOnly: true,
  });

  // Load the ad
  rewardedAd.load();

  return rewardedAd;
};

export const showRewardedAd = (onRewarded, onAdClosed, onError) => {
  // Prevent multiple simultaneous ad shows
  if (isAdShowing) {
    console.log('Rewarded ad is already showing, ignoring duplicate call');
    return;
  }

  if (!adMobAvailable || !RewardedAd || !AdEventType || !RewardedAdEventType) {
    console.log('RewardedAd not available');
    if (onError) onError(new Error('RewardedAd not available'));
    return;
  }

  // Clean up any existing listeners first
  currentListeners.forEach(unsubscribe => {
    try {
      unsubscribe();
    } catch (err) {
      console.log('Error cleaning up listener:', err);
    }
  });
  currentListeners = [];

  if (!rewardedAd) {
    // Load and show if not already loaded
    rewardedAd = loadRewardedAd();
  }

  // Set flag to prevent duplicate calls
  isAdShowing = true;

  // Set up event listeners
  const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log('Rewarded ad loaded, showing...');
    if (rewardedAd && rewardedAd.loaded && isAdShowing) {
      rewardedAd.show();
    }
  });

  const unsubscribeEarnedReward = rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      console.log('User earned reward:', reward);
      if (onRewarded) {
        onRewarded(reward);
      }
    }
  );

  const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Rewarded ad closed');
    // Reset flag
    isAdShowing = false;
    
    // Clean up all listeners
    currentListeners.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (err) {
        console.log('Error cleaning up listener:', err);
      }
    });
    currentListeners = [];
    
    // Reload the ad for next time
    if (rewardedAd) {
      rewardedAd.load();
    }
    if (onAdClosed) {
      onAdClosed();
    }
  });

  const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error('Rewarded ad error:', error);
    // Reset flag on error
    isAdShowing = false;
    
    // Clean up all listeners
    currentListeners.forEach(unsubscribe => {
      try {
        unsubscribe();
      } catch (err) {
        console.log('Error cleaning up listener:', err);
      }
    });
    currentListeners = [];
    
    if (onError) {
      onError(error);
    }
  });

  // Store listeners for cleanup
  currentListeners = [
    unsubscribeLoaded,
    unsubscribeEarnedReward,
    unsubscribeClosed,
    unsubscribeError,
  ];

  // If ad is already loaded, show it immediately
  if (rewardedAd.loaded) {
    rewardedAd.show();
  } else {
    // Otherwise, wait for it to load
    rewardedAd.load();
  }
};

// Hook to use rewarded ads in components
export const useRewardedAd = () => {
  const adRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load ad on mount
    if (adMobAvailable && RewardedAd && RewardedAdEventType && AdEventType) {
      adRef.current = loadRewardedAd();

      // Listen for loaded state
      if (adRef.current) {
        const unsubscribeLoaded = adRef.current.addAdEventListener(
          RewardedAdEventType.LOADED,
          () => {
            setIsLoaded(true);
            setIsLoading(false);
            unsubscribeLoaded();
          }
        );

        const unsubscribeError = adRef.current.addAdEventListener(AdEventType.ERROR, () => {
          setIsLoading(false);
          setIsLoaded(false);
          unsubscribeError();
        });

        return () => {
          unsubscribeLoaded();
          unsubscribeError();
        };
      }
    }

    return () => {
      adRef.current = null;
    };
  }, []);

  const showAd = (onRewarded, onAdClosed, onError) => {
    if (!adMobAvailable || !RewardedAd || !AdEventType || !RewardedAdEventType) {
      if (onError) {
        onError(new Error('RewardedAd not available'));
      }
      return;
    }

    if (!adRef.current) {
      // Reload if ad is null
      adRef.current = loadRewardedAd();
      setIsLoading(true);
      setIsLoaded(false);
      
      // Wait a bit for the ad to load
      setTimeout(() => {
        showRewardedAd(onRewarded, onAdClosed, onError);
      }, 1000);
    } else if (adRef.current) {
      setIsLoading(true);
      showRewardedAd(onRewarded, onAdClosed, onError);
    } else {
      if (onError) {
        onError(new Error('RewardedAd not available'));
      }
    }
  };

  return { showAd, isLoading, isLoaded };
};


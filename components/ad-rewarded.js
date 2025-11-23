import { useEffect, useRef, useState } from 'react';
import { RewardedAd, adMobAvailable } from '../utils/admob-wrapper';
import { AdEventType, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { getAdUnitId } from '../utils/admob-config';

// Create a singleton instance to manage rewarded ads
let rewardedAd = null;

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
  if (!adMobAvailable || !RewardedAd) {
    console.log('RewardedAd not available');
    if (onError) onError(new Error('RewardedAd not available'));
    return;
  }

  if (!rewardedAd) {
    // Load and show if not already loaded
    rewardedAd = loadRewardedAd();
  }

  // Set up event listeners
  const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log('Rewarded ad loaded, showing...');
    if (rewardedAd && rewardedAd.loaded) {
      rewardedAd.show();
    }
    unsubscribeLoaded();
  });

  const unsubscribeEarnedReward = rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      console.log('User earned reward:', reward);
      if (onRewarded) {
        onRewarded(reward);
      }
      unsubscribeEarnedReward();
    }
  );

  const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('Rewarded ad closed');
    // Reload the ad for next time
    if (rewardedAd) {
      rewardedAd.load();
    }
    if (onAdClosed) {
      onAdClosed();
    }
    unsubscribeClosed();
  });

  const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
    console.error('Rewarded ad error:', error);
    if (onError) {
      onError(error);
    }
    unsubscribeError();
  });

  // If ad is already loaded, show it immediately
  if (rewardedAd.loaded) {
    rewardedAd.show();
  } else {
    // Otherwise, wait for it to load
    rewardedAd.load();
  }

  // Cleanup after a timeout
  setTimeout(() => {
    unsubscribeLoaded();
    unsubscribeEarnedReward();
    unsubscribeClosed();
    unsubscribeError();
  }, 60000); // 60 second timeout
};

// Hook to use rewarded ads in components
export const useRewardedAd = () => {
  const adRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load ad on mount
    if (adMobAvailable && RewardedAd) {
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
    if (!adRef.current && adMobAvailable && RewardedAd) {
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


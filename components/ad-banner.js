import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getAdUnitId } from '../utils/admob-config';
import { BannerAd, BannerAdSize, adMobAvailable } from '../utils/admob-wrapper';
import { useRemoveAds } from '../utils/use-remove-ads';

/**
 * Advertisement Banner Component
 * This component displays Google AdMob banner ads and will only render if:
 * 1. The user has NOT purchased the remove ads feature
 * 2. AdMob is available (not in Expo Go)
 * 
 * Usage:
 * <AdBanner position="bottom" />
 * 
 * The banner will automatically hide if the user has purchased the remove ads feature
 */
const AdBanner = ({ 
  size, 
  position = 'bottom',
  style,
}) => {
  const { isAdsRemoved, isLoading } = useRemoveAds();
  const [adUnitId, setAdUnitId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryKey, setRetryKey] = useState(0); // Key to force ad reload
  const retryTimerRef = useRef(null);

  useEffect(() => {
    // Get ad unit ID (AdMob is initialized in App.js)
    // Only if AdMob components are available
    if (adMobAvailable && BannerAd && BannerAdSize) {
      const unitId = getAdUnitId('banner');
      setAdUnitId(unitId);
    }
  }, []);

  // Cleanup retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current);
        retryTimerRef.current = null;
      }
    };
  }, []);

  // Don't show banner if ads are removed
  if (isAdsRemoved) {
    return null;
  }

  // Show loading state while checking purchase status
  if (isLoading) {
    return null;
  }

  // Don't render if AdMob is not available (e.g., in Expo Go)
  // Show a placeholder in development so you can see where ads will appear
  if (!adMobAvailable || !BannerAd || !BannerAdSize || !adUnitId) {
    // Always show development placeholder when AdMob is not available
    return (
      <View style={[styles.container, styles.placeholderContainer]}>
        <Text style={styles.placeholderText}>📱 Ad Banner</Text>
        <Text style={styles.placeholderSubtext}>
          {__DEV__ ? 'Build a custom dev build to see ads' : 'Ad loading...'}
        </Text>
      </View>
    );
  }

  const containerStyle = [
    styles.container,
    position === 'top' && styles.topPosition,
    position === 'bottom' && styles.bottomPosition,
    style,
  ];

  // Use provided size or default to BANNER (only if BannerAdSize is available)
  const adSize = size || (BannerAdSize ? BannerAdSize.BANNER : undefined);

  return (
    <View style={containerStyle}>
      <BannerAd
        key={retryKey}
        unitId={adUnitId}
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setIsLoaded(true);
          // Clear any retry timer when ad loads successfully
          if (retryTimerRef.current) {
            clearTimeout(retryTimerRef.current);
            retryTimerRef.current = null;
          }
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          // Check multiple possible error formats
          const errorCode = error?.code || error?.nativeEvent?.code;
          const errorMessage = error?.message || error?.nativeEvent?.message || String(error || '');
          const isNoFillError = 
            errorCode === 'googleMobileAds/error-code-no-fill' ||
            errorMessage?.includes('no-fill') ||
            errorMessage?.includes('no ad was returned due to lack of ad inventory') ||
            errorMessage?.includes('error-code-no-fill');
          
          if (isNoFillError) {
            // Suppress the error message, but retry loading the ad every 5 seconds
            // Clear any existing retry timer
            if (retryTimerRef.current) {
              clearTimeout(retryTimerRef.current);
            }
            
            // Set up retry timer to reload ad after 5 seconds
            retryTimerRef.current = setTimeout(() => {
              // Force ad reload by changing the key prop
              setRetryKey(prev => prev + 1);
              retryTimerRef.current = null;
            }, 5000);
          } else {
            // Log other errors (not no-fill)
            console.error('Banner ad failed to load:', error);
          }
          setIsLoaded(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  topPosition: {
    marginTop: 0,
  },
  bottomPosition: {
    marginBottom: 0,
  },
  placeholderContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
  },
  placeholderText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  placeholderSubtext: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
});

export default AdBanner;


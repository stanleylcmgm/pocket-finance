import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { getAdUnitId } from '../utils/admob-config';
import { BannerAd, BannerAdSize, adMobAvailable } from '../utils/admob-wrapper';

const AdBanner = ({ 
  size, 
  position = 'bottom',
  style,
}) => {
  const [adUnitId, setAdUnitId] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get ad unit ID (AdMob is initialized in App.js)
    // Only if AdMob components are available
    if (adMobAvailable && BannerAd && BannerAdSize) {
      const unitId = getAdUnitId('banner');
      setAdUnitId(unitId);
    }
  }, []);

  // Don't render if AdMob is not available (e.g., in Expo Go)
  // Show a placeholder in development so you can see where ads will appear
  if (!adMobAvailable || !BannerAd || !BannerAdSize || !adUnitId) {
    // Show development placeholder when running in Expo Go
    if (__DEV__) {
      return (
        <View style={[styles.container, styles.placeholderContainer]}>
          <Text style={styles.placeholderText}>📱 Ad Banner (not available in Expo Go)</Text>
          <Text style={styles.placeholderSubtext}>Build a custom dev build to see ads</Text>
        </View>
      );
    }
    return null;
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
        unitId={adUnitId}
        size={adSize}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          setIsLoaded(true);
          console.log('Banner ad loaded');
        }}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
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


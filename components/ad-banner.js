import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRemoveAds } from '../utils/use-remove-ads';
import { useI18n } from '../i18n/i18n';

/**
 * Advertisement Banner Component
 * This component will only render if the user has NOT purchased the remove ads feature
 * 
 * Usage:
 * <AdBanner />
 * 
 * The banner will automatically hide if the user has purchased the remove ads feature
 */
const AdBanner = ({ style, onPress }) => {
  const { isAdsRemoved, isLoading } = useRemoveAds();
  const { t } = useI18n();

  // Don't show banner if ads are removed or still loading
  if (isLoading || isAdsRemoved) {
    return null;
  }

  return (
    <TouchableOpacity
      style={[styles.banner, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.bannerContent}>
        <View style={styles.bannerLeft}>
          <Ionicons name="megaphone" size={20} color="#fff" />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>{t('ads.bannerTitle')}</Text>
            <Text style={styles.bannerSubtitle}>{t('ads.bannerSubtitle')}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bannerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
  },
});

export default AdBanner;


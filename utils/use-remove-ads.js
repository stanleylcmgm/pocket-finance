import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REMOVE_ADS_KEY = '@remove_ads_purchased';

/**
 * Custom hook to check if user has purchased the remove ads feature
 * @returns {boolean} true if ads should be removed (purchased), false otherwise
 */
export const useRemoveAds = () => {
  const [isAdsRemoved, setIsAdsRemoved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkPurchaseStatus();
  }, []);

  const checkPurchaseStatus = async () => {
    try {
      const purchased = await AsyncStorage.getItem(REMOVE_ADS_KEY);
      setIsAdsRemoved(purchased === 'true');
    } catch (error) {
      console.error('Error checking purchase status:', error);
      setIsAdsRemoved(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAdsRemoved, isLoading, refreshStatus: checkPurchaseStatus };
};

/**
 * Utility function to check purchase status synchronously (for non-hook usage)
 * Note: This is async, so use the hook when possible
 */
export const checkAdsRemoved = async () => {
  try {
    const purchased = await AsyncStorage.getItem(REMOVE_ADS_KEY);
    return purchased === 'true';
  } catch (error) {
    console.error('Error checking purchase status:', error);
    return false;
  }
};


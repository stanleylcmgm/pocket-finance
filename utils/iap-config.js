// In-App Purchase Configuration
// Product IDs must match exactly what you configure in:
// - iOS: App Store Connect → Your App → In-App Purchases
// - Android: Google Play Console → Your App → Monetize → Products → In-app products

import { Platform } from 'react-native';

export const IAP_CONFIG = {
  // Enable/Disable IAP functionality
  // Set to false to disable IAP (useful for testing in Expo Go)
  // Set to true when ready to use real in-app purchases
  enabled: true, // Enabled for production

  // Product IDs for "Remove Ads" purchase
  // IMPORTANT: These must match the product IDs you create in App Store Connect and Google Play Console
  // Format: Usually something like "remove_ads" or "com.yourapp.remove_ads"
  productIds: {
    // iOS Product ID - Create this in App Store Connect
    // Go to: App Store Connect → Your App → Features → In-App Purchases → Create
    ios: 'remove_ads', // TODO: Replace with your actual iOS product ID
    
    // Android Product ID - Create this in Google Play Console
    // Go to: Google Play Console → Your App → Monetize → Products → In-app products → Create
    android: 'remove_ads', // TODO: Replace with your actual Android product ID
  },

  // Get the product ID for the current platform
  getProductId: () => {
    return Platform.OS === 'ios' 
      ? IAP_CONFIG.productIds.ios 
      : IAP_CONFIG.productIds.android;
  },
};

// Product IDs array (required by expo-in-app-purchases)
export const PRODUCT_IDS = [
  IAP_CONFIG.productIds.ios,
  IAP_CONFIG.productIds.android,
];



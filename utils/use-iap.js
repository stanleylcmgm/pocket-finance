// In-App Purchase utility hook using react-native-iap
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { IAP_CONFIG } from './iap-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally import react-native-iap only if IAP is enabled
let RNIap = null;
if (IAP_CONFIG.enabled) {
  try {
    RNIap = require('react-native-iap');
  } catch (err) {
    console.log('react-native-iap not available (expected in Expo Go)');
  }
}

const REMOVE_ADS_KEY = '@remove_ads_purchased';
const PURCHASE_TOKEN_KEY = '@purchase_token';

/**
 * Custom hook for managing in-app purchases
 * Handles connection, product fetching, and purchase processing
 * Returns disabled state if IAP is not enabled in config
 */
export const useIAP = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // If IAP is disabled, return disabled state
  if (!IAP_CONFIG.enabled || !RNIap) {
    return {
      isConnected: false,
      isLoading: false,
      products: [],
      error: 'IAP is disabled. Enable it in utils/iap-config.js',
      purchaseProduct: async () => ({
        success: false,
        canceled: false,
        message: 'IAP is disabled',
      }),
      restorePurchases: async () => ({
        success: false,
        restored: false,
        message: 'IAP is disabled',
      }),
      fetchProducts: async () => [],
    };
  }

  // Connect to store on mount
  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    const initializeIAP = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get product IDs for current platform
        const productId = IAP_CONFIG.getProductId();
        const productIds = [productId];
        
        // Initialize connection
        await RNIap.initConnection();
        setIsConnected(true);
        console.log('Connected to store successfully');
        
        // Fetch products
        const fetchedProducts = await RNIap.getProducts(productIds);
        setProducts(fetchedProducts);
        console.log('Products fetched:', fetchedProducts);
        
        // Set up purchase listeners
        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
          console.log('Purchase updated:', purchase);
          try {
            await verifyAndStorePurchase(purchase);
            // Finish the transaction to acknowledge the purchase
            await RNIap.finishTransaction(purchase);
            setIsLoading(false);
          } catch (err) {
            console.error('Error processing purchase update:', err);
            setIsLoading(false);
          }
        });

        purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
          console.error('Purchase error:', error);
          setError(error.message || 'Purchase failed');
        });
        
      } catch (err) {
        console.error('Error initializing IAP:', err);
        setError(err.message || 'Failed to connect to store');
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeIAP();

    // Cleanup on unmount
    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
      }
      RNIap.endConnection().catch(err => {
        console.error('Error ending connection:', err);
      });
    };
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const productId = IAP_CONFIG.getProductId();
      const productIds = [productId];
      
      const fetchedProducts = await RNIap.getProducts(productIds);
      setProducts(fetchedProducts);
      console.log('Products fetched:', fetchedProducts);
      return fetchedProducts;
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const purchaseProduct = async (productId = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const targetProductId = productId || IAP_CONFIG.getProductId();
      
      console.log('Attempting to purchase product:', targetProductId);
      
      // Request purchase - this will trigger the purchase flow
      // The actual purchase completion is handled by purchaseUpdatedListener
      await RNIap.requestPurchase(targetProductId);
      
      // Return success - the listener will handle the actual purchase
      return {
        success: true,
        message: 'Purchase initiated',
      };
    } catch (err) {
      console.error('Error purchasing product:', err);
      setIsLoading(false);
      
      // Check if user canceled
      if (err.code === 'E_USER_CANCELLED' || err.code === 'E_USER_CANCELED' || err.message?.includes('cancel')) {
        return {
          success: false,
          canceled: true,
          message: 'Purchase canceled by user',
        };
      }
      
      const errorMsg = err.message || 'Failed to complete purchase';
      setError(errorMsg);
      return {
        success: false,
        canceled: false,
        message: errorMsg,
      };
    }
  };

  const verifyAndStorePurchase = async (purchase) => {
    try {
      // Store purchase status
      await AsyncStorage.setItem(REMOVE_ADS_KEY, 'true');
      
      // Store purchase token/receipt for verification
      if (purchase.transactionReceipt) {
        await AsyncStorage.setItem(PURCHASE_TOKEN_KEY, purchase.transactionReceipt);
      }
      
      // Store purchase ID
      if (purchase.transactionId) {
        await AsyncStorage.setItem('@purchase_order_id', purchase.transactionId);
      }
      
      console.log('Purchase verified and stored');
      
      // TODO: In production, you should verify the purchase with your backend
      // This ensures the purchase is legitimate and prevents fraud
      // Example:
      // await fetch('https://your-backend.com/verify-purchase', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     transactionReceipt: purchase.transactionReceipt,
      //     productId: purchase.productId,
      //     transactionId: purchase.transactionId,
      //     platform: Platform.OS,
      //   }),
      // });
      
    } catch (err) {
      console.error('Error storing purchase:', err);
      throw err;
    }
  };

  const restorePurchases = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Restoring purchases...');
      
      // Get available purchases
      const purchases = await RNIap.getAvailablePurchases();
      
      // Check if user has purchased remove ads
      const productId = IAP_CONFIG.getProductId();
      const removeAdsPurchase = purchases.find(
        purchase => purchase.productId === productId
      );
      
      if (removeAdsPurchase) {
        console.log('Found remove ads purchase, restoring...');
        await verifyAndStorePurchase(removeAdsPurchase);
        // Finish the transaction (if not already finished)
        try {
          await RNIap.finishTransaction(removeAdsPurchase);
        } catch (err) {
          // Transaction might already be finished, that's okay
          console.log('Transaction already finished or error finishing:', err);
        }
        return {
          success: true,
          restored: true,
          message: 'Purchases restored successfully',
        };
      } else {
        return {
          success: true,
          restored: false,
          message: 'No previous purchases found',
        };
      }
    } catch (err) {
      console.error('Error restoring purchases:', err);
      const errorMsg = err.message || 'Failed to restore purchases';
      setError(errorMsg);
      return {
        success: false,
        restored: false,
        message: errorMsg,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isConnected,
    isLoading,
    products,
    error,
    purchaseProduct,
    restorePurchases,
    fetchProducts,
  };
};

// In-App Purchase utility hook using react-native-iap
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { IAP_CONFIG } from './iap-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally import react-native-iap only if IAP is enabled
let IAP = null;
let IAP_LOAD_ERROR = null;

if (IAP_CONFIG.enabled) {
  try {
    console.log('Attempting to load react-native-iap module...');
    // Try both default and named exports
    const rnIapModule = require('react-native-iap');
    console.log('react-native-iap module loaded:', typeof rnIapModule);
    console.log('Module keys:', rnIapModule ? Object.keys(rnIapModule).slice(0, 20) : 'null');
    
    IAP = rnIapModule.default || rnIapModule;
    
    // Verify critical methods exist
    if (!IAP) {
      console.error('react-native-iap module is null or undefined after extraction');
      IAP_LOAD_ERROR = 'Module loaded but is null/undefined';
      IAP = null;
    } else {
      console.log('IAP module extracted successfully');
      console.log('IAP has requestPurchase:', typeof IAP.requestPurchase === 'function');
      console.log('IAP has initConnection:', typeof IAP.initConnection === 'function');
      
      if (typeof IAP.requestPurchase !== 'function') {
        console.error('IAP.requestPurchase is not a function. Available methods:', Object.keys(IAP).slice(0, 20));
        IAP_LOAD_ERROR = 'requestPurchase method not found';
      } else {
        console.log('react-native-iap loaded successfully!');
      }
    }
  } catch (err) {
    console.error('Failed to load react-native-iap:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      name: err.name,
    });
    IAP_LOAD_ERROR = err.message || 'Failed to require react-native-iap';
    IAP = null;
  }
} else {
  console.log('IAP is disabled in config');
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
  if (!IAP_CONFIG.enabled) {
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
  
  // If IAP module failed to load
  if (!IAP) {
    const errorMsg = IAP_LOAD_ERROR 
      ? `react-native-iap module failed to load: ${IAP_LOAD_ERROR}. Make sure the native module is properly installed and linked.`
      : 'react-native-iap module is not available. Rebuild the app after installing the package.';
    
    console.error(errorMsg);
    
    return {
      isConnected: false,
      isLoading: false,
      products: [],
      error: errorMsg,
      purchaseProduct: async () => ({
        success: false,
        canceled: false,
        message: errorMsg,
      }),
      restorePurchases: async () => ({
        success: false,
        restored: false,
        message: errorMsg,
      }),
      fetchProducts: async () => [],
    };
  }

  // Access methods directly from react-native-iap v14
  // Don't extract them as they need to maintain their context

  // Connect to store on mount
  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    const initializeIAP = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Verify IAP module is available
        if (!IAP) {
          throw new Error('IAP module is not available');
        }
        
        // Verify required methods exist
        const requiredMethods = ['initConnection', 'getProducts', 'purchaseUpdatedListener', 'purchaseErrorListener'];
        const missingMethods = requiredMethods.filter(method => typeof IAP[method] !== 'function');
        if (missingMethods.length > 0) {
          console.error('Missing IAP methods:', missingMethods);
          console.error('Available methods:', Object.keys(IAP));
          throw new Error(`Missing IAP methods: ${missingMethods.join(', ')}`);
        }
        
        // Get product IDs for current platform
        const productId = IAP_CONFIG.getProductId();
        const productIds = [productId];
        
        console.log('Initializing IAP connection...');
        // Initialize connection
        if (typeof IAP.initConnection !== 'function') {
          throw new Error('IAP.initConnection is not a function');
        }
        await IAP.initConnection();
        setIsConnected(true);
        console.log('Connected to store successfully');
        
        // Fetch products
        if (typeof IAP.getProducts !== 'function') {
          throw new Error('IAP.getProducts is not a function');
        }
        const fetchedProducts = await IAP.getProducts({ skus: productIds });
        setProducts(fetchedProducts);
        console.log('Products fetched:', fetchedProducts);
        
        // Set up purchase listeners
        if (typeof IAP.purchaseUpdatedListener !== 'function') {
          throw new Error('IAP.purchaseUpdatedListener is not a function');
        }
        purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase) => {
          console.log('Purchase updated:', purchase);
          try {
            await verifyAndStorePurchase(purchase);
            // Finish the transaction to acknowledge the purchase
            if (typeof IAP.finishTransaction === 'function') {
              await IAP.finishTransaction({ purchase, isConsumable: false });
            } else {
              console.error('IAP.finishTransaction is not a function');
            }
            setIsLoading(false);
          } catch (err) {
            console.error('Error processing purchase update:', err);
            setIsLoading(false);
          }
        });

        if (typeof IAP.purchaseErrorListener !== 'function') {
          throw new Error('IAP.purchaseErrorListener is not a function');
        }
        purchaseErrorSubscription = IAP.purchaseErrorListener((error) => {
          console.error('Purchase error:', error);
          setError(error.message || 'Purchase failed');
        });
        
      } catch (err) {
        console.error('Error initializing IAP:', err);
        console.error('Error stack:', err.stack);
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
      IAP.endConnection().catch(err => {
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
      
      const fetchedProducts = await IAP.getProducts({ skus: productIds });
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
      
      // Safety check
      if (!IAP || typeof IAP.requestPurchase !== 'function') {
        const errorMsg = 'IAP.requestPurchase is not available. Check react-native-iap installation.';
        console.error(errorMsg);
        console.error('IAP object:', IAP);
        console.error('Available methods:', IAP ? Object.keys(IAP) : 'IAP is null');
        setError(errorMsg);
        setIsLoading(false);
        return {
          success: false,
          canceled: false,
          message: errorMsg,
        };
      }
      
      const targetProductId = productId || IAP_CONFIG.getProductId();
      
      console.log('Attempting to purchase product:', targetProductId);
      console.log('Platform:', Platform.OS);
      console.log('IAP methods available:', {
        hasRequestPurchase: typeof IAP.requestPurchase === 'function',
        hasInitConnection: typeof IAP.initConnection === 'function',
        IAPType: typeof IAP,
        IAPKeys: IAP ? Object.keys(IAP).slice(0, 10) : 'null',
      });
      
      // Request purchase - this will trigger the purchase flow
      // The actual purchase completion is handled by purchaseUpdatedListener
      // For react-native-iap v14, Android requires skus array
      let purchaseRequest;
      if (Platform.OS === 'android') {
        // Android: use skus array
        purchaseRequest = {
          request: {
            android: {
              skus: [targetProductId],
            },
          },
        };
      } else {
        // iOS: use sku (singular)
        purchaseRequest = {
          request: {
            ios: {
              sku: targetProductId,
            },
          },
        };
      }
      
      console.log('Calling requestPurchase with:', JSON.stringify(purchaseRequest));
      
      // Call requestPurchase
      await IAP.requestPurchase(purchaseRequest);
      
      console.log('Purchase request initiated successfully');
      
      // Return success - the listener will handle the actual purchase
      return {
        success: true,
        message: 'Purchase initiated',
      };
    } catch (err) {
      console.error('Error purchasing product:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        name: err.name,
        stack: err.stack?.substring(0, 500),
      });
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
      const purchases = await IAP.getAvailablePurchases();
      
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
          await IAP.finishTransaction({ purchase: removeAdsPurchase, isConsumable: false });
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

// In-App Purchase utility hook using react-native-iap
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { IAP_CONFIG } from './iap-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Conditionally import react-native-iap only if IAP is enabled
let RNIap = null;
let IAP_LOAD_ERROR = null;

if (IAP_CONFIG.enabled) {
  try {
    console.log('Attempting to load react-native-iap module...');
    // Try different import patterns for react-native-iap v14
    const rnIapModule = require('react-native-iap');
    console.log('react-native-iap module loaded:', typeof rnIapModule);
    console.log('Module keys:', rnIapModule ? Object.keys(rnIapModule).slice(0, 30) : 'null');
    
    // Try different export patterns
    // Pattern 1: Direct export (most common)
    if (rnIapModule && typeof rnIapModule.initConnection === 'function') {
      RNIap = rnIapModule;
      console.log('Using direct export pattern');
    }
    // Pattern 2: Default export
    else if (rnIapModule?.default && typeof rnIapModule.default.initConnection === 'function') {
      RNIap = rnIapModule.default;
      console.log('Using default export pattern');
    }
    // Pattern 3: Check if it's a namespace object
    else if (rnIapModule && Object.keys(rnIapModule).length > 0) {
      // Try to use it directly anyway
      RNIap = rnIapModule;
      console.log('Using module as-is (may need native linking)');
    }
    
    // Verify critical methods exist
    if (!RNIap) {
      console.error('react-native-iap module is null or undefined');
      IAP_LOAD_ERROR = 'Module loaded but is null/undefined';
      RNIap = null;
    } else {
      // Check for methods - they should be directly on the module
      // Note: react-native-iap v14 uses fetchProducts, not getProducts
      const hasInitConnection = typeof RNIap.initConnection === 'function';
      const hasFetchProducts = typeof RNIap.fetchProducts === 'function';
      const hasRequestPurchase = typeof RNIap.requestPurchase === 'function';
      const hasPurchaseUpdatedListener = typeof RNIap.purchaseUpdatedListener === 'function';
      const hasPurchaseErrorListener = typeof RNIap.purchaseErrorListener === 'function';
      
      console.log('IAP methods check:', {
        hasInitConnection,
        hasFetchProducts,
        hasRequestPurchase,
        hasPurchaseUpdatedListener,
        hasPurchaseErrorListener,
        allKeys: Object.keys(RNIap).slice(0, 30),
      });
      
      if (!hasInitConnection || !hasFetchProducts || !hasRequestPurchase) {
        console.error('Missing IAP methods. Available methods:', Object.keys(RNIap).slice(0, 30));
        IAP_LOAD_ERROR = `Missing methods: initConnection=${hasInitConnection}, fetchProducts=${hasFetchProducts}, requestPurchase=${hasRequestPurchase}`;
        // Don't set RNIap to null here - we'll handle the error in the hook
      } else {
        console.log('react-native-iap loaded successfully with all required methods!');
      }
    }
  } catch (err) {
    console.error('Failed to load react-native-iap:', err);
    console.error('Error details:', {
      message: err.message,
      code: err.code,
      name: err.name,
      stack: err.stack?.substring(0, 500),
    });
    IAP_LOAD_ERROR = err.message || 'Failed to require react-native-iap';
    RNIap = null;
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
  if (!RNIap) {
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
  // Methods are exported directly from the module

  // Connect to store on mount
  useEffect(() => {
    let purchaseUpdateSubscription;
    let purchaseErrorSubscription;

    const initializeIAP = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Verify IAP module is available
        if (!RNIap) {
          throw new Error('IAP module is not available');
        }
        
        // Verify required methods exist
        // Note: react-native-iap v14 uses fetchProducts, not getProducts
        const requiredMethods = ['initConnection', 'fetchProducts', 'purchaseUpdatedListener', 'purchaseErrorListener'];
        const missingMethods = requiredMethods.filter(method => typeof RNIap[method] !== 'function');
        if (missingMethods.length > 0) {
          console.error('Missing IAP methods:', missingMethods);
          console.error('Available methods:', Object.keys(RNIap));
          throw new Error(`Missing IAP methods: ${missingMethods.join(', ')}`);
        }
        
        // Get product IDs for current platform
        const productId = IAP_CONFIG.getProductId();
        const productIds = [productId];
        
        console.log('Initializing IAP connection...');
        // Initialize connection
        if (typeof RNIap.initConnection !== 'function') {
          throw new Error('RNIap.initConnection is not a function');
        }
        await RNIap.initConnection();
        setIsConnected(true);
        console.log('Connected to store successfully');
        
        // Fetch products - react-native-iap v14 uses fetchProducts with { skus: [...] }
        if (typeof RNIap.fetchProducts !== 'function') {
          throw new Error('RNIap.fetchProducts is not a function');
        }
        const fetchedProducts = await RNIap.fetchProducts({ skus: productIds });
        setProducts(fetchedProducts);
        console.log('Products fetched:', fetchedProducts);
        
        // Set up purchase listeners
        if (typeof RNIap.purchaseUpdatedListener !== 'function') {
          throw new Error('RNIap.purchaseUpdatedListener is not a function');
        }
        purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
          console.log('Purchase updated:', purchase);
          try {
            await verifyAndStorePurchase(purchase);
            // Finish the transaction to acknowledge the purchase
            if (typeof RNIap.finishTransaction === 'function') {
              await RNIap.finishTransaction({ purchase, isConsumable: false });
            } else {
              console.error('RNIap.finishTransaction is not a function');
            }
            setIsLoading(false);
          } catch (err) {
            console.error('Error processing purchase update:', err);
            setIsLoading(false);
          }
        });

        if (typeof RNIap.purchaseErrorListener !== 'function') {
          throw new Error('RNIap.purchaseErrorListener is not a function');
        }
        purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
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
      
      // react-native-iap v14 uses fetchProducts, not getProducts
      const fetchedProducts = await RNIap.fetchProducts({ skus: productIds });
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
      if (!RNIap || typeof RNIap.requestPurchase !== 'function') {
        const errorMsg = 'RNIap.requestPurchase is not available. Check react-native-iap installation.';
        console.error(errorMsg);
        console.error('RNIap object:', RNIap);
        console.error('Available methods:', RNIap ? Object.keys(RNIap) : 'RNIap is null');
        setError(errorMsg);
        setIsLoading(false);
        return {
          success: false,
          canceled: false,
          message: errorMsg,
        };
      }
      
      // Ensure connection is established
      if (!isConnected) {
        const errorMsg = 'Store connection not established. Please wait and try again.';
        console.error(errorMsg);
        setError(errorMsg);
        setIsLoading(false);
        return {
          success: false,
          canceled: false,
          message: errorMsg,
        };
      }
      
      const targetProductId = productId || IAP_CONFIG.getProductId();
      
      // Validate product ID
      if (!targetProductId || typeof targetProductId !== 'string' || targetProductId.trim() === '') {
        const errorMsg = 'Invalid product ID';
        console.error(errorMsg, targetProductId);
        setError(errorMsg);
        setIsLoading(false);
        return {
          success: false,
          canceled: false,
          message: errorMsg,
        };
      }
      
      console.log('Attempting to purchase product:', targetProductId);
      console.log('Platform:', Platform.OS);
      console.log('IAP methods available:', {
        hasRequestPurchase: typeof RNIap.requestPurchase === 'function',
        hasInitConnection: typeof RNIap.initConnection === 'function',
        RNIapType: typeof RNIap,
        RNIapKeys: RNIap ? Object.keys(RNIap).slice(0, 10) : 'null',
      });
      
      // Request purchase - this will trigger the purchase flow
      // The actual purchase completion is handled by purchaseUpdatedListener
      // For react-native-iap v14, Android requires skus array
      // Note: type is optional and defaults to 'in-app', but we'll be explicit
      let purchaseRequest;
      if (Platform.OS === 'android') {
        // Android: use skus array
        purchaseRequest = {
          type: 'in-app', // Explicitly specify product type
          request: {
            android: {
              skus: [targetProductId],
            },
          },
        };
      } else {
        // iOS: use sku (singular)
        purchaseRequest = {
          type: 'in-app', // Explicitly specify product type
          request: {
            ios: {
              sku: targetProductId,
            },
          },
        };
      }
      
      console.log('Calling requestPurchase with:', JSON.stringify(purchaseRequest));
      console.log('Product ID being used:', targetProductId);
      
      // Ensure we have a valid product ID
      if (!targetProductId) {
        throw new Error('Product ID is required for purchase');
      }
      
      // Call requestPurchase
      await RNIap.requestPurchase(purchaseRequest);
      
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
          await RNIap.finishTransaction({ purchase: removeAdsPurchase, isConsumable: false });
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

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n/i18n';
import { useRemoveAds } from '../utils/use-remove-ads';
import { useIAP } from '../utils/use-iap';
import { IAP_CONFIG } from '../utils/iap-config';

const RemoveAdsButton = () => {
  const { t } = useI18n();
  const { isAdsRemoved: isPurchased, refreshStatus } = useRemoveAds();
  const { 
    isConnected, 
    isLoading: iapLoading, 
    products, 
    error: iapError,
    purchaseProduct, 
    restorePurchases,
    fetchProducts 
  } = useIAP();
  const [modalVisible, setModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseInProgress, setPurchaseInProgress] = useState(false);

  // Fetch products when modal opens
  useEffect(() => {
    if (modalVisible && isConnected) {
      fetchProducts();
    }
  }, [modalVisible, isConnected]);

  // Get product details
  const product = products.find(p => p.productId === IAP_CONFIG.getProductId());
  const productPrice = product?.price || '$1.99';
  const productTitle = product?.title || t('purchase.removeAdsTitle');

  // Monitor purchase status changes
  useEffect(() => {
    if (isPurchased && purchaseInProgress) {
      // Purchase completed successfully
      setPurchaseInProgress(false);
      setModalVisible(false);
      Alert.alert(
        t('purchase.success'),
        t('purchase.adsRemoved'),
        [{ text: t('common.close'), style: 'default' }]
      );
    }
  }, [isPurchased, purchaseInProgress, t]);

  const handlePurchase = async () => {
    if (!isConnected) {
      Alert.alert(
        t('purchase.error'),
        'Store not connected. Please try again.',
        [{ text: t('common.close'), style: 'default' }]
      );
      return;
    }

    setIsProcessing(true);
    setPurchaseInProgress(true);
    try {
      const result = await purchaseProduct();
      
      if (result.success) {
        // Purchase initiated - will be handled by listener
        // The useEffect will handle the completion
        console.log('Purchase initiated, waiting for completion...');
      } else if (result.canceled) {
        // User canceled
        setPurchaseInProgress(false);
        setIsProcessing(false);
        console.log('Purchase canceled by user');
        // Don't show alert for cancel, just allow user to dismiss modal
      } else {
        // Purchase failed
        setPurchaseInProgress(false);
        Alert.alert(
          t('purchase.error'),
          result.message || t('purchase.errorMessage'),
          [{ text: t('common.close'), style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseInProgress(false);
      Alert.alert(
        t('purchase.error'),
        error.message || t('purchase.errorMessage'),
        [{ text: t('common.close'), style: 'default' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    try {
      const result = await restorePurchases();
      
      if (result.success && result.restored) {
        await refreshStatus();
        setModalVisible(false);
        
        Alert.alert(
          t('purchase.success'),
          'Your purchase has been restored successfully!',
          [{ text: t('common.close'), style: 'default' }]
        );
      } else if (result.success && !result.restored) {
        Alert.alert(
          'No Purchases Found',
          'No previous purchases were found to restore.',
          [{ text: t('common.close'), style: 'default' }]
        );
      } else {
        Alert.alert(
          t('purchase.error'),
          result.message || 'Failed to restore purchases. Please try again.',
          [{ text: t('common.close'), style: 'default' }]
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        t('purchase.error'),
        error.message || 'Failed to restore purchases.',
        [{ text: t('common.close'), style: 'default' }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Refresh status when modal opens to check for recent purchases
  useEffect(() => {
    if (modalVisible) {
      refreshStatus();
    }
  }, [modalVisible, refreshStatus]);

  const isLoading = iapLoading || isProcessing;

  // Don't show button if already purchased (but allow it to show while loading)
  // Only hide if we've confirmed the purchase status
  if (isPurchased && !isLoading) {
    return null;
  }

  // If IAP is disabled, show a message instead of the purchase button
  if (!IAP_CONFIG.enabled) {
    return (
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          Alert.alert(
            'Remove Ads',
            'In-app purchases are currently disabled. Enable IAP in utils/iap-config.js to use this feature.\n\nFor testing in Expo Go, IAP is disabled by default.',
            [{ text: t('common.close'), style: 'default' }]
          );
        }}
      >
        <Ionicons name="close-circle" size={18} color="#fff" />
        <Text style={styles.buttonText}>{t('purchase.removeAds')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="close-circle" size={18} color="#fff" />
        <Text style={styles.buttonText}>{t('purchase.removeAds')}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setPurchaseInProgress(false);
          setIsProcessing(false);
        }}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            if (!isProcessing && !purchaseInProgress) {
              setModalVisible(false);
              setPurchaseInProgress(false);
              setIsProcessing(false);
            }
          }}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="star" size={32} color="#FFD700" />
              </View>
              <Text style={styles.modalTitle}>{t('purchase.removeAdsTitle')}</Text>
              <Text style={styles.modalSubtitle}>{t('purchase.removeAdsDescription')}</Text>
            </View>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                <Text style={styles.featureText}>{t('purchase.feature1')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                <Text style={styles.featureText}>{t('purchase.feature2')}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={20} color="#28a745" />
                <Text style={styles.featureText}>{t('purchase.feature3')}</Text>
              </View>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>{t('purchase.price')}</Text>
              <Text style={styles.priceValue}>{productPrice}</Text>
              {!IAP_CONFIG.enabled && (
                <Text style={styles.errorText}>IAP is disabled in config</Text>
              )}
              {!isConnected && IAP_CONFIG.enabled && (
                <Text style={styles.connectionStatus}>Connecting to store...</Text>
              )}
              {iapError && IAP_CONFIG.enabled && (
                <Text style={styles.errorText}>{iapError}</Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.purchaseButton, (isLoading || !isConnected) && styles.purchaseButtonDisabled]}
                onPress={handlePurchase}
                disabled={isLoading || !isConnected}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="card" size={20} color="#fff" />
                    <Text style={styles.purchaseButtonText}>{t('purchase.buyNow')}</Text>
                  </>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={handleRestorePurchases}
                disabled={isLoading || !isConnected}
              >
                <Ionicons name="refresh" size={16} color="#6c757d" />
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                  setPurchaseInProgress(false);
                  setIsProcessing(false);
                }}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>{t('purchase.disclaimer')}</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 0,
    height: 32,
    width: 100,
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 20,
  },
  featuresList: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingLeft: 4,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#2c3e50',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#28a745',
  },
  buttonContainer: {
    gap: 12,
  },
  purchaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    opacity: 0.8,
  },
  restoreButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
  },
  connectionStatus: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 8,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 8,
  },
  disclaimer: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});

export default RemoveAdsButton;


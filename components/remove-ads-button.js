import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../i18n/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRemoveAds } from '../utils/use-remove-ads';

const REMOVE_ADS_KEY = '@remove_ads_purchased';

const RemoveAdsButton = () => {
  const { t } = useI18n();
  const { isAdsRemoved: isPurchased, refreshStatus } = useRemoveAds();
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement actual in-app purchase logic here
      // For now, this is a placeholder that simulates a purchase
      
      // Simulate purchase process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would:
      // 1. Initialize the purchase SDK (expo-in-app-purchases or RevenueCat)
      // 2. Request the product
      // 3. Process the purchase
      // 4. Verify the purchase with your backend
      // 5. Store the purchase status
      
      // For demo purposes, we'll just store it locally
      await AsyncStorage.setItem(REMOVE_ADS_KEY, 'true');
      // Refresh the purchase status in the hook
      await refreshStatus();
      setModalVisible(false);
      
      Alert.alert(
        t('purchase.success'),
        t('purchase.adsRemoved'),
        [{ text: t('common.close'), style: 'default' }]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(
        t('purchase.error'),
        t('purchase.errorMessage'),
        [{ text: t('common.close'), style: 'default' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Don't show button if already purchased (but allow it to show while loading)
  // Only hide if we've confirmed the purchase status
  if (isPurchased && !isLoading) {
    return null;
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
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
              <Text style={styles.priceValue}>$1.99</Text>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.purchaseButton, isLoading && styles.purchaseButtonDisabled]}
                onPress={handlePurchase}
                disabled={isLoading}
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
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.disclaimer}>{t('purchase.disclaimer')}</Text>
          </View>
        </View>
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
  cancelButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '600',
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


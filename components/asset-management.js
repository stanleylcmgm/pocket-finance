import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { assetManagementStyles } from '../styles/asset-management.styles';
import { useI18n } from '../i18n/i18n';
import AdBanner from './ad-banner';

import { 
  formatCurrency, 
  generateId,
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset as deleteAssetFromDB,
  getAssetCategories,
  createAssetCategory,
  deleteAssetCategory,
  calculateTotalAssets,
  validateAsset,
  ensureAssetCategoriesSeeded
} from '../utils/data-utils';

const AssetManagement = () => {
  const { t } = useI18n();
  const [assetsList, setAssetsList] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  const [assetCategories, setAssetCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Display values for animation
  const [displayTotalAssets, setDisplayTotalAssets] = useState(0);
  const [displayTrackingDelta, setDisplayTrackingDelta] = useState(0);
  const [displayTopCategory1, setDisplayTopCategory1] = useState(0);
  const [displayTopCategory2, setDisplayTopCategory2] = useState(0);
  const [displayTopCategory3, setDisplayTopCategory3] = useState(0);

  // Animated values for the summary card
  const animatedTotalAssets = useRef(new Animated.Value(0)).current;
  const animatedTrackingDelta = useRef(new Animated.Value(0)).current;
  const animatedTopCategory1 = useRef(new Animated.Value(0)).current;
  const animatedTopCategory2 = useRef(new Animated.Value(0)).current;
  const animatedTopCategory3 = useRef(new Animated.Value(0)).current;

  // Track previous values to prevent unnecessary re-animations
  const prevValuesRef = useRef({ total: 0, length: 0 });
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(false);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAsset, setEditingAsset] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    categoryId: '',
    note: '',
  });
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  // Categories management state
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [categoriesVersion, setCategoriesVersion] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('star');
  const [newCategoryColor, setNewCategoryColor] = useState('#6c757d');

  // Load assets from database
  const loadAssets = useCallback(async () => {
    try {
      setIsLoading(true);
      const assets = await getAssets();
      setAssetsList(assets);
      
      // Calculate total assets
      const total = calculateTotalAssets(assets);
      setTotalAssets(total);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load asset categories from database
  const loadAssetCategories = useCallback(async () => {
    try {
      // Ensure asset categories are seeded first
      await ensureAssetCategoriesSeeded();
      const categories = await getAssetCategories();
      setAssetCategories(categories);
    } catch (error) {
      console.error('Error loading asset categories:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToLoadCategories'));
    }
  }, []);

  // Initialize and load data
  useEffect(() => {
    loadAssets();
    loadAssetCategories();
  }, [loadAssets, loadAssetCategories]);

  // Function to trigger animation
  const triggerAnimation = useCallback(() => {
    // Prevent multiple simultaneous animations
    if (isAnimatingRef.current) {
      return () => {};
    }
    
    isAnimatingRef.current = true;
    
    // Access current values from state
    const currentAssets = assetsList;
    const currentTotal = totalAssets;
    const currentCategories = assetCategories;
    
    // Don't animate if categories aren't loaded yet
    if (currentCategories.length === 0 && currentAssets.length > 0) {
      isAnimatingRef.current = false;
      return () => {};
    }
    
    // Calculate top categories and tracking info (same logic as getTopCategories)
    const categoryTotals = {};
    currentAssets.forEach(asset => {
      if (!asset.categoryId) return; // Skip assets without category
      const category = currentCategories.find(cat => cat.id === asset.categoryId);
      if (category) {
        if (categoryTotals[asset.categoryId]) {
          categoryTotals[asset.categoryId].total += asset.amount;
        } else {
          categoryTotals[asset.categoryId] = {
            ...category,
            total: asset.amount
          };
        }
      }
    });
    
    const topCategories = Object.values(categoryTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
    
    // Get tracking info
    const assetWithTracking = currentAssets.find(asset => 
      asset.lastUpdatedDate && asset.currentUpdatedDate && asset.lastTotalAssetsValue
    );
    const trackingDelta = assetWithTracking ? currentTotal - assetWithTracking.lastTotalAssetsValue : 0;
    
    // Calculate category totals - use the sorted order from topCategories
    const category1Total = topCategories.length > 0 ? topCategories[0].total : 0;
    const category2Total = topCategories.length > 1 ? topCategories[1].total : 0;
    const category3Total = topCategories.length > 2 ? topCategories[2].total : 0;

    // Reset animated values to 0
    animatedTotalAssets.setValue(0);
    animatedTrackingDelta.setValue(0);
    animatedTopCategory1.setValue(0);
    animatedTopCategory2.setValue(0);
    animatedTopCategory3.setValue(0);
    setDisplayTotalAssets(0);
    setDisplayTrackingDelta(0);
    setDisplayTopCategory1(0);
    setDisplayTopCategory2(0);
    setDisplayTopCategory3(0);

    // Set up listeners to update display values
    const totalListener = animatedTotalAssets.addListener(({ value }) => {
      setDisplayTotalAssets(value);
    });
    const deltaListener = animatedTrackingDelta.addListener(({ value }) => {
      setDisplayTrackingDelta(value);
    });
    const category1Listener = animatedTopCategory1.addListener(({ value }) => {
      setDisplayTopCategory1(value);
    });
    const category2Listener = animatedTopCategory2.addListener(({ value }) => {
      setDisplayTopCategory2(value);
    });
    const category3Listener = animatedTopCategory3.addListener(({ value }) => {
      setDisplayTopCategory3(value);
    });

    // Start animations
    const animationDuration = 500;
    
    // Also set a timeout to ensure values are set even if animation doesn't complete
    const fallbackTimer = setTimeout(() => {
      setDisplayTopCategory1(category1Total);
      setDisplayTopCategory2(category2Total);
      setDisplayTopCategory3(category3Total);
    }, animationDuration + 100);
    
    Animated.parallel([
      Animated.timing(animatedTotalAssets, {
        toValue: currentTotal,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTrackingDelta, {
        toValue: trackingDelta,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory1, {
        toValue: category1Total,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory2, {
        toValue: category2Total,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory3, {
        toValue: category3Total,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start((finished) => {
      clearTimeout(fallbackTimer);
      isAnimatingRef.current = false;
      if (finished) {
        // Ensure final values are set after animation completes
        setDisplayTotalAssets(currentTotal);
        setDisplayTrackingDelta(trackingDelta);
        setDisplayTopCategory1(category1Total);
        setDisplayTopCategory2(category2Total);
        setDisplayTopCategory3(category3Total);
      }
    });

    // Return cleanup function
    return () => {
      clearTimeout(fallbackTimer);
      isAnimatingRef.current = false;
      animatedTotalAssets.removeListener(totalListener);
      animatedTrackingDelta.removeListener(deltaListener);
      animatedTopCategory1.removeListener(category1Listener);
      animatedTopCategory2.removeListener(category2Listener);
      animatedTopCategory3.removeListener(category3Listener);
    };
  }, [totalAssets, assetsList.length, assetCategories.length]);

  // Trigger animation when screen is focused (navigating back to asset management)
  useFocusEffect(
    useCallback(() => {
      let cleanup = null;
      let timer = null;
      isMountedRef.current = true;
      const loadAndAnimate = async () => {
        await loadAssets();
        // Trigger animation after assets are loaded and screen is focused
        if (isMountedRef.current) {
          timer = setTimeout(() => {
            cleanup = triggerAnimation();
          }, 200);
        }
      };
      loadAndAnimate();
      return () => {
        isMountedRef.current = false;
        if (timer) clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }, [loadAssets, triggerAnimation])
  );

  // Animate stats when values change (for initial load, skip if useFocusEffect already handled it)
  useEffect(() => {
    // Skip if already mounted (useFocusEffect will handle it)
    if (isMountedRef.current) {
      return;
    }
    
    // Only animate if values actually changed
    const totalChanged = prevValuesRef.current.total !== totalAssets;
    const lengthChanged = prevValuesRef.current.length !== assetsList.length;
    
    if ((totalChanged || lengthChanged) && (totalAssets !== 0 || assetsList.length > 0)) {
      prevValuesRef.current.total = totalAssets;
      prevValuesRef.current.length = assetsList.length;
      
      let cleanup = null;
      // Delay to allow data to settle
      const timer = setTimeout(() => {
        cleanup = triggerAnimation();
      }, 300);
      
      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    } else if (totalAssets === 0 && assetsList.length === 0) {
      // No data - set to 0 without animation
      setDisplayTotalAssets(0);
      setDisplayTrackingDelta(0);
      setDisplayTopCategory1(0);
      setDisplayTopCategory2(0);
      setDisplayTopCategory3(0);
    }
  }, [totalAssets, assetsList.length, triggerAnimation]);

  // Asset management
  const openModal = (asset = null) => {
    setEditingAsset(asset);
    
    if (asset) {
      // Edit mode
      setFormData({
        name: asset.name,
        amount: formatAmountForInput(asset.amount),
        categoryId: asset.categoryId,
        note: asset.note || '',
      });
    } else {
      // Add mode
      setFormData({
        name: '',
        amount: '',
        categoryId: '',
        note: '',
      });
    }
    
    setModalVisible(true);
  };

  const saveAsset = async () => {
    if (!formData.name || !formData.amount || !formData.categoryId) {
      Alert.alert(t('common.error'), t('asset.errorFillFields'));
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert(t('common.error'), t('asset.errorAmountGreaterThanZero'));
      return;
    }

    const assetData = {
      name: formData.name.trim(),
      amount: amount,
      categoryId: formData.categoryId,
      note: formData.note?.trim() || null,
    };

    // Validate asset data
    const validationErrors = validateAsset(assetData);
    if (validationErrors.length > 0) {
      Alert.alert(t('asset.validationError'), validationErrors.join('\n'));
      return;
    }

    try {
      if (editingAsset) {
        // Update existing asset
        await updateAsset(editingAsset.id, assetData);
      } else {
        // Create new asset
        await createAsset(assetData);
      }

      setModalVisible(false);
      setEditingAsset(null);
      await loadAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToSave'));
    }
  };

  const deleteAsset = (id) => {
    Alert.alert(
      t('asset.deleteAsset'),
      t('asset.deleteAssetConfirm'),
      [
        { text: t('asset.cancel'), style: 'cancel' },
        {
          text: t('asset.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAssetFromDB(id);
              await loadAssets();
            } catch (error) {
              console.error('Error deleting asset:', error);
              Alert.alert(t('common.error'), t('asset.errorFailedToDelete'));
            }
          },
        },
      ]
    );
  };

  const duplicateAsset = async (asset) => {
    try {
      const duplicatedData = {
        name: `${asset.name} ${t('asset.copy')}`,
        amount: asset.amount,
        categoryId: asset.categoryId,
        note: asset.note,
      };
      await createAsset(duplicatedData);
      await loadAssets();
    } catch (error) {
      console.error('Error duplicating asset:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToDuplicate'));
    }
  };

  // Amount input formatting
  const formatAmountForInput = (value) => {
    const stringValue = String(value ?? '');
    let sanitized = stringValue.replace(/[^0-9.]/g, '');
    const firstDotIndex = sanitized.indexOf('.');
    if (firstDotIndex !== -1) {
      sanitized =
        sanitized.slice(0, firstDotIndex + 1) +
        sanitized.slice(firstDotIndex + 1).replace(/\./g, '');
    }
    let [integerPart, fractionalPart] = sanitized.split('.');
    integerPart = String(parseInt(integerPart || '0', 10) || 0);
    if (fractionalPart !== undefined) {
      fractionalPart = fractionalPart.slice(0, 2);
    }
    const formattedInteger = Number(integerPart).toLocaleString('en-US');
    return `$${formattedInteger}` +
      (fractionalPart !== undefined && fractionalPart.length > 0
        ? `.${fractionalPart}`
        : fractionalPart === ''
        ? '.'
        : '');
  };

  const parseAmountFromInput = (inputText) => {
    const sanitized = (inputText || '').replace(/[^0-9.]/g, '');
    const parts = sanitized.split('.');
    const merged = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : parts[0];
    const value = parseFloat(merged);
    return isNaN(value) ? 0 : value;
  };

  const handleAmountChange = (inputText) => {
    // Keep only digits and a single dot
    let sanitized = inputText.replace(/[^0-9.]/g, '');
    const firstDotIndex = sanitized.indexOf('.');
    if (firstDotIndex !== -1) {
      sanitized =
        sanitized.slice(0, firstDotIndex + 1) +
        sanitized.slice(firstDotIndex + 1).replace(/\./g, '');
    }
    // Split into integer and fraction, limit to 2 decimals
    let [integerPart, fractionalPart] = sanitized.split('.');
    // Remove leading zeros from integer unless it's zero
    if (integerPart) {
      integerPart = String(parseInt(integerPart, 10) || 0);
    } else {
      integerPart = '0';
    }
    if (fractionalPart !== undefined) {
      fractionalPart = fractionalPart.slice(0, 2);
    }
    const formattedInteger = Number(integerPart).toLocaleString('en-US');
    const formatted =
      `$${formattedInteger}` +
      (fractionalPart !== undefined && fractionalPart.length > 0
        ? `.${fractionalPart}`
        : fractionalPart === ''
        ? '.'
        : '');
    setFormData({ ...formData, amount: formatted });
  };

  // Calculate top 3 categories by total amount
  const getTopCategories = () => {
    const categoryTotals = {};
    
    // Calculate total for each category
    assetsList.forEach(asset => {
      if (!asset.categoryId) return; // Skip assets without category
      const category = assetCategories.find(cat => cat.id === asset.categoryId);
      if (category) {
        if (categoryTotals[asset.categoryId]) {
          categoryTotals[asset.categoryId].total += asset.amount;
        } else {
          categoryTotals[asset.categoryId] = {
            ...category,
            total: asset.amount
          };
        }
      }
    });
    
    // Sort by total amount and get top 3
    return Object.values(categoryTotals)
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);
  };

  // Render functions
  const renderSummaryCard = () => {
    const topCategories = getTopCategories();
    
    // Calculate tracking information from assets
    const getTrackingInfo = () => {
      if (assetsList.length === 0) return null;
      
      // Get the most recent tracking data from any asset
      const assetWithTracking = assetsList.find(asset => 
        asset.lastUpdatedDate && asset.currentUpdatedDate && asset.lastTotalAssetsValue
      );
      
      if (!assetWithTracking) return null;
      
      const currentTotal = totalAssets;
      const lastTotal = assetWithTracking.lastTotalAssetsValue;
      const delta = currentTotal - lastTotal;
      
      const lastUpdateDate = new Date(assetWithTracking.lastUpdatedDate);
      const currentUpdateDate = new Date(assetWithTracking.currentUpdatedDate);
      const daysDifference = Math.floor((currentUpdateDate - lastUpdateDate) / (1000 * 60 * 60 * 24));
      
      return {
        delta,
        daysDifference,
        lastTotal,
        lastUpdateDate,
        currentUpdateDate
      };
    };
    
    const trackingInfo = getTrackingInfo();
    
    return (
      <View style={assetManagementStyles.summaryCard}>
        {/* Main Content Row */}
        <View style={assetManagementStyles.summaryMainRow}>
          {/* Left Side - Total Assets */}
          <View style={assetManagementStyles.summaryLeft}>
            <Text style={assetManagementStyles.summaryLabel}>{t('asset.totalAssets')}</Text>
            <Text style={assetManagementStyles.summaryAmount}>
              {formatCurrency(displayTotalAssets)}
            </Text>
          </View>
          
          {/* Right Side - Tracking Info */}
          {trackingInfo && (
            <View style={assetManagementStyles.summaryRight}>
              <View style={assetManagementStyles.trackingRow}>
                <Ionicons 
                  name={trackingInfo.delta >= 0 ? "trending-up" : "trending-down"} 
                  size={14} 
                  color={trackingInfo.delta >= 0 ? '#28a745' : '#dc3545'} 
                />
                <Text style={[
                  assetManagementStyles.trackingValue,
                  { color: trackingInfo.delta >= 0 ? '#28a745' : '#dc3545' }
                ]}>
                  {displayTrackingDelta >= 0 ? '+' : ''}{formatCurrency(displayTrackingDelta)}
                </Text>
              </View>
              <View style={assetManagementStyles.trackingRow}>
                <Ionicons 
                  name="calendar" 
                  size={14} 
                  color="#6c757d" 
                />
                <Text style={assetManagementStyles.trackingValue}>
                  {trackingInfo.daysDifference} {t('asset.days')}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Top Categories */}
        {topCategories.length > 0 && (
          <View style={assetManagementStyles.categoryBreakdown}>
            <Text style={assetManagementStyles.breakdownTitle}>{t('asset.topCategories')}</Text>
            {topCategories.map((category, index) => {
              const displayAmount = index === 0 ? displayTopCategory1 : index === 1 ? displayTopCategory2 : displayTopCategory3;
              return (
                <View key={`top-category-${category.id}-${index}`} style={assetManagementStyles.categoryRow}>
                  <View style={assetManagementStyles.categoryInfo}>
                    <View style={[assetManagementStyles.categoryIcon, { backgroundColor: category.color }]}>
                      <Ionicons name={category.icon} size={12} color="#ffffff" />
                    </View>
                    <Text style={assetManagementStyles.categoryName}>{category.name}</Text>
                  </View>
                  <Text style={assetManagementStyles.categoryAmount}>
                    {formatCurrency(displayAmount)}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    );
  };

  const renderAssetItem = ({ item }) => {
    const category = assetCategories.find(cat => cat.id === item.categoryId);
    
    return (
      <TouchableOpacity
        style={assetManagementStyles.itemCard}
        onPress={() => openModal(item)}
        onLongPress={() => {
          Alert.alert(
            t('asset.assetOptions'),
            t('asset.whatWouldYouLikeToDo'),
            [
              { text: t('asset.edit'), onPress: () => openModal(item) },
              { text: t('asset.duplicate'), onPress: () => duplicateAsset(item) },
              { text: t('asset.delete'), style: 'destructive', onPress: () => deleteAsset(item.id) },
              { text: t('asset.cancel'), style: 'cancel' },
            ]
          );
        }}
      >
        <View style={assetManagementStyles.itemInfo}>
          <View style={assetManagementStyles.itemHeader}>
            <Ionicons 
              name={category?.icon || 'star'} 
              size={20} 
              color={category?.color || '#6c757d'} 
            />
            <Text style={assetManagementStyles.itemTitle}>
              {item.name}
            </Text>
          </View>
          <View style={assetManagementStyles.itemDetails}>
            <Text style={assetManagementStyles.itemCategory}>{category?.name}</Text>
            {item.note && <Text style={assetManagementStyles.itemNote}>• {item.note}</Text>}
          </View>
        </View>
        <View style={assetManagementStyles.itemActions}>
          <Text style={assetManagementStyles.itemAmountText}>
            {formatCurrency(item.amount)}
          </Text>
          <TouchableOpacity
            onPress={() => deleteAsset(item.id)}
            style={assetManagementStyles.deleteButton}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEntryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={assetManagementStyles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={assetManagementStyles.modalContent}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={assetManagementStyles.modalHeader}>
            <Text style={assetManagementStyles.modalTitle}>
              {editingAsset ? t('asset.editAssetTitle') : t('asset.addAssetTitle')}
            </Text>
            <View style={assetManagementStyles.modalHeaderButtons}>
              <TouchableOpacity 
                onPress={() => Keyboard.dismiss()}
                style={assetManagementStyles.keyboardDismissButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="keyboard-outline" size={20} color="#6c757d" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={assetManagementStyles.inputLabel}>{t('asset.assetName')}</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              isNameFocused
                ? assetManagementStyles.inputFocused
                : assetManagementStyles.inputUnfocused,
            ]}
            placeholder={t('asset.enterAssetName')}
            placeholderTextColor="#6c757d"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
            returnKeyType="next"
            onSubmitEditing={() => {
              // Focus on amount field when user presses next
            }}
          />

          <Text style={assetManagementStyles.inputLabel}>{t('asset.amount')}</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              isAmountFocused
                ? assetManagementStyles.inputFocused
                : assetManagementStyles.inputUnfocused,
            ]}
            placeholder={t('asset.enterAmount')}
            placeholderTextColor="#6c757d"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          
          <Text style={assetManagementStyles.inputLabel}>{t('asset.category')}</Text>
          <View style={assetManagementStyles.categoryContainer}>
            {assetCategories.map((category, index) => (
              <TouchableOpacity
                key={`category-${category.id}-${index}`}
                style={[
                  assetManagementStyles.categoryButton,
                  formData.categoryId === category.id && assetManagementStyles.categoryButtonSelected
                ]}
                onPress={() => {
                  const newFormData = { ...formData, categoryId: category.id };
                  // Auto-fill asset name if it's empty
                  if (!formData.name.trim()) {
                    newFormData.name = category.name;
                  }
                  setFormData(newFormData);
                }}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={formData.categoryId === category.id ? 'white' : category.color} 
                />
                <Text style={[
                  assetManagementStyles.categoryButtonText,
                  formData.categoryId === category.id && assetManagementStyles.categoryButtonTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={assetManagementStyles.inputLabel}>{t('asset.description')}</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              assetManagementStyles.inputUnfocused,
            ]}
            placeholder={t('asset.enterDescription')}
            placeholderTextColor="#6c757d"
            value={formData.note}
            onChangeText={(text) => setFormData({ ...formData, note: text })}
            multiline
            numberOfLines={3}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          
          <View style={assetManagementStyles.modalButtons}>
            <TouchableOpacity
              style={[assetManagementStyles.modalButton, assetManagementStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={assetManagementStyles.cancelButtonText}>{t('asset.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[assetManagementStyles.modalButton, assetManagementStyles.saveButton]}
              onPress={saveAsset}
            >
              <Text style={assetManagementStyles.saveButtonText}>{t('asset.save')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );

  const addCategory = async () => {
    const trimmedName = (newCategoryName || '').trim();
    if (!trimmedName) {
      Alert.alert(t('asset.category'), t('asset.pleaseEnterCategoryName'));
      return;
    }
    const exists = assetCategories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      Alert.alert(t('asset.category'), t('asset.categoryAlreadyExists'));
      return;
    }
    
    try {
      const categoryData = {
        name: trimmedName,
        icon: newCategoryIcon || 'star',
        color: newCategoryColor || '#6c757d',
      };
      await createAssetCategory(categoryData);
      setNewCategoryName('');
      setCategoriesVersion((v) => v + 1);
      await loadAssetCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToCreateCategory'));
    }
  };

  const requestDeleteCategory = async (categoryId) => {
    const inUse = assetsList.some((asset) => asset.categoryId === categoryId);
    if (inUse) {
      Alert.alert(t('asset.cannotDelete'), t('asset.categoryInUse'));
      return;
    }
    
    try {
      await deleteAssetCategory(categoryId);
      setCategoriesVersion((v) => v + 1);
      await loadAssetCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      Alert.alert(t('common.error'), t('asset.errorFailedToDeleteCategory'));
    }
  };

  const renderCategoriesModal = () => {
    const iconOptions = ['home', 'library', 'trending-up', 'car', 'briefcase', 'business', 'cash', 'wallet', 'gift', 'diamond', 'star', 'heart'];
    const colorOptions = ['#6c757d', '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', '#ffc107', '#20c997', '#e83e8c', '#17a2b8', '#343a40', '#495057', '#dee2e6', '#6a5acd', '#ff69b4', '#00ced1'];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <View style={assetManagementStyles.modalOverlay}>
          <View style={assetManagementStyles.modalContent}>
            {/* Fixed Header */}
            <View style={assetManagementStyles.modalHeader}>
              <Text style={assetManagementStyles.modalTitle}>{t('asset.manageCategories')}</Text>
              <TouchableOpacity 
                onPress={() => setCategoriesModalVisible(false)}
                style={{ padding: 12, margin: -12 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {/* Scrollable Categories Grid */}
            <View style={{ height: 200, marginBottom: 12 }}>
              <ScrollView
                style={{ height: 200 }}
                contentContainerStyle={[assetManagementStyles.categoryGrid, { padding: 8, flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
              >
                {assetCategories.map((c, index) => (
                  <View key={`category-tile-${c.id}-${index}`} style={assetManagementStyles.categoryTile}>
                    <View style={assetManagementStyles.categoryTileLeft}>
                      <View style={[assetManagementStyles.categoryAvatar, { backgroundColor: c.color }]}>
                        <Ionicons name={c.icon} size={16} color="#ffffff" />
                      </View>
                      <Text style={assetManagementStyles.categoryTileName}>{c.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => requestDeleteCategory(c.id)} style={assetManagementStyles.categoryTileDelete}>
                      <Ionicons name="trash" size={18} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                ))}
                {assetCategories.length === 0 && (
                  <Text style={{ color: '#6c757d' }}>{t('asset.noCategoriesFound')}</Text>
                )}
              </ScrollView>
            </View>

            <View style={assetManagementStyles.divider} />

            <Text style={assetManagementStyles.sectionLabel}>{t('asset.addNewCategory')}</Text>
            <View style={assetManagementStyles.newPreviewRow}>
              <View style={[assetManagementStyles.categoryAvatar, { backgroundColor: newCategoryColor }]}>
                <Ionicons name={newCategoryIcon} size={18} color="#ffffff" />
              </View>
              <Text style={assetManagementStyles.newPreviewText}>{newCategoryName || t('asset.preview')}</Text>
            </View>
            <TextInput
              style={[assetManagementStyles.input, assetManagementStyles.inputUnfocused]}
              placeholder={t('asset.categoryName')}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={assetManagementStyles.inputLabel}>{t('asset.icon')}</Text>
            <View style={assetManagementStyles.categoryContainer}>
              {iconOptions.map((icon, index) => (
                <TouchableOpacity
                  key={`icon-${icon}-${index}`}
                  style={[
                    assetManagementStyles.iconOption,
                    newCategoryIcon === icon && assetManagementStyles.iconOptionSelected,
                  ]}
                  onPress={() => setNewCategoryIcon(icon)}
                >
                  <Ionicons name={icon} size={16} color={newCategoryIcon === icon ? 'white' : '#6c757d'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={assetManagementStyles.inputLabel}>{t('asset.color')}</Text>
            <View style={assetManagementStyles.colorRow}>
              {colorOptions.map((hex, index) => (
                <TouchableOpacity
                  key={`color-${hex}-${index}`}
                  style={[
                    assetManagementStyles.colorSwatch,
                    { backgroundColor: hex },
                    newCategoryColor === hex && assetManagementStyles.colorSwatchSelected,
                  ]}
                  onPress={() => setNewCategoryColor(hex)}
                >
                  {newCategoryColor === hex && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={assetManagementStyles.modalButtons}>
              <TouchableOpacity
                style={[assetManagementStyles.modalButton, assetManagementStyles.cancelButton]}
                onPress={() => setCategoriesModalVisible(false)}
              >
                <Text style={assetManagementStyles.cancelButtonText}>{t('asset.close')}</Text>
              </TouchableOpacity>
                             <TouchableOpacity
                 style={[assetManagementStyles.modalButton, assetManagementStyles.saveButton]}
                 onPress={addCategory}
               >
                 <Text style={assetManagementStyles.saveButtonText}>{t('asset.addCategory')}</Text>
               </TouchableOpacity>
             </View>
           </View>
         </View>
       </Modal>
     );
   };

  if (isLoading) {
    return (
      <View style={[assetManagementStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={assetManagementStyles.topBannerTitle}>{t('asset.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={assetManagementStyles.container}>
      {/* Top Banner */}
      <View style={assetManagementStyles.topBanner}>
        <Text style={assetManagementStyles.topBannerTitle}>{t('asset.title')}</Text>
        <Text style={assetManagementStyles.topBannerSubtitle}>{t('asset.subtitle')}</Text>
      </View>

      {/* Summary Card */}
      <View style={assetManagementStyles.summaryContainer}>
        {renderSummaryCard()}
      </View>

      {/* Add Buttons */}
      <View style={assetManagementStyles.addButtonsContainer}>
        <TouchableOpacity 
          style={[assetManagementStyles.addButton, { backgroundColor: '#28a745' }]} 
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={assetManagementStyles.addButtonText}>{t('asset.addAsset')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[assetManagementStyles.addButton, { backgroundColor: '#007bff' }]}
          onPress={() => setCategoriesModalVisible(true)}
        >
          <Ionicons name="albums" size={20} color="white" />
          <Text style={assetManagementStyles.addButtonText}>{t('asset.categories')}</Text>
        </TouchableOpacity>
      </View>

      {/* Assets List */}
      <ScrollView style={assetManagementStyles.scrollView} showsVerticalScrollIndicator={false}>
        {assetsList.length === 0 ? (
          <View style={assetManagementStyles.emptyState}>
            <Ionicons 
              name="trending-up" 
              size={48} 
              color="#6c757d" 
            />
            <Text style={assetManagementStyles.emptyText}>
              {t('asset.noAssetsRecorded')}
            </Text>
            <TouchableOpacity
              style={[assetManagementStyles.emptyStateButton, { backgroundColor: '#28a745' }]}
              onPress={() => openModal()}
            >
              <Text style={assetManagementStyles.emptyStateButtonText}>
                {t('asset.addYourFirstAsset')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={assetsList}
            renderItem={renderAssetItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Ad Banner at Bottom */}
      <AdBanner position="bottom" />

      {/* Modals */}
      {renderEntryModal()}
      {renderCategoriesModal()}
    </View>
  );
};

export default AssetManagement;

import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { assetManagementStyles } from '../styles/asset-management.styles';

import { 
  formatCurrency, 
  generateId
} from '../utils/data-utils';

// Mock data storage (replace with actual persistence later)
let assets = [
  {
    id: 'asset-1',
    name: 'Primary Residence',
    amount: 450000,
    categoryId: 'cat-property',
    note: 'Family home in downtown',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'asset-2',
    name: 'Savings Account',
    amount: 25000,
    categoryId: 'cat-bank',
    note: 'Emergency fund',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'asset-3',
    name: 'Investment Portfolio',
    amount: 150000,
    categoryId: 'cat-investment',
    note: 'Stock and bond portfolio',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

let assetCategories = [
  {
    id: 'cat-property',
    name: 'Property',
    icon: 'home',
    color: '#28a745',
  },
  {
    id: 'cat-bank',
    name: 'Bank',
    icon: 'card',
    color: '#007bff',
  },
  {
    id: 'cat-investment',
    name: 'Investment',
    icon: 'trending-up',
    color: '#ffc107',
  },
  {
    id: 'cat-vehicle',
    name: 'Vehicle',
    icon: 'car',
    color: '#6c757d',
  },
  {
    id: 'cat-business',
    name: 'Business',
    icon: 'business',
    color: '#6f42c1',
  },
  {
    id: 'cat-other',
    name: 'Other',
    icon: 'ellipsis-horizontal',
    color: '#fd7e14',
  },
];

const AssetManagement = () => {
  const [assetsList, setAssetsList] = useState([]);
  const [totalAssets, setTotalAssets] = useState(0);
  
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
  const [newCategoryIcon, setNewCategoryIcon] = useState('ellipsis-horizontal');
  const [newCategoryColor, setNewCategoryColor] = useState('#6c757d');

  // Load assets
  const loadAssets = useCallback(() => {
    setAssetsList([...assets]);
    
    // Calculate total assets
    const total = assets.reduce((sum, asset) => sum + (asset.amount || 0), 0);
    setTotalAssets(total);
  }, []);

  // Initialize and load data
  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

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

  const saveAsset = () => {
    if (!formData.name || !formData.amount || !formData.categoryId) {
      Alert.alert('Error', 'Please fill in name, amount and category');
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    const asset = {
      id: editingAsset?.id || `asset-${Date.now()}`,
      name: formData.name.trim(),
      amount: amount,
      categoryId: formData.categoryId,
      note: formData.note?.trim() || null,
      createdAt: editingAsset?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editingAsset) {
      // Update existing asset
      const index = assets.findIndex(a => a.id === asset.id);
      if (index !== -1) {
        assets[index] = asset;
      }
    } else {
      // Add new asset
      assets.push(asset);
    }

    setModalVisible(false);
    setEditingAsset(null);
    loadAssets();
  };

  const deleteAsset = (id) => {
    Alert.alert(
      'Delete Asset',
      'Are you sure you want to delete this asset?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            assets = assets.filter(a => a.id !== id);
            loadAssets();
          },
        },
      ]
    );
  };

  const duplicateAsset = (asset) => {
    const duplicated = {
      ...asset,
      id: `asset-${Date.now()}`,
      name: `${asset.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    assets.push(duplicated);
    loadAssets();
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

  // Render functions
  const renderSummaryCard = () => {
    return (
      <View style={assetManagementStyles.summaryCard}>
        <Text style={assetManagementStyles.summaryLabel}>Total Assets</Text>
        <Text style={assetManagementStyles.summaryAmount}>
          {formatCurrency(totalAssets)}
        </Text>
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
            'Asset Options',
            'What would you like to do?',
            [
              { text: 'Edit', onPress: () => openModal(item) },
              { text: 'Duplicate', onPress: () => duplicateAsset(item) },
              { text: 'Delete', style: 'destructive', onPress: () => deleteAsset(item.id) },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}
      >
        <View style={assetManagementStyles.itemInfo}>
          <View style={assetManagementStyles.itemHeader}>
            <Ionicons 
              name={category?.icon || 'help-circle'} 
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={assetManagementStyles.modalOverlay}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={assetManagementStyles.modalContent}>
          <View style={assetManagementStyles.modalHeader}>
            <Text style={assetManagementStyles.modalTitle}>
              {editingAsset ? 'Edit' : 'Add'} Asset
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>
          
          <Text style={assetManagementStyles.inputLabel}>Asset Name *</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              isNameFocused
                ? assetManagementStyles.inputFocused
                : assetManagementStyles.inputUnfocused,
            ]}
            placeholder="e.g., Primary Residence, Savings Account"
            placeholderTextColor="#6c757d"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
          />

          <Text style={assetManagementStyles.inputLabel}>Amount *</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              isAmountFocused
                ? assetManagementStyles.inputFocused
                : assetManagementStyles.inputUnfocused,
            ]}
            placeholder="Enter amount (e.g., 100000.50)"
            placeholderTextColor="#6c757d"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
          />
          
          <Text style={assetManagementStyles.inputLabel}>Category *</Text>
          <View style={assetManagementStyles.categoryContainer}>
            {assetCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  assetManagementStyles.categoryButton,
                  formData.categoryId === category.id && assetManagementStyles.categoryButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, categoryId: category.id })}
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

          <Text style={assetManagementStyles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={[
              assetManagementStyles.input,
              assetManagementStyles.inputUnfocused,
            ]}
            placeholder="e.g., Family home in downtown, Emergency fund"
            placeholderTextColor="#6c757d"
            value={formData.note}
            onChangeText={(text) => setFormData({ ...formData, note: text })}
            multiline
            numberOfLines={3}
          />
          
                     <View style={assetManagementStyles.modalButtons}>
             <TouchableOpacity
               style={[assetManagementStyles.modalButton, assetManagementStyles.cancelButton]}
               onPress={() => setModalVisible(false)}
             >
               <Text style={assetManagementStyles.cancelButtonText}>Cancel</Text>
             </TouchableOpacity>
             <TouchableOpacity
               style={[assetManagementStyles.modalButton, assetManagementStyles.saveButton]}
               onPress={saveAsset}
             >
               <Text style={assetManagementStyles.saveButtonText}>Save</Text>
             </TouchableOpacity>
           </View>
         </View>
         </TouchableWithoutFeedback>
       </KeyboardAvoidingView>
       </TouchableWithoutFeedback>
     </Modal>
   );

  const addCategory = () => {
    const trimmedName = (newCategoryName || '').trim();
    if (!trimmedName) {
      Alert.alert('Category', 'Please enter a category name.');
      return;
    }
    const exists = assetCategories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      Alert.alert('Category', 'A category with this name already exists.');
      return;
    }
    const created = {
      id: `cat-${generateId()}`,
      name: trimmedName,
      icon: newCategoryIcon || 'ellipsis-horizontal',
      color: newCategoryColor || '#6c757d',
    };
    assetCategories.push(created);
    setNewCategoryName('');
    setCategoriesVersion((v) => v + 1);
  };

  const requestDeleteCategory = (categoryId) => {
    const inUse = assets.some((asset) => asset.categoryId === categoryId);
    if (inUse) {
      Alert.alert('Cannot Delete', 'This category is used by existing assets.');
      return;
    }
    assetCategories = assetCategories.filter((c) => c.id !== categoryId);
    setCategoriesVersion((v) => v + 1);
  };

  const renderCategoriesModal = () => {
    const iconOptions = ['home', 'card', 'trending-up', 'car', 'business', 'ellipsis-horizontal', 'building', 'cash', 'wallet', 'gift'];
    const colorOptions = ['#6c757d', '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', '#ffc107', '#20c997'];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={assetManagementStyles.modalOverlay}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={assetManagementStyles.modalContent}>
            <View style={assetManagementStyles.modalHeader}>
              <Text style={assetManagementStyles.modalTitle}>Manage Asset Categories</Text>
              <TouchableOpacity onPress={() => setCategoriesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            {/* Existing categories grid */}
            <View style={assetManagementStyles.categoryGridFixed}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={assetManagementStyles.categoryGrid}
              >
                {assetCategories.map((c) => (
                  <View key={c.id} style={assetManagementStyles.categoryTile}>
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
                  <Text style={{ color: '#6c757d' }}>No categories found.</Text>
                )}
              </ScrollView>
            </View>

            <View style={assetManagementStyles.divider} />

            <Text style={assetManagementStyles.sectionLabel}>Add New Category</Text>
            <View style={assetManagementStyles.newPreviewRow}>
              <View style={[assetManagementStyles.categoryAvatar, { backgroundColor: newCategoryColor }]}>
                <Ionicons name={newCategoryIcon} size={18} color="#ffffff" />
              </View>
              <Text style={assetManagementStyles.newPreviewText}>{newCategoryName || 'Preview'}</Text>
            </View>
            <TextInput
              style={[assetManagementStyles.input, assetManagementStyles.inputUnfocused]}
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={assetManagementStyles.inputLabel}>Icon</Text>
            <View style={assetManagementStyles.categoryContainer}>
              {iconOptions.map((icon) => (
                <TouchableOpacity
                  key={icon}
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

            <Text style={assetManagementStyles.inputLabel}>Color</Text>
            <View style={assetManagementStyles.colorRow}>
              {colorOptions.map((hex) => (
                <TouchableOpacity
                  key={hex}
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
                <Text style={assetManagementStyles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
                             <TouchableOpacity
                 style={[assetManagementStyles.modalButton, assetManagementStyles.saveButton]}
                 onPress={addCategory}
               >
                 <Text style={assetManagementStyles.saveButtonText}>Add Category</Text>
               </TouchableOpacity>
             </View>
           </View>
           </TouchableWithoutFeedback>
         </View>
         </TouchableWithoutFeedback>
       </Modal>
     );
   };

  return (
    <View style={assetManagementStyles.container}>
      {/* Top Banner */}
      <View style={assetManagementStyles.topBanner}>
        <Text style={assetManagementStyles.topBannerTitle}>Asset Management</Text>
        <Text style={assetManagementStyles.topBannerSubtitle}>Track your valuable assets</Text>
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
          <Text style={assetManagementStyles.addButtonText}>Add Asset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[assetManagementStyles.addButton, { backgroundColor: '#007bff' }]}
          onPress={() => setCategoriesModalVisible(true)}
        >
          <Ionicons name="albums" size={20} color="white" />
          <Text style={assetManagementStyles.addButtonText}>Categories</Text>
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
              No assets recorded yet
            </Text>
            <TouchableOpacity
              style={[assetManagementStyles.emptyStateButton, { backgroundColor: '#28a745' }]}
              onPress={() => openModal()}
            >
              <Text style={assetManagementStyles.emptyStateButtonText}>
                Add Your First Asset
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

      {/* Modals */}
      {renderEntryModal()}
      {renderCategoriesModal()}
    </View>
  );
};

export default AssetManagement;

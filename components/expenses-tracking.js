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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { expensesTrackingStyles } from '../styles/expenses-tracking.styles';
import CustomDatePicker from './datepicker';

import { 
  formatCurrency, 
  toMonthKey, 
  getMonthStartEnd, 
  sortTransactions, 
  filterTransactionsByMonth,
  getCategories,
  generateId
} from '../utils/data-utils';

// Mock data storage (replace with actual persistence later)
let expenses = [];

const ExpensesTracking = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthKey, setMonthKey] = useState(toMonthKey(new Date()));
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  
  // Database data state
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    amount: '',
    date: new Date(),
    description: '',
  });
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);

  // Categories management state
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [categoriesVersion, setCategoriesVersion] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('pricetag');
  const [newCategoryColor, setNewCategoryColor] = useState('#6c757d');

  // Month picker state
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Date Picker state
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [tempFormData, setTempFormData] = useState(null); // Store form data while date picker is open

  // Load categories from database
  const loadCategoriesFromDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const allCategories = await getCategories();
      const expenseCategoriesData = allCategories.filter(cat => cat.type === 'expense');
      setExpenseCategories(expenseCategoriesData);
    } catch (error) {
      console.error('Error loading categories from database:', error);
      Alert.alert('Error', 'Failed to load categories from database');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load expenses for current month
  const loadMonthlyExpenses = useCallback(() => {
    const monthExpenses = filterTransactionsByMonth(expenses, monthKey);
    const sortedExpenses = sortTransactions(monthExpenses);
    
    setMonthlyExpenses(sortedExpenses);
    
    // Calculate total
    const total = sortedExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
    setMonthlyTotal(total);
  }, [monthKey]);

  // Initialize and load data
  useEffect(() => {
    loadCategoriesFromDatabase();
    loadMonthlyExpenses();
  }, [loadCategoriesFromDatabase, loadMonthlyExpenses]);

  // Navigation functions
  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentMonth(newDate);
    setMonthKey(toMonthKey(newDate));
  };

  const openMonthPicker = () => {
    setSelectedYear(currentMonth.getFullYear());
    setSelectedMonth(currentMonth.getMonth());
    setMonthPickerVisible(true);
  };

  const selectMonth = (year, month) => {
    const newDate = new Date(year, month, 1);
    setCurrentMonth(newDate);
    setMonthKey(toMonthKey(newDate));
    setMonthPickerVisible(false);
  };

  // Date Picker functions
  const openDatePicker = () => {
    // Store the current form data and close the expense modal
    setTempFormData({
      ...formData,
      editingExpense: editingExpense
    });
    setModalVisible(false);
    
    // Small delay to ensure modal is closed before opening date picker
    setTimeout(() => {
      setDatePickerVisible(true);
    }, 300);
  };

  const handleDateSelect = (selectedDate) => {
    console.log('Date selected:', selectedDate);
    
    // Update the form data with the selected date
    if (tempFormData) {
      setFormData({
        ...tempFormData,
        date: selectedDate
      });
      setEditingExpense(tempFormData.editingExpense);
    }
    
    // Close date picker and reopen expense modal
    setDatePickerVisible(false);
    setTimeout(() => {
      setModalVisible(true);
      setTempFormData(null);
    }, 300);
  };

  const handleDatePickerClose = () => {
    // Restore form data and reopen expense modal without changing the date
    if (tempFormData) {
      setFormData(tempFormData);
      setEditingExpense(tempFormData.editingExpense);
    }
    
    setDatePickerVisible(false);
    setTimeout(() => {
      setModalVisible(true);
      setTempFormData(null);
    }, 300);
  };

  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Expense management
  const openModal = (expense = null) => {
    setEditingExpense(expense);
    
    if (expense) {
      // Edit mode
      setFormData({
        name: expense.note || '',
        categoryId: expense.categoryId,
        amount: formatAmountForInput(expense.amountOriginal),
        date: new Date(expense.date),
        description: expense.description || '',
      });
    } else {
      // Add mode - use current month being viewed
      setFormData({
        name: '',
        categoryId: '',
        amount: '',
        date: currentMonth,
        description: '',
      });
    }
    
    setModalVisible(true);
  };

  const saveExpense = () => {
    if (!formData.name || !formData.categoryId || !formData.amount) {
      Alert.alert('Error', 'Please fill in name, category, and amount');
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    const expense = {
      id: editingExpense?.id || `exp-${Date.now()}`,
      type: 'expense',
      amountOriginal: amount,
      currencyCode: 'USD',
      amountConverted: amount,
      fxRateToBase: null,
      categoryId: formData.categoryId,
      accountId: null,
      note: formData.name,
      description: formData.description || null,
      date: formData.date.toISOString(),
      createdAt: editingExpense?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachmentUris: [],
    };

    if (editingExpense) {
      // Update existing expense
      const index = expenses.findIndex(exp => exp.id === expense.id);
      if (index !== -1) {
        expenses[index] = expense;
      }
    } else {
      // Add new expense
      expenses.push(expense);
    }

    setModalVisible(false);
    setEditingExpense(null);
    loadMonthlyExpenses();
  };

  const deleteExpense = (id) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            expenses = expenses.filter(exp => exp.id !== id);
            loadMonthlyExpenses();
          },
        },
      ]
    );
  };

  const duplicateExpense = (expense) => {
    const duplicated = {
      ...expense,
      id: `exp-${Date.now()}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expenses.push(duplicated);
    loadMonthlyExpenses();
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
    let sanitized = inputText.replace(/[^0-9.]/g, '');
    const firstDotIndex = sanitized.indexOf('.');
    if (firstDotIndex !== -1) {
      sanitized =
        sanitized.slice(0, firstDotIndex + 1) +
        sanitized.slice(firstDotIndex + 1).replace(/\./g, '');
    }
    let [integerPart, fractionalPart] = sanitized.split('.');
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
      <View style={expensesTrackingStyles.summaryCard}>
        <Text style={expensesTrackingStyles.summaryLabel}>Total Expenses</Text>
        <Text style={expensesTrackingStyles.summaryAmount}>
          {formatCurrency(monthlyTotal)}
        </Text>
        <Text style={expensesTrackingStyles.summarySubtext}>
          {monthlyExpenses.length} expense{monthlyExpenses.length !== 1 ? 's' : ''} this month
        </Text>
      </View>
    );
  };

  const renderExpenseItem = ({ item }) => {
    const category = expenseCategories.find(cat => cat.id === item.categoryId);
    const expenseDate = new Date(item.date);
    const isToday = expenseDate.toDateString() === new Date().toDateString();
    
    return (
      <TouchableOpacity
        style={expensesTrackingStyles.itemCard}
        onPress={() => openModal(item)}
        onLongPress={() => {
          Alert.alert(
            'Expense Options',
            'What would you like to do?',
            [
              { text: 'Edit', onPress: () => openModal(item) },
              { text: 'Duplicate', onPress: () => duplicateExpense(item) },
              { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(item.id) },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}
      >
        <View style={expensesTrackingStyles.itemInfo}>
          <View style={expensesTrackingStyles.itemHeader}>
            <Ionicons 
              name={category?.icon || 'help-circle'} 
              size={20} 
              color={category?.color || '#6c757d'} 
            />
            <Text style={expensesTrackingStyles.itemTitle}>
              {item.note || 'Untitled Expense'}
            </Text>
            {isToday && (
              <View style={expensesTrackingStyles.todayBadge}>
                <Text style={expensesTrackingStyles.todayBadgeText}>Today</Text>
              </View>
            )}
          </View>
          <View style={expensesTrackingStyles.itemDetails}>
            <Text style={expensesTrackingStyles.itemCategory}>{category?.name}</Text>
            <Text style={expensesTrackingStyles.itemDate}>
              {expenseDate.toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: expenseDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
              })}
            </Text>
          </View>
          {item.description && (
            <Text style={expensesTrackingStyles.itemDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
        <View style={expensesTrackingStyles.itemActions}>
          <Text style={expensesTrackingStyles.itemAmountText}>
            {formatCurrency(item.amountConverted)}
          </Text>
          <TouchableOpacity
            onPress={() => deleteExpense(item.id)}
            style={expensesTrackingStyles.deleteButton}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMonthPicker = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={monthPickerVisible}
      onRequestClose={() => setMonthPickerVisible(false)}
    >
      <View style={expensesTrackingStyles.modalOverlay}>
        <View style={expensesTrackingStyles.monthPickerContent}>
          <Text style={expensesTrackingStyles.monthPickerTitle}>Select Month</Text>
          
          <View style={expensesTrackingStyles.yearSelector}>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
              <Ionicons name="chevron-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={expensesTrackingStyles.yearText}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
              <Ionicons name="chevron-forward" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
          
          <View style={expensesTrackingStyles.monthGrid}>
            {Array.from({ length: 12 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  expensesTrackingStyles.monthButton,
                  selectedMonth === i && expensesTrackingStyles.monthButtonSelected
                ]}
                onPress={() => selectMonth(selectedYear, i)}
              >
                <Text style={[
                  expensesTrackingStyles.monthButtonText,
                  selectedMonth === i && expensesTrackingStyles.monthButtonTextSelected
                ]}>
                  {new Date(2000, i).toLocaleString('default', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={expensesTrackingStyles.cancelButton}
            onPress={() => setMonthPickerVisible(false)}
          >
            <Text style={expensesTrackingStyles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderEntryModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity
        style={expensesTrackingStyles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={expensesTrackingStyles.modalContent}
        >
          <View style={expensesTrackingStyles.modalHeader}>
            <Text style={expensesTrackingStyles.modalTitle}>
              {editingExpense ? 'Edit' : 'Add'} Expense
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>
          
          <Text style={expensesTrackingStyles.inputLabel}>Expense Name *</Text>
          <TextInput
            style={[
              expensesTrackingStyles.input,
              isNameFocused
                ? expensesTrackingStyles.inputFocused
                : expensesTrackingStyles.inputUnfocused,
            ]}
            placeholder="e.g., Grocery Shopping, Coffee, Gas"
            placeholderTextColor="#6c757d"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            onFocus={() => setIsNameFocused(true)}
            onBlur={() => setIsNameFocused(false)}
          />

          <Text style={expensesTrackingStyles.inputLabel}>Amount *</Text>
          <TextInput
            style={[
              expensesTrackingStyles.input,
              isAmountFocused
                ? expensesTrackingStyles.inputFocused
                : expensesTrackingStyles.inputUnfocused,
            ]}
            placeholder="Enter amount (e.g., 25.50)"
            placeholderTextColor="#6c757d"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
          />

          <Text style={expensesTrackingStyles.inputLabel}>Date *</Text>
          <TouchableOpacity
            style={[
              expensesTrackingStyles.input,
              expensesTrackingStyles.dateInput,
              expensesTrackingStyles.inputUnfocused,
            ]}
            onPress={openDatePicker}
          >
            <Text style={expensesTrackingStyles.dateInputText}>
              {formatDateForDisplay(formData.date)}
            </Text>
            <Ionicons name="calendar" size={20} color="#6c757d" />
          </TouchableOpacity>
          
          <Text style={expensesTrackingStyles.inputLabel}>Category *</Text>
          <View style={expensesTrackingStyles.categoryContainer}>
            {expenseCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  expensesTrackingStyles.categoryButton,
                  formData.categoryId === category.id && expensesTrackingStyles.categoryButtonSelected
                ]}
                onPress={() => setFormData({ ...formData, categoryId: category.id })}
              >
                <Ionicons 
                  name={category.icon} 
                  size={16} 
                  color={formData.categoryId === category.id ? 'white' : category.color} 
                />
                <Text style={[
                  expensesTrackingStyles.categoryButtonText,
                  formData.categoryId === category.id && expensesTrackingStyles.categoryButtonTextSelected
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={expensesTrackingStyles.inputLabel}>Description (Optional)</Text>
          <TextInput
            style={[
              expensesTrackingStyles.input,
              expensesTrackingStyles.textArea,
              isDescriptionFocused
                ? expensesTrackingStyles.inputFocused
                : expensesTrackingStyles.inputUnfocused,
            ]}
            placeholder="Add any additional details..."
            placeholderTextColor="#6c757d"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            multiline
            numberOfLines={3}
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
          />
          
          <View style={expensesTrackingStyles.modalButtons}>
            <TouchableOpacity
              style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={expensesTrackingStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.saveButton]}
              onPress={saveExpense}
            >
              <Text style={expensesTrackingStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );

  const addCategory = () => {
    const trimmedName = (newCategoryName || '').trim();
    if (!trimmedName) {
      Alert.alert('Category', 'Please enter a category name.');
      return;
    }
    const exists = expenseCategories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      Alert.alert('Category', 'A category with this name already exists.');
      return;
    }
    const created = {
      id: `cat-${generateId()}`,
      name: trimmedName,
      type: 'expense',
      icon: newCategoryIcon || 'pricetag',
      color: newCategoryColor || '#6c757d',
    };
    expenseCategories.push(created);
    setNewCategoryName('');
    setCategoriesVersion((v) => v + 1);
  };

  const requestDeleteCategory = (categoryId) => {
    const inUse = expenses.some((exp) => exp.categoryId === categoryId);
    if (inUse) {
      Alert.alert('Cannot Delete', 'This category is used by existing expenses.');
      return;
    }
    expenseCategories = expenseCategories.filter((c) => c.id !== categoryId);
    setCategoriesVersion((v) => v + 1);
  };

  const renderCategoriesModal = () => {
    const iconOptions = ['restaurant', 'cart', 'car', 'home', 'heart', 'game-controller', 'medical', 'bag', 'document-text', 'pricetag'];
    const colorOptions = ['#6c757d', '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', '#ffc107', '#20c997', '#e83e8c', '#17a2b8', '#343a40', '#495057', '#dee2e6', '#6a5acd'];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <TouchableOpacity
          style={expensesTrackingStyles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            Keyboard.dismiss();
          }}
        >
          <View style={expensesTrackingStyles.modalContent}>
            <View style={expensesTrackingStyles.modalHeader}>
              <Text style={expensesTrackingStyles.modalTitle}>Manage Categories</Text>
              <TouchableOpacity onPress={() => setCategoriesModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6c757d" />
              </TouchableOpacity>
            </View>

            <View style={expensesTrackingStyles.categoryGridFixed}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                contentContainerStyle={expensesTrackingStyles.categoryGrid}
              >
                {expenseCategories.map((c) => (
                  <View key={c.id} style={expensesTrackingStyles.categoryTile}>
                    <View style={expensesTrackingStyles.categoryTileLeft}>
                      <View style={[expensesTrackingStyles.categoryAvatar, { backgroundColor: c.color }]}>
                        <Ionicons name={c.icon} size={16} color="#ffffff" />
                      </View>
                      <Text style={expensesTrackingStyles.categoryTileName}>{c.name}</Text>
                    </View>
                    <TouchableOpacity onPress={() => requestDeleteCategory(c.id)} style={expensesTrackingStyles.categoryTileDelete}>
                      <Ionicons name="trash" size={18} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                ))}
                {expenseCategories.length === 0 && (
                  <Text style={{ color: '#6c757d' }}>No categories found.</Text>
                )}
              </ScrollView>
            </View>

            <View style={expensesTrackingStyles.divider} />

            <Text style={expensesTrackingStyles.sectionLabel}>Add New Category</Text>
            <View style={expensesTrackingStyles.newPreviewRow}>
              <View style={[expensesTrackingStyles.categoryAvatar, { backgroundColor: newCategoryColor }]}>
                <Ionicons name={newCategoryIcon} size={18} color="#ffffff" />
              </View>
              <Text style={expensesTrackingStyles.newPreviewText}>{newCategoryName || 'Preview'}</Text>
            </View>
            <TextInput
              style={[expensesTrackingStyles.input, expensesTrackingStyles.inputUnfocused]}
              placeholder="Category name"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={expensesTrackingStyles.inputLabel}>Icon</Text>
            <View style={expensesTrackingStyles.categoryContainer}>
              {iconOptions.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    expensesTrackingStyles.iconOption,
                    newCategoryIcon === icon && expensesTrackingStyles.iconOptionSelected,
                  ]}
                  onPress={() => setNewCategoryIcon(icon)}
                >
                  <Ionicons name={icon} size={16} color={newCategoryIcon === icon ? 'white' : '#6c757d'} />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={expensesTrackingStyles.inputLabel}>Color</Text>
            <View style={expensesTrackingStyles.colorRow}>
              {colorOptions.map((hex) => (
                <TouchableOpacity
                  key={hex}
                  style={[
                    expensesTrackingStyles.colorSwatch,
                    { backgroundColor: hex },
                    newCategoryColor === hex && expensesTrackingStyles.colorSwatchSelected,
                  ]}
                  onPress={() => setNewCategoryColor(hex)}
                >
                  {newCategoryColor === hex && (
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={expensesTrackingStyles.modalButtons}>
              <TouchableOpacity
                style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.cancelButton]}
                onPress={() => setCategoriesModalVisible(false)}
              >
                <Text style={expensesTrackingStyles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.saveButton]}
                onPress={addCategory}
              >
                <Text style={expensesTrackingStyles.saveButtonText}>Add Category</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <View style={[expensesTrackingStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>Loading data...</Text>
      </View>
    );
  }

  return (
    <View style={expensesTrackingStyles.container}>
      {/* Top Banner */}
      <View style={expensesTrackingStyles.topBanner}>
        <Text style={expensesTrackingStyles.topBannerTitle}>Expenses Tracking</Text>
        <Text style={expensesTrackingStyles.topBannerSubtitle}>Track your daily expenses</Text>
      </View>

      {/* Month Navigator */}
      <View style={expensesTrackingStyles.monthNavigator}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={expensesTrackingStyles.monthButton}>
          <Ionicons name="chevron-back" size={24} color="#007bff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openMonthPicker} style={expensesTrackingStyles.monthSelector}>
          <Ionicons name="calendar" size={20} color="#6c757d" />
          <Text style={expensesTrackingStyles.monthText}>
            {currentMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6c757d" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth('next')} style={expensesTrackingStyles.monthButton}>
          <Ionicons name="chevron-forward" size={24} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Summary Card */}
      <View style={expensesTrackingStyles.summaryContainer}>
        {renderSummaryCard()}
      </View>

      {/* Add Buttons */}
      <View style={expensesTrackingStyles.addButtonsContainer}>
        <TouchableOpacity 
          style={[expensesTrackingStyles.addButton, { backgroundColor: '#dc3545' }]} 
          onPress={() => openModal()}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={expensesTrackingStyles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[expensesTrackingStyles.addButton, { backgroundColor: '#007bff' }]}
          onPress={() => setCategoriesModalVisible(true)}
        >
          <Ionicons name="albums" size={20} color="white" />
          <Text style={expensesTrackingStyles.addButtonText}>Categories</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <ScrollView style={expensesTrackingStyles.scrollView} showsVerticalScrollIndicator={false}>
        {monthlyExpenses.length === 0 ? (
          <View style={expensesTrackingStyles.emptyState}>
            <Ionicons name="receipt" size={48} color="#6c757d" />
            <Text style={expensesTrackingStyles.emptyText}>
              No expenses recorded yet for this month
            </Text>
            <TouchableOpacity
              style={[expensesTrackingStyles.emptyStateButton, { backgroundColor: '#dc3545' }]}
              onPress={() => openModal()}
            >
              <Text style={expensesTrackingStyles.emptyStateButtonText}>
                Add Your First Expense
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={monthlyExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Modals */}
      {renderEntryModal()}
      {renderMonthPicker()}
      {renderCategoriesModal()}
      
      {/* Date Picker Modal - Now opened when expense modal is closed */}
      <CustomDatePicker
        visible={datePickerVisible}
        onClose={handleDatePickerClose}
        onDateSelect={handleDateSelect}
        initialDate={tempFormData?.date || formData.date}
      />
    </View>
  );
};

export default ExpensesTracking;
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
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { expensesTrackingStyles } from '../styles/expenses-tracking.styles';
import CustomDatePicker from './datepicker';
import { useI18n } from '../i18n/i18n';
import AdBanner from './ad-banner';

import { 
  formatCurrency, 
  toMonthKey, 
  getMonthStartEnd, 
  sortTransactions, 
  filterTransactionsByMonth,
  getCategories,
  generateId
} from '../utils/data-utils';

import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense as removeExpense,
  getExpensesByMonth
} from '../utils/expenses-data';

const ExpensesTracking = () => {
  const { t } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthKey, setMonthKey] = useState(toMonthKey(new Date()));
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);

  // Display values for animation
  const [displayTotal, setDisplayTotal] = useState(0);
  const [displayDailyAverage, setDisplayDailyAverage] = useState(0);
  const [displayTopCategory1, setDisplayTopCategory1] = useState(0);
  const [displayTopCategory2, setDisplayTopCategory2] = useState(0);

  // Animated values for the summary card
  const animatedTotal = useRef(new Animated.Value(0)).current;
  const animatedDailyAverage = useRef(new Animated.Value(0)).current;
  const animatedTopCategory1 = useRef(new Animated.Value(0)).current;
  const animatedTopCategory2 = useRef(new Animated.Value(0)).current;
  
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
      // Only show daily expense categories for Expenses Tracking
      const expenseCategoriesData = allCategories.filter(cat => 
        cat.type === 'expense' && cat.subtype === 'daily'
      );
      setExpenseCategories(expenseCategoriesData);
    } catch (error) {
      console.error('Error loading categories from database:', error);
      Alert.alert(t('common.error'), t('expenses.errorFailedToLoadCategories'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Group expenses by date
  const groupExpensesByDate = useCallback((expenses) => {
    const grouped = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const dateKey = date.toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          date: date,
          expenses: []
        };
      }
      grouped[dateKey].expenses.push(expense);
    });
    
    // Convert to array and sort by date (newest first)
    return Object.values(grouped).sort((a, b) => b.date - a.date);
  }, []);

  // Load expenses for current month
  const loadMonthlyExpenses = useCallback(async (overrideMonthKey = null) => {
    try {
      const targetMonthKey = overrideMonthKey || monthKey;
      const allExpenses = await getExpenses();
      const monthExpenses = filterTransactionsByMonth(allExpenses, targetMonthKey);
      const sortedExpenses = sortTransactions(monthExpenses);
      
      setMonthlyExpenses(sortedExpenses);
      
      // Calculate total
      const total = sortedExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
      setMonthlyTotal(total);
    } catch (error) {
      console.error('Error loading expenses:', error);
      Alert.alert(t('common.error'), t('expenses.errorFailedToLoad'));
    }
  }, [monthKey]);

  // Initialize and load data
  useEffect(() => {
    const loadData = async () => {
      await loadCategoriesFromDatabase();
      await loadMonthlyExpenses();
    };
    loadData();
  }, [loadCategoriesFromDatabase, loadMonthlyExpenses]);

  // Function to trigger animation
  const triggerAnimation = useCallback(() => {
    // Access current values from state
    const currentExpenses = monthlyExpenses;
    const currentTotal = monthlyTotal;
    const currentCategories = expenseCategories;
    
    // Calculate top categories directly (same logic as getTopCategories)
    const categoryTotals = {};
    currentExpenses.forEach(expense => {
      const categoryId = expense.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += expense.amountConverted || 0;
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([categoryId, total]) => ({
        categoryId,
        total,
        category: currentCategories.find(cat => cat.id === categoryId)
      }))
      .filter(item => item.category)
      .sort((a, b) => b.total - a.total)
      .slice(0, 2);

    const uniqueDays = new Set(currentExpenses.map(expense => new Date(expense.date).toDateString())).size;
    const averageDaily = uniqueDays > 0 ? currentTotal / uniqueDays : 0;
    const category1Total = topCategories.length > 0 ? topCategories[0].total : 0;
    const category2Total = topCategories.length > 1 ? topCategories[1].total : 0;

    // Reset animated values to 0
    animatedTotal.setValue(0);
    animatedDailyAverage.setValue(0);
    animatedTopCategory1.setValue(0);
    animatedTopCategory2.setValue(0);
    setDisplayTotal(0);
    setDisplayDailyAverage(0);
    setDisplayTopCategory1(0);
    setDisplayTopCategory2(0);

    // Set up listeners to update display values
    const totalListener = animatedTotal.addListener(({ value }) => {
      setDisplayTotal(value);
    });
    const averageListener = animatedDailyAverage.addListener(({ value }) => {
      setDisplayDailyAverage(value);
    });
    const category1Listener = animatedTopCategory1.addListener(({ value }) => {
      setDisplayTopCategory1(value);
    });
    const category2Listener = animatedTopCategory2.addListener(({ value }) => {
      setDisplayTopCategory2(value);
    });

    // Start animations
    const animationDuration = 500;
    const animations = [
      Animated.timing(animatedTotal, {
        toValue: currentTotal,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedDailyAverage, {
        toValue: averageDaily,
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
    ];

    Animated.parallel(animations).start((finished) => {
      // Ensure final values are set
      setDisplayTotal(currentTotal);
      setDisplayDailyAverage(averageDaily);
      setDisplayTopCategory1(category1Total);
      setDisplayTopCategory2(category2Total);
    });

    // Return cleanup function
    return () => {
      animatedTotal.removeListener(totalListener);
      animatedDailyAverage.removeListener(averageListener);
      animatedTopCategory1.removeListener(category1Listener);
      animatedTopCategory2.removeListener(category2Listener);
    };
  }, [monthlyTotal, monthlyExpenses.length, expenseCategories.length, animatedTotal, animatedDailyAverage, animatedTopCategory1, animatedTopCategory2]);

  // Track previous values to prevent unnecessary re-animations
  const prevValuesRef = useRef({ total: 0, length: 0 });

  // Trigger animation when screen is focused
  useFocusEffect(
    useCallback(() => {
      let cleanup = null;
      const loadAndAnimate = async () => {
        await loadMonthlyExpenses();
        setTimeout(() => {
          cleanup = triggerAnimation();
        }, 150);
      };
      loadAndAnimate();
      return () => {
        if (cleanup) cleanup();
      };
    }, [loadMonthlyExpenses, triggerAnimation])
  );

  // Animate stats when values change
  useEffect(() => {
    // Only animate if values actually changed
    const totalChanged = prevValuesRef.current.total !== monthlyTotal;
    const lengthChanged = prevValuesRef.current.length !== monthlyExpenses.length;
    
    if ((totalChanged || lengthChanged) && (monthlyTotal !== 0 || monthlyExpenses.length > 0)) {
      prevValuesRef.current.total = monthlyTotal;
      prevValuesRef.current.length = monthlyExpenses.length;
      
      let cleanup = null;
      const timer = setTimeout(() => {
        cleanup = triggerAnimation();
      }, 250);
      
      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    } else if (monthlyTotal === 0 && monthlyExpenses.length === 0) {
      // No data - set to 0
      setDisplayTotal(0);
      setDisplayDailyAverage(0);
      setDisplayTopCategory1(0);
      setDisplayTopCategory2(0);
    }
  }, [monthlyTotal, monthlyExpenses.length, triggerAnimation]);

  // Navigation functions
  const changeMonth = async (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    const newMonthKey = toMonthKey(newDate);
    setCurrentMonth(newDate);
    setMonthKey(newMonthKey);
    // Reload expenses for the new month immediately
    await loadMonthlyExpenses(newMonthKey);
  };

  const openMonthPicker = () => {
    setSelectedYear(currentMonth.getFullYear());
    setSelectedMonth(currentMonth.getMonth());
    setMonthPickerVisible(true);
  };

  const selectMonth = async (year, month) => {
    const newDate = new Date(year, month, 1);
    const newMonthKey = toMonthKey(newDate);
    setCurrentMonth(newDate);
    setMonthKey(newMonthKey);
    setMonthPickerVisible(false);
    // Reload expenses for the new month immediately
    await loadMonthlyExpenses(newMonthKey);
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

  const saveExpense = async () => {
    if (!formData.name || !formData.categoryId || !formData.amount) {
      Alert.alert(t('common.error'), t('expenses.errorFillFields'));
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert(t('common.error'), t('expenses.errorAmountGreaterThanZero'));
      return;
    }

    try {
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
        await updateExpense(expense.id, expense);
      } else {
        // Add new expense
        await addExpense(expense);
      }

      setModalVisible(false);
      setEditingExpense(null);
      await loadMonthlyExpenses();
    } catch (error) {
      console.error('Error saving expense:', error);
      Alert.alert(t('common.error'), t('expenses.errorFailedToSave'));
    }
  };

  const deleteExpense = (id) => {
    Alert.alert(
      t('expenses.deleteExpense'),
      t('expenses.deleteExpenseConfirm'),
      [
              { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('expenses.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await removeExpense(id);
              await loadMonthlyExpenses();
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert(t('common.error'), t('expenses.errorFailedToDelete'));
            }
          },
        },
      ]
    );
  };

  const duplicateExpense = async (expense) => {
    try {
      const duplicated = {
        ...expense,
        id: `exp-${Date.now()}`,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await addExpense(duplicated);
      await loadMonthlyExpenses();
    } catch (error) {
      console.error('Error duplicating expense:', error);
      Alert.alert(t('common.error'), t('expenses.errorFailedToDuplicate'));
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
  const renderDateHeader = (date, expenses) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    let dateText;
    if (isToday) {
      dateText = t('expenses.today');
    } else {
      dateText = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
    
    // Calculate daily total
    const dailyTotal = expenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
    
    return (
      <View style={expensesTrackingStyles.dateHeader}>
        <Text style={expensesTrackingStyles.dateHeaderText}>{dateText}</Text>
        <Text style={expensesTrackingStyles.dateHeaderTotal}>{formatCurrency(dailyTotal)}</Text>
      </View>
    );
  };

  const renderExpenseGroup = ({ item: dateGroup }) => {
    return (
      <View>
        {renderDateHeader(dateGroup.date, dateGroup.expenses)}
        {dateGroup.expenses.map((expense) => (
          <View key={expense.id}>
            {renderExpenseItem({ item: expense })}
          </View>
        ))}
      </View>
    );
  };

  // Calculate top 3 categories
  const getTopCategories = () => {
    const categoryTotals = {};
    monthlyExpenses.forEach(expense => {
      const categoryId = expense.categoryId;
      if (!categoryTotals[categoryId]) {
        categoryTotals[categoryId] = 0;
      }
      categoryTotals[categoryId] += expense.amountConverted || 0;
    });

    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => ({
        categoryId,
        total,
        category: expenseCategories.find(cat => cat.id === categoryId)
      }))
      .filter(item => item.category) // Only include categories that exist
      .sort((a, b) => b.total - a.total)
      .slice(0, 2);
  };

  // Calculate average daily expense
  const getAverageDailyExpense = () => {
    if (monthlyExpenses.length === 0) return 0;
    
    const uniqueDays = new Set();
    monthlyExpenses.forEach(expense => {
      const date = new Date(expense.date).toDateString();
      uniqueDays.add(date);
    });
    
    return uniqueDays.size > 0 ? monthlyTotal / uniqueDays.size : 0;
  };

  const renderSummaryCard = () => {
    const topCategories = getTopCategories();

    return (
      <View style={expensesTrackingStyles.summaryCard}>
        {/* Total and Daily Average */}
        <View style={expensesTrackingStyles.summaryHeader}>
          <View style={expensesTrackingStyles.summaryLeft}>
            <Text style={expensesTrackingStyles.summaryLabel}>{t('expenses.total')}</Text>
            <Text style={expensesTrackingStyles.summaryAmount}>
              {formatCurrency(displayTotal)}
            </Text>
          </View>
          <View style={expensesTrackingStyles.summaryRight}>
            <Text style={expensesTrackingStyles.averageLabel}>{t('expenses.dailyAverage')}</Text>
            <Text style={expensesTrackingStyles.averageAmount}>
              {formatCurrency(displayDailyAverage)}
            </Text>
          </View>
        </View>

        {/* Top 2 Categories */}
        <View style={expensesTrackingStyles.topCategoriesSection}>
          <Text style={expensesTrackingStyles.sectionTitle}>{t('expenses.topCategories')}</Text>
          {topCategories.length > 0 ? (
            topCategories.map((item, index) => {
              const displayAmount = index === 0 ? displayTopCategory1 : displayTopCategory2;
              return (
                <View key={item.categoryId} style={expensesTrackingStyles.categoryRow}>
                  <View style={expensesTrackingStyles.categoryInfo}>
                    <Ionicons 
                      name={item.category.icon} 
                      size={14} 
                      color={item.category.color} 
                    />
                    <Text style={expensesTrackingStyles.categoryName}>
                      {item.category.name}
                    </Text>
                  </View>
                  <Text style={expensesTrackingStyles.categoryAmount}>
                    {formatCurrency(displayAmount)}
                  </Text>
                </View>
              );
            })
          ) : (
            <Text style={expensesTrackingStyles.categoryName}>{t('expenses.noExpensesWithCategories')}</Text>
          )}
        </View>
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
            t('expenses.expenseOptions'),
            t('expenses.whatWouldYouLikeToDo'),
            [
              { text: t('expenses.edit'), onPress: () => openModal(item) },
              { text: t('expenses.duplicate'), onPress: async () => await duplicateExpense(item) },
              { text: t('expenses.delete'), style: 'destructive', onPress: () => deleteExpense(item.id) },
              { text: t('common.cancel'), style: 'cancel' },
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
              {item.note || t('expenses.untitledExpense')}
            </Text>
          </View>
          <View style={expensesTrackingStyles.itemDetails}>
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
          <Text style={expensesTrackingStyles.monthPickerTitle}>{t('expenses.selectMonth')}</Text>
          
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
            <Text style={expensesTrackingStyles.cancelButtonText}>{t('common.cancel')}</Text>
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={expensesTrackingStyles.modalHeader}>
            <Text style={expensesTrackingStyles.modalTitle}>
              {editingExpense ? t('expenses.editExpenseTitle') : t('expenses.addExpenseTitle')}
            </Text>
            <View style={expensesTrackingStyles.modalHeaderButtons}>
              <TouchableOpacity 
                onPress={() => Keyboard.dismiss()}
                style={expensesTrackingStyles.keyboardDismissButton}
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
            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.expenseName')}</Text>
            <TextInput
              style={[
                expensesTrackingStyles.input,
                isNameFocused
                  ? expensesTrackingStyles.inputFocused
                  : expensesTrackingStyles.inputUnfocused,
              ]}
              placeholder={t('expenses.enterExpenseName')}
              placeholderTextColor="#6c757d"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              onFocus={() => setIsNameFocused(true)}
              onBlur={() => setIsNameFocused(false)}
              returnKeyType="next"
              onSubmitEditing={() => {
                // Focus on amount field when user presses next
                // This will be handled by the amount field's ref
              }}
            />

            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.amount')}</Text>
            <TextInput
              style={[
                expensesTrackingStyles.input,
                isAmountFocused
                  ? expensesTrackingStyles.inputFocused
                  : expensesTrackingStyles.inputUnfocused,
              ]}
              placeholder={t('expenses.enterAmount')}
              placeholderTextColor="#6c757d"
              value={formData.amount}
              onChangeText={handleAmountChange}
              keyboardType="numeric"
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.date')}</Text>
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
            
            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.category')}</Text>
            <View style={expensesTrackingStyles.categoryScrollContainer}>
              <ScrollView
                style={expensesTrackingStyles.categoryScrollView}
                contentContainerStyle={expensesTrackingStyles.categoryContainer}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {expenseCategories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      expensesTrackingStyles.categoryButton,
                      formData.categoryId === category.id && expensesTrackingStyles.categoryButtonSelected
                    ]}
                    onPress={() => {
                      // Auto-fill expense name with category name if expense name is empty
                      const updatedFormData = { ...formData, categoryId: category.id };
                      if (!formData.name.trim()) {
                        updatedFormData.name = category.name;
                      }
                      setFormData(updatedFormData);
                    }}
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
              </ScrollView>
            </View>

            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.description')}</Text>
            <TextInput
              style={[
                expensesTrackingStyles.input,
                expensesTrackingStyles.textArea,
                isDescriptionFocused
                  ? expensesTrackingStyles.inputFocused
                  : expensesTrackingStyles.inputUnfocused,
              ]}
              placeholder={t('expenses.enterDescription')}
              placeholderTextColor="#6c757d"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={3}
              onFocus={() => setIsDescriptionFocused(true)}
              onBlur={() => setIsDescriptionFocused(false)}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss()}
            />
          
          <View style={expensesTrackingStyles.modalButtons}>
            <TouchableOpacity
              style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={expensesTrackingStyles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.saveButton]}
              onPress={saveExpense}
            >
              <Text style={expensesTrackingStyles.saveButtonText}>{t('expenses.save')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );

  const addCategory = () => {
    const trimmedName = (newCategoryName || '').trim();
    if (!trimmedName) {
      Alert.alert(t('expenses.category'), t('expenses.pleaseEnterCategoryName'));
      return;
    }
    const exists = expenseCategories.some(
      (c) => c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      Alert.alert(t('expenses.category'), t('expenses.categoryAlreadyExists'));
      return;
    }
    const created = {
      id: `cat-${generateId()}`,
      name: trimmedName,
      type: 'expense',
      subtype: 'daily', // Set as daily expense category
      icon: newCategoryIcon || 'pricetag',
      color: newCategoryColor || '#6c757d',
    };
    expenseCategories.push(created);
    setNewCategoryName('');
    setCategoriesVersion((v) => v + 1);
  };

  const requestDeleteCategory = async (categoryId) => {
    try {
      const allExpenses = await getExpenses();
      const inUse = allExpenses.some((exp) => exp.categoryId === categoryId);
      if (inUse) {
        Alert.alert(t('expenses.cannotDelete'), t('expenses.categoryInUse'));
        return;
      }
      // Note: Category deletion should be handled through database service
      // This is just a client-side check
      setExpenseCategories(prev => prev.filter((c) => c.id !== categoryId));
      setCategoriesVersion((v) => v + 1);
    } catch (error) {
      console.error('Error checking category usage:', error);
      Alert.alert(t('common.error'), t('expenses.errorFailedToLoadCategories'));
    }
  };

  const renderCategoriesModal = () => {
    // Icon options specifically for daily expense categories
    const iconOptions = ['airplane', 'sunny', 'restaurant', 'moon', 'phone-portrait', 'game-controller', 'home', 'cart', 'pricetag', 'heart', 'medical', 'bag', 'document-text'];
    const colorOptions = ['#6c757d', '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', '#ffc107', '#20c997', '#e83e8c', '#17a2b8', '#343a40', '#495057', '#dee2e6', '#6a5acd'];

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <View style={expensesTrackingStyles.modalOverlay}>
          <View style={expensesTrackingStyles.modalContent}>
            {/* Fixed Header */}
            <View style={expensesTrackingStyles.modalHeader}>
              <Text style={expensesTrackingStyles.modalTitle}>{t('expenses.manageCategories')}</Text>
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
                contentContainerStyle={[expensesTrackingStyles.categoryGrid, { padding: 8, flexGrow: 1 }]}
                showsVerticalScrollIndicator={true}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
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
                  <Text style={{ color: '#6c757d' }}>{t('expenses.noCategoriesFound')}</Text>
                )}
              </ScrollView>
            </View>

            <View style={expensesTrackingStyles.divider} />

            <Text style={expensesTrackingStyles.sectionLabel}>{t('expenses.addNewCategory')}</Text>
            <View style={expensesTrackingStyles.newPreviewRow}>
              <View style={[expensesTrackingStyles.categoryAvatar, { backgroundColor: newCategoryColor }]}>
                <Ionicons name={newCategoryIcon} size={18} color="#ffffff" />
              </View>
              <Text style={expensesTrackingStyles.newPreviewText}>{newCategoryName || t('expenses.preview')}</Text>
            </View>
            <TextInput
              style={[expensesTrackingStyles.input, expensesTrackingStyles.inputUnfocused]}
              placeholder={t('expenses.categoryName')}
              value={newCategoryName}
              onChangeText={setNewCategoryName}
            />

            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.icon')}</Text>
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

            <Text style={expensesTrackingStyles.inputLabel}>{t('expenses.color')}</Text>
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
                <Text style={expensesTrackingStyles.cancelButtonText}>{t('expenses.close')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[expensesTrackingStyles.modalButton, expensesTrackingStyles.saveButton]}
                onPress={addCategory}
              >
                <Text style={expensesTrackingStyles.saveButtonText}>{t('expenses.addCategory')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <View style={[expensesTrackingStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>{t('expenses.loadingData')}</Text>
      </View>
    );
  }

  return (
    <View style={expensesTrackingStyles.container}>
      {/* Top Banner */}
      <View style={expensesTrackingStyles.topBanner}>
        <Text style={expensesTrackingStyles.topBannerTitle}>{t('expenses.title')}</Text>
        <Text style={expensesTrackingStyles.topBannerSubtitle}>{t('expenses.subtitle')}</Text>
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
          <Text style={expensesTrackingStyles.addButtonText}>{t('expenses.addExpense')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[expensesTrackingStyles.addButton, { backgroundColor: '#007bff' }]}
          onPress={() => setCategoriesModalVisible(true)}
        >
          <Ionicons name="albums" size={20} color="white" />
          <Text style={expensesTrackingStyles.addButtonText}>{t('expenses.categories')}</Text>
        </TouchableOpacity>
      </View>

      {/* Expenses List */}
      <ScrollView style={expensesTrackingStyles.scrollView} showsVerticalScrollIndicator={false}>
        {monthlyExpenses.length === 0 ? (
          <View style={expensesTrackingStyles.emptyState}>
            <Ionicons name="receipt" size={48} color="#6c757d" />
            <Text style={expensesTrackingStyles.emptyText}>
              {t('expenses.noExpensesRecorded')}
            </Text>
            <TouchableOpacity
              style={[expensesTrackingStyles.emptyStateButton, { backgroundColor: '#dc3545' }]}
              onPress={() => openModal()}
            >
              <Text style={expensesTrackingStyles.emptyStateButtonText}>
                {t('expenses.addYourFirstExpense')}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={groupExpensesByDate(monthlyExpenses)}
            renderItem={renderExpenseGroup}
            keyExtractor={(item, index) => `date-group-${index}`}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Ad Banner at Bottom */}
      <AdBanner position="bottom" />

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
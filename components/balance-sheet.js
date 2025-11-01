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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { balanceSheetStyles } from '../styles/balance-sheet.styles';
import { useI18n } from '../i18n/i18n';

import { 
  formatCurrency, 
  toMonthKey, 
  getMonthStartEnd, 
  calculateMonthlySummary, 
  sortTransactions, 
  filterTransactionsByMonth,
  getCategories,
  getAccounts,
  getTransactions,
  getTransactionsByMonth,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  generateId
} from '../utils/data-utils';

const BalanceSheet = () => {
  const { t } = useI18n();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthKey, setMonthKey] = useState(toMonthKey(new Date()));
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  
  // Database data state
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('income');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    accountId: '',
    note: '',
    date: new Date(),
  });
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);

  // Categories management state
  const [categoriesModalVisible, setCategoriesModalVisible] = useState(false);
  const [categoriesModalType, setCategoriesModalType] = useState('income'); // Track which type of categories modal is open
  const [categoriesVersion, setCategoriesVersion] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('expense');
  const [newCategoryIcon, setNewCategoryIcon] = useState('pricetag');
  const [newCategoryColor, setNewCategoryColor] = useState('#6c757d');

  // Month picker state
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Load data from database
  const loadDataFromDatabase = useCallback(async () => {
    try {
      setIsLoading(true);
      const [categoriesData, accountsData, transactionsData] = await Promise.all([
        getCategories(),
        getAccounts(),
        getTransactions()
      ]);
      
      setCategories(categoriesData);
      setAccounts(accountsData);
      
      // Create a map of category IDs to their subtype for quick lookup
      const categorySubtypeMap = {};
      categoriesData.forEach(cat => {
        categorySubtypeMap[cat.id] = cat.subtype;
      });
      
      // Filter transactions: Balance Sheet should only show formal transactions
      // Exclude daily expense transactions (subtype='daily')
      // Include: All income transactions + Expense transactions with subtype != 'daily'
      const formalTransactions = transactionsData.filter(tx => {
        // All income transactions are included
        if (tx.type === 'income') return true;
        
        // For expense transactions, exclude those with daily categories
        if (tx.type === 'expense') {
          if (!tx.categoryId) return true; // Include expenses without category
          const categorySubtype = categorySubtypeMap[tx.categoryId];
          // Exclude daily expenses, include formal/other/null
          return categorySubtype !== 'daily';
        }
        
        return true;
      });
      
      setTransactions(formalTransactions);
      
      // Load monthly transactions (only formal ones)
      const monthTransactions = filterTransactionsByMonth(formalTransactions, monthKey);
      const sortedTransactions = sortTransactions(monthTransactions);
      setMonthlyTransactions(sortedTransactions);
      
      // Compute summary using utility function
      const summary = calculateMonthlySummary(sortedTransactions);
      setMonthlySummary(summary);
      
    } catch (error) {
      console.error('Error loading data from database:', error);
      Alert.alert(t('common.error'), t('balance.errorFailedToLoad'));
    } finally {
      setIsLoading(false);
    }
  }, [monthKey]);

  // Load transactions for current month (when month changes)
  const loadMonthlyTransactions = useCallback(() => {
    if (transactions.length === 0) return;
    
    const monthTransactions = filterTransactionsByMonth(transactions, monthKey);
    const sortedTransactions = sortTransactions(monthTransactions);
    
    setMonthlyTransactions(sortedTransactions);
    
    // Compute summary using utility function
    const summary = calculateMonthlySummary(sortedTransactions);
    setMonthlySummary(summary);
  }, [monthKey, transactions]);

  // Initialize and load data
  useEffect(() => {
    loadDataFromDatabase();
  }, []);

  // Reload monthly data when month changes
  useEffect(() => {
    loadMonthlyTransactions();
  }, [loadMonthlyTransactions]);

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

  // Transaction management
  const openModal = (type, transaction = null) => {
    setModalType(type);
    setEditingTransaction(transaction);
    
    if (transaction) {
      // Edit mode
      setFormData({
        amount: formatAmountForInput(transaction.amountOriginal),
        categoryId: transaction.categoryId,
        accountId: transaction.accountId || '',
        note: transaction.note || '',
        date: new Date(transaction.date),
      });
    } else {
      // Add mode
      setFormData({
        amount: '',
        categoryId: '',
        accountId: '',
        note: '',
        date: new Date(),
      });
    }
    
    setModalVisible(true);
  };

  const saveTransaction = async () => {
    if (!formData.amount || !formData.categoryId) {
      Alert.alert(t('common.error'), t('balance.errorFillFields'));
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert(t('common.error'), t('balance.errorAmountGreaterThanZero'));
      return;
    }

    try {
      const transactionData = {
        type: modalType,
        amountOriginal: amount,
        currencyCode: 'USD',
        amountConverted: amount,
        fxRateToBase: null,
        categoryId: formData.categoryId,
        accountId: formData.accountId || null,
        note: formData.note || null,
        date: formData.date.toISOString(),
        attachmentUris: [],
      };

      if (editingTransaction) {
        // Update existing transaction
        await updateTransaction(editingTransaction.id, transactionData);
      } else {
        // Add new transaction
        await createTransaction(transactionData);
      }

      // Reload data from database
      await loadDataFromDatabase();
      
      setModalVisible(false);
      setEditingTransaction(null);
      
    } catch (error) {
      console.error('Error saving transaction:', error);
      Alert.alert(t('common.error'), t('balance.errorFailedToSave'));
    }
  };

  const handleDeleteTransaction = (id) => {
    Alert.alert(
      t('balance.deleteTransaction'),
      t('balance.deleteTransactionConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(id);
              await loadDataFromDatabase();
            } catch (error) {
              console.error('Error deleting transaction:', error);
              Alert.alert(t('common.error'), t('balance.errorFailedToDelete'));
            }
          },
        },
      ]
    );
  };

  const duplicateTransaction = async (transaction) => {
    try {
      const duplicated = {
        ...transaction,
        id: undefined, // Let database generate new ID
        date: new Date().toISOString(),
        createdAt: undefined,
        updatedAt: undefined,
      };
      await createTransaction(duplicated);
      await loadDataFromDatabase();
    } catch (error) {
      console.error('Error duplicating transaction:', error);
      Alert.alert(t('common.error'), t('balance.errorFailedToDuplicate'));
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

  // Render functions
  const renderSummaryCard = (label, amount, type = 'neutral') => {
    const getCardStyle = () => {
      switch (type) {
        case 'positive':
          return { backgroundColor: '#d4edda', borderColor: '#c3e6cb' };
        case 'negative':
          return { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' };
        default:
          return { backgroundColor: '#e2e3e5', borderColor: '#d6d8db' };
      }
    };

    const getTextColor = () => {
      switch (type) {
        case 'positive':
          return '#155724';
        case 'negative':
          return '#721c24';
        default:
          return '#495057';
      }
    };

    return (
      <View style={[balanceSheetStyles.summaryCard, getCardStyle()]}>
        <Text style={balanceSheetStyles.summaryLabel}>{label === 'Balance' ? t('balance.balance') : label}</Text>
        <Text style={[balanceSheetStyles.summaryAmount, { color: getTextColor() }]}>
          {formatCurrency(amount)}
        </Text>
      </View>
    );
  };

  const renderCombinedSummaryCard = (incomeAmount, expenseAmount) => {
    return (
      <View style={[balanceSheetStyles.summaryCard, balanceSheetStyles.summaryCardCombined, { flex: 2 }]}>
        <View style={balanceSheetStyles.combinedTwoLines}>
          <Text style={balanceSheetStyles.combinedLineText}>
            {t('balance.totalIncome')}
            <Text style={{ fontWeight: 'bold', color: '#155724' }}> {formatCurrency(incomeAmount)}</Text>
          </Text>
          <Text style={balanceSheetStyles.combinedLineText}>
            {t('balance.totalExpenses')}
            <Text style={{ fontWeight: 'bold', color: '#721c24' }}> {formatCurrency(expenseAmount)}</Text>
          </Text>
        </View>
      </View>
    );
  };

  const renderTransactionItem = ({ item }) => {
    const category = categories.find(cat => cat.id === item.categoryId);
    const account = accounts.find(acc => acc.id === item.accountId);
    
    return (
      <TouchableOpacity
        style={balanceSheetStyles.itemCard}
        onPress={() => openModal(item.type, item)}
        onLongPress={() => {
          Alert.alert(
            t('balance.transactionOptions'),
            t('expenses.whatWouldYouLikeToDo'),
            [
              { text: t('common.edit'), onPress: () => openModal(item.type, item) },
              { text: t('expenses.duplicate'), onPress: () => duplicateTransaction(item) },
              { text: t('common.delete'), style: 'destructive', onPress: () => handleDeleteTransaction(item.id) },
              { text: t('common.cancel'), style: 'cancel' },
            ]
          );
        }}
      >
        <View style={balanceSheetStyles.itemInfo}>
          <View style={balanceSheetStyles.itemHeader}>
            <Ionicons 
              name={category?.icon || 'help-circle'} 
              size={18} 
              color={category?.color || '#6c757d'} 
            />
            <Text style={balanceSheetStyles.itemTitle}>
              {item.note || category?.name || t('balance.untitled')}
            </Text>
          </View>
          <View style={balanceSheetStyles.itemDetails}>
            <Text style={balanceSheetStyles.itemCategory}>{category?.name}</Text>
            {account && <Text style={balanceSheetStyles.itemAccount}>• {account.name}</Text>}
          </View>
        </View>
        <View style={balanceSheetStyles.itemActions}>
          <Text
            style={[
              balanceSheetStyles.itemAmountText,
              { color: item.type === 'income' ? '#28a745' : '#dc3545' },
            ]}
          >
            {item.type === 'income' ? '+' : '-'}
            {formatCurrency(item.amountConverted)}
          </Text>
                      <TouchableOpacity
              onPress={() => handleDeleteTransaction(item.id)}
              style={balanceSheetStyles.deleteButton}
            >
              <Ionicons name="trash" size={18} color="#dc3545" />
            </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data, type) => (
    <View style={balanceSheetStyles.section}>
      <View style={balanceSheetStyles.sectionHeader}>
        <Text style={balanceSheetStyles.sectionTitle}>{title}</Text>
        <View style={balanceSheetStyles.sectionDivider} />
      </View>
      {data.length === 0 ? (
        <View style={balanceSheetStyles.emptyState}>
          <Ionicons 
            name={type === 'income' ? 'trending-up' : 'trending-down'} 
            size={48} 
            color="#6c757d" 
          />
          <Text style={balanceSheetStyles.emptyText}>
            {type === 'income' ? t('balance.noIncomeEntries') : t('balance.noExpenseEntries')}
          </Text>
          <TouchableOpacity
            style={[balanceSheetStyles.emptyStateButton, { backgroundColor: type === 'income' ? '#28a745' : '#dc3545' }]}
            onPress={() => openModal(type)}
          >
            <Text style={balanceSheetStyles.emptyStateButtonText}>
              {type === 'income' ? t('balance.addYourFirstIncome') : t('balance.addYourFirstExpense')}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderTransactionItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );

  const renderMonthPicker = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={monthPickerVisible}
      onRequestClose={() => setMonthPickerVisible(false)}
    >
      <View style={balanceSheetStyles.modalOverlay}>
        <View style={balanceSheetStyles.monthPickerContent}>
          <Text style={balanceSheetStyles.monthPickerTitle}>{t('expenses.selectMonth')}</Text>
          
          <View style={balanceSheetStyles.yearSelector}>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear - 1)}>
              <Ionicons name="chevron-back" size={24} color="#007bff" />
            </TouchableOpacity>
            <Text style={balanceSheetStyles.yearText}>{selectedYear}</Text>
            <TouchableOpacity onPress={() => setSelectedYear(selectedYear + 1)}>
              <Ionicons name="chevron-forward" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
          
          <View style={balanceSheetStyles.monthGrid}>
            {Array.from({ length: 12 }, (_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  balanceSheetStyles.monthButton,
                  selectedMonth === i && balanceSheetStyles.monthButtonSelected
                ]}
                onPress={() => selectMonth(selectedYear, i)}
              >
                <Text style={[
                  balanceSheetStyles.monthButtonText,
                  selectedMonth === i && balanceSheetStyles.monthButtonTextSelected
                ]}>
                  {new Date(2000, i).toLocaleString('default', { month: 'short' })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity
            style={balanceSheetStyles.cancelButton}
            onPress={() => setMonthPickerVisible(false)}
          >
            <Text style={balanceSheetStyles.cancelButtonText}>{t('common.cancel')}</Text>
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
        style={balanceSheetStyles.modalOverlay}
        activeOpacity={1}
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={balanceSheetStyles.modalContent}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={balanceSheetStyles.modalHeader}>
            <Text style={balanceSheetStyles.modalTitle}>
              {editingTransaction 
                ? (modalType === 'income' ? t('balance.editIncomeTitle') : t('balance.editExpenseTitle'))
                : (modalType === 'income' ? t('balance.addIncomeTitle') : t('balance.addExpenseTitle'))}
            </Text>
            <View style={balanceSheetStyles.modalHeaderButtons}>
              <TouchableOpacity 
                onPress={() => Keyboard.dismiss()}
                style={balanceSheetStyles.keyboardDismissButton}
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
          
          {/* Description moved to top */}
          <Text style={balanceSheetStyles.inputLabel}>
            {modalType === 'income' ? t('balance.incomeDescription') : t('balance.expenseDescription')}
          </Text>
          <TextInput
            style={[
              balanceSheetStyles.input,
              isDescriptionFocused
                ? balanceSheetStyles.inputFocused
                : balanceSheetStyles.inputUnfocused,
            ]}
            placeholder={modalType === 'income' ? t('balance.enterIncome') : t('balance.enterExpense')}
            placeholderTextColor="#6c757d"
            value={formData.note}
            onChangeText={(text) => setFormData({ ...formData, note: text })}
            multiline
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            returnKeyType="next"
            onSubmitEditing={() => {
              // Focus on amount field when user presses next
            }}
          />

          <Text style={balanceSheetStyles.inputLabel}>{t('balance.amount')}</Text>
          <TextInput
            style={[
              balanceSheetStyles.input,
              isAmountFocused
                ? balanceSheetStyles.inputFocused
                : balanceSheetStyles.inputUnfocused,
            ]}
            placeholder={t('balance.enterAmount')}
            placeholderTextColor="#6c757d"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
            returnKeyType="done"
            onSubmitEditing={() => Keyboard.dismiss()}
          />

          <Text style={balanceSheetStyles.inputLabel}>{t('balance.category')}</Text>
          <View style={balanceSheetStyles.categoryScrollContainer}>
            <ScrollView
              style={balanceSheetStyles.categoryScrollView}
              contentContainerStyle={balanceSheetStyles.categoryContainer}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {categories
                .filter(cat => cat.type === modalType && (cat.subtype === 'formal' || cat.subtype === 'other'))
                .map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      balanceSheetStyles.categoryButton,
                      formData.categoryId === category.id && balanceSheetStyles.categoryButtonSelected
                    ]}
                    onPress={() => {
                      const newFormData = { ...formData, categoryId: category.id };
                      // Auto-fill description with category name if description is empty
                      if (!formData.note || formData.note.trim() === '') {
                        newFormData.note = category.name;
                      }
                      setFormData(newFormData);
                    }}
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={18} 
                      color={formData.categoryId === category.id ? 'white' : category.color} 
                    />
                    <Text style={[
                      balanceSheetStyles.categoryButtonText,
                      formData.categoryId === category.id && balanceSheetStyles.categoryButtonTextSelected
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
          
          {/* Account section removed per request */}          
          <View style={balanceSheetStyles.modalButtons}>
            <TouchableOpacity
              style={[balanceSheetStyles.modalButton, balanceSheetStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={balanceSheetStyles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[balanceSheetStyles.modalButton, balanceSheetStyles.saveButton]}
              onPress={saveTransaction}
            >
              <Text style={balanceSheetStyles.saveButtonText}>{t('common.save')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    </Modal>
  );

  const addCategory = () => {
    const trimmedName = (newCategoryName || '').trim();
    if (!trimmedName) {
      Alert.alert(t('expenses.category'), t('balance.pleaseEnterCategoryName'));
      return;
    }
    const exists = categories.some(
      (c) => c.type === categoriesModalType && c.name.toLowerCase() === trimmedName.toLowerCase()
    );
    if (exists) {
      Alert.alert(t('expenses.category'), t('balance.categoryAlreadyExists'));
      return;
    }
    const created = {
      id: `cat-${generateId()}`,
      name: trimmedName,
      type: categoriesModalType,
      subtype: categoriesModalType === 'income' ? 'formal' : 'formal', // Balance Sheet uses formal categories
      icon: newCategoryIcon || (categoriesModalType === 'income' ? 'cash' : 'pricetag'),
      color: newCategoryColor || (categoriesModalType === 'income' ? '#28a745' : '#dc3545'),
    };
    categories.push(created);
    setNewCategoryName('');
    setCategoriesVersion((v) => v + 1);
  };

  const requestDeleteCategory = (categoryId) => {
    const inUse = transactions.some((tx) => tx.categoryId === categoryId);
    if (inUse) {
      Alert.alert(t('balance.cannotDelete'), t('balance.categoryInUse'));
      return;
    }
    categories = categories.filter((c) => c.id !== categoryId);
    setCategoriesVersion((v) => v + 1);
  };

  const renderCategoriesModal = () => {
    const iconOptions = ['restaurant', 'cart', 'car', 'home', 'heart', 'game-controller', 'medical', 'bag', 'document-text', 'pricetag', 'airplane', 'school'];
    const colorOptions = ['#6c757d', '#007bff', '#28a745', '#dc3545', '#fd7e14', '#6f42c1', '#ffc107', '#20c997'];
    const activeIconOptions = iconOptions;
    // Filter categories by the modal type (income or expense)
    const filtered = categories.filter((c) => 
      c.type === categoriesModalType && 
      (c.subtype === 'formal' || c.subtype === 'other')
    );

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoriesModalVisible}
        onRequestClose={() => setCategoriesModalVisible(false)}
      >
        <View style={balanceSheetStyles.modalOverlay}>
          <View style={[balanceSheetStyles.modalContentCategories ]}>
            {/* Fixed Header */}
            <View style={balanceSheetStyles.modalHeader}>
              <Text style={balanceSheetStyles.modalTitle}>
                {categoriesModalType === 'income' ? t('balance.manageIncomeCategories') : t('balance.manageExpenseCategories')}
              </Text>
              <TouchableOpacity 
                onPress={() => setCategoriesModalVisible(false)}
                style={{ padding: 12, margin: -12 }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={28} color="#6c757d" />
              </TouchableOpacity>
            </View>

                {/* Scrollable Categories List */}
                <View style={{ height: 200, marginBottom: 12 }}>
                  <ScrollView
                    style={{ height: 200 }}
                    contentContainerStyle={{ padding: 8, flexGrow: 1 }}
                    showsVerticalScrollIndicator={true}
                    scrollEnabled={true}
                    nestedScrollEnabled={true}
                    keyboardShouldPersistTaps="handled"
                  >
                    {filtered.map((c) => (
                      <View key={c.id} style={[balanceSheetStyles.categoryRow, { marginBottom: 8 }]}>
                        <View style={balanceSheetStyles.categoryRowLeft}>
                          <View style={[balanceSheetStyles.categoryAvatar, { backgroundColor: c.color }]}>
                            <Ionicons name={c.icon} size={18} color="#ffffff" />
                          </View>
                          <Text style={balanceSheetStyles.categoryRowName}>{c.name}</Text>
                        </View>
                        <TouchableOpacity onPress={() => requestDeleteCategory(c.id)} style={balanceSheetStyles.categoryRowDelete}>
                          <Ionicons name="trash" size={18} color="#dc3545" />
                        </TouchableOpacity>
                      </View>
                    ))}
                    {filtered.length === 0 && (
                      <View style={{ padding: 20, alignItems: 'center' }}>
                        <Text style={{ color: '#6c757d', marginBottom: 8 }}>{t('balance.noCategoriesFound')}</Text>
                      </View>
                    )}
                  </ScrollView>
                </View>

                {/* Fixed Add New Section */}
                <View style={balanceSheetStyles.divider} />

                <Text style={balanceSheetStyles.sectionLabel}>{t('balance.addNew')}</Text>
                <View style={balanceSheetStyles.newPreviewRow}>
                  <View style={[balanceSheetStyles.categoryAvatar, { backgroundColor: newCategoryColor }]}>
                    <Ionicons name={newCategoryIcon} size={18} color="#ffffff" />
                  </View>
                  <Text style={balanceSheetStyles.newPreviewText}>{newCategoryName || t('balance.preview')}</Text>
                </View>
                <TextInput
                  style={[balanceSheetStyles.input, balanceSheetStyles.inputUnfocused]}
                  placeholder={t('balance.categoryName')}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                />

                <Text style={balanceSheetStyles.inputLabel}>{t('expenses.icon')}</Text>
                <View style={balanceSheetStyles.categoryContainer}>
                  {activeIconOptions.map((icon) => (
                    <TouchableOpacity
                      key={icon}
                      style={[
                        balanceSheetStyles.iconOption,
                        newCategoryIcon === icon && balanceSheetStyles.iconOptionSelected,
                      ]}
                      onPress={() => setNewCategoryIcon(icon)}
                    >
                      <Ionicons name={icon} size={16} color={newCategoryIcon === icon ? 'white' : '#6c757d'} />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={balanceSheetStyles.inputLabel}>{t('expenses.color')}</Text>
                <View style={balanceSheetStyles.colorRow}>
                  {colorOptions.map((hex) => (
                    <TouchableOpacity
                      key={hex}
                      style={[
                        balanceSheetStyles.colorSwatch,
                        { backgroundColor: hex },
                        newCategoryColor === hex && balanceSheetStyles.colorSwatchSelected,
                      ]}
                      onPress={() => setNewCategoryColor(hex)}
                    >
                      {newCategoryColor === hex && (
                        <Ionicons name="checkmark" size={16} color="#ffffff" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={balanceSheetStyles.modalButtons}>
                  <TouchableOpacity
                    style={[balanceSheetStyles.modalButton, balanceSheetStyles.cancelButton]}
                    onPress={() => setCategoriesModalVisible(false)}
                  >
                    <Text style={balanceSheetStyles.cancelButtonText}>{t('expenses.close')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[balanceSheetStyles.modalButton, balanceSheetStyles.saveButton]}
                    onPress={addCategory}
                  >
                    <Text style={balanceSheetStyles.saveButtonText}>{t('expenses.addCategory')}</Text>
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
      <View style={[balanceSheetStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, color: '#666' }}>{t('balance.loadingData')}</Text>
      </View>
    );
  }

  return (
    <View style={balanceSheetStyles.container}>
      {/* Month Navigator removed per request */}

      {/* Top Banner */}
      <View style={balanceSheetStyles.topBanner}>
        <Text style={balanceSheetStyles.topBannerTitle}>{t('balance.title')}</Text>
        <Text style={balanceSheetStyles.topBannerSubtitle}>{t('balance.subtitle')}</Text>
      </View>

      {/* Summary Cards */}
      <View style={balanceSheetStyles.summaryContainer}>
        {renderCombinedSummaryCard(monthlySummary.totalIncome, monthlySummary.totalExpenses)}
        <View style={{ flex: 1.6 }}>
        {renderSummaryCard(t('balance.balance'), monthlySummary.balance, 
          monthlySummary.balance > 0 ? 'positive' : 
          monthlySummary.balance < 0 ? 'negative' : 'neutral'
        )}
        </View>
      </View>

      {/* Add Buttons */}
      <View style={balanceSheetStyles.addButtonsContainer}>
        <TouchableOpacity 
          style={[balanceSheetStyles.addButton, { backgroundColor: '#28a745' }]} 
          onPress={() => openModal('income')}
        >
          <Ionicons name="add" size={18} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>{t('balance.addIncome')}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[balanceSheetStyles.addButton, { backgroundColor: '#dc3545' }]} 
          onPress={() => openModal('expense')}
        >
          <Ionicons name="remove" size={18} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>{t('balance.addExpense')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[balanceSheetStyles.addButton, { backgroundColor: '#007bff' }]}
          onPress={() => {
            setCategoriesModalType('income');
            setNewCategoryType('income');
            setNewCategoryIcon('cash');
            setNewCategoryColor('#28a745');
            setCategoriesModalVisible(true);
          }}
        >
          <Ionicons name="trending-up" size={18} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>{t('balance.incomeCat')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[balanceSheetStyles.addButton, { backgroundColor: '#6c757d' }]}
          onPress={() => {
            setCategoriesModalType('expense');
            setNewCategoryType('expense');
            setNewCategoryIcon('pricetag');
            setNewCategoryColor('#dc3545');
            setCategoriesModalVisible(true);
          }}
        >
          <Ionicons name="trending-down" size={18} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>{t('balance.expenseCat')}</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={balanceSheetStyles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSection(t('balance.income'), monthlyTransactions.filter(tx => tx.type === 'income').sort((a, b) => b.amountConverted - a.amountConverted), 'income')}
        {renderSection(t('balance.expenses'), monthlyTransactions.filter(tx => tx.type === 'expense').sort((a, b) => b.amountConverted - a.amountConverted), 'expense')}
      </ScrollView>

      {/* Modals */}
      {renderEntryModal()}
      {renderMonthPicker()}
      {renderCategoriesModal()}
    </View>
  );
};

export default BalanceSheet; 
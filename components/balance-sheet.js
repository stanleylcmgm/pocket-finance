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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { balanceSheetStyles } from '../styles/balance-sheet.styles';

import { 
  formatCurrency, 
  toMonthKey, 
  getMonthStartEnd, 
  calculateMonthlySummary, 
  sortTransactions, 
  filterTransactionsByMonth,
  sampleCategories,
  sampleAccounts,
  sampleTransactions
} from '../utils/data-utils';

// Mock data storage (replace with actual persistence later)
let transactions = [...sampleTransactions];
let categories = [...sampleCategories];
let accounts = [...sampleAccounts];

const BalanceSheet = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthKey, setMonthKey] = useState(toMonthKey(new Date()));
  const [monthlyTransactions, setMonthlyTransactions] = useState([]);
  const [monthlySummary, setMonthlySummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  
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

  // Month picker state
  const [monthPickerVisible, setMonthPickerVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Load transactions for current month
  const loadMonthlyTransactions = useCallback(() => {
    const monthTransactions = filterTransactionsByMonth(transactions, monthKey);
    const sortedTransactions = sortTransactions(monthTransactions);
    
    setMonthlyTransactions(sortedTransactions);
    
    // Compute summary using utility function
    const summary = calculateMonthlySummary(sortedTransactions);
    setMonthlySummary(summary);
  }, [monthKey]);

  // Initialize and load data
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

  const saveTransaction = () => {
    if (!formData.amount || !formData.categoryId) {
      Alert.alert('Error', 'Please fill in amount and category');
      return;
    }

    const amount = parseAmountFromInput(formData.amount);
    if (amount <= 0) {
      Alert.alert('Error', 'Amount must be greater than 0');
      return;
    }

    const transaction = {
      id: editingTransaction?.id || `tx-${Date.now()}`,
      type: modalType,
      amountOriginal: amount,
      currencyCode: 'USD',
      amountConverted: amount,
      fxRateToBase: null,
      categoryId: formData.categoryId,
      accountId: formData.accountId || null,
      note: formData.note || null,
      date: formData.date.toISOString(),
      createdAt: editingTransaction?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachmentUris: [],
    };

    if (editingTransaction) {
      // Update existing transaction
      const index = transactions.findIndex(tx => tx.id === transaction.id);
      if (index !== -1) {
        transactions[index] = transaction;
      }
    } else {
      // Add new transaction
      transactions.push(transaction);
    }

    setModalVisible(false);
    setEditingTransaction(null);
    loadMonthlyTransactions();
  };

  const deleteTransaction = (id) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            transactions = transactions.filter(tx => tx.id !== id);
            loadMonthlyTransactions();
          },
        },
      ]
    );
  };

  const duplicateTransaction = (transaction) => {
    const duplicated = {
      ...transaction,
      id: `tx-${Date.now()}`,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    transactions.push(duplicated);
    loadMonthlyTransactions();
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
        <Text style={balanceSheetStyles.summaryLabel}>{label}</Text>
        <Text style={[balanceSheetStyles.summaryAmount, { color: getTextColor() }]}>
          {formatCurrency(amount)}
        </Text>
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
            'Transaction Options',
            'What would you like to do?',
            [
              { text: 'Edit', onPress: () => openModal(item.type, item) },
              { text: 'Duplicate', onPress: () => duplicateTransaction(item) },
              { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(item.id) },
              { text: 'Cancel', style: 'cancel' },
            ]
          );
        }}
      >
        <View style={balanceSheetStyles.itemInfo}>
          <View style={balanceSheetStyles.itemHeader}>
            <Ionicons 
              name={category?.icon || 'help-circle'} 
              size={20} 
              color={category?.color || '#6c757d'} 
            />
            <Text style={balanceSheetStyles.itemTitle}>
              {item.note || category?.name || 'Untitled'}
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
            onPress={() => deleteTransaction(item.id)}
            style={balanceSheetStyles.deleteButton}
          >
            <Ionicons name="trash" size={20} color="#dc3545" />
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
            No {type} entries yet
          </Text>
          <TouchableOpacity
            style={[balanceSheetStyles.emptyStateButton, { backgroundColor: type === 'income' ? '#28a745' : '#dc3545' }]}
            onPress={() => openModal(type)}
          >
            <Text style={balanceSheetStyles.emptyStateButtonText}>
              Add Your First {type === 'income' ? 'Income' : 'Expense'}
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
          <Text style={balanceSheetStyles.monthPickerTitle}>Select Month</Text>
          
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
            <Text style={balanceSheetStyles.cancelButtonText}>Cancel</Text>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={balanceSheetStyles.modalOverlay}
      >
        <View style={balanceSheetStyles.modalContent}>
          <View style={balanceSheetStyles.modalHeader}>
            <Text style={balanceSheetStyles.modalTitle}>
              {editingTransaction ? 'Edit' : 'Add'} {modalType === 'income' ? 'Income' : 'Expense'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color="#6c757d" />
            </TouchableOpacity>
          </View>
          
          {/* Description moved to top */}
          <TextInput
            style={[
              balanceSheetStyles.input,
              isDescriptionFocused
                ? balanceSheetStyles.inputFocused
                : balanceSheetStyles.inputUnfocused,
            ]}
            placeholder="Description"
            value={formData.note}
            onChangeText={(text) => setFormData({ ...formData, note: text })}
            multiline
            onFocus={() => setIsDescriptionFocused(true)}
            onBlur={() => setIsDescriptionFocused(false)}
            autoFocus
          />

          <TextInput
            style={[
              balanceSheetStyles.input,
              isAmountFocused
                ? balanceSheetStyles.inputFocused
                : balanceSheetStyles.inputUnfocused,
            ]}
            placeholder="Amount $"
            value={formData.amount}
            onChangeText={handleAmountChange}
            keyboardType="numeric"
            onFocus={() => setIsAmountFocused(true)}
            onBlur={() => setIsAmountFocused(false)}
          />
          
          <Text style={balanceSheetStyles.inputLabel}>Category *</Text>
          <View style={balanceSheetStyles.categoryContainer}>
            {categories
              .filter(cat => cat.type === modalType)
              .map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    balanceSheetStyles.categoryButton,
                    formData.categoryId === category.id && balanceSheetStyles.categoryButtonSelected
                  ]}
                  onPress={() => setFormData({ ...formData, categoryId: category.id })}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={16} 
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
          </View>
          
          {/* Account section removed per request */}
          
          <View style={balanceSheetStyles.modalButtons}>
            <TouchableOpacity
              style={[balanceSheetStyles.modalButton, balanceSheetStyles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={balanceSheetStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[balanceSheetStyles.modalButton, balanceSheetStyles.saveButton]}
              onPress={saveTransaction}
            >
              <Text style={balanceSheetStyles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  return (
    <View style={balanceSheetStyles.container}>
      {/* Month Navigator removed per request */}

      {/* Top Banner */}
      <View style={balanceSheetStyles.topBanner}>
        <Text style={balanceSheetStyles.topBannerTitle}>Balance Sheet</Text>
        <Text style={balanceSheetStyles.topBannerSubtitle}>Overview of your month</Text>
      </View>

      {/* Summary Cards */}
      <View style={balanceSheetStyles.summaryContainer}>
        {renderSummaryCard('Total Income', monthlySummary.totalIncome, 'positive')}
        {renderSummaryCard('Total Expenses', monthlySummary.totalExpenses, 'negative')}
        {renderSummaryCard('Balance', monthlySummary.balance, 
          monthlySummary.balance > 0 ? 'positive' : 
          monthlySummary.balance < 0 ? 'negative' : 'neutral'
        )}
      </View>

      {/* Add Buttons */}
      <View style={balanceSheetStyles.addButtonsContainer}>
        <TouchableOpacity 
          style={[balanceSheetStyles.addButton, { backgroundColor: '#28a745' }]} 
          onPress={() => openModal('income')}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[balanceSheetStyles.addButton, { backgroundColor: '#dc3545' }]} 
          onPress={() => openModal('expense')}
        >
          <Ionicons name="remove" size={20} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions List */}
      <ScrollView style={balanceSheetStyles.scrollView} showsVerticalScrollIndicator={false}>
        {renderSection('Income', monthlyTransactions.filter(tx => tx.type === 'income'), 'income')}
        {renderSection('Expenses', monthlyTransactions.filter(tx => tx.type === 'expense'), 'expense')}
      </ScrollView>

      {/* Modals */}
      {renderEntryModal()}
      {renderMonthPicker()}
    </View>
  );
};

export default BalanceSheet; 
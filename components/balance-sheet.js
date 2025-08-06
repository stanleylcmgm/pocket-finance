import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { balanceSheetStyles } from '../styles/balance-sheet.styles';

const BalanceSheet = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('income'); // 'income' or 'expense'
  const [newItem, setNewItem] = useState({ title: '', amount: '', category: '' });

  const categories = {
    income: ['Salary', 'Freelance', 'Investment', 'Other'],
    expense: ['Food', 'Transport', 'Housing', 'Entertainment', 'Healthcare', 'Shopping', 'Bills', 'Other']
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const getTotalIncome = () => {
    return income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const addItem = () => {
    if (!newItem.title || !newItem.amount || !newItem.category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const item = {
      id: Date.now(),
      title: newItem.title,
      amount: parseFloat(newItem.amount),
      category: newItem.category,
      date: new Date().toISOString(),
    };

    if (modalType === 'income') {
      setIncome([...income, item]);
    } else {
      setExpenses([...expenses, item]);
    }

    setNewItem({ title: '', amount: '', category: '' });
    setModalVisible(false);
  };

  const deleteItem = (id, type) => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (type === 'income') {
              setIncome(income.filter(item => item.id !== id));
            } else {
              setExpenses(expenses.filter(item => item.id !== id));
            }
          },
        },
      ]
    );
  };

  const openModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentMonth);
    if (direction === 'next') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentMonth(newDate);
  };

  return (
    <View style={balanceSheetStyles.container}>
      {/* Header */}
      <View style={balanceSheetStyles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={balanceSheetStyles.monthButton}>
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={balanceSheetStyles.monthText}>{getMonthName(currentMonth)}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')} style={balanceSheetStyles.monthButton}>
          <Ionicons name="chevron-forward" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={balanceSheetStyles.summaryContainer}>
        <View style={balanceSheetStyles.summaryCard}>
          <Text style={balanceSheetStyles.summaryLabel}>Total Income</Text>
          <Text style={balanceSheetStyles.summaryAmount}>${getTotalIncome().toFixed(2)}</Text>
        </View>
        <View style={balanceSheetStyles.summaryCard}>
          <Text style={balanceSheetStyles.summaryLabel}>Total Expenses</Text>
          <Text style={balanceSheetStyles.summaryAmount}>${getTotalExpenses().toFixed(2)}</Text>
        </View>
        <View style={[balanceSheetStyles.summaryCard, { backgroundColor: getBalance() >= 0 ? '#d4edda' : '#f8d7da' }]}>
          <Text style={balanceSheetStyles.summaryLabel}>Balance</Text>
          <Text style={[balanceSheetStyles.summaryAmount, { color: getBalance() >= 0 ? '#155724' : '#721c24' }]}>
            ${getBalance().toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Add Buttons */}
      <View style={balanceSheetStyles.addButtonsContainer}>
        <TouchableOpacity style={[balanceSheetStyles.addButton, { backgroundColor: '#28a745' }]} onPress={() => openModal('income')}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[balanceSheetStyles.addButton, { backgroundColor: '#dc3545' }]} onPress={() => openModal('expense')}>
          <Ionicons name="remove" size={20} color="white" />
          <Text style={balanceSheetStyles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={balanceSheetStyles.scrollView}>
        {/* Income Section */}
        <View style={balanceSheetStyles.section}>
          <Text style={balanceSheetStyles.sectionTitle}>Income</Text>
          {income.length === 0 ? (
            <Text style={balanceSheetStyles.emptyText}>No income entries yet</Text>
          ) : (
            income.map((item) => (
              <View key={item.id} style={balanceSheetStyles.itemCard}>
                <View style={balanceSheetStyles.itemInfo}>
                  <Text style={balanceSheetStyles.itemTitle}>{item.title}</Text>
                  <Text style={balanceSheetStyles.itemCategory}>{item.category}</Text>
                </View>
                <View style={balanceSheetStyles.itemAmount}>
                  <Text style={[balanceSheetStyles.itemAmountText, { color: '#28a745' }]}>+${item.amount.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => deleteItem(item.id, 'income')}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Expenses Section */}
        <View style={balanceSheetStyles.section}>
          <Text style={balanceSheetStyles.sectionTitle}>Expenses</Text>
          {expenses.length === 0 ? (
            <Text style={balanceSheetStyles.emptyText}>No expense entries yet</Text>
          ) : (
            expenses.map((item) => (
              <View key={item.id} style={balanceSheetStyles.itemCard}>
                <View style={balanceSheetStyles.itemInfo}>
                  <Text style={balanceSheetStyles.itemTitle}>{item.title}</Text>
                  <Text style={balanceSheetStyles.itemCategory}>{item.category}</Text>
                </View>
                <View style={balanceSheetStyles.itemAmount}>
                  <Text style={[balanceSheetStyles.itemAmountText, { color: '#dc3545' }]}>-${item.amount.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => deleteItem(item.id, 'expense')}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Item Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={balanceSheetStyles.modalOverlay}>
          <View style={balanceSheetStyles.modalContent}>
            <Text style={balanceSheetStyles.modalTitle}>
              Add {modalType === 'income' ? 'Income' : 'Expense'}
            </Text>
            
            <TextInput
              style={balanceSheetStyles.input}
              placeholder="Title"
              value={newItem.title}
              onChangeText={(text) => setNewItem({ ...newItem, title: text })}
            />
            
            <TextInput
              style={balanceSheetStyles.input}
              placeholder="Amount"
              value={newItem.amount}
              onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
              keyboardType="numeric"
            />
            
            <View style={balanceSheetStyles.categoryContainer}>
              {categories[modalType].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    balanceSheetStyles.categoryButton,
                    newItem.category === category && balanceSheetStyles.categoryButtonSelected
                  ]}
                  onPress={() => setNewItem({ ...newItem, category })}
                >
                  <Text style={[
                    balanceSheetStyles.categoryButtonText,
                    newItem.category === category && balanceSheetStyles.categoryButtonTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={balanceSheetStyles.modalButtons}>
              <TouchableOpacity
                style={[balanceSheetStyles.modalButton, balanceSheetStyles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={balanceSheetStyles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[balanceSheetStyles.modalButton, balanceSheetStyles.saveButton]}
                onPress={addItem}
              >
                <Text style={balanceSheetStyles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BalanceSheet; 
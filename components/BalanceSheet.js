import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth('prev')} style={styles.monthButton}>
          <Ionicons name="chevron-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.monthText}>{getMonthName(currentMonth)}</Text>
        <TouchableOpacity onPress={() => changeMonth('next')} style={styles.monthButton}>
          <Ionicons name="chevron-forward" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Income</Text>
          <Text style={styles.summaryAmount}>${getTotalIncome().toFixed(2)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Expenses</Text>
          <Text style={styles.summaryAmount}>${getTotalExpenses().toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: getBalance() >= 0 ? '#d4edda' : '#f8d7da' }]}>
          <Text style={styles.summaryLabel}>Balance</Text>
          <Text style={[styles.summaryAmount, { color: getBalance() >= 0 ? '#155724' : '#721c24' }]}>
            ${getBalance().toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Add Buttons */}
      <View style={styles.addButtonsContainer}>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#28a745' }]} onPress={() => openModal('income')}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Income</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.addButton, { backgroundColor: '#dc3545' }]} onPress={() => openModal('expense')}>
          <Ionicons name="remove" size={20} color="white" />
          <Text style={styles.addButtonText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Income Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Income</Text>
          {income.length === 0 ? (
            <Text style={styles.emptyText}>No income entries yet</Text>
          ) : (
            income.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <View style={styles.itemAmount}>
                  <Text style={[styles.itemAmountText, { color: '#28a745' }]}>+${item.amount.toFixed(2)}</Text>
                  <TouchableOpacity onPress={() => deleteItem(item.id, 'income')}>
                    <Ionicons name="trash-outline" size={20} color="#dc3545" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>No expense entries yet</Text>
          ) : (
            expenses.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <View style={styles.itemAmount}>
                  <Text style={[styles.itemAmountText, { color: '#dc3545' }]}>-${item.amount.toFixed(2)}</Text>
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
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Add {modalType === 'income' ? 'Income' : 'Expense'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newItem.title}
              onChangeText={(text) => setNewItem({ ...newItem, title: text })}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={newItem.amount}
              onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
              keyboardType="numeric"
            />
            
            <View style={styles.categoryContainer}>
              {categories[modalType].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    newItem.category === category && styles.categoryButtonSelected
                  ]}
                  onPress={() => setNewItem({ ...newItem, category })}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    newItem.category === category && styles.categoryButtonTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={addItem}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  monthButton: {
    padding: 10,
  },
  monthText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  summaryContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 5,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  addButtonsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    padding: 20,
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  itemCategory: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  itemAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryButtonText: {
    color: '#6c757d',
    fontSize: 14,
  },
  categoryButtonTextSelected: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BalanceSheet; 
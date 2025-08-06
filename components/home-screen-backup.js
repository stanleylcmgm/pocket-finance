import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const menuItems = [
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      subtitle: 'Track income & expenses',
      icon: 'wallet-outline',
      color: '#28a745',
      screen: 'BalanceSheet',
    },
    {
      id: 'expenses-tracking',
      title: 'Expenses Tracking',
      subtitle: 'Monitor spending patterns',
      icon: 'trending-down-outline',
      color: '#dc3545',
      screen: 'ExpensesTracking',
    },
    {
      id: 'asset-management',
      title: 'Asset Management',
      subtitle: 'Manage your investments',
      icon: 'business-outline',
      color: '#ffc107',
      screen: 'AssetManagement',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'View insights',
      icon: 'analytics-outline',
      color: '#6f42c1',
      screen: 'Reports',
    },
  ];

  const navigateToScreen = (screenName) => {
    if (screenName === 'BalanceSheet') {
      navigation.navigate('BalanceSheet');
    } else if (screenName === 'ExpensesTracking') {
      // For future screens
      alert('Expenses Tracking screen coming soon!');
    } else if (screenName === 'AssetManagement') {
      // For future screens
      alert('Asset Management screen coming soon!');
    } else {
      // For future screens
      alert(`${screenName} screen coming soon!`);
    }
  };

  return (
    <ScrollView style={styles.container}>
             {/* Header */}
       <View style={styles.header}>
         <Text style={styles.title}>⭐ Star</Text>
         <Text style={styles.subtitle}>Your Productivity Companion</Text>
       </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="trending-up" size={24} color="#28a745" />
          <Text style={styles.statNumber}>$0</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trending-down" size={24} color="#dc3545" />
          <Text style={styles.statNumber}>$0</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={24} color="#007bff" />
          <Text style={styles.statNumber}>$0</Text>
          <Text style={styles.statLabel}>Balance</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>Financial Tools</Text>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigateToScreen(item.screen)}
          >
            <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={24} color="white" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemTitle}>{item.title}</Text>
              <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6c757d" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.menuTitle}>Quick Actions</Text>
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="add-circle-outline" size={24} color="#28a745" />
            <Text style={styles.quickActionText}>Add Income</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Ionicons name="remove-circle-outline" size={24} color="#dc3545" />
            <Text style={styles.quickActionText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  statCard: {
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
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 2,
  },
  menuContainer: {
    padding: 15,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  quickActionsContainer: {
    padding: 15,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 14,
    color: '#2c3e50',
    marginTop: 8,
    fontWeight: '500',
  },
});

export default HomeScreen; 
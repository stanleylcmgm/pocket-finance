import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { homeScreenStyles } from '../styles/home-screen.styles';
import { verifyDatabaseUsage, testDatabaseWrite, deleteAllDatabaseRecords } from '../utils/database-test';

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  // Database verification functions
  const handleVerifyDatabase = async () => {
    const result = await verifyDatabaseUsage();
    Alert.alert(
      'Database Verification',
      `Database Working: ${result.databaseWorking ? '✅ YES' : '❌ NO'}\n\n` +
      `Database Data:\n` +
      `- Categories: ${result.dbCategories}\n` +
      `- Accounts: ${result.dbAccounts}\n` +
      `- Transactions: ${result.dbTransactions}\n\n` +
      `Sample Data:\n` +
      `- First Category: ${result.sampleCategory?.name || 'None'}\n` +
      `- First Account: ${result.sampleAccount?.name || 'None'}\n` +
      `- First Transaction: ${result.sampleTransaction?.note || 'None'}`,
      [{ text: 'OK' }]
    );
  };

  const handleTestDatabaseWrite = async () => {
    const result = await testDatabaseWrite();
    Alert.alert(
      'Database Write Test',
      result.success 
        ? `✅ SUCCESS!\n\nNew transaction created.\nTotal transactions: ${result.totalTransactions}`
        : `❌ FAILED!\n\nError: ${result.error}`,
      [{ text: 'OK' }]
    );
  };

  const handleDeleteDatabase = async () => {
    Alert.alert(
      'Delete Database',
      'Are you sure you want to delete ALL records from the database? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAllDatabaseRecords();
            Alert.alert(
              'Delete Database',
              result.success 
                ? `✅ SUCCESS!\n\nAll records deleted successfully.\n\nRemaining records:\n- Categories: ${result.remainingRecords.categories}\n- Accounts: ${result.remainingRecords.accounts}\n- Transactions: ${result.remainingRecords.transactions}`
                : `❌ FAILED!\n\nError: ${result.error}`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  };

  const menuItems = [
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      subtitle: 'Track income & expenses',
      icon: 'wallet-outline',
      color: colors.features.balanceSheet,
      screen: 'BalanceSheet',
    },
    {
      id: 'expenses-tracking',
      title: 'Expenses Tracking',
      subtitle: 'Monitor spending patterns',
      icon: 'trending-down-outline',
      color: colors.features.expensesTracking,
      screen: 'ExpensesTracking',
    },
    {
      id: 'asset-management',
      title: 'Asset Management',
      subtitle: 'Manage your investments',
      icon: 'business-outline',
      color: colors.features.assetManagement,
      screen: 'AssetManagement',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'View insights',
      icon: 'analytics-outline',
      color: colors.features.reports,
      screen: 'Reports',
    },
  ];

  const bottomTabs = [
    { id: 'home', title: 'Home', icon: 'home-outline' },
    { id: 'balance-sheet', title: 'Balance', icon: 'wallet-outline' },
    { id: 'expenses-tracking', title: 'Expenses', icon: 'trending-down-outline' },
    { id: 'asset-management', title: 'Assets', icon: 'business-outline' },
    { id: 'reports', title: 'Reports', icon: 'analytics-outline' },
  ];

  const navigateToScreen = (screenName) => {
    if (screenName === 'BalanceSheet') {
      navigation.navigate('BalanceSheet');
    } else if (screenName === 'ExpensesTracking') {
      navigation.navigate('ExpensesTracking');
    } else if (screenName === 'AssetManagement') {
      navigation.navigate('AssetManagement');
    } else {
      // For future screens
      alert(`${screenName} screen coming soon!`);
    }
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'home') {
      const screenMap = {
        'balance-sheet': 'BalanceSheet',
        'expenses-tracking': 'ExpensesTracking',
        'asset-management': 'AssetManagement',
        'reports': 'Reports',
      };
      navigateToScreen(screenMap[tabId]);
    }
  };

  return (
    <View style={homeScreenStyles.container}>
      {/* Gradient Header */}
      <View style={homeScreenStyles.headerGradient}>
        <View style={homeScreenStyles.header}>
          <View style={homeScreenStyles.titleContainer}>
            <Text style={homeScreenStyles.title}>⭐ Pocket Finance</Text>
            <Text style={homeScreenStyles.subtitle}>Your Productivity Companion</Text>
          </View>
          <View style={homeScreenStyles.headerIcon}>
            <Ionicons name="star" size={40} color="rgba(255,255,255,0.3)" />
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={homeScreenStyles.mainContent}>
        <ScrollView style={homeScreenStyles.scrollView}>
          <View style={homeScreenStyles.scrollContent}>
            {/* Quick Stats */}
            <View style={homeScreenStyles.statsContainer}>
              <View style={homeScreenStyles.statCard}>
                <View style={homeScreenStyles.statIconContainer}>
                  <Ionicons name="trending-up" size={20} color={colors.success[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>$0</Text>
                <Text style={homeScreenStyles.statLabel}>This Month</Text>
              </View>
              <View style={homeScreenStyles.statCard}>
                <View style={homeScreenStyles.statIconContainer}>
                  <Ionicons name="trending-down" size={20} color={colors.error[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>$0</Text>
                <Text style={homeScreenStyles.statLabel}>Spent</Text>
              </View>
              <View style={homeScreenStyles.statCard}>
                <View style={homeScreenStyles.statIconContainer}>
                  <Ionicons name="wallet" size={20} color={colors.info[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>$0</Text>
                <Text style={homeScreenStyles.statLabel}>Balance</Text>
              </View>
            </View>

            {/* Database Test Section */}
            <View style={homeScreenStyles.menuContainer}>
              <View style={homeScreenStyles.sectionHeader}>
                <Text style={homeScreenStyles.menuTitle}>Database Test</Text>
                <View style={homeScreenStyles.sectionLine}></View>
              </View>
              <View style={homeScreenStyles.testButtonsContainer}>
                <TouchableOpacity 
                  style={[homeScreenStyles.testButton, { backgroundColor: colors.info[500] }]}
                  onPress={handleVerifyDatabase}
                >
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                  <Text style={homeScreenStyles.testButtonText}>Verify Database</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[homeScreenStyles.testButton, { backgroundColor: colors.error[500] }]}
                  onPress={handleDeleteDatabase}
                >
                  <Ionicons name="trash" size={20} color="white" />
                  <Text style={homeScreenStyles.testButtonText}>Delete Database</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Financial Tools */}
            <View style={homeScreenStyles.menuContainer}>
              <View style={homeScreenStyles.sectionHeader}>
                <Text style={homeScreenStyles.menuTitle}>Financial Tools</Text>
                <View style={homeScreenStyles.sectionLine}></View>
              </View>
              
              {/* 2x2 Grid Layout */}
              <View style={homeScreenStyles.gridContainer}>
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[homeScreenStyles.blockCard, { backgroundColor: item.color }]}
                    onPress={() => navigateToScreen(item.screen)}
                  >
                    <View style={homeScreenStyles.blockIconContainer}>
                      <Ionicons name={item.icon} size={32} color="#333" />
                    </View>
                    <Text style={homeScreenStyles.blockTitle}>{item.title}</Text>
                    <Text style={homeScreenStyles.blockSubtitle}>{item.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Bottom spacing for navigation */}
            <View style={homeScreenStyles.bottomSpacing}></View>
          </View>
        </ScrollView>
      </View>

    </View>
  );
};

export default HomeScreen; 
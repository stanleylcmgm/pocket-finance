import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { homeScreenStyles } from '../styles/home-screen.styles';
import { 
  getAssets, 
  calculateTotalAssets,
  getTransactions,
  getCategories,
  filterTransactionsByMonth,
  calculateMonthlySummary,
  toMonthKey,
  formatCurrency
} from '../utils/data-utils';
import { getExpenses } from '../utils/expenses-data';
import { useI18n } from '../i18n/i18n';
import LanguageSelector from './language-selector';

const HomeScreen = ({ navigation }) => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('home');
  const [totalAssets, setTotalAssets] = useState(0);
  const [monthlyExpensesTotal, setMonthlyExpensesTotal] = useState(0);
  const [balanceSheetBalance, setBalanceSheetBalance] = useState(0);

  // Load stats data
  const loadStats = useCallback(async () => {
    try {
      const currentMonth = new Date();
      const monthKey = toMonthKey(currentMonth);

      // Load Asset Management total
      const assets = await getAssets();
      const assetsTotal = calculateTotalAssets(assets);
      setTotalAssets(assetsTotal);

      // Load Expenses Tracking monthly total
      const allExpenses = await getExpenses();
      const monthlyExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseMonthKey = toMonthKey(expenseDate);
        return expenseMonthKey === monthKey;
      });
      const expensesTotal = monthlyExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
      setMonthlyExpensesTotal(expensesTotal);

      // Load Balance Sheet balance (current month, formal transactions only)
      const [allTransactions, allCategories] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);

      // Create a map of category IDs to their subtype for quick lookup
      const categorySubtypeMap = {};
      allCategories.forEach(cat => {
        categorySubtypeMap[cat.id] = cat.subtype;
      });

      // Filter to only formal transactions (exclude daily expenses)
      const formalTransactions = allTransactions.filter(tx => {
        // All income transactions are included
        if (tx.type === 'income') return true;
        // For expense transactions, exclude those with daily categories
        if (tx.type === 'expense') {
          if (!tx.categoryId) return true; // Include expenses without category
          const categorySubtype = categorySubtypeMap[tx.categoryId];
          return categorySubtype !== 'daily';
        }
        return true;
      });

      // Filter to current month and calculate balance
      const monthTransactions = filterTransactionsByMonth(formalTransactions, monthKey);
      const summary = calculateMonthlySummary(monthTransactions);
      setBalanceSheetBalance(summary.balance);

    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  // Load stats when component mounts and when screen is focused
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );

  // Format currency with no decimal places
  const formatCurrencyNoDecimals = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  const menuItems = [
    {
      id: 'balance-sheet',
      title: t('home.balanceSheet'),
      subtitle: t('home.balanceSheetSubtitle'),
      icon: 'wallet-outline',
      color: colors.features.balanceSheet,
      screen: 'BalanceSheet',
    },
    {
      id: 'expenses-tracking',
      title: t('home.expensesTracking'),
      subtitle: t('home.expensesTrackingSubtitle'),
      icon: 'trending-down-outline',
      color: colors.features.expensesTracking,
      screen: 'ExpensesTracking',
    },
    {
      id: 'asset-management',
      title: t('home.assetManagement'),
      subtitle: t('home.assetManagementSubtitle'),
      icon: 'business-outline',
      color: colors.features.assetManagement,
      screen: 'AssetManagement',
    },
    {
      id: 'reports',
      title: t('home.reports'),
      subtitle: t('home.reportsSubtitle'),
      icon: 'analytics-outline',
      color: colors.features.reports,
      screen: 'Reports',
    },
  ];

  const bottomTabs = [
    { id: 'home', title: t('home.home'), icon: 'home-outline' },
    { id: 'balance-sheet', title: t('home.balance'), icon: 'wallet-outline' },
    { id: 'expenses-tracking', title: t('home.expenses'), icon: 'trending-down-outline' },
    { id: 'asset-management', title: t('home.assets'), icon: 'business-outline' },
    { id: 'reports', title: t('home.reportsTitle'), icon: 'analytics-outline' },
  ];

  const navigateToScreen = (screenName) => {
    if (screenName === 'BalanceSheet') {
      navigation.navigate('BalanceSheet');
    } else if (screenName === 'ExpensesTracking') {
      navigation.navigate('ExpensesTracking');
    } else if (screenName === 'AssetManagement') {
      navigation.navigate('AssetManagement');
    } else if (screenName === 'Reports') {
      navigation.navigate('Reports');
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
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <View style={{ flex: 1 }}>
                <Text style={homeScreenStyles.title}>{t('home.title')}</Text>
                <Text style={homeScreenStyles.subtitle}>{t('home.subtitle')}</Text>
              </View>
              <LanguageSelector />
            </View>
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
                  <Ionicons name="business" size={20} color={colors.success[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>{formatCurrencyNoDecimals(totalAssets)}</Text>
                <Text style={homeScreenStyles.statLabel}>{t('home.asset')}</Text>
              </View>
              <View style={homeScreenStyles.statCard}>
                <View style={homeScreenStyles.statIconContainer}>
                  <Ionicons name="trending-down" size={20} color={colors.error[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>{formatCurrencyNoDecimals(monthlyExpensesTotal)}</Text>
                <Text style={homeScreenStyles.statLabel}>{t('home.spent')}</Text>
              </View>
              <View style={homeScreenStyles.statCard}>
                <View style={homeScreenStyles.statIconContainer}>
                  <Ionicons name="wallet" size={20} color={colors.info[500]} />
                </View>
                <Text style={homeScreenStyles.statNumber}>{formatCurrencyNoDecimals(balanceSheetBalance)}</Text>
                <Text style={homeScreenStyles.statLabel}>{t('home.balance')}</Text>
              </View>
            </View>

            {/* Financial Tools */}
            <View style={homeScreenStyles.menuContainer}>
              <View style={homeScreenStyles.sectionHeader}>
                <Text style={homeScreenStyles.menuTitle}>{t('home.financialTools')}</Text>
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
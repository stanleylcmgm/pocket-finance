import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { reportAnalyticStyles } from '../styles/report-analytic.styles';
import { useI18n } from '../i18n/i18n';
import { 
  getAssets, 
  getAssetCategories, 
  calculateTotalAssets,
  getTransactions,
  calculateMonthlySummary,
  formatCurrency,
  toMonthKey,
  filterTransactionsByMonth,
  getCategories
} from '../utils/data-utils';

import {
  getExpenses,
  getExpensesByYear,
  getExpensesByDateRange
} from '../utils/expenses-data';

const ReportAnalytic = () => {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    topAssetCategories: [],
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    currentMonthBalance: 0,
    yearToDateAverageExpenses: 0,
    recentMonthlyExpenses: [],
    maxMonthlyExpenses: 0,
  });

  // Display values for animation
  const [displayTotalAssets, setDisplayTotalAssets] = useState(0);
  const [displayIncome, setDisplayIncome] = useState(0);
  const [displayExpenses, setDisplayExpenses] = useState(0);
  const [displayBalance, setDisplayBalance] = useState(0);
  const [displaySavingsRate, setDisplaySavingsRate] = useState(0);
  const [displayYearToDateAverage, setDisplayYearToDateAverage] = useState(0);
  const [displayTopCategory1, setDisplayTopCategory1] = useState(0);
  const [displayTopCategory2, setDisplayTopCategory2] = useState(0);
  const [displayTopCategory3, setDisplayTopCategory3] = useState(0);
  const [displayMonth1, setDisplayMonth1] = useState(0);
  const [displayMonth2, setDisplayMonth2] = useState(0);
  const [displayMonth3, setDisplayMonth3] = useState(0);

  // Animated values
  const animatedTotalAssets = useRef(new Animated.Value(0)).current;
  const animatedIncome = useRef(new Animated.Value(0)).current;
  const animatedExpenses = useRef(new Animated.Value(0)).current;
  const animatedBalance = useRef(new Animated.Value(0)).current;
  const animatedSavingsRate = useRef(new Animated.Value(0)).current;
  const animatedYearToDateAverage = useRef(new Animated.Value(0)).current;
  const animatedTopCategory1 = useRef(new Animated.Value(0)).current;
  const animatedTopCategory2 = useRef(new Animated.Value(0)).current;
  const animatedTopCategory3 = useRef(new Animated.Value(0)).current;
  const animatedMonth1 = useRef(new Animated.Value(0)).current;
  const animatedMonth2 = useRef(new Animated.Value(0)).current;
  const animatedMonth3 = useRef(new Animated.Value(0)).current;

  // Track previous values to prevent unnecessary re-animations
  const prevValuesRef = useRef({ 
    totalAssets: 0, 
    income: 0, 
    expenses: 0, 
    balance: 0, 
    yearToDate: 0,
    topCategoriesLength: 0,
    recentMonthsLength: 0
  });
  const isAnimatingRef = useRef(false);
  const isMountedRef = useRef(false);
  const dashboardDataRef = useRef(dashboardData);

  // Load all dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Load assets and calculate total
      const assets = await getAssets();
      const totalAssets = calculateTotalAssets(assets);
      
      // Get asset categories and calculate top 3
      const assetCategories = await getAssetCategories();
      const categoryTotals = {};
      assets.forEach(asset => {
        const categoryId = asset.categoryId;
        if (!categoryTotals[categoryId]) {
          categoryTotals[categoryId] = 0;
        }
        categoryTotals[categoryId] += asset.amount || 0;
      });
      
      const topAssetCategories = Object.entries(categoryTotals)
        .map(([categoryId, total]) => ({
          categoryId,
          total,
          category: assetCategories.find(cat => cat.id === categoryId)
        }))
        .filter(item => item.category)
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      // Load current month transactions for balance sheet data (only formal transactions)
      const currentMonth = new Date();
      const monthKey = toMonthKey(currentMonth);
      const [allTransactions, allCategories] = await Promise.all([
        getTransactions(),
        getCategories()
      ]);
      
      // Filter to only formal transactions (exclude daily expenses)
      const categorySubtypeMap = {};
      allCategories.forEach(cat => {
        categorySubtypeMap[cat.id] = cat.subtype;
      });
      
      const formalTransactions = allTransactions.filter(tx => {
        // All income transactions are included
        if (tx.type === 'income') return true;
        // For expense transactions, exclude those with daily categories
        if (tx.type === 'expense') {
          if (!tx.categoryId) return true;
          const categorySubtype = categorySubtypeMap[tx.categoryId];
          return categorySubtype !== 'daily';
        }
        return true;
      });
      
      const monthlyTransactions = filterTransactionsByMonth(formalTransactions, monthKey);
      const monthlySummary = calculateMonthlySummary(monthlyTransactions);

      // Calculate year-to-date average expenses and recent monthly expenses using Expenses Tracking data
      const currentYear = currentMonth.getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      
      // Get expenses from Expenses Tracking (not Balance Sheet transactions)
      const allExpenses = await getExpenses();
      const yearExpenses = await getExpensesByDateRange(yearStart, yearEnd);
      
      
      // Helper function to get month key using LOCAL time (not UTC) to match user's selected date
      const getLocalMonthKey = (dateString) => {
        // Parse the date string - handle both ISO strings and other formats
        if (typeof dateString === 'string' && dateString.includes('T')) {
          // For ISO strings, extract the date part directly to avoid timezone conversion issues
          // Extract YYYY-MM-DD from ISO string (e.g., "2024-11-01T00:00:00.000Z" -> "2024-11-01")
          const datePart = dateString.split('T')[0];
          const [year, month] = datePart.split('-').map(Number);
          // Use the year and month directly from the ISO string date part
          // This matches what the user selected, regardless of timezone
          return `${year}-${String(month).padStart(2, '0')}`;
        } else {
          // For other date formats, use Date object with local time
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          return `${year}-${month}`;
        }
      };
      
      // Calculate YTD average by averaging monthly totals for the current year
      // Group all expenses by month for the current year
      const monthlyTotalsForYear = {};
      allExpenses.forEach(expense => {
        // Parse the date string to a Date object, then use LOCAL time methods
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        
        // Only include expenses from the current year
        if (expenseYear === currentYear) {
          const expenseMonth = expenseDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
          const expenseMonthKey = `${expenseYear}-${String(expenseMonth).padStart(2, '0')}`;
          
          if (!monthlyTotalsForYear[expenseMonthKey]) {
            monthlyTotalsForYear[expenseMonthKey] = 0;
          }
          monthlyTotalsForYear[expenseMonthKey] += expense.amountConverted || 0;
        }
      });
      
      // Calculate average of monthly totals
      const monthlyTotals = Object.values(monthlyTotalsForYear);
      const yearToDateAverage = monthlyTotals.length > 0 
        ? monthlyTotals.reduce((sum, total) => sum + total, 0) / monthlyTotals.length 
        : 0;

      // Calculate recent 3 monthly expenses (most recent 3 months that have expenses)
      // Group all expenses by month - use local time to get the correct month
      const monthlyExpensesMap = {};
      allExpenses.forEach(expense => {
        // Parse the date string to a Date object, then use LOCAL time methods
        // This ensures we get the month the user actually selected, not the UTC month
        const expenseDate = new Date(expense.date);
        // Use local time methods to get the month the user selected
        const year = expenseDate.getFullYear();
        const month = expenseDate.getMonth() + 1; // getMonth() returns 0-11, we need 1-12
        const expenseMonthKey = `${year}-${String(month).padStart(2, '0')}`;
        
        if (!monthlyExpensesMap[expenseMonthKey]) {
          monthlyExpensesMap[expenseMonthKey] = {
            monthKey: expenseMonthKey,
            amount: 0,
            year: year,
            month: month - 1 // Convert to 0-based month index (0-11) for display
          };
        }
        monthlyExpensesMap[expenseMonthKey].amount += expense.amountConverted || 0;
      });
      
      // Convert to array and sort by date (most recent first), then take top 3
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      const allMonthlyExpenses = Object.values(monthlyExpensesMap)
        .map(item => {
          // Parse monthKey (format: YYYY-MM) to get year and month
          const [year, month] = item.monthKey.split('-').map(Number);
          const monthIndex = month - 1; // Convert to 0-based index (0-11)
          
          return {
            month: monthNames[monthIndex],
            amount: item.amount,
            monthKey: item.monthKey,
            year: year,
            monthIndex: monthIndex
          };
        })
        .sort((a, b) => {
          // Sort by year first (descending), then by month (descending) - most recent first
          if (a.year !== b.year) {
            return b.year - a.year;
          }
          return b.monthIndex - a.monthIndex;
        })
        .slice(0, 3); // Take the 3 most recent months
      
      const recentMonthlyExpenses = allMonthlyExpenses;

      // Calculate max monthly expenses from current year monthly totals
      const monthlyTotalsArray = Object.values(monthlyTotalsForYear);
      const maxMonthlyExpenses = monthlyTotalsArray.length > 0 
        ? Math.max(...monthlyTotalsArray, yearToDateAverage) 
        : yearToDateAverage;

      const newDashboardData = {
        totalAssets,
        topAssetCategories,
        currentMonthIncome: monthlySummary.totalIncome,
        currentMonthExpenses: monthlySummary.totalExpenses,
        currentMonthBalance: monthlySummary.balance,
        yearToDateAverageExpenses: yearToDateAverage,
        recentMonthlyExpenses,
        maxMonthlyExpenses,
      };
      
      // Update data first, then update ref, then set loading to false
      // This ensures smooth transition without blinking
      setDashboardData(newDashboardData);
      dashboardDataRef.current = newDashboardData;
      
      // Set loading to false immediately after data is set
      // The state update will happen in the next render cycle
      setIsLoading(false);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setIsLoading(false);
    }
  }, []);

  // Update ref when dashboardData changes
  useEffect(() => {
    dashboardDataRef.current = dashboardData;
  }, [dashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Function to trigger animation
  const triggerAnimation = useCallback(() => {
    // Prevent multiple simultaneous animations
    if (isAnimatingRef.current) {
      return () => {};
    }
    
    isAnimatingRef.current = true;

    // Access current values from ref to get the latest data
    const currentData = dashboardDataRef.current;
    
    // Check if there's actually any data
    const hasData = currentData.totalAssets > 0 || 
                    currentData.currentMonthIncome > 0 || 
                    currentData.currentMonthExpenses > 0 ||
                    currentData.topAssetCategories.length > 0 ||
                    currentData.recentMonthlyExpenses.length > 0;
    
    // Don't animate if no data exists yet (don't check isLoading here as it may be stale)
    if (!hasData) {
      isAnimatingRef.current = false;
      return () => {};
    }
    
    // Calculate values
    const totalAssets = currentData.totalAssets;
    const income = currentData.currentMonthIncome;
    const expenses = currentData.currentMonthExpenses;
    const balance = currentData.currentMonthBalance;
    const yearToDateAverage = currentData.yearToDateAverageExpenses;
    
    // Calculate savings rate percentage
    const savingsRate = income > 0 ? (balance / income) * 100 : 0;
    
    // Top 3 categories
    const topCategory1 = currentData.topAssetCategories.length > 0 ? currentData.topAssetCategories[0].total : 0;
    const topCategory2 = currentData.topAssetCategories.length > 1 ? currentData.topAssetCategories[1].total : 0;
    const topCategory3 = currentData.topAssetCategories.length > 2 ? currentData.topAssetCategories[2].total : 0;
    
    // Recent 3 months expenses (sorted, most recent first)
    const month1 = currentData.recentMonthlyExpenses.length > 0 ? currentData.recentMonthlyExpenses[0].amount : 0;
    const month2 = currentData.recentMonthlyExpenses.length > 1 ? currentData.recentMonthlyExpenses[1].amount : 0;
    const month3 = currentData.recentMonthlyExpenses.length > 2 ? currentData.recentMonthlyExpenses[2].amount : 0;

    // Reset animated values to 0
    animatedTotalAssets.setValue(0);
    animatedIncome.setValue(0);
    animatedExpenses.setValue(0);
    animatedBalance.setValue(0);
    animatedSavingsRate.setValue(0);
    animatedYearToDateAverage.setValue(0);
    animatedTopCategory1.setValue(0);
    animatedTopCategory2.setValue(0);
    animatedTopCategory3.setValue(0);
    animatedMonth1.setValue(0);
    animatedMonth2.setValue(0);
    animatedMonth3.setValue(0);
    
    setDisplayTotalAssets(0);
    setDisplayIncome(0);
    setDisplayExpenses(0);
    setDisplayBalance(0);
    setDisplaySavingsRate(0);
    setDisplayYearToDateAverage(0);
    setDisplayTopCategory1(0);
    setDisplayTopCategory2(0);
    setDisplayTopCategory3(0);
    setDisplayMonth1(0);
    setDisplayMonth2(0);
    setDisplayMonth3(0);

    // Set up listeners to update display values
    const totalAssetsListener = animatedTotalAssets.addListener(({ value }) => {
      setDisplayTotalAssets(value);
    });
    const incomeListener = animatedIncome.addListener(({ value }) => {
      setDisplayIncome(value);
    });
    const expensesListener = animatedExpenses.addListener(({ value }) => {
      setDisplayExpenses(value);
    });
    const balanceListener = animatedBalance.addListener(({ value }) => {
      setDisplayBalance(value);
    });
    const savingsRateListener = animatedSavingsRate.addListener(({ value }) => {
      setDisplaySavingsRate(value);
    });
    const yearToDateListener = animatedYearToDateAverage.addListener(({ value }) => {
      setDisplayYearToDateAverage(value);
    });
    const topCategory1Listener = animatedTopCategory1.addListener(({ value }) => {
      setDisplayTopCategory1(value);
    });
    const topCategory2Listener = animatedTopCategory2.addListener(({ value }) => {
      setDisplayTopCategory2(value);
    });
    const topCategory3Listener = animatedTopCategory3.addListener(({ value }) => {
      setDisplayTopCategory3(value);
    });
    const month1Listener = animatedMonth1.addListener(({ value }) => {
      setDisplayMonth1(value);
    });
    const month2Listener = animatedMonth2.addListener(({ value }) => {
      setDisplayMonth2(value);
    });
    const month3Listener = animatedMonth3.addListener(({ value }) => {
      setDisplayMonth3(value);
    });

    // Start animations
    const animationDuration = 500;
    const fallbackTimer = setTimeout(() => {
      setDisplayTotalAssets(totalAssets);
      setDisplayIncome(income);
      setDisplayExpenses(expenses);
      setDisplayBalance(balance);
      setDisplaySavingsRate(savingsRate);
      setDisplayYearToDateAverage(yearToDateAverage);
      setDisplayTopCategory1(topCategory1);
      setDisplayTopCategory2(topCategory2);
      setDisplayTopCategory3(topCategory3);
      setDisplayMonth1(month1);
      setDisplayMonth2(month2);
      setDisplayMonth3(month3);
    }, animationDuration + 100);
    
    Animated.parallel([
      Animated.timing(animatedTotalAssets, {
        toValue: totalAssets,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedIncome, {
        toValue: income,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedExpenses, {
        toValue: expenses,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedBalance, {
        toValue: balance,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedSavingsRate, {
        toValue: savingsRate,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedYearToDateAverage, {
        toValue: yearToDateAverage,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory1, {
        toValue: topCategory1,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory2, {
        toValue: topCategory2,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedTopCategory3, {
        toValue: topCategory3,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedMonth1, {
        toValue: month1,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedMonth2, {
        toValue: month2,
        duration: animationDuration,
        useNativeDriver: false,
      }),
      Animated.timing(animatedMonth3, {
        toValue: month3,
        duration: animationDuration,
        useNativeDriver: false,
      }),
    ]).start((finished) => {
      clearTimeout(fallbackTimer);
      isAnimatingRef.current = false;
      if (finished) {
        // Ensure final values are set after animation completes
        setDisplayTotalAssets(totalAssets);
        setDisplayIncome(income);
        setDisplayExpenses(expenses);
        setDisplayBalance(balance);
        setDisplaySavingsRate(savingsRate);
        setDisplayYearToDateAverage(yearToDateAverage);
        setDisplayTopCategory1(topCategory1);
        setDisplayTopCategory2(topCategory2);
        setDisplayTopCategory3(topCategory3);
        setDisplayMonth1(month1);
        setDisplayMonth2(month2);
        setDisplayMonth3(month3);
      }
    });

    // Return cleanup function
    return () => {
      clearTimeout(fallbackTimer);
      isAnimatingRef.current = false;
      animatedTotalAssets.removeListener(totalAssetsListener);
      animatedIncome.removeListener(incomeListener);
      animatedExpenses.removeListener(expensesListener);
      animatedBalance.removeListener(balanceListener);
      animatedSavingsRate.removeListener(savingsRateListener);
      animatedYearToDateAverage.removeListener(yearToDateListener);
      animatedTopCategory1.removeListener(topCategory1Listener);
      animatedTopCategory2.removeListener(topCategory2Listener);
      animatedTopCategory3.removeListener(topCategory3Listener);
      animatedMonth1.removeListener(month1Listener);
      animatedMonth2.removeListener(month2Listener);
      animatedMonth3.removeListener(month3Listener);
    };
  }, []);

  // Reload data when screen comes into focus (when user navigates back from Expenses Tracking)
  useFocusEffect(
    useCallback(() => {
      let cleanup = null;
      let timer = null;
      let isCancelled = false;
      
      isMountedRef.current = true;
      
      const loadAndAnimate = async () => {
        try {
          await loadDashboardData();
          
          // Wait for state to update
          await new Promise(resolve => setTimeout(resolve, 150));
          
          // Check if we were cancelled
          if (isCancelled || !isMountedRef.current) {
            return;
          }
          
          // Only trigger animation if data exists
          const currentData = dashboardDataRef.current;
          const hasData = currentData.totalAssets > 0 || 
                          currentData.currentMonthIncome > 0 || 
                          currentData.currentMonthExpenses > 0 ||
                          currentData.topAssetCategories.length > 0 ||
                          currentData.recentMonthlyExpenses.length > 0;
          
          if (hasData && !isCancelled && isMountedRef.current) {
            // Update prevValuesRef to prevent re-triggering
            prevValuesRef.current.totalAssets = currentData.totalAssets;
            prevValuesRef.current.income = currentData.currentMonthIncome;
            prevValuesRef.current.expenses = currentData.currentMonthExpenses;
            prevValuesRef.current.balance = currentData.currentMonthBalance;
            prevValuesRef.current.yearToDate = currentData.yearToDateAverageExpenses;
            prevValuesRef.current.topCategoriesLength = currentData.topAssetCategories.length;
            prevValuesRef.current.recentMonthsLength = currentData.recentMonthlyExpenses.length;
            
            timer = setTimeout(() => {
              if (!isCancelled && isMountedRef.current) {
                cleanup = triggerAnimation();
              }
            }, 150);
          }
        } catch (error) {
          console.error('Error in loadAndAnimate:', error);
        }
      };
      
      loadAndAnimate();
      
      return () => {
        isCancelled = true;
        isMountedRef.current = false;
        if (timer) clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }, [loadDashboardData, triggerAnimation])
  );

  // Animate stats when values change (only for initial load, not for focus)
  useEffect(() => {
    // Skip if already mounted (useFocusEffect will handle it)
    if (isMountedRef.current) {
      return;
    }
    
    // Don't animate if still loading
    if (isLoading) {
      return;
    }
    
    // Check if there's actually any data
    const hasData = dashboardData.totalAssets > 0 || 
                    dashboardData.currentMonthIncome > 0 || 
                    dashboardData.currentMonthExpenses > 0 ||
                    dashboardData.topAssetCategories.length > 0 ||
                    dashboardData.recentMonthlyExpenses.length > 0;
    
    if (!hasData) {
      // No data - set to 0 without animation
      setDisplayTotalAssets(0);
      setDisplayIncome(0);
      setDisplayExpenses(0);
      setDisplayBalance(0);
      setDisplaySavingsRate(0);
      setDisplayYearToDateAverage(0);
      setDisplayTopCategory1(0);
      setDisplayTopCategory2(0);
      setDisplayTopCategory3(0);
      setDisplayMonth1(0);
      setDisplayMonth2(0);
      setDisplayMonth3(0);
      return;
    }
    
    // Only animate if values actually changed
    const totalAssetsChanged = prevValuesRef.current.totalAssets !== dashboardData.totalAssets;
    const incomeChanged = prevValuesRef.current.income !== dashboardData.currentMonthIncome;
    const expensesChanged = prevValuesRef.current.expenses !== dashboardData.currentMonthExpenses;
    const balanceChanged = prevValuesRef.current.balance !== dashboardData.currentMonthBalance;
    const yearToDateChanged = prevValuesRef.current.yearToDate !== dashboardData.yearToDateAverageExpenses;
    const topCategoriesChanged = prevValuesRef.current.topCategoriesLength !== dashboardData.topAssetCategories.length;
    const recentMonthsChanged = prevValuesRef.current.recentMonthsLength !== dashboardData.recentMonthlyExpenses.length;
    
    // Only trigger if something actually changed
    if (!totalAssetsChanged && !incomeChanged && !expensesChanged && !balanceChanged && !yearToDateChanged && !topCategoriesChanged && !recentMonthsChanged) {
      return;
    }
    
    // Update prevValuesRef BEFORE triggering animation to prevent re-triggers
    prevValuesRef.current.totalAssets = dashboardData.totalAssets;
    prevValuesRef.current.income = dashboardData.currentMonthIncome;
    prevValuesRef.current.expenses = dashboardData.currentMonthExpenses;
    prevValuesRef.current.balance = dashboardData.currentMonthBalance;
    prevValuesRef.current.yearToDate = dashboardData.yearToDateAverageExpenses;
    prevValuesRef.current.topCategoriesLength = dashboardData.topAssetCategories.length;
    prevValuesRef.current.recentMonthsLength = dashboardData.recentMonthlyExpenses.length;
    
    let cleanup = null;
    let timer = null;
    
    // Use a longer delay to ensure all state updates are complete
    timer = setTimeout(() => {
      // Double-check we're still not mounted (useFocusEffect takes precedence) and not animating
      if (!isMountedRef.current && !isAnimatingRef.current) {
        cleanup = triggerAnimation();
      }
    }, 200);
    
    return () => {
      if (timer) clearTimeout(timer);
      if (cleanup) cleanup();
    };
  }, [dashboardData.totalAssets, dashboardData.currentMonthIncome, dashboardData.currentMonthExpenses, dashboardData.currentMonthBalance, dashboardData.yearToDateAverageExpenses, dashboardData.topAssetCategories.length, dashboardData.recentMonthlyExpenses.length, isLoading, triggerAnimation]);

  // Prepare bar chart data
  const prepareBarChartData = () => {
    if (dashboardData.topAssetCategories.length === 0) {
      return [];
    }

    const maxValue = Math.max(...dashboardData.topAssetCategories.map(item => item.total));
    
    return dashboardData.topAssetCategories.map((item, index) => ({
      name: item.category.name,
      value: item.total,
      color: item.category.color,
      percentage: maxValue > 0 ? (item.total / maxValue) * 100 : 0,
    }));
  };

  // Render monthly expenses bar chart
  const renderMonthlyExpensesChart = () => {
    if (dashboardData.recentMonthlyExpenses.length === 0) {
      return (
        <Text style={reportAnalyticStyles.noDataText}>{t('reports.noMonthlyExpenseData')}</Text>
      );
    }

    return (
      <View style={reportAnalyticStyles.monthlyChartContainer}>
        {dashboardData.recentMonthlyExpenses.map((item, index) => {
          const displayAmount = index === 0 ? displayMonth1 : index === 1 ? displayMonth2 : displayMonth3;
          const percentage = dashboardData.maxMonthlyExpenses > 0 ? (displayAmount / dashboardData.maxMonthlyExpenses) * 100 : 0;
          const isAboveAverage = displayAmount > displayYearToDateAverage;
          
          // Define a nice color palette for the bars
          const barColors = ['#3498db', '#a06b6b', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
          const barColor = barColors[index % barColors.length];
          
          return (
            <View key={index} style={reportAnalyticStyles.monthlyChartItem}>
              <View style={reportAnalyticStyles.monthlyChartLabelContainer}>
                <Text style={reportAnalyticStyles.monthlyChartLabel}>{item.month}</Text>
                <Text style={reportAnalyticStyles.monthlyChartValue}>
                  {formatCurrency(
                    index === 0 ? displayMonth1 : 
                    index === 1 ? displayMonth2 : 
                    displayMonth3
                  )}
                </Text>
              </View>
              <View style={reportAnalyticStyles.monthlyChartBarContainer}>
                <View 
                  style={[
                    reportAnalyticStyles.monthlyChartBar,
                    { 
                      width: `${percentage}%`,
                      backgroundColor: barColor
                    }
                  ]} 
                />
                {/* YTD Average Line */}
                <View 
                  style={[
                    reportAnalyticStyles.averageLine,
                    { 
                      left: `${dashboardData.maxMonthlyExpenses > 0 ? (displayYearToDateAverage / dashboardData.maxMonthlyExpenses) * 100 : 0}%`
                    }
                  ]} 
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Render custom bar chart
  const renderCustomBarChart = () => {
    const chartData = prepareBarChartData();
    if (chartData.length === 0) {
      return (
        <Text style={reportAnalyticStyles.noDataText}>{t('reports.noDataAvailable')}</Text>
      );
    }

    return (
      <View style={reportAnalyticStyles.barChartContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={reportAnalyticStyles.barChartItem}>
            <View style={reportAnalyticStyles.barChartLabelContainer}>
              <Text style={reportAnalyticStyles.barChartLabel} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={reportAnalyticStyles.barChartValue}>
                {formatCurrency(
                  index === 0 ? displayTopCategory1 : 
                  index === 1 ? displayTopCategory2 : 
                  displayTopCategory3
                )}
              </Text>
            </View>
              <View style={reportAnalyticStyles.barChartBarContainer}>
                <View 
                  style={[
                    reportAnalyticStyles.barChartBar,
                    { 
                      width: `${dashboardData.topAssetCategories.length > 0 && dashboardData.topAssetCategories[index] ? 
                        (Math.max(...dashboardData.topAssetCategories.map(c => c.total)) > 0 ? 
                          ((index === 0 ? displayTopCategory1 : index === 1 ? displayTopCategory2 : displayTopCategory3) / 
                           Math.max(...dashboardData.topAssetCategories.map(c => c.total)) * 100) : 0) : 
                        item.percentage}%`,
                      backgroundColor: item.color 
                    }
                  ]} 
                />
              </View>
          </View>
        ))}
      </View>
    );
  };


  // Render loading state - only show if we truly have no data yet
  // Check both state and ref to avoid flashing
  const hasAnyData = dashboardData.totalAssets > 0 || 
                     dashboardData.currentMonthIncome > 0 || 
                     dashboardData.currentMonthExpenses > 0 ||
                     dashboardData.topAssetCategories.length > 0 ||
                     dashboardData.recentMonthlyExpenses.length > 0;
  
  const refHasData = dashboardDataRef.current.totalAssets > 0 || 
                     dashboardDataRef.current.currentMonthIncome > 0 || 
                     dashboardDataRef.current.currentMonthExpenses > 0 ||
                     dashboardDataRef.current.topAssetCategories.length > 0 ||
                     dashboardDataRef.current.recentMonthlyExpenses.length > 0;
  
  // Only show loading screen if truly loading AND no data exists
  if (isLoading && !hasAnyData && !refHasData) {
    return (
      <View style={reportAnalyticStyles.container}>
        <View style={reportAnalyticStyles.topBanner}>
          <Text style={reportAnalyticStyles.topBannerTitle}>{t('reports.title')}</Text>
          <Text style={reportAnalyticStyles.topBannerSubtitle}>{t('reports.subtitle')}</Text>
        </View>
        <View style={reportAnalyticStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={reportAnalyticStyles.loadingText}>{t('reports.loadingDashboardData')}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={reportAnalyticStyles.container}>
      {/* Top Banner */}
      <View style={reportAnalyticStyles.topBanner}>
        <Text style={reportAnalyticStyles.topBannerTitle}>{t('reports.title')}</Text>
        <Text style={reportAnalyticStyles.topBannerSubtitle}>{t('reports.subtitle')}</Text>
      </View>

      {/* Main Content Area */}
      <View style={reportAnalyticStyles.mainContent}>
        <ScrollView style={reportAnalyticStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={reportAnalyticStyles.scrollContent}>
            
            {/* Financial Advice Card */}
            <View style={reportAnalyticStyles.adviceCard}>
              <View style={reportAnalyticStyles.adviceHeader}>
                <View style={reportAnalyticStyles.adviceIcon}>
                  <Ionicons name="bulb" size={14} color="#2196f3" />
                </View>
                <Text style={reportAnalyticStyles.adviceTitle}>{t('reports.financialInsight')}</Text>
              </View>
              <Text style={reportAnalyticStyles.adviceMessage}>
                {t('reports.financialAdvice')}
              </Text>
            </View>
            
            {/* Total Assets Card */}
            <View style={reportAnalyticStyles.card}>
              <View style={reportAnalyticStyles.cardHeader}>
                <View style={reportAnalyticStyles.cardTitleContainer}>
                  <Ionicons name="wallet" size={24} color="#28a745" />
                  <Text style={reportAnalyticStyles.cardTitle}>{t('reports.totalAssets')}</Text>
                </View>
                <Text style={reportAnalyticStyles.cardAmount}>{formatCurrency(displayTotalAssets)}</Text>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <Text style={reportAnalyticStyles.cardSubtitle}>{t('reports.topAssetCategories')}</Text>                
                {/* Custom Bar Chart */}
                <View style={reportAnalyticStyles.chartContainer}>
                  {renderCustomBarChart()}
                </View>
              </View>
            </View>

            {/* Income & Expenses Card */}
            <View style={reportAnalyticStyles.card}>
              <View style={reportAnalyticStyles.cardHeader}>
                <View style={reportAnalyticStyles.cardTitleContainer}>
                  <Ionicons name="trending-up" size={24} color="#007bff" />
                  <Text style={reportAnalyticStyles.cardTitle}>{t('reports.monthlyBalance')}</Text>
                </View>
                <View style={reportAnalyticStyles.monthIndicator}>
                  <Text style={reportAnalyticStyles.monthText}>
                    {t('reports.asOf')} {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </Text>
                </View>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                {/* Enhanced Metrics Row */}
                <View style={reportAnalyticStyles.enhancedMetricsRow}>
                  <View style={[reportAnalyticStyles.enhancedMetricItem, reportAnalyticStyles.incomeMetric]}>
                    <View style={reportAnalyticStyles.metricIconContainer}>
                      <Ionicons name="arrow-up-circle" size={20} color="#28a745" />
                    </View>
                    <View style={reportAnalyticStyles.metricContent}>
                      <Text style={reportAnalyticStyles.enhancedMetricLabel}>{t('reports.income')}</Text>
                      <Text style={reportAnalyticStyles.enhancedMetricValue}>
                        {formatCurrency(displayIncome)}
                      </Text>
                    </View>
                  </View>
                  <View style={[reportAnalyticStyles.enhancedMetricItem, reportAnalyticStyles.expenseMetric]}>
                    <View style={reportAnalyticStyles.metricIconContainer}>
                      <Ionicons name="arrow-down-circle" size={20} color="#dc3545" />
                    </View>
                    <View style={reportAnalyticStyles.metricContent}>
                      <Text style={reportAnalyticStyles.enhancedMetricLabel}>{t('reports.expenses')}</Text>
                      <Text style={reportAnalyticStyles.enhancedMetricValue}>
                        {formatCurrency(displayExpenses)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Combined Balance & Savings Rate Section */}
                <View style={[
                  reportAnalyticStyles.combinedBalanceSavingsContainer,
                  { 
                    backgroundColor: displayBalance >= 0 ? '#e8f5e8' : '#fdeaea',
                    borderColor: displayBalance >= 0 ? '#c3e6c3' : '#f5c6cb'
                  }
                ]}>
                  <View style={reportAnalyticStyles.balanceSavingsHeader}>
                    <View style={reportAnalyticStyles.balanceSection}>
                      <View style={reportAnalyticStyles.balanceHeader}>
                        <Ionicons 
                          name={displayBalance >= 0 ? "checkmark-circle" : "alert-circle"} 
                          size={16} 
                          color={displayBalance >= 0 ? '#28a745' : '#dc3545'} 
                        />
                        <Text style={[
                          reportAnalyticStyles.balanceLabel,
                          { color: displayBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          {t('reports.netBalance')}
                        </Text>
                      </View>
                      <Text style={[
                        reportAnalyticStyles.balanceValue,
                        { color: displayBalance >= 0 ? '#28a745' : '#dc3545' }
                      ]}>
                        {formatCurrency(displayBalance)}
                      </Text>
                    </View>
                    
                    {displayIncome > 0 && (
                      <View style={reportAnalyticStyles.savingsSection}>
                        <Text style={[
                          reportAnalyticStyles.savingsRateLabel,
                          { color: displayBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          {t('reports.savingsRate')}
                        </Text>
                        <View style={reportAnalyticStyles.savingsRateBar}>
                          <View 
                            style={[
                              reportAnalyticStyles.savingsRateFill,
                              { 
                                width: `${Math.min(100, Math.max(0, displaySavingsRate))}%`,
                                backgroundColor: displayBalance >= 0 ? '#28a745' : '#dc3545'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[
                          reportAnalyticStyles.savingsRateValue,
                          { color: displayBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          {displaySavingsRate.toFixed(1)}%
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* Year-to-Date Average Expenses Card */}
            <View style={reportAnalyticStyles.card}>
              <View style={reportAnalyticStyles.cardHeader}>
                <View style={reportAnalyticStyles.cardTitleContainer}>
                  <Ionicons name="calendar" size={20} color="#fd7e14" />
                  <Text style={reportAnalyticStyles.cardTitleSmall}>{t('reports.yearToDateAverage')}</Text>
                </View>
                <Text style={reportAnalyticStyles.cardAmountSmall}>
                  {formatCurrency(displayYearToDateAverage)}
                </Text>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <Text style={reportAnalyticStyles.cardSubtitle}>{t('reports.recentMonthlyExpenses')}</Text>
                {/* Monthly Expenses Bar Chart */}
                <View style={reportAnalyticStyles.chartContainer}>
                  {renderMonthlyExpensesChart()}
                </View>
                <Text style={reportAnalyticStyles.cardDescription}>
                  {t('reports.averageMonthlyExpenses')} {new Date().getFullYear()}
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReportAnalytic;

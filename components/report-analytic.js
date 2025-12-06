import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { reportAnalyticStyles } from '../styles/report-analytic.styles';
import { useI18n } from '../i18n/i18n';
import AdBanner from './ad-banner';
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
import {
  getComprehensiveFinancialAnalysis,
  getTopFinancialInsight
} from '../utils/financial-analysis';

const ReportAnalytic = () => {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [financialAnalysis, setFinancialAnalysis] = useState(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  
  // Month picker state for YTD Average Expenses Card
  const [ytdSelectedMonth, setYtdSelectedMonth] = useState(new Date());
  const [ytdMonthPickerVisible, setYtdMonthPickerVisible] = useState(false);
  const [ytdSelectedYear, setYtdSelectedYear] = useState(new Date().getFullYear());
  const [ytdSelectedMonthIndex, setYtdSelectedMonthIndex] = useState(new Date().getMonth());
  const [isMonthSelected, setIsMonthSelected] = useState(false); // Track if user selected a specific month
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    topAssetCategories: [],
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    currentMonthBalance: 0,
    yearToDateAverageExpenses: 0,
    recentMonthlyExpenses: [],
    maxMonthlyExpenses: 0,
    selectedMonthCategoryExpenses: [], // Category totals for selected month
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

  // Load financial analysis
  const loadFinancialAnalysis = useCallback(async () => {
    try {
      setIsLoadingAnalysis(true);
      const analysis = await getComprehensiveFinancialAnalysis(t);
      setFinancialAnalysis(analysis);
    } catch (error) {
      console.error('Error loading financial analysis:', error);
      // Try to get at least the top insight
      try {
        const insight = await getTopFinancialInsight(t);
        setFinancialAnalysis({
          summary: {},
          health: { score: insight.healthScore, status: insight.healthStatus },
          trends: {},
          categories: {},
          advice: [{
            type: insight.type,
            title: insight.title,
            message: insight.message,
            priority: 1
          }]
        });
      } catch (err) {
        console.error('Error loading top insight:', err);
      }
    } finally {
      setIsLoadingAnalysis(false);
    }
  }, [t]);

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
      
      // Calculate YTD average by averaging monthly totals for the selected year
      // Use the selected month from YTD card, or default to current month
      const selectedYear = ytdSelectedMonth.getFullYear();
      
      // Group all expenses by month for the selected year
      const monthlyTotalsForYear = {};
      allExpenses.forEach(expense => {
        // Parse the date string to a Date object, then use LOCAL time methods
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        
        // Only include expenses from the selected year
        if (expenseYear === selectedYear) {
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

      // Calculate category expenses for selected month if a month is selected
      let selectedMonthCategoryExpenses = [];
      if (isMonthSelected) {
        const selectedMonthKey = `${ytdSelectedMonth.getFullYear()}-${String(ytdSelectedMonth.getMonth() + 1).padStart(2, '0')}`;
        
        // Get all expense categories
        const expenseCategories = allCategories.filter(cat => 
          cat.type === 'expense' && cat.subtype === 'daily'
        );
        
        // Filter expenses for the selected month
        const selectedMonthExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const expenseYear = expenseDate.getFullYear();
          const expenseMonth = expenseDate.getMonth() + 1;
          const expenseMonthKey = `${expenseYear}-${String(expenseMonth).padStart(2, '0')}`;
          return expenseMonthKey === selectedMonthKey;
        });
        
        // Group by category and calculate totals
        const categoryTotals = {};
        selectedMonthExpenses.forEach(expense => {
          if (expense.categoryId) {
            if (!categoryTotals[expense.categoryId]) {
              categoryTotals[expense.categoryId] = 0;
            }
            categoryTotals[expense.categoryId] += expense.amountConverted || 0;
          }
        });
        
        // Convert to array with category info and sort by amount descending
        selectedMonthCategoryExpenses = Object.entries(categoryTotals)
          .map(([categoryId, total]) => {
            const category = expenseCategories.find(cat => cat.id === categoryId);
            return {
              categoryId,
              total,
              category: category || { name: 'Unknown', color: '#6c757d' }
            };
          })
          .filter(item => item.total > 0)
          .sort((a, b) => b.total - a.total);
      }

      // Calculate selected month total if a month is selected
      const selectedMonthTotal = isMonthSelected && selectedMonthCategoryExpenses.length > 0
        ? selectedMonthCategoryExpenses.reduce((sum, item) => sum + item.total, 0)
        : 0;

      const newDashboardData = {
        totalAssets,
        topAssetCategories,
        currentMonthIncome: monthlySummary.totalIncome,
        currentMonthExpenses: monthlySummary.totalExpenses,
        currentMonthBalance: monthlySummary.balance,
        yearToDateAverageExpenses: yearToDateAverage,
        recentMonthlyExpenses,
        maxMonthlyExpenses,
        selectedMonthCategoryExpenses,
        selectedMonthTotal,
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
  }, [isMonthSelected, ytdSelectedMonth]);

  // Update ref when dashboardData changes
  useEffect(() => {
    dashboardDataRef.current = dashboardData;
  }, [dashboardData]);

  useEffect(() => {
    loadDashboardData();
    loadFinancialAnalysis();
  }, [loadDashboardData, loadFinancialAnalysis]);

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

  // Handle month selection for YTD card
  const handleYtdMonthSelect = (year, month) => {
    const newDate = new Date(year, month, 1);
    setYtdSelectedMonth(newDate);
    setIsMonthSelected(true); // Mark that a specific month is selected
    setYtdMonthPickerVisible(false);
    // Trigger data reload
    loadDashboardData();
  };

  // Render month picker modal for YTD card
  const renderYtdMonthPicker = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={ytdMonthPickerVisible}
      onRequestClose={() => setYtdMonthPickerVisible(false)}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 20,
      }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 24, 
          maxWidth: 340, 
          alignItems: 'center',
          height: 370,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 20,
          elevation: 10,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <View style={{ 
              width: 36, 
              height: 36, 
              borderRadius: 18, 
              backgroundColor: '#fff3e0', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: 10,
            }}>
              <Ionicons name="calendar" size={18} color="#fd7e14" />
            </View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#2c3e50' }}>{t('expenses.selectMonth')}</Text>
          </View>          
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: 20, 
            marginLeft: 5,
            marginBottom: 20,
            paddingVertical: 10,
            paddingRight: 30,
            backgroundColor: '#f8f9fa',
            borderRadius: 14,
            width: '100%',
          }}>
            <TouchableOpacity 
              onPress={() => setYtdSelectedYear(ytdSelectedYear - 1)}
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="chevron-back" size={20} color="#007bff" />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#2c3e50', minWidth: 90, textAlign: 'center' }}>
              {ytdSelectedYear}
            </Text>
            <TouchableOpacity 
              onPress={() => setYtdSelectedYear(ytdSelectedYear + 1)}
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons name="chevron-forward" size={20} color="#007bff" />
            </TouchableOpacity>
          </View>
          
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: 8, 
            marginBottom: 20,
            width: '100%',
          }}>
            {Array.from({ length: 12 }, (_, i) => {
              const isSelected = ytdSelectedMonthIndex === i && ytdSelectedMonth.getFullYear() === ytdSelectedYear;
              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 14,
                    borderWidth: 2,
                    borderColor: isSelected ? '#fd7e14' : '#e9ecef',
                    backgroundColor: isSelected ? '#fd7e14' : 'white',
                    minWidth: 60,
                    alignItems: 'center',
                    shadowColor: isSelected ? '#fd7e14' : '#000',
                    shadowOffset: { width: 0, height: isSelected ? 4 : 2 },
                    shadowOpacity: isSelected ? 0.3 : 0.08,
                    shadowRadius: isSelected ? 8 : 4,
                    elevation: isSelected ? 4 : 2,
                  }}
                  onPress={() => handleYtdMonthSelect(ytdSelectedYear, i)}
                >
                  <Text style={{
                    color: isSelected ? 'white' : '#6c757d',
                    fontSize: 13,
                    fontWeight: isSelected ? '700' : '600',
                  }}>
                    {new Date(2000, i).toLocaleString('default', { month: 'short' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          
          <TouchableOpacity
            style={{ 
              paddingVertical: 12, 
              paddingHorizontal: 28, 
              borderRadius: 12, 
              backgroundColor: '#f8f9fa',
              borderWidth: 1,
              borderColor: '#e9ecef',
              width: '100%',
              alignItems: 'center',
            }}
            onPress={() => setYtdMonthPickerVisible(false)}
          >
            <Text style={{ color: '#6c757d', fontSize: 15, fontWeight: '600' }}>{t('common.cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render monthly expenses bar chart
  const renderMonthlyExpensesChart = () => {
    // If a month is selected, show category expenses for that month
    if (isMonthSelected && dashboardData.selectedMonthCategoryExpenses && dashboardData.selectedMonthCategoryExpenses.length > 0) {
      const maxCategoryAmount = Math.max(...dashboardData.selectedMonthCategoryExpenses.map(item => item.total));
      
      return (
        <View style={reportAnalyticStyles.monthlyChartContainer}>
          {dashboardData.selectedMonthCategoryExpenses.map((item, index) => {
            const percentage = maxCategoryAmount > 0 ? (item.total / maxCategoryAmount) * 100 : 0;
            
            return (
              <View key={item.categoryId || index} style={reportAnalyticStyles.monthlyChartItem}>
                <View style={reportAnalyticStyles.monthlyChartLabelContainer}>
                  <Text style={reportAnalyticStyles.monthlyChartLabel} numberOfLines={1}>
                    {item.category.name}
                  </Text>
                  <Text style={reportAnalyticStyles.monthlyChartValue}>
                    {formatCurrency(item.total)}
                  </Text>
                </View>
                <View style={reportAnalyticStyles.monthlyChartBarContainer}>
                  <View 
                    style={[
                      reportAnalyticStyles.monthlyChartBar,
                      { 
                        width: `${percentage}%`,
                        backgroundColor: item.category.color || '#6c757d'
                      }
                    ]} 
                  />
                </View>
              </View>
            );
          })}
        </View>
      );
    }
    
    // Default: Show recent 3 monthly expenses
    if (!dashboardData.recentMonthlyExpenses || dashboardData.recentMonthlyExpenses.length === 0) {
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
            
            {/* Financial Analysis & Advice Card */}
            {financialAnalysis && (
              <View style={reportAnalyticStyles.adviceCard}>
                <View style={reportAnalyticStyles.adviceHeader}>
                  <View style={reportAnalyticStyles.adviceIcon}>
                    <Ionicons name="bulb" size={14} color="#2196f3" />
                  </View>
                  <Text style={reportAnalyticStyles.adviceTitle}>{t('reports.financialInsight')}</Text>
                </View>
                
                {/* Health Score */}
                {financialAnalysis.health && (
                  <View style={[
                    reportAnalyticStyles.healthScoreContainer,
                    {
                      backgroundColor: 
                        financialAnalysis.health.status === 'excellent' ? '#e8f5e9' :
                        financialAnalysis.health.status === 'good' ? '#e3f2fd' :
                        financialAnalysis.health.status === 'fair' ? '#fff3e0' :
                        financialAnalysis.health.status === 'poor' ? '#fdeaea' :
                        '#f5f5f5',
                      borderColor:
                        financialAnalysis.health.status === 'excellent' ? '#c8e6c9' :
                        financialAnalysis.health.status === 'good' ? '#bbdefb' :
                        financialAnalysis.health.status === 'fair' ? '#ffe0b2' :
                        financialAnalysis.health.status === 'poor' ? '#f5c6cb' :
                        '#e0e0e0'
                    }
                  ]}>
                    <View style={reportAnalyticStyles.healthScoreHeader}>
                      <Text style={reportAnalyticStyles.healthScoreLabel}>
                        {t('reports.financialHealth')}
                      </Text>
                      <Text style={[
                        reportAnalyticStyles.healthScoreValue,
                        {
                          color:
                            financialAnalysis.health.status === 'excellent' ? '#2e7d32' :
                            financialAnalysis.health.status === 'good' ? '#1976d2' :
                            financialAnalysis.health.status === 'fair' ? '#f57c00' :
                            financialAnalysis.health.status === 'poor' ? '#c62828' :
                            '#616161'
                        }
                      ]}>
                        {financialAnalysis.health.score}/100
                      </Text>
                    </View>
                    <View style={reportAnalyticStyles.healthScoreBar}>
                      <View 
                        style={[
                          reportAnalyticStyles.healthScoreFill,
                          {
                            width: `${financialAnalysis.health.score}%`,
                            backgroundColor:
                              financialAnalysis.health.status === 'excellent' ? '#4caf50' :
                              financialAnalysis.health.status === 'good' ? '#2196f3' :
                              financialAnalysis.health.status === 'fair' ? '#ff9800' :
                              financialAnalysis.health.status === 'poor' ? '#f44336' :
                              '#9e9e9e'
                          }
                        ]}
                      />
                    </View>
                    <Text style={[
                      reportAnalyticStyles.healthScoreStatus,
                      {
                        color:
                          financialAnalysis.health.status === 'excellent' ? '#2e7d32' :
                          financialAnalysis.health.status === 'good' ? '#1976d2' :
                          financialAnalysis.health.status === 'fair' ? '#f57c00' :
                          financialAnalysis.health.status === 'poor' ? '#c62828' :
                          '#616161'
                      }
                    ]}>
                      {t(`reports.healthStatus.${financialAnalysis.health.status}`)}
                    </Text>
                  </View>
                )}

                {/* Top Advice Items */}
                {financialAnalysis.advice && financialAnalysis.advice.length > 0 && (
                  <View style={reportAnalyticStyles.adviceListContainer}>
                    {financialAnalysis.advice.slice(0, 3).map((item, index) => (
                      <View 
                        key={index} 
                        style={[
                          reportAnalyticStyles.adviceItem,
                          {
                            borderLeftColor:
                              item.type === 'critical' ? '#f44336' :
                              item.type === 'warning' ? '#ff9800' :
                              item.type === 'positive' ? '#4caf50' :
                              '#2196f3'
                          }
                        ]}
                      >
                        <View style={reportAnalyticStyles.adviceItemHeader}>
                          <Ionicons 
                            name={
                              item.type === 'critical' ? 'alert-circle' :
                              item.type === 'warning' ? 'warning' :
                              item.type === 'positive' ? 'checkmark-circle' :
                              'information-circle'
                            }
                            size={16}
                            color={
                              item.type === 'critical' ? '#f44336' :
                              item.type === 'warning' ? '#ff9800' :
                              item.type === 'positive' ? '#4caf50' :
                              '#2196f3'
                            }
                            style={reportAnalyticStyles.adviceItemIcon}
                          />
                          <Text style={reportAnalyticStyles.adviceItemTitle}>
                            {item.title}
                          </Text>
                        </View>
                        <Text style={reportAnalyticStyles.adviceItemMessage}>
                          {item.message}
                        </Text>
                        {item.action && (
                          <Text style={reportAnalyticStyles.adviceItemAction}>
                            💡 {item.action}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                )}

                {/* Fallback message if no analysis available */}
                {(!financialAnalysis.advice || financialAnalysis.advice.length === 0) && (
                  <Text style={reportAnalyticStyles.adviceMessage}>
                    {t('reports.financialAdvice')}
                  </Text>
                )}

                {/* Loading state */}
                {isLoadingAnalysis && (
                  <View style={reportAnalyticStyles.analysisLoadingContainer}>
                    <ActivityIndicator size="small" color="#2196f3" />
                    <Text style={reportAnalyticStyles.analysisLoadingText}>
                      {t('reports.analyzing')}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Fallback if analysis not loaded yet */}
            {!financialAnalysis && !isLoadingAnalysis && (
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
            )}
            
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
              <View style={{ paddingBottom: 12, alignItems: 'flex-end' }}>
                <TouchableOpacity 
                  onPress={() => {
                    setYtdSelectedYear(ytdSelectedMonth.getFullYear());
                    setYtdSelectedMonthIndex(ytdSelectedMonth.getMonth());
                    setYtdMonthPickerVisible(true);
                  }}
                  style={{ 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    backgroundColor: '#ffffff',
                    borderWidth: 1,
                    borderColor: '#e9ecef',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <Ionicons name="calendar-outline" size={14} color="#fd7e14" style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 13, color: '#2c3e50', fontWeight: '600', marginRight: 4 }}>
                    {ytdSelectedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color="#6c757d" />
                </TouchableOpacity>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={reportAnalyticStyles.cardSubtitle}>
                      {isMonthSelected 
                        ? t('reports.expensesByCategory')
                        : t('reports.recentMonthlyExpenses')
                      }
                    </Text>
                    {isMonthSelected && dashboardData.selectedMonthTotal > 0 && (
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#2c3e50', marginTop: 4 }}>
                        {t('reports.total')}: {formatCurrency(dashboardData.selectedMonthTotal)}
                      </Text>
                    )}
                  </View>
                  {isMonthSelected && (
                    <TouchableOpacity
                      onPress={() => {
                        setIsMonthSelected(false);
                        setYtdSelectedMonth(new Date());
                        loadDashboardData();
                      }}
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: '#f8f9fa',
                        borderWidth: 1,
                        borderColor: '#e9ecef',
                      }}
                    >
                      <Text style={{ fontSize: 11, color: '#6c757d', fontWeight: '600' }}>
                        {t('common.reset')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                {/* Monthly Expenses Bar Chart */}
                <View style={reportAnalyticStyles.chartContainer}>
                  {renderMonthlyExpensesChart()}
                </View>
                {!isMonthSelected && (
                  <Text style={reportAnalyticStyles.cardDescription}>
                    {t('reports.averageMonthlyExpenses')} {ytdSelectedMonth.getFullYear()}
                  </Text>
                )}
              </View>
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

          </View>
        </ScrollView>
      </View>

      {/* Ad Banner at Bottom */}
      <AdBanner position="bottom" />
      
      {/* Month Picker Modal for YTD Card */}
      {renderYtdMonthPicker()}
    </View>
  );
};

export default ReportAnalytic;

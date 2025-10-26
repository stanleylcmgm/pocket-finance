import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme';
import { reportAnalyticStyles } from '../styles/report-analytic.styles';
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

      // Load current month transactions for balance sheet data
      const currentMonth = new Date();
      const monthKey = toMonthKey(currentMonth);
      const allTransactions = await getTransactions();
      const monthlyTransactions = filterTransactionsByMonth(allTransactions, monthKey);
      const monthlySummary = calculateMonthlySummary(monthlyTransactions);

      // Calculate year-to-date average expenses and recent monthly expenses using Expenses Tracking data
      const currentYear = currentMonth.getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
      
      // Get expenses from Expenses Tracking (not Balance Sheet transactions)
      const allExpenses = getExpenses();
      const yearExpenses = getExpensesByDateRange(yearStart, yearEnd);
      
      
      // Calculate YTD average by summing monthly expenses and dividing by months with data
      const monthlyExpensesForYTD = [];
      // Exclude current month - only include months from January to previous month
      for (let i = 0; i < currentMonth.getMonth(); i++) {
        // Manually create month key to avoid date constructor issues
        const monthKey = `${currentYear}-${String(i + 1).padStart(2, '0')}`;
        // Get expenses for this month from Expenses Tracking
        const monthExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const expenseMonthKey = toMonthKey(expenseDate);
          return expenseMonthKey === monthKey;
        });
        
        const monthTotal = monthExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
        monthlyExpensesForYTD.push(monthTotal);
      }
      
      const totalYearExpenses = monthlyExpensesForYTD.reduce((sum, amount) => sum + amount, 0);
      const monthsWithData = monthlyExpensesForYTD.filter(amount => amount > 0).length;
      const yearToDateAverage = monthsWithData > 0 ? totalYearExpenses / monthsWithData : 0;

      // Calculate recent 3 monthly expenses
      const recentMonthlyExpenses = [];
      
      for (let i = 2; i >= 0; i--) {
        const targetMonth = currentMonth.getMonth() - i;
        const targetYear = currentMonth.getFullYear();
        
        // Handle year rollover
        let actualYear = targetYear;
        let actualMonth = targetMonth;
        if (targetMonth < 0) {
          actualYear = targetYear - 1;
          actualMonth = 12 + targetMonth;
        }
        
        // Manually create month key
        const monthKey = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}`;
        
        // Get expenses for this month from Expenses Tracking
        const monthExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const expenseMonthKey = toMonthKey(expenseDate);
          return expenseMonthKey === monthKey;
        });
        
        const monthTotal = monthExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
        
        // Create month name for display
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthName = monthNames[actualMonth];
        
        recentMonthlyExpenses.push({
          month: monthName,
          amount: monthTotal,
          monthKey: monthKey
        });
      }
      
      // Sort by month descending (most recent first)
      recentMonthlyExpenses.sort((a, b) => {
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return monthOrder.indexOf(b.month) - monthOrder.indexOf(a.month);
      });

      // Calculate max monthly expenses from recent 12 months
      const monthlyExpenses12Months = [];
      for (let i = 11; i >= 0; i--) {
        const targetMonth = currentMonth.getMonth() - i;
        const targetYear = currentMonth.getFullYear();
        
        // Handle year rollover
        let actualYear = targetYear;
        let actualMonth = targetMonth;
        if (targetMonth < 0) {
          actualYear = targetYear - 1;
          actualMonth = 12 + targetMonth;
        }
        
        // Manually create month key
        const monthKey = `${actualYear}-${String(actualMonth + 1).padStart(2, '0')}`;
        
        // Get expenses for this month from Expenses Tracking
        const monthExpenses = allExpenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          const expenseMonthKey = toMonthKey(expenseDate);
          return expenseMonthKey === monthKey;
        });
        
        const monthTotal = monthExpenses.reduce((sum, expense) => sum + (expense.amountConverted || 0), 0);
        monthlyExpenses12Months.push(monthTotal);
      }
      const maxMonthlyExpenses = Math.max(...monthlyExpenses12Months, yearToDateAverage);

      setDashboardData({
        totalAssets,
        topAssetCategories,
        currentMonthIncome: monthlySummary.totalIncome,
        currentMonthExpenses: monthlySummary.totalExpenses,
        currentMonthBalance: monthlySummary.balance,
        yearToDateAverageExpenses: yearToDateAverage,
        recentMonthlyExpenses,
        maxMonthlyExpenses,
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Reload data when screen comes into focus (when user navigates back from Expenses Tracking)
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

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
        <Text style={reportAnalyticStyles.noDataText}>No monthly expense data available</Text>
      );
    }

    return (
      <View style={reportAnalyticStyles.monthlyChartContainer}>
        {dashboardData.recentMonthlyExpenses.map((item, index) => {
          const percentage = dashboardData.maxMonthlyExpenses > 0 ? (item.amount / dashboardData.maxMonthlyExpenses) * 100 : 0;
          const isAboveAverage = item.amount > dashboardData.yearToDateAverageExpenses;
          
          // Define a nice color palette for the bars
          const barColors = ['#3498db', '#a06b6b', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
          const barColor = barColors[index % barColors.length];
          
          return (
            <View key={index} style={reportAnalyticStyles.monthlyChartItem}>
              <View style={reportAnalyticStyles.monthlyChartLabelContainer}>
                <Text style={reportAnalyticStyles.monthlyChartLabel}>{item.month}</Text>
                <Text style={reportAnalyticStyles.monthlyChartValue}>
                  {formatCurrency(item.amount)}
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
                      left: `${(dashboardData.yearToDateAverageExpenses / dashboardData.maxMonthlyExpenses) * 100}%`
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
        <Text style={reportAnalyticStyles.noDataText}>No data available for chart</Text>
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
                {formatCurrency(item.value)}
              </Text>
            </View>
            <View style={reportAnalyticStyles.barChartBarContainer}>
              <View 
                style={[
                  reportAnalyticStyles.barChartBar,
                  { 
                    width: `${item.percentage}%`,
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


  // Render loading state
  if (isLoading) {
    return (
      <View style={reportAnalyticStyles.container}>
        <View style={reportAnalyticStyles.topBanner}>
          <Text style={reportAnalyticStyles.topBannerTitle}>Reports & Analytics</Text>
          <Text style={reportAnalyticStyles.topBannerSubtitle}>View insights and trends</Text>
        </View>
        <View style={reportAnalyticStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={reportAnalyticStyles.loadingText}>Loading dashboard data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={reportAnalyticStyles.container}>
      {/* Top Banner */}
      <View style={reportAnalyticStyles.topBanner}>
        <Text style={reportAnalyticStyles.topBannerTitle}>Reports & Analytics</Text>
        <Text style={reportAnalyticStyles.topBannerSubtitle}>View insights and trends</Text>
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
                <Text style={reportAnalyticStyles.adviceTitle}>Financial Insight</Text>
              </View>
              <Text style={reportAnalyticStyles.adviceMessage}>
                Based on your recent spending patterns, consider setting aside 20% of your income for savings. 
                Your expense tracking shows good discipline in monitoring daily costs. Keep up the great work!
              </Text>
            </View>
            
            {/* Total Assets Card */}
            <View style={reportAnalyticStyles.card}>
              <View style={reportAnalyticStyles.cardHeader}>
                <View style={reportAnalyticStyles.cardTitleContainer}>
                  <Ionicons name="wallet" size={24} color="#28a745" />
                  <Text style={reportAnalyticStyles.cardTitle}>Total Assets</Text>
                </View>
                <Text style={reportAnalyticStyles.cardAmount}>{formatCurrency(dashboardData.totalAssets)}</Text>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <Text style={reportAnalyticStyles.cardSubtitle}>Top Asset Categories</Text>                
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
                  <Text style={reportAnalyticStyles.cardTitle}>Monthly Balance</Text>
                </View>
                <View style={reportAnalyticStyles.monthIndicator}>
                  <Text style={reportAnalyticStyles.monthText}>
                    As of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
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
                      <Text style={reportAnalyticStyles.enhancedMetricLabel}>Income</Text>
                      <Text style={reportAnalyticStyles.enhancedMetricValue}>
                        {formatCurrency(dashboardData.currentMonthIncome)}
                      </Text>
                    </View>
                  </View>
                  <View style={[reportAnalyticStyles.enhancedMetricItem, reportAnalyticStyles.expenseMetric]}>
                    <View style={reportAnalyticStyles.metricIconContainer}>
                      <Ionicons name="arrow-down-circle" size={20} color="#dc3545" />
                    </View>
                    <View style={reportAnalyticStyles.metricContent}>
                      <Text style={reportAnalyticStyles.enhancedMetricLabel}>Expenses</Text>
                      <Text style={reportAnalyticStyles.enhancedMetricValue}>
                        {formatCurrency(dashboardData.currentMonthExpenses)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Combined Balance & Savings Rate Section */}
                <View style={[
                  reportAnalyticStyles.combinedBalanceSavingsContainer,
                  { 
                    backgroundColor: dashboardData.currentMonthBalance >= 0 ? '#e8f5e8' : '#fdeaea',
                    borderColor: dashboardData.currentMonthBalance >= 0 ? '#c3e6c3' : '#f5c6cb'
                  }
                ]}>
                  <View style={reportAnalyticStyles.balanceSavingsHeader}>
                    <View style={reportAnalyticStyles.balanceSection}>
                      <View style={reportAnalyticStyles.balanceHeader}>
                        <Ionicons 
                          name={dashboardData.currentMonthBalance >= 0 ? "checkmark-circle" : "alert-circle"} 
                          size={16} 
                          color={dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545'} 
                        />
                        <Text style={[
                          reportAnalyticStyles.balanceLabel,
                          { color: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          Net Balance
                        </Text>
                      </View>
                      <Text style={[
                        reportAnalyticStyles.balanceValue,
                        { color: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545' }
                      ]}>
                        {formatCurrency(dashboardData.currentMonthBalance)}
                      </Text>
                    </View>
                    
                    {dashboardData.currentMonthIncome > 0 && (
                      <View style={reportAnalyticStyles.savingsSection}>
                        <Text style={[
                          reportAnalyticStyles.savingsRateLabel,
                          { color: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          Savings Rate
                        </Text>
                        <View style={reportAnalyticStyles.savingsRateBar}>
                          <View 
                            style={[
                              reportAnalyticStyles.savingsRateFill,
                              { 
                                width: `${Math.min(100, Math.max(0, (dashboardData.currentMonthBalance / dashboardData.currentMonthIncome) * 100))}%`,
                                backgroundColor: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545'
                              }
                            ]} 
                          />
                        </View>
                        <Text style={[
                          reportAnalyticStyles.savingsRateValue,
                          { color: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545' }
                        ]}>
                          {((dashboardData.currentMonthBalance / dashboardData.currentMonthIncome) * 100).toFixed(1)}%
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
                  <Text style={reportAnalyticStyles.cardTitleSmall}>Year-to-Date Average</Text>
                </View>
                <Text style={reportAnalyticStyles.cardAmountSmall}>
                  {formatCurrency(dashboardData.yearToDateAverageExpenses)}
                </Text>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <Text style={reportAnalyticStyles.cardSubtitle}>Recent Monthly Expenses</Text>
                {/* Monthly Expenses Bar Chart */}
                <View style={reportAnalyticStyles.chartContainer}>
                  {renderMonthlyExpensesChart()}
                </View>
                <Text style={reportAnalyticStyles.cardDescription}>
                  Average monthly expenses for {new Date().getFullYear()}
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

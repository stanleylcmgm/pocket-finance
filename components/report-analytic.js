import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const ReportAnalytic = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalAssets: 0,
    topAssetCategories: [],
    currentMonthIncome: 0,
    currentMonthExpenses: 0,
    currentMonthBalance: 0,
    yearToDateAverageExpenses: 0,
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

      // Calculate year-to-date average expenses
      const currentYear = currentMonth.getFullYear();
      const yearStart = new Date(currentYear, 0, 1);
      const yearTransactions = allTransactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= yearStart && txDate <= currentMonth && tx.type === 'expense';
      });
      
      const monthsInYear = currentMonth.getMonth() + 1;
      const totalYearExpenses = yearTransactions.reduce((sum, tx) => sum + (tx.amountConverted || 0), 0);
      const yearToDateAverage = monthsInYear > 0 ? totalYearExpenses / monthsInYear : 0;

      setDashboardData({
        totalAssets,
        topAssetCategories,
        currentMonthIncome: monthlySummary.totalIncome,
        currentMonthExpenses: monthlySummary.totalExpenses,
        currentMonthBalance: monthlySummary.balance,
        yearToDateAverageExpenses: yearToDateAverage,
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

  // Render asset categories
  const renderAssetCategories = () => {
    if (dashboardData.topAssetCategories.length === 0) {
      return (
        <Text style={reportAnalyticStyles.noDataText}>No asset categories found</Text>
      );
    }

    return dashboardData.topAssetCategories.map((item, index) => (
      <View key={item.categoryId} style={reportAnalyticStyles.categoryItem}>
        <View style={reportAnalyticStyles.categoryInfo}>
          <View style={[reportAnalyticStyles.categoryIcon, { backgroundColor: item.category.color }]}>
            <Ionicons name={item.category.icon} size={16} color="white" />
          </View>
          <Text style={reportAnalyticStyles.categoryName}>{item.category.name}</Text>
        </View>
        <Text style={reportAnalyticStyles.categoryAmount}>
          {formatCurrency(item.total)}
        </Text>
      </View>
    ));
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
            
            {/* Combined Dashboard Card */}
            <View style={reportAnalyticStyles.card}>
              <View style={reportAnalyticStyles.cardHeader}>
                <View style={reportAnalyticStyles.cardTitleContainer}>
                  <Ionicons name="wallet" size={24} color="#28a745" />
                  <Text style={reportAnalyticStyles.cardTitle}>Dashboard Overview</Text>
                </View>
              </View>
              <View style={reportAnalyticStyles.cardContent}>
                <View style={reportAnalyticStyles.mixedLayoutContainer}>
                  {/* Row 1 - Total Assets spanning 2 columns */}
                  <View style={reportAnalyticStyles.assetsRow}>
                    <View style={reportAnalyticStyles.assetsColumn}>
                      <View style={reportAnalyticStyles.columnHeader}>
                        <Ionicons name="wallet" size={16} color="#28a745" />
                        <Text style={reportAnalyticStyles.columnTitle}>Total Assets</Text>
                      </View>
                      <View style={reportAnalyticStyles.assetContainer}>
                        <Text style={reportAnalyticStyles.assetAmount}>
                          {formatCurrency(dashboardData.totalAssets)}
                        </Text>
                        <Text style={reportAnalyticStyles.cardSubtitle}>Top Asset Categories</Text>
                        <View style={reportAnalyticStyles.categoriesList}>
                          {renderAssetCategories()}
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Row 2 - This Month and YTD Average as 2 columns */}
                  <View style={reportAnalyticStyles.financialRow}>
                    {/* This Month Financials */}
                    <View style={reportAnalyticStyles.financialColumn}>
                      <View style={reportAnalyticStyles.columnHeader}>
                        <Ionicons name="trending-up" size={16} color="#007bff" />
                        <Text style={reportAnalyticStyles.columnTitle}>Balance Sheet</Text>
                      </View>
                      <View style={reportAnalyticStyles.thisMonthContainer}>
                        {/* Income Block */}
                        <View style={reportAnalyticStyles.metricItemSmall}>
                          <Text style={reportAnalyticStyles.metricLabelSmall}>Income</Text>
                          <Text style={[reportAnalyticStyles.metricValueSmall, { color: '#28a745' }]}>
                            {formatCurrency(dashboardData.currentMonthIncome)}
                          </Text>
                        </View>
                        
                        {/* Expenses Block */}
                        <View style={reportAnalyticStyles.metricItemSmall}>
                          <Text style={reportAnalyticStyles.metricLabelSmall}>Expenses</Text>
                          <Text style={[reportAnalyticStyles.metricValueSmall, { color: '#dc3545' }]}>
                            {formatCurrency(dashboardData.currentMonthExpenses)}
                          </Text>
                        </View>
                        
                        {/* Balance Block */}
                        <View style={reportAnalyticStyles.balanceContainerSmall}>
                          <Text style={reportAnalyticStyles.balanceLabelSmall}>Balance</Text>
                          <Text style={[
                            reportAnalyticStyles.balanceValueSmall,
                            { color: dashboardData.currentMonthBalance >= 0 ? '#28a745' : '#dc3545' }
                          ]}>
                            {formatCurrency(dashboardData.currentMonthBalance)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* YTD Average */}
                    <View style={reportAnalyticStyles.financialColumn}>
                      <View style={reportAnalyticStyles.columnHeader}>
                        <Ionicons name="analytics" size={16} color="#fd7e14" />
                        <Text style={reportAnalyticStyles.columnTitle}>YTD Monthly Average</Text>
                      </View>
                      <View style={reportAnalyticStyles.ytdContainer}>
                        <Text style={reportAnalyticStyles.ytdAmount}>
                          {formatCurrency(dashboardData.yearToDateAverageExpenses)}
                        </Text>
                        <Text style={reportAnalyticStyles.ytdLabel}>Monthly Average</Text>
                        <Text style={reportAnalyticStyles.ytdDescription}>
                          Expenses for {new Date().getFullYear()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>

          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReportAnalytic;

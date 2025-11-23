import { StyleSheet } from 'react-native';

export const reportAnalyticStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Advice Card
  adviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  adviceIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
  },

  adviceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },

  adviceMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6c757d',
  },

  // Top Banner
  topBanner: {
    backgroundColor: '#100C20',
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  topBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  topBannerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6c757d',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },

  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },

  // Card styles
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },

  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },

  cardAmountSmall: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  cardContent: {
    gap: 12,
  },

  cardSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6c757d',
    marginBottom: 0,
  },

  cardDescription: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },

  // Asset categories
  categoriesList: {
    gap: 8,
  },

  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },

  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },

  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },

  categoryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },

  // Month indicator
  monthIndicator: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  monthText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6c757d',
  },

  // Enhanced metrics row
  enhancedMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 7,
  },

  enhancedMetricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  incomeMetric: {
    backgroundColor: '#f0f9f0',
    borderColor: '#c3e6c3',
  },

  expenseMetric: {
    backgroundColor: '#fdf2f2',
    borderColor: '#f5c6cb',
  },

  metricIconContainer: {
    marginRight: 12,
  },

  metricContent: {
    flex: 1,
  },

  enhancedMetricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '600',
  },

  enhancedMetricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Combined balance and savings container
  combinedBalanceSavingsContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 4,
  },

  balanceSavingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: -2,
    gap: 16,
  },

  balanceSection: {
    flex: 1,
    alignItems: 'center',
  },

  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },

  balanceLabel: {
    fontSize: 11,
    fontWeight: '700',
  },

  balanceValue: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: 'bold',
  },

  savingsSection: {
    flex: 1,
    alignItems: 'center',
  },

  savingsRateLabel: {
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '600',
  },

  savingsRateBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    marginBottom: 3,
    overflow: 'hidden',
    width: '100%',
  },

  savingsRateFill: {
    height: '100%',
    borderRadius: 2,
  },

  savingsRateValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  balanceStatus: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Legacy styles (keeping for backward compatibility)
  enhancedBalanceContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 16,
    alignItems: 'center',
  },

  enhancedBalanceLabel: {
    fontSize: 14,
    fontWeight: '700',
  },

  enhancedBalanceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  // Savings rate container
  savingsRateContainer: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  // Legacy styles (keeping for backward compatibility)
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },

  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },

  metricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },

  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Balance container
  balanceContainer: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },

  balanceLabel: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 4,
    fontWeight: '600',
  },

  // No data text
  noDataText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Chart container
  chartContainer: {
    marginVertical: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  // Custom bar chart styles
  barChartContainer: {
    gap: 8,
  },

  barChartItem: {
    gap: 6,
  },

  barChartLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  barChartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },

  barChartValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#28a745',
  },

  barChartBarContainer: {
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
  },

  barChartBar: {
    height: '100%',
    borderRadius: 10,
    minWidth: 2,
  },

  // Monthly expenses chart styles
  monthlyChartContainer: {
    gap: 8,
  },

  monthlyChartItem: {
    gap: 6,
  },

  monthlyChartLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthlyChartLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },

  monthlyChartValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fd7e14',
  },

  monthlyChartBarContainer: {
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    position: 'relative',
  },

  monthlyChartBar: {
    height: '100%',
    borderRadius: 6,
    minWidth: 2,
  },

  averageLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },

  // Financial Analysis Styles
  healthScoreContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 16,
    marginTop: 8,
  },

  healthScoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  healthScoreLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
  },

  healthScoreValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  healthScoreBar: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },

  healthScoreFill: {
    height: '100%',
    borderRadius: 4,
  },

  healthScoreStatus: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  adviceListContainer: {
    gap: 12,
    marginTop: 8,
  },

  adviceItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    marginBottom: 4,
  },

  adviceItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },

  adviceItemIcon: {
    marginRight: 4,
  },

  adviceItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    flex: 1,
  },

  adviceItemMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6c757d',
    marginBottom: 4,
  },

  adviceItemAction: {
    fontSize: 12,
    lineHeight: 16,
    color: '#495057',
    fontStyle: 'italic',
    marginTop: 4,
  },

  analysisLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },

  analysisLoadingText: {
    fontSize: 13,
    color: '#6c757d',
  },
});

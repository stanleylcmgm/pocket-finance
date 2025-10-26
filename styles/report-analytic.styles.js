import { StyleSheet } from 'react-native';

export const reportAnalyticStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Top Banner
  topBanner: {
    backgroundColor: 'white',
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
    shadowOffset: { width: 0, height: 4 },
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
    marginBottom: 6,
  },

  enhancedMetricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 6,
  },

  balanceSavingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: -3,
    gap: 20,
  },

  balanceSection: {
    flex: 1,
    alignItems: 'center',
  },

  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },

  balanceLabel: {
    fontSize: 12,
    fontWeight: '700',
  },

  balanceValue: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },

  savingsSection: {
    flex: 1,
    alignItems: 'center',
  },

  savingsRateLabel: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },

  savingsRateBar: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
    width: '100%',
  },

  savingsRateFill: {
    height: '100%',
    borderRadius: 3,
  },

  savingsRateValue: {
    fontSize: 12,
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
});

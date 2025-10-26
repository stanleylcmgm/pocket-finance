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

  cardContent: {
    gap: 12,
  },

  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
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

  // Metrics row
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

  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
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
});

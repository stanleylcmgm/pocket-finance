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

  // Smaller card styles for 2nd and 3rd blocks
  cardSmall: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  cardHeaderSmall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardTitleContainerSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },

  cardTitleSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2c3e50',
  },

  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
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

  cardContentSmall: {
    gap: 8,
  },

  cardSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },

  cardSubtitleSmall: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 4,
  },

  cardDescription: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 18,
  },

  cardDescriptionSmall: {
    fontSize: 11,
    color: '#6c757d',
    lineHeight: 16,
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

  metricsRowSmall: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  metricItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },

  metricItemSmall: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },

  metricLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
    fontWeight: '500',
  },

  metricLabelSmall: {
    fontSize: 10,
    color: '#6c757d',
    marginBottom: 2,
    fontWeight: '500',
  },

  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  metricValueSmall: {
    fontSize: 14,
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

  balanceContainerSmall: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },

  balanceLabel: {
    fontSize: 12,
    color: '#1976d2',
    marginBottom: 4,
    fontWeight: '600',
  },

  balanceLabelSmall: {
    fontSize: 10,
    color: '#1976d2',
    marginBottom: 2,
    fontWeight: '600',
  },

  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  balanceValueSmall: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // No data text
  noDataText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // Two column layout for combined card
  twoColumnContainer: {
    flexDirection: 'row',
    gap: 12,
  },

  // Three column layout for combined card
  threeColumnContainer: {
    flexDirection: 'row',
    gap: 8,
  },

  // Mixed layout container
  mixedLayoutContainer: {
    gap: 12,
  },

  // Row for Total Assets spanning 2 columns
  assetsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  // Total Assets column that spans 2/3 of the width
  assetsColumn: {
    flex: 2,
    gap: 8,
  },

  // Row for This Month and YTD Average
  financialRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
  },

  // Financial columns (This Month and YTD)
  financialColumn: {
    flex: 1,
    gap: 6,
  },

  column: {
    flex: 1,
    gap: 8,
  },

  columnThree: {
    flex: 1,
    gap: 6,
  },

  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },

  columnTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2c3e50',
  },

  // This Month column styles
  thisMonthContainer: {
    gap: 8,
  },

  // Asset container styles
  assetContainer: {
    gap: 8,
  },

  assetAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
    textAlign: 'center',
    marginBottom: 4,
  },

  // YTD Average column styles
  ytdContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },

  ytdAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fd7e14',
    marginBottom: 2,
  },

  ytdLabel: {
    fontSize: 10,
    color: '#856404',
    fontWeight: '600',
    marginBottom: 2,
  },

  ytdDescription: {
    fontSize: 9,
    color: '#856404',
    textAlign: 'center',
    lineHeight: 12,
  },
});

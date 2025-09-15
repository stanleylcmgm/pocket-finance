import { StyleSheet } from 'react-native';

export const balanceSheetStyles = StyleSheet.create({
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

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  headerRight: {
    width: 40,
  },

  // Month Navigator
  monthNavigator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  monthButton: {
    padding: 12,
    borderRadius: 8,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    gap: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#D2E2E8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  summaryCardCombined: {
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  summaryCardCombinedTint: {
    backgroundColor: '#eef7ff', // soft blue tint that keeps text readable
    borderColor: '#d6ecff',
  },
  combinedInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  combinedMetric: {
    flex: 1,
    alignItems: 'center',
  },
  combinedTwoLines: {
    width: '100%',
    gap: 6,
  },
  combinedLineText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  verticalDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#e9ecef',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  // Add Buttons
  addButtonsContainer: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  addButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Scroll View
  scrollView: {
    flex: 1,
    padding: 15,
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ced4da',
  },

  // Empty States
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  emptyStateButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },

  // Transaction Items
  itemCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#f8f9fa',
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  itemCategory: {
    fontSize: 13,
    color: '#6c757d',
    fontWeight: '500',
  },
  itemAccount: {
    fontSize: 13,
    color: '#6c757d',
  },
  itemDate: {
    fontSize: 13,
    color: '#6c757d',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginTop: 6,
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },

  // Month Picker Modal
  monthPickerContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  monthPickerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 24,
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 24,
  },
  yearText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    minWidth: 80,
    textAlign: 'center',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
    minWidth: 60,
    alignItems: 'center',
  },
  monthButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  monthButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  monthButtonTextSelected: {
    color: 'white',
  },

  // Entry Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '95%',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  keyboardDismissButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  inputUnfocused: {
    borderColor: '#ced4da',
  },
  inputFocused: {
    borderColor: '#007bff',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 8,
  },

  // Categories
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  categoryGridFixed: {
    height: 3 * 54, // approx 3 rows of tiles
    marginBottom: 12,
  },
  // New category list styles for one-per-row layout
  categoryListContainer: {
    marginBottom: 12,
  },
  categoryList: {
    gap: 8,
    paddingBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f1f3f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryRowName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
  },
  categoryRowDelete: {
    padding: 8,
    borderRadius: 8,
  },
  categoryTile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f1f3f5',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: '48%',
    flexGrow: 1,
  },
  categoryTileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  categoryTileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flexShrink: 1,
  },
  categoryTileDelete: {
    padding: 6,
    borderRadius: 8,
  },
  categoryAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  newPreviewText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
    gap: 6,
    minWidth: 100,
    marginBottom: 8,
  },
  categoryButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  categoryButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: 'white',
  },

  // Accounts
  accountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  accountButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: 'white',
  },
  accountButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  accountButtonText: {
    color: '#6c757d',
    fontSize: 14,
    fontWeight: '500',
  },
  accountButtonTextSelected: {
    color: 'white',
  },

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Simple toggle group (Income / Expense)
  toggleGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    paddingBottom: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  toggleButtonText: {
    color: '#495057',
    fontWeight: '700',
  },
  toggleButtonTextActive: {
    color: 'white',
  },

  // Category list item in manager
  categoryListItem: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f1f3f5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  // Icon options
  iconOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  iconOptionSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },

  // Color swatches
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
    marginBottom: 16,
  },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSwatchSelected: {
    borderColor: '#00000030',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    marginBottom: 12,
  },
}); 
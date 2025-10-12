import { StyleSheet } from 'react-native';

export const expensesTrackingStyles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    padding: 15,
  },
  summaryCard: {
    backgroundColor: '#FFDBA3',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#721c24',
    marginBottom: 8,
    fontWeight: '600',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 12,
    color: '#721c24',
    opacity: 0.8,
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
    shadowOffset: { width: 0, height: 14 },
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

  // Empty States
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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
    shadowOffset: { width: 0, height: 10 },
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
  todayBadge: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
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
  itemDate: {
    fontSize: 13,
    color: '#6c757d',
  },
  itemDescription: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc3545',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
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
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
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
    gap: 8,
    paddingBottom: 8,
  },
  categoryScrollContainer: {
    height: 130, 
    marginBottom: 20,
    borderWidth: 0, 
    borderRadius: 12,
    backgroundColor: 'white',
  },
  categoryScrollView: {
    flex: 1,
    padding: 8,
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

  // Modal Buttons
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
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

  // Date Input
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateInputText: {
    fontSize: 16,
    color: '#2c3e50',
  },

  // Date Picker Modal
  datePickerContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  datePickerCurrentDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
    flex: 1,
  },
  datePickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Calendar Styles
  calendarHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 1,
    minHeight: 40,
    minWidth: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  calendarDayEmpty: {
    backgroundColor: 'transparent',
  },
  calendarDayToday: {
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  calendarDaySelected: {
    backgroundColor: '#007bff',
  },
  calendarDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  calendarDayTextEmpty: {
    color: 'transparent',
  },
  calendarDayTextToday: {
    color: '#2196f3',
    fontWeight: 'bold',
  },
  calendarDayTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});

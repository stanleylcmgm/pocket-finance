// Data utility functions for Balance Sheet
import databaseService from './database-service';

// Generate a unique ID
export const generateId = () => {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format currency with proper locale
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Convert date to month key (YYYY-MM format)
export const toMonthKey = (date) => {
  return date.toISOString().slice(0, 7);
};

// Get start and end dates for a month
export const getMonthStartEnd = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  // Fix: Use the correct way to get the last day of the current month
  const endDate = new Date(year, month, 0, 23, 59, 59, 999);
  return { startDate, endDate };
};

// Check if a date falls within a month
export const isDateInMonth = (date, monthKey) => {
  const { startDate, endDate } = getMonthStartEnd(monthKey);
  return date >= startDate && date <= endDate;
};

// Get month name for display
export const getMonthDisplayName = (date, locale = 'en-US') => {
  return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
};

// Get short month name
export const getShortMonthName = (monthIndex, locale = 'en-US') => {
  return new Date(2000, monthIndex).toLocaleString(locale, { month: 'short' });
};

// Validate transaction data
export const validateTransaction = (transaction) => {
  const errors = [];
  
  if (!transaction.amountOriginal || transaction.amountOriginal <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!transaction.categoryId) {
    errors.push('Category is required');
  }
  
  if (!transaction.date) {
    errors.push('Date is required');
  }
  
  if (!transaction.type || !['income', 'expense'].includes(transaction.type)) {
    errors.push('Type must be either income or expense');
  }
  
  return errors;
};

// Calculate monthly summary from transactions
export const calculateMonthlySummary = (transactions) => {
  const totalIncome = transactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + (tx.amountConverted || 0), 0);
  
  const totalExpenses = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + (tx.amountConverted || 0), 0);
  
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
};

// Sort transactions by date (newest first) and creation time
export const sortTransactions = (transactions) => {
  return [...transactions].sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
};

// Filter transactions by month
export const filterTransactionsByMonth = (transactions, monthKey) => {
  const { startDate, endDate } = getMonthStartEnd(monthKey);
  return transactions.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate >= startDate && txDate <= endDate;
  });
};

// Get balance color based on amount
export const getBalanceColor = (balance) => {
  if (balance > 0) return 'positive';
  if (balance < 0) return 'negative';
  return 'neutral';
};

// Database-based data functions
export const getCategories = async () => {
  return await databaseService.getCategories();
};

export const getAccounts = async () => {
  return await databaseService.getAccounts();
};

export const getTransactions = async () => {
  return await databaseService.getTransactions();
};

export const getTransactionsByMonth = async (monthKey) => {
  return await databaseService.getTransactionsByMonth(monthKey);
};

export const createTransaction = async (transaction) => {
  return await databaseService.createTransaction(transaction);
};

export const updateTransaction = async (id, updates) => {
  return await databaseService.updateTransaction(id, updates);
};

export const deleteTransaction = async (id) => {
  return await databaseService.deleteTransaction(id);
};

export const createCategory = async (category) => {
  return await databaseService.createCategory(category);
};

export const updateCategory = async (id, updates) => {
  return await databaseService.updateCategory(id, updates);
};

export const deleteCategory = async (id) => {
  return await databaseService.deleteCategory(id);
};

export const createAccount = async (account) => {
  return await databaseService.createAccount(account);
};

export const updateAccount = async (id, updates) => {
  return await databaseService.updateAccount(id, updates);
};

export const deleteAccount = async (id) => {
  return await databaseService.deleteAccount(id);
};

// Asset utility functions
export const getAssetCategories = async () => {
  return await databaseService.getAssetCategories();
};

export const getAssetCategoryById = async (id) => {
  return await databaseService.getAssetCategoryById(id);
};

export const createAssetCategory = async (category) => {
  return await databaseService.createAssetCategory(category);
};

export const updateAssetCategory = async (id, updates) => {
  return await databaseService.updateAssetCategory(id, updates);
};

export const deleteAssetCategory = async (id) => {
  return await databaseService.deleteAssetCategory(id);
};

export const getAssets = async () => {
  return await databaseService.getAssets();
};

export const getAssetById = async (id) => {
  return await databaseService.getAssetById(id);
};

export const createAsset = async (asset) => {
  return await databaseService.createAsset(asset);
};

export const updateAsset = async (id, updates) => {
  return await databaseService.updateAsset(id, updates);
};

export const deleteAsset = async (id) => {
  return await databaseService.deleteAsset(id);
};

// Calculate total assets value
export const calculateTotalAssets = (assets) => {
  return assets.reduce((total, asset) => total + (asset.amount || 0), 0);
};

// Validate asset data
export const validateAsset = (asset) => {
  const errors = [];
  
  if (!asset.name || asset.name.trim() === '') {
    errors.push('Asset name is required');
  }
  
  if (!asset.amount || asset.amount <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!asset.categoryId) {
    errors.push('Category is required');
  }
  
  return errors;
};

// Ensure asset categories are seeded
export const ensureAssetCategoriesSeeded = async () => {
  return await databaseService.ensureAssetCategoriesSeeded();
};

// Force seed asset categories (useful for updates)
export const forceSeedAssetCategories = async () => {
  return await databaseService.forceSeedAssetCategories();
};

// Initialize database
export const initializeDatabase = async () => {
  return await databaseService.init();
};

// Delete all records from all tables
export const deleteAllRecords = async () => {
  try {
    const result = await databaseService.deleteAllRecords();
    return result;
  } catch (error) {
    console.error('Error in deleteAllRecords:', error);
    return { success: false, error: error.message };
  }
};


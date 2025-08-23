// Data utility functions for Balance Sheet

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

// Sample data for testing
export const sampleCategories = [
  { id: 'cat-salary', name: 'Salary', type: 'income', icon: 'cash', color: '#28a745' },
  { id: 'cat-freelance', name: 'Freelance', type: 'income', icon: 'laptop', color: '#17a2b8' },
  { id: 'cat-investment', name: 'Investment', type: 'income', icon: 'trending-up', color: '#ffc107' },
  { id: 'cat-other-income', name: 'Other', type: 'income', icon: 'add-circle', color: '#6c757d' },
  { id: 'cat-food', name: 'Food', type: 'expense', icon: 'restaurant', color: '#dc3545' },
  { id: 'cat-transport', name: 'Transport', type: 'expense', icon: 'car', color: '#fd7e14' },
  { id: 'cat-housing', name: 'Housing', type: 'expense', icon: 'home', color: '#6f42c1' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', icon: 'game-controller', color: '#e83e8c' },
  { id: 'cat-healthcare', name: 'Healthcare', type: 'expense', icon: 'medical', color: '#20c997' },
  { id: 'cat-shopping', name: 'Shopping', type: 'expense', icon: 'bag', color: '#6c757d' },
  { id: 'cat-bills', name: 'Bills', type: 'expense', icon: 'document-text', color: '#495057' },
  { id: 'cat-other-expense', name: 'Other', type: 'expense', icon: 'remove-circle', color: '#6c757d' },
];

export const sampleAccounts = [
  { id: 'acc-cash', name: 'Cash', type: 'cash' },
  { id: 'acc-bank', name: 'Bank', type: 'bank' },
  { id: 'acc-card', name: 'Credit Card', type: 'card' },
];

export const sampleTransactions = [
  {
    id: 'tx-1',
    type: 'income',
    amountOriginal: 5000,
    currencyCode: 'USD',
    amountConverted: 5000,
    fxRateToBase: null,
    categoryId: 'cat-salary',
    accountId: 'acc-bank',
    note: 'Monthly Salary',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachmentUris: [],
  },
  {
    id: 'tx-2',
    type: 'expense',
    amountOriginal: 120,
    currencyCode: 'USD',
    amountConverted: 120,
    fxRateToBase: null,
    categoryId: 'cat-food',
    accountId: 'acc-cash',
    note: 'Grocery Shopping',
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    attachmentUris: [],
  },
];

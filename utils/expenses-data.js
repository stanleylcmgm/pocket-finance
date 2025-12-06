// Shared expenses data storage for Expenses Tracking and Report Analytics
// Expenses are stored as transactions in the database with type='expense'
// Only expenses with categories that have subtype='daily' are considered Expenses Tracking expenses
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, getCategories } from './data-utils';

// Helper function to combine note and description for storage in transaction.note
const combineNoteAndDescription = (note, description) => {
  if (!description || description.trim() === '') {
    return note || null;
  }
  // Store as "note\n\nDESCRIPTION_SEPARATOR\n\ndescription" to allow parsing
  return `${note || ''}\n\nDESCRIPTION_SEPARATOR\n\n${description}`;
};

// Helper function to parse note and description from transaction.note
const parseNoteAndDescription = (note) => {
  if (!note) {
    return { note: null, description: null };
  }
  
  const separator = '\n\nDESCRIPTION_SEPARATOR\n\n';
  const separatorIndex = note.indexOf(separator);
  
  if (separatorIndex !== -1) {
    return {
      note: note.substring(0, separatorIndex).trim() || null,
      description: note.substring(separatorIndex + separator.length).trim() || null
    };
  }
  
  return { note: note.trim() || null, description: null };
};

// Convert transaction to expense format
const transactionToExpense = (transaction) => {
  const { note, description } = parseNoteAndDescription(transaction.note);
  return {
    id: transaction.id,
    type: transaction.type,
    amountOriginal: transaction.amountOriginal,
    currencyCode: transaction.currencyCode,
    amountConverted: transaction.amountConverted,
    fxRateToBase: transaction.fxRateToBase,
    categoryId: transaction.categoryId,
    accountId: transaction.accountId,
    note: note,
    description: description,
    date: transaction.date,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    attachmentUris: transaction.attachmentUris || [],
  };
};

// Convert expense to transaction format
const expenseToTransaction = (expense) => {
  const combinedNote = combineNoteAndDescription(expense.note, expense.description);
  return {
    type: expense.type || 'expense',
    amountOriginal: expense.amountOriginal,
    currencyCode: expense.currencyCode || 'USD',
    amountConverted: expense.amountConverted || expense.amountOriginal,
    fxRateToBase: expense.fxRateToBase,
    categoryId: expense.categoryId,
    accountId: expense.accountId || null,
    note: combinedNote,
    date: expense.date,
    attachmentUris: expense.attachmentUris || [],
  };
};

// Get all expenses (filtered to only type='expense' AND category subtype='daily')
// This ensures Expenses Tracking only shows daily expenses, not Balance Sheet formal transactions
export const getExpenses = async () => {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories()
  ]);
  
  // Create a map of category IDs to their subtype for quick lookup
  const categorySubtypeMap = {};
  categories.forEach(cat => {
    categorySubtypeMap[cat.id] = cat.subtype;
  });
  
  // Filter to only include expense transactions with daily category subtype
  const expenses = transactions
    .filter(tx => {
      // Must be an expense transaction
      if (tx.type !== 'expense') return false;
      // Must have a category
      if (!tx.categoryId) return false;
      // Category must have subtype='daily'
      const categorySubtype = categorySubtypeMap[tx.categoryId];
      return categorySubtype === 'daily';
    })
    .map(transactionToExpense);
  
  return expenses;
};

// Add a new expense
export const addExpense = async (expense) => {
  const transactionData = expenseToTransaction(expense);
  // If expense has an id, use it; otherwise let createTransaction generate one
  if (expense.id && expense.id.startsWith('exp-')) {
    // For expenses, we'll let the database generate the ID using the transaction system
    // The ID format will be tx-... which is fine
  }
  const created = await createTransaction(transactionData);
  return transactionToExpense(created);
};

// Update an existing expense
export const updateExpense = async (id, updatedExpense) => {
  const transactionData = expenseToTransaction(updatedExpense);
  const updated = await updateTransaction(id, transactionData);
  return transactionToExpense(updated);
};

// Delete an expense
export const deleteExpense = async (id) => {
  await deleteTransaction(id);
};

// Get expenses by month
export const getExpensesByMonth = async (monthKey) => {
  const expenses = await getExpenses();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonthKey = expenseDate.toISOString().slice(0, 7); // YYYY-MM format
    return expenseMonthKey === monthKey;
  });
};

// Get expenses by year
export const getExpensesByYear = async (year) => {
  const expenses = await getExpenses();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === year;
  });
};

// Get expenses by date range
export const getExpensesByDateRange = async (startDate, endDate) => {
  const expenses = await getExpenses();
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

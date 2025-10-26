// Shared expenses data storage for Expenses Tracking and Report Analytics
let expenses = [];

// Get all expenses
export const getExpenses = () => {
  return [...expenses]; // Return a copy to prevent direct mutation
};

// Add a new expense
export const addExpense = (expense) => {
  expenses.push(expense);
};

// Update an existing expense
export const updateExpense = (id, updatedExpense) => {
  const index = expenses.findIndex(exp => exp.id === id);
  if (index !== -1) {
    expenses[index] = updatedExpense;
  }
};

// Delete an expense
export const deleteExpense = (id) => {
  expenses = expenses.filter(exp => exp.id !== id);
};

// Get expenses by month
export const getExpensesByMonth = (monthKey) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const expenseMonthKey = expenseDate.toISOString().slice(0, 7); // YYYY-MM format
    return expenseMonthKey === monthKey;
  });
};

// Get expenses by year
export const getExpensesByYear = (year) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getFullYear() === year;
  });
};

// Get expenses by date range
export const getExpensesByDateRange = (startDate, endDate) => {
  return expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= startDate && expenseDate <= endDate;
  });
};

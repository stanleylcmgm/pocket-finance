// Database verification utility
import { 
  getCategories, 
  getAccounts, 
  getTransactions,
  deleteAllRecords
} from './data-utils';

export const verifyDatabaseUsage = async () => {
  try {
    // Test 1: Get data from database
    const dbCategories = await getCategories();
    const dbAccounts = await getAccounts();
    const dbTransactions = await getTransactions();
    
    return {
      databaseWorking: true,
      dbCategories: dbCategories.length,
      dbAccounts: dbAccounts.length,
      dbTransactions: dbTransactions.length,
      sampleCategory: dbCategories[0] || null,
      sampleAccount: dbAccounts[0] || null,
      sampleTransaction: dbTransactions[0] || null
    };
    
  } catch (error) {
    console.error('Database verification failed:', error);
    return {
      databaseWorking: false,
      error: error.message
    };
  }
};

// Function to test adding a new transaction to database
export const testDatabaseWrite = async () => {
  try {
    const { createTransaction } = await import('./data-utils');
    
    const testTransaction = {
      type: 'expense',
      amountOriginal: 99.99,
      currencyCode: 'USD',
      amountConverted: 99.99,
      categoryId: 'cat-food',
      accountId: 'acc-cash',
      note: 'Test transaction from database test',
      date: new Date().toISOString()
    };
    
    const newTransaction = await createTransaction(testTransaction);
    
    // Verify it was added
    const allTransactions = await getTransactions();
    
    return {
      success: true,
      newTransaction,
      totalTransactions: allTransactions.length
    };
    
  } catch (error) {
    console.error('Database write test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Function to delete all records from all tables
export const deleteAllDatabaseRecords = async () => {
  try {
    const result = await deleteAllRecords();
    
    if (result.success) {
      // Verify deletion by checking record counts
      const categories = await getCategories();
      const accounts = await getAccounts();
      const transactions = await getTransactions();
      
      return {
        success: true,
        message: 'All records deleted successfully',
        remainingRecords: {
          categories: categories.length,
          accounts: accounts.length,
          transactions: transactions.length
        }
      };
    } else {
      console.error('Failed to delete records:', result.error);
      return {
        success: false,
        error: result.error
      };
    }
    
  } catch (error) {
    console.error('Delete all records failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

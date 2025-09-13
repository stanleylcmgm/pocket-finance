// Database verification utility
import { 
  getCategories, 
  getAccounts, 
  getTransactions,
  deleteAllRecords
} from './data-utils';

export const verifyDatabaseUsage = async () => {
  console.log('=== DATABASE VERIFICATION ===');
  
  try {
    // Test 1: Get data from database
    console.log('1. Fetching data from DATABASE...');
    const dbCategories = await getCategories();
    const dbAccounts = await getAccounts();
    const dbTransactions = await getTransactions();
    
    console.log('Database Categories:', dbCategories.length, 'items');
    console.log('Database Accounts:', dbAccounts.length, 'items');
    console.log('Database Transactions:', dbTransactions.length, 'items');
    
    // Test 2: Show sample data from database
    console.log('\n2. Sample data from database:');
    if (dbCategories.length > 0) {
      console.log('First category:', dbCategories[0]);
    }
    if (dbAccounts.length > 0) {
      console.log('First account:', dbAccounts[0]);
    }
    if (dbTransactions.length > 0) {
      console.log('First transaction:', dbTransactions[0]);
    }
    
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
  console.log('\n=== DATABASE WRITE TEST ===');
  
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
    
    console.log('Creating test transaction...');
    const newTransaction = await createTransaction(testTransaction);
    console.log('New transaction created:', newTransaction);
    
    // Verify it was added
    const allTransactions = await getTransactions();
    console.log('Total transactions now:', allTransactions.length);
    
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
  console.log('\n=== DELETE ALL RECORDS ===');
  
  try {
    console.log('Deleting all records from all tables...');
    const result = await deleteAllRecords();
    console.log('Delete result:', result);
    
    if (result.success) {
      console.log('All records deleted successfully');
      
      // Verify deletion by checking record counts
      const categories = await getCategories();
      const accounts = await getAccounts();
      const transactions = await getTransactions();
      
      console.log('Verification - Remaining records:');
      console.log('- Categories:', categories.length);
      console.log('- Accounts:', accounts.length);
      console.log('- Transactions:', transactions.length);
      
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

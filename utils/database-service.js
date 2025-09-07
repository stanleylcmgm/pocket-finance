import * as SQLite from 'expo-sqlite';
import { sampleCategories, sampleAccounts, sampleTransactions } from './data-utils';

class DatabaseService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
  }

  // Initialize the database
  async init() {
    if (this.isInitialized) {
      return this.db;
    }

    try {
      this.db = await SQLite.openDatabaseAsync('star_finance.db');
      await this.createTables();
      await this.seedInitialData();
      this.isInitialized = true;
      console.log('Database initialized successfully');
      return this.db;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Create database tables
  async createTables() {
    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createAccountsTable = `
      CREATE TABLE IF NOT EXISTS accounts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('cash', 'bank', 'card')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createTransactionsTable = `
      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
        amount_original REAL NOT NULL,
        currency_code TEXT NOT NULL DEFAULT 'USD',
        amount_converted REAL NOT NULL,
        fx_rate_to_base REAL,
        category_id TEXT NOT NULL,
        account_id TEXT NOT NULL,
        note TEXT,
        date DATETIME NOT NULL,
        attachment_uris TEXT, -- JSON string array
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories (id),
        FOREIGN KEY (account_id) REFERENCES accounts (id)
      );
    `;

    await this.db.execAsync(createCategoriesTable);
    await this.db.execAsync(createAccountsTable);
    await this.db.execAsync(createTransactionsTable);
  }

  // Seed initial data
  async seedInitialData() {
    // Check if data already exists
    const categoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    if (categoryCount.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Insert sample categories
    for (const category of sampleCategories) {
      await this.db.runAsync(
        'INSERT INTO categories (id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)',
        [category.id, category.name, category.type, category.icon, category.color]
      );
    }

    // Insert sample accounts
    for (const account of sampleAccounts) {
      await this.db.runAsync(
        'INSERT INTO accounts (id, name, type) VALUES (?, ?, ?)',
        [account.id, account.name, account.type]
      );
    }

    // Insert sample transactions
    for (const transaction of sampleTransactions) {
      await this.db.runAsync(
        `INSERT INTO transactions (
          id, type, amount_original, currency_code, amount_converted, 
          fx_rate_to_base, category_id, account_id, note, date, attachment_uris
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.type,
          transaction.amountOriginal,
          transaction.currencyCode,
          transaction.amountConverted,
          transaction.fxRateToBase,
          transaction.categoryId,
          transaction.accountId,
          transaction.note,
          transaction.date,
          JSON.stringify(transaction.attachmentUris || [])
        ]
      );
    }

    console.log('Initial data seeded successfully');
  }

  // Categories CRUD operations
  async getCategories() {
    await this.init();
    const categories = await this.db.getAllAsync('SELECT * FROM categories ORDER BY name');
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      icon: cat.icon,
      color: cat.color
    }));
  }

  async getCategoryById(id) {
    await this.init();
    const category = await this.db.getFirstAsync('SELECT * FROM categories WHERE id = ?', [id]);
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      type: category.type,
      icon: category.icon,
      color: category.color
    };
  }

  async createCategory(category) {
    await this.init();
    const id = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      'INSERT INTO categories (id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)',
      [id, category.name, category.type, category.icon, category.color]
    );
    return { ...category, id };
  }

  async updateCategory(id, updates) {
    await this.init();
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    await this.db.runAsync(
      `UPDATE categories SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return this.getCategoryById(id);
  }

  async deleteCategory(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Accounts CRUD operations
  async getAccounts() {
    await this.init();
    const accounts = await this.db.getAllAsync('SELECT * FROM accounts ORDER BY name');
    return accounts.map(acc => ({
      id: acc.id,
      name: acc.name,
      type: acc.type
    }));
  }

  async getAccountById(id) {
    await this.init();
    const account = await this.db.getFirstAsync('SELECT * FROM accounts WHERE id = ?', [id]);
    if (!account) return null;
    return {
      id: account.id,
      name: account.name,
      type: account.type
    };
  }

  async createAccount(account) {
    await this.init();
    const id = `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      'INSERT INTO accounts (id, name, type) VALUES (?, ?, ?)',
      [id, account.name, account.type]
    );
    return { ...account, id };
  }

  async updateAccount(id, updates) {
    await this.init();
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    await this.db.runAsync(
      `UPDATE accounts SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return this.getAccountById(id);
  }

  async deleteAccount(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM accounts WHERE id = ?', [id]);
  }

  // Transactions CRUD operations
  async getTransactions() {
    await this.init();
    const transactions = await this.db.getAllAsync(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
             a.name as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      ORDER BY t.date DESC, t.created_at DESC
    `);
    
    return transactions.map(tx => ({
      id: tx.id,
      type: tx.type,
      amountOriginal: tx.amount_original,
      currencyCode: tx.currency_code,
      amountConverted: tx.amount_converted,
      fxRateToBase: tx.fx_rate_to_base,
      categoryId: tx.category_id,
      accountId: tx.account_id,
      note: tx.note,
      date: tx.date,
      createdAt: tx.created_at,
      updatedAt: tx.updated_at,
      attachmentUris: tx.attachment_uris ? JSON.parse(tx.attachment_uris) : [],
      categoryName: tx.category_name,
      categoryIcon: tx.category_icon,
      categoryColor: tx.category_color,
      accountName: tx.account_name
    }));
  }

  async getTransactionById(id) {
    await this.init();
    const transaction = await this.db.getFirstAsync(`
      SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color,
             a.name as account_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN accounts a ON t.account_id = a.id
      WHERE t.id = ?
    `, [id]);
    
    if (!transaction) return null;
    
    return {
      id: transaction.id,
      type: transaction.type,
      amountOriginal: transaction.amount_original,
      currencyCode: transaction.currency_code,
      amountConverted: transaction.amount_converted,
      fxRateToBase: transaction.fx_rate_to_base,
      categoryId: transaction.category_id,
      accountId: transaction.account_id,
      note: transaction.note,
      date: transaction.date,
      createdAt: transaction.created_at,
      updatedAt: transaction.updated_at,
      attachmentUris: transaction.attachment_uris ? JSON.parse(transaction.attachment_uris) : [],
      categoryName: transaction.category_name,
      categoryIcon: transaction.category_icon,
      categoryColor: transaction.category_color,
      accountName: transaction.account_name
    };
  }

  async createTransaction(transaction) {
    await this.init();
    const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      `INSERT INTO transactions (
        id, type, amount_original, currency_code, amount_converted, 
        fx_rate_to_base, category_id, account_id, note, date, attachment_uris
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        transaction.type,
        transaction.amountOriginal,
        transaction.currencyCode || 'USD',
        transaction.amountConverted || transaction.amountOriginal,
        transaction.fxRateToBase,
        transaction.categoryId,
        transaction.accountId,
        transaction.note,
        transaction.date,
        JSON.stringify(transaction.attachmentUris || [])
      ]
    );
    return this.getTransactionById(id);
  }

  async updateTransaction(id, updates) {
    await this.init();
    const setClause = Object.keys(updates).map(key => {
      if (key === 'attachmentUris') return 'attachment_uris = ?';
      return `${key} = ?`;
    }).join(', ');
    
    const values = Object.entries(updates).map(([key, value]) => {
      if (key === 'attachmentUris') return JSON.stringify(value || []);
      return value;
    });
    
    await this.db.runAsync(
      `UPDATE transactions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return this.getTransactionById(id);
  }

  async deleteTransaction(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  }

  // Get transactions by month
  async getTransactionsByMonth(monthKey) {
    const transactions = await this.getTransactions();
    const { startDate, endDate } = this.getMonthStartEnd(monthKey);
    
    return transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startDate && txDate <= endDate;
    });
  }

  // Helper method for month calculations
  getMonthStartEnd(monthKey) {
    const [year, month] = monthKey.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    return { startDate, endDate };
  }

  // Get database statistics
  async getStats() {
    await this.init();
    const categoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    const accountCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM accounts');
    const transactionCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM transactions');
    
    return {
      categories: categoryCount.count,
      accounts: accountCount.count,
      transactions: transactionCount.count
    };
  }

  // Close database connection
  async close() {
    if (this.db) {
      await this.db.closeAsync();
      this.isInitialized = false;
    }
  }
}

// Export singleton instance
export default new DatabaseService();

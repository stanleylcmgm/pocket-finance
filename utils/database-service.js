import * as SQLite from 'expo-sqlite';

// Sample data for initial database seeding
const sampleCategories = [
  { id: 'cat-salary', name: 'Salary', type: 'income', subtype: 'formal', icon: 'briefcase', color: '#28a745' },
  { id: 'cat-part-time', name: 'Part Time', type: 'income', subtype: 'formal', icon: 'time', color: '#17a2b8' },
  { id: 'cat-investment', name: 'Investment', type: 'income', subtype: 'formal', icon: 'trending-up', color: '#ffc107' },
  
  // Daily expense categories for Expenses Tracking
  { id: 'cat-travel', name: 'Travel', type: 'expense', subtype: 'daily', icon: 'airplane', color: '#007bff' },
  { id: 'cat-breakfast', name: 'Breakfast', type: 'expense', subtype: 'daily', icon: 'sunny', color: '#ffc107' },
  { id: 'cat-lunch', name: 'Lunch', type: 'expense', subtype: 'daily', icon: 'restaurant', color: '#fd7e14' },
  { id: 'cat-dinner', name: 'Dinner', type: 'expense', subtype: 'daily', icon: 'moon', color: '#6f42c1' },
  { id: 'cat-mobile', name: 'Mobile', type: 'expense', subtype: 'daily', icon: 'phone-portrait', color: '#28a745' },
  { id: 'cat-entertainment', name: 'Entertainment', type: 'expense', subtype: 'daily', icon: 'game-controller', color: '#e83e8c' },
  { id: 'cat-household', name: 'Household', type: 'expense', subtype: 'daily', icon: 'home', color: '#17a2b8' },
  { id: 'cat-buy', name: 'Buy', type: 'expense', subtype: 'daily', icon: 'cart', color: '#dc3545' },
  
  // Formal expense categories for Balance Sheet
  { id: 'cat-mpf', name: 'MPF', type: 'expense', subtype: 'formal', icon: 'shield-checkmark', color: '#007bff' },
  { id: 'cat-insurance', name: 'Insurance', type: 'expense', subtype: 'formal', icon: 'umbrella', color: '#17a2b8' },
  { id: 'cat-tax', name: 'Tax', type: 'expense', subtype: 'formal', icon: 'document-text', color: '#dc3545' },
  { id: 'cat-housing', name: 'Housing', type: 'expense', subtype: 'formal', icon: 'home', color: '#6f42c1' },
  { id: 'cat-water', name: 'Water', type: 'expense', subtype: 'formal', icon: 'water', color: '#007bff' },
  { id: 'cat-electricity', name: 'Electricity', type: 'expense', subtype: 'formal', icon: 'flash', color: '#ffc107' },
  { id: 'cat-towngas', name: 'Towngas', type: 'expense', subtype: 'formal', icon: 'flame', color: '#fd7e14' },
  { id: 'cat-mobile-network', name: 'Mobile Network', type: 'expense', subtype: 'formal', icon: 'phone-portrait', color: '#28a745' },
  { id: 'cat-broadband', name: 'Broadband', type: 'expense', subtype: 'formal', icon: 'wifi', color: '#6c757d' },
  { id: 'cat-family', name: 'Family', type: 'expense', subtype: 'formal', icon: 'people', color: '#e83e8c' },
  { id: 'cat-personal-expenses', name: 'Personal Expenses', type: 'expense', subtype: 'other', icon: 'person', color: '#6c757d' },
];

const sampleAccounts = [
  { id: 'acc-cash', name: 'Cash', type: 'cash' },
  { id: 'acc-bank', name: 'Bank', type: 'bank' },
  { id: 'acc-card', name: 'Credit Card', type: 'card' },
];

const sampleAssetCategories = [
  // Asset Management Categories as requested
  { id: 'cat-bank', name: 'Bank', icon: 'library', color: '#007bff' },
  { id: 'cat-investment', name: 'Investment', icon: 'trending-up', color: '#ffc107' },
  { id: 'cat-insurance', name: 'Insurance', icon: 'umbrella', color: '#17a2b8' },
  { id: 'cat-mpf', name: 'MPF', icon: 'shield-checkmark', color: '#28a745' },
];

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
        subtype TEXT CHECK (subtype IN ('formal', 'daily', 'other')),
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Add subtype column to existing categories table if it doesn't exist
    const addSubtypeColumn = `
      ALTER TABLE categories ADD COLUMN subtype TEXT CHECK (subtype IN ('formal', 'daily', 'other'));
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

    const createAssetCategoriesTable = `
      CREATE TABLE IF NOT EXISTS asset_categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        color TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createAssetsTable = `
      CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        amount REAL NOT NULL,
        category_id TEXT NOT NULL,
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES asset_categories (id)
      );
    `;

    await this.db.execAsync(createCategoriesTable);
    
    // Try to add subtype column to existing categories table
    try {
      await this.db.execAsync(addSubtypeColumn);
    } catch (error) {
      // Column might already exist, ignore the error silently
      if (!error.message.includes('duplicate column name')) {
        console.error('Unexpected error adding subtype column:', error);
      }
    }
    
    await this.db.execAsync(createAccountsTable);
    await this.db.execAsync(createTransactionsTable);
    await this.db.execAsync(createAssetCategoriesTable);
    await this.db.execAsync(createAssetsTable);
    
    // Migrate existing categories to have appropriate subtypes
    await this.migrateExistingCategories();
  }

  // Migrate existing categories to have appropriate subtypes
  async migrateExistingCategories() {
    try {
      // Check if there are categories without subtypes
      const categoriesWithoutSubtype = await this.db.getAllAsync(
        'SELECT * FROM categories WHERE subtype IS NULL'
      );
      
      if (categoriesWithoutSubtype.length > 0) {
        // Define category mappings
        const categoryMappings = {
          // Income categories
          'cat-salary': 'formal',
          'cat-part-time': 'formal', 
          'cat-investment': 'formal',
          
          // Daily expense categories
          'cat-travel': 'daily',
          'cat-breakfast': 'daily',
          'cat-lunch': 'daily',
          'cat-dinner': 'daily',
          'cat-mobile': 'daily',
          'cat-entertainment': 'daily',
          'cat-household': 'daily',
          'cat-buy': 'daily',
          
          // Formal expense categories
          'cat-mpf': 'formal',
          'cat-insurance': 'formal',
          'cat-tax': 'formal',
          'cat-housing': 'formal',
          'cat-water': 'formal',
          'cat-electricity': 'formal',
          'cat-towngas': 'formal',
          'cat-mobile-network': 'formal',
          'cat-broadband': 'formal',
          'cat-family': 'formal',
          'cat-personal-expenses': 'other'
        };
        
        // Update each category with its appropriate subtype
        for (const category of categoriesWithoutSubtype) {
          const subtype = categoryMappings[category.id] || 'other';
          await this.db.runAsync(
            'UPDATE categories SET subtype = ? WHERE id = ?',
            [subtype, category.id]
          );
        }
      }
    } catch (error) {
      console.error('Error migrating categories:', error);
    }
  }

  // Seed initial data
  async seedInitialData() {
    // Check if transaction categories already exist
    const categoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    const assetCategoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM asset_categories');
    
    if (categoryCount.count > 0 && assetCategoryCount.count > 0) {
      return;
    }

    // Insert sample categories (only if they don't exist)
    if (categoryCount.count === 0) {
      for (const category of sampleCategories) {
        await this.db.runAsync(
          'INSERT INTO categories (id, name, type, subtype, icon, color) VALUES (?, ?, ?, ?, ?, ?)',
          [category.id, category.name, category.type, category.subtype, category.icon, category.color]
        );
      }
    }

    // Insert sample accounts (only if they don't exist)
    const accountCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM accounts');
    if (accountCount.count === 0) {
      for (const account of sampleAccounts) {
        await this.db.runAsync(
          'INSERT INTO accounts (id, name, type) VALUES (?, ?, ?)',
          [account.id, account.name, account.type]
        );
      }
    }

    // Insert sample asset categories (only if they don't exist)
    if (assetCategoryCount.count === 0) {
      for (const category of sampleAssetCategories) {
        await this.db.runAsync(
          'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
          [category.id, category.name, category.icon, category.color]
        );
      }
    }

    // Note: Sample assets are not seeded by default
    // Users can add their own assets through the UI

    // Insert sample transactions (only if they don't exist)
    const transactionCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM transactions');
    if (transactionCount.count === 0) {
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
    }
  }

  // Categories CRUD operations
  async getCategories() {
    await this.init();
    const categories = await this.db.getAllAsync('SELECT * FROM categories ORDER BY name');
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      type: cat.type,
      subtype: cat.subtype,
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
      subtype: category.subtype,
      icon: category.icon,
      color: category.color
    };
  }

  async createCategory(category) {
    await this.init();
    const id = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      'INSERT INTO categories (id, name, type, subtype, icon, color) VALUES (?, ?, ?, ?, ?, ?)',
      [id, category.name, category.type, category.subtype || 'other', category.icon, category.color]
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

  // Asset Categories CRUD operations
  async getAssetCategories() {
    await this.init();
    const categories = await this.db.getAllAsync('SELECT * FROM asset_categories ORDER BY name');
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon,
      color: cat.color
    }));
  }

  async getAssetCategoryById(id) {
    await this.init();
    const category = await this.db.getFirstAsync('SELECT * FROM asset_categories WHERE id = ?', [id]);
    if (!category) return null;
    return {
      id: category.id,
      name: category.name,
      icon: category.icon,
      color: category.color
    };
  }

  async createAssetCategory(category) {
    await this.init();
    const id = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
      [id, category.name, category.icon, category.color]
    );
    return { ...category, id };
  }

  async updateAssetCategory(id, updates) {
    await this.init();
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    await this.db.runAsync(
      `UPDATE asset_categories SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return this.getAssetCategoryById(id);
  }

  async deleteAssetCategory(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM asset_categories WHERE id = ?', [id]);
  }

  // Assets CRUD operations
  async getAssets() {
    await this.init();
    const assets = await this.db.getAllAsync(`
      SELECT a.*, ac.name as category_name, ac.icon as category_icon, ac.color as category_color
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id = ac.id
      ORDER BY a.created_at DESC
    `);
    
    return assets.map(asset => ({
      id: asset.id,
      name: asset.name,
      amount: asset.amount,
      categoryId: asset.category_id,
      note: asset.note,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
      categoryName: asset.category_name,
      categoryIcon: asset.category_icon,
      categoryColor: asset.category_color
    }));
  }

  async getAssetById(id) {
    await this.init();
    const asset = await this.db.getFirstAsync(`
      SELECT a.*, ac.name as category_name, ac.icon as category_icon, ac.color as category_color
      FROM assets a
      LEFT JOIN asset_categories ac ON a.category_id = ac.id
      WHERE a.id = ?
    `, [id]);
    
    if (!asset) return null;
    
    return {
      id: asset.id,
      name: asset.name,
      amount: asset.amount,
      categoryId: asset.category_id,
      note: asset.note,
      createdAt: asset.created_at,
      updatedAt: asset.updated_at,
      categoryName: asset.category_name,
      categoryIcon: asset.category_icon,
      categoryColor: asset.category_color
    };
  }

  async createAsset(asset) {
    await this.init();
    const id = `asset-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await this.db.runAsync(
      'INSERT INTO assets (id, name, amount, category_id, note) VALUES (?, ?, ?, ?, ?)',
      [id, asset.name, asset.amount, asset.categoryId, asset.note]
    );
    return this.getAssetById(id);
  }

  async updateAsset(id, updates) {
    await this.init();
    const setClause = Object.keys(updates).map(key => {
      if (key === 'categoryId') return 'category_id = ?';
      return `${key} = ?`;
    }).join(', ');
    
    const values = Object.entries(updates).map(([key, value]) => {
      if (key === 'categoryId') return value;
      return value;
    });
    
    await this.db.runAsync(
      `UPDATE assets SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [...values, id]
    );
    return this.getAssetById(id);
  }

  async deleteAsset(id) {
    await this.init();
    await this.db.runAsync('DELETE FROM assets WHERE id = ?', [id]);
  }

  // Get database statistics
  async getStats() {
    await this.init();
    const categoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    const accountCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM accounts');
    const transactionCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM transactions');
    const assetCategoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM asset_categories');
    const assetCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM assets');
    
    return {
      categories: categoryCount.count,
      accounts: accountCount.count,
      transactions: transactionCount.count,
      assetCategories: assetCategoryCount.count,
      assets: assetCount.count
    };
  }

  // Check and seed asset categories if missing
  async ensureAssetCategoriesSeeded() {
    await this.init();
    
    const assetCategoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM asset_categories');
    
    if (assetCategoryCount.count === 0) {
      // Insert asset categories
      for (const category of sampleAssetCategories) {
        await this.db.runAsync(
          'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
          [category.id, category.name, category.icon, category.color]
        );
      }
    }
  }

  // Force seed asset categories (useful for updates)
  async forceSeedAssetCategories() {
    await this.init();
    
    // Clear existing asset categories
    await this.db.runAsync('DELETE FROM asset_categories');
    
    // Insert new asset categories
    for (const category of sampleAssetCategories) {
      await this.db.runAsync(
        'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
        [category.id, category.name, category.icon, category.color]
      );
    }
  }

  // Delete all records from all tables
  async deleteAllRecords() {
    try {
      // Delete from all tables in the correct order (respecting foreign key constraints)
      await this.db.runAsync('DELETE FROM transactions');
      await this.db.runAsync('DELETE FROM assets');
      await this.db.runAsync('DELETE FROM asset_categories');
      await this.db.runAsync('DELETE FROM categories');
      await this.db.runAsync('DELETE FROM accounts');
      
      return { success: true, message: 'All records deleted successfully' };
    } catch (error) {
      console.error('Error deleting all records:', error);
      return { success: false, error: error.message };
    }
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

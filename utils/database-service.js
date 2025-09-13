import * as SQLite from 'expo-sqlite';

// Sample data for initial database seeding
const sampleCategories = [
  { id: 'cat-salary', name: 'Salary', type: 'income', icon: 'briefcase', color: '#28a745' },
  { id: 'cat-part-time', name: 'Part Time', type: 'income', icon: 'time', color: '#17a2b8' },
  { id: 'cat-investment', name: 'Investment', type: 'income', icon: 'trending-up', color: '#ffc107' },
  
  { id: 'cat-mpf', name: 'MPF', type: 'expense', icon: 'shield-checkmark', color: '#007bff' },
  { id: 'cat-insurance', name: 'Insurance', type: 'expense', icon: 'umbrella', color: '#17a2b8' },
  { id: 'cat-tax', name: 'Tax', type: 'expense', icon: 'document-text', color: '#dc3545' },
  { id: 'cat-housing', name: 'Housing', type: 'expense', icon: 'home', color: '#6f42c1' },
  { id: 'cat-water', name: 'Water', type: 'expense', icon: 'water', color: '#007bff' },
  { id: 'cat-electricity', name: 'Electricity', type: 'expense', icon: 'flash', color: '#ffc107' },
  { id: 'cat-towngas', name: 'Towngas', type: 'expense', icon: 'flame', color: '#fd7e14' },
  { id: 'cat-mobile-network', name: 'Mobile Network', type: 'expense', icon: 'phone-portrait', color: '#28a745' },
  { id: 'cat-broadband', name: 'Broadband', type: 'expense', icon: 'wifi', color: '#6c757d' },
  { id: 'cat-family', name: 'Family', type: 'expense', icon: 'people', color: '#e83e8c' },
  { id: 'cat-personal-expenses', name: 'Personal Expenses', type: 'expense', icon: 'person', color: '#6c757d' },
];

const sampleAccounts = [
  { id: 'acc-cash', name: 'Cash', type: 'cash' },
  { id: 'acc-bank', name: 'Bank', type: 'bank' },
  { id: 'acc-card', name: 'Credit Card', type: 'card' },
];

const sampleAssetCategories = [
  // Real Estate & Property
  { id: 'cat-primary-residence', name: 'Primary Residence', icon: 'home', color: '#28a745' },
  { id: 'cat-rental-property', name: 'Rental Property', icon: 'business', color: '#17a2b8' },
  { id: 'cat-vacation-home', name: 'Vacation Home', icon: 'umbrella', color: '#20c997' },
  { id: 'cat-land', name: 'Land', icon: 'leaf', color: '#28a745' },
  
  // Financial Assets
  { id: 'cat-savings-account', name: 'Savings Account', icon: 'library', color: '#007bff' },
  { id: 'cat-checking-account', name: 'Checking Account', icon: 'card', color: '#6c757d' },
  { id: 'cat-money-market', name: 'Money Market', icon: 'trending-up', color: '#007bff' },
  { id: 'cat-certificate-deposit', name: 'Certificate of Deposit', icon: 'document-text', color: '#007bff' },
  
  // Investment Assets
  { id: 'cat-stocks', name: 'Stocks', icon: 'trending-up', color: '#ffc107' },
  { id: 'cat-bonds', name: 'Bonds', icon: 'shield-checkmark', color: '#28a745' },
  { id: 'cat-mutual-funds', name: 'Mutual Funds', icon: 'bar-chart', color: '#ffc107' },
  { id: 'cat-etf', name: 'ETF', icon: 'analytics', color: '#ffc107' },
  { id: 'cat-crypto', name: 'Cryptocurrency', icon: 'logo-bitcoin', color: '#fd7e14' },
  { id: 'cat-retirement-401k', name: '401(k)', icon: 'time', color: '#6f42c1' },
  { id: 'cat-retirement-ira', name: 'IRA', icon: 'time', color: '#6f42c1' },
  { id: 'cat-pension', name: 'Pension', icon: 'time', color: '#6f42c1' },
  
  // Physical Assets
  { id: 'cat-vehicle', name: 'Vehicle', icon: 'car', color: '#6c757d' },
  { id: 'cat-boat', name: 'Boat', icon: 'boat', color: '#17a2b8' },
  { id: 'cat-aircraft', name: 'Aircraft', icon: 'airplane', color: '#17a2b8' },
  { id: 'cat-motorcycle', name: 'Motorcycle', icon: 'bicycle', color: '#6c757d' },
  
  // Collectibles & Valuables
  { id: 'cat-jewelry', name: 'Jewelry', icon: 'diamond', color: '#e83e8c' },
  { id: 'cat-art', name: 'Art & Antiques', icon: 'color-palette', color: '#e83e8c' },
  { id: 'cat-collectibles', name: 'Collectibles', icon: 'gift', color: '#e83e8c' },
  { id: 'cat-precious-metals', name: 'Precious Metals', icon: 'diamond', color: '#ffc107' },
  { id: 'cat-watches', name: 'Watches', icon: 'time', color: '#6c757d' },
  
  // Business & Professional
  { id: 'cat-business-equipment', name: 'Business Equipment', icon: 'desktop', color: '#6f42c1' },
  { id: 'cat-intellectual-property', name: 'Intellectual Property', icon: 'bulb', color: '#6f42c1' },
  { id: 'cat-business-ownership', name: 'Business Ownership', icon: 'business', color: '#6f42c1' },
  { id: 'cat-franchise', name: 'Franchise', icon: 'storefront', color: '#6f42c1' },
  
  // Insurance & Annuities
  { id: 'cat-life-insurance', name: 'Life Insurance', icon: 'heart', color: '#dc3545' },
  { id: 'cat-annuity', name: 'Annuity', icon: 'calendar', color: '#dc3545' },
  { id: 'cat-long-term-care', name: 'Long-term Care', icon: 'medical', color: '#dc3545' },
  
  // Other Assets
  { id: 'cat-loans-receivable', name: 'Loans Receivable', icon: 'cash', color: '#28a745' },
  { id: 'cat-other', name: 'Other', icon: 'ellipsis-horizontal', color: '#6c757d' },
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
    await this.db.execAsync(createAccountsTable);
    await this.db.execAsync(createTransactionsTable);
    await this.db.execAsync(createAssetCategoriesTable);
    await this.db.execAsync(createAssetsTable);
  }

  // Seed initial data
  async seedInitialData() {
    // Check if transaction categories already exist
    const categoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM categories');
    const assetCategoryCount = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM asset_categories');
    
    if (categoryCount.count > 0 && assetCategoryCount.count > 0) {
      console.log('Database already has data, skipping seed');
      return;
    }

    // Insert sample categories (only if they don't exist)
    if (categoryCount.count === 0) {
      for (const category of sampleCategories) {
        await this.db.runAsync(
          'INSERT INTO categories (id, name, type, icon, color) VALUES (?, ?, ?, ?, ?)',
          [category.id, category.name, category.type, category.icon, category.color]
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
      console.log('No asset categories found, seeding...');
      
      // Insert asset categories
      for (const category of sampleAssetCategories) {
        await this.db.runAsync(
          'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
          [category.id, category.name, category.icon, category.color]
        );
      }
      
      console.log('Asset categories seeded successfully');
    }
  }

  // Force seed asset categories (useful for updates)
  async forceSeedAssetCategories() {
    await this.init();
    
    console.log('Force seeding asset categories...');
    
    // Clear existing asset categories
    await this.db.runAsync('DELETE FROM asset_categories');
    
    // Insert new asset categories
    for (const category of sampleAssetCategories) {
      await this.db.runAsync(
        'INSERT INTO asset_categories (id, name, icon, color) VALUES (?, ?, ?, ?)',
        [category.id, category.name, category.icon, category.color]
      );
    }
    
    console.log('Asset categories force seeded successfully');
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

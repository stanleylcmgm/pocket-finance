// Financial Analysis and Advice Business Logic
// This module provides intelligent financial analysis and personalized advice
// based on user's financial data without requiring external AI services

import { 
  getTransactions, 
  getAssets, 
  getCategories,
  calculateTotalAssets,
  filterTransactionsByMonth,
  calculateMonthlySummary,
  toMonthKey,
  formatCurrency
} from './data-utils';
import { 
  getExpenses,
  getExpensesByDateRange,
  getExpensesByYear 
} from './expenses-data';

/**
 * Analyze financial health score (0-100)
 * @param {Object} financialData - User's financial data
 * @returns {Object} Health score and breakdown
 */
export const analyzeFinancialHealth = (financialData) => {
  const {
    totalAssets = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    savingsRate = 0,
    emergencyFundMonths = 0
  } = financialData;

  let score = 0;
  const factors = [];

  // Savings Rate (0-30 points)
  if (savingsRate >= 20) {
    score += 30;
    factors.push({ name: 'savingsRate', score: 30, status: 'excellent', message: 'Excellent savings rate!' });
  } else if (savingsRate >= 15) {
    score += 25;
    factors.push({ name: 'savingsRate', score: 25, status: 'good', message: 'Good savings rate' });
  } else if (savingsRate >= 10) {
    score += 20;
    factors.push({ name: 'savingsRate', score: 20, status: 'fair', message: 'Moderate savings rate' });
  } else if (savingsRate >= 5) {
    score += 10;
    factors.push({ name: 'savingsRate', score: 10, status: 'needsImprovement', message: 'Low savings rate' });
  } else if (savingsRate > 0) {
    score += 5;
    factors.push({ name: 'savingsRate', score: 5, status: 'poor', message: 'Very low savings rate' });
  } else {
    factors.push({ name: 'savingsRate', score: 0, status: 'critical', message: 'No savings - spending exceeds income' });
  }

  // Emergency Fund (0-25 points)
  if (emergencyFundMonths >= 6) {
    score += 25;
    factors.push({ name: 'emergencyFund', score: 25, status: 'excellent', message: 'Strong emergency fund' });
  } else if (emergencyFundMonths >= 3) {
    score += 20;
    factors.push({ name: 'emergencyFund', score: 20, status: 'good', message: 'Adequate emergency fund' });
  } else if (emergencyFundMonths >= 1) {
    score += 10;
    factors.push({ name: 'emergencyFund', score: 10, status: 'fair', message: 'Limited emergency fund' });
  } else {
    factors.push({ name: 'emergencyFund', score: 0, status: 'poor', message: 'No emergency fund' });
  }

  // Income vs Expenses Balance (0-25 points)
  if (monthlyIncome > 0) {
    const expenseRatio = monthlyExpenses / monthlyIncome;
    if (expenseRatio <= 0.5) {
      score += 25;
      factors.push({ name: 'expenseRatio', score: 25, status: 'excellent', message: 'Low expense ratio' });
    } else if (expenseRatio <= 0.7) {
      score += 20;
      factors.push({ name: 'expenseRatio', score: 20, status: 'good', message: 'Reasonable expense ratio' });
    } else if (expenseRatio <= 0.9) {
      score += 10;
      factors.push({ name: 'expenseRatio', score: 10, status: 'fair', message: 'High expense ratio' });
    } else if (expenseRatio < 1) {
      score += 5;
      factors.push({ name: 'expenseRatio', score: 5, status: 'needsImprovement', message: 'Very high expense ratio' });
    } else {
      factors.push({ name: 'expenseRatio', score: 0, status: 'critical', message: 'Spending exceeds income' });
    }
  }

  // Asset Growth (0-20 points)
  if (totalAssets > 0 && monthlyIncome > 0) {
    const assetToIncomeRatio = totalAssets / (monthlyIncome * 12);
    if (assetToIncomeRatio >= 2) {
      score += 20;
      factors.push({ name: 'assetGrowth', score: 20, status: 'excellent', message: 'Strong asset base' });
    } else if (assetToIncomeRatio >= 1) {
      score += 15;
      factors.push({ name: 'assetGrowth', score: 15, status: 'good', message: 'Good asset accumulation' });
    } else if (assetToIncomeRatio >= 0.5) {
      score += 10;
      factors.push({ name: 'assetGrowth', score: 10, status: 'fair', message: 'Moderate asset base' });
    } else {
      score += 5;
      factors.push({ name: 'assetGrowth', score: 5, status: 'needsImprovement', message: 'Limited assets' });
    }
  }

  // Determine overall status
  let status = 'excellent';
  if (score < 40) status = 'critical';
  else if (score < 60) status = 'poor';
  else if (score < 75) status = 'fair';
  else if (score < 90) status = 'good';
  else status = 'excellent';

  return {
    score: Math.min(100, Math.max(0, score)),
    status,
    factors,
    maxScore: 100
  };
};

/**
 * Analyze spending trends over time
 * @param {Array} monthlyExpenses - Array of monthly expense totals
 * @param {Function} t - Translation function
 * @returns {Object} Trend analysis
 */
export const analyzeSpendingTrends = (monthlyExpenses, t) => {
  if (!monthlyExpenses || monthlyExpenses.length < 2) {
    return {
      trend: 'insufficient_data',
      direction: 'stable',
      changePercent: 0,
      message: t ? t('reports.analysis.insufficientData') : 'Need more data to analyze trends'
    };
  }

  // Calculate average of first half vs second half
  const midPoint = Math.floor(monthlyExpenses.length / 2);
  const firstHalf = monthlyExpenses.slice(0, midPoint);
  const secondHalf = monthlyExpenses.slice(midPoint);

  const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  const changePercent = firstHalfAvg > 0 
    ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 
    : 0;

  let trend = 'stable';
  let direction = 'stable';
  let message = '';

  if (changePercent > 15) {
    trend = 'increasing';
    direction = 'up';
    message = t ? t('reports.analysis.expensesIncreased', { percent: changePercent.toFixed(1) }) : `Expenses increased by ${changePercent.toFixed(1)}% - consider reviewing spending habits`;
  } else if (changePercent > 5) {
    trend = 'slightly_increasing';
    direction = 'up';
    message = t ? t('reports.analysis.expensesIncreasedSlightly', { percent: changePercent.toFixed(1) }) : `Expenses increased by ${changePercent.toFixed(1)}% - monitor closely`;
  } else if (changePercent < -15) {
    trend = 'decreasing';
    direction = 'down';
    message = t ? t('reports.analysis.expensesDecreased', { percent: Math.abs(changePercent).toFixed(1) }) : `Expenses decreased by ${Math.abs(changePercent).toFixed(1)}% - great job!`;
  } else if (changePercent < -5) {
    trend = 'slightly_decreasing';
    direction = 'down';
    message = t ? t('reports.analysis.expensesDecreasedSlightly', { percent: Math.abs(changePercent).toFixed(1) }) : `Expenses decreased by ${Math.abs(changePercent).toFixed(1)}% - good progress`;
  } else {
    trend = 'stable';
    direction = 'stable';
    message = t ? t('reports.analysis.spendingStable') : 'Spending is relatively stable';
  }

  return {
    trend,
    direction,
    changePercent: Math.round(changePercent * 10) / 10,
    message,
    firstHalfAvg,
    secondHalfAvg
  };
};

/**
 * Identify top spending categories and provide recommendations
 * @param {Array} categoryExpenses - Array of {categoryId, total, category}
 * @param {number} totalExpenses - Total expenses
 * @param {Function} t - Translation function
 * @returns {Object} Category analysis and recommendations
 */
export const analyzeCategorySpending = (categoryExpenses, totalExpenses, t) => {
  if (!categoryExpenses || categoryExpenses.length === 0) {
    return {
      topCategories: [],
      recommendations: [],
      warnings: []
    };
  }

  const sortedCategories = [...categoryExpenses].sort((a, b) => b.total - a.total);
  const topCategories = sortedCategories.slice(0, 5);

  const recommendations = [];
  const warnings = [];

  // Analyze each top category
  topCategories.forEach((item, index) => {
    const percentage = totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0;
    
    if (percentage > 40) {
      warnings.push({
        category: item.category.name,
        percentage: percentage.toFixed(1),
        message: t ? t('reports.analysis.categoryHighSpending', { category: item.category.name, percent: percentage.toFixed(1) }) : `${item.category.name} accounts for ${percentage.toFixed(1)}% of total expenses - this is very high`
      });
    } else if (percentage > 25) {
      recommendations.push({
        category: item.category.name,
        percentage: percentage.toFixed(1),
        message: t ? t('reports.analysis.categoryReviewSpending', { category: item.category.name, percent: percentage.toFixed(1) }) : `Consider reviewing ${item.category.name} spending (${percentage.toFixed(1)}% of total)`
      });
    }
  });

  return {
    topCategories,
    recommendations,
    warnings,
    totalCategories: categoryExpenses.length
  };
};

/**
 * Generate personalized financial advice based on comprehensive analysis
 * @param {Object} financialData - Complete financial data
 * @param {Function} t - Translation function
 * @returns {Array} Array of advice objects
 */
export const generateFinancialAdvice = (financialData, t) => {
  const advice = [];
  const {
    totalAssets = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    monthlyBalance = 0,
    savingsRate = 0,
    emergencyFundMonths = 0,
    spendingTrend = {},
    categoryAnalysis = {},
    yearToDateAverage = 0
  } = financialData;

  // Savings Rate Advice
  if (savingsRate < 0) {
    advice.push({
      type: 'critical',
      priority: 1,
      title: t ? t('reports.advice.spendingExceedsIncome.title') : 'Spending Exceeds Income',
      message: t ? t('reports.advice.spendingExceedsIncome.message', { amount: formatCurrency(Math.abs(monthlyBalance)) }) : `You're spending ${formatCurrency(Math.abs(monthlyBalance))} more than you earn. Consider reducing expenses or increasing income.`,
      action: t ? t('reports.advice.spendingExceedsIncome.action') : 'Review your expenses and identify areas to cut back'
    });
  } else if (savingsRate < 10) {
    advice.push({
      type: 'warning',
      priority: 2,
      title: t ? t('reports.advice.lowSavingsRate.title') : 'Low Savings Rate',
      message: t ? t('reports.advice.lowSavingsRate.message', { rate: savingsRate.toFixed(1) }) : `Your savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20% for better financial security.`,
      action: t ? t('reports.advice.lowSavingsRate.action') : 'Try to save at least 20% of your income each month'
    });
  } else if (savingsRate >= 20) {
    advice.push({
      type: 'positive',
      priority: 5,
      title: t ? t('reports.advice.excellentSavingsRate.title') : 'Excellent Savings Rate',
      message: t ? t('reports.advice.excellentSavingsRate.message', { rate: savingsRate.toFixed(1) }) : `Great job! You're saving ${savingsRate.toFixed(1)}% of your income. Keep it up!`,
      action: t ? t('reports.advice.excellentSavingsRate.action') : 'Consider investing your savings for long-term growth'
    });
  }

  // Emergency Fund Advice
  if (emergencyFundMonths < 3) {
    advice.push({
      type: 'warning',
      priority: 2,
      title: t ? t('reports.advice.buildEmergencyFund.title') : 'Build Emergency Fund',
      message: emergencyFundMonths === 0 
        ? (t ? t('reports.advice.buildEmergencyFund.noFund') : 'You don\'t have an emergency fund. Aim for 3-6 months of expenses.')
        : (t ? t('reports.advice.buildEmergencyFund.lowFund', { months: emergencyFundMonths.toFixed(1) }) : `Your emergency fund covers ${emergencyFundMonths.toFixed(1)} months. Aim for 3-6 months.`),
      action: t ? t('reports.advice.buildEmergencyFund.action', { amount: formatCurrency(monthlyExpenses * (3 - emergencyFundMonths)) }) : `Save ${formatCurrency(monthlyExpenses * (3 - emergencyFundMonths))} more to reach 3 months coverage`
    });
  } else if (emergencyFundMonths >= 6) {
    advice.push({
      type: 'positive',
      priority: 5,
      title: t ? t('reports.advice.strongEmergencyFund.title') : 'Strong Emergency Fund',
      message: t ? t('reports.advice.strongEmergencyFund.message', { months: emergencyFundMonths.toFixed(1) }) : `Your emergency fund covers ${emergencyFundMonths.toFixed(1)} months - excellent!`,
      action: t ? t('reports.advice.strongEmergencyFund.action') : 'Consider investing excess funds beyond 6 months'
    });
  }

  // Spending Trend Advice
  if (spendingTrend.trend === 'increasing' || spendingTrend.trend === 'slightly_increasing') {
    advice.push({
      type: 'warning',
      priority: 3,
      title: t ? t('reports.advice.spendingTrendAlert.title') : 'Spending Trend Alert',
      message: spendingTrend.message,
      action: t ? t('reports.advice.spendingTrendAlert.action') : 'Review your recent expenses and identify what\'s driving the increase'
    });
  } else if (spendingTrend.trend === 'decreasing' || spendingTrend.trend === 'slightly_decreasing') {
    advice.push({
      type: 'positive',
      priority: 4,
      title: t ? t('reports.advice.spendingImprovement.title') : 'Spending Improvement',
      message: spendingTrend.message,
      action: t ? t('reports.advice.spendingImprovement.action') : 'Continue monitoring and maintain this positive trend'
    });
  }

  // Category Spending Advice
  if (categoryAnalysis.warnings && categoryAnalysis.warnings.length > 0) {
    categoryAnalysis.warnings.forEach(warning => {
      advice.push({
        type: 'warning',
        priority: 3,
        title: t ? t('reports.advice.highCategorySpending.title') : 'High Category Spending',
        message: warning.message,
        action: t ? t('reports.advice.highCategorySpending.action', { category: warning.category }) : `Review ${warning.category} expenses and look for ways to reduce`
      });
    });
  }

  // Income vs Expenses Balance
  if (monthlyIncome > 0) {
    const expenseRatio = monthlyExpenses / monthlyIncome;
    if (expenseRatio > 0.9) {
      advice.push({
        type: 'warning',
        priority: 2,
        title: t ? t('reports.advice.highExpenseRatio.title') : 'High Expense Ratio',
        message: t ? t('reports.advice.highExpenseRatio.message', { percent: (expenseRatio * 100).toFixed(1) }) : `You're spending ${(expenseRatio * 100).toFixed(1)}% of your income. Try to keep it below 80%.`,
        action: t ? t('reports.advice.highExpenseRatio.action') : 'Identify non-essential expenses you can reduce'
      });
    }
  }

  // Asset Growth Advice
  if (totalAssets > 0 && monthlyIncome > 0) {
    const assetToIncomeRatio = totalAssets / (monthlyIncome * 12);
    if (assetToIncomeRatio < 0.5) {
      advice.push({
        type: 'info',
        priority: 4,
        title: t ? t('reports.advice.buildAssets.title') : 'Build Your Assets',
        message: t ? t('reports.advice.buildAssets.message') : 'Consider diversifying your assets and building long-term wealth.',
        action: t ? t('reports.advice.buildAssets.action') : 'Explore investment options that match your risk tolerance'
      });
    }
  }

  // Budget Advice
  if (yearToDateAverage > 0 && monthlyExpenses > yearToDateAverage * 1.1) {
    const percentAbove = ((monthlyExpenses / yearToDateAverage - 1) * 100).toFixed(1);
    advice.push({
      type: 'warning',
      priority: 3,
      title: t ? t('reports.advice.aboveAverageSpending.title') : 'Above Average Spending',
      message: t ? t('reports.advice.aboveAverageSpending.message', { percent: percentAbove }) : `This month's expenses are ${percentAbove}% above your year-to-date average.`,
      action: t ? t('reports.advice.aboveAverageSpending.action') : 'Review this month\'s expenses compared to your average'
    });
  }

  // Sort by priority (lower number = higher priority)
  return advice.sort((a, b) => a.priority - b.priority);
};

/**
 * Calculate emergency fund coverage in months
 * @param {number} totalAssets - Total assets
 * @param {number} monthlyExpenses - Average monthly expenses
 * @returns {number} Months of coverage
 */
export const calculateEmergencyFundMonths = (totalAssets, monthlyExpenses) => {
  if (monthlyExpenses <= 0) return 0;
  return totalAssets / monthlyExpenses;
};

/**
 * Get comprehensive financial analysis
 * @param {Function} t - Translation function (optional)
 * @returns {Promise<Object>} Complete financial analysis
 */
export const getComprehensiveFinancialAnalysis = async (t = null) => {
  try {
    // Get all data
    const [assets, transactions, expenses, categories] = await Promise.all([
      getAssets(),
      getTransactions(),
      getExpenses(),
      getCategories()
    ]);

    // Calculate totals
    const totalAssets = calculateTotalAssets(assets);
    
    // Current month analysis
    const currentMonth = new Date();
    const monthKey = toMonthKey(currentMonth);
    const monthlyTransactions = filterTransactionsByMonth(transactions, monthKey);
    const monthlySummary = calculateMonthlySummary(monthlyTransactions);
    
    const monthlyIncome = monthlySummary.totalIncome;
    const monthlyExpenses = monthlySummary.totalExpenses;
    const monthlyBalance = monthlySummary.balance;
    const savingsRate = monthlyIncome > 0 ? (monthlyBalance / monthlyIncome) * 100 : 0;

    // Calculate emergency fund months
    const emergencyFundMonths = calculateEmergencyFundMonths(totalAssets, monthlyExpenses);

    // Year-to-date expenses analysis
    const currentYear = currentMonth.getFullYear();
    const yearStart = new Date(currentYear, 0, 1);
    const yearEnd = new Date(currentYear, 11, 31, 23, 59, 59, 999);
    const yearExpenses = await getExpensesByDateRange(yearStart, yearEnd);
    
    // Group expenses by month for trend analysis
    const monthlyExpensesMap = {};
    yearExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const year = expenseDate.getFullYear();
      const month = expenseDate.getMonth() + 1;
      const expenseMonthKey = `${year}-${String(month).padStart(2, '0')}`;
      
      if (!monthlyExpensesMap[expenseMonthKey]) {
        monthlyExpensesMap[expenseMonthKey] = 0;
      }
      monthlyExpensesMap[expenseMonthKey] += expense.amountConverted || 0;
    });

    const monthlyExpenseTotals = Object.values(monthlyExpensesMap).sort((a, b) => a - b);
    const yearToDateAverage = monthlyExpenseTotals.length > 0
      ? monthlyExpenseTotals.reduce((sum, total) => sum + total, 0) / monthlyExpenseTotals.length
      : 0;

    // Analyze spending trends
    const spendingTrend = analyzeSpendingTrends(monthlyExpenseTotals, t);

    // Category analysis for current month
    const categorySubtypeMap = {};
    categories.forEach(cat => {
      categorySubtypeMap[cat.id] = cat.subtype;
    });

    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const expenseYear = expenseDate.getFullYear();
      const expenseMonth = expenseDate.getMonth() + 1;
      const expenseMonthKey = `${expenseYear}-${String(expenseMonth).padStart(2, '0')}`;
      return expenseMonthKey === monthKey;
    });

    const categoryTotals = {};
    currentMonthExpenses.forEach(expense => {
      if (expense.categoryId) {
        if (!categoryTotals[expense.categoryId]) {
          categoryTotals[expense.categoryId] = 0;
        }
        categoryTotals[expense.categoryId] += expense.amountConverted || 0;
      }
    });

    const categoryExpenses = Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = categories.find(cat => cat.id === categoryId);
        return {
          categoryId,
          total,
          category: category || { name: 'Unknown', color: '#6c757d' }
        };
      })
      .filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);

    const categoryAnalysis = analyzeCategorySpending(categoryExpenses, monthlyExpenses, t);

    // Financial health analysis
    const healthAnalysis = analyzeFinancialHealth({
      totalAssets,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      emergencyFundMonths
    });

    // Generate advice
    const advice = generateFinancialAdvice({
      totalAssets,
      monthlyIncome,
      monthlyExpenses,
      monthlyBalance,
      savingsRate,
      emergencyFundMonths,
      spendingTrend,
      categoryAnalysis,
      yearToDateAverage
    }, t);

    return {
      summary: {
        totalAssets,
        monthlyIncome,
        monthlyExpenses,
        monthlyBalance,
        savingsRate: Math.round(savingsRate * 10) / 10,
        emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
        yearToDateAverage
      },
      health: healthAnalysis,
      trends: spendingTrend,
      categories: categoryAnalysis,
      advice,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getComprehensiveFinancialAnalysis:', error);
    throw error;
  }
};

/**
 * Get a single, most important financial insight
 * @param {Function} t - Translation function (optional)
 * @returns {Promise<Object>} Top financial insight
 */
export const getTopFinancialInsight = async (t = null) => {
  try {
    const analysis = await getComprehensiveFinancialAnalysis(t);
    
    // Get the highest priority advice
    const topAdvice = analysis.advice.length > 0 ? analysis.advice[0] : null;
    
    // Get health status message
    let healthMessage = '';
    if (t) {
      if (analysis.health.score >= 90) {
        healthMessage = t('reports.analysis.healthExcellent');
      } else if (analysis.health.score >= 75) {
        healthMessage = t('reports.analysis.healthGood');
      } else if (analysis.health.score >= 60) {
        healthMessage = t('reports.analysis.healthFair');
      } else if (analysis.health.score >= 40) {
        healthMessage = t('reports.analysis.healthNeedsAttention');
      } else {
        healthMessage = t('reports.analysis.healthCritical');
      }
    } else {
      if (analysis.health.score >= 90) {
        healthMessage = 'Excellent financial health!';
      } else if (analysis.health.score >= 75) {
        healthMessage = 'Good financial health';
      } else if (analysis.health.score >= 60) {
        healthMessage = 'Fair financial health - room for improvement';
      } else if (analysis.health.score >= 40) {
        healthMessage = 'Financial health needs attention';
      } else {
        healthMessage = 'Critical financial situation - immediate action needed';
      }
    }

    return {
      message: topAdvice ? topAdvice.message : healthMessage,
      title: topAdvice ? topAdvice.title : (t ? t('reports.analysis.financialOverview') : 'Financial Overview'),
      type: topAdvice ? topAdvice.type : 'info',
      healthScore: analysis.health.score,
      healthStatus: analysis.health.status
    };
  } catch (error) {
    console.error('Error in getTopFinancialInsight:', error);
    return {
      message: t ? t('reports.analysis.unableToGenerate') : 'Unable to generate financial insight at this time',
      title: t ? t('reports.analysis.financialOverview') : 'Financial Overview',
      type: 'info',
      healthScore: 0,
      healthStatus: 'unknown'
    };
  }
};


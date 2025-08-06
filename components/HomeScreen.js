import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import '../styles/HomeScreen.styles.scss';

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      subtitle: 'Track income & expenses',
      icon: 'wallet-outline',
      color: colors.features.balanceSheet,
      screen: 'BalanceSheet',
    },
    {
      id: 'expenses-tracking',
      title: 'Expenses Tracking',
      subtitle: 'Monitor spending patterns',
      icon: 'trending-down-outline',
      color: colors.features.expensesTracking,
      screen: 'ExpensesTracking',
    },
    {
      id: 'asset-management',
      title: 'Asset Management',
      subtitle: 'Manage your investments',
      icon: 'business-outline',
      color: colors.features.assetManagement,
      screen: 'AssetManagement',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'View insights',
      icon: 'analytics-outline',
      color: colors.features.reports,
      screen: 'Reports',
    },
  ];

  const bottomTabs = [
    { id: 'home', title: 'Home', icon: 'home-outline' },
    { id: 'balance-sheet', title: 'Balance', icon: 'wallet-outline' },
    { id: 'expenses-tracking', title: 'Expenses', icon: 'trending-down-outline' },
    { id: 'asset-management', title: 'Assets', icon: 'business-outline' },
    { id: 'reports', title: 'Reports', icon: 'analytics-outline' },
  ];

  const navigateToScreen = (screenName) => {
    if (screenName === 'BalanceSheet') {
      navigation.navigate('BalanceSheet');
    } else if (screenName === 'ExpensesTracking') {
      // For future screens
      alert('Expenses Tracking screen coming soon!');
    } else if (screenName === 'AssetManagement') {
      // For future screens
      alert('Asset Management screen coming soon!');
    } else {
      // For future screens
      alert(`${screenName} screen coming soon!`);
    }
  };

  const handleTabPress = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'home') {
      const screenMap = {
        'balance-sheet': 'BalanceSheet',
        'expenses-tracking': 'ExpensesTracking',
        'asset-management': 'AssetManagement',
        'reports': 'Reports',
      };
      navigateToScreen(screenMap[tabId]);
    }
  };

  return (
    <div className="container">
      {/* Gradient Header */}
      <div className="header-gradient">
        <div className="header">
          <div className="title-container">
            <h1 className="title">⭐ Star</h1>
            <p className="subtitle">Your Productivity Companion</p>
          </div>
          <div className="header-icon">
            <Ionicons name="star" size={40} color="rgba(255,255,255,0.3)" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <div className="scroll-view">
          <div className="scroll-content">
            {/* Quick Stats */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-icon-container">
                  <Ionicons name="trending-up" size={20} color={colors.success[500]} />
                </div>
                <div className="stat-number">$0</div>
                <div className="stat-label">This Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-container">
                  <Ionicons name="trending-down" size={20} color={colors.error[500]} />
                </div>
                <div className="stat-number">$0</div>
                <div className="stat-label">Spent</div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-container">
                  <Ionicons name="wallet" size={20} color={colors.info[500]} />
                </div>
                <div className="stat-number">$0</div>
                <div className="stat-label">Balance</div>
              </div>
            </div>

            {/* Financial Tools */}
            <div className="menu-container">
              <div className="section-header">
                <h2 className="menu-title">Financial Tools</h2>
                <div className="section-line"></div>
              </div>
              
              {/* 2x2 Grid Layout */}
              <div className="grid-container">
                {menuItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="block-card"
                    style={{ backgroundColor: item.color }}
                    onClick={() => navigateToScreen(item.screen)}
                  >
                    <div className="block-icon-container">
                      <Ionicons name={item.icon} size={32} color="#333" />
                    </div>
                    <h3 className="block-title">{item.title}</h3>
                    <p className="block-subtitle">{item.subtitle}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom spacing for navigation */}
            <div className="bottom-spacing"></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        {bottomTabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab-item ${activeTab === tab.id ? 'active-tab-item' : ''}`}
            onClick={() => handleTabPress(tab.id)}
          >
            <Ionicons
              name={tab.icon}
              size={20}
              color={activeTab === tab.id ? colors.primary[500] : colors.secondary[500]}
            />
            <span className={`tab-text ${activeTab === tab.id ? 'active-tab-text' : ''}`}>
              {tab.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen; 
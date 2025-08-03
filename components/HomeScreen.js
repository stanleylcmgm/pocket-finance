import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { homeScreenStyles } from '../styles/HomeScreen.styles';
import { colors } from '../theme';

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
    <SafeAreaView style={homeScreenStyles.container}>
      {/* Gradient Header */}
      <LinearGradient
         colors={[colors.background.dark, colors.background.darkSecondary]}
         style={homeScreenStyles.headerGradient}
       >
        <View style={homeScreenStyles.header}>
                     <View style={homeScreenStyles.titleContainer}>
             <Text style={homeScreenStyles.title}>⭐ Star</Text>
             <Text style={homeScreenStyles.subtitle}>Your Productivity Companion</Text>
           </View>
           <View style={homeScreenStyles.headerIcon}>
             <Ionicons name="star" size={40} color="rgba(255,255,255,0.3)" />
           </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={homeScreenStyles.mainContent}>
        <ScrollView 
          style={homeScreenStyles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={homeScreenStyles.scrollContent}
        >
          {/* Quick Stats */}
          <View style={homeScreenStyles.statsContainer}>
            <View style={homeScreenStyles.statCard}>
              <View style={homeScreenStyles.statIconContainer}>
                <Ionicons name="trending-up" size={20} color={colors.success[500]} />
              </View>
              <Text style={homeScreenStyles.statNumber}>$0</Text>
              <Text style={homeScreenStyles.statLabel}>This Month</Text>
            </View>
            <View style={homeScreenStyles.statCard}>
              <View style={homeScreenStyles.statIconContainer}>
                <Ionicons name="trending-down" size={20} color={colors.error[500]} />
              </View>
              <Text style={homeScreenStyles.statNumber}>$0</Text>
              <Text style={homeScreenStyles.statLabel}>Spent</Text>
            </View>
            <View style={homeScreenStyles.statCard}>
              <View style={homeScreenStyles.statIconContainer}>
                <Ionicons name="wallet" size={20} color={colors.info[500]} />
              </View>
              <Text style={homeScreenStyles.statNumber}>$0</Text>
              <Text style={homeScreenStyles.statLabel}>Balance</Text>
            </View>
          </View>

          {/* Financial Tools - Block Style */}
          <View style={homeScreenStyles.menuContainer}>
            <View style={homeScreenStyles.sectionHeader}>
              <Text style={homeScreenStyles.menuTitle}>Financial Tools</Text>
              <View style={homeScreenStyles.sectionLine} />
            </View>
            
            {/* 2x2 Grid Layout */}
            <View style={homeScreenStyles.gridContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[homeScreenStyles.blockCard, { backgroundColor: item.color }]}
                  onPress={() => navigateToScreen(item.screen)}
                >
                  <View style={homeScreenStyles.blockIconContainer}>
                    <Ionicons name={item.icon} size={32} color="#333" />
                  </View>
                  <Text style={homeScreenStyles.blockTitle}>{item.title}</Text>
                  <Text style={homeScreenStyles.blockSubtitle} numberOfLines={2}>{item.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


        </ScrollView>
      </View>

      {/* Bottom Navigation - ALWAYS VISIBLE */}
      <View style={homeScreenStyles.bottomNavigation}>
        <TouchableOpacity
          style={[homeScreenStyles.tabItem, activeTab === 'home' && homeScreenStyles.activeTabItem]}
          onPress={() => handleTabPress('home')}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={activeTab === 'home' ? colors.primary[500] : colors.secondary[500]}
          />
          <Text style={[homeScreenStyles.tabText, activeTab === 'home' && homeScreenStyles.activeTabText]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[homeScreenStyles.tabItem, activeTab === 'balance-sheet' && homeScreenStyles.activeTabItem]}
          onPress={() => handleTabPress('balance-sheet')}
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={activeTab === 'balance-sheet' ? colors.primary[500] : colors.secondary[500]}
          />
          <Text style={[homeScreenStyles.tabText, activeTab === 'balance-sheet' && homeScreenStyles.activeTabText]}>
            Balance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[homeScreenStyles.tabItem, activeTab === 'expenses-tracking' && homeScreenStyles.activeTabItem]}
          onPress={() => handleTabPress('expenses-tracking')}
        >
          <Ionicons
            name="trending-down-outline"
            size={20}
            color={activeTab === 'expenses-tracking' ? colors.primary[500] : colors.secondary[500]}
          />
          <Text style={[homeScreenStyles.tabText, activeTab === 'expenses-tracking' && homeScreenStyles.activeTabText]}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[homeScreenStyles.tabItem, activeTab === 'asset-management' && homeScreenStyles.activeTabItem]}
          onPress={() => handleTabPress('asset-management')}
        >
          <Ionicons
            name="business-outline"
            size={20}
            color={activeTab === 'asset-management' ? colors.primary[500] : colors.secondary[500]}
          />
          <Text style={[homeScreenStyles.tabText, activeTab === 'asset-management' && homeScreenStyles.activeTabText]}>
            Assets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[homeScreenStyles.tabItem, activeTab === 'reports' && homeScreenStyles.activeTabItem]}
          onPress={() => handleTabPress('reports')}
        >
          <Ionicons
            name="analytics-outline"
            size={20}
            color={activeTab === 'reports' ? colors.primary[500] : colors.secondary[500]}
          />
          <Text style={[homeScreenStyles.tabText, activeTab === 'reports' && homeScreenStyles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen; 
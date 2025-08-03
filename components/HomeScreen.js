import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('home');

  const menuItems = [
    {
      id: 'balance-sheet',
      title: 'Balance Sheet',
      subtitle: 'Track income & expenses',
      icon: 'wallet-outline',
      color: '#E9E3C2', // Light beige
      screen: 'BalanceSheet',
    },
    {
      id: 'expenses-tracking',
      title: 'Expenses Tracking',
      subtitle: 'Monitor spending patterns',
      icon: 'trending-down-outline',
      color: '#FFE37D', // Light yellow
      screen: 'ExpensesTracking',
    },
    {
      id: 'asset-management',
      title: 'Asset Management',
      subtitle: 'Manage your investments',
      icon: 'business-outline',
      color: '#BFDF89', // Light green
      screen: 'AssetManagement',
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      subtitle: 'View insights',
      icon: 'analytics-outline',
      color: '#FFC86D', // Light orange
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
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
         colors={['#100C30', '#1A1553']}
         style={styles.headerGradient}
       >
        <View style={styles.header}>
                     <View style={styles.titleContainer}>
             <Text style={styles.title}>⭐ Star</Text>
             <Text style={styles.subtitle}>Your Productivity Companion</Text>
           </View>
           <View style={styles.headerIcon}>
             <Ionicons name="star" size={40} color="rgba(255,255,255,0.3)" />
           </View>
        </View>
      </LinearGradient>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-up" size={20} color="#28a745" />
              </View>
              <Text style={styles.statNumber}>$0</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-down" size={20} color="#dc3545" />
              </View>
              <Text style={styles.statNumber}>$0</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </View>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name="wallet" size={20} color="#007bff" />
              </View>
              <Text style={styles.statNumber}>$0</Text>
              <Text style={styles.statLabel}>Balance</Text>
            </View>
          </View>

          {/* Financial Tools - Block Style */}
          <View style={styles.menuContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.menuTitle}>Financial Tools</Text>
              <View style={styles.sectionLine} />
            </View>
            
            {/* 2x2 Grid Layout */}
            <View style={styles.gridContainer}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.blockCard, { backgroundColor: item.color }]}
                  onPress={() => navigateToScreen(item.screen)}
                >
                  <View style={styles.blockIconContainer}>
                    <Ionicons name={item.icon} size={32} color="#333" />
                  </View>
                  <Text style={styles.blockTitle}>{item.title}</Text>
                  <Text style={styles.blockSubtitle}>{item.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>


        </ScrollView>
      </View>

      {/* Bottom Navigation - ALWAYS VISIBLE */}
      <View style={styles.bottomNavigation}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'home' && styles.activeTabItem]}
          onPress={() => handleTabPress('home')}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={activeTab === 'home' ? '#667eea' : '#6c757d'}
          />
          <Text style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'balance-sheet' && styles.activeTabItem]}
          onPress={() => handleTabPress('balance-sheet')}
        >
          <Ionicons
            name="wallet-outline"
            size={20}
            color={activeTab === 'balance-sheet' ? '#667eea' : '#6c757d'}
          />
          <Text style={[styles.tabText, activeTab === 'balance-sheet' && styles.activeTabText]}>
            Balance
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'expenses-tracking' && styles.activeTabItem]}
          onPress={() => handleTabPress('expenses-tracking')}
        >
          <Ionicons
            name="trending-down-outline"
            size={20}
            color={activeTab === 'expenses-tracking' ? '#667eea' : '#6c757d'}
          />
          <Text style={[styles.tabText, activeTab === 'expenses-tracking' && styles.activeTabText]}>
            Expenses
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'asset-management' && styles.activeTabItem]}
          onPress={() => handleTabPress('asset-management')}
        >
          <Ionicons
            name="business-outline"
            size={20}
            color={activeTab === 'asset-management' ? '#667eea' : '#6c757d'}
          />
          <Text style={[styles.tabText, activeTab === 'asset-management' && styles.activeTabText]}>
            Assets
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'reports' && styles.activeTabItem]}
          onPress={() => handleTabPress('reports')}
        >
          <Ionicons
            name="analytics-outline"
            size={20}
            color={activeTab === 'reports' ? '#667eea' : '#6c757d'}
          />
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  mainContent: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginRight: 12,
  },
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e9ecef',
    borderRadius: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  blockCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  blockIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  blockTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  blockSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 30,
  },
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
    height: 70,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTabItem: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  tabText: {
    fontSize: 12,
    color: '#6c757d',
    marginTop: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#667eea',
    fontWeight: '600',
  },
});

export default HomeScreen; 
import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    minHeight: '100%',
  },

  // Header styles
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#100C30',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    margin: 0,
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    margin: 0,
  },

  headerIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Main content
  mainContent: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  // Stats section
  statsContainer: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 26,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
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
    fontSize: 12,
    fontWeight: '900',
    color: '#59C3C3',
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '800',
  },

  // Menu section
  menuContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
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
    margin: 0,
  },

  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#dee2e6',
    borderRadius: 1,
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  blockCard: {
    width: '45%',
    height: 170,
    borderRadius: 25,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },

  blockIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  blockTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 0,
    marginBottom: 5,
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 20,
    textAlign: 'left',
    width: '100%',
  },

  blockSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginTop: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'left',
    width: '100%',
  },

  // Bottom spacing
  bottomSpacing: {
    height: 10,
  },

  // Bottom navigation
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 1,
    paddingBottom: 6,
    paddingLeft: 16,
    paddingRight: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    height: 60,
  },

  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
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

  // Test button styles
  testButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    gap: 10,
  },

  testButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },

  testButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 
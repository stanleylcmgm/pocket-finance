import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const homeScreenStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  
  mainContent: {
    flex: 1,
  },
  
  // Header styles
  headerGradient: {
    paddingTop: 25, // Further reduced by 30% from 35
    paddingBottom: 15, // Further reduced by 30% from 21
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
    color: theme.colors.text.inverse,
    marginBottom: 5,
  },
  
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.muted,
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
  
  // Stats section
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
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
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    fontWeight: '500',
  },
  
  // Menu section
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
    color: theme.colors.text.primary,
    marginRight: 12,
  },
  
  sectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.border.medium,
    borderRadius: 1,
  },
  
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  
  blockCard: {
    width: '48%',
    height: 200,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
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
    flexShrink: 1,
  },
  
  // Quick actions (if needed)
  quickActionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  
  quickActionsRow: {
    flexDirection: 'row',
  },
  
  quickActionButton: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 6,
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
    backgroundColor: theme.colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  
  quickActionText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600',
  },
  
  bottomSpacing: {
    height: 30,
  },
  
  // Bottom navigation
  bottomNavigation: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
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
    color: theme.colors.text.secondary,
    marginTop: 4,
    fontWeight: '500',
  },
  
  activeTabText: {
    color: theme.colors.primary[500],
    fontWeight: '600',
  },
}); 
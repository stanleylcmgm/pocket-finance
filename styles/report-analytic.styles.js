import { StyleSheet } from 'react-native';

export const reportAnalyticStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  // Top Banner
  topBanner: {
    backgroundColor: 'white',
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  topBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  topBannerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#6c757d',
  },

  // Main Content
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

  // Placeholder content
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },

  placeholderText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});

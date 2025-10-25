import React from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { reportAnalyticStyles } from '../styles/report-analytic.styles';

const ReportAnalytic = () => {
  return (
    <View style={reportAnalyticStyles.container}>
      {/* Top Banner */}
      <View style={reportAnalyticStyles.topBanner}>
        <Text style={reportAnalyticStyles.topBannerTitle}>Reports & Analytics</Text>
        <Text style={reportAnalyticStyles.topBannerSubtitle}>View insights and trends</Text>
      </View>

      {/* Main Content Area */}
      <View style={reportAnalyticStyles.mainContent}>
        <ScrollView style={reportAnalyticStyles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={reportAnalyticStyles.scrollContent}>
            {/* Placeholder content - will be filled in later */}
            <View style={reportAnalyticStyles.placeholderContainer}>
              <Ionicons name="analytics-outline" size={48} color="#6c757d" />
              <Text style={reportAnalyticStyles.placeholderText}>
                Reports & Analytics content coming soon
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ReportAnalytic;

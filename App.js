import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import { initDatabase } from './utils/database-init';
import { I18nProvider, useI18n } from './i18n/i18n';

// Import screens
import HomeScreen from './components/home-screen';
import BalanceSheet from './components/balance-sheet';
import ExpensesTracking from './components/expenses-tracking';
import AssetManagement from './components/asset-management';
import ReportAnalytic from './components/report-analytic';

const Stack = createStackNavigator();

function AppContent() {
  const { t } = useI18n();
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const success = await initDatabase();
        setIsDbInitialized(success);
      } catch (error) {
        console.error('App initialization failed:', error);
        setIsDbInitialized(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c3e50' }}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={{ color: '#fff', marginTop: 16, fontSize: 16 }}>{t('app.initializingDatabase')}</Text>
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  if (!isDbInitialized) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2c3e50' }}>
          <Text style={{ color: '#fff', fontSize: 18, textAlign: 'center' }}>
            {t('app.databaseInitFailed')}
          </Text>
        </View>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2c3e50',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: t('app.pocketFinance'),
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BalanceSheet"
            component={BalanceSheet}
            options={({ route }) => ({
              title: t('app.balanceSheet'),
            })}
          />
          <Stack.Screen
            name="ExpensesTracking"
            component={ExpensesTracking}
            options={({ route }) => ({
              title: t('app.expensesTracking'),
            })}
          />
          <Stack.Screen
            name="AssetManagement"
            component={AssetManagement}
            options={({ route }) => ({
              title: t('app.assetManagement'),
            })}
          />
          <Stack.Screen
            name="Reports"
            component={ReportAnalytic}
            options={({ route }) => ({
              title: t('app.reportsAnalytics'),
            })}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

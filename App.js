import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './components/home-screen';
import BalanceSheet from './components/balance-sheet';
import ExpensesTracking from './components/expenses-tracking';
import AssetManagement from './components/asset-management';

const Stack = createStackNavigator();

export default function App() {
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
              title: '⭐ Star',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="BalanceSheet"
            component={BalanceSheet}
            options={{
              title: 'Balance Sheet',
            }}
          />
          <Stack.Screen
            name="ExpensesTracking"
            component={ExpensesTracking}
            options={{
              title: 'Expenses Tracking',
            }}
          />
          <Stack.Screen
            name="AssetManagement"
            component={AssetManagement}
            options={{
              title: 'Asset Management',
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

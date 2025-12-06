import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, Image, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { initDatabase } from './utils/database-init';
import { I18nProvider, useI18n } from './i18n/i18n';

// Conditionally import AdMob (only works in custom development builds, not Expo Go)
import { mobileAds, adMobAvailable } from './utils/admob-wrapper';
import { ADMOB_CONFIG } from './utils/admob-config';

// Keep the native splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [appIsReady, setAppIsReady] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const titleFadeAnim = useState(new Animated.Value(0))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    async function prepare() {
      const startTime = Date.now();
      const minDisplayTime = 2000; // Minimum 2 seconds
      
      try {
        // Initialize AdMob (only if ads are enabled and available - requires custom dev build)
        if (ADMOB_CONFIG.adsEnabled && mobileAds && adMobAvailable) {
          try {
            await mobileAds().initialize();
            console.log('AdMob initialized successfully');
          } catch (adError) {
            console.warn('AdMob initialization error:', adError);
            // Continue even if AdMob fails to initialize
          }
        } else {
          if (!ADMOB_CONFIG.adsEnabled) {
            console.log('AdMob disabled in config');
          } else {
            console.log('AdMob not available (running in Expo Go or module not loaded)');
          }
        }
        
        // Immediately hide the native splash screen
        await SplashScreen.hideAsync();
        
        // Start animations
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
          }),
          Animated.timing(titleFadeAnim, {
            toValue: 1,
            duration: 1000,
            delay: 300,
            useNativeDriver: true,
          }),
        ]).start();

        // Pulse animation for icon (start after initial scale animation)
        setTimeout(() => {
          Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 1500,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
              }),
            ])
          ).start();
        }, 800);
        
        // Initialize database
        const success = await initDatabase();
        setIsDbInitialized(success);
      } catch (e) {
        console.warn(e);
        setIsDbInitialized(false);
      } finally {
        setIsLoading(false);
        
        // Calculate remaining time to ensure minimum 2 seconds display
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);
        
        // Wait for remaining time before transitioning
        setTimeout(() => {
          setAppIsReady(true);
        }, remainingTime);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Check isLoading first - show loading screen while database initializes
  if (isLoading) {
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.splashContainer}
        >
          <Image 
            source={require('./assets/icon.png')} 
            style={styles.iconSmall}
            resizeMode="contain"
          />
          <ActivityIndicator size="large" color="#ffffff" style={{ marginTop: 30 }} />
          <Text style={styles.loadingText}>{t('app.initializingDatabase')}</Text>
        </LinearGradient>
        <StatusBar style="light" />
      </SafeAreaProvider>
    );
  }

  // Show animated splash screen after loading but before app is ready
  if (!appIsReady) {
    return (
      <SafeAreaProvider>
        <LinearGradient
          colors={['#667eea', '#764ba2', '#f093fb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.splashContainer}
          onLayout={onLayoutRootView}
        >
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: Animated.multiply(scaleAnim, pulseAnim) }
                ],
              },
            ]}
          >
            <Image 
              source={require('./assets/icon.png')} 
              style={styles.icon}
              resizeMode="contain"
            />
          </Animated.View>
          <Animated.View
            style={[
              styles.titleContainer,
              { opacity: titleFadeAnim },
            ]}
          >
            <Text style={styles.appTitle}>Pocket Finance</Text>
            <Text style={styles.appTagline}>Your Productivity Companion</Text>
            <Animated.View style={{ marginTop: 30, opacity: titleFadeAnim }}>
              <Text style={styles.loadingStatusText}>... loading the data</Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
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

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  icon: {
    width: 180,
    height: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconSmall: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: -20,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 20,
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  loadingStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});

export default function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}
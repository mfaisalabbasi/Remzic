import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Context & Navigators
import { AuthProvider, useAuth } from './AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';

// Import Screens
import { AssetDetails } from '../screens/assets/AssetDetails';
import { InvestmentFlowScreen } from '../screens/investment/InvestmentFlowScreen';
import { DistributionsScreen } from '../screens/distributions/DistributionsScreen';
import { NotificationsScreen } from '../screens/MoreSetting/NotificationsScreen';
import { ProfileScreen } from '../screens/MoreSetting/ProfileScreen';
import { WalletRecoveryScreen } from '../screens/MoreSetting/WalletRecoveryScreen';
import { SideMenuDrawer } from '../screens/MoreSetting/SideMenuDrawer';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="AuthFlow" component={AuthNavigator} />
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="AssetDetails" component={AssetDetails} />
            <Stack.Screen
              name="InvestmentFlow"
              component={InvestmentFlowScreen}
            />
            <Stack.Screen
              name="Distributions"
              component={DistributionsScreen}
            />
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="WalletRecovery"
              component={WalletRecoveryScreen}
            />
            <Stack.Screen
              name="SideMenu"
              component={SideMenuDrawer}
              options={{
                presentation: 'modal',
                animation: 'slide_from_right',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export const AppNavigator = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#080C0A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

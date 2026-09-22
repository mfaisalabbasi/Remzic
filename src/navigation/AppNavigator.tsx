import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Navigators & Screens
import { AuthNavigator } from './AuthNavigator';
import { MainTabs } from './MainTabs';
import { AssetDetails } from '../screens/assets/AssetDetails';
import { InvestmentFlowScreen } from '../screens/investment/InvestmentFlowScreen';
import { DistributionsScreen } from '../screens/distributions/DistributionsScreen';
import { NotificationsScreen } from '../screens/MoreSetting/NotificationsScreen';
import { ProfileScreen } from '../screens/MoreSetting/ProfileScreen';
import { WalletRecoveryScreen } from '../screens/MoreSetting/WalletRecoveryScreen';
import { SideMenuDrawer } from '../screens/MoreSetting/SideMenuDrawer';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  // Toggle this state to test logged-in vs logged-out views
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Unauthenticated Stack (Splash, Onboarding, Login)
          <Stack.Screen name="AuthFlow" component={AuthNavigator} />
        ) : (
          // Authenticated Main App Stack
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

            {/* Fixed Slide-out Drawer Modal Route */}
            <Stack.Screen
              name="SideMenu"
              component={SideMenuDrawer}
              options={{
                presentation: 'modal', // Fixed: 'transparentModal' conflicts with 'slide_from_right'
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

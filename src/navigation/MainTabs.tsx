import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';

import { HomeScreen } from '../screens/home/HomeScreen';
import { InvestScreen } from '../screens/investment/InvestScreen';
import { PortfolioScreen } from '../screens/portfolio/PortfolioScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { MarketplaceScreen } from '../screens/marketplace/MarketplaceScreen';

const Tab = createBottomTabNavigator();

// A wrapper component to automatically apply top safe area padding to other tab screens
const createSafeScreen = (Component: React.ComponentType<any>) => {
  return ({ navigation, route }: { navigation: any; route: any }) => {
    const insets = useSafeAreaInsets();
    return (
      <View style={[styles.screenContainer, { paddingTop: insets.top }]}>
        <StatusBar barStyle="light-content" />
        <Component navigation={navigation} route={route} />
      </View>
    );
  };
};

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          paddingVertical: 8,
          height: 60,
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Invest"
        component={createSafeScreen(InvestScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>📈</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={createSafeScreen(PortfolioScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={createSafeScreen(WalletScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>💼</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={createSafeScreen(MarketplaceScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 18, opacity: focused ? 1 : 0.5 }}>🌐</Text>
          ),
          tabBarLabel: 'Marketplace',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});

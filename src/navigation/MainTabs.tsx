import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeScreen } from '../screens/home/HomeScreen';
import { InvestScreen } from '../screens/investment/InvestScreen';
import { PortfolioScreen } from '../screens/portfolio/PortfolioScreen';
import { WalletScreen } from '../screens/wallet/WalletScreen';
import { MarketplaceScreen } from '../screens/marketplace/MarketplaceScreen';

const Tab = createBottomTabNavigator();

// --- WORLD-CLASS FINTECH GEOMETRIC ICON COMPONENTS ---

const HomeIcon = ({ active }: { active: boolean }) => (
  <View style={styles.iconWrapper}>
    <View style={[styles.finHomeRoof, active && styles.activeStrokeRoof]} />
    <View style={[styles.finHomeBody, active && styles.activeBgBorder]}>
      <View style={[styles.finHomeDoor, active && styles.activeBgBorder]} />
    </View>
  </View>
);

const InvestIcon = ({ active }: { active: boolean }) => (
  <View style={styles.finInvestWrapper}>
    <View style={[styles.finCandleBar1, active && styles.activeBg]} />
    <View style={[styles.finCandleBar2, active && styles.activeBg]} />
    <View style={[styles.finCandleBar3, active && styles.activeBg]} />
    <View style={[styles.finTrendLine, active && styles.activeBg]} />
  </View>
);

const PortfolioIcon = ({ active }: { active: boolean }) => (
  <View style={styles.finPortfolioWrapper}>
    <View style={[styles.donutRing, active && styles.activeBgBorder]}>
      <View style={[styles.donutHole]} />
    </View>
    <View style={[styles.donutSlice, active && styles.activeBg]} />
  </View>
);

const WalletIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.finWalletShell, active && styles.activeBgBorder]}>
    <View style={[styles.finWalletStripe, active && styles.activeBg]} />
    <View style={[styles.finWalletChip, active && styles.activeBg]} />
  </View>
);

const MarketIcon = ({ active }: { active: boolean }) => (
  <View style={[styles.finMarketOuter, active && styles.activeBgBorder]}>
    <View style={[styles.finMarketCore, active && styles.activeBg]} />
  </View>
);

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
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarLabelStyle: styles.tabBarLabelStyle,
        tabBarActiveTintColor: '#34D399',
        tabBarInactiveTintColor: '#64748B',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              <HomeIcon active={focused} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Invest"
        component={createSafeScreen(InvestScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[styles.centralPill, focused && styles.centralPillActive]}
            >
              <InvestIcon active={focused} />
            </View>
          ),
          tabBarLabel: 'Invest',
        }}
      />
      <Tab.Screen
        name="Portfolio"
        component={createSafeScreen(PortfolioScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              <PortfolioIcon active={focused} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Wallet"
        component={createSafeScreen(WalletScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              <WalletIcon active={focused} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Marketplace"
        component={createSafeScreen(MarketplaceScreen)}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItemContainer}>
              <MarketIcon active={focused} />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
          tabBarLabel: 'Market',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  tabBarStyle: {
    backgroundColor: '#080C0A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.15)',
    height: 68,
    paddingBottom: 6,
    paddingTop: 8,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
  },
  tabBarItemStyle: {
    paddingVertical: 2,
  },
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 28,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#34D399',
    marginTop: 5,
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  activeBg: {
    backgroundColor: '#34D399',
  },
  activeBgBorder: {
    borderColor: '#34D399',
  },
  activeStrokeRoof: {
    borderBottomColor: '#34D399',
  },
  centralPill: {
    width: 50,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#111816',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  centralPillActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#34D399',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  iconWrapper: {
    width: 22,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  finHomeRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#64748B',
    marginBottom: 1,
  },
  finHomeBody: {
    width: 15,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#64748B',
    borderTopWidth: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  finHomeDoor: {
    width: 4,
    height: 6,
    borderWidth: 1.5,
    borderColor: '#64748B',
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  finInvestWrapper: {
    width: 22,
    height: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    position: 'relative',
  },
  finCandleBar1: {
    width: 4,
    height: 8,
    backgroundColor: '#64748B',
    borderRadius: 1,
  },
  finCandleBar2: {
    width: 4,
    height: 14,
    backgroundColor: '#64748B',
    borderRadius: 1,
  },
  finCandleBar3: {
    width: 4,
    height: 11,
    backgroundColor: '#64748B',
    borderRadius: 1,
  },
  finTrendLine: {
    position: 'absolute',
    top: 1,
    right: 0,
    width: 14,
    height: 2,
    backgroundColor: '#64748B',
    transform: [{ rotate: '-35deg' }],
    borderRadius: 1,
  },
  finPortfolioWrapper: {
    width: 20,
    height: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutHole: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#080C0A',
  },
  donutSlice: {
    position: 'absolute',
    width: 5,
    height: 10,
    backgroundColor: '#64748B',
    top: 0,
    right: 2,
    transform: [{ rotate: '25deg' }],
    borderTopRightRadius: 3,
  },
  finWalletShell: {
    width: 21,
    height: 15,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#64748B',
    justifyContent: 'center',
    paddingLeft: 3,
  },
  finWalletStripe: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#64748B',
  },
  finWalletChip: {
    position: 'absolute',
    right: 3,
    width: 4,
    height: 4,
    borderRadius: 1,
    backgroundColor: '#64748B',
  },
  finMarketOuter: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finMarketCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#64748B',
  },
});

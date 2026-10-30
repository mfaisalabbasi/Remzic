// src/screens/HomeScreen.tsx (or wherever your HomeScreen is located)
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { Colors } from '../../theme/colors';
import { useAuth } from '../../navigation/AuthContext';

import { useHomeData } from '../../components/home/useHomeData';
import { HomeHeader } from '../../components/home/HomeHeader';
import { PortfolioCard } from '../../components/home/PortfolioCard';
import { QuickActionsGrid } from '../../components/home/QuickActionsGrid';
import { FeaturedAssetCard } from '../../components/home/FeaturedAssetCard';

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // 👇 Backup safety trigger on Home mount if user ID is active
  useEffect(() => {
    const ensureFCMToken = async () => {
      const userId = user?.id || user?._id;
      if (!userId) return;

      try {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          const fcmToken = await messaging().getToken();
          if (fcmToken) {
            await fetch(`${API_URL}/users/fcm-token`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId, fcmToken, device: Platform.OS }),
              credentials: 'include',
            });
          }
        }
      } catch (e) {
        console.error('[HomeScreen] FCM backup sync failed:', e);
      }
    };

    ensureFCMToken();
  }, [user?.id]);

  const {
    userName,
    isBalanceHidden,
    setIsBalanceHidden,
    refreshing,
    loading,
    walletData,
    featuredAsset,
    totalInvested,
    availableBalance,
    unitPrice,
    tokenSupply,
    fundingTarget,
    fundingRaised,
    fundedPercentage,
    onRefresh,
  } = useHomeData(user);
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      <HomeHeader userName={userName} navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        <PortfolioCard
          walletData={walletData}
          loading={loading}
          isBalanceHidden={isBalanceHidden}
          setIsBalanceHidden={setIsBalanceHidden}
          totalInvested={totalInvested}
          availableBalance={availableBalance}
        />

        <QuickActionsGrid navigation={navigation} />

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured RWA Assets</Text>
            <Text style={styles.sectionSubtitle}>
              Institutional-grade real estate
            </Text>
          </View>
          <Text
            style={styles.viewAllText}
            onPress={() => navigation.navigate('Invest')}
          >
            View All →
          </Text>
        </View>

        <FeaturedAssetCard
          loading={loading}
          featuredAsset={featuredAsset}
          fundedPercentage={fundedPercentage}
          unitPrice={unitPrice}
          tokenSupply={tokenSupply}
          fundingTarget={fundingTarget}
          fundingRaised={fundingRaised}
          navigation={navigation}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03100B',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#F0FDF4',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    marginTop: 2,
  },
  viewAllText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});

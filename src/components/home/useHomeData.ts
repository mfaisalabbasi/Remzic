// src/components/home/useHomeData.ts
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { walletApi, WalletData } from '../../services/api/walletApi';
import { investmentApi } from '../../services/api/investmentApi';
import { fetchApprovedAssets, AssetData } from '../../services/api/asset';
import { secondaryMarketApi } from '../../services/api/secondaryMarketApi';

export const useHomeData = (user: any) => {
  const [userName, setUserName] = useState<string>('Investor');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [featuredAsset, setFeaturedAsset] = useState<AssetData | null>(null);

  useEffect(() => {
    const resolveUserIdentity = async () => {
      // 1. Check direct or nested user object properties from context
      const directName =
        user?.name || user?.user?.name || user?.fullName || user?.username;

      if (directName) {
        setUserName(directName);
        return;
      }

      // 2. Check AsyncStorage for stored user data or token
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const storedName =
            parsed?.name ||
            parsed?.user?.name ||
            parsed?.fullName ||
            parsed?.username;

          if (storedName) {
            setUserName(storedName);
            return;
          }
        }
      } catch (e) {
        console.warn('Could not retrieve user profile from storage', e);
      }

      // 3. Fallback: Fetch profile directly from secondaryMarketApi / backend `getMe()`
      try {
        const me = await secondaryMarketApi.getMe();
        const apiName = me?.name || me?.user?.name || me?.email?.split('@')[0];
        if (apiName) {
          setUserName(apiName);
        }
      } catch (err) {
        console.warn('Could not fetch profile via API', err);
      }
    };

    resolveUserIdentity();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [walletRes, investmentsRes, assetsRes] = await Promise.all([
        walletApi.getWalletData().catch(() => null),
        investmentApi.getMyInvestments().catch(() => []),
        fetchApprovedAssets().catch(() => []),
      ]);

      if (walletRes) setWalletData(walletRes);
      if (investmentsRes) setMyInvestments(investmentsRes);
      if (assetsRes && assetsRes.length > 0) {
        setFeaturedAsset(assetsRes[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const totalInvested = myInvestments.reduce(
    (sum, inv) => sum + (Number(inv.amount) || 0),
    0,
  );

  const availableBalance =
    walletData?.availableBalance ?? walletData?.balance ?? 0;

  const unitPrice = Number((featuredAsset as any)?.unitPrice ?? 10);
  const tokenSupply = Number((featuredAsset as any)?.tokenSupply ?? 1000);

  const fundingTarget = Number(
    (featuredAsset as any)?.totalValue ||
      (featuredAsset as any)?.target ||
      (featuredAsset as any)?.funding?.target ||
      tokenSupply * unitPrice ||
      10000,
  );

  const fundingRaised = Number(
    (featuredAsset as any)?.funded ??
      (featuredAsset as any)?.funding?.raised ??
      (featuredAsset as any)?.raised ??
      0,
  );

  const rawPercentage =
    fundingTarget > 0 ? (fundingRaised / fundingTarget) * 100 : 0;
  const fundedPercentage = Math.min(
    Math.max(Math.round(rawPercentage), 0),
    100,
  );

  return {
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
  };
};

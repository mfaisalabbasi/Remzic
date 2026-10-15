// src/screens/wallet/WalletScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  walletApi,
  WalletData,
  LedgerEntry,
} from '../../services/api/walletApi';

import { WalletHeader } from '../../components/wallet/WalletHeader';
import { WalletBalanceCard } from '../../components/wallet/WalletBalanceCard';
import { WalletTransactionsList } from '../../components/wallet/WalletTransactionsList';

const PALETTE = {
  bg: '#080C0A',
  textMuted: '#9CA3AF',
  accent: '#34D399',
};

export const WalletScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [topUpLoading, setTopUpLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setWallet(null);
      setTransactions([]);
      const [walletRes, transRes] = await Promise.all([
        walletApi.getWalletData(),
        walletApi.getWalletTransactions(),
      ]);
      setWallet(walletRes);
      setTransactions(transRes);
    } catch (err) {
      console.error('Wallet synchronization error:', err);
      Alert.alert('Error', 'Failed to synchronize ledger data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDummyDeposit = async () => {
    setTopUpLoading(true);
    try {
      await walletApi.dummyTopUp(5000);
      Alert.alert('Success', '5,000 SAR has been added to your Remzik wallet!');
      setTimeout(() => {
        loadData();
      }, 500);
    } catch (err) {
      Alert.alert('Error', 'Failed to deposit demo funds.');
    } finally {
      setTopUpLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: PALETTE.bg },
        ]}
      >
        <ActivityIndicator size="large" color={PALETTE.accent} />
        <Text style={styles.syncText}>Synchronizing Ledger...</Text>
      </View>
    );
  }

  const totalPortfolioValue = wallet
    ? wallet.availableBalance + wallet.lockedBalance
    : 0;

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      <WalletHeader
        topInset={insets.top}
        onRefresh={() => {
          setRefreshing(true);
          loadData();
        }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor={PALETTE.accent}
          />
        }
      >
        {wallet && (
          <WalletBalanceCard
            wallet={wallet}
            topUpLoading={topUpLoading}
            onDummyDeposit={handleDummyDeposit}
          />
        )}

        <WalletTransactionsList
          transactions={transactions}
          totalPortfolioValue={totalPortfolioValue}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  syncText: {
    color: PALETTE.textMuted,
    marginTop: 12,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});

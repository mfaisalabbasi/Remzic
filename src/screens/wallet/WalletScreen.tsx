import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Colors } from '../../theme/colors';

const recentTransactions = [
  {
    id: '1',
    type: 'Deposit',
    date: 'Apr 24, 2025',
    amount: '+$1,000.00',
    isPositive: true,
  },
  {
    id: '2',
    type: 'Investment',
    date: 'Apr 22, 2025',
    amount: '-$500.00',
    isPositive: false,
  },
  {
    id: '3',
    type: 'Distribution',
    date: 'Apr 20, 2025',
    amount: '+$85.00',
    isPositive: true,
  },
];

export const WalletScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wallet</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Summary Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Balance</Text>
          <Text style={styles.balanceAmount}>$ 24,680.50</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity style={styles.walletActionButton}>
              <Text style={styles.walletActionText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.walletActionButtonOutline}>
              <Text style={styles.walletActionTextOutline}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lockedRow}>
            <View>
              <Text style={styles.lockedLabel}>Locked Balance</Text>
              <Text style={styles.lockedValue}>$ 1,200.00</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View>
              <Text style={styles.lockedLabel}>Pending</Text>
              <Text style={styles.lockedValue}>$ 500.00</Text>
            </View>
          </View>
        </View>

        {/* Section Header: Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>

        {/* Transactions List */}
        {recentTransactions.map(item => (
          <View key={item.id} style={styles.transactionCard}>
            <View style={styles.transactionThumbPlaceholder}>
              <Text style={styles.transactionThumbIcon}>
                {item.type === 'Deposit'
                  ? '📥'
                  : item.type === 'Investment'
                  ? '📤'
                  : '💰'}
              </Text>
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.type}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.isPositive ? '#22C55E' : Colors.white },
              ]}
            >
              {item.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  balanceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
  },
  balanceTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 14,
  },
  walletActionButton: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  walletActionText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  walletActionButtonOutline: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  walletActionTextOutline: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  lockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
    marginTop: 4,
  },
  lockedLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 2,
  },
  lockedValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  verticalDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
    gap: 12,
  },
  transactionThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionThumbIcon: {
    fontSize: 18,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  transactionDate: {
    color: '#94A3B8',
    fontSize: 12,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});

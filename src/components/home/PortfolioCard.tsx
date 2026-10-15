import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { WalletData } from '../../services/api/walletApi';

interface PortfolioCardProps {
  walletData: WalletData | null;
  loading: boolean;
  isBalanceHidden: boolean;
  setIsBalanceHidden: (val: boolean) => void;
  totalInvested: number;
  availableBalance: number;
}

export const PortfolioCard = ({
  walletData,
  loading,
  isBalanceHidden,
  setIsBalanceHidden,
  totalInvested,
  availableBalance,
}: PortfolioCardProps) => (
  <View style={styles.portfolioCard}>
    <View style={styles.portfolioGlow} />
    <View style={styles.portfolioCardHeader}>
      <Text style={styles.portfolioTitle}>Available Balance</Text>
      <TouchableOpacity
        onPress={() => setIsBalanceHidden(!isBalanceHidden)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.eyeIcon}>{isBalanceHidden ? '🙈' : '👁'}</Text>
      </TouchableOpacity>
    </View>

    {loading && !walletData ? (
      <ActivityIndicator
        size="small"
        color={Colors.accent}
        style={{ marginVertical: 14 }}
      />
    ) : (
      <Text style={styles.portfolioAmount}>
        {isBalanceHidden
          ? '••••••••'
          : `$${availableBalance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
      </Text>
    )}

    <View style={styles.growthBadgeRow}>
      <View style={styles.growthBadge}>
        <Text style={styles.growthText}>📈 +12.4% All-Time</Text>
      </View>
      <Text style={styles.securityText}>🔒 Secured & Insured</Text>
    </View>

    <View style={styles.portfolioStatsRow}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Invested</Text>
        <Text style={styles.statValue}>
          {isBalanceHidden ? '••••' : `$${totalInvested.toLocaleString()}`}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Returns</Text>
        <Text style={styles.statValueSuccess}>
          {isBalanceHidden
            ? '••••'
            : `+$${(walletData?.totalEarned || 0).toLocaleString()}`}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Available</Text>
        <Text style={styles.statValue}>
          {isBalanceHidden ? '••••' : `$${availableBalance.toLocaleString()}`}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  portfolioCard: {
    backgroundColor: '#061A12',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  portfolioGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioTitle: {
    color: '#6EE7B7',
    opacity: 0.8,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  eyeIcon: { fontSize: 14 },
  portfolioAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  growthBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  growthBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  growthText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  securityText: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    fontWeight: '500',
  },
  portfolioStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.1)',
    paddingTop: 16,
  },
  statItem: { flex: 1, alignItems: 'flex-start' },
  statLabel: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    marginBottom: 3,
    fontWeight: '500',
  },
  statValue: { color: '#F0FDF4', fontSize: 13, fontWeight: '700' },
  statValueSuccess: { color: '#34D399', fontSize: 13, fontWeight: '700' },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 8,
  },
});

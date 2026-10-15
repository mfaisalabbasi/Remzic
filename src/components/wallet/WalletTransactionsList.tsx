// src/components/wallet/WalletTransactionsList.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LedgerEntry } from '../../services/api/walletApi';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  border: 'rgba(52, 211, 153, 0.15)',
  success: '#34D399',
};

const ArrowDownLeftIcon = ({ size = 18, color = PALETTE.success }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17 7L7 17M7 7h10v10" />
  </Svg>
);

const ArrowUpRightIcon = ({ size = 18, color = PALETTE.textMain }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M7 17L17 7M7 7h10v10" />
  </Svg>
);

interface WalletTransactionsListProps {
  transactions: LedgerEntry[];
  totalPortfolioValue: number;
}

export const WalletTransactionsList = ({
  transactions,
  totalPortfolioValue,
}: WalletTransactionsListProps) => {
  const getTxDetails = (source: string) => {
    switch (source) {
      case 'DISTRIBUTION_ENGINE':
        return { label: 'Profit Yield', isPositive: true };
      case 'PAYOUT_REQUEST':
      case 'PAYOUT_COMPLETED':
      case 'WITHDRAWAL':
        return { label: 'Withdrawal', isPositive: false };
      case 'INVESTMENT_CONFIRMATION':
      case 'WALLET_DEPOSIT':
        return { label: 'Capital Deposit', isPositive: true };
      case 'ASSET_INVESTMENT':
        return { label: 'Asset Allocation', isPositive: false };
      case 'ESCROW_LOCK':
        return { label: 'Escrow Lock', isPositive: false };
      default:
        return { label: 'Ledger Adjustment', isPositive: true };
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Transaction History</Text>
        <Text style={styles.sectionActionText}>
          Total Portfolio: SAR {totalPortfolioValue.toLocaleString()}
        </Text>
      </View>

      {transactions.length > 0 ? (
        transactions.map(item => {
          const details = getTxDetails(item.source);
          const isNegative = Number(item.amount) < 0;
          return (
            <View key={item.id} style={styles.transactionCard}>
              <View
                style={[
                  styles.transactionThumbContainer,
                  {
                    backgroundColor: !isNegative
                      ? 'rgba(52, 211, 153, 0.08)'
                      : 'rgba(239, 68, 68, 0.08)',
                    borderColor: !isNegative
                      ? 'rgba(52, 211, 153, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                  },
                ]}
              >
                {!isNegative ? (
                  <ArrowDownLeftIcon size={18} color={PALETTE.success} />
                ) : (
                  <ArrowUpRightIcon size={18} color={PALETTE.textMain} />
                )}
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionName}>{details.label}</Text>
                <Text style={styles.transactionCategory}>
                  {item.note || item.source} • {formatDate(item.createdAt)}
                </Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: !isNegative ? PALETTE.success : PALETTE.textMain },
                ]}
              >
                {isNegative ? '-' : '+'} SAR{' '}
                {Math.abs(Number(item.amount)).toLocaleString()}
              </Text>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No transactions found in your Remzik ledger.
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: PALETTE.textMain,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sectionActionText: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 12,
    gap: 12,
  },
  transactionThumbContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  transactionCategory: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  emptyText: {
    color: PALETTE.textMuted,
    fontSize: 12,
  },
});

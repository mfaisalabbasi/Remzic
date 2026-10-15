// src/components/wallet/WalletBalanceCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { WalletData } from '../../services/api/walletApi';

const PALETTE = {
  cardBg: '#111816',
  cardAlt: '#151D1B',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  border: 'rgba(52, 211, 153, 0.15)',
};

const PlusIcon = ({ size = 16, color = PALETTE.accentText }) => (
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
    <Path d="M12 5v14M5 12h14" />
  </Svg>
);

const ArrowUpIcon = ({ size = 16, color = PALETTE.textMain }) => (
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
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

interface WalletBalanceCardProps {
  wallet: WalletData;
  topUpLoading: boolean;
  onDummyDeposit: () => void;
}

export const WalletBalanceCard = ({
  wallet,
  topUpLoading,
  onDummyDeposit,
}: WalletBalanceCardProps) => (
  <View style={styles.balanceCard}>
    <Text style={styles.balanceTitle}>Available Liquid Balance</Text>
    <Text style={styles.balanceAmount}>
      SAR {wallet.availableBalance.toLocaleString()}
    </Text>

    <View style={styles.actionButtonsRow}>
      <TouchableOpacity
        style={[styles.walletActionButton, topUpLoading && { opacity: 0.7 }]}
        activeOpacity={0.8}
        onPress={onDummyDeposit}
        disabled={topUpLoading}
      >
        <PlusIcon size={16} color={PALETTE.accentText} />
        <Text style={styles.walletActionText}>
          {topUpLoading ? 'Processing...' : 'Deposit (Demo 5k)'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.walletActionButtonOutline}
        activeOpacity={0.8}
        onPress={() => Alert.alert('Notice', 'Withdrawal feature coming soon!')}
      >
        <ArrowUpIcon size={16} color={PALETTE.textMain} />
        <Text style={styles.walletActionTextOutline}>Withdraw</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.lockedRow}>
      <View style={styles.lockedColumn}>
        <Text style={styles.lockedLabel}>Locked in RWA</Text>
        <Text style={styles.lockedValue}>
          SAR {wallet.lockedBalance.toLocaleString()}
        </Text>
      </View>
      <View style={styles.verticalDivider} />
      <View style={styles.lockedColumn}>
        <Text style={styles.lockedLabel}>Pending Settlement</Text>
        <Text style={styles.lockedValue}>
          SAR {(wallet.pendingPayout || 0).toLocaleString()}
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  balanceCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  balanceTitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: PALETTE.textMain,
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 18,
  },
  walletActionButton: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  walletActionText: {
    color: PALETTE.accentText,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  walletActionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: PALETTE.cardAlt,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  walletActionTextOutline: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '600',
  },
  lockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
    marginTop: 4,
  },
  lockedColumn: {
    flex: 1,
    alignItems: 'center',
  },
  lockedLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '500',
  },
  lockedValue: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'center',
  },
});

// src/components/wallet/WalletHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
};

const RefreshCwIcon = ({ size = 16, color = PALETTE.accent }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 4v6h-6M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </Svg>
);

interface WalletHeaderProps {
  topInset: number;
  onRefresh: () => void;
}

export const WalletHeader = ({ topInset, onRefresh }: WalletHeaderProps) => (
  <View style={[styles.header, { paddingTop: Math.max(topInset, 16) }]}>
    <View>
      <Text style={styles.headerSubtitle}>Liquidity & Funds</Text>
      <Text style={styles.headerTitle}>Digital Wallet</Text>
    </View>
    <TouchableOpacity
      style={styles.headerIconButton}
      activeOpacity={0.7}
      onPress={onRefresh}
    >
      <RefreshCwIcon size={16} color={PALETTE.accent} />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: PALETTE.textMain,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
});

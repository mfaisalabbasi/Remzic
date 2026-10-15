// src/components/distributions/DistributionsVaultSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const TrendingUpIcon = ({ size = 16, color = '#34D399' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

interface DistributionsVaultSummaryProps {
  totalDistributed: number;
  totalRecords: number;
}

export const DistributionsVaultSummary = ({
  totalDistributed,
  totalRecords,
}: DistributionsVaultSummaryProps) => (
  <View style={styles.vaultCard}>
    <View style={styles.vaultCardGlowTop} />
    <View style={styles.vaultHeaderRow}>
      <Text style={styles.vaultLabel}>Total Realized Yield Payouts</Text>
      <View style={styles.growthBadge}>
        <TrendingUpIcon size={12} color="#34D399" />
        <Text style={styles.growthText}>Live Sync</Text>
      </View>
    </View>
    <Text style={styles.vaultAmount}>
      ${totalDistributed.toLocaleString('en-US', { minimumFractionDigits: 2 })}
    </Text>
    <View style={styles.vaultDivider} />
    <View style={styles.vaultMetaGrid}>
      <View>
        <Text style={styles.vaultMetaLabel}>Active Records</Text>
        <Text style={styles.vaultMetaValue}>{totalRecords} Total</Text>
      </View>
      <View style={styles.vaultMetaAlignRight}>
        <Text style={styles.vaultMetaLabel}>Protocol Sync Status</Text>
        <Text style={[styles.vaultMetaValue, { color: '#34D399' }]}>
          Connected
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  vaultCard: {
    backgroundColor: '#111816',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  vaultCardGlowTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#34D399',
    opacity: 0.6,
  },
  vaultHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vaultLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  growthText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
  vaultAmount: {
    color: '#F0FDF4',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  vaultDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
  },
  vaultMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vaultMetaLabel: { color: '#64748B', fontSize: 11, marginBottom: 2 },
  vaultMetaValue: { color: '#F0FDF4', fontSize: 13, fontWeight: '700' },
  vaultMetaAlignRight: { alignItems: 'flex-end' },
});

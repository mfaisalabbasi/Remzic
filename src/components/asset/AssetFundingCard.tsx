// src/components/investment/AssetFundingCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PALETTE = {
  cardBg: '#111816',
  cardSubBg: '#18221F',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
};

export const AssetFundingCard = ({
  fundingPercentage,
  property,
}: {
  fundingPercentage: number;
  property: any;
}) => (
  <View style={styles.fundingCard}>
    <View style={styles.fundingHeaderRow}>
      <Text style={styles.fundingCardTitle}>Capital Allocation Progress</Text>
      <Text style={styles.fundingPercentageText}>
        {fundingPercentage}% Funded
      </Text>
    </View>
    <View style={styles.progressBarBackground}>
      <View
        style={[styles.progressBarFill, { width: `${fundingPercentage}%` }]}
      />
    </View>
    <View style={styles.fundingStatsRow}>
      <Text style={styles.fundingStatSub}>
        Raised:{' '}
        <Text style={styles.fundingStatHighlight}>
          ${property.funded.toLocaleString()}
        </Text>
      </Text>
      <Text style={styles.fundingStatSub}>
        Target:{' '}
        <Text style={styles.fundingStatHighlight}>
          ${property.totalValue.toLocaleString()}
        </Text>
      </Text>
      <Text style={styles.fundingStatSub}>
        Investors:{' '}
        <Text style={styles.fundingStatHighlight}>
          {property.investorsCount}
        </Text>
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  fundingCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 24,
  },
  fundingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  fundingCardTitle: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  fundingPercentageText: {
    color: PALETTE.accent,
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: PALETTE.cardSubBg,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: PALETTE.accent,
    borderRadius: 4,
  },
  fundingStatsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fundingStatSub: { color: PALETTE.textMuted, fontSize: 11, fontWeight: '500' },
  fundingStatHighlight: { color: PALETTE.textMain, fontWeight: '700' },
});

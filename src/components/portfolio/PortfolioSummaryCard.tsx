// src/components/portfolio/PortfolioSummaryCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  cardAlt: '#151D1B',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  success: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
};

const TrendingUpIcon = ({ size = 14, color = PALETTE.success }) => (
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
    <Path d="M23 6l-9.5 9.5-5-5L1 18" />
    <Path d="M17 6h6v6" />
  </Svg>
);

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

interface PortfolioSummaryCardProps {
  netAssetValue: number;
  onPressDeposit: () => void;
  onPressStatements: () => void;
}

export const PortfolioSummaryCard = ({
  netAssetValue,
  onPressDeposit,
  onPressStatements,
}: PortfolioSummaryCardProps) => (
  <View style={styles.portfolioCard}>
    <View style={styles.portfolioCardTopRow}>
      <Text style={styles.portfolioTitle}>Net Asset Value</Text>
      <View style={styles.liveIndicator}>
        <View style={styles.livePulse} />
        <Text style={styles.liveText}>Live DB Sync</Text>
      </View>
    </View>

    <Text style={styles.portfolioAmount}>
      $
      {netAssetValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </Text>

    <View style={styles.growthBadgeContainer}>
      <View style={styles.growthBadge}>
        <TrendingUpIcon size={13} color={PALETTE.success} />
        <Text style={styles.growthText}>+12.4% All-Time Yield</Text>
      </View>
    </View>

    <View style={styles.quickActionsRow}>
      <TouchableOpacity
        style={styles.actionButtonPrimary}
        activeOpacity={0.8}
        onPress={onPressDeposit}
      >
        <PlusIcon size={15} color={PALETTE.accentText} />
        <Text style={styles.actionButtonPrimaryText}>Deposit Capital</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButtonSecondary}
        activeOpacity={0.8}
        onPress={onPressStatements}
      >
        <Text style={styles.actionButtonSecondaryText}>Statements</Text>
      </TouchableOpacity>
    </View>

    <View style={styles.allocationContainer}>
      <Text style={styles.allocationHeaderTitle}>Asset Distribution</Text>

      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressSegment,
            { width: '72%', backgroundColor: PALETTE.accent },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { width: '18%', backgroundColor: '#38BDF8' },
          ]}
        />
        <View
          style={[
            styles.progressSegment,
            { width: '10%', backgroundColor: '#A855F7' },
          ]}
        />
      </View>

      <View style={styles.allocationRowsGroup}>
        <View style={styles.allocationRow}>
          <View style={styles.allocationLabelGroup}>
            <View style={[styles.dot, { backgroundColor: PALETTE.accent }]} />
            <Text style={styles.allocationLabel}>Real Estate RWA</Text>
          </View>
          <Text style={styles.allocationValue}>72%</Text>
        </View>
        <View style={styles.allocationRow}>
          <View style={styles.allocationLabelGroup}>
            <View style={[styles.dot, { backgroundColor: '#38BDF8' }]} />
            <Text style={styles.allocationLabel}>Stable Liquid Cash</Text>
          </View>
          <Text style={styles.allocationValue}>18%</Text>
        </View>
        <View style={styles.allocationRow}>
          <View style={styles.allocationLabelGroup}>
            <View style={[styles.dot, { backgroundColor: '#A855F7' }]} />
            <Text style={styles.allocationLabel}>Venture Tokens</Text>
          </View>
          <Text style={styles.allocationValue}>10%</Text>
        </View>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  portfolioCard: {
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
  portfolioCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioTitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 6,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.accent,
  },
  liveText: {
    color: PALETTE.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  portfolioAmount: {
    color: PALETTE.textMain,
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  growthBadgeContainer: { marginBottom: 20 },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  growthText: { color: PALETTE.success, fontSize: 12, fontWeight: '700' },
  quickActionsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  actionButtonPrimary: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionButtonPrimaryText: {
    color: PALETTE.accentText,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: PALETTE.cardAlt,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  actionButtonSecondaryText: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '600',
  },
  allocationContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
  },
  allocationHeaderTitle: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 14,
    gap: 2,
  },
  progressSegment: { height: '100%' },
  allocationRowsGroup: { gap: 8 },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocationLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  allocationLabel: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  allocationValue: { color: PALETTE.textMain, fontSize: 12, fontWeight: '700' },
});

// src/components/portfolio/PortfolioHoldingsList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
  success: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
  warning: '#FBBF24',
};

const BuildingIcon = ({ size = 20, color = PALETTE.accent }) => (
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
    <Path d="M6 22V2a2 2 0 012-2h8a2 2 0 012 2v20zM6 6h12M6 10h12M6 14h12M6 18h12" />
  </Svg>
);

const ArrowUpRightIcon = ({ size = 16, color = PALETTE.textMain }) => (
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
    <Path d="M7 17L17 7M7 7h10v10" />
  </Svg>
);

interface PortfolioHoldingsListProps {
  investments: any[];
  loading: boolean;
  onOpenHolding: (item: any) => void;
  onExploreMarketplace: () => void;
}

export const PortfolioHoldingsList = ({
  investments,
  loading,
  onOpenHolding,
  onExploreMarketplace,
}: PortfolioHoldingsListProps) => (
  <>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Active Holdings</Text>
      <Text style={styles.sectionCount}>{investments.length} Assets</Text>
    </View>

    {loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={PALETTE.accent} />
        <Text style={styles.loaderText}>
          Syncing blockchain & database ledgers...
        </Text>
      </View>
    ) : investments.length === 0 ? (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>
          No active investments found in your account.
        </Text>
        <TouchableOpacity
          style={styles.exploreButton}
          onPress={onExploreMarketplace}
        >
          <Text style={styles.exploreButtonText}>Explore RWA Assets</Text>
        </TouchableOpacity>
      </View>
    ) : (
      investments.map(item => (
        <TouchableOpacity
          key={item.id || item._id}
          style={styles.investmentCard}
          onPress={() => onOpenHolding(item)}
          activeOpacity={0.85}
        >
          <View style={styles.investmentThumbContainer}>
            <BuildingIcon size={20} color={PALETTE.accent} />
          </View>
          <View style={styles.investmentInfo}>
            <Text style={styles.investmentName} numberOfLines={1}>
              {item.title || item.assetName || 'RWA Asset Position'}
            </Text>
            <Text style={styles.investmentSubtext}>
              {item.shares || 'Tokens'} • {item.location || item.settlementMode}
            </Text>
          </View>
          <View style={styles.investmentRightSection}>
            <Text style={styles.investmentAmount}>
              ${Number(item.amount || 0).toLocaleString()}
            </Text>
            <View
              style={[
                styles.returnBadge,
                item.status === 'PENDING' && styles.pendingBadge,
              ]}
            >
              <Text
                style={[
                  styles.investmentReturnText,
                  item.status === 'PENDING' && styles.pendingText,
                ]}
              >
                {item.status === 'PENDING'
                  ? 'Pending Sync'
                  : item.returnRate || '+8.5% pa'}
              </Text>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            <ArrowUpRightIcon size={14} color={PALETTE.textMuted} />
          </View>
        </TouchableOpacity>
      ))
    )}
  </>
);

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
  sectionCount: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '600' },
  loaderContainer: { paddingVertical: 40, alignItems: 'center', gap: 12 },
  loaderText: { color: PALETTE.textMuted, fontSize: 12 },
  emptyCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  emptyText: {
    color: PALETTE.textMuted,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: PALETTE.accentText,
    fontWeight: '700',
    fontSize: 12,
  },
  investmentCard: {
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
  investmentThumbContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  investmentInfo: { flex: 1 },
  investmentName: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  investmentSubtext: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  investmentRightSection: { alignItems: 'flex-end' },
  investmentAmount: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  returnBadge: {
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pendingBadge: { backgroundColor: 'rgba(251, 191, 36, 0.1)' },
  investmentReturnText: {
    color: PALETTE.success,
    fontSize: 11,
    fontWeight: '700',
  },
  pendingText: { color: PALETTE.warning },
  chevronContainer: { marginLeft: 4, justifyContent: 'center' },
});

// src/components/distributions/DistributionsList.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

type DistributionStatus = 'Upcoming' | 'Processing' | 'Paid' | 'Ready';

interface DistributionItem {
  id: string;
  batchId?: string;
  title: string;
  location: string;
  date: string;
  rawDate: string;
  amount: number;
  currency: string;
  status: DistributionStatus;
  distributionMode?: 'OFF_CHAIN' | 'ON_CHAIN';
  txHash?: string;
  tokenStandard: string;
  yieldRate: string;
  assetType: string;
  contractAddress?: string;
}

const DISTRIBUTION_TABS: readonly DistributionStatus[] = [
  'Upcoming',
  'Processing',
  'Paid',
];

const BuildingIcon = ({ size = 20, color = '#34D399' }) => (
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
    <Rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <Path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01M8 14h.01M16 14h.01M12 14h.01" />
  </Svg>
);

const EmptyVaultIcon = ({ size = 48, color = '#64748B' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <Path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#64748B' }) => (
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
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

interface DistributionsListProps {
  selectedTab: DistributionStatus;
  setSelectedTab: (tab: DistributionStatus) => void;
  counts: Record<string, number>;
  loading: boolean;
  refreshing: boolean;
  filteredDistributions: DistributionItem[];
  onOpenReceipt: (item: DistributionItem) => void;
}

export const DistributionsList = ({
  selectedTab,
  setSelectedTab,
  counts,
  loading,
  refreshing,
  filteredDistributions,
  onOpenReceipt,
}: DistributionsListProps) => (
  <>
    <View style={styles.segmentContainer}>
      {DISTRIBUTION_TABS.map(tab => {
        const isActive = selectedTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[
              styles.segmentButton,
              isActive && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedTab(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[styles.segmentText, isActive && styles.segmentTextActive]}
            >
              {tab} ({counts[tab]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    {loading && !refreshing ? (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="#34D399" />
      </View>
    ) : filteredDistributions.length > 0 ? (
      <View style={styles.cardListContainer}>
        {filteredDistributions.map(item => {
          const isPaid = item.status === 'Paid';
          const isReady = item.status === 'Ready';
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.distributionCard}
              activeOpacity={0.78}
              onPress={() => onOpenReceipt(item)}
            >
              <View style={styles.distributionIconBox}>
                <BuildingIcon size={20} color="#34D399" />
              </View>
              <View style={styles.distributionDetails}>
                <Text style={styles.distributionCardTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.distributionCardDate}>{item.date}</Text>
                <Text style={styles.distributionSmartTag}>
                  {isPaid
                    ? '✓ Yield Claimed & Paid'
                    : isReady
                    ? '⚡ Ready to Sign & Claim'
                    : 'Automated Platform Credit'}
                </Text>
              </View>
              <View style={styles.distributionActionCol}>
                <Text style={styles.distributionCardAmount}>
                  ${item.amount.toFixed(2)}
                </Text>
                <View style={styles.badgeRow}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isPaid
                          ? 'rgba(52, 211, 153, 0.12)'
                          : isReady
                          ? 'rgba(245, 158, 11, 0.12)'
                          : 'rgba(59, 130, 246, 0.12)',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        {
                          color: isPaid
                            ? '#34D399'
                            : isReady
                            ? '#F59E0B'
                            : '#60A5FA',
                        },
                      ]}
                    >
                      Check
                    </Text>
                  </View>
                  <ChevronRightIcon size={14} color="#64748B" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconCircle}>
          <EmptyVaultIcon size={36} color="#64748B" />
        </View>
        <Text style={styles.emptyTitle}>No Distributions Found</Text>
        <Text style={styles.emptySubtitle}>
          You have no active {selectedTab.toLowerCase()} distributions matching
          your criteria.
        </Text>
      </View>
    )}
  </>
);

const styles = StyleSheet.create({
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#111816',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: { backgroundColor: '#34D399' },
  segmentText: { color: '#94A3B8', fontSize: 12, fontWeight: '600' },
  segmentTextActive: { color: '#080C0A', fontWeight: '700' },
  cardListContainer: { gap: 12 },
  distributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  distributionIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  distributionDetails: { flex: 1, marginRight: 10 },
  distributionCardTitle: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  distributionCardDate: { color: '#94A3B8', fontSize: 11, marginBottom: 4 },
  distributionSmartTag: { color: '#34D399', fontSize: 10, fontWeight: '600' },
  distributionActionCol: { alignItems: 'flex-end' },
  distributionCardAmount: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusBadgeText: { fontSize: 10, fontWeight: '700' },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  emptyTitle: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Modal,
  Clipboard,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { Colors } from '../../theme/colors';

// --- TYPES & DATA CONTRACTS ---
type DistributionStatus = 'Upcoming' | 'Processing' | 'Paid';

interface DistributionItem {
  id: string;
  title: string;
  location: string;
  date: string;
  rawDate: string; // for sorting/filtering
  amount: number;
  currency: string;
  status: DistributionStatus;
  txHash: string;
  tokenStandard: string;
  yieldRate: string;
  assetType: string;
}

const DISTRIBUTION_TABS: readonly DistributionStatus[] = [
  'Upcoming',
  'Processing',
  'Paid',
];

const MOCK_DISTRIBUTIONS: DistributionItem[] = [
  {
    id: '1',
    title: 'Dubai Creek Residence',
    location: 'Downtown Dubai, UAE',
    date: 'Q2 2026 • Apr 30, 2026',
    rawDate: '2026-04-30',
    amount: 85.0,
    currency: 'USD',
    status: 'Upcoming',
    txHash: '0x8f3c7a2b19e4d5f6871092a34b12c98d',
    tokenStandard: 'ERC-3643 (RWA Token)',
    yieldRate: '8.4% APY',
    assetType: 'Prime Real Estate',
  },
  {
    id: '2',
    title: 'Riyadh Business Tower',
    location: 'King Fahd Road, Riyadh',
    date: 'Q1 2026 • Mar 15, 2026',
    rawDate: '2026-03-15',
    amount: 120.0,
    currency: 'USD',
    status: 'Paid',
    txHash: '0x3d2a1b4c9e817f6a5b4c3d2e1f098a7b',
    tokenStandard: 'ERC-3643 (RWA Token)',
    yieldRate: '9.1% APY',
    assetType: 'Commercial Grade A',
  },
  {
    id: '3',
    title: 'London City Apartments',
    location: 'Canary Wharf, London',
    date: 'Q1 2026 • Mar 10, 2026',
    rawDate: '2026-03-10',
    amount: 65.0,
    currency: 'USD',
    status: 'Paid',
    txHash: '0x7c9b4a1f44e3d2c1b0a9f8e7d6c5b4a3',
    tokenStandard: 'ERC-3643 (RWA Token)',
    yieldRate: '7.8% APY',
    assetType: 'Residential Multi-Family',
  },
];

// --- PRECISION FINTECH SVG VECTOR ICONS ---
const ArrowLeftIcon = ({ size = 20, color = Colors.white }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const BuildingIcon = ({ size = 20, color = Colors.accent }) => (
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

const EmptyVaultIcon = ({ size = 48, color = '#475569' }) => (
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

const CloseIcon = ({ size = 18, color = Colors.white }) => (
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
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const CopyIcon = ({ size = 15, color = Colors.accent }) => (
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
    <Rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <Path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </Svg>
);

const CheckCircleIcon = ({ size = 15, color = '#34D399' }) => (
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
    <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
    <Path d="M22 4L12 14.01l-3-3" />
  </Svg>
);

export const DistributionsScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] =
    useState<DistributionStatus>('Upcoming');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DistributionItem | null>(
    null,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pull-to-refresh handler simulating secure ledger state synchronization
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Compute metrics dynamically from data
  const totalDistributed = useMemo(() => {
    return MOCK_DISTRIBUTIONS.filter(item => item.status === 'Paid').reduce(
      (acc, curr) => acc + curr.amount,
      0,
    );
  }, []);

  const counts = useMemo(() => {
    return {
      Upcoming: MOCK_DISTRIBUTIONS.filter(i => i.status === 'Upcoming').length,
      Processing: MOCK_DISTRIBUTIONS.filter(i => i.status === 'Processing')
        .length,
      Paid: MOCK_DISTRIBUTIONS.filter(i => i.status === 'Paid').length,
    };
  }, []);

  const filteredDistributions = useMemo(() => {
    return MOCK_DISTRIBUTIONS.filter(item => item.status === selectedTab);
  }, [selectedTab]);

  const handleOpenReceipt = (item: DistributionItem) => {
    setSelectedItem(item);
    setModalVisible(true);
    setCopied(false);
  };

  const handleCopyHash = (hash: string) => {
    Clipboard.setString(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Institutional Top App Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <ArrowLeftIcon size={18} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yield & Distributions</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
            colors={[Colors.accent]}
          />
        }
      >
        {/* World-Class Institutional Portfolio Summary Vault Card */}
        <View style={styles.vaultCard}>
          <View style={styles.vaultCardGlowTop} />
          <View style={styles.vaultHeaderRow}>
            <Text style={styles.vaultLabel}>Total Realized Yield Payouts</Text>
            <View style={styles.growthBadge}>
              <TrendingUpIcon size={12} color="#34D399" />
              <Text style={styles.growthText}>+14.2% YoY</Text>
            </View>
          </View>
          <Text style={styles.vaultAmount}>
            $
            {totalDistributed.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
          </Text>

          <View style={styles.vaultDivider} />

          <View style={styles.vaultMetaGrid}>
            <View>
              <Text style={styles.vaultMetaLabel}>Next Smart Payout</Text>
              <Text style={styles.vaultMetaValue}>Apr 30, 2026</Text>
            </View>
            <View style={styles.vaultMetaAlignRight}>
              <Text style={styles.vaultMetaLabel}>Active Tokenized RWA</Text>
              <Text style={styles.vaultMetaValue}>3 Properties</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Segmented Navigation Tabs */}
        <View style={styles.segmentContainer}>
          {DISTRIBUTION_TABS.map(tab => {
            const isActive = selectedTab === tab;
            const count = counts[tab];
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
                  style={[
                    styles.segmentText,
                    isActive && styles.segmentTextActive,
                  ]}
                >
                  {tab} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Distribution Card Rows */}
        {filteredDistributions.length > 0 ? (
          <View style={styles.cardListContainer}>
            {filteredDistributions.map(item => {
              const isPaid = item.status === 'Paid';
              const isProcessing = item.status === 'Processing';
              const badgeBg = isPaid
                ? 'rgba(52, 211, 153, 0.12)'
                : isProcessing
                ? 'rgba(59, 130, 246, 0.12)'
                : 'rgba(251, 191, 36, 0.12)';
              const badgeColor = isPaid
                ? '#34D399'
                : isProcessing
                ? '#60A5FA'
                : '#FBBF24';

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.distributionCard}
                  activeOpacity={0.78}
                  onPress={() => handleOpenReceipt(item)}
                >
                  <View style={styles.distributionIconBox}>
                    <BuildingIcon size={20} color={Colors.accent} />
                  </View>

                  <View style={styles.distributionDetails}>
                    <Text
                      style={styles.distributionCardTitle}
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.distributionCardDate}>{item.date}</Text>
                    <Text style={styles.distributionSmartTag}>
                      Smart Contract Yield
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
                          { backgroundColor: badgeBg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: badgeColor },
                          ]}
                        >
                          {item.status}
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
              You have no {selectedTab.toLowerCase()} distributions matching
              your institutional portfolio parameters.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Interactive Smart Contract Transaction Receipt Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHandleBar} />
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Smart Contract Receipt</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.7}
              >
                <CloseIcon size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalScrollBody}
              >
                {/* Hero Receipt Card */}
                <View style={styles.receiptHeroCard}>
                  <View style={styles.receiptHeroIconCircle}>
                    <BuildingIcon size={26} color={Colors.accent} />
                  </View>
                  <Text style={styles.receiptAssetTitle}>
                    {selectedItem.title}
                  </Text>
                  <Text style={styles.receiptLocation}>
                    {selectedItem.location}
                  </Text>

                  <Text style={styles.receiptAmountDisplay}>
                    ${selectedItem.amount.toFixed(2)}
                  </Text>

                  <View style={styles.receiptStatusPill}>
                    <Text style={styles.receiptStatusPillText}>
                      {selectedItem.status} • Verified Execution
                    </Text>
                  </View>
                </View>

                {/* Technical Ledger Parameter Breakdown */}
                <View style={styles.ledgerInfoCard}>
                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerKey}>Asset Class</Text>
                    <Text style={styles.ledgerVal}>
                      {selectedItem.assetType}
                    </Text>
                  </View>
                  <View style={styles.ledgerDivider} />

                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerKey}>Distribution Cycle</Text>
                    <Text style={styles.ledgerVal}>
                      {selectedItem.date.split('•')[0].trim()}
                    </Text>
                  </View>
                  <View style={styles.ledgerDivider} />

                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerKey}>Tokenization Standard</Text>
                    <Text style={styles.ledgerVal}>
                      {selectedItem.tokenStandard}
                    </Text>
                  </View>
                  <View style={styles.ledgerDivider} />

                  <View style={styles.ledgerRow}>
                    <Text style={styles.ledgerKey}>Underlying Yield Rate</Text>
                    <Text style={[styles.ledgerVal, { color: '#34D399' }]}>
                      {selectedItem.yieldRate}
                    </Text>
                  </View>
                  <View style={styles.ledgerDivider} />

                  <View style={styles.ledgerColumn}>
                    <Text style={styles.ledgerKey}>
                      On-Chain Transaction Hash
                    </Text>
                    <TouchableOpacity
                      style={styles.hashContainer}
                      onPress={() => handleCopyHash(selectedItem.txHash)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={styles.hashText}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {selectedItem.txHash}
                      </Text>
                      {copied ? (
                        <CheckCircleIcon size={14} color="#34D399" />
                      ) : (
                        <CopyIcon size={14} color={Colors.accent} />
                      )}
                    </TouchableOpacity>
                    {copied && (
                      <Text style={styles.copyFeedbackText}>
                        Copied transaction hash to clipboard
                      </Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.modalDoneButton}
                  onPress={() => setModalVisible(false)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalDoneButtonText}>Close Receipt</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 58,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#080C0A',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  headerTitle: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: {
    width: 38,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 48,
  },
  vaultCard: {
    backgroundColor: '#111816',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
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
  vaultLabel: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
  },
  growthText: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  vaultAmount: {
    color: '#F0FDF4',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginBottom: 16,
  },
  vaultDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    marginBottom: 16,
  },
  vaultMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vaultMetaLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 2,
  },
  vaultMetaValue: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
  },
  vaultMetaAlignRight: {
    alignItems: 'flex-end',
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#111816',
    borderRadius: 14,
    padding: 4,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentButtonActive: {
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  segmentText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: '#080C0A',
    fontWeight: '800',
  },
  cardListContainer: {
    gap: 12,
  },
  distributionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    gap: 12,
  },
  distributionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  distributionDetails: {
    flex: 1,
  },
  distributionCardTitle: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  distributionCardDate: {
    color: '#94A3B8',
    fontSize: 11.5,
    marginBottom: 4,
  },
  distributionSmartTag: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '600',
    opacity: 0.9,
  },
  distributionActionCol: {
    alignItems: 'flex-end',
  },
  distributionCardAmount: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    paddingVertical: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 4,
  },
  emptyTitle: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#94A3B8',
    fontSize: 12.5,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#080C0A',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    maxHeight: '90%',
  },
  modalHandleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#334155',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    color: '#F0FDF4',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalCloseButton: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  modalScrollBody: {
    paddingBottom: 10,
  },
  receiptHeroCard: {
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 20,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
  },
  receiptHeroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 12,
  },
  receiptAssetTitle: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  receiptLocation: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  receiptAmountDisplay: {
    color: '#F0FDF4',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  receiptStatusPill: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
  },
  receiptStatusPillText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  ledgerInfoCard: {
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 20,
    gap: 14,
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ledgerColumn: {
    gap: 8,
  },
  ledgerKey: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  ledgerVal: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '600',
  },
  ledgerDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#080C0A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    gap: 8,
  },
  hashText: {
    color: '#94A3B8',
    fontSize: 11.5,
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  copyFeedbackText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },
  modalDoneButton: {
    backgroundColor: '#34D399',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalDoneButtonText: {
    color: '#080C0A',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

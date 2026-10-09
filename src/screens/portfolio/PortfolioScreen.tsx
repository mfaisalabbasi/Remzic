import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import axios from 'axios';

// --- Institutional Grade Color Palette ---
const PALETTE = {
  bg: '#080C0A', // Deep Obsidian
  cardBg: '#111816', // Slightly lighter dark gray
  textMain: '#F9FAFB', // Almost white
  textMuted: '#9CA3AF', // Gray 400
  accent: '#34D399', // Emerald Green
  accentText: '#053121', // Very dark high contrast text for buttons
  border: 'rgba(52, 211, 153, 0.15)', // Subtle emerald border
  success: '#34D399',
  cardAlt: '#151D1B',
  modalBg: '#0D1311',
  warning: '#FBBF24',
};

// --- Icons ---
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

const CloseIcon = ({ size = 20, color = PALETTE.textMuted }) => (
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
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

const ShieldCheckIcon = ({ size = 16, color = PALETTE.accent }) => (
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
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const GlobeIcon = ({ size = 16, color = PALETTE.textMuted }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </Svg>
);

const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:4000/api'
    : 'http://localhost:4000/api';

export const PortfolioScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const insets = useSafeAreaInsets();

  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [netAssetValue, setNetAssetValue] = useState<number>(0);

  const [selectedHolding, setSelectedHolding] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [downloadingDeed, setDownloadingDeed] = useState<boolean>(false);

  const fetchMyInvestments = async () => {
    try {
      const token = route?.params?.token || 'USER_JWT_TOKEN_HERE';

      const response = await axios.get(`${API_BASE_URL}/investments/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data || [];
      setInvestments(data);

      const totalNav = data.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0,
      );
      setNetAssetValue(totalNav);
    } catch (error: any) {
      console.error('Failed to load portfolio investments:', error?.message);
      Alert.alert(
        'Sync Error',
        'Could not fetch your live investments from server.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyInvestments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMyInvestments();
  }, []);

  const handleOpenHolding = async (item: any) => {
    try {
      const token = route?.params?.token || 'USER_JWT_TOKEN_HERE';
      if (item.id) {
        const liveStatusRes = await axios.get(
          `${API_BASE_URL}/investments/${item.id}/db-status`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSelectedHolding({ ...item, ...liveStatusRes.data });
      } else {
        setSelectedHolding(item);
      }
    } catch {
      setSelectedHolding(item);
    } finally {
      setModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedHolding(null);
  };

  const handleDownloadDeed = async () => {
    if (!selectedHolding?.deedUrl) {
      Alert.alert(
        'Notice',
        'Cryptographic deed registry record is pending final block confirmation.',
      );
      return;
    }
    setDownloadingDeed(true);
    try {
      setTimeout(async () => {
        setDownloadingDeed(false);
        await Share.share({
          message: `Official Legal Title Deed & Trust Declaration for ${selectedHolding.title}. Verified Vault Registry: ${selectedHolding.deedUrl}`,
          title: 'Institutional Title Deed',
        });
      }, 800);
    } catch {
      setDownloadingDeed(false);
      Alert.alert('Error', 'Unable to fetch secure document from vault.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View>
          <Text style={styles.headerSubtitle}>Wealth Dashboard</Text>
          <Text style={styles.headerTitle}>Portfolio Overview</Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Notifications')}
        >
          <View style={styles.notificationDot} />
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={PALETTE.textMain}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
          </Svg>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={PALETTE.accent}
          />
        }
      >
        {/* Total Portfolio Value Summary Card */}
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

          {/* Quick Actions Row */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.actionButtonPrimary}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Deposit')}
            >
              <PlusIcon size={15} color={PALETTE.accentText} />
              <Text style={styles.actionButtonPrimaryText}>
                Deposit Capital
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Statements')}
            >
              <Text style={styles.actionButtonSecondaryText}>Statements</Text>
            </TouchableOpacity>
          </View>

          {/* Asset Distribution Breakdown */}
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
                  <View
                    style={[styles.dot, { backgroundColor: PALETTE.accent }]}
                  />
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

        {/* Section Header: Active Holdings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Holdings</Text>
          <Text style={styles.sectionCount}>{investments.length} Assets</Text>
        </View>

        {/* Dynamic Investments List */}
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
              onPress={() => navigation.navigate('Marketplace')}
            >
              <Text style={styles.exploreButtonText}>Explore RWA Assets</Text>
            </TouchableOpacity>
          </View>
        ) : (
          investments.map(item => (
            <TouchableOpacity
              key={item.id || item._id}
              style={styles.investmentCard}
              onPress={() => handleOpenHolding(item)}
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
                  {item.shares || 'Tokens'} •{' '}
                  {item.location || item.settlementMode}
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
      </ScrollView>

      {/* --- Real-World FinTech Holding Inspect Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { paddingBottom: Math.max(insets.bottom, 24) },
            ]}
          >
            <View style={styles.modalIndicatorBar} />
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalAssetTypeContainer}>
                <GlobeIcon size={14} color={PALETTE.accent} />
                <Text style={styles.modalAssetTypeText}>
                  {selectedHolding?.assetClass || 'Real-World Asset Token'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={handleCloseModal}
                activeOpacity={0.7}
              >
                <CloseIcon size={18} color={PALETTE.textMain} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollBody}
            >
              <Text style={styles.modalTitle}>
                {selectedHolding?.title || selectedHolding?.assetName}
              </Text>
              <Text style={styles.modalLocation}>
                {selectedHolding?.location || 'Verified Jurisdictional Vault'}
              </Text>

              {/* Position Value Banner */}
              <View style={styles.modalPositionBanner}>
                <View>
                  <Text style={styles.modalBannerLabel}>
                    Your Position Value
                  </Text>
                  <Text style={styles.modalBannerAmount}>
                    ${Number(selectedHolding?.amount || 0).toLocaleString()}
                  </Text>
                </View>
                <View style={styles.modalBannerRight}>
                  <Text style={styles.modalBannerLabel}>Settlement Mode</Text>
                  <Text style={styles.modalBannerTokens}>
                    {selectedHolding?.settlementMode}
                  </Text>
                </View>
              </View>

              {/* Metrics */}
              <View style={styles.metricsGrid}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardLabel}>Database Status</Text>
                  <Text
                    style={[
                      styles.metricCardValueGreen,
                      selectedHolding?.status === 'PENDING' && {
                        color: PALETTE.warning,
                      },
                    ]}
                  >
                    {selectedHolding?.status || 'CONFIRMED'}
                  </Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricCardLabel}>
                    Daily Yield Accrual
                  </Text>
                  <Text style={styles.metricCardValueWhite}>
                    {selectedHolding?.dailyYieldAccrual || '$1.97 / day'}
                  </Text>
                </View>
              </View>

              <Text style={styles.modalSectionHeading}>Asset Overview</Text>
              <Text style={styles.modalDescriptionText}>
                {selectedHolding?.description ||
                  'Institutional-grade asset token managed via secure smart contract escrow and audited regularly by independent third-party accounting firms.'}
              </Text>

              <Text style={styles.modalSectionHeading}>
                Blockchain & Transaction Metadata
              </Text>
              <View style={styles.metadataCard}>
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataKey}>
                    Transaction Hash / Intent ID
                  </Text>
                  <Text
                    style={[styles.metadataVal, { color: PALETTE.accent }]}
                    numberOfLines={1}
                  >
                    {selectedHolding?.txHash || selectedHolding?.id || 'N/A'}
                  </Text>
                </View>
                <View style={styles.metadataDivider} />
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataKey}>
                    Smart Contract Standard
                  </Text>
                  <Text style={styles.metadataVal}>
                    ERC-3643 Regulated Security
                  </Text>
                </View>
                <View style={styles.metadataDivider} />
                <View style={styles.metadataRow}>
                  <Text style={styles.metadataKey}>Auditor Verification</Text>
                  <Text style={styles.metadataVal}>
                    Deloitte / PwC Certified
                  </Text>
                </View>
              </View>

              <View style={styles.complianceBadgeRow}>
                <ShieldCheckIcon size={16} color={PALETTE.accent} />
                <Text style={styles.complianceText}>
                  KYC/AML Verified & Fully Compliant Position
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.secondaryActionButton}
                  activeOpacity={0.8}
                  onPress={handleDownloadDeed}
                  disabled={downloadingDeed}
                >
                  {downloadingDeed ? (
                    <ActivityIndicator size="small" color={PALETTE.textMain} />
                  ) : (
                    <Text style={styles.secondaryActionText}>
                      Download Deed
                    </Text>
                  )}
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.primaryActionButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    handleCloseModal();
                    navigation.navigate('AssetDetails', {
                      property: selectedHolding,
                    });
                  }}
                >
                  <Text style={styles.primaryActionText}>Manage Position</Text>
                </TouchableOpacity> */}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.accent,
    zIndex: 2,
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
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

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  modalContent: {
    backgroundColor: PALETTE.modalBg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '88%',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalIndicatorBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'center',
    marginBottom: 12,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalAssetTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.15)',
  },
  modalAssetTypeText: {
    color: PALETTE.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PALETTE.cardAlt,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  modalScrollBody: { paddingBottom: 24 },
  modalTitle: {
    color: PALETTE.textMain,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  modalLocation: {
    color: PALETTE.textMuted,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  modalPositionBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 16,
  },
  modalBannerLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalBannerAmount: {
    color: PALETTE.textMain,
    fontSize: 22,
    fontWeight: '800',
  },
  modalBannerRight: { alignItems: 'flex-end' },
  modalBannerTokens: { color: PALETTE.accent, fontSize: 14, fontWeight: '700' },
  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  metricCard: {
    flex: 1,
    backgroundColor: PALETTE.cardBg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  metricCardLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  metricCardValueGreen: {
    color: PALETTE.success,
    fontSize: 16,
    fontWeight: '800',
  },
  metricCardValueWhite: {
    color: PALETTE.textMain,
    fontSize: 16,
    fontWeight: '800',
  },
  modalSectionHeading: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 4,
  },
  modalDescriptionText: {
    color: PALETTE.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  metadataCard: {
    backgroundColor: PALETTE.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: PALETTE.border,
    marginBottom: 16,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  metadataKey: { color: PALETTE.textMuted, fontSize: 12, fontWeight: '500' },
  metadataVal: {
    color: PALETTE.textMain,
    fontSize: 12,
    fontWeight: '700',
    maxWidth: '55%',
  },
  metadataDivider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)' },
  complianceBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.06)',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  complianceText: {
    color: PALETTE.accent,
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    flex: 1,
    backgroundColor: PALETTE.cardAlt,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  secondaryActionText: {
    color: PALETTE.textMain,
    fontSize: 13,
    fontWeight: '700',
  },
  primaryActionButton: {
    flex: 1.3,
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    color: PALETTE.accentText,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

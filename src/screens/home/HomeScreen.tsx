// src/screens/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../../theme/colors';
import { walletApi, WalletData } from '../../services/api/walletApi';
import { investmentApi } from '../../services/api/investmentApi';
import { fetchApprovedAssets, AssetData } from '../../services/api/asset';
import { useAuth } from '../../navigation/AuthContext';

const { width } = Dimensions.get('window');

// --- Dedicated Inline SVG Vector Icons ---
const BellIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);

const MenuIcon = ({ size = 20, color = Colors.accent }) => (
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
    <Path d="M4 6h16M4 12h16M4 18h16" />
  </Svg>
);

const InvestIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </Svg>
);

const DepositIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M12 3v12m0 0l4-4m-4 4l-4-4M2 17l.621 2.485A2 2 0 004.56 21h14.88a2 2 0 001.939-1.515L22 17" />
  </Svg>
);

const WithdrawIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M12 15V3m0 0l-4 4m4-4l4 4M2 17l.621 2.485A2 2 0 004.56 21h14.88a2 2 0 001.939-1.515L22 17" />
  </Svg>
);

const MarketIcon = ({ size = 22, color = '#34D399' }) => (
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
    <Path d="M3 3v18h18" />
    <Path d="M18 17V9" />
    <Path d="M13 17V5" />
    <Path d="M8 17v-3" />
  </Svg>
);

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const [userName, setUserName] = useState<string>('Investor');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic state data
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [myInvestments, setMyInvestments] = useState<any[]>([]);
  const [featuredAsset, setFeaturedAsset] = useState<AssetData | null>(null);

  useEffect(() => {
    const resolveUserIdentity = async () => {
      if (user?.name || user?.fullName || user?.username) {
        setUserName(user.name || user.fullName || user.username);
        return;
      }

      try {
        const storedUser = await AsyncStorage.getItem('userData');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed?.name || parsed?.fullName || parsed?.username) {
            setUserName(parsed.name || parsed.fullName || parsed.username);
            return;
          }
        }
      } catch (e) {
        console.warn('Could not retrieve user profile name', e);
      }
    };

    resolveUserIdentity();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [walletRes, investmentsRes, assetsRes] = await Promise.all([
        walletApi.getWalletData().catch(() => null),
        investmentApi.getMyInvestments().catch(() => []),
        fetchApprovedAssets().catch(() => []),
      ]);

      if (walletRes) setWalletData(walletRes);
      if (investmentsRes) setMyInvestments(investmentsRes);

      if (assetsRes && assetsRes.length > 0) {
        setFeaturedAsset(assetsRes[0]);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboardData();
  }, []);

  const totalInvested = myInvestments.reduce(
    (sum, inv) => sum + (Number(inv.amount) || 0),
    0,
  );

  const availableBalance =
    walletData?.availableBalance ?? walletData?.balance ?? 0;

  // --- IDENTICAL FUNDING PERCENTAGE CALCULATION AS AssetDetails.tsx ---
  const unitPrice = Number((featuredAsset as any)?.unitPrice ?? 10);
  const tokenSupply = Number((featuredAsset as any)?.tokenSupply ?? 1000);

  const fundingTarget = Number(
    (featuredAsset as any)?.totalValue ||
      (featuredAsset as any)?.target ||
      (featuredAsset as any)?.funding?.target ||
      tokenSupply * unitPrice ||
      10000,
  );

  const fundingRaised = Number(
    (featuredAsset as any)?.funded ??
      (featuredAsset as any)?.funding?.raised ??
      (featuredAsset as any)?.raised ??
      0,
  );

  const rawPercentage =
    fundingTarget > 0 ? (fundingRaised / fundingTarget) * 100 : 0;
  const fundedPercentage = Math.min(
    Math.max(Math.round(rawPercentage), 0),
    100,
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('SideMenu')}
        >
          <View style={styles.avatarContainer}>
            <MenuIcon size={20} color={Colors.accent} />
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.welcomeSubtext}>Assalamu Alaikum</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationButton}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Notifications')}
        >
          <BellIcon size={18} color={Colors.accent} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.accent}
          />
        }
      >
        {/* Institutional Emerald Portfolio Card */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioGlow} />
          <View style={styles.portfolioCardHeader}>
            <Text style={styles.portfolioTitle}>Available Balance</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceHidden(!isBalanceHidden)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eyeIcon}>{isBalanceHidden ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {loading && !walletData ? (
            <ActivityIndicator
              size="small"
              color={Colors.accent}
              style={{ marginVertical: 14 }}
            />
          ) : (
            <Text style={styles.portfolioAmount}>
              {isBalanceHidden
                ? '••••••••'
                : `$${availableBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
            </Text>
          )}

          <View style={styles.growthBadgeRow}>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>📈 +12.4% All-Time</Text>
            </View>
            <Text style={styles.securityText}>🔒 Secured & Insured</Text>
          </View>

          <View style={styles.portfolioStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Invested</Text>
              <Text style={styles.statValue}>
                {isBalanceHidden
                  ? '••••'
                  : `$${totalInvested.toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Returns</Text>
              <Text style={styles.statValueSuccess}>
                {isBalanceHidden
                  ? '••••'
                  : `+$${(walletData?.totalEarned || 0).toLocaleString()}`}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>
                {isBalanceHidden
                  ? '••••'
                  : `$${availableBalance.toLocaleString()}`}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Action Grid */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Invest')}
          >
            <View style={styles.actionIconBox}>
              <InvestIcon size={22} color={Colors.accent} />
            </View>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.actionIconBox}>
              <DepositIcon size={22} color={Colors.accent} />
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.actionIconBox}>
              <WithdrawIcon size={22} color={Colors.accent} />
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Marketplace')}
          >
            <View style={styles.actionIconBox}>
              <MarketIcon size={22} color={Colors.accent} />
            </View>
            <Text style={styles.actionText}>Market</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Properties Header */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Featured RWA Assets</Text>
            <Text style={styles.sectionSubtitle}>
              Institutional-grade real estate
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Invest')}>
            <Text style={styles.viewAllText}>View All →</Text>
          </TouchableOpacity>
        </View>

        {/* Fintech-Grade Featured Property Card */}
        {loading && !featuredAsset ? (
          <View
            style={[styles.propertyCard, { padding: 40, alignItems: 'center' }]}
          >
            <ActivityIndicator size="small" color={Colors.accent} />
          </View>
        ) : featuredAsset ? (
          <TouchableOpacity
            style={styles.propertyCard}
            activeOpacity={0.92}
            onPress={() => {
              const imageUri =
                featuredAsset.galleryImages?.[0] ||
                'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop';

              const yieldVal = featuredAsset.expectedYield
                ? `${featuredAsset.expectedYield}% expected yield`
                : '8.5% expected yield';

              const minInv = featuredAsset.unitPrice
                ? `$${featuredAsset.unitPrice}`
                : `$100`;
              const assetType =
                featuredAsset.status || 'Commercial Real Estate';

              const propertyPayload = {
                id: featuredAsset.id,
                title: featuredAsset.title,
                location:
                  featuredAsset.location || 'Global Institutional District',
                type: assetType,
                yield: yieldVal,
                minInvestment: `Min. ${minInv}`,
                funded: `${fundedPercentage}% Funded`, // String for UI display
                imageUri,
                overview:
                  featuredAsset.overview ||
                  'Institutional-grade fully audited tokenized real-world asset backed by verified underlying physical cash flows.',
                tokenSupply: `${tokenSupply.toLocaleString()} Tokens`,
                unitPrice,
                totalValue: fundingTarget,
                fundedAmount: fundingRaised, // <-- Changed from 'funded' to 'fundedAmount'
                tokenAddress: featuredAsset.tokenAddress || '0x71C...39a2',
                treasuryAddress:
                  featuredAsset.treasuryAddress || '0x49B...12f8',
                galleryImages: featuredAsset.galleryImages || [imageUri],
              };

              navigation.navigate('AssetDetails', {
                property: propertyPayload,
              });
            }}
          >
            {/* Asset Image Header with Immersive Gradient & Live Overlays */}
            <ImageBackground
              source={{
                uri:
                  featuredAsset.galleryImages?.[0] ||
                  'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=800&auto=format&fit=crop',
              }}
              style={styles.propertyImageBackground}
              imageStyle={styles.propertyImageStyle}
            >
              <View style={styles.imageDarkGradientOverlay} />

              <View style={styles.topBadgeRow}>
                <View style={styles.fundedBadge}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.fundedText}>
                    {fundedPercentage}% Funded
                  </Text>
                </View>
                <Text style={styles.propertyTypeTag}>
                  {featuredAsset.status || 'Commercial'}
                </Text>
              </View>

              <View style={styles.valuationPill}>
                <Text style={styles.valuationPillText}>
                  Pool Cap: $
                  {fundingTarget
                    ? (fundingTarget / 1000).toFixed(0) + 'K'
                    : '1.2M'}
                </Text>
              </View>
            </ImageBackground>

            {/* Fintech Body Content Details */}
            <View style={styles.propertyInfo}>
              <View style={styles.propertyHeaderRow}>
                <Text style={styles.propertyName} numberOfLines={1}>
                  {featuredAsset.title}
                </Text>
                <Text style={styles.propertyTokenSymbol}>
                  [RWA-{featuredAsset.id.substring(0, 4).toUpperCase()}]
                </Text>
              </View>
              <Text style={styles.propertyLocation} numberOfLines={1}>
                📍 {featuredAsset.location || 'Global Financial Hub'}
              </Text>

              {/* Dynamically Computed Progress Tracker */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressLabelText}>
                    Subscription Progress
                  </Text>
                  <Text style={styles.progressPercentText}>
                    {fundedPercentage}%
                  </Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${fundedPercentage}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.propertyDivider} />

              <View style={styles.propertyYieldRow}>
                <View>
                  <Text style={styles.yieldLabel}>Projected Yield</Text>
                  <Text style={styles.yieldHighlight}>
                    {featuredAsset.expectedYield
                      ? `${featuredAsset.expectedYield}% expected yield`
                      : '8.5% expected yield'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.yieldLabel}>Entry Threshold</Text>
                  <Text style={styles.minInvestment}>Min. ${unitPrice}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <View
            style={[styles.propertyCard, { padding: 24, alignItems: 'center' }]}
          >
            <Text style={{ color: '#6EE7B7', fontSize: 13 }}>
              No active featured assets found.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03100B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.06)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginRight: 12,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#03100B',
  },
  welcomeSubtext: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  userName: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  portfolioCard: {
    backgroundColor: '#061A12',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  portfolioGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioTitle: {
    color: '#6EE7B7',
    opacity: 0.8,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  eyeIcon: {
    fontSize: 14,
  },
  portfolioAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 10,
    letterSpacing: 0.5,
  },
  growthBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  growthBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  growthText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  securityText: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    fontWeight: '500',
  },
  portfolioStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.1)',
    paddingTop: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'flex-start',
  },
  statLabel: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    marginBottom: 3,
    fontWeight: '500',
  },
  statValue: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
  },
  statValueSuccess: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginHorizontal: 8,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 22,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#061A12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  actionText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#F0FDF4',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  sectionSubtitle: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    marginTop: 2,
  },
  viewAllText: {
    color: Colors.accent,
    fontSize: 12,
    fontWeight: '700',
  },
  propertyCard: {
    backgroundColor: '#061A12',
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  propertyImageBackground: {
    height: 180,
    width: '100%',
    justifyContent: 'space-between',
    padding: 12,
  },
  propertyImageStyle: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },
  imageDarkGradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(3, 16, 11, 0.38)',
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  fundedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(3, 16, 11, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  fundedText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '800',
  },
  propertyTypeTag: {
    color: '#F0FDF4',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 11,
    fontWeight: '700',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  valuationPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(3, 16, 11, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    zIndex: 2,
  },
  valuationPillText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '700',
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  propertyName: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 8,
  },
  propertyTokenSymbol: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 11,
    fontWeight: '700',
  },
  propertyLocation: {
    color: '#A7F3D0',
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabelText: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  progressPercentText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#09291D',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#34D399',
    borderRadius: 3,
  },
  propertyDivider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    marginBottom: 12,
  },
  propertyYieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldLabel: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  yieldHighlight: {
    color: '#34D399',
    fontSize: 13,
    fontWeight: '800',
  },
  minInvestment: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '700',
  },
});

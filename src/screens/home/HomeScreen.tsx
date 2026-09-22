import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

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

// Custom Fintech SVG Icons for Action Grid
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

// Custom Market / Trading Chart Icon representing the secondary market
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
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

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
            <Text style={styles.userName}>Muhammad Faisal</Text>
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
      >
        {/* Institutional Emerald Portfolio Card */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioGlow} />
          <View style={styles.portfolioCardHeader}>
            <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
            <TouchableOpacity
              onPress={() => setIsBalanceHidden(!isBalanceHidden)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.eyeIcon}>
                {isBalanceHidden ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.portfolioAmount}>
            {isBalanceHidden ? '••••••••' : '$24,680.50'}
          </Text>

          <View style={styles.growthBadgeRow}>
            <View style={styles.growthBadge}>
              <Text style={styles.growthText}>📈 +12.4% All-Time</Text>
            </View>
            <Text style={styles.securityText}>🔒 Secured & Insured</Text>
          </View>

          <View style={styles.portfolioStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Invested</Text>
              <Text style={styles.statValue}>$18,200</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Returns</Text>
              <Text style={styles.statValueSuccess}>+$6,480</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Available</Text>
              <Text style={styles.statValue}>$2,500</Text>
            </View>
          </View>
        </View>

        {/* Quick Action Grid with SVG Fintech Icons */}
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

        {/* Featured Property Card */}
        <TouchableOpacity
          style={styles.propertyCard}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AssetDetails', { assetId: '1' })}
        >
          <View style={styles.propertyImagePlaceholder}>
            <View style={styles.assetBadge}>
              <Text style={styles.assetBadgeText}>🔥 High Demand</Text>
            </View>
            <Text style={styles.propertyImageTag}>Dubai Creek Residence</Text>
          </View>

          <View style={styles.propertyInfo}>
            <View style={styles.propertyHeaderRow}>
              <Text style={styles.propertyName}>Dubai Creek Luxury Tower</Text>
              <Text style={styles.propertyTokenSymbol}>[DXB-01]</Text>
            </View>
            <Text style={styles.propertyLocation}>📍 Downtown Dubai, UAE</Text>

            <View style={styles.propertyDivider} />

            <View style={styles.propertyYieldRow}>
              <View>
                <Text style={styles.yieldLabel}>Projected APY</Text>
                <Text style={styles.yieldHighlight}>8.5% Net Yield</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.yieldLabel}>Entry Threshold</Text>
                <Text style={styles.minInvestment}>Min. $500</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  propertyImagePlaceholder: {
    height: 150,
    backgroundColor: '#09291D',
    justifyContent: 'flex-end',
    padding: 14,
  },
  assetBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(3, 16, 11, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  assetBadgeText: {
    color: Colors.accent,
    fontSize: 10,
    fontWeight: '800',
  },
  propertyImageTag: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  propertyName: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
  },
  propertyTokenSymbol: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 11,
    fontWeight: '700',
  },
  propertyLocation: {
    color: '#A7F3D0',
    opacity: 0.8,
    fontSize: 12,
    marginBottom: 12,
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

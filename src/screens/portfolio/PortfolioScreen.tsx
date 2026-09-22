import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';

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
};

// --- Dedicated Inline SVG Vector Icons (Zero Font-Linking Dependencies) ---
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

const userInvestments = [
  {
    id: '1',
    title: 'Dubai Creek Harbour Residence',
    location: 'Dubai, UAE',
    amount: '$8,450.00',
    returnRate: '+8.5% pa',
    shares: '16.9 RWA Tokens',
  },
  {
    id: '2',
    title: 'Riyadh Business Tower',
    location: 'Riyadh, KSA',
    amount: '$6,320.00',
    returnRate: '+6.2% pa',
    shares: '12.6 RWA Tokens',
  },
];

export const PortfolioScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

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
      >
        {/* Total Portfolio Value Summary Card */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioCardTopRow}>
            <Text style={styles.portfolioTitle}>Net Asset Value</Text>
            <View style={styles.liveIndicator}>
              <View style={styles.livePulse} />
              <Text style={styles.liveText}>Live Sync</Text>
            </View>
          </View>

          <Text style={styles.portfolioAmount}>$24,680.50</Text>

          <View style={styles.growthBadgeContainer}>
            <View style={styles.growthBadge}>
              <TrendingUpIcon size={13} color={PALETTE.success} />
              <Text style={styles.growthText}>+12.4% All-Time Yield</Text>
            </View>
          </View>

          {/* Quick Actions Row inside Portfolio Card */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              style={styles.actionButtonPrimary}
              activeOpacity={0.8}
            >
              <PlusIcon size={15} color={PALETTE.accentText} />
              <Text style={styles.actionButtonPrimaryText}>
                Deposit Capital
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonSecondary}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonSecondaryText}>Statements</Text>
            </TouchableOpacity>
          </View>

          {/* Asset Allocation Breakdown Indicators */}
          <View style={styles.allocationContainer}>
            <Text style={styles.allocationHeaderTitle}>Asset Distribution</Text>

            {/* Visual Progress Bar */}
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
                <Text style={styles.allocationValue}>72% ($17,770)</Text>
              </View>

              <View style={styles.allocationRow}>
                <View style={styles.allocationLabelGroup}>
                  <View style={[styles.dot, { backgroundColor: '#38BDF8' }]} />
                  <Text style={styles.allocationLabel}>Stable Liquid Cash</Text>
                </View>
                <Text style={styles.allocationValue}>18% ($4,442)</Text>
              </View>

              <View style={styles.allocationRow}>
                <View style={styles.allocationLabelGroup}>
                  <View style={[styles.dot, { backgroundColor: '#A855F7' }]} />
                  <Text style={styles.allocationLabel}>Venture Tokens</Text>
                </View>
                <Text style={styles.allocationValue}>10% ($2,468)</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section Header: Your Investments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Holdings</Text>
          <Text style={styles.sectionCount}>2 Assets</Text>
        </View>

        {/* Investments List */}
        {userInvestments.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.investmentCard}
            onPress={() =>
              navigation.navigate('AssetDetails', {
                property: { title: item.title, location: item.location },
              })
            }
            activeOpacity={0.85}
          >
            <View style={styles.investmentThumbContainer}>
              <BuildingIcon size={20} color={PALETTE.accent} />
            </View>
            <View style={styles.investmentInfo}>
              <Text style={styles.investmentName} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.investmentSubtext}>
                {item.shares} • {item.location}
              </Text>
            </View>
            <View style={styles.investmentRightSection}>
              <Text style={styles.investmentAmount}>{item.amount}</Text>
              <View style={styles.returnBadge}>
                <Text style={styles.investmentReturnText}>
                  {item.returnRate}
                </Text>
              </View>
            </View>
            <View style={styles.chevronContainer}>
              <ArrowUpRightIcon size={14} color={PALETTE.textMuted} />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
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
  growthBadgeContainer: {
    marginBottom: 20,
  },
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
  growthText: {
    color: PALETTE.success,
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
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
  progressSegment: {
    height: '100%',
  },
  allocationRowsGroup: {
    gap: 8,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  allocationLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  allocationLabel: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  allocationValue: {
    color: PALETTE.textMain,
    fontSize: 12,
    fontWeight: '700',
  },
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
  sectionCount: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
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
  investmentInfo: {
    flex: 1,
  },
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
  investmentRightSection: {
    alignItems: 'flex-end',
  },
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
  investmentReturnText: {
    color: PALETTE.success,
    fontSize: 11,
    fontWeight: '700',
  },
  chevronContainer: {
    marginLeft: 4,
    justifyContent: 'center',
  },
});

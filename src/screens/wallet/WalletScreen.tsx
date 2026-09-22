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
import Svg, { Path } from 'react-native-svg';

// --- Institutional Grade Color Palette ---
const PALETTE = {
  bg: '#080C0A', // Deep Obsidian
  cardBg: '#111816', // Slightly lighter dark gray
  cardAlt: '#151D1B',
  textMain: '#F9FAFB', // Almost white
  textMuted: '#9CA3AF', // Gray 400
  accent: '#34D399', // Emerald Green
  accentText: '#053121', // Dark text for high-contrast on emerald buttons
  border: 'rgba(52, 211, 153, 0.15)', // Subtle emerald border
  success: '#34D399',
  danger: '#EF4444',
};

// --- Dedicated Inline SVG Vector Icons (Zero Font-Linking Dependencies) ---
const ArrowDownLeftIcon = ({ size = 18, color = PALETTE.success }) => (
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
    <Path d="M17 7L7 17M7 7h10v10" />
  </Svg>
);

const ArrowUpRightIcon = ({ size = 18, color = PALETTE.textMain }) => (
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
    <Path d="M7 17L17 7M7 7h10v10" />
  </Svg>
);

const RefreshCwIcon = ({ size = 16, color = PALETTE.accent }) => (
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
    <Path d="M23 4v6h-6M1 20v-6h6" />
    <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
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

const ArrowUpIcon = ({ size = 16, color = PALETTE.textMain }) => (
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
    <Path d="M12 19V5M5 12l7-7 7 7" />
  </Svg>
);

const recentTransactions = [
  {
    id: '1',
    type: 'Capital Deposit',
    category: 'Bank Wire Transfer',
    date: 'Apr 24, 2026',
    amount: '+$1,000.00',
    isPositive: true,
  },
  {
    id: '2',
    type: 'Asset Allocation',
    category: 'Dubai Creek Harbour',
    date: 'Apr 22, 2026',
    amount: '-$500.00',
    isPositive: false,
  },
  {
    id: '3',
    type: 'Yield Distribution',
    category: 'Monthly Dividend',
    date: 'Apr 20, 2026',
    amount: '+$85.00',
    isPositive: true,
  },
];

export const WalletScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: PALETTE.bg }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View>
          <Text style={styles.headerSubtitle}>Liquidity & Funds</Text>
          <Text style={styles.headerTitle}>Digital Wallet</Text>
        </View>
        <TouchableOpacity style={styles.headerIconButton} activeOpacity={0.7}>
          <RefreshCwIcon size={16} color={PALETTE.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wallet Balance Summary Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceTitle}>Available Liquid Balance</Text>
          <Text style={styles.balanceAmount}>$24,680.50</Text>

          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={styles.walletActionButton}
              activeOpacity={0.8}
            >
              <PlusIcon size={16} color={PALETTE.accentText} />
              <Text style={styles.walletActionText}>Deposit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.walletActionButtonOutline}
              activeOpacity={0.8}
            >
              <ArrowUpIcon size={16} color={PALETTE.textMain} />
              <Text style={styles.walletActionTextOutline}>Withdraw</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lockedRow}>
            <View style={styles.lockedColumn}>
              <Text style={styles.lockedLabel}>Locked in RWA</Text>
              <Text style={styles.lockedValue}>$1,200.00</Text>
            </View>
            <View style={styles.verticalDivider} />
            <View style={styles.lockedColumn}>
              <Text style={styles.lockedLabel}>Pending Settlement</Text>
              <Text style={styles.lockedValue}>$500.00</Text>
            </View>
          </View>
        </View>

        {/* Section Header: Recent Transactions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          <Text style={styles.sectionActionText}>View All</Text>
        </View>

        {/* Transactions List */}
        {recentTransactions.map(item => (
          <View key={item.id} style={styles.transactionCard}>
            <View
              style={[
                styles.transactionThumbContainer,
                {
                  backgroundColor: item.isPositive
                    ? 'rgba(52, 211, 153, 0.08)'
                    : 'rgba(239, 68, 68, 0.08)',
                  borderColor: item.isPositive
                    ? 'rgba(52, 211, 153, 0.2)'
                    : 'rgba(239, 68, 68, 0.2)',
                },
              ]}
            >
              {item.isPositive ? (
                <ArrowDownLeftIcon size={18} color={PALETTE.success} />
              ) : (
                <ArrowUpRightIcon size={18} color={PALETTE.textMain} />
              )}
            </View>
            <View style={styles.transactionInfo}>
              <Text style={styles.transactionName}>{item.type}</Text>
              <Text style={styles.transactionCategory}>
                {item.category} • {item.date}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                { color: item.isPositive ? PALETTE.success : PALETTE.textMain },
              ]}
            >
              {item.amount}
            </Text>
          </View>
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
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  balanceCard: {
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
  balanceTitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    color: PALETTE.textMain,
    fontSize: 34,
    fontWeight: '800',
    marginVertical: 6,
    letterSpacing: -0.5,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 18,
  },
  walletActionButton: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  walletActionText: {
    color: PALETTE.accentText,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  walletActionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: PALETTE.cardAlt,
    borderWidth: 1,
    borderColor: PALETTE.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  walletActionTextOutline: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '600',
  },
  lockedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 16,
    marginTop: 4,
  },
  lockedColumn: {
    flex: 1,
    alignItems: 'center',
  },
  lockedLabel: {
    color: PALETTE.textMuted,
    fontSize: 11,
    marginBottom: 4,
    fontWeight: '500',
  },
  lockedValue: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignSelf: 'center',
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
  sectionActionText: {
    color: PALETTE.accent,
    fontSize: 12,
    fontWeight: '600',
  },
  transactionCard: {
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
  transactionThumbContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionName: {
    color: PALETTE.textMain,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  transactionCategory: {
    color: PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});

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
import { Colors } from '../../theme/colors';

export const HomeScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Section with Working Hamburger/Profile Trigger */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigation.navigate('SideMenu')}
        >
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.hamburgerIcon}>☰</Text>
          </View>
          <View>
            <Text style={styles.welcomeSubtext}>Assalamu Alaikum,</Text>
            <Text style={styles.userName}>Muhammad Faisal</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Total Portfolio Value Card */}
        <View style={styles.portfolioCard}>
          <View style={styles.portfolioCardHeader}>
            <Text style={styles.portfolioTitle}>Total Portfolio Value</Text>
            <TouchableOpacity>
              <Text style={styles.eyeIcon}>👁️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.portfolioAmount}>$ 24,680.50</Text>
          <View style={styles.growthBadge}>
            <Text style={styles.growthText}>📈 +12.4% (all time)</Text>
          </View>

          <View style={styles.portfolioStatsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Invested</Text>
              <Text style={styles.statValue}>$18,200</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Returns</Text>
              <Text style={styles.statValue}>$6,480</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Available Balance</Text>
              <Text style={styles.statValue}>$2,500</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Invest')}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>🏛️</Text>
            </View>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>💳</Text>
            </View>
            <Text style={styles.actionText}>Deposit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Wallet')}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>💸</Text>
            </View>
            <Text style={styles.actionText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Marketplace')}
          >
            <View style={styles.actionIconBox}>
              <Text style={styles.actionIcon}>⚡</Text>
            </View>
            <Text style={styles.actionText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Properties Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Properties</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Invest')}>
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.propertyCard}
          onPress={() => navigation.navigate('AssetDetails', { assetId: '1' })}
        >
          <View style={styles.propertyImagePlaceholder}>
            <Text style={styles.propertyImageTag}>Real Estate Token</Text>
          </View>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyName}>Dubai Creek Residence</Text>
            <Text style={styles.propertyLocation}>📍 Dubai, UAE</Text>
            <View style={styles.propertyYieldRow}>
              <Text style={styles.yieldHighlight}>8.5% expected yield</Text>
              <Text style={styles.minInvestment}>Min. $500</Text>
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
    backgroundColor: Colors.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
    marginRight: 12,
  },
  hamburgerIcon: {
    color: Colors.accent,
    fontSize: 18,
    fontWeight: '700',
  },
  welcomeSubtext: {
    color: '#94A3B8',
    fontSize: 12,
  },
  userName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  notificationButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationIcon: {
    fontSize: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  portfolioCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  portfolioCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioTitle: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '500',
  },
  eyeIcon: {
    fontSize: 14,
  },
  portfolioAmount: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
    marginVertical: 8,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
  },
  growthText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '600',
  },
  portfolioStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 14,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIconBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  actionIcon: {
    fontSize: 22,
  },
  actionText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  viewAllText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  propertyCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  propertyImagePlaceholder: {
    height: 140,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyImageTag: {
    color: Colors.accent,
    fontWeight: '600',
    fontSize: 13,
  },
  propertyInfo: {
    padding: 14,
  },
  propertyName: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  propertyLocation: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 10,
  },
  propertyYieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  yieldHighlight: {
    color: '#22C55E',
    fontSize: 12,
    fontWeight: '600',
  },
  minInvestment: {
    color: '#94A3B8',
    fontSize: 12,
  },
});

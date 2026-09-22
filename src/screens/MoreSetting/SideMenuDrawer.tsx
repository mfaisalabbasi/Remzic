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
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { Colors } from '../../theme/colors';

// --- Dedicated Inline SVG Vector Icons for Menu ---
const HomeIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <Path d="M9 22V12h6v10" />
  </Svg>
);

const TrendingUpIcon = ({ size = 18, color = Colors.accent }) => (
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

const BarChartIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M12 20V10M18 20V4M6 20v-4" />
  </Svg>
);

const BriefcaseIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <Path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
  </Svg>
);

const GlobeIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </Svg>
);

const DollarSignIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </Svg>
);

const ShieldAlertIcon = ({ size = 18, color = '#FCA5A5' }) => (
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
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M12 8v4M12 16h.01" />
  </Svg>
);

const BellIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 01-3.46 0" />
  </Svg>
);

const UserIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const SettingsIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <Path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </Svg>
);

const MessageSquareIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </Svg>
);

const CloseIcon = ({ size = 16, color = Colors.white }) => (
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
    <Path d="M18 6L6 18M6 6l12 12" />
  </Svg>
);

// Helper mapping to return clean SVG components instead of basic emojis
const renderMenuIcon = (label: string) => {
  switch (label) {
    case 'Home':
      return <HomeIcon />;
    case 'Invest':
      return <TrendingUpIcon />;
    case 'Portfolio':
      return <BarChartIcon />;
    case 'Wallet':
      return <BriefcaseIcon />;
    case 'Marketplace':
      return <GlobeIcon />;
    case 'Distributions':
      return <DollarSignIcon />;
    case 'Wallet Recovery':
      return <ShieldAlertIcon />;
    case 'Notifications':
      return <BellIcon />;
    case 'Profile':
      return <UserIcon />;
    case 'Settings':
      return <SettingsIcon />;
    case 'Help & Support':
      return <MessageSquareIcon />;
    default:
      return <HomeIcon />;
  }
};

const menuItems = [
  { label: 'Home', screen: 'Home', isTab: true },
  { label: 'Invest', screen: 'Invest', isTab: true },
  { label: 'Portfolio', screen: 'Portfolio', isTab: true },
  { label: 'Wallet', screen: 'Wallet', isTab: true },
  { label: 'Marketplace', screen: 'Marketplace', isTab: true },
  { label: 'Distributions', screen: 'Distributions', isTab: false },
  { label: 'Wallet Recovery', screen: 'WalletRecovery', isTab: false },
  { label: 'Notifications', screen: 'Notifications', isTab: false, badge: '1' },
  { label: 'Profile', screen: 'Profile', isTab: false },
  { label: 'Settings', screen: 'Profile', isTab: false }, // Falls back safely to Profile
  { label: 'Help & Support', screen: 'Profile', isTab: false }, // Falls back safely to Profile
];

export const SideMenuDrawer = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  const handleNavigation = (item: (typeof menuItems)[0]) => {
    // 1. Dismiss the transparent modal drawer
    navigation.goBack();

    // 2. Safely trigger target navigation after modal frame cleanup
    setTimeout(() => {
      if (item.isTab) {
        navigation.navigate('MainTabs', { screen: item.screen });
      } else {
        navigation.navigate(item.screen);
      }
    }, 50);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Top Drawer Header with Close Button */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.75}
        >
          <CloseIcon size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* User Profile Summary Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitials}>MF</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Muhammad Faisal</Text>
          <Text style={styles.userEmail}>faisal@remzik.com</Text>
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>Verified Investor • Tier 2</Text>
          </View>
        </View>
      </View>

      {/* Navigation Links Scrollable Area */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuRow,
              item.label === 'Wallet Recovery' && styles.recoveryHighlightRow,
            ]}
            onPress={() => handleNavigation(item)}
            activeOpacity={0.7}
          >
            <View style={styles.menuLeftGroup}>
              <View style={styles.iconContainer}>
                {renderMenuIcon(item.label)}
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  item.label === 'Wallet Recovery' &&
                    styles.recoveryHighlightLabel,
                ]}
              >
                {item.label}
              </Text>
            </View>
            {item.badge && (
              <View style={styles.badgeBox}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Footer Brand Info */}
      <View style={styles.drawerFooter}>
        <View style={styles.footerBrandRow}>
          <View style={styles.footerLogoBadge}>
            <Text style={styles.footerLogoText}>R</Text>
          </View>
          <View>
            <Text style={styles.footerBrandName}>REMZIK PROTOCOL</Text>
            <Text style={styles.footerBrandTagline}>
              Real Assets. Real Ownership.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020B07',
  },
  drawerHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#061A12',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051610',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#09291D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  avatarInitials: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#F0FDF4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    color: '#6EE7B7',
    opacity: 0.75,
    fontSize: 11,
    marginBottom: 6,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  verifiedText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 4,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  recoveryHighlightRow: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  menuLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  menuLabel: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  recoveryHighlightLabel: {
    color: '#FCA5A5',
  },
  badgeBox: {
    backgroundColor: '#EF4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  drawerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#051610',
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  footerLogoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#09291D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  footerLogoText: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '900',
  },
  footerBrandName: {
    color: '#F0FDF4',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  footerBrandTagline: {
    color: '#6EE7B7',
    opacity: 0.7,
    fontSize: 10,
    marginTop: 1,
  },
});

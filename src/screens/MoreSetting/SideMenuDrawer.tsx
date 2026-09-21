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

const menuItems = [
  { icon: '🏠', label: 'Home', screen: 'Home', isTab: true },
  { icon: '📈', label: 'Invest', screen: 'Invest', isTab: true },
  { icon: '📊', label: 'Portfolio', screen: 'Portfolio', isTab: true },
  { icon: '💼', label: 'Wallet', screen: 'Wallet', isTab: true },
  { icon: '🌐', label: 'Marketplace', screen: 'Marketplace', isTab: true },
  { icon: '💰', label: 'Distributions', screen: 'Distributions', isTab: false },
  {
    icon: '🔔',
    label: 'Notifications',
    screen: 'Notifications',
    isTab: false,
    badge: '1',
  },
  { icon: '👤', label: 'Profile', screen: 'Profile', isTab: false },
  { icon: '⚙️', label: 'Settings', screen: 'Profile', isTab: false },
  { icon: '💬', label: 'Help & Support', screen: 'Profile', isTab: false },
];

export const SideMenuDrawer = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  const handleNavigation = (item: (typeof menuItems)[0]) => {
    // Close the drawer first if it's implemented as a drawer/modal stack
    navigation.goBack();

    // If it's a bottom tab screen, navigate into the MainTabs navigator container
    if (item.isTab) {
      navigation.navigate('MainTabs', { screen: item.screen });
    } else {
      // Otherwise navigate directly to the stack screen
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Top Drawer Header with Close Button */}
      <View style={styles.drawerHeader}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
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
            <Text style={styles.verifiedText}>Verified Investor</Text>
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
            style={styles.menuRow}
            onPress={() => handleNavigation(item)}
          >
            <View style={styles.menuLeftGroup}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
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
            <Text style={styles.footerBrandName}>REMZIK</Text>
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
    backgroundColor: Colors.primary,
  },
  drawerHeader: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 11,
    marginBottom: 6,
  },
  verifiedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    color: '#22C55E',
    fontSize: 9,
    fontWeight: '700',
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
  menuLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuIcon: {
    fontSize: 18,
  },
  menuLabel: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  badgeBox: {
    backgroundColor: '#EF4444',
    width: 18,
    height: 18,
    borderRadius: 9,
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
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerLogoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLogoText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  footerBrandName: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footerBrandTagline: {
    color: '#64748B',
    fontSize: 10,
  },
});

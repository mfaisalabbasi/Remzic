import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';

export const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile & Settings</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarInitials}>FM</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Muhammad Faisal</Text>
            <Text style={styles.profileEmail}>faisal@remzik.com</Text>
            <View style={styles.kycBadge}>
              <Text style={styles.kycText}>🛡️ KYC Verified (Tier 2)</Text>
            </View>
          </View>
        </View>

        {/* Section: Security */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security & Access</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>🔐</Text>
              <Text style={styles.settingText}>Biometric Login (Face ID)</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#334155', true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRowTouchable}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>🔑</Text>
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Preferences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>🔔</Text>
              <Text style={styles.settingText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#334155', true: Colors.accent }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRowTouchable}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>🌐</Text>
              <Text style={styles.settingText}>Currency & Language</Text>
            </View>
            <Text style={styles.settingValue}>USD ($)</Text>
          </TouchableOpacity>
        </View>

        {/* Section: Support & Legal */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
        </View>

        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingRowTouchable}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>💬</Text>
              <Text style={styles.settingText}>Help & Support Chat</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.settingRowTouchable}>
            <View style={styles.settingLabelGroup}>
              <Text style={styles.settingIcon}>📄</Text>
              <Text style={styles.settingText}>
                Terms of Service & Privacy Policy
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    gap: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 8,
  },
  kycBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  kycText: {
    color: '#22C55E',
    fontSize: 10,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  settingsGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingRowTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    fontSize: 16,
  },
  settingText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '500',
  },
  settingValue: {
    color: '#94A3B8',
    fontSize: 13,
  },
  chevron: {
    color: '#64748B',
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 42,
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: 10,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
});

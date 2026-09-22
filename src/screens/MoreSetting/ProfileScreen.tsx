import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  StatusBar,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '../../theme/colors';

// --- Dedicated Inline SVG Vector Icons ---
const ArrowLeftIcon = ({ size = 18, color = Colors.white }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

const ChevronRightIcon = ({ size = 16, color = '#6EE7B7' }) => (
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

const ShieldCheckIcon = ({ size = 14, color = '#34D399' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <Path d="M9 12l2 2 4-4" />
  </Svg>
);

const FingerprintIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M12 10a2 2 0 00-2 2c0 1.02-.1 2.51-.26 4" />
    <Path d="M14.53 15.5c-.36-1.51-.53-3.21-.53-4.5a3 3 0 00-6 0c0 1.15.11 2.3.32 3.4" />
    <Path d="M17 12a5 5 0 00-10 0c0 1.5.3 3 1 4.5" />
    <Path d="M19.5 10.5C20 12 20 13.5 20 15" />
    <Path d="M4.5 14.5C4 13 4 11.5 4 10a8 8 0 0115.5-2.5" />
  </Svg>
);

const KeyIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.778-7.778zm0 0L15.5 7.5m0 3l3 3L22 7l-3-3" />
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

const FileTextIcon = ({ size = 18, color = Colors.accent }) => (
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
    <Path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <Path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </Svg>
);

const LogOutIcon = ({ size = 18, color = '#EF4444' }) => (
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
    <Path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </Svg>
);

export const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState('USD ($)');

  const handleCurrencyChange = () => {
    Alert.alert('Base Denomination', 'Select your primary protocol currency:', [
      { text: 'USD ($)', onPress: () => setSelectedCurrency('USD ($)') },
      { text: 'EUR (€)', onPress: () => setSelectedCurrency('EUR (€)') },
      { text: 'SAR (﷼)', onPress: () => setSelectedCurrency('SAR (﷼)') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleLogout = () => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to end your secure connection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" />

      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.75}
        >
          <ArrowLeftIcon size={18} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account & Protocol Security</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Elite Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitials}>MF</Text>
            </View>
            <View style={styles.onlineIndicator} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Muhammad Faisal</Text>
            <Text style={styles.profileEmail}>faisal@remzik.com</Text>
            <View style={styles.kycBadge}>
              <ShieldCheckIcon size={13} color="#34D399" />
              <Text style={styles.kycText}>KYC Verified • Tier 2</Text>
            </View>
          </View>
        </View>

        {/* Section: Security */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Security & Access Controls</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <FingerprintIcon size={18} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.settingText}>Biometric Login</Text>
                <Text style={styles.settingSubtext}>
                  Require FaceID / TouchID on launch
                </Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: '#081D14', true: Colors.accent }}
              thumbColor={Colors.white}
              ios_backgroundColor="#081D14"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRowTouchable}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Master Password',
                'Password update prompt triggered.',
              )
            }
          >
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <KeyIcon size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.settingText}>Change Master Password</Text>
                <Text style={styles.settingSubtext}>Updated 90 days ago</Text>
              </View>
            </View>
            <ChevronRightIcon size={16} color="#6EE7B7" />
          </TouchableOpacity>
        </View>

        {/* Section: Preferences */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Preferences</Text>
        </View>

        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <BellIcon size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.settingText}>Push Notifications</Text>
                <Text style={styles.settingSubtext}>
                  Real-time transaction alerts
                </Text>
              </View>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#081D14', true: Colors.accent }}
              thumbColor={Colors.white}
              ios_backgroundColor="#081D14"
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRowTouchable}
            activeOpacity={0.7}
            onPress={handleCurrencyChange}
          >
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <GlobeIcon size={16} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.settingText}>Denomination Currency</Text>
                <Text style={styles.settingSubtext}>
                  Global asset valuation standard
                </Text>
              </View>
            </View>
            <View style={styles.settingValueContainer}>
              <Text style={styles.settingValueBadge}>{selectedCurrency}</Text>
              <ChevronRightIcon size={16} color="#6EE7B7" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section: Support & Compliance */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Support & Compliance</Text>
        </View>

        <View style={styles.settingsGroup}>
          <TouchableOpacity
            style={styles.settingRowTouchable}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Support', 'Opening direct VIP concierge channel...')
            }
          >
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <MessageSquareIcon size={16} color={Colors.accent} />
              </View>
              <Text style={styles.settingText}>Concierge Support Chat</Text>
            </View>
            <ChevronRightIcon size={16} color="#6EE7B7" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRowTouchable}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Legal', 'Viewing terms of service framework.')
            }
          >
            <View style={styles.settingLabelGroup}>
              <View style={styles.iconBox}>
                <FileTextIcon size={16} color={Colors.accent} />
              </View>
              <Text style={styles.settingText}>Terms of Service & Privacy</Text>
            </View>
            <ChevronRightIcon size={16} color="#6EE7B7" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <LogOutIcon size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Terminate Secure Session</Text>
        </TouchableOpacity>

        {/* Footer Info */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerProtocol}>
            REMZIK PROTOCOL • SECURE CLIENT
          </Text>
          <Text style={styles.footerVersion}>
            Build v2.4.0 • End-to-End Encrypted
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020B07',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#061A12',
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
  },
  headerPlaceholder: {
    width: 40,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 48,
    paddingTop: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#051610',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#09291D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.5)',
  },
  avatarInitials: {
    color: '#F0FDF4',
    fontSize: 20,
    fontWeight: '800',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34D399',
    borderWidth: 2,
    borderColor: '#051610',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#F0FDF4',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  profileEmail: {
    color: '#6EE7B7',
    opacity: 0.75,
    fontSize: 12,
    marginBottom: 8,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    gap: 6,
  },
  kycText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  sectionHeader: {
    marginBottom: 10,
    marginTop: 8,
  },
  sectionTitle: {
    color: '#6EE7B7',
    opacity: 0.8,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingsGroup: {
    backgroundColor: '#051610',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
    marginBottom: 18,
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
    flex: 1,
    paddingRight: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#082017',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  settingText: {
    color: '#F0FDF4',
    fontSize: 13,
    fontWeight: '600',
  },
  settingSubtext: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValueBadge: {
    color: '#34D399',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.20)',
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    marginLeft: 62,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    marginTop: 12,
    gap: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 32,
    gap: 4,
  },
  footerProtocol: {
    color: '#6EE7B7',
    opacity: 0.6,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  footerVersion: {
    color: '#94A3B8',
    opacity: 0.5,
    fontSize: 10,
  },
});

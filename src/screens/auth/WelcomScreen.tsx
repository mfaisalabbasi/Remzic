import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, 24) },
      ]}
    >
      <StatusBar barStyle="light-content" />

      {/* Ambient Background Glow Layer */}
      <View style={styles.ambientGlowContainer} pointerEvents="none">
        <View style={styles.glowOrbPrimary} />
        <View style={styles.glowOrbSecondary} />
      </View>

      {/* Top Brand Section */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBox}>
          <View style={styles.logoInnerGlow} />
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.brandTitle}>REMZIK</Text>
        <Text style={styles.brandSubtitle}>
          Institutional-Grade RWA Protocol
        </Text>
      </View>

      {/* Hero Glassmorphic Card Preview */}
      <View style={styles.heroCard}>
        <View style={styles.heroCardHeaderRow}>
          <View style={styles.liveIndicatorBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveIndicatorText}>Secured & Regulated</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>🛡️</Text>
          </View>
        </View>

        <Text style={styles.heroHeading}>Real Estate & Real-World Assets</Text>
        <Text style={styles.heroDesc}>
          Direct fractional ownership in high-yield global assets, fully
          tokenized on-chain via ERC-3643 with Shariah compliance.
        </Text>

        <View style={styles.metricsRow}>
          <View>
            <Text style={styles.metricLabel}>Avg. Target Yield</Text>
            <Text style={styles.metricValue}>8.4% - 11.2%</Text>
          </View>
          <View style={styles.metricDividerVertical} />
          <View style={styles.metricAlignRight}>
            <Text style={styles.metricLabel}>Asset Standard</Text>
            <Text style={styles.metricValue}>ERC-3643 RWA</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons Hub */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('OnboardingCarousel')}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <View style={styles.arrowIconCircle}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.75}
        >
          <Text style={styles.secondaryButtonText}>Log In to Account</Text>
        </TouchableOpacity>

        <Text style={styles.footerSecurityNote}>
          Secured with institutional MPC cryptographic custody
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C0A',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  ambientGlowContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  glowOrbPrimary: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  glowOrbSecondary: {
    position: 'absolute',
    bottom: 40,
    left: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  logoText: {
    color: '#34D399',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTitle: {
    color: '#F0FDF4',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3.5,
    marginBottom: 6,
  },
  brandSubtitle: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  heroCard: {
    backgroundColor: '#111816',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.22)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  heroCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  liveIndicatorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 211, 153, 0.1)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  liveIndicatorText: {
    color: '#34D399',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  badgeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
  },
  heroHeading: {
    color: '#F0FDF4',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  heroDesc: {
    color: '#94A3B8',
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: 20,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#080C0A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.12)',
  },
  metricLabel: {
    color: '#64748B',
    fontSize: 10.5,
    fontWeight: '600',
    marginBottom: 2,
  },
  metricValue: {
    color: '#F0FDF4',
    fontSize: 13.5,
    fontWeight: '700',
  },
  metricDividerVertical: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  metricAlignRight: {
    alignItems: 'flex-end',
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#34D399',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#34D399',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#080C0A',
    fontSize: 15.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  arrowIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(8, 12, 10, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#080C0A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  secondaryButtonText: {
    color: '#F0FDF4',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footerSecurityNote: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 0.2,
  },
});

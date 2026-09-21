import React from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { Colors } from '../../theme/colors';

export const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Brand Section */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>R</Text>
        </View>
        <Text style={styles.title}>REMZIK</Text>
        <Text style={styles.subtitle}>Real Assets. Real Ownership.</Text>
        <Text style={styles.subtext}>A Better Tomorrow.</Text>
      </View>

      {/* Hero Visual Preview Box */}
      <View style={styles.heroCard}>
        <Text style={styles.heroHeading}>Invest in Real Estate</Text>
        <Text style={styles.heroDesc}>
          Own a share in premium real estate assets with Shariah-compliant
          investment solutions.
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <Text
          style={styles.primaryButton}
          onPress={() => navigation.navigate('OnboardingCarousel')}
        >
          Get Started
        </Text>

        <Text
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          Log In
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: 16,
  },
  logoText: {
    color: Colors.accent,
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 8,
  },
  subtitle: {
    color: Colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
  subtext: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  heroHeading: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  heroDesc: {
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 20,
  },
  actionContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    color: Colors.primary,
    textAlign: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    fontWeight: '700',
    fontSize: 16,
    overflow: 'hidden',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: Colors.white,
    textAlign: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    fontWeight: '600',
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
});

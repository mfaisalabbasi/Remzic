import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AuthHeader = ({
  step,
  isSignUp,
}: {
  step: number;
  isSignUp: boolean;
}) => (
  <View style={styles.headerContainer}>
    <View style={styles.logoBox}>
      <View style={styles.logoInnerGlow} />
      <Text style={styles.logoText}>R</Text>
    </View>

    <Text style={styles.title}>
      {step === 0 && (isSignUp ? 'Create Account' : 'Welcome Back')}
      {step === 1 && 'Personal Information'}
      {step === 2 && 'KYC Verification'}
    </Text>

    <Text style={styles.subtitle}>
      {step === 0 &&
        (isSignUp
          ? 'Secure institutional access to Remzik'
          : 'Sign in to your secure investor dashboard')}
      {step === 1 && 'Step 1 of 2: Enter your verified credentials'}
      {step === 2 && 'Step 2 of 2: Regulatory identity verification'}
    </Text>

    {step > 0 && (
      <View style={styles.progressTrack}>
        <View style={[styles.progressBar, { width: `${(step / 2) * 100}%` }]} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  headerContainer: { alignItems: 'center', marginTop: 6, marginBottom: 12 },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    marginBottom: 10,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoInnerGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(52, 211, 153, 0.08)',
  },
  logoText: { color: '#34D399', fontSize: 22, fontWeight: '800' },
  title: {
    color: '#F0FDF4',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    marginTop: 14,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#34D399' },
});

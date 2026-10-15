// src/components/investment/InvestmentStatusView.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

const PALETTE = {
  bg: '#080C0A',
  textMain: '#FFFFFF',
  textMuted: '#94A3B8',
  accent: '#34D399',
};

interface InvestmentStatusViewProps {
  flowState: 'PROCESSING' | 'CONFIRMED' | 'FAILED';
  statusMessage: string;
  numericAmount: number;
  propertyTitle: string;
  insetsTop: number;
  onNavigateHome: () => void;
  onRetry: () => void;
}

export const InvestmentStatusView = ({
  flowState,
  statusMessage,
  numericAmount,
  propertyTitle,
  insetsTop,
  onNavigateHome,
  onRetry,
}: InvestmentStatusViewProps) => {
  if (flowState === 'PROCESSING') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insetsTop },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <ActivityIndicator
          size="large"
          color={PALETTE.accent}
          style={styles.stateLoader}
        />
        <Text style={styles.stateTitle}>Processing Allocation</Text>
        <Text style={styles.stateSubtitle}>
          {statusMessage ||
            'Please wait while Remzik verifies your investment.'}
        </Text>
      </View>
    );
  }

  if (flowState === 'CONFIRMED') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insetsTop },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <Text style={styles.successIcon}>🎉</Text>
        <Text style={styles.stateTitle}>Allocation Secured</Text>
        <Text style={styles.stateSubtitle}>
          You have successfully allocated ${numericAmount.toLocaleString()} into{' '}
          {propertyTitle}.
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={onNavigateHome}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>View Portfolio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (flowState === 'FAILED') {
    return (
      <View
        style={[
          styles.container,
          styles.centeredContainer,
          { paddingTop: insetsTop },
        ]}
      >
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.stateTitle}>Allocation Requires Attention</Text>
        <Text style={styles.stateSubtitle}>
          {statusMessage || 'The investment could not be completed.'}
        </Text>
        <TouchableOpacity
          style={[styles.continueButton, styles.retryButton]}
          onPress={onRetry}
          activeOpacity={0.85}
        >
          <Text style={styles.continueButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bg },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  stateLoader: { marginBottom: 20 },
  stateTitle: {
    color: PALETTE.textMain,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 12,
    textAlign: 'center',
  },
  stateSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  successIcon: { fontSize: 48 },
  errorIcon: { fontSize: 48 },
  continueButton: {
    backgroundColor: PALETTE.accent,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: { color: PALETTE.bg, fontSize: 15, fontWeight: '700' },
  retryButton: { backgroundColor: PALETTE.accent, width: '100%' },
});

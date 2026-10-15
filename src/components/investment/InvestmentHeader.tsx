// src/components/investment/InvestmentHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface InvestmentHeaderProps {
  onBack: () => void;
  submitting: boolean;
}

export const InvestmentHeader = ({
  onBack,
  submitting,
}: InvestmentHeaderProps) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.7}
      disabled={submitting}
    >
      <Text style={styles.backIcon}>←</Text>
    </TouchableOpacity>

    <Text style={styles.headerTitle}>Asset Allocation</Text>

    <View style={styles.headerSpacer} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#111816',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.2)',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 38,
  },
});

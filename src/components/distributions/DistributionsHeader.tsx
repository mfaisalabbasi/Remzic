// src/components/distributions/DistributionsHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const ArrowLeftIcon = ({ size = 20, color = '#F0FDF4' }) => (
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
    <Path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);

interface DistributionsHeaderProps {
  onBack: () => void;
}

export const DistributionsHeader = ({ onBack }: DistributionsHeaderProps) => (
  <View style={styles.header}>
    <TouchableOpacity
      style={styles.backButton}
      onPress={onBack}
      activeOpacity={0.75}
    >
      <ArrowLeftIcon size={18} color="#F0FDF4" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Yield & Distributions</Text>
    <View style={styles.headerSpacer} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.08)',
    backgroundColor: '#080C0A',
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#111816',
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
    textAlign: 'center',
    flex: 1,
  },
  headerSpacer: { width: 38 },
});

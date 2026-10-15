// src/components/portfolio/PortfolioHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
};

interface PortfolioHeaderProps {
  topInset: number;
  onPressNotifications: () => void;
}

export const PortfolioHeader = ({
  topInset,
  onPressNotifications,
}: PortfolioHeaderProps) => (
  <View style={[styles.header, { paddingTop: Math.max(topInset, 16) }]}>
    <View>
      <Text style={styles.headerSubtitle}>Wealth Dashboard</Text>
      <Text style={styles.headerTitle}>Portfolio Overview</Text>
    </View>
    <TouchableOpacity
      style={styles.notificationButton}
      activeOpacity={0.7}
      onPress={onPressNotifications}
    >
      <View style={styles.notificationDot} />
      <Svg
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke={PALETTE.textMain}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
      </Svg>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    color: PALETTE.textMuted,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  headerTitle: {
    color: PALETTE.textMain,
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: PALETTE.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PALETTE.accent,
    zIndex: 2,
  },
});

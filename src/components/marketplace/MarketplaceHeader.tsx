// src/components/marketplace/MarketplaceHeader.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  accentText: '#053121',
};

const PlusCircleIcon = ({ size = 18, color = PALETTE.accentText }) => (
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
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 8v8M8 12h8" />
  </Svg>
);

interface MarketplaceHeaderProps {
  topInset: number;
  onOpenListModal: () => void;
}

export const MarketplaceHeader = ({
  topInset,
  onOpenListModal,
}: MarketplaceHeaderProps) => (
  <View style={[styles.header, { paddingTop: Math.max(topInset, 16) }]}>
    <View>
      <Text style={styles.headerSubtitle}>Secondary Liquidity</Text>
      <Text style={styles.headerTitle}>RWA Marketplace</Text>
    </View>
    <TouchableOpacity
      style={styles.headerActionButton}
      onPress={onOpenListModal}
      activeOpacity={0.8}
    >
      <PlusCircleIcon size={16} color={PALETTE.accentText} />
      <Text style={styles.headerActionBtnText}>List Asset</Text>
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
  headerTitle: { color: PALETTE.textMain, fontSize: 22, fontWeight: '700' },
  headerActionButton: {
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    gap: 6,
  },
  headerActionBtnText: {
    color: PALETTE.accentText,
    fontSize: 12,
    fontWeight: '800',
  },
});

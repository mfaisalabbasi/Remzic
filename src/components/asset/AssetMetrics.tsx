// src/components/investment/AssetMetrics.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const PALETTE = {
  cardBg: '#111816',
  textMain: '#F9FAFB',
  textMuted: '#9CA3AF',
  accent: '#34D399',
  border: 'rgba(52, 211, 153, 0.15)',
};

const ActivityIcon = () => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={PALETTE.accent}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </Svg>
);
const ClockIcon = () => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={PALETTE.accent}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 6v6l4 2" />
  </Svg>
);
const ShieldIcon = () => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke={PALETTE.accent}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </Svg>
);

const MetricCard = ({
  iconType,
  label,
  value,
}: {
  iconType: string;
  label: string;
  value: string;
}) => (
  <View style={styles.metricCard}>
    <View style={styles.metricIconContainer}>
      {iconType === 'activity' && <ActivityIcon />}
      {iconType === 'clock' && <ClockIcon />}
      {iconType === 'shield' && <ShieldIcon />}
    </View>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue} numberOfLines={1}>
      {value}
    </Text>
  </View>
);

export const AssetMetrics = ({ property }: { property: any }) => (
  <View style={styles.metricsRow}>
    <MetricCard
      iconType="activity"
      label="Projected Yield"
      value={property.yield}
    />
    <MetricCard
      iconType="clock"
      label="Lock-up Period"
      value={property.investmentPeriod}
    />
    <MetricCard
      iconType="shield"
      label="Unit Price"
      value={`$${property.unitPrice}`}
    />
  </View>
);

const styles = StyleSheet.create({
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10,
    marginTop: 4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: PALETTE.cardBg,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.border,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    color: PALETTE.textMuted,
    fontSize: 9.5,
    textAlign: 'center',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metricValue: {
    color: PALETTE.textMain,
    fontSize: 13.5,
    fontWeight: '800',
    textAlign: 'center',
  },
});

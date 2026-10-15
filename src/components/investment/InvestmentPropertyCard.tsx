// src/components/investment/InvestmentPropertyCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InvestmentPropertyCardProps {
  property: {
    title: string;
    yieldRate: number;
    unitPrice: number;
  };
}

export const InvestmentPropertyCard = ({
  property,
}: InvestmentPropertyCardProps) => (
  <View style={styles.propertyMiniCard}>
    <View style={styles.propertyThumbPlaceholder}>
      <Text style={styles.propertyThumbTag}>🏢</Text>
    </View>

    <View style={styles.propertyInfo}>
      <Text style={styles.propertyName}>{property.title}</Text>

      <View style={styles.yieldBadgeRow}>
        <View style={styles.liveIndicatorDot} />

        <Text style={styles.propertyYield}>
          {(property.yieldRate * 100).toFixed(1)}% APY • ${property.unitPrice}
          /token
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  propertyMiniCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111816',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.18)',
    marginBottom: 24,
    gap: 14,
  },
  propertyThumbPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#18221F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyThumbTag: {
    fontSize: 22,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  yieldBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  propertyYield: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '600',
  },
});

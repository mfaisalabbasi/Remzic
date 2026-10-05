import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InvestmentPropertyCardProps {
  title: string;
  tokenPrice: number;
  yieldRate: number;
}

export default function InvestmentPropertyCard({
  title,
  tokenPrice,
  yieldRate,
}: InvestmentPropertyCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.label}>INVESTMENT PROPERTY</Text>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statLabel}>Token Price</Text>
            <Text style={styles.statValue}>${tokenPrice.toLocaleString()}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.stat}>
            <Text style={styles.statLabel}>Expected Yield</Text>
            <Text style={styles.yieldValue}>{yieldRate}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    overflow: 'hidden',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#6B7280',
    marginBottom: 8,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#102A24',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#102A24',
  },
  yieldValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B38A3D',
  },
  divider: {
    width: 1,
    height: 34,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 18,
  },
});

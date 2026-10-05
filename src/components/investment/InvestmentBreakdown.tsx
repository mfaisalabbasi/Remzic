import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InvestmentBreakdownProps {
  tokens: number;
  annualYield: number;
  availableUnits: number;
}

export default function InvestmentBreakdown({
  tokens,
  annualYield,
  availableUnits,
}: InvestmentBreakdownProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Investment Summary</Text>

      <View style={styles.card}>
        <Row
          label="Estimated Tokens"
          value={tokens.toLocaleString(undefined, {
            maximumFractionDigits: 4,
          })}
        />

        <Row
          label="Estimated Annual Yield"
          value={`$${annualYield.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}`}
          valueStyle={styles.yield}
        />

        <Row
          label="Available Units"
          value={availableUnits.toLocaleString()}
          last
        />
      </View>
    </View>
  );
}

interface RowProps {
  label: string;
  value: string;
  valueStyle?: object;
  last?: boolean;
}

function Row({ label, value, valueStyle, last }: RowProps) {
  return (
    <View style={[styles.row, !last && styles.borderBottom]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#102A24',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 16,
  },
  row: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  borderBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E9E7',
  },
  label: {
    fontSize: 12,
    color: '#6D7773',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#102A24',
  },
  yield: {
    color: '#B38A3D',
  },
});
